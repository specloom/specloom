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
  // Single relation
  @S.label("著者")
  @S.kind("relation")
  @S.relation(User, #{ labelField: "name" })
  @S.ui(#{ hint: "avatar", inputHint: "autocomplete" })
  @S.required
  author: User;

  // Multiple relations
  @S.label("タグ")
  @S.kind("relation")
  @S.relation(Tag, #{ labelField: "name" })
  @S.minItems(1)
  @S.maxItems(5)
  tags: Tag[];
}
```

### 4. List View

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

### 5. Form View

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

### 6. Show View

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

### 7. Action with Dialog (Form Input)

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

### Resource Decorators

| Decorator | Target | Description |
|-----------|--------|-------------|
| `@resource` | Model | Mark as resource |
| `@label(string)` | Model, Property | Display label |

### Field Decorators

| Decorator | Description |
|-----------|-------------|
| `@kind(string)` | Field type: text, longText, number, boolean, date, datetime, enum, relation, file, image, password, email, tel, url |
| `@readonly` | Read-only field |
| `@computed` | Computed field (not in DB) |
| `@createOnly` | Editable only on create, readonly on edit |
| `@visibleWhen(expr)` | Conditional visibility (expression) |
| `@requiredWhen(expr)` | Conditional required (expression) |
| `@options([...])` | Enum options with labels |
| `@relation(Model, opts)` | Relation config with labelField |
| `@ui({...})` | UI hints |
| `@filter` | Make filterable |
| `@filter([ops])` | Filterable with specific operators |

### Validation Decorators

| Decorator | Description |
|-----------|-------------|
| `@S.required` | Required field |
| `@S.min(n)` | Minimum value |
| `@S.max(n)` | Maximum value |
| `@S.minLength(n)` | Minimum length |
| `@S.maxLength(n)` | Maximum length |
| `@S.pattern(string)` | Regex pattern |
| `@S.minItems(n)` | Minimum array items |
| `@S.maxItems(n)` | Maximum array items |
| `@S.match(field)` | Must match another field |

### View Decorators

| Decorator | Target | Description |
|-----------|--------|-------------|
| `@view(Model, type)` | Model | Define view (list, form, show) |
| `@columns([...])` | List | Columns to display |
| `@fields([...])` | Form, Show | Fields to display |
| `@searchable([...])` | List | Searchable fields |
| `@sortable([...])` | List | Sortable fields |
| `@defaultSort(field, order)` | List | Default sort |
| `@selection(mode)` | List | none, single, multi |
| `@clickAction(action)` | List | Row click action |
| `@namedFilters([...])` | List | Predefined filters (array) |
| `@namedFilter(id, label, filter)` | List | Add a named filter (singular) |

### Action Decorators (View-level)

アクションはViewモデルのデコレータとして定義します（プロパティ不要）。

| Decorator | Target | Description |
|-----------|--------|-------------|
| `@action(id, options)` | Model | Page-level action |
| `@action(id, options, DialogModel)` | Model | Page-level action with dialog |
| `@rowAction(id, options)` | Model | Row-level action (for list views) |
| `@rowAction(id, options, DialogModel)` | Model | Row-level action with dialog |

#### Action Options

| Property | Type | Description |
|----------|------|-------------|
| `label` | string | Display label |
| `allowedWhen` | string | Permission expression |
| `confirm` | string | Confirmation dialog message |
| `selection` | string | Bulk action: `"selected"` or `"query"` |
| `ui` | `{ icon?, variant? }` | Icon and style |
| `dialog` | `{ title?, description? }` | Dialog title/description |
| `api` | `{ path, method?, body?, params?, query? }` | API endpoint config |

### Validation Decorator (Dialog)

| Decorator | Description |
|-----------|-------------|
| `@match(field)` | Field validation: must match another field's value |

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

## Permission Expressions

```typespec
// Role-based
@allowedWhen("role == 'admin'")
@allowedWhen("role == 'admin' || role == 'editor'")

// State-based
@allowedWhen("status == 'draft'")

// Owner check
@allowedWhen("userId == authorId")
```

### Available Variables

| Variable | Description |
|----------|-------------|
| role | User's role |
| userId | User's ID |
| [field] | Record's field value |

## Named Filters

```typespec
@S.view(Post, "list")
@S.namedFilters(#[
  #{ id: "all", label: "すべて", filter: #{} },
  #{ id: "published", label: "公開中", filter: #{ field: "status", operator: "eq", value: "published" } },
  #{ id: "recent", label: "最近", filter: #{
    and: [
      #{ field: "status", operator: "eq", value: "published" },
      #{ field: "createdAt", operator: "gte", value: "@relative(-7d)" }
    ]
  } },
  #{ id: "mine", label: "自分の記事", filter: #{ field: "author.id", operator: "eq", value: "@context.user.id" } }
])
model PostList {}
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
| `@relative(-7d)` | 7 days ago |
| `@relative(-1m)` | 1 month ago |
| `@relative(startOfDay)` | Start of today |
| `@context.user.id` | Current user ID |
| `@context.role` | Current role |

## Complete Example

```typespec
import "@specloom/typespec";

// ============================================================
// Models (Resources)
// ============================================================

@S.resource
@S.label("ユーザー")
model User {
  @S.readonly
  id: string;

  @S.label("名前")
  @S.required
  name: string;

  @S.label("メール")
  @S.kind("email")
  @S.required
  email: string;
}

enum PostStatus {
  draft,
  published,
  archived,
}

@S.resource
@S.label("投稿")
model Post {
  @S.readonly
  id: string;

  @S.label("タイトル")
  @S.kind("text")
  @S.required
  @maxLength(100)
  @S.filter
  title: string;

  @S.label("本文")
  @S.kind("longText")
  @S.ui(#{ inputHint: "richtext" })
  body: string;

  @S.label("状態")
  @S.kind("enum")
  @S.options(#[
    #{ value: "draft", label: "下書き" },
    #{ value: "published", label: "公開中" },
    #{ value: "archived", label: "アーカイブ" }
  ])
  @S.ui(#{ hint: "badge", inputHint: "select" })
  @S.filter
  status: PostStatus;

  @S.label("著者")
  @S.kind("relation")
  @S.relation(User, #{ labelField: "name" })
  @S.ui(#{ hint: "avatar", inputHint: "autocomplete" })
  @S.required
  @S.filter
  author: User;

  @S.label("作成日時")
  @S.kind("datetime")
  @S.readonly
  @S.filter(#["gte", "lte"])
  createdAt: utcDateTime;
}

// ============================================================
// Views
// ============================================================

@S.view(Post, "list")
@S.columns(#["title", "status", "author", "createdAt"])
@S.searchable(#["title"])
@S.sortable(#["title", "createdAt"])
@S.defaultSort("createdAt", "desc")
@S.selection("multi")
@S.clickAction("show")
@S.namedFilters(#[
  #{ id: "all", label: "すべて", filter: #{} },
  #{ id: "published", label: "公開中", filter: #{ field: "status", operator: "eq", value: "published" } },
  #{ id: "draft", label: "下書き", filter: #{ field: "status", operator: "eq", value: "draft" } }
])
@S.action("create", #{
  label: "新規作成",
  allowedWhen: "role == 'admin' || role == 'editor'",
  ui: #{ icon: "plus", variant: "primary" }
})
@S.action("bulkDelete", #{
  label: "一括削除",
  selection: "selected",
  allowedWhen: "role == 'admin'",
  confirm: "選択した項目を削除しますか？"
})
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

@S.view(Post, "form")
@S.fields(#["title", "body", "status", "author"])
@S.action("save", #{
  label: "保存",
  ui: #{ icon: "check", variant: "primary" }
})
@S.action("cancel", #{ label: "キャンセル" })
model PostForm {}

@S.view(Post, "show")
@S.fields(#["title", "body", "status", "author", "createdAt"])
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

## FormVM Usage

### Submitting Form Data

`FormVM.submittableValues` returns only editable, visible field values (excludes `readonly` and `visible: false` fields):

```typescript
import { createAdmin, parseSpec } from 'specloom'

const spec = parseSpec(jsonString)
const admin = createAdmin(spec, { role: 'admin' })

// Create form ViewModel
const form = admin.form('Post', { mode: 'create', data: initialValues })

// User edits
const updated = form
  .setValue('title', 'Hello')
  .setValue('status', 'draft')
  .validate()

if (updated.canSubmit) {
  // submittableValues excludes readonly fields (id, createdAt, etc.)
  await fetch('/api/posts', {
    method: 'POST',
    body: JSON.stringify(updated.submittableValues),
  })
}

// All values (including readonly) - use `values` instead
const allValues = form.values
```

### Key FormVM Properties

| Property / Method | Description |
|-------------------|-------------|
| `values` | All field values as `{ name: value }` |
| `submittableValues` | Editable + visible field values only |
| `visibleFields` | Fields where `visible !== false` |
| `requiredFields` | Fields where `required === true` |
| `readonlyFields` | Fields where `readonly === true` |
| `canSubmit` | `isValid && !isSubmitting` |
| `validate()` | Run client-side validation, returns new FormVM |
| `setValue(name, value)` | Set field value, returns new FormVM (immutable) |

## Checklist

Before completing a spec:

- [ ] All resources have `@resource` and `@label`
- [ ] ID fields have `@readonly`
- [ ] Required fields have `@required`
- [ ] Enum fields have `@kind("enum")` and `@options`
- [ ] Relation fields have `@kind("relation")` and `@relation`
- [ ] List views have `@columns`, `@action(id, opts)` for page actions, `@rowAction(id, opts)` for row actions
- [ ] Bulk actions have `selection: "selected"` or `selection: "query"` in options
- [ ] Form views have `@fields` and save/cancel actions
- [ ] Actions have appropriate `allowedWhen` in options
- [ ] Destructive actions have `confirm` in options
- [ ] Filterable fields have `@filter`
- [ ] Actions with user input have `dialog` in options + DialogModel as 4th argument
- [ ] Actions with API calls have `api` in options
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
