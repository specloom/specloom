# Action

Action は操作を定義します。

## 基本

アクションは View モデルのデコレータとして定義します（プロパティ不要）。

```typespec
@S.view(Post, "list")
@S.columns(["title", "status"])
// Page action
@S.action("create", #{ label: "新規作成", ui: #{ icon: "plus", variant: "primary" } })
// Row action
@S.rowAction("delete", #{ label: "削除", confirm: "本当に削除しますか？" })
model PostList {}
```

## @action

ページレベルのアクションを定義します。

```typespec
@S.action(id, options)
@S.action(id, options, DialogModel)  // ダイアログ付き
```

### options

| Property | Type | Description |
|----------|------|-------------|
| `label` | string | 表示ラベル |
| `allowedWhen` | string | 実行条件式 |
| `confirm` | string | 確認ダイアログメッセージ |
| `selection` | string | バルクアクション: `"selected"` or `"query"` |
| `ui` | `{ icon?, variant? }` | アイコンとスタイル |
| `dialog` | `{ title?, description? }` | ダイアログのタイトル/説明 |
| `api` | `{ path, method?, body?, params?, query? }` | APIエンドポイント設定 |

ID はユニークにしてください。

## @rowAction

行レベルのアクションを定義します（List View のみ）。

```typespec
@S.rowAction(id, options)
@S.rowAction(id, options, DialogModel)  // ダイアログ付き
```

options は `@action` と同じです（`selection` を除く）。

## バルクアクション（selection）

`selection` を options に含めます。

```typespec
// 選択した行に対して実行
@S.action("bulkDelete", #{ label: "一括削除", selection: "selected" })

// クエリ全体に対して実行（フィルター条件に一致する全件）
@S.action("exportAll", #{ label: "全件エクスポート", selection: "query" })
```

| 値 | JSON出力 | 説明 |
|-----|---------|------|
| `"selected"` | `selection: "selected"` | 選択した行に対して実行 |
| `"query"` | `selection: "query"` | フィルター条件に一致する全件に対して実行 |


## アクションの配置

| アクション種別 | デコレーター | 説明 | 使用場所 |
|---------------|-------------|------|---------|
| Page action | `@action(id, opts)` | 画面上部 | List, Form, Show |
| Bulk action | `@action(id, #{ selection: "selected" })` | 複数選択時 | List |
| Row action | `@rowAction(id, opts)` | 各行 | List |

## allowedWhen

options 内の `allowedWhen` で実行条件を指定します。

```typespec
@S.action("delete", #{ label: "削除", allowedWhen: "role == 'admin'" })
```

### 利用可能な式

```typespec
// ロールベース
allowedWhen: "role == 'admin'"

// 複合条件
allowedWhen: "role == 'admin' || role == 'editor'"

// 状態ベース
allowedWhen: "status == 'draft'"

// 所有者チェック
allowedWhen: "userId == authorId"
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

## confirm

options 内の `confirm` で確認ダイアログを表示します。

```typespec
@S.rowAction("delete", #{ label: "削除", confirm: "本当に削除しますか？" })
```

## dialog（ダイアログ付きアクション）

アクション実行前に入力を求めるダイアログを定義します。dialog 設定は options に、Model 参照は第3引数に渡します。

```typespec
model ArchiveDialog {
  @S.label("理由")
  @S.kind("longText")
  @S.required
  reason: string;
}

@S.rowAction("archive", #{
  label: "アーカイブ",
  dialog: #{ title: "アーカイブ理由" },
  api: #{ path: "/posts/:id/archive", method: "POST", body: #["reason"] }
}, ArchiveDialog)
```

## api

options 内の `api` で API エンドポイントを定義します。

```typespec
@S.rowAction("archive", #{
  label: "アーカイブ",
  api: #{ path: "/posts/:id/archive", method: "POST", body: #["reason"] }
})
```

## ui

options 内の `ui` でアイコンとスタイルを指定します。

```typespec
@S.action("create", #{ label: "新規作成", ui: #{ icon: "plus", variant: "primary" } })
@S.rowAction("delete", #{ label: "削除", ui: #{ icon: "trash", variant: "danger" } })
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
@S.action("create", #{ label: "新規作成" })
@S.rowAction("show", #{ label: "詳細" })
@S.rowAction("edit", #{ label: "編集" })
@S.rowAction("delete", #{ label: "削除", confirm: "本当に削除しますか？" })

// 一括操作
@S.action("bulkDelete", #{ label: "一括削除", selection: "selected" })
@S.action("bulkPublish", #{ label: "一括公開", selection: "selected" })
```

### 状態遷移アクション

```typespec
@S.action("publish", #{ label: "公開", allowedWhen: "status == 'draft'" })
@S.action("unpublish", #{ label: "非公開", allowedWhen: "status == 'published'" })
@S.action("archive", #{ label: "アーカイブ", allowedWhen: "status == 'published'" })
```

### カスタムアクション

```typespec
@S.rowAction("duplicate", #{ label: "複製" })
@S.action("export", #{ label: "エクスポート", ui: #{ icon: "download" } })
```

## 完全な例

```typespec
@S.view(Post, "list")
@S.columns(["title", "status", "author", "createdAt"])
@S.selection("multi")
// Page actions
@S.action("create", #{
  label: "新規作成",
  allowedWhen: "role == 'admin' || role == 'editor'",
  ui: #{ icon: "plus", variant: "primary" }
})
@S.action("export", #{ label: "エクスポート", ui: #{ icon: "download" } })
// Bulk actions
@S.action("bulkDelete", #{
  label: "一括削除",
  selection: "selected",
  allowedWhen: "role == 'admin'",
  confirm: "選択した項目を削除しますか？",
  ui: #{ icon: "trash", variant: "danger" }
})
@S.action("bulkPublish", #{
  label: "一括公開",
  selection: "selected",
  allowedWhen: "role == 'admin' || role == 'editor'"
})
// Row actions
@S.rowAction("show", #{ label: "詳細", ui: #{ icon: "eye" } })
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

## 次のステップ

- [Examples](./examples.md) - 完全な例
