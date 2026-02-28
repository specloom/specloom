# specloom TypeSpec Guide

TypeSpec で管理画面の spec を定義する方法を説明します。

## インストール

```bash
npm install @specloom/typespec --save-dev
```

## セットアップ

### tspconfig.yaml

```yaml
emit:
  - "@specloom/typespec"
options:
  "@specloom/typespec":
    output-dir: "./dist"
```

## Namespace

specloom のデコレーターは `@S.` プレフィックスで使用します。

```typespec
@S.resource
@S.maxLength(100)
```

すべてのデコレーターに `@S.` プレフィックスを付けます。

## クイックスタート

### 1. Resource を定義

```typespec
// specs/post.tsp
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

  @S.label("状態")
  @S.kind("enum")
  @S.ui(#{ hint: "badge", inputHint: "select" })
  @S.options(#[
    #{ value: "draft", label: "下書き" },
    #{ value: "published", label: "公開中" }
  ])
  status: string;

  @S.label("著者")
  @S.kind("relation")
  @S.relation(User, #{ labelField: "name" })
  @S.ui(#{ hint: "avatar", inputHint: "autocomplete", searchable: true })
  @S.required
  author: User;

  @S.label("作成日時")
  @S.kind("datetime")
  @S.readonly
  createdAt: utcDateTime;
}
```

### 2. View を定義

```typespec
// List View
@S.view(Post, "list")
@S.columns(["title", "status", "author", "createdAt"])
@S.searchable(["title"])
@S.defaultSort("createdAt", "desc")
@S.clickAction("show")
// Page action
@S.action("create", #{
  label: "新規作成",
  allowedWhen: "role == 'admin' || role == 'editor'",
  ui: #{ icon: "plus", variant: "primary" }
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

// Form View
@S.view(Post, "form")
@S.fields(["title", "status", "author"])
@S.action("save", #{ label: "保存", ui: #{ icon: "check", variant: "primary" } })
@S.action("cancel", #{ label: "キャンセル" })
model PostForm {}

// Show View
@S.view(Post, "show")
@S.fields(["title", "status", "author", "createdAt"])
@S.action("edit", #{
  label: "編集",
  allowedWhen: "role == 'admin' || role == 'editor'",
  ui: #{ icon: "pencil" }
})
model PostShow {}
```

### 3. コンパイル

```bash
npx tsp compile .
```

`dist/post.json` が生成されます。

## 基本構造

specloom の spec は 3 つの要素で構成されます。

| 要素 | 説明 |
|------|------|
| Resource | データの定義（フィールド、バリデーション、リレーション） |
| View | 画面の定義（list / form / show） |
| Action | 操作の定義（作成、編集、削除など） |

## 記法ポリシー

新規定義は canonical 記法を推奨します。

- Filter 演算子: snake_case（例: `starts_with`）
- UI 指定: `@ui(#{ ... })`
- Action: view-level `@action(id, opts)` / `@rowAction(id, opts)` （Model デコレータ）

以下は legacy alias（互換用途）です。

- `startsWith` / `endsWith` / `notIn` など camelCase 演算子
- `@hint` / `@inputHint`

## ドキュメント

| ドキュメント | 内容 |
|-------------|------|
| [Resource](./resource.md) | Resource の定義方法 |
| [Field](./field.md) | フィールドの種類、@ui、@filter、@visibleWhen、@requiredWhen |
| [Validation](./validation.md) | バリデーション |
| [Relation](./relation.md) | リレーション |
| [List View](./list.md) | 一覧画面、namedFilter |
| [Form View](./form.md) | 作成・編集画面 |
| [Show View](./show.md) | 詳細画面 |
| [Action](./action.md) | アクション |
| [Examples](./examples.md) | 完全な例 |

### Spec ドキュメント

| ドキュメント | 内容 |
|-------------|------|
| [Filter Spec](../spec/filter.md) | 高度なフィルター式（AND/OR/演算子） |
| [Philosophy](../spec/philosophy.md) | 設計思想、責務の分離 |

## TypeSpec を使わない場合

JSON を直接書くこともできます。[Spec v0.1](../spec/v0.1.md) を参照してください。
