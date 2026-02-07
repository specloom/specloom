# Action

Action は操作を定義します。

## 基本

```typespec
// Page action (ページレベルのアクション)
@action("create")
@label("新規作成")
create: never;

// Row action (行レベルのアクション - List View のみ)
@rowAction("delete")
@label("削除")
delete: never;
```

## @action

ページレベルのアクション ID を指定します。

```typespec
@action("create")
@action("save")
@action("cancel")
@action("publish")
```

ID はユニークにしてください。

## @rowAction

行レベルのアクション ID を指定します（List View のみ）。

```typespec
@rowAction("edit")
@rowAction("delete")
@rowAction("show")
```

## @label

表示名を指定します。

```typespec
@action("delete")
@label("削除")
delete: never;
```

## @requiresSelection

バルクアクション（選択が必要なアクション）を指定します。

```typespec
// 選択した行に対して実行
@action("bulkDelete")
@requiresSelection("selected")
bulkDelete: never;

// クエリ全体に対して実行（フィルター条件に一致する全件）
@action("exportAll")
@requiresSelection("query")
exportAll: never;

// legacy alias（true は "selected" と同義）
@action("bulkDelete")
@requiresSelection(true)
bulkDelete: never;
```

| 値 | JSON出力 | 説明 |
|-----|---------|------|
| `"selected"` | `selection: "selected"` | 選択した行に対して実行 |
| `"query"` | `selection: "query"` | フィルター条件に一致する全件に対して実行 |
| `true` (legacy) | `selection: "selected"` | 旧記法（新規定義では非推奨） |

> **Note**: TypeSpec では `@requiresSelection`、JSON 出力では `selection` プロパティになります。

## 推奨記法（Canonical）

新規定義では次を推奨します。

- Page action: `@action("...")`
- Row action: `@rowAction("...")`
- Bulk action: `@action("...") + @requiresSelection("selected" | "query")`

`@placement("row" | "bulk")` は legacy alias です。既存 spec の互換用途のみを想定しています。

## アクションの配置

| アクション種別 | デコレーター | 説明 | 使用場所 |
|---------------|-------------|------|---------|
| Page action | `@action` | 画面上部 | List, Form, Show |
| Bulk action | `@action` + `@requiresSelection` | 複数選択時 | List |
| Row action | `@rowAction` | 各行 | List |

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
| >, >= | より大きい、以上（number / ISO日付文字列） |
| <, <= | より小さい、以下（number / ISO日付文字列） |
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

- `@confirm`（引数なし）は JSON で `confirm: true` を出力します。
- 実際の文言は spec では固定せず、i18n で解決します。
- 固定文言が必要な場合のみ `@confirm("...")` を使います。

## @dialog

アクション実行前に入力を求めるダイアログを定義します。

```typespec
model ArchiveDialog {
  @label("理由")
  @kind("longText")
  @required
  reason: string;
}

@rowAction("archive")
@label("アーカイブ")
@dialog(ArchiveDialog, #{ title: "アーカイブ理由" })
archive: never;
```

## @api

アクションの API エンドポイントを定義します。

```typespec
@rowAction("archive")
@api(#{
  path: "/posts/:id/archive",
  method: "POST",
  body: ["reason"]
})
archive: never;
```

## @ui

アイコンと種類を指定します。

```typespec
@action("create")
@label("新規作成")
@ui(#{ icon: "plus", variant: "primary" })
create: never;

@rowAction("delete")
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
@rowAction("show")
@rowAction("edit")
@rowAction("delete")

// 一括操作
@action("bulkDelete")
@requiresSelection("selected")

@action("bulkPublish")
@requiresSelection("selected")
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
@rowAction("duplicate")
@label("複製")
duplicate: never;

@action("export")
@label("エクスポート")
@ui(#{ icon: "download" })
export: never;
```

### ドロップダウン/メニューアクション

複数の操作を1つのボタンにまとめたい場合:

```typespec
@action("bulkStatus")
@label("ステータス変更")
@requiresSelection("selected")
@ui(#{ type: "menu" })
@options(#[
  #{ value: "draft", label: "下書きに変更" },
  #{ value: "published", label: "公開に変更" }
])
bulkStatus: never;
```

## 完全な例

```typespec
@view(Post, "list")
@columns(["title", "status", "author", "createdAt"])
@selection("multi")
model PostList {
  // Page actions
  @action("create")
  @label("新規作成")
  @allowedWhen("role == 'admin' || role == 'editor'")
  @ui(#{ icon: "plus", variant: "primary" })
  create: never;

  @action("export")
  @label("エクスポート")
  @ui(#{ icon: "download" })
  export: never;

  // Bulk actions
  @action("bulkDelete")
  @label("一括削除")
  @requiresSelection("selected")
  @allowedWhen("role == 'admin'")
  @confirm("選択した項目を削除しますか？")
  @ui(#{ icon: "trash", variant: "danger" })
  bulkDelete: never;

  @action("bulkPublish")
  @label("一括公開")
  @requiresSelection("selected")
  @allowedWhen("role == 'admin' || role == 'editor'")
  bulkPublish: never;

  // Row actions
  @rowAction("show")
  @label("詳細")
  @ui(#{ icon: "eye" })
  show: never;

  @rowAction("edit")
  @label("編集")
  @allowedWhen("role == 'admin' || role == 'editor'")
  @ui(#{ icon: "pencil" })
  edit: never;

  @rowAction("delete")
  @label("削除")
  @allowedWhen("role == 'admin'")
  @confirm("本当に削除しますか？")
  @ui(#{ icon: "trash", variant: "danger" })
  delete: never;
}
```

## 次のステップ

- [Examples](./examples.md) - 完全な例
