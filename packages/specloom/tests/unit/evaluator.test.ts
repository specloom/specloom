import { describe, it, expect } from "vitest";
import {
  evaluateListView,
  evaluateShowView,
  evaluateFormView,
  evaluateExpression,
  EvaluateError,
} from "../../src/evaluator/index.js";
import { i18n } from "../../src/i18n/index.js";
import type {
  Resource,
  ListView,
  ShowView,
  FormView,
} from "../../src/spec/index.js";
import type { Context } from "../../src/vm/index.js";

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

    it("比較演算子（>, >=, <, <=）を評価できる", () => {
      const context = createContext("admin");
      const data = { count: 10, createdAt: "2024-01-15" };
      expect(evaluateExpression("count > 5", context, data)).toBe(true);
      expect(evaluateExpression("count >= 10", context, data)).toBe(true);
      expect(evaluateExpression("count < 10", context, data)).toBe(false);
      expect(evaluateExpression("count <= 10", context, data)).toBe(true);
      expect(
        evaluateExpression("createdAt >= '2024-01-01'", context, data),
      ).toBe(true);
    });

    it("OR/AND は短絡評価する", () => {
      const context = createContext("admin");
      expect(evaluateExpression("true || role > 1", context, {})).toBe(true);
      expect(evaluateExpression("false && role > 1", context, {})).toBe(false);
    });

    it("括弧を含む複合式を評価できる", () => {
      const context = createContext("editor");
      const data = { status: "draft" };
      expect(
        evaluateExpression(
          "(role == 'admin' || role == 'editor') && status == 'draft'",
          context,
          data,
        ),
      ).toBe(true);
      expect(
        evaluateExpression(
          "role == 'admin' || (role == 'editor' && status == 'published')",
          context,
          data,
        ),
      ).toBe(false);
    });

    it("不正な式は false を返す", () => {
      const context = createContext("admin");
      expect(evaluateExpression("invalid expression", context, {})).toBe(false);
      expect(evaluateExpression("(role == 'admin'", context, {})).toBe(false);
    });
  });

  describe("evaluateListView", () => {
    const listView: ListView = {
      resource: "Post",
      type: "list",
      columns: ["title", "status", "author"],
      sortable: ["title"],
      searchable: ["title"],
      selectionMode: "multi",
      namedFilters: [
        { id: "all", label: "すべて", filter: {} },
        { id: "draft", label: "下書き", filter: { status: "draft" } },
      ],
      actions: [
        {
          id: "create",
          label: "新規作成",
          allowedWhen: "role == 'admin'",
        },
      ],
      rowActions: [
        { id: "edit", label: "編集" },
        {
          id: "delete",
          label: "削除",
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

    it("pageActions の allowed を評価する", () => {
      const resource = createResource();
      const data: Record<string, unknown>[] = [];

      // admin の場合
      const adminVm = evaluateListView({
        view: listView,
        resource,
        context: createContext("admin"),
        data,
      });
      expect(adminVm.pageActions[0].allowed).toBe(true);

      // editor の場合
      const editorVm = evaluateListView({
        view: listView,
        resource,
        context: createContext("editor"),
        data,
      });
      expect(editorVm.pageActions[0].allowed).toBe(false);
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

    it("namedFilter の条件式で operator/op を正規化する", () => {
      const resource = createResource();
      const context = createContext("admin");
      const data: Record<string, unknown>[] = [];
      const viewWithExpression: ListView = {
        ...listView,
        namedFilters: [
          {
            id: "published",
            label: "公開中",
            filter: { field: "status", operator: "eq", value: "published" },
          },
          {
            id: "draft",
            label: "下書き",
            filter: { field: "status", op: "eq", value: "draft" },
          },
          {
            id: "starts-with",
            label: "前方一致",
            filter: { field: "title", operator: "startsWith", value: "Hello" },
          },
        ],
      };

      const vm = evaluateListView({
        view: viewWithExpression,
        resource,
        context,
        data,
      });

      expect(vm.filters.named[0].filter).toEqual({
        field: "status",
        operator: "eq",
        value: "published",
      });
      expect(vm.filters.named[1].filter).toEqual({
        field: "status",
        operator: "eq",
        value: "draft",
      });
      expect(vm.filters.named[2].filter).toEqual({
        field: "title",
        operator: "starts_with",
        value: "Hello",
      });
    });

    it("namedFilter の未知演算子は無効化される", () => {
      const resource = createResource();
      const context = createContext("admin");
      const data: Record<string, unknown>[] = [];
      const viewWithInvalidOperator: ListView = {
        ...listView,
        namedFilters: [
          {
            id: "invalid",
            label: "Invalid",
            filter: {
              field: "status",
              operator: "unknown_operator",
              value: "draft",
            },
          },
        ],
      };

      const vm = evaluateListView({
        view: viewWithInvalidOperator,
        resource,
        context,
        data,
      });

      expect(vm.filters.named[0].filter).toBeUndefined();
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
        selectionMode: "multi",
        actions: [
          ...listView.actions,
          {
            id: "bulkDelete",
            label: "一括削除",
            selection: "selected",
            allowedWhen: "role == 'admin'",
            confirm: "選択した項目を削除しますか？",
          },
          {
            id: "bulkPublish",
            label: "一括公開",
            selection: "selected",
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

    it("rowActions が未定義でも rows.actions は空配列になる", () => {
      const resource = createResource();
      const context = createContext("admin");
      const viewWithoutRowActions: ListView = {
        ...listView,
        rowActions: undefined,
      };
      const data = [{ id: "1", title: "Hello", status: "published" }];

      const vm = evaluateListView({
        view: viewWithoutRowActions,
        resource,
        context,
        data,
      });

      expect(vm.rows).toHaveLength(1);
      expect(vm.rows[0].actions).toEqual([]);
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

    it("ActionVM に dialog/api を引き継ぎ、confirm=true をローカライズする", () => {
      const resource = createResource();
      const context = createContext("admin");
      const viewWithDialog: ShowView = {
        ...showView,
        actions: [
          {
            id: "archive",
            label: "アーカイブ",
            confirm: true,
            dialog: {
              title: "理由を入力",
              fields: [{ name: "reason", label: "理由" }],
            },
            api: {
              path: "/posts/:id/archive",
              method: "POST",
              body: ["reason"],
            },
          },
        ],
      };

      const vm = evaluateShowView({
        view: viewWithDialog,
        resource,
        context,
        data: { id: "1", title: "Hello" },
      });

      expect(vm.actions[0].dialog).toEqual({
        title: "理由を入力",
        fields: [{ name: "reason", label: "理由" }],
      });
      expect(vm.actions[0].api).toEqual({
        path: "/posts/:id/archive",
        method: "POST",
        body: ["reason"],
      });
      expect(vm.actions[0].confirm).toBe(i18n.t().action.confirm);
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
        { id: "save", label: "保存" },
        { id: "cancel", label: "キャンセル" },
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

    it("createOnly フィールドは edit モードで readonly になる", () => {
      const resource = createResource();
      resource.fields.push({
        name: "inviteCode",
        type: "string",
        label: "招待コード",
        createOnly: true,
      });
      const viewWithCreateOnly: FormView = {
        ...formView,
        fields: [...formView.fields, "inviteCode"],
      };
      const context = createContext("admin");

      const createVm = evaluateFormView({
        view: viewWithCreateOnly,
        resource,
        context,
        mode: "create",
      });
      const editVm = evaluateFormView({
        view: viewWithCreateOnly,
        resource,
        context,
        data: { id: "1", inviteCode: "ABC123" },
        mode: "edit",
      });

      const createField = createVm.fields.find((f) => f.name === "inviteCode");
      const editField = editVm.fields.find((f) => f.name === "inviteCode");

      expect(createField?.createOnly).toBe(true);
      expect(createField?.readonly).toBe(false);
      expect(editField?.createOnly).toBe(true);
      expect(editField?.readonly).toBe(true);
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

    it("visibleWhen でフィールドの表示/非表示を評価する", () => {
      const resource = createResource();
      resource.fields.push({
        name: "category",
        type: "string",
        label: "カテゴリ",
        visibleWhen: "status == 'draft'",
      });
      const viewWithVisible: FormView = {
        ...formView,
        fields: [...formView.fields, "category"],
      };
      const context = createContext("admin");

      const draftVm = evaluateFormView({
        view: viewWithVisible,
        resource,
        context,
        data: { id: "1", status: "draft" },
        mode: "edit",
      });
      const publishedVm = evaluateFormView({
        view: viewWithVisible,
        resource,
        context,
        data: { id: "1", status: "published" },
        mode: "edit",
      });

      expect(draftVm.fields.find((f) => f.name === "category")?.visible).toBe(
        true,
      );
      expect(
        publishedVm.fields.find((f) => f.name === "category")?.visible,
      ).toBe(false);
    });

    it("visibleWhen がないフィールドは visible が undefined", () => {
      const resource = createResource();
      const context = createContext("admin");

      const vm = evaluateFormView({
        view: formView,
        resource,
        context,
        mode: "create",
      });

      expect(vm.fields[0].visible).toBeUndefined();
    });

    it("requiredWhen で条件付き必須を評価する", () => {
      const resource = createResource();
      resource.fields.push({
        name: "url",
        type: "string",
        label: "URL",
        requiredWhen: "status == 'published'",
      });
      const viewWithRequired: FormView = {
        ...formView,
        fields: [...formView.fields, "url"],
      };
      const context = createContext("admin");

      const draftVm = evaluateFormView({
        view: viewWithRequired,
        resource,
        context,
        data: { id: "1", status: "draft" },
        mode: "edit",
      });
      const publishedVm = evaluateFormView({
        view: viewWithRequired,
        resource,
        context,
        data: { id: "1", status: "published" },
        mode: "edit",
      });

      expect(draftVm.fields.find((f) => f.name === "url")?.required).toBe(
        false,
      );
      expect(publishedVm.fields.find((f) => f.name === "url")?.required).toBe(
        true,
      );
    });

    it("required と requiredWhen は OR で結合される", () => {
      const resource = createResource();
      resource.fields.push({
        name: "note",
        type: "string",
        label: "備考",
        required: true,
        requiredWhen: "status == 'published'",
      });
      const viewWithBoth: FormView = {
        ...formView,
        fields: [...formView.fields, "note"],
      };
      const context = createContext("admin");

      const vm = evaluateFormView({
        view: viewWithBoth,
        resource,
        context,
        data: { id: "1", status: "draft" },
        mode: "edit",
      });

      // required: true なので requiredWhen が false でも必須
      expect(vm.fields.find((f) => f.name === "note")?.required).toBe(true);
    });
  });

  describe("evaluateShowView - visibleWhen", () => {
    it("visibleWhen でフィールドの表示/非表示を評価する", () => {
      const resource = createResource();
      resource.fields.push({
        name: "category",
        type: "string",
        label: "カテゴリ",
        visibleWhen: "status == 'draft'",
      });
      const showView: ShowView = {
        resource: "Post",
        type: "show",
        fields: ["title", "status", "category"],
        actions: [],
      };
      const context = createContext("admin");

      const draftVm = evaluateShowView({
        view: showView,
        resource,
        context,
        data: { id: "1", title: "Hello", status: "draft", category: "tech" },
      });
      const publishedVm = evaluateShowView({
        view: showView,
        resource,
        context,
        data: {
          id: "1",
          title: "Hello",
          status: "published",
          category: "tech",
        },
      });

      expect(draftVm.fields.find((f) => f.name === "category")?.visible).toBe(
        true,
      );
      expect(
        publishedVm.fields.find((f) => f.name === "category")?.visible,
      ).toBe(false);
    });

    it("visibleWhen がないフィールドは visible が undefined", () => {
      const resource = createResource();
      const showView: ShowView = {
        resource: "Post",
        type: "show",
        fields: ["title"],
        actions: [],
      };
      const context = createContext("admin");

      const vm = evaluateShowView({
        view: showView,
        resource,
        context,
        data: { id: "1", title: "Hello" },
      });

      expect(vm.fields[0].visible).toBeUndefined();
    });
  });
});
