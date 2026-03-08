# Nested

Nested は子リソースを親フォーム内でインライン編集するための仕組みです。

## 基本

```typespec
model OrderItem {
  @S.label("商品") @S.kind("relation") @S.relation(Product, #{ labelField: "name" }) @S.required
  product: Product;
  @S.label("数量") @S.kind("number") @S.required @S.min(1)
  quantity: int32;
}

@S.resource
model Order {
  @S.readonly id: string;

  @S.label("注文明細")
  @S.nested(OrderItem, #{ min: 1, max: 50 })
  items: OrderItem[];
}
```

## @nested

子リソースのモデルと制約を指定します。`@kind("nested")` は自動設定されるため明示不要です。

```typespec
@S.nested(OrderItem, #{ min: 1, max: 50 })
items: OrderItem[];
```

### オプション

| オプション | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| min | int32 | | 最小行数 |
| max | int32 | | 最大行数 |

```typespec
@S.nested(OrderItem)           // 制約なし
@S.nested(OrderItem, #{ min: 1 })        // 最低1行
@S.nested(OrderItem, #{ min: 1, max: 50 })  // 1〜50行
```

## Relation との違い

| | @relation | @nested |
|---|---|---|
| 意味 | 既存レコードを**参照** | 子レコードを**所有** |
| 操作 | 選択（select/autocomplete/modal） | 追加・編集・削除 |
| 子の独立性 | 独立した `@resource` | `@resource` は任意 |
| kind | `"relation"` | `"nested"`（自動設定） |

```typespec
// 参照（既存の顧客を選ぶ）
@S.kind("relation")
@S.relation(Customer, #{ labelField: "name" })
@S.ui(#{ inputHint: "autocomplete" })
customer: Customer;

// 所有（明細を親フォーム内で編集）
@S.nested(OrderItem, #{ min: 1, max: 50 })
items: OrderItem[];
```

## 子モデルの定義

子モデルは `@resource` なしの普通の model で定義します。

```typespec
model OrderItem {
  @S.label("商品")
  @S.kind("relation")
  @S.relation(Product, #{ labelField: "name" })
  @S.required
  product: Product;

  @S.label("数量")
  @S.kind("number")
  @S.required
  @S.min(1)
  quantity: int32;

  @S.label("単価")
  @S.kind("number")
  @S.readonly
  @S.ui(#{ format: "currency" })
  unitPrice: int32;

  @S.label("金額")
  @S.kind("number")
  @S.computed
  @S.ui(#{ format: "currency" })
  amount: int32;
}
```

子モデルに独立した管理画面（list/show）が必要な場合は `@resource` を付けることもできます。

## 編集フィールドの決定

インラインフォームに表示されるフィールドは以下の優先順で決まります：

1. 子リソースに `form` view があれば → その `@fields` を使う
2. なければ → 子モデルの全フィールドから `@readonly` / `@computed` を除外して自動判定

```typespec
// 方法1: form view で明示指定
@S.view(OrderItem, "form")
@S.fields(["product", "quantity"])
model OrderItemForm {}

// 方法2: 自動判定（@readonly/@computed 除外）
// → product, quantity が編集可能（unitPrice は readonly、amount は computed なので表示のみ）
```

## 完全な例

```typespec
@S.resource
@S.label("商品")
model Product {
  @S.readonly id: string;
  @S.label("商品名") name: string;
  @S.label("価格") @S.kind("number") @S.ui(#{ format: "currency" }) price: int32;
}

model OrderItem {
  @S.label("商品") @S.kind("relation") @S.relation(Product, #{ labelField: "name" }) @S.required
  product: Product;
  @S.label("数量") @S.kind("number") @S.required @S.min(1)
  quantity: int32;
  @S.label("単価") @S.kind("number") @S.readonly @S.ui(#{ format: "currency" })
  unitPrice: int32;
}

@S.resource
@S.label("注文")
model Order {
  @S.readonly id: string;

  @S.label("顧客")
  @S.kind("relation")
  @S.relation(Customer, #{ labelField: "name" })
  @S.ui(#{ inputHint: "autocomplete" })
  @S.required
  customer: Customer;

  @S.label("注文明細")
  @S.nested(OrderItem, #{ min: 1, max: 50 })
  items: OrderItem[];

  @S.label("合計")
  @S.kind("number")
  @S.computed
  @S.ui(#{ format: "currency" })
  total: int32;
}

@S.view(Order, "form")
@S.fields(["customer", "items"])
@S.action("save", #{ label: "保存", ui: #{ icon: "check", variant: "primary" } })
model OrderForm {}
```

UI はこのように描画します：

```
注文フォーム
├── 顧客: [検索して選択]
├── 注文明細:
│   ┌──────────┬──────┬──────┐
│   │ 商品     │ 数量 │ 単価 │
│   ├──────────┼──────┼──────┤
│   │ [選択]   │ [2]  │ ¥1000│  [削除]
│   │ [選択]   │ [1]  │ ¥2000│  [削除]
│   └──────────┴──────┴──────┘
│   [+ 明細を追加]
└── [保存]
```

## JSON spec 出力

```json
{
  "name": "items",
  "type": "OrderItem[]",
  "label": "注文明細",
  "kind": "nested",
  "nested": {
    "resource": "OrderItem",
    "min": 1,
    "max": 50
  }
}
```

## 次のステップ

- [Relation](./relation.md) - リレーション（参照）
- [Form View](./form.md) - フォーム画面
