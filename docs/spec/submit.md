# 送信仕様 (Submit Specification)

フォームの送信時に各フィールドの値がどのような形式で送信されるかを規定する。

## 基本ルール

**TypeSpec の型が送信形式を決定する。**

| フィールドの型 | 送信値 |
|---------------|--------|
| プリミティブ（string, int32, float64, boolean） | そのまま |
| date / datetime | ISO 文字列 |
| enum | 文字列そのまま |
| Model 型（relation） | オブジェクトそのまま |
| スカラー型（relation） | `valueField` で抽出したスカラー値 |
| Model[] 型（nested） | 子フィールドに同じルールを再帰適用した配列 |

## Relation フィールド

### 型によるスカラー / オブジェクトの判定

relation フィールドの送信形式は TypeSpec の型で決まる。

```typespec
// オブジェクト埋め込み（型が Model）
@S.relation(Prefecture, #{ labelField: "name" })
prefecture: Prefecture;
// 送信: { prefecture: { id: 1, name: "東京", code: "13" } }

// ID参照（型がスカラー）
@S.relation(Prefecture, #{ labelField: "name" })
prefecture_id: int32;
// 送信: { prefecture_id: 1 }
```

- 型が Model（`Prefecture`）→ オブジェクトそのまま送信
- 型がスカラー（`int32`, `string`）→ `valueField`（デフォルト `"id"`）で値を抽出して送信

### valueField

スカラー型の relation で、ID 以外のフィールドで参照したい場合に指定する。

```typespec
// デフォルト: id を抽出
@S.relation(Prefecture, #{ labelField: "name" })
prefecture_id: int32;
// 送信: { prefecture_id: 1 }

// code を抽出
@S.relation(Prefecture, #{ labelField: "name", valueField: "code" })
prefecture_code: string;
// 送信: { prefecture_code: "13" }
```

### 複数リレーション

```typespec
// オブジェクト配列
@S.relation(Tag, #{ labelField: "name" })
tags: Tag[];
// 送信: { tags: [{ id: 1, name: "tech" }, { id: 2, name: "react" }] }

// ID配列
@S.relation(Tag, #{ labelField: "name" })
tag_ids: int32[];
// 送信: { tag_ids: [1, 2, 3] }
```

## Nested フィールド

子フィールドにも同じ送信ルールを再帰的に適用する。

```typespec
model OrderItem {
  @S.relation(Product, #{ labelField: "name" })
  product_id: int32;      // スカラー → ID で送信

  @S.kind("number")
  quantity: int32;         // プリミティブ → そのまま
}

@S.nested(OrderItem, #{ min: 1 })
items: OrderItem[];
// 送信: { items: [{ product_id: 1, quantity: 2 }, { product_id: 3, quantity: 1 }] }
```

## Date / DateTime フィールド

```typespec
@S.kind("date")
birthDate: plainDate;
// 送信: { birthDate: "1990-05-15" }

@S.kind("datetime")
createdAt: utcDateTime;
// 送信: { createdAt: "2024-01-15T10:00:00Z" }
```

- `date` → ISO date string（`YYYY-MM-DD`）
- `datetime` → ISO datetime string（`YYYY-MM-DDTHH:mm:ssZ`）

## UI 側の動作

### セレクト / Autocomplete の候補取得

relation フィールドの候補取得は `DataProvider.getList(resource)` で行う。

```json
{
  "name": "prefecture_id",
  "type": "int32",
  "kind": "relation",
  "relation": {
    "resource": "Prefecture",
    "labelField": "name"
  }
}
```

1. `relation.resource` → `DataProvider.getList("Prefecture")` で候補一覧を取得
2. `relation.labelField` → セレクトの表示テキスト（`name`）
3. `relation.valueField` → セレクトの value（デフォルト `"id"`）
4. `type` → 選択後の保持形式（スカラー or オブジェクト）

### 候補取得の API 設定

API エンドポイントの設定は DataProvider の責務。spec には含めない。

```typescript
createRestDataProvider(http, {
  resources: {
    Prefecture: { endpoint: "/api/master/prefectures" },
  }
})
```

`@resource` なしの model でも relation の参照先として使える。DataProvider にエンドポイント設定があれば動作する。

## submittableValues の変換

`FormVM.submittableValues` が送信仕様に従って値を変換する。

```
入力: FormFieldVM[] （UI が保持する値）
  ↓
フィルタ: readonly / visible=false を除外
  ↓
変換:
  - relation (スカラー型) → valueField で抽出
  - relation (Model 型) → そのまま
  - date/datetime → ISO 文字列
  - nested → 子フィールドに再帰適用
  - その他 → そのまま
  ↓
出力: Record<string, unknown> （API に送信する値）
```

## 完全な例

```typespec
@S.resource
@S.label("店舗")
model Shop {
  @S.readonly id: string;

  @S.label("店名") @S.required
  name: string;

  // ID参照（スカラー）
  @S.label("都道府県")
  @S.kind("relation")
  @S.relation(Prefecture, #{ labelField: "name" })
  prefecture_id: int32;

  // オブジェクト埋め込み
  @S.label("オーナー")
  @S.kind("relation")
  @S.relation(User, #{ labelField: "name" })
  owner: User;

  // nested
  @S.label("営業時間")
  @S.nested(BusinessHour)
  hours: BusinessHour[];

  @S.label("開店日")
  @S.kind("date")
  openDate: plainDate;
}
```

送信データ:
```json
{
  "name": "渋谷店",
  "prefecture_id": 13,
  "owner": { "id": "u1", "name": "田中太郎" },
  "hours": [
    { "dayOfWeek": "mon", "open": "09:00", "close": "21:00" }
  ],
  "openDate": "2024-04-01"
}
```
