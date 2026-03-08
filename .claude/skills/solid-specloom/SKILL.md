---
name: solid-specloom
description: Use this skill when building SolidJS admin pages with specloom runtime. Covers FormState/ListState signal integration, FieldRenderer registry, AdminLayout, sidebar navigation, and page scaffolding patterns.
---

# solid-specloom Skill

SolidStart + specloom runtime で管理画面のページ・コンポーネントを作るときに使う skill。

## When to Activate

- specloom の FormState / ListState を Solid signal に統合するとき
- 管理画面のリスト / フォーム / 詳細ページを新規作成するとき
- FieldRenderer (renderer key → Solid component) を追加・修正するとき
- AppSidebar にナビゲーション項目を追加するとき
- AdminLayout のヘッダー・フッターを変更するとき
- specloom の ViewModel を Solid の reactive に接続する方法に迷うとき

## Project Structure

```
examples/solid-project/src/
├── app.tsx              # Router + AdminLayout
├── app.css              # Tailwind v4 @theme + sidebar CSS vars
├── admin/               # specloom runtime 統合層
│   ├── runtime.ts       # createAdminRuntime() — spec, ui, options
│   └── FieldRenderer.tsx # renderer key → component 解決
├── auth/                # 認証・データプロバイダ
│   ├── context.tsx      # createAuthContext<TTenant>()
│   ├── data-context.tsx # DataContextProvider + useDataProvider
│   ├── guard.tsx        # AuthGuard
│   ├── setup.ts         # Firebase + REST 組み立て
│   └── index.ts         # テナント定義
├── components/
│   ├── AdminLayout.tsx  # SidebarProvider + AppSidebar + SidebarInset
│   ├── AppSidebar.tsx   # ナビ定義 (mainNavItems)
│   └── ui/              # solid-ui (直接編集しない)
├── lib/
│   └── utils.ts         # cn()
└── routes/              # ファイルベースルーティング
```

## Core Principle

specloom runtime は framework 非依存で immutable state を返す。Solid 側は:

1. specloom の state を `createSignal` に格納
2. 変更は updater 関数で immutable に更新
3. ViewModel は `createMemo` で派生
4. I/O は `@specloom/data-provider` / `@specloom/auth-provider` に委譲
5. フィールドの表示制御 (visible/readonly/disabled) は spec 条件式 + context が評価済み。UI は ViewModel flags を読むだけ

## Runtime Initialization

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
```

`spec`, `ui`, `options` はアプリ起動時に 1 回組み立てて共有する。

## FormState Pattern

フォーム (create / edit) ページの基本パターン。

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

要点:
- `setForm(current => current.setValue(...))` — immutable 更新
- `form().validate()` — 次 state と result を返す
- `state.serialize()` — submit payload を生成

## ListState Pattern

一覧ページの基本パターン。

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
        onInput={(e) => setList((current) => current.setSearch(e.currentTarget.value))}
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

要点:
- `createListState` の `data` は空配列で初期化、server fetch 後に `setData`
- search / named filter / sort / selection は specloom 側で評価
- server paging / remote query は外側で持つ

## FieldRenderer Pattern

renderer key → Solid component の解決。

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

要点:
- `createUiResolver().field()` は component を返さない。renderer key + presentation を返す
- Solid 側で registry → `Dynamic` で描画
- 新しい widget は registry に追加するだけ

## Layout

### AdminLayout

```tsx
// src/components/AdminLayout.tsx
import type { JSX } from "solid-js";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "~/components/ui/sidebar";
import { Separator } from "~/components/ui/separator";
import { AppSidebar } from "~/components/AppSidebar";

export function AdminLayout(props: { children: JSX.Element }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header class="flex h-12 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger class="-ml-1" />
          <Separator orientation="vertical" class="mr-2 h-4" />
          <span class="text-sm font-medium text-muted-foreground">Specloom Admin</span>
        </header>
        <div class="flex-1 p-4">{props.children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
```

### AppSidebar — ナビ項目の追加

```tsx
// src/components/AppSidebar.tsx
const mainNavItems = [
  { title: "Dashboard", href: "/", icon: LayoutDashboardIcon },
  { title: "Users", href: "/users", icon: UsersIcon },
  // ↓ 新しいリソースを追加
  { title: "Orders", href: "/orders", icon: OrdersIcon },
];
```

`mainNavItems` 配列にエントリを追加するだけ。icon は SVG inline component。

## Page Scaffolding

新しいリソースページを作る手順:

1. `specs/` に TypeSpec で resource 定義 → compile → `src/admin/spec.json`
2. `src/routes/{resource}/index.tsx` — ListState ページ
3. `src/routes/{resource}/new.tsx` — FormState (create) ページ
4. `src/routes/{resource}/[id].tsx` — FormState (edit) or Show ページ
5. `src/components/AppSidebar.tsx` の `mainNavItems` に追加

## Conventions

- パスエイリアス: `~/` → `src/`
- UI primitives (`src/components/ui/`): solid-ui 生成。直接編集しない
- カスタムコンポーネント: `src/components/` に配置
- CSS 変数: `app.css` の `:root` / `.dark` で定義
- Tailwind v4: `@theme inline` で色・radius マッピング
- specloom state は immutable — `createStore` ではなく `createSignal` を使う
- form 変更は `setForm(current => current.setValue(name, value))`
- ViewModel は `createMemo(() => state().view())` で派生させる

## Checklist

新しい管理画面ページを作るとき:

- [ ] resource の TypeSpec 定義がある (or spec.json に含まれている)
- [ ] `createFormState` / `createListState` を `createSignal` に格納している
- [ ] 状態変更は immutable updater (`setForm(current => ...)`)
- [ ] ViewModel は `createMemo` で派生している
- [ ] I/O は `useDataProvider()` 経由
- [ ] FieldRenderer で描画している (手動 input ではなく)
- [ ] AppSidebar の `mainNavItems` にナビ項目を追加した
- [ ] ViewModel の flags (visible / readonly / disabled) を尊重している

## References

- [`docs/guides/solid/runtime.md`](/Volumes/SSD/projects/specloom/docs/guides/solid/runtime.md) — runtime 統合の詳細
- [`docs/guides/solid-integration.md`](/Volumes/SSD/projects/specloom/docs/guides/solid-integration.md) — auth/data provider 接続
- [`examples/solid-project/CLAUDE.md`](/Volumes/SSD/projects/specloom/examples/solid-project/CLAUDE.md) — プロジェクト固有の情報
