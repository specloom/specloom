# ViewModel Spec

specloom が出力する評価済みの ViewModel 仕様です。

## 概要

```
TypeSpec → Definition Spec (JSON) → 評価 → ViewModel
```

| 段階 | 内容 | 例 |
|------|------|-----|
| TypeSpec | ユーザーが書く定義 | `@allowedWhen("role == 'admin'")` |
| Definition Spec | コンパイル結果 | `"allowedWhen": "role == 'admin'"` |
| ViewModel | 評価結果 | `"allowed": true` |

ViewModel の特徴：
- `allowedWhen` 式は評価済みの `allowed: boolean` になる
- 実データ（rows, values）を含む
- UI はロジックなしで描画するだけ
- pagination, sort は API 層の責務（ViewModel には含まない）

> **Note**: API レスポンス形式は [api.md](./api.md) を参照してください。

## Context

評価に使用するランタイム情報：

```json
{
  "user": {
    "id": "user-1",
    "name": "田中太郎"
  },
  "role": "editor",
  "permissions": ["post:read", "post:write"],
  "custom": {}
}
```

| フィールド | 型 | 説明 |
|-----------|-----|------|
| user | object | 現在のユーザー情報 |
| role | string | ユーザーのロール |
| permissions | string[] | 権限リスト |
| custom | object | アプリ固有のコンテキスト |

## List ViewModel

一覧画面の ViewModel：

```json
{
  "type": "list",
  "resource": "Post",
  "label": "投稿",
  "fields": [
    {
      "name": "title",
      "label": "タイトル",
      "kind": "text",
      "sortable": true
    },
    {
      "name": "status",
      "label": "状態",
      "kind": "enum",
      "ui": { "hint": "badge" },
      "options": [
        { "value": "draft", "label": "下書き" },
        { "value": "published", "label": "公開中" }
      ]
    },
    {
      "name": "author",
      "label": "著者",
      "kind": "relation",
      "ui": { "hint": "avatar" }
    },
    {
      "name": "createdAt",
      "label": "作成日時",
      "kind": "datetime",
      "sortable": true
    }
  ],
  "pageActions": [
    {
      "id": "create",
      "label": "新規作成",
      "allowed": true,
      "ui": { "icon": "plus", "variant": "primary" }
    }
  ],
  "rows": [
    {
      "id": "post-1",
      "values": {
        "title": "Hello World",
        "status": "published",
        "author": { "id": "user-1", "label": "田中太郎" },
        "createdAt": "2024-01-15T10:30:00Z"
      },
      "actions": [
        {
          "id": "edit",
          "label": "編集",
          "allowed": true,
          "ui": { "icon": "pencil" }
        },
        {
          "id": "delete",
          "label": "削除",
          "allowed": false,
          "confirm": "本当に削除しますか？",
          "ui": { "icon": "trash", "variant": "danger" }
        }
      ]
    }
  ],
  "filters": {
    "named": [
      { "id": "all", "label": "すべて", "active": true },
      { "id": "published", "label": "公開中", "active": false },
      { "id": "draft", "label": "下書き", "active": false }
    ]
  },
  "selection": {
    "mode": "multi",
    "selected": []
  },
  "search": {
    "fields": ["title", "body"],
    "query": ""
  }
}
```

### List ViewModel 構造

| フィールド | 型 | 説明 |
|-----------|-----|------|
| type | `"list"` | ビュータイプ |
| resource | string | リソース名 |
| label | string | リソースのラベル |
| fields | FieldVM[] | 表示カラムの定義 |
| pageActions | ActionVM[] | ページアクション（評価済み、選択不要） |
| rows | RowVM[] | データ行 |
| filters | Filters | フィルター状態 |
| selection | Selection | 選択状態 |
| search | Search | 検索状態 |

### RowVM

```json
{
  "id": "post-1",
  "values": {
    "title": "Hello World",
    "status": "published"
  },
  "actions": [
    { "id": "edit", "label": "編集", "allowed": true }
  ]
}
```

| フィールド | 型 | 説明 |
|-----------|-----|------|
| id | string | 行の識別子 |
| values | Record<string, any> | フィールド値 |
| actions | ActionVM[] | 行アクション（評価済み） |

### ActionVM

```json
{
  "id": "delete",
  "label": "削除",
  "allowed": false,
  "confirm": "本当に削除しますか？",
  "ui": { "icon": "trash", "variant": "danger" },
  "dialog": {
    "title": "削除理由",
    "fields": [{ "name": "reason", "label": "理由" }]
  },
  "api": {
    "path": "/posts/:id/delete",
    "method": "POST"
  }
}
```

| フィールド | 型 | 説明 |
|-----------|-----|------|
| id | string | アクション識別子 |
| label | string | 表示ラベル |
| allowed | boolean | **評価済み**の許可状態 |
| confirm? | string | 確認メッセージ |
| ui? | ActionUI | UI ヒント |
| dialog? | ActionDialog | 実行前ダイアログ定義 |
| api? | ActionApi | 実行API定義 |

## Show ViewModel

詳細画面の ViewModel：

```json
{
  "type": "show",
  "resource": "Post",
  "label": "投稿",
  "id": "post-1",
  "fields": [
    {
      "name": "title",
      "label": "タイトル",
      "kind": "text",
      "value": "Hello World"
    },
    {
      "name": "status",
      "label": "状態",
      "kind": "enum",
      "value": "published",
      "ui": { "hint": "badge" },
      "options": [
        { "value": "draft", "label": "下書き" },
        { "value": "published", "label": "公開中" }
      ]
    },
    {
      "name": "author",
      "label": "著者",
      "kind": "relation",
      "value": { "id": "user-1", "label": "田中太郎" },
      "ui": { "hint": "avatar" }
    },
    {
      "name": "createdAt",
      "label": "作成日時",
      "kind": "datetime",
      "value": "2024-01-15T10:30:00Z"
    }
  ],
  "actions": [
    {
      "id": "edit",
      "label": "編集",
      "allowed": true,
      "ui": { "icon": "pencil" }
    },
    {
      "id": "publish",
      "label": "公開",
      "allowed": false,
      "ui": { "icon": "globe", "variant": "primary" }
    }
  ]
}
```

### Show ViewModel 構造

| フィールド | 型 | 説明 |
|-----------|-----|------|
| type | `"show"` | ビュータイプ |
| resource | string | リソース名 |
| label | string | リソースのラベル |
| id | string | レコード ID |
| fields | ShowFieldVM[] | フィールド（値を含む） |
| actions | ActionVM[] | アクション（評価済み） |

### ShowFieldVM

```json
{
  "name": "title",
  "label": "タイトル",
  "kind": "text",
  "value": "Hello World"
}
```

| フィールド | 型 | 説明 |
|-----------|-----|------|
| name | string | フィールド名 |
| label | string | 表示ラベル |
| kind | string | フィールド種別 |
| value | any | フィールド値 |
| ui? | FieldUI | UI ヒント |
| options? | Option[] | enum の場合の選択肢 |

## Form ViewModel

フォーム画面の ViewModel：

```json
{
  "type": "form",
  "resource": "Post",
  "label": "投稿",
  "mode": "edit",
  "id": "post-1",
  "fields": [
    {
      "name": "title",
      "label": "タイトル",
      "kind": "text",
      "value": "Hello World",
      "required": true,
      "validation": {
        "maxLength": 100
      },
      "errors": []
    },
    {
      "name": "status",
      "label": "状態",
      "kind": "enum",
      "value": "published",
      "ui": { "inputHint": "select" },
      "options": [
        { "value": "draft", "label": "下書き" },
        { "value": "published", "label": "公開中" }
      ],
      "errors": []
    },
    {
      "name": "author",
      "label": "著者",
      "kind": "relation",
      "value": { "id": "user-1", "label": "田中太郎" },
      "required": true,
      "ui": { "inputHint": "autocomplete", "searchable": true },
      "errors": []
    }
  ],
  "actions": [
    {
      "id": "save",
      "label": "保存",
      "allowed": true,
      "ui": { "icon": "check", "variant": "primary" }
    },
    {
      "id": "cancel",
      "label": "キャンセル",
      "allowed": true
    }
  ],
  "isValid": true,
  "isDirty": false
}
```

### Form ViewModel 構造

| フィールド | 型 | 説明 |
|-----------|-----|------|
| type | `"form"` | ビュータイプ |
| resource | string | リソース名 |
| label | string | リソースのラベル |
| mode | `"create"` \| `"edit"` | フォームモード |
| id? | string | 編集時のレコード ID |
| fields | FormFieldVM[] | フィールド（入力状態を含む） |
| actions | ActionVM[] | アクション（評価済み） |
| isValid | boolean | バリデーション状態 |
| isDirty | boolean | 変更状態 |

### FormFieldVM

```json
{
  "name": "title",
  "label": "タイトル",
  "kind": "text",
  "value": "Hello World",
  "required": true,
  "readonly": false,
  "validation": {
    "maxLength": 100
  },
  "errors": ["100文字以内で入力してください"]
}
```

| フィールド | 型 | 説明 |
|-----------|-----|------|
| name | string | フィールド名 |
| label | string | 表示ラベル |
| kind | string | フィールド種別 |
| value | any | 現在値 |
| required | boolean | 必須フラグ |
| readonly | boolean | 読み取り専用フラグ |
| createOnly? | boolean | create 専用フィールド |
| validation? | Validation | バリデーションルール |
| errors | string[] | バリデーションエラー |
| ui? | FieldUI | UI ヒント |
| options? | Option[] | enum の場合の選択肢 |

## 共通型

### FieldUI

```json
{
  "hint": "badge",
  "inputHint": "select",
  "searchable": true,
  "icon": "tag",
  "variant": "subtle"
}
```

| フィールド | 型 | 説明 |
|-----------|-----|------|
| hint? | string | 表示ヒント（badge, avatar, etc） |
| inputHint? | string | 入力ヒント（select, autocomplete, etc） |
| searchable? | boolean | 検索可能フラグ |
| icon? | string | 補助アイコン |
| variant? | string | 表示バリアント |

### ActionUI

```json
{
  "icon": "trash",
  "variant": "danger"
}
```

| フィールド | 型 | 説明 |
|-----------|-----|------|
| icon? | string | アイコン名 |
| variant? | string | バリアント（primary, danger, etc） |

### Option

```json
{
  "value": "draft",
  "label": "下書き"
}
```

| フィールド | 型 | 説明 |
|-----------|-----|------|
| value | string | 値 |
| label | string | 表示ラベル |

### Validation

```json
{
  "required": true,
  "minLength": 1,
  "maxLength": 100,
  "min": 0,
  "max": 100,
  "pattern": "email",
  "match": "password",
  "minItems": 1,
  "maxItems": 5
}
```

## ViewModel Classes (OOP Style)

ViewModel データを操作するための OOP スタイルのクラスが提供されています。
すべてのクラスはイミュータブルで、setter メソッドは新しいインスタンスを返します。

### ListVM

```typescript
import { ListVM } from "specloom";

const list = new ListVM(listData);

// === Getters ===
list.fields;              // ListFieldVM[] - フィールド一覧
list.rows;                // RowVM[] - 行一覧
list.pageActions;         // ActionVM[] - ページアクション（選択不要）
list.bulkActions;         // ActionVM[] - バルクアクション（選択必須）
list.allowedPageActions;  // ActionVM[] - 許可されたページアクション
list.allowedBulkActions;  // ActionVM[] - 許可されたバルクアクション
list.selectedIds;         // string[] - 選択された行ID
list.selectedCount;       // number - 選択数
list.isSelectable;        // boolean - 選択可能か
list.isMultiSelect;       // boolean - 複数選択可能か
list.isAllSelected;       // boolean - 全選択状態か
list.isLoading;           // boolean - ローディング中か
list.isEmpty;             // boolean - 行が空か
list.error;               // string | undefined - エラーメッセージ
list.page;                // number - 現在のページ
list.totalPages;          // number - 総ページ数
list.total;               // number - 総件数
list.hasNextPage;         // boolean - 次ページがあるか
list.hasPrevPage;         // boolean - 前ページがあるか
list.searchQuery;         // string - 検索クエリ
list.searchFields;        // string[] - 検索対象フィールド
list.isSearchable;        // boolean - 検索可能か
list.filters;             // NamedFilter[] - フィルター一覧
list.hasFilters;          // boolean - フィルターがあるか
list.sorts;               // SortVM[] - ソート一覧

// === Methods ===
list.field("title");               // ListFieldVM | undefined
list.isSelected("row-1");          // boolean
list.isSorted("title");            // boolean
list.getSortDirection("title");    // "asc" | "desc" | undefined
list.sortIcon("title");            // "▲" | "▼" | "−"
list.formatCell(field, value);     // string
list.row("row-1");                 // RowVM | undefined
list.rowActions(row);              // ActionVM[]

// === Immutable Setters (メソッドチェーン対応) ===
const updated = list
  .setSearchQuery("hello")
  .toggleSort("title")
  .toggleFilter("active")
  .setPage(2)
  .select("row-1")
  .selectAll()
  .clearSelection();
```

### ShowVM

```typescript
import { ShowVM } from "specloom";

const show = new ShowVM(showData);

// === Getters ===
show.fields;              // ShowFieldVM[] - フィールド一覧
show.groups;              // FieldGroup[] - グループ一覧
show.actions;             // ActionVM[] - アクション一覧
show.allowedActions;      // ActionVM[] - 許可されたアクション
show.isLoading;           // boolean
show.error;               // string | undefined
show.label;               // string - ラベル
show.id;                  // string - レコードID

// === Methods ===
show.field("title");               // ShowFieldVM | undefined
show.value("title");               // unknown - フィールド値
show.formatValue(field, value);    // string - フォーマット済み値
show.fieldsInGroup("basic");       // ShowFieldVM[] - グループ内フィールド

// === Immutable Setters ===
const updated = show
  .setLoading(true)
  .setError("読み込みに失敗しました");
```

### FormVM

```typescript
import { FormVM } from "specloom";

const form = new FormVM(formData);

// === Getters ===
form.fields;              // FormFieldVM[] - フィールド一覧
form.visibleFields;       // FormFieldVM[] - 表示フィールド
form.requiredFields;      // FormFieldVM[] - 必須フィールド
form.readonlyFields;      // FormFieldVM[] - 読み取り専用フィールド
form.groups;              // FieldGroup[] - グループ一覧
form.actions;             // ActionVM[] - アクション一覧
form.allowedActions;      // ActionVM[] - 許可されたアクション
form.values;              // Record<string, unknown> - 全フィールド値
form.isValid;             // boolean - バリデーション状態
form.isDirty;             // boolean - 変更状態
form.canSubmit;           // boolean - 送信可能か
form.isLoading;           // boolean
form.isSubmitting;        // boolean - 送信中か
form.error;               // string | undefined
form.errors;              // { field: string, errors: string[] }[]
form.hasErrors;           // boolean
form.fieldsWithErrors;    // FormFieldVM[]
form.label;               // string
form.mode;                // "create" | "edit"
form.id;                  // string | undefined

// === Methods ===
form.field("title");               // FormFieldVM | undefined
form.value("title");               // unknown
form.fieldErrors("email");         // string[]
form.hasError("email");            // boolean
form.hint("title");                // string | undefined
form.placeholder("title");         // string | undefined
form.isVisible("title");           // boolean
form.isRequired("title");          // boolean
form.isReadonly("title");          // boolean
form.fieldsInGroup("basic");       // FormFieldVM[]

// === Immutable Setters (メソッドチェーン対応) ===
const updated = form
  .setValue("title", "New Title")
  .setValues({ title: "Title", content: "Content" })
  .setFieldErrors("email", ["必須です"])
  .setAllErrors({ email: ["必須です"], name: ["短すぎます"] })
  .clearErrors()
  .validate()
  .validateField("email")
  .setSubmitting(true)
  .setLoading(false)
  .setError("保存に失敗しました")
  .reset({ title: "初期値" })
  .markClean();
```

## UI 実装例

ViewModel を受け取って描画するだけ：

```tsx
// List View
function PostList({ vm }: { vm: ListViewModel }) {
  return (
    <div>
      <header>
        {vm.pageActions.map(action => (
          <button 
            key={action.id}
            disabled={!action.allowed}
          >
            {action.label}
          </button>
        ))}
      </header>
      
      <table>
        <thead>
          <tr>
            {vm.fields.map(field => (
              <th key={field.name}>{field.label}</th>
            ))}
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {vm.rows.map(row => (
            <tr key={row.id}>
              {vm.fields.map(field => (
                <td key={field.name}>
                  {renderValue(row.values[field.name], field)}
                </td>
              ))}
              <td>
                {row.actions.map(action => (
                  <button
                    key={action.id}
                    disabled={!action.allowed}
                  >
                    {action.label}
                  </button>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

### OOP スタイルでの実装例

```tsx
import { ListVM } from "specloom";

function PostList({ data }: { data: ListViewModel }) {
  const [vm, setVM] = useState(() => new ListVM(data));

  const handleSearch = (query: string) => {
    setVM(vm.setSearchQuery(query));
  };

  const handleSort = (field: string) => {
    setVM(vm.toggleSort(field));
  };

  const handleSelectAll = () => {
    setVM(vm.isAllSelected ? vm.clearSelection() : vm.selectAll());
  };

  return (
    <div>
      <input 
        value={vm.searchQuery}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="検索..."
      />
      
      <table>
        <thead>
          <tr>
            <th>
              <input 
                type="checkbox" 
                checked={vm.isAllSelected}
                onChange={handleSelectAll}
              />
            </th>
            {vm.fields.map(field => (
              <th 
                key={field.name}
                onClick={() => field.sortable && handleSort(field.name)}
              >
                {field.label} {vm.sortIcon(field.name)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {vm.rows.map(row => (
            <tr key={row.id} className={vm.isSelected(row.id) ? "selected" : ""}>
              <td>
                <input 
                  type="checkbox"
                  checked={vm.isSelected(row.id)}
                  onChange={() => setVM(vm.toggleSelect(row.id))}
                />
              </td>
              {vm.fields.map(field => (
                <td key={field.name}>
                  {vm.formatCell(field, row.values[field.name])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      
      <div>選択中: {vm.selectedCount}件</div>
    </div>
  );
}
```

**ポイント**: 
- UI に権限ロジックがない。`allowed` を見るだけ
- イミュータブルな操作でステート管理がシンプル
- メソッドチェーンで複数の操作を連続実行可能
