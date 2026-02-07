import { describe, it, expect } from "vitest";
import { Admin, createAdmin } from "../../src/admin/index.js";
import { FacadeError } from "../../src/facade/index.js";
import { ListVM } from "../../src/vm/list.js";
import { ShowVM } from "../../src/vm/show.js";
import { FormVM } from "../../src/vm/form.js";
import type { Spec, Resource, ListView, ShowView, FormView } from "../../src/spec/index.js";
import type { Context } from "../../src/vm/types.js";

// ============================================================
// テストデータ
// ============================================================

const resource: Resource = {
  name: "Post",
  label: "投稿",
  fields: [
    { name: "id", type: "string", readonly: true },
    { name: "title", type: "string", label: "タイトル", kind: "text", required: true },
    {
      name: "status",
      type: "string",
      label: "状態",
      kind: "enum",
      options: [
        { value: "draft", label: "下書き" },
        { value: "published", label: "公開中" },
      ],
    },
  ],
};

const userResource: Resource = {
  name: "User",
  label: "ユーザー",
  fields: [
    { name: "id", type: "string", readonly: true },
    { name: "name", type: "string", label: "名前", kind: "text" },
    { name: "email", type: "string", label: "メール", kind: "email" },
  ],
};

const listView: ListView = {
  resource: "Post",
  type: "list",
  columns: ["title", "status"],
  searchable: ["title"],
  actions: [
    { id: "create", label: "新規作成", allowedWhen: "role == 'admin'" },
  ],
  rowActions: [],
};

const showView: ShowView = {
  resource: "Post",
  type: "show",
  fields: ["title", "status"],
  actions: [
    { id: "edit", label: "編集", allowedWhen: "role == 'admin'" },
  ],
};

const formView: FormView = {
  resource: "Post",
  type: "form",
  fields: ["title", "status"],
  actions: [{ id: "save", label: "保存" }],
};

const userListView: ListView = {
  resource: "User",
  type: "list",
  columns: ["name", "email"],
  actions: [],
  rowActions: [],
};

const spec: Spec = {
  version: "0.1",
  resources: [resource, userResource],
  views: [listView, showView, formView, userListView],
};

const adminContext: Context = {
  user: { id: "user-1", name: "田中太郎" },
  role: "admin",
  permissions: [],
  custom: {},
};

const guestContext: Context = {
  user: { id: "user-2", name: "ゲスト" },
  role: "guest",
  permissions: [],
  custom: {},
};

// ============================================================
// Tests
// ============================================================

describe("Admin", () => {
  describe("createAdmin", () => {
    it("Admin インスタンスを生成できる", () => {
      const admin = createAdmin(spec, adminContext);
      expect(admin).toBeInstanceOf(Admin);
    });
  });

  describe("list", () => {
    it("デフォルトコンテキストで ListVM を生成できる", () => {
      const admin = createAdmin(spec, adminContext);
      const data = [
        { id: "1", title: "Hello", status: "published" },
        { id: "2", title: "World", status: "draft" },
      ];

      const vm = admin.list("Post", { data });

      expect(vm).toBeInstanceOf(ListVM);
      expect(vm.data.resource).toBe("Post");
      expect(vm.data.rows).toHaveLength(2);
    });

    it("context を上書きできる", () => {
      const admin = createAdmin(spec, adminContext);
      const data: Record<string, unknown>[] = [];

      const adminVM = admin.list("Post", { data });
      const guestVM = admin.list("Post", { data, context: guestContext });

      const adminAction = adminVM.data.pageActions.find(a => a.id === "create");
      const guestAction = guestVM.data.pageActions.find(a => a.id === "create");

      expect(adminAction?.allowed).toBe(true);
      expect(guestAction?.allowed).toBe(false);
    });

    it("オプション引数が渡される", () => {
      const admin = createAdmin(spec, adminContext);
      const data = [{ id: "1", title: "Hello", status: "published" }];

      const vm = admin.list("Post", {
        data,
        searchQuery: "Hello",
        selected: ["1"],
      });

      expect(vm.data.search.query).toBe("Hello");
      expect(vm.data.selection.selected).toContain("1");
    });

    it("別リソースの ListVM も生成できる", () => {
      const admin = createAdmin(spec, adminContext);
      const data = [{ id: "u1", name: "太郎", email: "taro@example.com" }];

      const vm = admin.list("User", { data });

      expect(vm.data.resource).toBe("User");
      expect(vm.data.rows).toHaveLength(1);
    });

    it("存在しないリソースで FacadeError を投げる", () => {
      const admin = createAdmin(spec, adminContext);
      expect(() => admin.list("NonExistent", { data: [] })).toThrow(FacadeError);
    });
  });

  describe("show", () => {
    it("デフォルトコンテキストで ShowVM を生成できる", () => {
      const admin = createAdmin(spec, adminContext);
      const data = { id: "1", title: "Hello", status: "published" };

      const vm = admin.show("Post", { data });

      expect(vm).toBeInstanceOf(ShowVM);
      expect(vm.data.resource).toBe("Post");
      expect(vm.data.id).toBe("1");
    });

    it("context を上書きできる", () => {
      const admin = createAdmin(spec, adminContext);
      const data = { id: "1", title: "Hello", status: "published" };

      const guestVM = admin.show("Post", { data, context: guestContext });
      const editAction = guestVM.data.actions.find(a => a.id === "edit");

      expect(editAction?.allowed).toBe(false);
    });
  });

  describe("form", () => {
    it("デフォルトコンテキストで FormVM を生成できる", () => {
      const admin = createAdmin(spec, adminContext);

      const vm = admin.form("Post", { mode: "create" });

      expect(vm).toBeInstanceOf(FormVM);
      expect(vm.data.mode).toBe("create");
      expect(vm.data.fields).toHaveLength(2);
    });

    it("編集モードでデータ付き FormVM を生成できる", () => {
      const admin = createAdmin(spec, adminContext);
      const data = { id: "1", title: "Hello", status: "draft" };

      const vm = admin.form("Post", { mode: "edit", data });

      expect(vm.data.mode).toBe("edit");
      expect(vm.data.fields.find(f => f.name === "title")?.value).toBe("Hello");
    });

    it("context を上書きできる", () => {
      const admin = createAdmin(spec, adminContext);

      const vm = admin.form("Post", { mode: "create", context: guestContext });

      expect(vm).toBeInstanceOf(FormVM);
    });
  });

  describe("withContext", () => {
    it("新しい Admin インスタンスを返す", () => {
      const admin1 = createAdmin(spec, adminContext);
      const admin2 = admin1.withContext(guestContext);

      expect(admin2).toBeInstanceOf(Admin);
      expect(admin2).not.toBe(admin1);
    });

    it("元のインスタンスのコンテキストは変わらない", () => {
      const admin1 = createAdmin(spec, adminContext);
      const admin2 = admin1.withContext(guestContext);

      expect(admin1.getContext()).toEqual(adminContext);
      expect(admin2.getContext()).toEqual(guestContext);
    });

    it("Spec の値は共有される", () => {
      const admin1 = createAdmin(spec, adminContext);
      const admin2 = admin1.withContext(guestContext);

      expect(admin2.getSpec()).toEqual(admin1.getSpec());
    });

    it("新しいコンテキストでパーミッションが反映される", () => {
      const admin = createAdmin(spec, adminContext);
      const guestAdmin = admin.withContext(guestContext);

      const adminVM = admin.list("Post", { data: [] });
      const guestVM = guestAdmin.list("Post", { data: [] });

      const adminAction = adminVM.data.pageActions.find(a => a.id === "create");
      const guestAction = guestVM.data.pageActions.find(a => a.id === "create");

      expect(adminAction?.allowed).toBe(true);
      expect(guestAction?.allowed).toBe(false);
    });
  });

  describe("getSpec / getContext", () => {
    it("Spec の値を返す", () => {
      const admin = createAdmin(spec, adminContext);
      expect(admin.getSpec()).toEqual(spec);
    });

    it("Context の値を返す", () => {
      const admin = createAdmin(spec, adminContext);
      expect(admin.getContext()).toEqual(adminContext);
    });

    it("getSpec() は内部参照ではなくコピーを返す", () => {
      const admin = createAdmin(spec, adminContext);
      const s1 = admin.getSpec();
      const s2 = admin.getSpec();
      expect(s1).not.toBe(s2);
      expect(s1).toEqual(s2);
    });

    it("getContext() は内部参照ではなくコピーを返す", () => {
      const admin = createAdmin(spec, adminContext);
      const c1 = admin.getContext();
      const c2 = admin.getContext();
      expect(c1).not.toBe(c2);
      expect(c1).toEqual(c2);
    });
  });

  describe("外部ミューテーション耐性", () => {
    it("createAdmin 後に元の context を変更しても内部状態に影響しない", () => {
      const ctx: Context = {
        user: { id: "user-1", name: "田中太郎" },
        role: "admin",
        permissions: [],
        custom: {},
      };
      const admin = createAdmin(spec, ctx);

      // 外部から変更
      ctx.role = "guest";

      // admin 内部は変わっていない
      const vm = admin.list("Post", { data: [] });
      const createAction = vm.data.pageActions.find(a => a.id === "create");
      expect(createAction?.allowed).toBe(true);
      expect(admin.getContext().role).toBe("admin");
    });

    it("getContext() の戻り値を変更しても内部状態に影響しない", () => {
      const admin = createAdmin(spec, adminContext);

      const leaked = admin.getContext();
      leaked.role = "guest";

      // admin 内部は変わっていない
      expect(admin.getContext().role).toBe("admin");
      const vm = admin.list("Post", { data: [] });
      const createAction = vm.data.pageActions.find(a => a.id === "create");
      expect(createAction?.allowed).toBe(true);
    });

    it("createAdmin 後に元の spec を変更しても内部状態に影響しない", () => {
      const mutableSpec: Spec = structuredClone(spec);
      const admin = createAdmin(mutableSpec, adminContext);

      // 外部から変更
      mutableSpec.resources.push({
        name: "Injected",
        fields: [],
      });

      // admin 内部は変わっていない
      expect(admin.hasResource("Injected")).toBe(false);
      expect(admin.getResourceNames()).toEqual(["Post", "User"]);
    });

    it("withContext に渡した context を後から変更しても影響しない", () => {
      const admin = createAdmin(spec, adminContext);
      const ctx: Context = { role: "editor" };
      const editorAdmin = admin.withContext(ctx);

      ctx.role = "guest";

      expect(editorAdmin.getContext().role).toBe("editor");
    });
  });

  describe("hasResource", () => {
    it("存在するリソースで true を返す", () => {
      const admin = createAdmin(spec, adminContext);
      expect(admin.hasResource("Post")).toBe(true);
      expect(admin.hasResource("User")).toBe(true);
    });

    it("存在しないリソースで false を返す", () => {
      const admin = createAdmin(spec, adminContext);
      expect(admin.hasResource("NonExistent")).toBe(false);
    });
  });

  describe("getResource", () => {
    it("存在するリソースを返す", () => {
      const admin = createAdmin(spec, adminContext);
      const r = admin.getResource("Post");
      expect(r?.name).toBe("Post");
      expect(r?.label).toBe("投稿");
    });

    it("存在しないリソースで undefined を返す", () => {
      const admin = createAdmin(spec, adminContext);
      expect(admin.getResource("NonExistent")).toBeUndefined();
    });

    it("返り値を変更しても内部状態に影響しない", () => {
      const admin = createAdmin(spec, adminContext);
      const r = admin.getResource("Post");
      r!.label = "改ざん";

      expect(admin.getResource("Post")?.label).toBe("投稿");
    });
  });

  describe("getResourceNames", () => {
    it("全リソース名を返す", () => {
      const admin = createAdmin(spec, adminContext);
      expect(admin.getResourceNames()).toEqual(["Post", "User"]);
    });
  });
});
