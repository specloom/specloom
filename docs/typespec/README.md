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

## クイックスタート

### 1. Resource を定義

```typespec
// specs/post.tsp
import "@specloom/typespec";

using Specloom;

@resource
@label("投稿")
model Post {
  @readonly
  id: string;

  @label("タイトル")
  @kind("text")
  @required
  @maxLength(100)
  title: string;

  @label("状態")
  @kind("enum")
  @ui(#{ hint: "badge", inputHint: "select" })
  @options(#[
    #{ value: "draft", label: "下書き" },
    #{ value: "published", label: "公開中" }
  ])
  status: string;

  @label("著者")
  @kind("relation")
  @relation(User, #{ labelField: "name" })
  @ui(#{ hint: "avatar", inputHint: "autocomplete", searchable: true })
  @required
  author: User;

  @label("作成日時")
  @kind("datetime")
  @readonly
  createdAt: utcDateTime;
}
```

### 2. View を定義

```typespec
// List View
@view(Post, "list")
@columns(["title", "status", "author", "createdAt"])
@searchable(["title"])
@defaultSort("createdAt", "desc")
@clickAction("show")
model PostList {
  @action("create")
  @label("新規作成")
  @placement("header")
  @allowedWhen("role == 'admin' || role == 'editor'")
  @ui(#{ icon: "plus", variant: "primary" })
  create: never;

  @action("edit")
  @label("編集")
  @placement("row")
  @allowedWhen("role == 'admin' || role == 'editor'")
  @ui(#{ icon: "pencil" })
  edit: never;

  @action("delete")
  @label("削除")
  @placement("row")
  @allowedWhen("role == 'admin'")
  @confirm("本当に削除しますか？")
  @ui(#{ icon: "trash", variant: "danger" })
  delete: never;
}

// Form View
@view(Post, "form")
@fields(["title", "status", "author"])
model PostForm {
  @action("save")
  @label("保存")
  @placement("header")
  @ui(#{ icon: "check", variant: "primary" })
  save: never;

  @action("cancel")
  @label("キャンセル")
  @placement("header")
  cancel: never;
}

// Show View
@view(Post, "show")
@fields(["title", "status", "author", "createdAt"])
model PostShow {
  @action("edit")
  @label("編集")
  @placement("header")
  @allowedWhen("role == 'admin' || role == 'editor'")
  @ui(#{ icon: "pencil" })
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

## ドキュメント

| ドキュメント | 内容 |
|-------------|------|
| [Resource](./resource.md) | Resource の定義方法 |
| [Field](./field.md) | フィールドの種類、@ui、@filter |
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
