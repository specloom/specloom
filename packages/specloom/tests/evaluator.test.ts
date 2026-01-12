import { describe, it, expect } from "vitest";
import {
  evaluateListView,
  evaluateShowView,
  evaluateFormView,
  evaluateExpression,
  EvaluateError,
} from "../src/evaluator/index.js";
import type { Resource, ListView, ShowView, FormView } from "../src/spec/index.js";
import type { Context } from "../src/vm/index.js";

const createResource = (): Resource => ({
  name: "Post",
  label: "投稿",
  fields: [
    { name: "id", type: "string", readonly: true },
    { name: "title", type: "string", label: "タイトル", kind: "text", required: true },
    { name: "status", type: "string", label: "状態", kind: "enum", options: [
      { value: "draft", label: "下書き" },
      { value: "published", label: "公開中" },
    ]},
    { name: "createdAt", type: "datetime", label: "作成日時", kind: "datetime", readonly: true },
  ],
});

const createContext = (role: string): Context => ({
  user: { id: "user-1", name: "田中太郎" },
  role,
  permissions: [],
  custom: {},
});

describe("evaluator", () => {
  describe("evaluateExpression", () => {
    it("role == 'admin' を評価できる", () => {
      const context = createContext("admin");
      expect(evaluateExpression("role == 'admin'", context, {})).toBe(true);
      expect(evaluateExpression("role == 'editor'", context, {})).toBe(false);
    });

    it("role != 'guest' を評価できる", () => {
      const context = createContext("admin");
      expect(evaluateExpression("role != 'guest'", context, {})).toBe(true);
      expect(evaluateExpression("role != 'admin'", context, {})).toBe(false);
    });

    it("status == 'draft' をデータから評価できる", () => {
      const context = createContext("admin");
      const data = { status: "draft" };
      expect(evaluateExpression("status == 'draft'", context, data)).toBe(true);
      expect(evaluateExpression("status == 'published'", context, data)).toBe(false);
    });

    it("OR 演算子を評価できる", () => {
      const context = createContext("editor");
      expect(evaluateExpression("role == 'admin' || role == 'editor'", context, {})).toBe(true);
      expect(evaluateExpression("role == 'admin' || role == 'guest'", context, {})).toBe(false);
    });

    it("AND 演算子を評価できる", () => {
      const context = createContext("admin");
      const data = { status: "draft" };
      expect(evaluateExpression("role == 'admin' && status == 'draft'", context, data)).toBe(true);
      expect(evaluateExpression("role == 'admin' && status == 'published'", context, data)).toBe(false);
    });

    it("不正な式は false を返す", () => {
      const context = createContext("admin");
      expect(evaluateExpression("invalid expression", context, {})).toBe(false);
    });
  });

  describe("evaluateListView", () => {
    const listView: ListView = {
      resource: "Post",
      type: "list",
      columns: ["title", "status"],
      sortable: ["title"],
      searchable: ["title"],
      selection: "multi",
      namedFilters: [
        { id: "all", label: "すべて", filter: {} },
        { id: "draft", label: "下書き", filter: { status: "draft" } },
      ],
      actions: [
        { id: "create", label: "新規作成", placement: "header", allowedWhen: "role == 'admin'" },
        { id: "edit", label: "編集", placement: "row" },
        { id: "delete", label: "削除", placement: "row", allowedWhen: "role == 'admin'", confirm: "削除しますか？" },
      ],
    };

    it("ListViewModel を生成できる", () => {
      const resource = createResource();
      const context = createContext("admin");
      const data = [
        { id: "1", title: "Hello", status: "published" },
        { id: "2", title: "World", status: "draft" },
      ];

      const vm = evaluateListView({ view: listView, resource, context, data });

      expect(vm.type).toBe("list");
      expect(vm.resource).toBe("Post");
      expect(vm.label).toBe("投稿");
      expect(vm.fields).toHaveLength(2);
      expect(vm.rows).toHaveLength(2);
    });

    it("フィールド定義を正しく変換する", () => {
      const resource = createResource();
      const context = createContext("admin");
      const data: Record<string, unknown>[] = [];

      const vm = evaluateListView({ view: listView, resource, context, data });

      expect(vm.fields[0]).toMatchObject({
        name: "title",
        label: "タイトル",
        kind: "text",
        sortable: true,
      });
      expect(vm.fields[1]).toMatchObject({
        name: "status",
        label: "状態",
        kind: "enum",
        sortable: false,
      });
    });

    it("headerActions の allowed を評価する", () => {
      const resource = createResource();
      const data: Record<string, unknown>[] = [];

      // admin の場合
      const adminVm = evaluateListView({
        view: listView,
        resource,
        context: createContext("admin"),
        data,
      });
      expect(adminVm.headerActions[0].allowed).toBe(true);

      // editor の場合
      const editorVm = evaluateListView({
        view: listView,
        resource,
        context: createContext("editor"),
        data,
      });
      expect(editorVm.headerActions[0].allowed).toBe(false);
    });

    it("行ごとのアクションを評価する", () => {
      const resource = createResource();
      const context = createContext("editor");
      const data = [{ id: "1", title: "Hello", status: "published" }];

      const vm = evaluateListView({ view: listView, resource, context, data });

      const row = vm.rows[0];
      expect(row.actions).toHaveLength(2); // edit, delete
      expect(row.actions.find(a => a.id === "edit")?.allowed).toBe(true);
      expect(row.actions.find(a => a.id === "delete")?.allowed).toBe(false);
      expect(row.actions.find(a => a.id === "delete")?.confirm).toBe("削除しますか？");
    });

    it("フィルターを正しく変換する", () => {
      const resource = createResource();
      const context = createContext("admin");
      const data: Record<string, unknown>[] = [];

      const vm = evaluateListView({ view: listView, resource, context, data, activeFilter: "draft" });

      expect(vm.filters.named).toHaveLength(2);
      expect(vm.filters.named[0].active).toBe(false);
      expect(vm.filters.named[1].active).toBe(true);
    });

    it("検索と選択状態を正しく変換する", () => {
      const resource = createResource();
      const context = createContext("admin");
      const data: Record<string, unknown>[] = [];

      const vm = evaluateListView({
        view: listView,
        resource,
        context,
        data,
        searchQuery: "test",
        selected: ["1", "2"],
      });

      expect(vm.search.fields).toEqual(["title"]);
      expect(vm.search.query).toBe("test");
      expect(vm.selection.mode).toBe("multi");
      expect(vm.selection.selected).toEqual(["1", "2"]);
    });

    it("存在しないフィールドでエラーになる", () => {
      const resource = createResource();
      const context = createContext("admin");
      const invalidView: ListView = {
        ...listView,
        columns: ["nonexistent"],
      };

      expect(() =>
        evaluateListView({ view: invalidView, resource, context, data: [] })
      ).toThrow(EvaluateError);
    });
  });

  describe("evaluateShowView", () => {
    const showView: ShowView = {
      resource: "Post",
      type: "show",
      fields: ["title", "status", "createdAt"],
      actions: [
        { id: "edit", label: "編集", placement: "header", allowedWhen: "role == 'admin'" },
      ],
    };

    it("ShowViewModel を生成できる", () => {
      const resource = createResource();
      const context = createContext("admin");
      const data = { id: "1", title: "Hello", status: "published", createdAt: "2024-01-01" };

      const vm = evaluateShowView({ view: showView, resource, context, data });

      expect(vm.type).toBe("show");
      expect(vm.id).toBe("1");
      expect(vm.fields).toHaveLength(3);
      expect(vm.fields[0]).toMatchObject({
        name: "title",
        value: "Hello",
      });
    });

    it("アクションの allowed を評価する", () => {
      const resource = createResource();
      const data = { id: "1", title: "Hello", status: "published" };

      const adminVm = evaluateShowView({
        view: showView,
        resource,
        context: createContext("admin"),
        data,
      });
      expect(adminVm.actions[0].allowed).toBe(true);

      const editorVm = evaluateShowView({
        view: showView,
        resource,
        context: createContext("editor"),
        data,
      });
      expect(editorVm.actions[0].allowed).toBe(false);
    });
  });

  describe("evaluateFormView", () => {
    const formView: FormView = {
      resource: "Post",
      type: "form",
      fields: ["title", "status"],
      actions: [
        { id: "save", label: "保存", placement: "header" },
        { id: "cancel", label: "キャンセル", placement: "header" },
      ],
    };

    it("FormViewModel（新規作成）を生成できる", () => {
      const resource = createResource();
      const context = createContext("admin");

      const vm = evaluateFormView({
        view: formView,
        resource,
        context,
        mode: "create",
      });

      expect(vm.type).toBe("form");
      expect(vm.mode).toBe("create");
      expect(vm.id).toBeUndefined();
      expect(vm.fields).toHaveLength(2);
      expect(vm.isValid).toBe(true);
      expect(vm.isDirty).toBe(false);
    });

    it("FormViewModel（編集）を生成できる", () => {
      const resource = createResource();
      const context = createContext("admin");
      const data = { id: "1", title: "Hello", status: "published" };

      const vm = evaluateFormView({
        view: formView,
        resource,
        context,
        data,
        mode: "edit",
      });

      expect(vm.mode).toBe("edit");
      expect(vm.id).toBe("1");
      expect(vm.fields[0]).toMatchObject({
        name: "title",
        value: "Hello",
        required: true,
      });
    });

    it("バリデーションエラーを反映する", () => {
      const resource = createResource();
      const context = createContext("admin");

      const vm = evaluateFormView({
        view: formView,
        resource,
        context,
        mode: "create",
        errors: {
          title: ["タイトルは必須です"],
        },
      });

      expect(vm.isValid).toBe(false);
      expect(vm.fields[0].errors).toEqual(["タイトルは必須です"]);
    });

    it("isDirty を反映する", () => {
      const resource = createResource();
      const context = createContext("admin");

      const vm = evaluateFormView({
        view: formView,
        resource,
        context,
        mode: "create",
        isDirty: true,
      });

      expect(vm.isDirty).toBe(true);
    });
  });
});
