import { describe, it, expect } from "vitest";
import {
  parseSpec,
  evaluateListView,
  evaluateShowView,
  evaluateFormView,
  validateForm,
  type Context,
  type ListView,
  type ShowView,
  type FormView,
} from "../../src/index.js";

/**
 * 統合テスト: 実際のユースケースを想定したフロー
 * JSON Spec → parseSpec → evaluate → validate
 */

const sampleSpecJson = `{
  "version": "0.1",
  "resources": [
    {
      "name": "articles",
      "label": "記事",
      "fields": [
        {
          "name": "id",
          "type": "int32",
          "label": "ID"
        },
        {
          "name": "title",
          "type": "string",
          "label": "タイトル",
          "validation": {
            "required": true,
            "minLength": 1,
            "maxLength": 100
          }
        },
        {
          "name": "body",
          "type": "string",
          "kind": "longText",
          "label": "本文",
          "validation": {
            "required": true
          }
        },
        {
          "name": "status",
          "type": "string",
          "label": "ステータス"
        },
        {
          "name": "author_id",
          "type": "int32",
          "label": "著者ID"
        },
        {
          "name": "tags",
          "type": "Tag[]",
          "label": "タグ",
          "validation": {
            "minItems": 1,
            "maxItems": 5
          }
        }
      ]
    }
  ],
  "views": [
    {
      "resource": "articles",
      "type": "list",
      "columns": ["id", "title", "status"],
      "actions": [
        {
          "id": "create",
          "label": "新規作成",
          "allowedWhen": "role == 'admin'"
        }
      ],
      "rowActions": []
    },
    {
      "resource": "articles",
      "type": "show",
      "fields": ["id", "title", "body", "status", "author_id", "tags"],
      "actions": [
        {
          "id": "edit",
          "label": "編集",
          "allowedWhen": "role == 'admin' || user_id == 'author_id'"
        },
        {
          "id": "delete",
          "label": "削除",
          "allowedWhen": "role == 'admin'"
        },
        {
          "id": "publish",
          "label": "公開",
          "allowedWhen": "status == 'draft' && role == 'admin'"
        }
      ]
    },
    {
      "resource": "articles",
      "type": "form",
      "fields": ["title", "body", "tags"],
      "actions": [
        {
          "id": "save",
          "label": "保存"
        },
        {
          "id": "cancel",
          "label": "キャンセル"
        }
      ]
    }
  ]
}`;

// ヘルパー: リソースとビューを取得
function getResourceAndView<T>(
  spec: ReturnType<typeof parseSpec>,
  viewType: string,
) {
  const resource = spec.resources[0];
  const view = spec.views.find(
    (v) => v.type === viewType && v.resource === "articles",
  ) as T;
  return { resource, view };
}

describe("統合テスト: 記事管理", () => {
  const spec = parseSpec(sampleSpecJson);
  const resource = spec.resources[0];

  describe("一覧画面 (ListView)", () => {
    it("管理者は新規作成ボタンが表示される", () => {
      const { resource, view } = getResourceAndView<ListView>(spec, "list");
      const context: Context = {
        user: {},
        role: "admin",
        permissions: [],
        custom: {},
      };
      const vm = evaluateListView({
        view,
        resource,
        context,
        data: [],
      });

      expect(vm.type).toBe("list");
      expect(vm.label).toBe("記事");
      expect(vm.fields).toHaveLength(3);
      expect(vm.fields.map((f) => f.name)).toEqual(["id", "title", "status"]);

      const createAction = vm.pageActions.find((a) => a.id === "create");
      expect(createAction?.allowed).toBe(true);
    });

    it("一般ユーザーは新規作成ボタンが非表示", () => {
      const { resource, view } = getResourceAndView<ListView>(spec, "list");
      const context: Context = {
        user: {},
        role: "user",
        permissions: [],
        custom: {},
      };
      const vm = evaluateListView({
        view,
        resource,
        context,
        data: [],
      });

      const createAction = vm.pageActions.find((a) => a.id === "create");
      expect(createAction?.allowed).toBe(false);
    });
  });

  describe("詳細画面 (ShowView)", () => {
    const articleData = {
      id: 1,
      title: "テスト記事",
      body: "本文です",
      status: "draft",
      author_id: 2,
      tags: ["tech", "news"],
    };

    it("管理者は全アクションが許可される", () => {
      const { resource, view } = getResourceAndView<ShowView>(spec, "show");
      const context: Context = {
        user: {},
        role: "admin",
        permissions: [],
        custom: {},
      };
      const vm = evaluateShowView({
        view,
        resource,
        context,
        data: articleData,
      });

      expect(vm.type).toBe("show");
      expect(vm.fields).toHaveLength(6);

      expect(vm.actions.find((a) => a.id === "edit")?.allowed).toBe(true);
      expect(vm.actions.find((a) => a.id === "delete")?.allowed).toBe(true);
      expect(vm.actions.find((a) => a.id === "publish")?.allowed).toBe(true);
    });

    it("一般ユーザーは編集も削除も不可", () => {
      const { resource, view } = getResourceAndView<ShowView>(spec, "show");
      const context: Context = {
        user: {},
        role: "user",
        permissions: [],
        custom: {},
      };
      const vm = evaluateShowView({
        view,
        resource,
        context,
        data: articleData,
      });

      expect(vm.actions.find((a) => a.id === "edit")?.allowed).toBe(false);
      expect(vm.actions.find((a) => a.id === "delete")?.allowed).toBe(false);
    });

    it("公開済み記事は publish アクションが非表示", () => {
      const { resource, view } = getResourceAndView<ShowView>(spec, "show");
      const context: Context = {
        user: {},
        role: "admin",
        permissions: [],
        custom: {},
      };
      const publishedArticle = { ...articleData, status: "published" };
      const vm = evaluateShowView({
        view,
        resource,
        context,
        data: publishedArticle,
      });

      expect(vm.actions.find((a) => a.id === "publish")?.allowed).toBe(false);
    });
  });

  describe("編集フォーム (FormView)", () => {
    it("フォームフィールドが正しく取得できる", () => {
      const { resource, view } = getResourceAndView<FormView>(spec, "form");
      const context: Context = {
        user: {},
        role: "admin",
        permissions: [],
        custom: {},
      };
      const vm = evaluateFormView({
        view,
        resource,
        context,
        mode: "create",
      });

      expect(vm.type).toBe("form");
      expect(vm.label).toBe("記事");
      expect(vm.fields).toHaveLength(3);
      expect(vm.fields.map((f) => f.name)).toEqual(["title", "body", "tags"]);

      // バリデーションルールが含まれている
      const titleField = vm.fields.find((f) => f.name === "title");
      expect(titleField?.validation?.required).toBe(true);
      expect(titleField?.validation?.maxLength).toBe(100);
    });
  });

  describe("フォームバリデーション", () => {
    const formFields = resource.fields.filter((f) =>
      ["title", "body", "tags"].includes(f.name),
    );

    it("正常なデータはエラーなし", () => {
      const data = {
        title: "有効なタイトル",
        body: "本文があります",
        tags: ["tag1", "tag2"],
      };
      const errors = validateForm(formFields, data);
      expect(Object.keys(errors)).toHaveLength(0);
    });

    it("必須フィールドが空でエラー", () => {
      const data = {
        title: "",
        body: "",
        tags: ["tag1"],
      };
      const errors = validateForm(formFields, data);
      expect(errors.title).toContain("タイトルは必須です");
      expect(errors.body).toContain("本文は必須です");
    });

    it("タイトルが長すぎるとエラー", () => {
      const data = {
        title: "あ".repeat(101),
        body: "本文",
        tags: ["tag1"],
      };
      const errors = validateForm(formFields, data);
      expect(errors.title).toContain("100文字以内で入力してください");
    });

    it("タグが少なすぎるとエラー", () => {
      const data = {
        title: "タイトル",
        body: "本文",
        tags: [],
      };
      const errors = validateForm(formFields, data);
      expect(errors.tags).toContain("1件以上選択してください");
    });

    it("タグが多すぎるとエラー", () => {
      const data = {
        title: "タイトル",
        body: "本文",
        tags: ["a", "b", "c", "d", "e", "f"],
      };
      const errors = validateForm(formFields, data);
      expect(errors.tags).toContain("5件以内で選択してください");
    });
  });

  describe("フルフロー: 記事作成", () => {
    it("一覧 → フォーム → バリデーション → 保存の流れ", () => {
      const context: Context = {
        user: {},
        role: "admin",
        permissions: [],
        custom: {},
      };

      // 1. 一覧画面で新規作成ボタンが有効か確認
      const { resource, view: listView } = getResourceAndView<ListView>(
        spec,
        "list",
      );
      const listVm = evaluateListView({
        view: listView,
        resource,
        context,
        data: [],
      });
      const canCreate = listVm.pageActions.find(
        (a) => a.id === "create",
      )?.allowed;
      expect(canCreate).toBe(true);

      // 2. フォーム画面を取得
      const { view: formView } = getResourceAndView<FormView>(spec, "form");
      const formVm = evaluateFormView({
        view: formView,
        resource,
        context,
        mode: "create",
      });
      expect(formVm.fields.length).toBeGreaterThan(0);

      // 3. 不正なデータでバリデーション
      const invalidData = { title: "", body: "", tags: [] };
      const formFields = resource.fields.filter((f) =>
        formVm.fields.map((vf) => vf.name).includes(f.name),
      );
      const errors = validateForm(formFields, invalidData);
      expect(Object.keys(errors).length).toBeGreaterThan(0);

      // 4. 正しいデータでバリデーション
      const validData = {
        title: "新しい記事",
        body: "これは新しい記事の本文です",
        tags: ["tech"],
      };
      const noErrors = validateForm(formFields, validData);
      expect(Object.keys(noErrors)).toHaveLength(0);

      // 5. 保存後、詳細画面で確認
      const savedArticle = {
        id: 100,
        ...validData,
        status: "draft",
        author_id: 1,
      };
      const { view: showView } = getResourceAndView<ShowView>(spec, "show");
      const showVm = evaluateShowView({
        view: showView,
        resource,
        context,
        data: savedArticle,
      });
      expect(showVm.id).toBe("100");
    });
  });
});
