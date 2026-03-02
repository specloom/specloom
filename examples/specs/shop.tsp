import "./common.tsp";

// ============================================================
// 店舗管理
// 網羅: @visibleWhen, @requiredWhen, @requiredOneOf,
//       @computed, date (plainDate), @kind("url"/"tel"/"email"/"time"),
//       relation valueField, @ui(hint: "link"/"progress"),
//       @ui(format: "percent"/"date"), @filter (全演算子/指定なし),
//       @pattern("url"/"phone"), @min/@max
// ============================================================

enum ShopType {
  directStore,
  franchise,
  online,
}

enum ShopStatus {
  preparing,
  open,
  closed,
  suspended,
}

@S.resource
@S.label("店舗")
@S.requiredOneOf(#["phone", "email"])
model Shop {
  @S.readonly
  id: string;

  @S.label("店舗名")
  @S.kind("text")
  @S.required
  @S.minLength(1)
  @S.maxLength(100)
  @S.filter
  name: string;

  // enum: 店舗タイプ（select入力）
  @S.label("店舗タイプ")
  @S.kind("enum")
  @S.required
  @S.options(#[
    #{ value: "directStore", label: "直営店" },
    #{ value: "franchise", label: "フランチャイズ" },
    #{ value: "online", label: "オンライン" }
  ])
  @S.ui(#{ inputHint: "select" })
  @S.filter(#["eq", "in"])
  shopType: ShopType;

  // enum: ステータス
  @S.label("ステータス")
  @S.kind("status")
  @S.required
  @S.options(#[
    #{ value: "preparing", label: "準備中" },
    #{ value: "open", label: "営業中" },
    #{ value: "closed", label: "閉店" },
    #{ value: "suspended", label: "休止中" }
  ])
  @S.ui(#{ hint: "badge" })
  @S.filter(#["eq", "in", "ne"])
  status: ShopStatus;

  // relation: スカラー型 + デフォルト valueField("id") → ID 抽出
  @S.label("都道府県")
  @S.kind("relation")
  @S.relation(Prefecture, #{ labelField: "name" })
  @S.required
  @S.filter(#["eq", "in"])
  prefecture_id: int32;

  // relation: スカラー型 + カスタム valueField → "code" を抽出
  @S.label("都道府県コード")
  @S.kind("relation")
  @S.relation(Prefecture, #{ labelField: "name", valueField: "code" })
  prefectureCode: string;

  // relation: Model型 → オーナーオブジェクトそのまま
  @S.label("オーナー")
  @S.kind("relation")
  @S.relation(User, #{ labelField: "name", searchable: true })
  @S.required
  @S.ui(#{ inputHint: "autocomplete" })
  owner: User;

  @S.label("住所")
  @S.kind("longText")
  @S.maxLength(200)
  // visibleWhen: オンラインの場合は住所不要
  @S.visibleWhen("shopType != 'online'")
  // requiredWhen: 直営店・フランチャイズの場合は必須
  @S.requiredWhen("shopType == 'directStore' || shopType == 'franchise'")
  address: string;

  @S.label("電話番号")
  @S.kind("tel")
  @S.pattern("phone")
  // requiredOneOf で email とセット（どちらか必須）
  phone: string;

  @S.label("メールアドレス")
  @S.kind("email")
  @S.pattern("email")
  // requiredOneOf で phone とセット
  email: string;

  @S.label("WebサイトURL")
  @S.kind("url")
  @S.pattern("url")
  @S.ui(#{ hint: "link" })
  website: string;

  @S.label("開店日")
  @S.kind("date")
  @S.filter(#["gte", "lte"])
  openDate: plainDate;

  // visibleWhen: 営業中の店舗のみ営業時間を表示
  @S.label("営業開始")
  @S.kind("time")
  @S.visibleWhen("status == 'open'")
  openTime: string;

  @S.label("営業終了")
  @S.kind("time")
  @S.visibleWhen("status == 'open'")
  closeTime: string;

  @S.label("座席数")
  @S.kind("number")
  @S.min(0)
  @S.max(9999)
  @S.visibleWhen("shopType != 'online'")
  seats: int32;

  // computed: サーバー計算値
  @S.label("月間売上")
  @S.kind("currency")
  @S.readonly
  @S.computed
  @S.ui(#{ format: "currency" })
  monthlySales: int32;

  @S.label("目標達成率")
  @S.kind("percent")
  @S.readonly
  @S.computed
  @S.ui(#{ hint: "progress", format: "percent" })
  @S.min(0)
  @S.max(100)
  targetRate: float64;

  @S.label("メモ")
  @S.kind("longText")
  @S.maxLength(2000)
  @S.ui(#{ inputHint: "multiline" })
  notes: string;

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

@S.view(Shop, "list")
@S.columns(#["name", "shopType", "status", "prefecture_id", "owner", "monthlySales", "targetRate"])
@S.searchable(#["name", "address"])
@S.sortable(#["name", "openDate", "monthlySales", "targetRate", "createdAt"])
@S.defaultSort("name", "asc")
@S.selection("single")
@S.clickAction("show")
@S.namedFilter("openShops", "営業中", #{ field: "status", operator: "eq", value: "open" })
@S.namedFilter("directStores", "直営店", #{ field: "shopType", operator: "eq", value: "directStore" })
@S.namedFilter("lowPerformance", "低パフォーマンス", #{
  and: #[
    #{ field: "status", operator: "eq", value: "open" },
    #{ field: "targetRate", operator: "lt", value: 50 }
  ]
})
@S.action("create", #{
  label: "新規作成",
  allowedWhen: "role == 'admin'",
  ui: #{ icon: "plus", variant: "primary" }
})
@S.rowAction("edit", #{
  label: "編集",
  allowedWhen: "role == 'admin' || role == 'editor'",
  ui: #{ icon: "pencil" }
})
@S.rowAction("show", #{
  label: "詳細",
  ui: #{ icon: "eye", variant: "ghost" }
})
model ShopList {}

@S.view(Shop, "form")
@S.fields(#["name", "shopType", "status", "prefecture_id", "prefectureCode", "owner", "address", "phone", "email", "website", "openDate", "openTime", "closeTime", "seats", "notes"])
@S.action("save", #{
  label: "保存",
  ui: #{ icon: "check", variant: "primary" }
})
@S.action("cancel", #{ label: "キャンセル" })
model ShopForm {}

@S.view(Shop, "show")
@S.fields(#["name", "shopType", "status", "prefecture_id", "prefectureCode", "owner", "address", "phone", "email", "website", "openDate", "openTime", "closeTime", "seats", "monthlySales", "targetRate", "notes", "createdAt", "updatedAt"])
@S.action("edit", #{
  label: "編集",
  allowedWhen: "role == 'admin' || role == 'editor'",
  ui: #{ icon: "pencil" }
})
@S.action("suspend", #{
  label: "休止",
  allowedWhen: "role == 'admin'",
  confirm: "この店舗を休止状態にしますか？",
  ui: #{ icon: "archive", variant: "warning" },
  api: #{ path: "/{id}/suspend", method: "POST" }
})
@S.action("delete", #{
  label: "削除",
  allowedWhen: "role == 'admin'",
  confirm: "この店舗を削除しますか？関連データも削除されます。",
  ui: #{ icon: "trash", variant: "danger" }
})
model ShopShow {}
