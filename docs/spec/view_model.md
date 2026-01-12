# ViewModel Spec

specloom が出力する評価済みの ViewModel 仕様です。

> **Note**: Definition Spec（v0.1.md）は静的な定義。ViewModel は runtime context で評価された結果です。
> API レスポンス形式は [api.md](./api.md) を参照してください。

## 概要

```
Definition Spec + Context (user, role, data) → ViewModel
```

ViewModel の特徴：
- `allowedWhen` は評価済みの `allowed: boolean` になる
- 実データ（rows, values）を含む
- UI はロジックなしで描画するだけ
- **pagination, sort は API 層の責務**（ViewModel には含まない）

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
  "headerActions": [
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
| headerActions | ActionVM[] | ヘッダーアクション（評価済み） |
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
  "ui": { "icon": "trash", "variant": "danger" }
}
```

| フィールド | 型 | 説明 |
|-----------|-----|------|
| id | string | アクション識別子 |
| label | string | 表示ラベル |
| allowed | boolean | **評価済み**の許可状態 |
| confirm? | string | 確認メッセージ |
| ui? | ActionUI | UI ヒント |

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
  "searchable": true
}
```

| フィールド | 型 | 説明 |
|-----------|-----|------|
| hint? | string | 表示ヒント（badge, avatar, etc） |
| inputHint? | string | 入力ヒント（select, autocomplete, etc） |
| searchable? | boolean | 検索可能フラグ |

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
  "minItems": 1,
  "maxItems": 5
}
```

## UI 実装例

ViewModel を受け取って描画するだけ：

```tsx
// List View
function PostList({ vm }: { vm: ListViewModel }) {
  return (
    <div>
      <header>
        {vm.headerActions.map(action => (
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

**ポイント**: UI に権限ロジックがない。`allowed` を見るだけ。
