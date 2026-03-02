import "./common.tsp";

// ============================================================
// 注文管理
// 網羅: @nested (min/max), @kind("currency"/"percent"/"json"),
//       @ui(format: "currency"/"decimal"/"bytes"/"duration"),
//       @computed, dialog action + @api (POST/PATCH/DELETE),
//       bulk action (selection: "selected"/"query"),
//       @confirm(true) (デフォルトメッセージ),
//       @selection("multi"), @clickAction,
//       @namedFilters (複合 AND/OR/NOT),
//       relation スカラー配列 + valueField,
//       file upload
// ============================================================

enum OrderStatus {
  pending,
  confirmed,
  processing,
  shipped,
  delivered,
  cancelled,
  refunded,
}

enum PaymentMethod {
  credit_card,
  bank_transfer,
  cash_on_delivery,
}

// ============================================================
// 注文明細（nested 子リソース）
// ============================================================

@S.resource
@S.label("注文明細")
model OrderItem {
  // relation: スカラー型 → Product の ID を抽出
  @S.label("商品")
  @S.kind("relation")
  @S.relation(Product, #{ labelField: "name", searchable: true })
  @S.required
  product_id: string;

  @S.label("数量")
  @S.kind("number")
  @S.required
  @S.min(1)
  @S.max(9999)
  quantity: int32;

  @S.label("単価")
  @S.kind("currency")
  @S.readonly
  @S.ui(#{ format: "currency" })
  unitPrice: int32;

  @S.label("小計")
  @S.kind("currency")
  @S.readonly
  @S.computed
  @S.ui(#{ format: "currency" })
  subtotal: int32;

  @S.label("割引率")
  @S.kind("percent")
  @S.min(0)
  @S.max(100)
  @S.ui(#{ format: "percent" })
  discountRate: float64;

  @S.label("メモ")
  @S.kind("text")
  @S.maxLength(200)
  note: string;
}

// ============================================================
// Dialog: キャンセル理由
// ============================================================

model CancelOrderDialog {
  @S.label("キャンセル理由")
  @S.kind("enum")
  @S.required
  @S.options(#[
    #{ value: "customer_request", label: "お客様都合" },
    #{ value: "out_of_stock", label: "在庫切れ" },
    #{ value: "payment_failed", label: "決済失敗" },
    #{ value: "other", label: "その他" }
  ])
  reason: string;

  @S.label("詳細")
  @S.kind("longText")
  @S.maxLength(500)
  @S.requiredWhen("reason == 'other'")
  detail: string;
}

// ============================================================
// Dialog: 配送情報更新
// ============================================================

model UpdateShippingDialog {
  @S.label("配送業者")
  @S.kind("text")
  @S.required
  carrier: string;

  @S.label("追跡番号")
  @S.kind("text")
  @S.required
  @S.pattern("alphanumeric")
  trackingNumber: string;

  @S.label("配送予定日")
  @S.kind("date")
  @S.required
  estimatedDelivery: plainDate;
}

// ============================================================
// 注文モデル
// ============================================================

@S.resource
@S.label("注文")
model Order {
  @S.readonly
  id: string;

  @S.label("注文番号")
  @S.kind("text")
  @S.readonly
  @S.ui(#{ hint: "code" })
  @S.filter(#["eq", "contains"])
  orderNumber: string;

  // relation: Model型 → 顧客オブジェクトそのまま
  @S.label("顧客")
  @S.kind("relation")
  @S.relation(User, #{ labelField: "name", searchable: true })
  @S.required
  @S.ui(#{ inputHint: "autocomplete" })
  @S.filter(#["eq"])
  customer: User;

  // nested: 注文明細（子リソースのインライン編集）
  @S.label("注文明細")
  @S.nested(OrderItem, #{ min: 1, max: 50 })
  items: OrderItem[];

  // enum: ステータス
  @S.label("ステータス")
  @S.kind("status")
  @S.required
  @S.options(#[
    #{ value: "pending", label: "受付中" },
    #{ value: "confirmed", label: "確認済み" },
    #{ value: "processing", label: "処理中" },
    #{ value: "shipped", label: "出荷済み" },
    #{ value: "delivered", label: "配達完了" },
    #{ value: "cancelled", label: "キャンセル" },
    #{ value: "refunded", label: "返金済み" }
  ])
  @S.ui(#{ hint: "badge" })
  @S.filter(#["eq", "in", "ne"])
  status: OrderStatus;

  // enum: 支払方法
  @S.label("支払方法")
  @S.kind("enum")
  @S.required
  @S.options(#[
    #{ value: "credit_card", label: "クレジットカード" },
    #{ value: "bank_transfer", label: "銀行振込" },
    #{ value: "cash_on_delivery", label: "代金引換" }
  ])
  @S.ui(#{ inputHint: "radio" })
  @S.filter(#["eq", "in"])
  paymentMethod: PaymentMethod;

  @S.label("小計")
  @S.kind("currency")
  @S.readonly
  @S.computed
  @S.ui(#{ format: "currency" })
  subtotal: int32;

  @S.label("消費税")
  @S.kind("currency")
  @S.readonly
  @S.computed
  @S.ui(#{ format: "currency" })
  tax: int32;

  @S.label("送料")
  @S.kind("currency")
  @S.ui(#{ format: "currency" })
  @S.min(0)
  shippingFee: int32;

  @S.label("合計金額")
  @S.kind("currency")
  @S.readonly
  @S.computed
  @S.ui(#{ format: "currency" })
  total: int32;

  @S.label("割引率")
  @S.kind("percent")
  @S.ui(#{ format: "percent" })
  @S.min(0)
  @S.max(100)
  discountPercent: float64;

  @S.label("配送先住所")
  @S.kind("longText")
  @S.required
  @S.maxLength(200)
  shippingAddress: string;

  @S.label("備考")
  @S.kind("longText")
  @S.maxLength(1000)
  @S.ui(#{ inputHint: "multiline" })
  notes: string;

  // json: メタデータ
  @S.label("メタデータ")
  @S.kind("json")
  metadata: string;

  // file: 請求書
  @S.label("請求書")
  @S.kind("file")
  invoice: string;

  @S.label("注文日時")
  @S.kind("datetime")
  @S.readonly
  @S.ui(#{ format: "datetime" })
  @S.filter(#["gte", "lte"])
  orderedAt: utcDateTime;

  @S.label("配送予定日")
  @S.kind("date")
  @S.filter(#["gte", "lte"])
  estimatedDelivery: plainDate;

  @S.label("作成日時")
  @S.kind("datetime")
  @S.readonly
  @S.ui(#{ format: "relative" })
  createdAt: utcDateTime;

  @S.label("更新日時")
  @S.kind("datetime")
  @S.readonly
  @S.ui(#{ format: "relative" })
  updatedAt: utcDateTime;
}

// ============================================================
// Views
// ============================================================

@S.view(Order, "list")
@S.columns(#["orderNumber", "customer", "status", "paymentMethod", "total", "orderedAt"])
@S.searchable(#["orderNumber"])
@S.sortable(#["orderNumber", "total", "orderedAt", "createdAt"])
@S.defaultSort("orderedAt", "desc")
@S.selection("multi")
@S.clickAction("show")
@S.namedFilter("pending", "受付中", #{ field: "status", operator: "eq", value: "pending" })
@S.namedFilter("active", "進行中", #{
  and: #[
    #{ field: "status", operator: "in", value: #["confirmed", "processing", "shipped"] },
    #{ field: "status", operator: "ne", value: "cancelled" }
  ]
})
@S.namedFilter("today", "本日の注文", #{ field: "orderedAt", operator: "gte", value: "@relative(startOfDay)" })
@S.namedFilter("highValue", "高額注文", #{ field: "total", operator: "gte", value: 100000 })
@S.namedFilter("cancelled", "キャンセル済み", #{
  or: #[
    #{ field: "status", operator: "eq", value: "cancelled" },
    #{ field: "status", operator: "eq", value: "refunded" }
  ]
})
@S.action("create", #{
  label: "新規注文",
  allowedWhen: "role == 'admin' || role == 'editor'",
  ui: #{ icon: "plus", variant: "primary" }
})
// bulk action: 選択した行が対象
@S.action("bulkConfirm", #{
  label: "一括確認",
  selection: "selected",
  allowedWhen: "role == 'admin'",
  confirm: "選択した注文を確認済みにしますか？",
  ui: #{ icon: "check" }
})
// bulk action: フィルター条件の全件が対象
@S.action("bulkExport", #{
  label: "一括エクスポート",
  selection: "query",
  allowedWhen: "role == 'admin'",
  ui: #{ icon: "download", variant: "secondary" },
  api: #{ path: "/orders/export", method: "POST" }
})
@S.rowAction("show", #{
  label: "詳細",
  ui: #{ icon: "eye", variant: "ghost" }
})
@S.rowAction("edit", #{
  label: "編集",
  allowedWhen: "role == 'admin' || role == 'editor'",
  ui: #{ icon: "pencil" }
})
@S.rowAction("cancel", #{
  label: "キャンセル",
  allowedWhen: "role == 'admin'",
  confirm: true,
  ui: #{ icon: "x", variant: "danger" }
})
model OrderList {}

@S.view(Order, "form")
@S.fields(#["customer", "items", "status", "paymentMethod", "shippingFee", "discountPercent", "shippingAddress", "notes", "estimatedDelivery"])
@S.action("save", #{
  label: "保存",
  ui: #{ icon: "check", variant: "primary" }
})
@S.action("cancel", #{ label: "キャンセル" })
model OrderForm {}

@S.view(Order, "show")
@S.fields(#["orderNumber", "customer", "items", "status", "paymentMethod", "subtotal", "tax", "shippingFee", "discountPercent", "total", "shippingAddress", "notes", "metadata", "invoice", "orderedAt", "estimatedDelivery", "createdAt", "updatedAt"])
@S.action("edit", #{
  label: "編集",
  allowedWhen: "role == 'admin' || role == 'editor'",
  ui: #{ icon: "pencil" }
})
// dialog action: キャンセル + API
@S.action("cancelOrder", #{
  label: "注文キャンセル",
  allowedWhen: "role == 'admin'",
  ui: #{ icon: "x", variant: "danger" },
  dialog: #{ title: "注文キャンセル", description: "キャンセル理由を入力してください" },
  api: #{ path: "/{id}/cancel", method: "POST", body: #["reason", "detail"] }
}, CancelOrderDialog)
// dialog action: 配送情報更新
@S.action("updateShipping", #{
  label: "配送情報更新",
  allowedWhen: "role == 'admin' || role == 'editor'",
  ui: #{ icon: "upload" },
  dialog: #{ title: "配送情報更新", description: "配送業者と追跡番号を入力してください" },
  api: #{ path: "/{id}/shipping", method: "PATCH", body: #["carrier", "trackingNumber", "estimatedDelivery"] }
}, UpdateShippingDialog)
@S.action("delete", #{
  label: "削除",
  allowedWhen: "role == 'admin'",
  confirm: "この注文を完全に削除しますか？この操作は取り消せません。",
  ui: #{ icon: "trash", variant: "danger" }
})
model OrderShow {}
