import { describe, it, expect } from "vitest";
import { createListVM, createShowVM, createFormVM, FacadeError } from "../../src/facade/index.js";
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
    {
      name: "author",
      type: "User",
      label: "著者",
      kind: "relation",
      relation: { resource: "User", labelField: "name" },
    },
  ],
};

const listView: ListView = {
  resource: "Post",
  type: "list",
  columns: ["title", "status", "author"],
  searchable: ["title"],
  sortable: ["title"],
  selectionMode: "multi",
  namedFilters: [
    { id: "all", label: "すべて", filter: {} },
    { id: "draft", label: "下書き", filter: { field: "status", operator: "eq", value: "draft" } },
  ],
  actions: [
    { id: "create", label: "新規作成", allowedWhen: "role == 'admin'" },
  ],
  rowActions: [
    { id: "edit", label: "編集" },
  ],
};

const showView: ShowView = {
  resource: "Post",
  type: "show",
  fields: ["title", "status", "author"],
  actions: [
    { id: "edit", label: "編集", allowedWhen: "role == 'admin'" },
  ],
};

const formView: FormView = {
  resource: "Post",
  type: "form",
  fields: ["title", "status", "author"],
  actions: [
    { id: "save", label: "保存" },
  ],
};

const spec: Spec = {
  version: "0.1",
  resources: [resource],
  views: [listView, showView, formView],
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

describe("facade", () => {
  describe("createListVM", () => {
    it("Spec とリソース名から ListVM を生成できる", () => {
      const data = [
        { id: "1", title: "Hello", status: "published", author: { id: "u1", name: "太郎" } },
        { id: "2", title: "World", status: "draft", author: { id: "u2", name: "花子" } },
      ];

      const vm = createListVM(spec, "Post", { context: adminContext, data });

      expect(vm).toBeInstanceOf(ListVM);
      expect(vm.data.type).toBe("list");
      expect(vm.data.resource).toBe("Post");
      expect(vm.data.label).toBe("投稿");
      expect(vm.data.fields).toHaveLength(3);
      expect(vm.data.rows).toHaveLength(2);
    });

    it("オプション引数が正しく渡される", () => {
      const data = [
        { id: "1", title: "Hello", status: "published", author: { id: "u1", name: "太郎" } },
      ];

      const vm = createListVM(spec, "Post", {
        context: adminContext,
        data,
        searchQuery: "Hello",
        activeFilter: "draft",
        selected: ["1"],
      });

      expect(vm.data.search.query).toBe("Hello");
      expect(vm.data.selection.selected).toContain("1");
    });

    it("コンテキストに応じて allowedWhen が評価される", () => {
      const data: Record<string, unknown>[] = [];

      const adminVM = createListVM(spec, "Post", { context: adminContext, data });
      const guestVM = createListVM(spec, "Post", { context: guestContext, data });

      const adminCreateAction = adminVM.data.pageActions.find(a => a.id === "create");
      const guestCreateAction = guestVM.data.pageActions.find(a => a.id === "create");

      expect(adminCreateAction?.allowed).toBe(true);
      expect(guestCreateAction?.allowed).toBe(false);
    });

    it("リソースが存在しない場合 FacadeError を投げる", () => {
      expect(() => {
        createListVM(spec, "NonExistent", { context: adminContext, data: [] });
      }).toThrow(FacadeError);
      expect(() => {
        createListVM(spec, "NonExistent", { context: adminContext, data: [] });
      }).toThrow("Resource not found: NonExistent");
    });

    it("リストビューが存在しない場合 FacadeError を投げる", () => {
      const specNoListView: Spec = {
        version: "0.1",
        resources: [resource],
        views: [showView], // list ビューなし
      };

      expect(() => {
        createListVM(specNoListView, "Post", { context: adminContext, data: [] });
      }).toThrow(FacadeError);
      expect(() => {
        createListVM(specNoListView, "Post", { context: adminContext, data: [] });
      }).toThrow("list view not found for resource: Post");
    });

    it("同一リソースに同タイプのビューが複数ある場合 FacadeError を投げる", () => {
      const duplicateSpec: Spec = {
        version: "0.1",
        resources: [resource],
        views: [listView, { ...listView, columns: ["title"] }],
      };

      expect(() => {
        createListVM(duplicateSpec, "Post", { context: adminContext, data: [] });
      }).toThrow(FacadeError);
      expect(() => {
        createListVM(duplicateSpec, "Post", { context: adminContext, data: [] });
      }).toThrow(/Multiple list views found for resource: Post/);
    });
  });

  describe("createShowVM", () => {
    const data = {
      id: "1",
      title: "Hello",
      status: "published",
      author: { id: "u1", name: "太郎" },
    };

    it("Spec とリソース名から ShowVM を生成できる", () => {
      const vm = createShowVM(spec, "Post", { context: adminContext, data });

      expect(vm).toBeInstanceOf(ShowVM);
      expect(vm.data.type).toBe("show");
      expect(vm.data.resource).toBe("Post");
      expect(vm.data.id).toBe("1");
      expect(vm.data.fields).toHaveLength(3);
    });

    it("コンテキストに応じて allowedWhen が評価される", () => {
      const adminVM = createShowVM(spec, "Post", { context: adminContext, data });
      const guestVM = createShowVM(spec, "Post", { context: guestContext, data });

      const adminEdit = adminVM.data.actions.find(a => a.id === "edit");
      const guestEdit = guestVM.data.actions.find(a => a.id === "edit");

      expect(adminEdit?.allowed).toBe(true);
      expect(guestEdit?.allowed).toBe(false);
    });

    it("リソースが存在しない場合 FacadeError を投げる", () => {
      expect(() => {
        createShowVM(spec, "NonExistent", { context: adminContext, data });
      }).toThrow(FacadeError);
    });

    it("ショービューが存在しない場合 FacadeError を投げる", () => {
      const specNoShowView: Spec = {
        version: "0.1",
        resources: [resource],
        views: [listView], // show ビューなし
      };

      expect(() => {
        createShowVM(specNoShowView, "Post", { context: adminContext, data });
      }).toThrow("show view not found for resource: Post");
    });

    it("同一リソースにショービューが複数ある場合 FacadeError を投げる", () => {
      const duplicateSpec: Spec = {
        version: "0.1",
        resources: [resource],
        views: [showView, { ...showView, fields: ["title"] }],
      };

      expect(() => {
        createShowVM(duplicateSpec, "Post", { context: adminContext, data });
      }).toThrow(/Multiple show views found for resource: Post/);
    });
  });

  describe("createFormVM", () => {
    it("新規作成モードで FormVM を生成できる", () => {
      const vm = createFormVM(spec, "Post", {
        context: adminContext,
        mode: "create",
      });

      expect(vm).toBeInstanceOf(FormVM);
      expect(vm.data.type).toBe("form");
      expect(vm.data.mode).toBe("create");
      expect(vm.data.fields).toHaveLength(3);
      expect(vm.data.isDirty).toBe(false);
    });

    it("編集モードでデータ付きの FormVM を生成できる", () => {
      const data = {
        id: "1",
        title: "Hello",
        status: "published",
        author: { id: "u1", name: "太郎" },
      };

      const vm = createFormVM(spec, "Post", {
        context: adminContext,
        mode: "edit",
        data,
      });

      expect(vm.data.mode).toBe("edit");
      expect(vm.data.fields.find(f => f.name === "title")?.value).toBe("Hello");
    });

    it("リソースが存在しない場合 FacadeError を投げる", () => {
      expect(() => {
        createFormVM(spec, "NonExistent", { context: adminContext, mode: "create" });
      }).toThrow(FacadeError);
    });

    it("フォームビューが存在しない場合 FacadeError を投げる", () => {
      const specNoFormView: Spec = {
        version: "0.1",
        resources: [resource],
        views: [listView], // form ビューなし
      };

      expect(() => {
        createFormVM(specNoFormView, "Post", { context: adminContext, mode: "create" });
      }).toThrow("form view not found for resource: Post");
    });

    it("同一リソースにフォームビューが複数ある場合 FacadeError を投げる", () => {
      const duplicateSpec: Spec = {
        version: "0.1",
        resources: [resource],
        views: [formView, { ...formView, fields: ["title"] }],
      };

      expect(() => {
        createFormVM(duplicateSpec, "Post", { context: adminContext, mode: "create" });
      }).toThrow(/Multiple form views found for resource: Post/);
    });
  });

  describe("FacadeError", () => {
    it("instanceof で判別できる", () => {
      const error = new FacadeError("test");
      expect(error).toBeInstanceOf(FacadeError);
      expect(error).toBeInstanceOf(Error);
      expect(error.name).toBe("FacadeError");
    });
  });
});
