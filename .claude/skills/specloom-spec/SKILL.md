---
name: specloom-spec
description: Use this skill when creating or modifying admin UI specifications using TypeSpec. Provides patterns, decorators reference, and best practices for specloom spec definitions.
---

# specloom Spec Writing Skill

This skill helps you write admin UI specifications using TypeSpec for the specloom framework.

## When to Activate

- Creating new admin resources (models)
- Defining list/form/show views
- Adding actions with permissions
- Setting up field validations
- Configuring relations between resources
- Defining nested (inline-editable) child resources
- Creating named filters

## Project Setup

### Installing specloom (npm公開前)

```bash
# 方法1: pnpm link
cd /path/to/specloom/packages/specloom && pnpm link --global
cd /path/to/specloom/packages/typespec && pnpm link --global
cd /path/to/my-project
pnpm link --global specloom
pnpm link --global @specloom/typespec

# 方法2: ローカルパス参照 (package.json)
{
  "dependencies": {
    "specloom": "file:../specloom/packages/specloom",
    "@specloom/typespec": "file:../specloom/packages/typespec"
  }
}

# 方法3: npm公開後
pnpm add specloom @specloom/typespec
```

### Folder Structure

```
my-project/
├── specs/                      # TypeSpec定義
│   ├── main.tsp               # エントリポイント
│   ├── resources/             # リソース定義
│   │   ├── user.tsp
│   │   ├── post.tsp
│   │   └── tag.tsp
│   └── views/                 # ビュー定義（任意）
│       ├── user-views.tsp
│       └── post-views.tsp
├── src/
│   └── lib/
│       └── spec.json          # コンパイル出力
├── tspconfig.yaml
└── package.json
```

小規模なら1ファイルでもOK:
```
my-project/
├── specs/
│   └── main.tsp       # 全部ここに書く
├── src/
└── tspconfig.yaml
```

### main.tsp (複数ファイルの場合)

```typespec
import "@specloom/typespec";

import "./resources/user.tsp";
import "./resources/post.tsp";
import "./resources/tag.tsp";
```

### tspconfig.yaml

```yaml
emit:
  - "@specloom/typespec"
options:
  "@specloom/typespec":
    emitter-output-dir: "{project-root}/generated/specloom"
```

oyster-base での出力先: `specs/generated/specloom/{resource}.json`

## Namespace Convention

specloom デコレーターは `@S.` プレフィックス付きで使用します（`using S;` は TypeSpec の制約上使えません）。

すべてのデコレーターに `@S.` プレフィックスを付けます。

## Quick Reference

### 1. Resource Definition

```typespec
import "@specloom/typespec";

@S.resource
@S.label("投稿")
model Post {
  @S.readonly
  id: string;

  @S.label("タイトル")
  @S.kind("text")
  @S.required
  @S.maxLength(100)
  title: string;

  @S.label("本文")
  @S.kind("longText")
  @S.ui(#{ inputHint: "richtext" })
  body: string;

  @S.label("作成日時")
  @S.kind("datetime")
  @S.readonly
  createdAt: utcDateTime;
}
```

### 2. Enum Field with Options

```typespec
enum PostStatus {
  draft,
  published,
  archived,
}

@S.resource
model Post {
  @S.label("状態")
  @S.kind("enum")
  @S.options(#[
    #{ value: "draft", label: "下書き" },
    #{ value: "published", label: "公開中" },
    #{ value: "archived", label: "アーカイブ" }
  ])
  @S.ui(#{ hint: "badge", inputHint: "select" })
  status: PostStatus;
}
```

### 3. Relation Field

**TypeSpec の型が送信形式を決定します。**

- **型が Model（`User`）** → オブジェクトそのまま送信
- **型がスカラー（`int32`, `string`）** → `valueField`（デフォルト `"id"`）で値を抽出して送信

```typespec
@S.resource
@S.label("ユーザー")
model User {
  @S.readonly
  id: string;

  @S.label("名前")
  @S.required
  name: string;
}

@S.resource
model Post {
  // オブジェクト埋め込み（型が Model → オブジェクトそのまま送信）
  // 送信: { author: { id: "u1", name: "田中" } }
  @S.label("著者")
  @S.kind("relation")
  @S.relation(User, #{ labelField: "name" })
  @S.ui(#{ hint: "avatar", inputHint: "autocomplete" })
  @S.required
  author: User;

  // ID参照（型がスカラー → id を抽出して送信）
  // 送信: { prefecture_id: 13 }
  @S.label("都道府県")
  @S.kind("relation")
  @S.relation(Prefecture, #{ labelField: "name" })
  prefecture_id: int32;

  // valueField でID以外を抽出
  // 送信: { prefecture_code: "13" }
  @S.label("都道府県コード")
  @S.kind("relation")
  @S.relation(Prefecture, #{ labelField: "name", valueField: "code" })
  prefecture_code: string;

  // 複数 relation（Model配列 → オブジェクト配列）
  // 送信: { tags: [{ id: 1, name: "tech" }, ...] }
  @S.label("タグ")
  @S.kind("relation")
  @S.relation(Tag, #{ labelField: "name" })
  @S.minItems(1)
  @S.maxItems(5)
  tags: Tag[];

  // 複数 relation（スカラー配列 → ID配列）
  // 送信: { tag_ids: [1, 2, 3] }
  @S.label("タグID")
  @S.kind("relation")
  @S.relation(Tag, #{ labelField: "name" })
  tag_ids: int32[];
}
```

### 4. Nested Field (Inline Editing)

子リソースを親フォーム内でインライン編集する場合は `@nested` を使います。`@relation` が「既存レコードの参照」であるのに対し、`@nested` は「子レコードの所有・編集」を意味します。

```typespec
// 子モデル（@resource なしでも可）
model OrderItem {
  @S.label("商品")
  @S.kind("relation")
  @S.relation(Product, #{ labelField: "name" })
  @S.required
  product: Product;

  @S.label("数量")
  @S.kind("number")
  @S.required
  @S.min(1)
  quantity: int32;

  @S.label("単価")
  @S.kind("number")
  @S.readonly
  @S.ui(#{ format: "currency" })
  unitPrice: int32;
}

@S.resource
@S.label("注文")
model Order {
  @S.readonly id: string;

  // relation = 既存レコードを選ぶ
  @S.label("顧客")
  @S.kind("relation")
  @S.relation(Customer, #{ labelField: "name" })
  @S.ui(#{ inputHint: "autocomplete" })
  @S.required
  customer: Customer;

  // nested = 子レコードをインライン編集
  @S.label("注文明細")
  @S.nested(OrderItem, #{ min: 1, max: 50 })
  items: OrderItem[];
}

@S.view(Order, "form")
@S.fields(#["customer", "items"])
@S.action("save", #{ label: "保存" })
model OrderForm {}
```

`@nested` を付けると `@kind("nested")` は自動設定されます。編集フィールドは子の form view があればそれを使い、なければ `@readonly`/`@computed` を除外して自動判定します。

### 5. List View

```typespec
@S.view(Post, "list")
@S.columns(#["title", "status", "author", "createdAt"])
@S.searchable(#["title"])
@S.sortable(#["title", "createdAt"])
@S.defaultSort("createdAt", "desc")
@S.selection("multi")
@S.clickAction("show")
// Page action
@S.action("create", #{
  label: "新規作成",
  allowedWhen: "role == 'admin' || role == 'editor'",
  ui: #{ icon: "plus", variant: "primary" }
})
// Bulk action (requires selection)
@S.action("bulkDelete", #{
  label: "一括削除",
  selection: "selected",
  allowedWhen: "role == 'admin'",
  confirm: "選択した項目を削除しますか？"
})
// Row actions
@S.rowAction("edit", #{
  label: "編集",
  allowedWhen: "role == 'admin' || role == 'editor'",
  ui: #{ icon: "pencil" }
})
@S.rowAction("delete", #{
  label: "削除",
  allowedWhen: "role == 'admin'",
  confirm: "本当に削除しますか？",
  ui: #{ icon: "trash", variant: "danger" }
})
model PostList {}
```

### 6. Form View

```typespec
@S.view(Post, "form")
@S.fields(#["title", "body", "status", "author", "tags"])
@S.action("save", #{
  label: "保存",
  ui: #{ icon: "check", variant: "primary" }
})
@S.action("cancel", #{ label: "キャンセル" })
model PostForm {}
```

### 7. Show View

```typespec
@S.view(Post, "show")
@S.fields(#["title", "body", "status", "author", "tags", "createdAt"])
@S.action("edit", #{
  label: "編集",
  allowedWhen: "role == 'admin' || role == 'editor'",
  ui: #{ icon: "pencil" }
})
@S.action("delete", #{
  label: "削除",
  allowedWhen: "role == 'admin'",
  confirm: "本当に削除しますか？",
  ui: #{ icon: "trash", variant: "danger" }
})
model PostShow {}
```

### 8. Action with Dialog (Form Input)

ダイアログでユーザー入力を受け取るアクション（例: パスワード変更）を定義できます。

```typespec
// ダイアログのフィールドを定義するモデル
model ChangePasswordDialog {
  @S.label("新しいパスワード")
  @S.kind("password")
  @S.required
  @S.minLength(8)
  password: string;

  @S.label("パスワード（確認）")
  @S.kind("password")
  @S.required
  @S.minLength(8)
  @S.match("password")  // passwordフィールドと一致することを検証
  confirm_password: string;
}

@S.view(User, "show")
@S.fields(#["name", "email"])
@S.action("edit", #{ label: "編集" })
// ダイアログ付きアクション — dialog設定はoptionsに、Model参照は第4引数に渡す
@S.action("changePassword", #{
  label: "パスワード変更",
  ui: #{ icon: "key" },
  dialog: #{ title: "パスワード変更", description: "新しいパスワードを入力してください（8文字以上）" },
  api: #{ path: "/{id}/password", method: "PUT", body: #["password"] }
}, ChangePasswordDialog)
model UserShow {}
```

**出力されるJSON:**
```json
{
  "id": "changePassword",
  "label": "パスワード変更",
  "ui": { "icon": "key" },
  "dialog": {
    "title": "パスワード変更",
    "description": "新しいパスワードを入力してください（8文字以上）",
    "fields": [
      {
        "name": "password",
        "label": "新しいパスワード",
        "kind": "password",
        "validation": { "required": true, "minLength": 8 }
      },
      {
        "name": "confirm_password",
        "label": "パスワード（確認）",
        "kind": "password",
        "validation": { "required": true, "minLength": 8, "match": "password" }
      }
    ]
  },
  "api": {
    "path": "/{id}/password",
    "method": "PUT",
    "body": ["password"]
  }
}
```

## Decorator Reference

### Resource / Input

| Decorator | Target | Description |
|-----------|--------|-------------|
| `@entity(#{ ... })` | Model | Resource metadata: label, pluralLabel, titleField, pageSize |
| `@field(#{ ... })` | Property | Field UI metadata: label, visibility, readonly, placement, format |
| `@section(#{ ... })` | Model | Form/show section layout |
| `@rule(#{ ... })` | Model | Cross-field validation rule |

### List / Filter

| Decorator | Target | Description |
|-----------|--------|-------------|
| `@index(#{ ... })` | Model | List view config: columns, search, sort, selection, clickAction |
| `@filter(#["..."])` | Property | Filterable operators |
| `@namedFilter(#{ ... })` | Model | Predefined named filter |

### Field Behavior

| Decorator | Description |
|-----------|-------------|
| `@relation(Model, #{ ... })` | Relation field config |
| `@nested(Model, #{ ... })` | Nested inline editing config |
| `@options(#[])` | Static options |
| `@optionSource(#{ ... })` | Remote options source |
| `@computed` | Computed field |
| `@createOnly` | Editable only on create |
| `@visibleWhen(expr)` | Conditional visibility |
| `@requiredWhen(expr)` | Conditional required |
| `@readonlyWhen(expr)` | Conditional readonly |
| `@disabledWhen(expr)` | Conditional disabled |
| `@match(field)` | Field value must match another field |

### Action

| Decorator | Target | Description |
|-----------|--------|-------------|
| `@pageAction(#{ ... })` | Operation | Page-level action |
| `@rowAction(#{ ... })` | Operation | Row-level action |

### Validation

TypeSpec built-in validation decorators を使います。

- `@minValue`
- `@maxValue`
- `@minLength`
- `@maxLength`
- `@pattern`
- `@minItems`
- `@maxItems`

## UI Options Reference

### hint (Display)

| Value | Description | Use with |
|-------|-------------|----------|
| badge | Badge display | enum status |
| avatar | Avatar display | relation |
| link | Clickable link | url, email |
| code | Code display | text |
| progress | Progress bar | number |

### inputHint (Input)

| Value | Description | Use with |
|-------|-------------|----------|
| text | Single line | text |
| multiline | Multi-line | longText |
| richtext | Rich text editor | longText |
| markdown | Markdown editor | longText |
| select | Dropdown | enum |
| radio | Radio buttons | enum |
| autocomplete | Search select | relation, enum |
| modal | Modal select | relation |
| checkbox | Checkbox | boolean |
| switch | Toggle switch | boolean |
| date | Date picker | date |
| datetime | Datetime picker | datetime |
| file | File upload | file, image |
| password | Password input | password, text |

### format (Display Format)

| Value | Description |
|-------|-------------|
| currency | Currency (¥1,000) |
| percent | Percentage (50%) |
| bytes | File size (1.5 MB) |
| relative | Relative time (3日前) |

### Action UI

| Property | Values |
|----------|--------|
| icon | plus, pencil, trash, check, x, eye, globe, archive, download, upload |
| variant | primary, secondary, danger, warning, ghost |

## Expression Rules

```typespec
@visibleWhen("role == 'admin'")
@requiredWhen("status == 'published'")
@readonlyWhen("status == 'archived'")
@disabledWhen("record.ownerId != user.id")
```

### Available Variables

| Variable | Description |
|----------|-------------|
| role | User's role |
| user | Current user object |
| record | Current record object |
| [field] | Current record's field value |

## Named Filters

```typespec
@index(#{
  columns: #["title", "status", "createdAt"],
  namedFilters: #[
    #{ id: "all", label: "すべて", where: #{} },
    #{ id: "published", label: "公開中", where: #{ field: "status", operator: "eq", value: "published" } },
    #{ id: "recent", label: "最近", where: #{
      and: #[
        #{ field: "status", operator: "eq", value: "published" },
        #{ field: "createdAt", operator: "gte", value: #{ relative: "-7d" } }
      ]
    } }
  ]
})
model Post {}
```

### Filter Operators

| Operator | Description |
|----------|-------------|
| eq, ne | Equal, Not equal |
| gt, gte, lt, lte | Comparison |
| in, not_in | In array |
| contains, starts_with, ends_with | String match |
| has_any, has_all | Array contains |
| is_null | Null check |

### Special Values

| Value | Description |
|-------|-------------|
| `{ relative: "-7d" }` | 7 days ago |
| `{ relative: "-1m" }` | 1 month ago |
| `{ context: "user.id" }` | Current user ID |
| `{ context: "role" }` | Current role |

## Complete Example

```typespec
import "@specloom/typespec";

using Specloom;

@entity(#{
  label: "投稿",
  pluralLabel: "投稿一覧",
  titleField: "title"
})
@index(#{
  columns: #["title", "status", "createdAt"],
  searchable: #["title"],
  sortable: #["title", "createdAt"],
  selection: "multi",
  clickAction: "show"
})
model Post {
  @key
  @field(#{ label: "ID", list: false, show: true, form: false, readonly: true })
  id: string;

  @field(#{ label: "タイトル", list: true, show: true, form: true })
  @minLength(1)
  title: string;

  @field(#{ label: "状態", list: true, show: true, form: true })
  @options(#[
    #{ value: "draft", label: "下書き" },
    #{ value: "published", label: "公開中" }
  ])
  status: string;

  @field(#{ label: "公開URL", form: true })
  @requiredWhen("status == 'published'")
  publishUrl?: string;
}
```

## FormState Usage

### Submitting Form Data

`serialize()` は送信仕様に従って API-ready values を返します。

1. `readonly` / `visible: false` フィールドを除外
2. **relation (スカラー型)** → `valueField` で値を抽出（デフォルト `"id"`）
3. **relation (Model型)** → オブジェクトそのまま
4. **date** → ISO date string (`YYYY-MM-DD`)
5. **datetime** → ISO datetime string (`YYYY-MM-DDTHH:mm:ssZ`)

```typescript
import { createFormState, parseSpec } from "specloom"

const spec = parseSpec(jsonString)
let form = createFormState({
  spec,
  resource: "Post",
  mode: "create",
  context: { role: "admin" },
  values: initialValues,
})

// User edits
form = form
  .setValue("title", "Hello")
  .setValue("status", "draft")

const { state: validated, result } = form.validate()

if (result.valid) {
  const body = validated.serialize()
  await fetch('/api/posts', {
    method: 'POST',
    body: JSON.stringify(body),
  })
}
```

### Submit Value Conversion Rules

| フィールドの型 | 送信値 |
|---------------|--------|
| プリミティブ（string, int32, float64, boolean） | そのまま |
| date / datetime | ISO 文字列 |
| enum | 文字列そのまま |
| Model 型（relation） | オブジェクトそのまま |
| スカラー型（relation） | `valueField` で抽出したスカラー値 |
| Model[] 型（relation） | オブジェクト配列 |
| スカラー[] 型（relation） | `valueField` で抽出した配列 |
| nested | 子フィールドに同じルールを再帰適用 |

### Key FormState Methods

| Method | Description |
|--------|-------------|
| `snapshot()` | Current immutable state snapshot |
| `view()` | Derive `FormViewModel` |
| `setValue(name, value)` | Set field value and normalize input |
| `patch(values)` | Update multiple values |
| `validate()` | Run field + rule validation |
| `serialize()` | Build API-ready payload |
| `reset()` | Reset to initial values |

## Checklist

Before completing a spec:

- [ ] All resources have `@entity`
- [ ] Fields that should render have `@field`
- [ ] ID fields are hidden from form or readonly where needed
- [ ] Required constraints use built-in validation or `@requiredWhen`
- [ ] Enum-like fields have `@options` or `@optionSource`
- [ ] Relation fields use `@relation`
- [ ] Relation の TypeSpec 型がスカラー（`int32` 等）か Model かで送信形式が決まることを確認
- [ ] スカラー型 relation で `id` 以外を抽出する場合は `valueField` を指定
- [ ] Nested fields use `@nested(ChildModel)`
- [ ] List views use `@index`
- [ ] Bulk actions have `selection: "selected"` or `selection: "query"` in options
- [ ] Page actions use `@pageAction`, row actions use `@rowAction`
- [ ] Visibility / readonly / disabled rules use expression decorators
- [ ] Destructive actions have `confirmMessage`
- [ ] Filterable fields have `@filter`
- [ ] Actions with user input point to an input model
- [ ] Actions with API calls define `operation`
- [ ] Password confirm fields use `@match("password")`

## Compile

```bash
cd specs && pnpm exec tsp compile .
# 出力: specs/generated/specloom/{resource}.json
# 出力: specs/generated/openapi/openapi.yaml
```

フロント側は `@specs/` エイリアスで静的importし、`evaluateListView` / `evaluateFormView` / `evaluateShowView` でViewModel評価を行う。

---

**Remember**: The spec defines "what" the admin UI should do, not "how". UI frameworks render based on the evaluated ViewModel.
