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
@S.resource    // specloom デコレーター
@maxLength(100) // TypeSpec 標準デコレーター（プレフィックス不要）
```

TypeSpec 標準デコレーター（プレフィックス不要）: `@minLength`, `@maxLength`, `@pattern`, `@minItems`, `@maxItems`

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
  @maxLength(100)
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
model PostList {
  // Page action
  @S.action("create")
  @S.label("新規作成")
  @S.allowedWhen("role == 'admin' || role == 'editor'")
  @S.ui(#{ icon: "plus", variant: "primary" })
  create: never;

  // Row actions
  @S.rowAction("edit")
  @S.label("編集")
  @S.allowedWhen("role == 'admin' || role == 'editor'")
  @S.ui(#{ icon: "pencil" })
  edit: never;

  @S.rowAction("delete")
  @S.label("削除")
  @S.allowedWhen("role == 'admin'")
  @S.confirm("本当に削除しますか？")
  @S.ui(#{ icon: "trash", variant: "danger" })
  delete: never;
}

// Form View
@S.view(Post, "form")
@S.fields(["title", "status", "author"])
model PostForm {
  @S.action("save")
  @S.label("保存")
  @S.ui(#{ icon: "check", variant: "primary" })
  save: never;

  @S.action("cancel")
  @S.label("キャンセル")
  cancel: never;
}

// Show View
@S.view(Post, "show")
@S.fields(["title", "status", "author", "createdAt"])
model PostShow {
  @S.action("edit")
  @S.label("編集")
  @S.allowedWhen("role == 'admin' || role == 'editor'")
  @S.ui(#{ icon: "pencil" })
  edit: never;
}
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
- Row/Bulk action: `@rowAction` と `@requiresSelection`

以下は legacy alias（互換用途）です。

- `startsWith` / `endsWith` / `notIn` など camelCase 演算子
- `@hint` / `@inputHint`
- `@placement("row" | "bulk")`

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
