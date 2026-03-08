# API Spec

specloom 本体は API server を実装しません。ここでは data API の推奨境界を示します。

## Boundary

```text
TypeSpec -> compiled spec JSON -> specloom runtime -> UI
Data API -> resource data and side effects
```

specloom が担うもの:

- spec の parse / validate
- runtime validation
- filter expression evaluation
- action request descriptor

Data API が担うもの:

- CRUD
- custom action の副作用
- persistence
- authorization enforcement

## Recommended Endpoints

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/api/{resource}` | list |
| `GET` | `/api/{resource}/{id}` | show |
| `POST` | `/api/{resource}` | create |
| `PUT` | `/api/{resource}/{id}` | update |
| `DELETE` | `/api/{resource}/{id}` | delete |
| `POST` | `/api/{resource}/{id}/actions/{actionId}` | row action |
| `POST` | `/api/{resource}/actions/{actionId}` | page/bulk action |

## Request/Response Shape

### List Response

```json
{
  "data": [{ "id": "post-1", "title": "Hello" }],
  "pagination": {
    "page": 1,
    "per_page": 20,
    "total": 150,
    "total_pages": 8
  }
}
```

### Single Response

```json
{
  "data": {
    "id": "post-1",
    "title": "Hello"
  }
}
```

### Error Response

```json
{
  "error": {
    "code": "validation_error",
    "message": "Invalid input",
    "details": [
      {
        "field": "title",
        "message": "Title is required"
      }
    ]
  }
}
```

## Runtime Helpers on the Server

server 側でも次をそのまま使えます。

```ts
import {
  buildActionRequest,
  validateForm,
  filterRecords,
  serializeResource,
} from "specloom";
```

例:

- 受信 payload を `validateForm` で検証
- query/preset 条件を `filterRecords` 相当の shape で扱う
- action metadata から `buildActionRequest` で実行 descriptor を作る
- relation / nested payload を `serializeResource` で正規化する
