import { describe, it, expect } from "vitest";
import {
  evaluateListView,
  evaluateShowView,
  evaluateFormView,
  evaluateExpression,
  EvaluateError,
} from "../../src/evaluator/index.js";
import type {
  Resource,
  ListView,
  ShowView,
  FormView,
} from "../../src/spec/index.js";
import type { Context } from "../../src/ui/index.js";

const createResource = (): Resource => ({
  name: "Post",
  label: "投稿",
  fields: [
    { name: "id", type: "string", readonly: true },
    {
      name: "title",
      type: "string",
      label: "タイトル",
      kind: "text",
      required: true,
    },
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
      required: true,
      relation: {
        resource: "User",
        labelField: "name",
      },
      ui: {
        hint: "avatar",
        inputHint: "autocomplete",
      },
    },
    {
      name: "tags",
      type: "Tag[]",
      label: "タグ",
      kind: "relation",
      relation: {
        resource: "Tag",
        labelField: "name",
      },
      validation: {
        maxItems: 5,
      },
    },
    {
      name: "createdAt",
      type: "datetime",
      label: "作成日時",
      kind: "datetime",
      readonly: true,
    },
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
      expect(evaluateExpression("status == 'published'", context, data)).toBe(
        false,
      );
    });

    it("OR 演算子を評価できる", () => {
      const context = createContext("editor");
      expect(
        evaluateExpression("role == 'admin' || role == 'editor'", context, {}),
      ).toBe(true);
      expect(
        evaluateExpression("role == 'admin' || role == 'guest'", context, {}),
      ).toBe(false);
    });

    it("AND 演算子を評価できる", () => {
      const context = createContext("admin");
      const data = { status: "draft" };
      expect(
        evaluateExpression(
          "role == 'admin' && status == 'draft'",
          context,
          data,
        ),
      ).toBe(true);
      expect(
        evaluateExpression(
          "role == 'admin' && status == 'published'",
          context,
          data,
        ),
      ).toBe(false);
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
      columns: ["title", "status", "author"],
      sortable: ["title"],
      searchable: ["title"],
      selection: "multi",
      namedFilters: [
        { id: "all", label: "すべて", filter: {} },
        { id: "draft", label: "下書き", filter: { status: "draft" } },
      ],
      actions: [
        {
          id: "create",
          label: "新規作成",
          placement: "header",
          allowedWhen: "role == 'admin'",
        },
        { id: "edit", label: "編集", placement: "row" },
        {
          id: "delete",
          label: "削除",
          placement: "row",
          allowedWhen: "role == 'admin'",
          confirm: "削除しますか？",
        },
      ],
    };

    it("ListViewModel を生成できる", () => {
      const resource = createResource();
      const context = createContext("admin");
      const data = [
        {
          id: "1",
          title: "Hello",
          status: "published",
          author: { id: "user-1", name: "田中太郎" },
        },
        {
          id: "2",
          title: "World",
          status: "draft",
          author: { id: "user-2", name: "山田花子" },
        },
      ];

      const vm = evaluateListView({ view: listView, resource, context, data });

      expect(vm.type).toBe("list");
      expect(vm.resource).toBe("Post");
      expect(vm.label).toBe("投稿");
      expect(vm.fields).toHaveLength(3);
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
        options: [
          { value: "draft", label: "下書き" },
          { value: "published", label: "公開中" },
        ],
      });
      expect(vm.fields[2]).toMatchObject({
        name: "author",
        label: "著者",
        kind: "relation",
        sortable: false,
      });
    });

    it("リレーションフィールドを正しく変換する", () => {
      const resource = createResource();
      const context = createContext("admin");
      const data = [
        {
          id: "1",
          title: "Hello",
          status: "published",
          author: { id: "user-1", name: "田中太郎" },
          tags: [
            { id: "tag-1", name: "tech" },
            { id: "tag-2", name: "news" },
          ],
        },
      ];

      const vm = evaluateListView({ view: listView, resource, context, data });

      // author フィールドの UI ヒントが含まれる
      const authorField = vm.fields.find((f) => f.name === "author");
      expect(authorField?.ui).toMatchObject({
        hint: "avatar",
      });

      // 行データにリレーション値が含まれる
      const row = vm.rows[0];
      expect(row.values.author).toEqual({ id: "user-1", name: "田中太郎" });
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
      expect(row.actions.find((a) => a.id === "edit")?.allowed).toBe(true);
      expect(row.actions.find((a) => a.id === "delete")?.allowed).toBe(false);
      expect(row.actions.find((a) => a.id === "delete")?.confirm).toBe(
        "削除しますか？",
      );
    });

    it("フィルターを正しく変換する", () => {
      const resource = createResource();
      const context = createContext("admin");
      const data: Record<string, unknown>[] = [];

      const vm = evaluateListView({
        view: listView,
        resource,
        context,
        data,
        activeFilter: "draft",
      });

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
        evaluateListView({ view: invalidView, resource, context, data: [] }),
      ).toThrow(EvaluateError);
    });

    it("bulkActions を正しく評価する", () => {
      const resource = createResource();
      const context = createContext("admin");
      const viewWithBulk: ListView = {
        ...listView,
        selection: "multi",
        actions: [
          ...listView.actions,
          {
            id: "bulkDelete",
            label: "一括削除",
            placement: "bulk",
            allowedWhen: "role == 'admin'",
            confirm: "選択した項目を削除しますか？",
          },
          {
            id: "bulkPublish",
            label: "一括公開",
            placement: "bulk",
          },
        ],
      };

      const adminVm = evaluateListView({
        view: viewWithBulk,
        resource,
        context,
        data: [],
      });

      expect(adminVm.bulkActions).toHaveLength(2);
      expect(adminVm.bulkActions[0]).toMatchObject({
        id: "bulkDelete",
        label: "一括削除",
        allowed: true,
        confirm: "選択した項目を削除しますか？",
      });
      expect(adminVm.bulkActions[1]).toMatchObject({
        id: "bulkPublish",
        label: "一括公開",
        allowed: true,
      });

      // editor の場合は bulkDelete が許可されない
      const editorVm = evaluateListView({
        view: viewWithBulk,
        resource,
        context: createContext("editor"),
        data: [],
      });
      expect(editorVm.bulkActions[0].allowed).toBe(false);
      expect(editorVm.bulkActions[1].allowed).toBe(true);
    });

    it("defaultSort を正しく評価する", () => {
      const resource = createResource();
      const context = createContext("admin");
      const viewWithSort: ListView = {
        ...listView,
        defaultSort: {
          field: "createdAt",
          order: "desc",
        },
      };

      const vm = evaluateListView({
        view: viewWithSort,
        resource,
        context,
        data: [],
      });

      expect(vm.defaultSort).toEqual({
        field: "createdAt",
        order: "desc",
      });
    });

    it("defaultSort がない場合は undefined", () => {
      const resource = createResource();
      const context = createContext("admin");

      const vm = evaluateListView({
        view: listView,
        resource,
        context,
        data: [],
      });

      expect(vm.defaultSort).toBeUndefined();
    });

    it("clickAction を正しく評価する", () => {
      const resource = createResource();
      const context = createContext("admin");
      const viewWithClick: ListView = {
        ...listView,
        clickAction: "show",
      };

      const vm = evaluateListView({
        view: viewWithClick,
        resource,
        context,
        data: [],
      });

      expect(vm.clickAction).toBe("show");
    });

    it("clickAction がない場合は undefined", () => {
      const resource = createResource();
      const context = createContext("admin");

      const vm = evaluateListView({
        view: listView,
        resource,
        context,
        data: [],
      });

      expect(vm.clickAction).toBeUndefined();
    });
  });

  describe("evaluateShowView", () => {
    const showView: ShowView = {
      resource: "Post",
      type: "show",
      fields: ["title", "status", "author", "tags", "createdAt"],
      actions: [
        {
          id: "edit",
          label: "編集",
          placement: "header",
          allowedWhen: "role == 'admin'",
        },
      ],
    };

    it("ShowViewModel を生成できる", () => {
      const resource = createResource();
      const context = createContext("admin");
      const data = {
        id: "1",
        title: "Hello",
        status: "published",
        author: { id: "user-1", name: "田中太郎" },
        tags: [{ id: "tag-1", name: "tech" }],
        createdAt: "2024-01-01",
      };

      const vm = evaluateShowView({ view: showView, resource, context, data });

      expect(vm.type).toBe("show");
      expect(vm.id).toBe("1");
      expect(vm.fields).toHaveLength(5);
      expect(vm.fields[0]).toMatchObject({
        name: "title",
        value: "Hello",
      });
    });

    it("リレーションフィールドの値を正しく変換する", () => {
      const resource = createResource();
      const context = createContext("admin");
      const data = {
        id: "1",
        title: "Hello",
        status: "published",
        author: { id: "user-1", name: "田中太郎" },
        tags: [
          { id: "tag-1", name: "tech" },
          { id: "tag-2", name: "news" },
        ],
        createdAt: "2024-01-01",
      };

      const vm = evaluateShowView({ view: showView, resource, context, data });

      // 単一リレーション
      const authorField = vm.fields.find((f) => f.name === "author");
      expect(authorField?.kind).toBe("relation");
      expect(authorField?.value).toEqual({ id: "user-1", name: "田中太郎" });
      expect(authorField?.ui).toMatchObject({ hint: "avatar" });

      // 複数リレーション
      const tagsField = vm.fields.find((f) => f.name === "tags");
      expect(tagsField?.kind).toBe("relation");
      expect(tagsField?.value).toEqual([
        { id: "tag-1", name: "tech" },
        { id: "tag-2", name: "news" },
      ]);
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

    it("存在しないフィールドでエラーになる", () => {
      const resource = createResource();
      const context = createContext("admin");
      const invalidView: ShowView = {
        ...showView,
        fields: ["nonexistent"],
      };

      expect(() =>
        evaluateShowView({
          view: invalidView,
          resource,
          context,
          data: { id: "1" },
        }),
      ).toThrow(EvaluateError);
    });
  });

  describe("evaluateFormView", () => {
    const formView: FormView = {
      resource: "Post",
      type: "form",
      fields: ["title", "status", "author", "tags"],
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
      expect(vm.fields).toHaveLength(4);
      expect(vm.isValid).toBe(true);
      expect(vm.isDirty).toBe(false);
    });

    it("リレーションフィールドのフォーム定義を正しく変換する", () => {
      const resource = createResource();
      const context = createContext("admin");
      const data = {
        id: "1",
        title: "Hello",
        status: "published",
        author: { id: "user-1", name: "田中太郎" },
        tags: [
          { id: "tag-1", name: "tech" },
          { id: "tag-2", name: "news" },
        ],
      };

      const vm = evaluateFormView({
        view: formView,
        resource,
        context,
        data,
        mode: "edit",
      });

      // 単一リレーション
      const authorField = vm.fields.find((f) => f.name === "author");
      expect(authorField?.kind).toBe("relation");
      expect(authorField?.required).toBe(true);
      expect(authorField?.value).toEqual({ id: "user-1", name: "田中太郎" });
      expect(authorField?.ui).toMatchObject({
        hint: "avatar",
        inputHint: "autocomplete",
      });

      // 複数リレーション
      const tagsField = vm.fields.find((f) => f.name === "tags");
      expect(tagsField?.kind).toBe("relation");
      expect(tagsField?.required).toBe(false);
      expect(tagsField?.value).toEqual([
        { id: "tag-1", name: "tech" },
        { id: "tag-2", name: "news" },
      ]);
      expect(tagsField?.validation).toMatchObject({ maxItems: 5 });
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

    it("存在しないフィールドでエラーになる", () => {
      const resource = createResource();
      const context = createContext("admin");
      const invalidView: FormView = {
        ...formView,
        fields: ["nonexistent"],
      };

      expect(() =>
        evaluateFormView({
          view: invalidView,
          resource,
          context,
          mode: "create",
        }),
      ).toThrow(EvaluateError);
    });
  });
});
