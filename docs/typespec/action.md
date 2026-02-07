# Action

Action は操作を定義します。

## 基本

```typespec
// Page action (ページレベルのアクション)
@S.action("create")
@S.label("新規作成")
create: never;

// Row action (行レベルのアクション - List View のみ)
@S.rowAction("delete")
@S.label("削除")
delete: never;
```

## @action

ページレベルのアクション ID を指定します。

```typespec
@S.action("create")
@S.action("save")
@S.action("cancel")
@S.action("publish")
```

ID はユニークにしてください。

## @rowAction

行レベルのアクション ID を指定します（List View のみ）。

```typespec
@S.rowAction("edit")
@S.rowAction("delete")
@S.rowAction("show")
```

## @label

表示名を指定します。

```typespec
@S.action("delete")
@S.label("削除")
delete: never;
```

## @requiresSelection

バルクアクション（選択が必要なアクション）を指定します。

```typespec
// 選択した行に対して実行
@S.action("bulkDelete")
@S.requiresSelection("selected")
bulkDelete: never;

// クエリ全体に対して実行（フィルター条件に一致する全件）
@S.action("exportAll")
@S.requiresSelection("query")
exportAll: never;

// legacy alias（true は "selected" と同義）
@S.action("bulkDelete")
@S.requiresSelection(true)
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
@S.allowedWhen("role == 'admin'")

// 複合条件
@S.allowedWhen("role == 'admin' || role == 'editor'")

// 状態ベース
@S.allowedWhen("status == 'draft'")

// 所有者チェック
@S.allowedWhen("userId == authorId")
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
@S.confirm
delete: never;

// カスタムメッセージ
@S.confirm("本当に削除しますか？")
delete: never;
```

- `@confirm`（引数なし）は JSON で `confirm: true` を出力します。
- 実際の文言は spec では固定せず、i18n で解決します。
- 固定文言が必要な場合のみ `@confirm("...")` を使います。

## @dialog

アクション実行前に入力を求めるダイアログを定義します。

```typespec
model ArchiveDialog {
  @S.label("理由")
  @S.kind("longText")
  @S.required
  reason: string;
}

@S.rowAction("archive")
@S.label("アーカイブ")
@S.dialog(ArchiveDialog, #{ title: "アーカイブ理由" })
archive: never;
```

## @api

アクションの API エンドポイントを定義します。

```typespec
@S.rowAction("archive")
@S.api(#{
  path: "/posts/:id/archive",
  method: "POST",
  body: ["reason"]
})
archive: never;
```

## @ui

アイコンと種類を指定します。

```typespec
@S.action("create")
@S.label("新規作成")
@S.ui(#{ icon: "plus", variant: "primary" })
create: never;

@S.rowAction("delete")
@S.label("削除")
@S.ui(#{ icon: "trash", variant: "danger" })
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
@S.action("create")
@S.rowAction("show")
@S.rowAction("edit")
@S.rowAction("delete")

// 一括操作
@S.action("bulkDelete")
@S.requiresSelection("selected")

@S.action("bulkPublish")
@S.requiresSelection("selected")
```

### 状態遷移アクション

```typespec
@S.action("publish")
@S.allowedWhen("status == 'draft'")
publish: never;

@S.action("unpublish")
@S.allowedWhen("status == 'published'")
unpublish: never;

@S.action("archive")
@S.allowedWhen("status == 'published'")
archive: never;
```

### カスタムアクション

```typespec
@S.rowAction("duplicate")
@S.label("複製")
duplicate: never;

@S.action("export")
@S.label("エクスポート")
@S.ui(#{ icon: "download" })
export: never;
```

### ドロップダウン/メニューアクション

複数の操作を1つのボタンにまとめたい場合:

```typespec
@S.action("bulkStatus")
@S.label("ステータス変更")
@S.requiresSelection("selected")
@S.ui(#{ type: "menu" })
@S.options(#[
  #{ value: "draft", label: "下書きに変更" },
  #{ value: "published", label: "公開に変更" }
])
bulkStatus: never;
```

## 完全な例

```typespec
@S.view(Post, "list")
@S.columns(["title", "status", "author", "createdAt"])
@S.selection("multi")
model PostList {
  // Page actions
  @S.action("create")
  @S.label("新規作成")
  @S.allowedWhen("role == 'admin' || role == 'editor'")
  @S.ui(#{ icon: "plus", variant: "primary" })
  create: never;

  @S.action("export")
  @S.label("エクスポート")
  @S.ui(#{ icon: "download" })
  export: never;

  // Bulk actions
  @S.action("bulkDelete")
  @S.label("一括削除")
  @S.requiresSelection("selected")
  @S.allowedWhen("role == 'admin'")
  @S.confirm("選択した項目を削除しますか？")
  @S.ui(#{ icon: "trash", variant: "danger" })
  bulkDelete: never;

  @S.action("bulkPublish")
  @S.label("一括公開")
  @S.requiresSelection("selected")
  @S.allowedWhen("role == 'admin' || role == 'editor'")
  bulkPublish: never;

  // Row actions
  @S.rowAction("show")
  @S.label("詳細")
  @S.ui(#{ icon: "eye" })
  show: never;

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
```

## 次のステップ

- [Examples](./examples.md) - 完全な例
