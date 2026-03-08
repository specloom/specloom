import "./common.tsp";

// ============================================================
// ユーザー管理
// 網羅: @createOnly, @kind("password"), @pattern("email"),
//       @match, @minLength, @maxLength, @filter(operators),
//       enum(@options), @ui(hint: "avatar"/"badge"),
//       @dialog + @api, @allowedWhen
// ============================================================

enum UserRole {
  admin,
  editor,
  viewer,
}

@S.resource
@S.label("ユーザー")
model User {
  @S.readonly
  id: string;

  @S.label("名前")
  @S.kind("text")
  @S.required
  @S.minLength(1)
  @S.maxLength(50)
  @S.filter
  name: string;

  @S.label("メールアドレス")
  @S.kind("email")
  @S.required
  @S.pattern("email")
  @S.filter(#["eq", "contains"])
  email: string;

  @S.label("パスワード")
  @S.kind("password")
  @S.required
  @S.createOnly
  @S.minLength(8)
  @S.maxLength(128)
  password: string;

  @S.label("電話番号")
  @S.kind("tel")
  @S.pattern("phone")
  phone: string;

  @S.label("ロール")
  @S.kind("enum")
  @S.required
  @S.options(#[
    #{ value: "admin", label: "管理者" },
    #{ value: "editor", label: "編集者" },
    #{ value: "viewer", label: "閲覧者" }
  ])
  @S.ui(#{ hint: "badge", inputHint: "radio" })
  @S.filter(#["eq", "in"])
  role: UserRole;

  @S.label("有効")
  @S.kind("boolean")
  @S.ui(#{ inputHint: "switch" })
  @S.filter(#["eq"])
  active: boolean;

  @S.label("アバター")
  @S.kind("image")
  avatar: string;

  @S.label("プロフィール")
  @S.kind("longText")
  @S.maxLength(1000)
  @S.ui(#{ inputHint: "markdown" })
  bio: string;

  @S.label("作成日時")
  @S.kind("datetime")
  @S.readonly
  @S.ui(#{ format: "relative" })
  @S.filter(#["gte", "lte"])
  createdAt: utcDateTime;

  @S.label("最終ログイン")
  @S.kind("datetime")
  @S.readonly
  @S.ui(#{ format: "relative" })
  lastLoginAt: utcDateTime;
}

// ============================================================
// Dialog: パスワード変更
// 網羅: @match (password confirmation)
// ============================================================

model ChangePasswordDialog {
  @S.label("新しいパスワード")
  @S.kind("password")
  @S.required
  @S.minLength(8)
  password: string;

  @S.label("パスワード（確認）")
  @S.kind("password")
  @S.required
  @S.minLength(8)
  @S.match("password")
  confirmPassword: string;
}

// ============================================================
// Dialog: ロール変更
// ============================================================

model ChangeRoleDialog {
  @S.label("新しいロール")
  @S.kind("enum")
  @S.required
  @S.options(#[
    #{ value: "admin", label: "管理者" },
    #{ value: "editor", label: "編集者" },
    #{ value: "viewer", label: "閲覧者" }
  ])
  role: UserRole;
}

// ============================================================
// Views
// ============================================================

@S.view(User, "list")
@S.columns(#["name", "email", "role", "active", "createdAt"])
@S.searchable(#["name", "email"])
@S.sortable(#["name", "email", "createdAt", "lastLoginAt"])
@S.defaultSort("createdAt", "desc")
@S.selection("multi")
@S.clickAction("show")
@S.namedFilter("activeOnly", "有効ユーザー", #{ field: "active", operator: "eq", value: true })
@S.namedFilter("admins", "管理者", #{ field: "role", operator: "eq", value: "admin" })
@S.namedFilter("recentLogin", "最近ログイン", #{ field: "lastLoginAt", operator: "gte", value: "@relative(-7d)" })
@S.action("create", #{
  label: "新規作成",
  allowedWhen: "role == 'admin'",
  ui: #{ icon: "plus", variant: "primary" }
})
@S.action("bulkDeactivate", #{
  label: "一括無効化",
  selection: "selected",
  allowedWhen: "role == 'admin'",
  confirm: "選択したユーザーを無効化しますか？"
})
@S.rowAction("edit", #{
  label: "編集",
  allowedWhen: "role == 'admin' || role == 'editor'",
  ui: #{ icon: "pencil" }
})
@S.rowAction("delete", #{
  label: "削除",
  allowedWhen: "role == 'admin'",
  confirm: "このユーザーを削除しますか？",
  ui: #{ icon: "trash", variant: "danger" }
})
model UserList {}

@S.view(User, "form")
@S.fields(#["name", "email", "password", "phone", "role", "active", "avatar", "bio"])
@S.action("save", #{
  label: "保存",
  ui: #{ icon: "check", variant: "primary" }
})
@S.action("cancel", #{ label: "キャンセル" })
model UserForm {}

@S.view(User, "show")
@S.fields(#["name", "email", "phone", "role", "active", "avatar", "bio", "createdAt", "lastLoginAt"])
@S.action("edit", #{
  label: "編集",
  allowedWhen: "role == 'admin' || role == 'editor'",
  ui: #{ icon: "pencil" }
})
// dialog + api action: パスワード変更
@S.action("changePassword", #{
  label: "パスワード変更",
  allowedWhen: "role == 'admin'",
  ui: #{ icon: "key" },
  dialog: #{ title: "パスワード変更", description: "新しいパスワードを入力してください（8文字以上）" },
  api: #{ path: "/{id}/password", method: "PUT", body: #["password"] }
}, ChangePasswordDialog)
// dialog action: ロール変更
@S.action("changeRole", #{
  label: "ロール変更",
  allowedWhen: "role == 'admin'",
  dialog: #{ title: "ロール変更", description: "新しいロールを選択してください" },
  api: #{ path: "/{id}/role", method: "PATCH", body: #["role"] }
}, ChangeRoleDialog)
@S.action("delete", #{
  label: "削除",
  allowedWhen: "role == 'admin'",
  confirm: "このユーザーを完全に削除しますか？この操作は取り消せません。",
  ui: #{ icon: "trash", variant: "danger" }
})
model UserShow {}
