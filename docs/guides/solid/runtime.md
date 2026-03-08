# SolidJS Runtime Integration

`specloom` runtime を SolidJS / SolidStart に統合する基本パターン。

`specloom` は framework 非依存です。Solid 側では次の 4 つをアプリ側で組み立てます。

1. compiled spec を `validateSpec()` して共有する
2. immutable な state helper を signal に載せる
3. `createUiResolver()` の renderer key を Solid component registry に結びつける
4. submit / options fetch は `@specloom/data-provider` などの I/O 層に委譲する

## 1. Runtime を初期化する

```ts
// src/admin/runtime.ts
import specJson from "~/admin/spec.json";
import type { DataProvider } from "@specloom/data-provider";
import {
  createOptionsResolver,
  createUiResolver,
  validateSpec,
} from "specloom";

export function createAdminRuntime(dataProvider: DataProvider) {
  const spec = validateSpec(specJson);

  const ui = createUiResolver({
    defaults: {
      fieldRenderers: {
        scalar: "text-input",
        enum: "select-input",
        "relation:one": "relation-picker",
        nested: "nested-table",
      },
      sectionRenderer: "form-section",
      columnRenderer: "text-column",
    },
  });

  const options = createOptionsResolver({
    spec,
    async fetcher({ resource, query }) {
      const result = await dataProvider.getList(resource, {
        pagination: { page: 1, perPage: 20 },
        sort: { field: "id", order: "asc" },
        filter: query ? { q: query } : {},
      });

      return result.data;
    },
  });

  return { spec, ui, options };
}

const admin = createAdminRuntime(dataProvider);
export const { spec, ui, options } = admin;
```

`spec`, `ui`, `options` はアプリ起動時に 1 回組み立てて共有して構いません。`specloom` の state は immutable なので、Solid の signal と相性が良いです。

## 2. FormState を signal に載せる

```tsx
// src/routes/users/new.tsx
import { createMemo, createSignal, For } from "solid-js";
import { createFormState } from "specloom";
import { useDataProvider } from "~/auth/data-context";
import { spec } from "~/admin/runtime";

export default function UserCreatePage() {
  const dataProvider = useDataProvider();
  const [form, setForm] = createSignal(
    createFormState({
      spec,
      resource: "User",
      mode: "create",
      context: { role: "admin" },
    }),
  );

  const vm = createMemo(() => form().view());

  const setValue = (name: string, value: unknown) => {
    setForm((current) => current.setValue(name, value));
  };

  const submit = async (event: SubmitEvent) => {
    event.preventDefault();

    const { state, result } = form().validate();
    setForm(state);
    if (!result.valid) return;

    await dataProvider.create("User", {
      data: state.serialize(),
    });
  };

  return (
    <form onSubmit={submit}>
      <For each={vm().sections}>
        {(section) => (
          <section>
            <h2>{section.label}</h2>

            <For each={section.fields}>
              {(field) => (
                <FieldRenderer
                  resource="User"
                  field={field}
                  onChange={setValue}
                />
              )}
            </For>
          </section>
        )}
      </For>

      <button type="submit">Save</button>
    </form>
  );
}
```

重要なのは、UI event ごとに `setForm(current => current.setValue(...))` のように次 state を返すことです。`FormState` は mutable store ではありません。

## 3. renderer key を Solid component registry に解決する

```tsx
// src/admin/FieldRenderer.tsx
import { createMemo } from "solid-js";
import { Dynamic } from "solid-js/web";
import type { FormFieldVM } from "specloom";
import { spec, ui } from "./runtime";

const fieldRegistry = {
  "text-input": TextInput,
  "select-input": SelectInput,
  "relation-picker": RelationPicker,
  "nested-table": NestedTable,
} as const;

interface Props {
  resource: string;
  field: FormFieldVM;
  onChange: (name: string, value: unknown) => void;
}

export function FieldRenderer(props: Props) {
  const source = createMemo(() => spec.resources[props.resource].fields[props.field.name]);
  const presentation = createMemo(() =>
    ui.field({
      resource: spec.resources[props.resource],
      field: source(),
      view: "form",
    }),
  );

  const Renderer = createMemo(
    () => fieldRegistry[presentation().renderer as keyof typeof fieldRegistry] ?? TextInput,
  );

  return (
    <Dynamic
      component={Renderer()}
      field={props.field}
      presentation={presentation()}
      onChange={(value: unknown) => props.onChange(props.field.name, value)}
    />
  );
}
```

`createUiResolver()` は component を返さず、`renderer`, `props`, `client`, `layout` などの presentation を返します。Solid 側で registry を持つのが前提です。

## 4. relation / options は OptionsResolver に寄せる

relation field や `optionsSource` を持つ field では、選択肢取得を UI component に直書きせず `createOptionsResolver()` に寄せます。

```tsx
// src/admin/RelationPicker.tsx
import { createResource, For } from "solid-js";
import type { FormFieldVM } from "specloom";
import { options, spec } from "./runtime";

interface Props {
  resource: string;
  field: FormFieldVM;
  value: unknown;
  onChange: (value: unknown) => void;
}

export function RelationPicker(props: Props) {
  const [resolved] = createResource(async () =>
    options.resolve({
      field: spec.resources[props.resource].fields[props.field.name],
      context: { role: "admin" },
    }),
  );

  return (
    <select
      value={String(props.value ?? "")}
      onInput={(event) => props.onChange(event.currentTarget.value)}
    >
      <option value="">Select...</option>
      <For each={resolved()?.items ?? []}>
        {(item) => <option value={String(item.value)}>{item.label}</option>}
      </For>
    </select>
  );
}
```

`options.resolve()` は static options, `optionsSource`, relation lookup を同じ入口で扱えます。

## 5. ListState は loaded rows の上に載せる

`createListState()` は、与えた `data` に対して search / named filter / sort / selection を評価します。サーバー paging や remote query 自体は外側で持ちます。

```tsx
// src/routes/users/index.tsx
import { createEffect, createMemo, createResource, createSignal, For } from "solid-js";
import { createListState } from "specloom";
import { useDataProvider } from "~/auth/data-context";
import { spec } from "~/admin/runtime";

export default function UserListPage() {
  const dataProvider = useDataProvider();
  const [list, setList] = createSignal(
    createListState({
      spec,
      resource: "User",
      context: { role: "admin" },
      data: [],
    }),
  );

  const [rows] = createResource(async () => {
    const result = await dataProvider.getList("User", {
      pagination: { page: 1, perPage: 50 },
      sort: { field: "name", order: "asc" },
      filter: {},
    });

    return result.data;
  });

  createEffect(() => {
    const value = rows();
    if (!value) return;
    setList((current) => current.setData(value));
  });

  const vm = createMemo(() => list().view());

  return (
    <>
      <input
        value={vm().search.query}
        onInput={(event) => setList((current) => current.setSearch(event.currentTarget.value))}
      />

      <table>
        <tbody>
          <For each={vm().rows}>
            {(row) => (
              <tr onClick={() => setList((current) => current.toggleSelect(row.id))}>
                <td>{String(row.values.name ?? "")}</td>
                <td>{String(row.values.email ?? "")}</td>
              </tr>
            )}
          </For>
        </tbody>
      </table>
    </>
  );
}
```

## 6. 推奨分離

- `specloom`
  spec 評価、state、validation、UI presentation
- `@specloom/data-provider`
  list / create / update / action の I/O
- `@specloom/auth-provider`
  認証、token 供給、権限チェック
- Solid component
  renderer registry、DOM event、routing、loading 表示

この分離にしておくと、View 層を Solid から別 renderer に差し替えても `specloom` 側の spec / state / validation はそのまま使えます。
