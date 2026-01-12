# API Spec

HTTP API のリクエスト/レスポンス仕様です。

> **Note**: 正式な型定義は [`packages/api/`](../../packages/api/) の TypeSpec を参照してください。
> OpenAPI は `pnpm build` で自動生成されます。

## 設計方針

### URL プレフィックス

ベース URL とプレフィックスはサーバー変数として設定可能です。

```
{baseUrl}/{prefix}/{resource}
```

| 変数 | デフォルト | 説明 |
|------|-----------|------|
| baseUrl | `http://localhost:3000` | サーバーのベース URL |
| prefix | `vm` | API のプレフィックス |

例：
- `/vm/posts` - デフォルト（ViewModel 用）
- `/api/posts` - REST API 用
- `/admin/posts` - 管理画面用

OpenAPI の `servers` セクションで定義されています。

### snake_case

API レスポンスはすべて snake_case を使用します。

```json
{
  "header_actions": [...],
  "per_page": 20,
  "total_pages": 8,
  "is_valid": true
}
```

### 責務の分離

```
TypeSpec (ユーザーまたは AI が書く)
        ↓ コンパイル
Definition Spec (JSON)
        ↓ 評価
ViewModel (評価結果)
        ↓ API 層で wrap
API Response (pagination, meta を追加)
```

- **ViewModel**: specloom が出力する評価結果（`allowed` 評価済み）
- **API Response**: ViewModel + pagination + sort + meta

### レスポンス構造

すべてのレスポンスは統一された構造を持ちます。

**成功時**:
```json
{
  "data": { ... },
  "pagination": { ... },  // List API のみ
  "sort": { ... },        // List API のみ
  "meta": {
    "timestamp": "2024-01-15T10:30:00Z"
  }
}
```

**エラー時**:
```json
{
  "error": {
    "code": "error_code",
    "message": "エラーメッセージ",
    "details": { ... }
  },
  "meta": {
    "timestamp": "2024-01-15T10:30:00Z"
  }
}
```

## エンドポイント一覧

| メソッド | パス | 説明 |
|---------|------|------|
| GET | `/api/{resource}` | 一覧取得 |
| POST | `/api/{resource}` | 新規作成 |
| GET | `/api/{resource}/{id}` | 詳細取得 |
| PUT | `/api/{resource}/{id}` | 更新 |
| DELETE | `/api/{resource}/{id}` | 削除 |
| GET | `/api/{resource}/new` | 新規作成フォーム取得 |
| GET | `/api/{resource}/{id}/edit` | 編集フォーム取得 |
| POST | `/api/{resource}/{id}/actions/{action_id}` | アクション実行 |
| POST | `/api/{resource}/bulk-actions/{action_id}` | 一括アクション実行 |

## List API

### リクエスト

```
GET /api/posts?page=1&per_page=20&sort=created_at&order=desc&filter=published
```

| パラメータ | 型 | デフォルト | 説明 |
|-----------|-----|-----------|------|
| page | integer | 1 | ページ番号 |
| per_page | integer | 20 | 1ページあたりの件数 |
| sort | string | - | ソートフィールド |
| order | string | "asc" | ソート順 ("asc" \| "desc") |
| search | string | - | 検索クエリ |
| filter | string | - | フィルター ID |

### レスポンス

```json
{
  "data": {
    "type": "list",
    "resource": "Post",
    "label": "投稿",
    "fields": [...],
    "header_actions": [...],
    "rows": [
      {
        "id": "post-1",
        "values": { "title": "Hello", "status": "published" },
        "actions": [
          { "id": "edit", "label": "編集", "allowed": true },
          { "id": "delete", "label": "削除", "allowed": false }
        ]
      }
    ],
    "filters": { "named": [...] },
    "selection": { "mode": "multi", "selected": [] },
    "search": { "fields": ["title"], "query": "" }
  },
  "pagination": {
    "page": 1,
    "per_page": 20,
    "total": 150,
    "total_pages": 8
  },
  "sort": {
    "field": "created_at",
    "order": "desc"
  },
  "meta": {
    "timestamp": "2024-01-15T10:30:00Z"
  }
}
```

## Show API

### リクエスト

```
GET /api/posts/post-1
```

### レスポンス

```json
{
  "data": {
    "type": "show",
    "resource": "Post",
    "label": "投稿",
    "id": "post-1",
    "fields": [
      { "name": "title", "label": "タイトル", "kind": "text", "value": "Hello" },
      { "name": "status", "label": "状態", "kind": "enum", "value": "published" }
    ],
    "actions": [
      { "id": "edit", "label": "編集", "allowed": true },
      { "id": "delete", "label": "削除", "allowed": false }
    ]
  },
  "meta": {
    "timestamp": "2024-01-15T10:30:00Z"
  }
}
```

## Form API

### リクエスト

```
GET /api/posts/new           # 新規作成フォーム
GET /api/posts/post-1/edit   # 編集フォーム
```

### レスポンス

```json
{
  "data": {
    "type": "form",
    "resource": "Post",
    "label": "投稿",
    "mode": "edit",
    "id": "post-1",
    "fields": [
      {
        "name": "title",
        "label": "タイトル",
        "kind": "text",
        "value": "Hello",
        "required": true,
        "readonly": false,
        "validation": { "max_length": 100 },
        "errors": []
      }
    ],
    "actions": [
      { "id": "save", "label": "保存", "allowed": true },
      { "id": "cancel", "label": "キャンセル", "allowed": true }
    ],
    "is_valid": true,
    "is_dirty": false
  },
  "meta": {
    "timestamp": "2024-01-15T10:30:00Z"
  }
}
```

### 保存リクエスト

```
POST /api/posts           # 新規作成
PUT  /api/posts/post-1    # 更新
```

```json
{
  "title": "Updated Title",
  "status": "published"
}
```

### 保存レスポンス（成功）

```json
{
  "data": {
    "id": "post-1",
    "title": "Updated Title",
    "status": "published"
  },
  "meta": {
    "timestamp": "2024-01-15T10:30:00Z"
  }
}
```

### 保存レスポンス（バリデーションエラー）

```json
{
  "error": {
    "code": "validation_error",
    "message": "入力内容に誤りがあります",
    "details": [
      { "field": "title", "code": "max_length", "message": "100文字以内で入力してください", "params": { "max": 100 } },
      { "field": "status", "code": "invalid_option", "message": "無効な値です" }
    ]
  },
  "meta": {
    "timestamp": "2024-01-15T10:30:00Z"
  }
}
```

## Action API

### リクエスト

```
POST /api/posts/post-1/actions/publish
```

```json
{
  "confirmed": true
}
```

### レスポンス（成功）

```json
{
  "data": {
    "success": true,
    "message": "公開しました"
  },
  "meta": {
    "timestamp": "2024-01-15T10:30:00Z"
  }
}
```

### レスポンス（権限エラー）

```json
{
  "error": {
    "code": "forbidden",
    "message": "この操作を実行する権限がありません"
  },
  "meta": {
    "timestamp": "2024-01-15T10:30:00Z"
  }
}
```

## Bulk Action API

### リクエスト

```
POST /api/posts/bulk-actions/delete
```

```json
{
  "ids": ["post-1", "post-2", "post-3"],
  "confirmed": true
}
```

### レスポンス

```json
{
  "data": {
    "success_count": 2,
    "failure_count": 1,
    "results": [
      { "id": "post-1", "success": true },
      { "id": "post-2", "success": true },
      { "id": "post-3", "success": false, "error": "権限がありません" }
    ]
  },
  "meta": {
    "timestamp": "2024-01-15T10:30:00Z"
  }
}
```

## エラーレスポンス

### 構造

```json
{
  "error": {
    "code": "validation_error",
    "message": "入力内容に誤りがあります",
    "details": [
      { "field": "title", "code": "max_length", "message": "100文字以内で入力してください", "params": { "max": 100 } },
      { "field": "tags[0].name", "code": "required", "message": "タグ名は必須です" },
      { "code": "business_rule", "message": "下書き状態では公開日を設定できません" }
    ]
  },
  "meta": {
    "timestamp": "2024-01-15T10:30:00Z"
  }
}
```

### ErrorDetail

| プロパティ | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| message | string | ✅ | 表示用エラーメッセージ |
| field | string | - | エラー位置（`"title"`, `"tags[0].name"` など） |
| code | string | - | エラー種別（i18n / プログラム判定用） |
| params | object | - | 制限値などのパラメータ（i18n 組み立て用） |

- `field`: JSON Path 形式でネストや配列インデックスを表現
  - `"title"` - 単純なフィールド
  - `"tags[0].name"` - 配列の要素のプロパティ
  - `"items[2]"` - 配列の3番目の要素
- `field` 省略時: フィールドに紐づかない全体エラー
- `params`: `{ "max": 100 }` などの値を i18n テンプレートに埋め込み可能

### エラーコード一覧

| コード | HTTP Status | 説明 | 対処法 |
|--------|-------------|------|--------|
| validation_error | 422 | バリデーションエラー | `details` のエラーを表示 |
| not_found | 404 | リソースが見つからない | リソースの存在を確認 |
| forbidden | 403 | 権限がない | ユーザーの権限を確認 |
| unauthorized | 401 | 認証が必要 | ログインを促す |
| conflict | 409 | 競合（楽観的ロック失敗など） | リロードして再試行 |
| internal_error | 500 | サーバーエラー | 管理者に連絡 |

### バリデーションエラーの details.code 例

| code | 説明 | params |
|------|------|--------|
| required | 必須 | - |
| max_length | 最大文字数超過 | `{ "max": 100 }` |
| min_length | 最小文字数未満 | `{ "min": 1 }` |
| max_value | 最大値超過 | `{ "max": 100 }` |
| min_value | 最小値未満 | `{ "min": 0 }` |
| pattern | パターン不一致 | `{ "pattern": "email" }` |
| invalid_option | 無効な選択肢 | `{ "options": ["draft", "published"] }` |
| max_items | 最大件数超過 | `{ "max": 5 }` |
| min_items | 最小件数未満 | `{ "min": 1 }` |
| unique | 重複 | - |
| business_rule | ビジネスルール違反 | - |

## 関連ドキュメント

- [TypeSpec Guide](../typespec/README.md) - TypeSpec での定義方法
- [ViewModel Spec](./view_model.md) - specloom が出力する ViewModel の仕様
- [Definition Spec](./v0.1.md) - コンパイルされた JSON の仕様
- [OpenAPI 定義](../../packages/api/) - API の TypeSpec 定義
