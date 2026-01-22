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
    output-dir: "./src/lib"
```

## Quick Reference

### 1. Resource Definition

```typespec
import "@specloom/typespec";

@Specloom.resource
@Specloom.label("投稿")
model Post {
  @Specloom.readonly
  id: string;

  @Specloom.label("タイトル")
  @Specloom.kind("text")
  @Specloom.required
  @Specloom.maxLength(100)
  title: string;

  @Specloom.label("本文")
  @Specloom.kind("longText")
  @Specloom.ui(#{ inputHint: "richtext" })
  body: string;

  @Specloom.label("作成日時")
  @Specloom.kind("datetime")
  @Specloom.readonly
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

@Specloom.resource
model Post {
  @Specloom.label("状態")
  @Specloom.kind("enum")
  @Specloom.options(#[
    #{ value: "draft", label: "下書き" },
    #{ value: "published", label: "公開中" },
    #{ value: "archived", label: "アーカイブ" }
  ])
  @Specloom.ui(#{ hint: "badge", inputHint: "select" })
  status: PostStatus;
}
```

### 3. Relation Field

```typespec
@Specloom.resource
@Specloom.label("ユーザー")
model User {
  @Specloom.readonly
  id: string;

  @Specloom.label("名前")
  @Specloom.required
  name: string;
}

@Specloom.resource
model Post {
  // Single relation
  @Specloom.label("著者")
  @Specloom.kind("relation")
  @Specloom.relation(User, #{ labelField: "name" })
  @Specloom.ui(#{ hint: "avatar", inputHint: "autocomplete" })
  @Specloom.required
  author: User;

  // Multiple relations
  @Specloom.label("タグ")
  @Specloom.kind("relation")
  @Specloom.relation(Tag, #{ labelField: "name" })
  @Specloom.minItems(1)
  @Specloom.maxItems(5)
  tags: Tag[];
}
```

### 4. List View

```typespec
@Specloom.view(Post, "list")
@Specloom.columns(#["title", "status", "author", "createdAt"])
@Specloom.searchable(#["title"])
@Specloom.sortable(#["title", "createdAt"])
@Specloom.defaultSort("createdAt", "desc")
@Specloom.selection("multi")
@Specloom.clickAction("show")
model PostList {
  // Page action (header)
  @Specloom.action("create")
  @Specloom.label("新規作成")
  @Specloom.allowedWhen("role == 'admin' || role == 'editor'")
  @Specloom.ui(#{ icon: "plus", variant: "primary" })
  create: never;

  // Bulk action (requires selection)
  @Specloom.action("bulkDelete")
  @Specloom.label("一括削除")
  @Specloom.requiresSelection(true)
  @Specloom.allowedWhen("role == 'admin'")
  @Specloom.confirm("選択した項目を削除しますか？")
  bulkDelete: never;

  // Row action
  @Specloom.rowAction("edit")
  @Specloom.label("編集")
  @Specloom.allowedWhen("role == 'admin' || role == 'editor'")
  @Specloom.ui(#{ icon: "pencil" })
  edit: never;

  // Row action with confirm
  @Specloom.rowAction("delete")
  @Specloom.label("削除")
  @Specloom.allowedWhen("role == 'admin'")
  @Specloom.confirm("本当に削除しますか？")
  @Specloom.ui(#{ icon: "trash", variant: "danger" })
  delete: never;
}
```

### 5. Form View

```typespec
@Specloom.view(Post, "form")
@Specloom.fields(#["title", "body", "status", "author", "tags"])
model PostForm {
  @Specloom.action("save")
  @Specloom.label("保存")
  @Specloom.ui(#{ icon: "check", variant: "primary" })
  save: never;

  @Specloom.action("cancel")
  @Specloom.label("キャンセル")
  cancel: never;
}
```

### 6. Show View

```typespec
@Specloom.view(Post, "show")
@Specloom.fields(#["title", "body", "status", "author", "tags", "createdAt"])
model PostShow {
  @Specloom.action("edit")
  @Specloom.label("編集")
  @Specloom.allowedWhen("role == 'admin' || role == 'editor'")
  @Specloom.ui(#{ icon: "pencil" })
  edit: never;

  @Specloom.action("delete")
  @Specloom.label("削除")
  @Specloom.allowedWhen("role == 'admin'")
  @Specloom.confirm("本当に削除しますか？")
  @Specloom.ui(#{ icon: "trash", variant: "danger" })
  delete: never;
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
| `@kind(string)` | Field type: text, longText, number, boolean, date, datetime, enum, relation, file, email, tel, url |
| `@readonly` | Read-only field |
| `@computed` | Computed field (not in DB) |
| `@options([...])` | Enum options with labels |
| `@relation(Model, opts)` | Relation config with labelField |
| `@ui({...})` | UI hints |
| `@filter` | Make filterable |
| `@filter([ops])` | Filterable with specific operators |

### Validation Decorators

| Decorator | Description |
|-----------|-------------|
| `@required` | Required field |
| `@minLength(n)` | Minimum length |
| `@maxLength(n)` | Maximum length |
| `@min(n)` | Minimum value |
| `@max(n)` | Maximum value |
| `@pattern(string)` | Regex pattern (email, url, tel, or custom) |
| `@minItems(n)` | Minimum array items |
| `@maxItems(n)` | Maximum array items |

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

### Action Decorators

| Decorator | Description |
|-----------|-------------|
| `@action(id)` | Page-level action ID |
| `@rowAction(id)` | Row-level action ID (for list views) |
| `@requiresSelection(req)` | Bulk action: `true`, `"selection"`, or `"query"` |
| `@allowedWhen(expr)` | Permission expression |
| `@confirm(msg)` | Confirmation dialog |
| `@ui({icon, variant})` | Icon and style |

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
@Specloom.view(Post, "list")
@Specloom.namedFilters(#[
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

@Specloom.resource
@Specloom.label("ユーザー")
model User {
  @Specloom.readonly
  id: string;

  @Specloom.label("名前")
  @Specloom.required
  name: string;

  @Specloom.label("メール")
  @Specloom.kind("email")
  @Specloom.required
  email: string;
}

enum PostStatus {
  draft,
  published,
  archived,
}

@Specloom.resource
@Specloom.label("投稿")
model Post {
  @Specloom.readonly
  id: string;

  @Specloom.label("タイトル")
  @Specloom.kind("text")
  @Specloom.required
  @Specloom.maxLength(100)
  @Specloom.filter
  title: string;

  @Specloom.label("本文")
  @Specloom.kind("longText")
  @Specloom.ui(#{ inputHint: "richtext" })
  body: string;

  @Specloom.label("状態")
  @Specloom.kind("enum")
  @Specloom.options(#[
    #{ value: "draft", label: "下書き" },
    #{ value: "published", label: "公開中" },
    #{ value: "archived", label: "アーカイブ" }
  ])
  @Specloom.ui(#{ hint: "badge", inputHint: "select" })
  @Specloom.filter
  status: PostStatus;

  @Specloom.label("著者")
  @Specloom.kind("relation")
  @Specloom.relation(User, #{ labelField: "name" })
  @Specloom.ui(#{ hint: "avatar", inputHint: "autocomplete" })
  @Specloom.required
  @Specloom.filter
  author: User;

  @Specloom.label("作成日時")
  @Specloom.kind("datetime")
  @Specloom.readonly
  @Specloom.filter(#["gte", "lte"])
  createdAt: utcDateTime;
}

// ============================================================
// Views
// ============================================================

@Specloom.view(Post, "list")
@Specloom.columns(#["title", "status", "author", "createdAt"])
@Specloom.searchable(#["title"])
@Specloom.sortable(#["title", "createdAt"])
@Specloom.defaultSort("createdAt", "desc")
@Specloom.selection("multi")
@Specloom.clickAction("show")
@Specloom.namedFilters(#[
  #{ id: "all", label: "すべて", filter: #{} },
  #{ id: "published", label: "公開中", filter: #{ field: "status", operator: "eq", value: "published" } },
  #{ id: "draft", label: "下書き", filter: #{ field: "status", operator: "eq", value: "draft" } }
])
model PostList {
  // Page action
  @Specloom.action("create")
  @Specloom.label("新規作成")
  @Specloom.allowedWhen("role == 'admin' || role == 'editor'")
  @Specloom.ui(#{ icon: "plus", variant: "primary" })
  create: never;

  // Bulk action
  @Specloom.action("bulkDelete")
  @Specloom.label("一括削除")
  @Specloom.requiresSelection(true)
  @Specloom.allowedWhen("role == 'admin'")
  @Specloom.confirm("選択した項目を削除しますか？")
  bulkDelete: never;

  // Row actions
  @Specloom.rowAction("edit")
  @Specloom.label("編集")
  @Specloom.allowedWhen("role == 'admin' || role == 'editor'")
  @Specloom.ui(#{ icon: "pencil" })
  edit: never;

  @Specloom.rowAction("delete")
  @Specloom.label("削除")
  @Specloom.allowedWhen("role == 'admin'")
  @Specloom.confirm("本当に削除しますか？")
  @Specloom.ui(#{ icon: "trash", variant: "danger" })
  delete: never;
}

@Specloom.view(Post, "form")
@Specloom.fields(#["title", "body", "status", "author"])
model PostForm {
  @Specloom.action("save")
  @Specloom.label("保存")
  @Specloom.ui(#{ icon: "check", variant: "primary" })
  save: never;

  @Specloom.action("cancel")
  @Specloom.label("キャンセル")
  cancel: never;
}

@Specloom.view(Post, "show")
@Specloom.fields(#["title", "body", "status", "author", "createdAt"])
model PostShow {
  @Specloom.action("edit")
  @Specloom.label("編集")
  @Specloom.allowedWhen("role == 'admin' || role == 'editor'")
  @Specloom.ui(#{ icon: "pencil" })
  edit: never;

  @Specloom.action("delete")
  @Specloom.label("削除")
  @Specloom.allowedWhen("role == 'admin'")
  @Specloom.confirm("本当に削除しますか？")
  @Specloom.ui(#{ icon: "trash", variant: "danger" })
  delete: never;
}
```

## Checklist

Before completing a spec:

- [ ] All resources have `@resource` and `@label`
- [ ] ID fields have `@readonly`
- [ ] Required fields have `@required`
- [ ] Enum fields have `@kind("enum")` and `@options`
- [ ] Relation fields have `@kind("relation")` and `@relation`
- [ ] List views have `@columns`, `@action` for page actions, `@rowAction` for row actions
- [ ] Bulk actions have `@requiresSelection(true)` or `@requiresSelection("selection")`
- [ ] Form views have `@fields` and save/cancel actions
- [ ] Actions have appropriate `@allowedWhen`
- [ ] Destructive actions have `@confirm`
- [ ] Filterable fields have `@filter`

## Compile

```bash
npx tsp compile .
```

Output: JSON spec in configured output directory.

---

**Remember**: The spec defines "what" the admin UI should do, not "how". UI frameworks render based on the evaluated ViewModel.
