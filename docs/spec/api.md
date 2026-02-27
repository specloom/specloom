# API Spec

HTTP でリソースデータを取得/更新するための仕様です。

> **Note**: [`packages/api/`](../../packages/api/) に TypeSpec 定義がありますが、
> このドキュメントは「ViewModel はローカル生成、API はデータ返却」の運用方針を優先します。

## 設計方針

### 責務の分離

```
TypeSpec (ユーザーまたは AI が書く)
        ↓ コンパイル
Definition Spec (JSON)
        ↓ アプリ側でローカル読み込み
Evaluator
        ↓
ViewModel (UI 描画用)

Data API
  - リソースデータの取得/更新
  - バルク操作/カスタムアクション
```

- **ViewModel** は API で直接返さず、`spec.json` とコンテキストから生成します
- **API** はデータアクセスと副作用処理（CRUD/Action）に専念します

### URL プレフィックス

ベース URL とプレフィックスはサーバー変数として設定可能です。

```
{baseUrl}/{prefix}/{resource}
```

| 変数 | デフォルト | 説明 |
|------|-----------|------|
| baseUrl | `http://localhost:3000` | サーバーのベース URL |
| prefix | `api` | データ API のプレフィックス |

例:
- `/api/posts` - デフォルト
- `/admin/posts` - 管理画面用に分離する場合

### snake_case

API レスポンスは snake_case を推奨します。

```json
{
  "per_page": 20,
  "total_pages": 8,
  "created_at": "2024-01-15T10:30:00Z"
}
```

## レスポンス構造

### 成功時（List）

```json
{
  "data": [{ "id": "post-1", "title": "Hello", "status": "published" }],
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

### 成功時（Single/Create/Update/Delete/Action）

```json
{
  "data": { "id": "post-1", "title": "Hello", "status": "published" },
  "meta": {
    "timestamp": "2024-01-15T10:30:00Z"
  }
}
```

### エラー時

```json
{
  "error": {
    "code": "validation_error",
    "message": "入力内容に誤りがあります",
    "details": [
      {
        "field": "title",
        "code": "max_length",
        "message": "100文字以内で入力してください",
        "params": { "max": 100 }
      }
    ]
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
| GET | `/api/{resource}/{id}` | 詳細取得 |
| POST | `/api/{resource}` | 新規作成 |
| PUT | `/api/{resource}/{id}` | 更新 |
| DELETE | `/api/{resource}/{id}` | 削除 |
| POST | `/api/{resource}/{id}/actions/{action_id}` | 単体アクション実行 |
| POST | `/api/{resource}/bulk-actions/{action_id}` | 一括アクション実行 |

## List API

### リクエスト

```
GET /api/posts?page=1&per_page=20&sort=created_at&order=desc&search=hello
```

| パラメータ | 型 | デフォルト | 説明 |
|-----------|-----|-----------|------|
| page | integer | 1 | ページ番号 |
| per_page | integer | 20 | 1ページあたりの件数 |
| sort | string | - | ソートフィールド |
| order | string | `asc` | ソート順 (`asc` \| `desc`) |
| search | string | - | 検索クエリ |
| filter | string | - | フィルター ID または実装固有の条件 |

> 実装によっては `_page` / `_limit` / `_sort` / `_order` を使う場合があります。

### レスポンス

```json
{
  "data": [
    {
      "id": "post-1",
      "title": "Hello",
      "status": "published",
      "author_id": "user-1",
      "created_at": "2024-01-15T10:30:00Z"
    }
  ],
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
    "id": "post-1",
    "title": "Hello",
    "body": "本文",
    "status": "published",
    "author_id": "user-1",
    "tag_ids": ["tag-1", "tag-2"],
    "created_at": "2024-01-15T10:30:00Z"
  },
  "meta": {
    "timestamp": "2024-01-15T10:30:00Z"
  }
}
```

## Create / Update API

### リクエスト

```
POST /api/posts
PUT  /api/posts/post-1
```

```json
{
  "title": "Updated Title",
  "status": "published"
}
```

### レスポンス（成功）

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

### レスポンス（バリデーションエラー）

```json
{
  "error": {
    "code": "validation_error",
    "message": "入力内容に誤りがあります",
    "details": [
      {
        "field": "title",
        "code": "max_length",
        "message": "100文字以内で入力してください",
        "params": { "max": 100 }
      },
      {
        "field": "status",
        "code": "invalid_option",
        "message": "無効な値です"
      }
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

## 関連ドキュメント

- [TypeSpec Guide](../typespec/README.md) - TypeSpec での定義方法
- [ViewModel Spec](./view_model.md) - specloom が出力する ViewModel の仕様
- [Definition Spec](./v0.1.md) - コンパイルされた JSON の仕様
- [OpenAPI 定義](../../packages/api/) - API の TypeSpec 定義
