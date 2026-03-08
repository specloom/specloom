# State

`specloom` の mutation surface は state helper です。

## APIs

- `createFormState`
- `createInputState`
- `createListState`

いずれも immutable です。`setValue()` や `setSearch()` は新しい state を返します。

## Form / Input State

```ts
import {
  createFormState,
  createInputState,
  validateSpec,
} from "specloom";

const spec = validateSpec(specJson);

let form = createFormState({
  spec,
  resource: "User",
  mode: "create",
  context: { role: "admin" },
});

form = form
  .setValue("name", "Alice")
  .setValue("email", "alice@example.com");

const vm = form.view();
const { state: validated, result } = form.validate();
const payload = validated.serialize();

const dialog = createInputState({
  spec,
  input: "ExportUsersInput",
  values: { format: "csv" },
});
```

### FormState Methods

- `snapshot()`
  現在 state を clone して返す
- `view()`
  `FormViewModel` を再生成する
- `getValue(name)`
  現在値を返す
- `setValue(name, rawValue)`
  normalize を通して値を更新する
- `patch(values)`
  複数 field をまとめて更新する
- `reset(values?)`
  初期値か指定値へ戻す
- `touch(name)`
  `touched` を更新する
- `setErrors(errors)`
  field error を外部から注入する
- `clearErrors(name?)`
  error を消す
- `validate()`
  `ValidationResult` と error 反映後の次 state を返す
- `serialize()`
  submit 仕様に従って payload を作る

### Snapshot Shape

```ts
type FormStateSnapshot = {
  spec: CompiledSpec;
  targetKind: "resource" | "input";
  targetName: string;
  mode: "create" | "edit";
  context: Context;
  values: Record<string, unknown>;
  errors: ValidationErrors;
  formErrors: string[];
  touched: Record<string, boolean>;
  dirty: Record<string, boolean>;
  initialValues: Record<string, unknown>;
};
```

## List State

```ts
import { createListState } from "specloom";

let list = createListState({
  spec,
  resource: "User",
  context: { role: "admin" },
  data: rows,
});

list = list
  .setSearch("alice")
  .setNamedFilter("active")
  .setSort("name", "asc")
  .toggleSelect("user-1");

const listVM = list.view();
```

### ListState Methods

- `snapshot()`
- `view()`
- `setData(data)`
- `setSearch(query)`
- `setNamedFilter(id | null)`
- `setSort(field, direction)`
- `toggleSelect(id)`
- `select(ids)`
- `clearSelection()`

### Current Behavior

- `view()` 内で named filter を適用します
- search は `resource.views.list.search.fields` に対して client-side 評価します
- sort は current state の `sort` を client-side で適用します
- selection は `ListViewModel.selection.selected` に反映されます

## Relationship to ViewModel

- state は mutation surface
- ViewModel は表示用 data

UI 実装では通常こう分けます。

1. event で state を更新する
2. `view()` で最新 VM を作る
3. `validate()` / `serialize()` を submit 時に使う
