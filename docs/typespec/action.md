# Action

Action は操作を定義します。

## 基本

```typespec
@action("delete")
@label("削除")
@placement("row")
delete: never;
```

## @action

アクションの ID を指定します。

```typespec
@action("create")
@action("edit")
@action("delete")
@action("publish")
@action("archive")
```

ID はユニークにしてください。

## @label

表示名を指定します。

```typespec
@action("delete")
@label("削除")
delete: never;
```

## @placement

配置を指定します。

```typespec
@placement("header")  // 画面上部
@placement("row")     // 各行
@placement("bulk")    // 複数選択時
```

| 値 | 説明 | 使用場所 |
|-----|------|---------|
| header | 画面上部 | List, Form, Show |
| row | 各行 | List |
| bulk | 複数選択時 | List |

## @allowedWhen

実行条件を指定します。

```typespec
// ロールベース
@allowedWhen("role == 'admin'")

// 複合条件
@allowedWhen("role == 'admin' || role == 'editor'")

// 状態ベース
@allowedWhen("status == 'draft'")

// 所有者チェック
@allowedWhen("userId == authorId")
```

### 利用可能な変数

| 変数 | 説明 |
|------|------|
| role | ユーザーのロール |
| userId | ユーザー ID |
| [field] | レコードのフィールド値 |

### 演算子

| 演算子 | 説明 |
|--------|------|
| == | 等しい |
| != | 等しくない |
| && | AND |
| \|\| | OR |

## @confirm

確認ダイアログを表示します。

```typespec
// デフォルトメッセージ
@confirm
delete: never;

// カスタムメッセージ
@confirm("本当に削除しますか？")
delete: never;
```

## @ui

アイコンと種類を指定します。

```typespec
@action("create")
@label("新規作成")
@ui(#{ icon: "plus", variant: "primary" })
create: never;

@action("delete")
@label("削除")
@ui(#{ icon: "trash", variant: "danger" })
delete: never;
```

### icon 一覧

| icon | 説明 |
|------|------|
| plus | 追加 |
| pencil | 編集 |
| trash | 削除 |
| check | 保存・完了 |
| x | キャンセル |
| eye | 詳細 |
| globe | 公開 |
| archive | アーカイブ |
| download | ダウンロード |
| upload | アップロード |

### variant 一覧

| variant | 説明 | 用途 |
|---------|------|------|
| primary | 主要 | 保存、作成 |
| secondary | 補助 | キャンセル |
| danger | 危険 | 削除 |
| warning | 警告 | アーカイブ |
| ghost | 控えめ | 詳細リンク |

## アクションの種類

### 標準アクション

```typespec
// CRUD
@action("create")
@action("show")
@action("edit")
@action("delete")

// 一括操作
@action("bulkDelete")
@action("bulkPublish")
```

### 状態遷移アクション

```typespec
@action("publish")
@allowedWhen("status == 'draft'")
publish: never;

@action("unpublish")
@allowedWhen("status == 'published'")
unpublish: never;

@action("archive")
@allowedWhen("status == 'published'")
archive: never;
```

### カスタムアクション

```typespec
@action("duplicate")
@label("複製")
@placement("row")
duplicate: never;

@action("export")
@label("エクスポート")
@placement("header")
@ui(#{ icon: "download" })
export: never;
```

## 完全な例

```typespec
@view(Post, "list")
@columns(["title", "status", "author", "createdAt"])
@selection("multi")
model PostList {
  // Header
  @action("create")
  @label("新規作成")
  @placement("header")
  @allowedWhen("role == 'admin' || role == 'editor'")
  @ui(#{ icon: "plus", variant: "primary" })
  create: never;

  @action("export")
  @label("エクスポート")
  @placement("header")
  @ui(#{ icon: "download" })
  export: never;

  // Row
  @action("show")
  @label("詳細")
  @placement("row")
  @ui(#{ icon: "eye" })
  show: never;

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

  // Bulk
  @action("bulkDelete")
  @label("一括削除")
  @placement("bulk")
  @allowedWhen("role == 'admin'")
  @confirm("選択した項目を削除しますか？")
  @ui(#{ icon: "trash", variant: "danger" })
  bulkDelete: never;

  @action("bulkPublish")
  @label("一括公開")
  @placement("bulk")
  @allowedWhen("role == 'admin' || role == 'editor'")
  bulkPublish: never;
}
```

## 次のステップ

- [Examples](./examples.md) - 完全な例
