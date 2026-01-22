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
 * 統合テスト: リレーションフィールドのフロー
 * relation 型の author(単一), tags(複数) を含む記事管理
 */

const relationSpecJson = `{
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
          "name": "author",
          "type": "User",
          "label": "著者",
          "kind": "relation",
          "required": true,
          "relation": {
            "resource": "User",
            "labelField": "name"
          },
          "ui": {
            "hint": "avatar",
            "inputHint": "autocomplete"
          }
        },
        {
          "name": "tags",
          "type": "Tag[]",
          "label": "タグ",
          "kind": "relation",
          "relation": {
            "resource": "Tag",
            "labelField": "name"
          },
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
      "columns": ["id", "title", "author", "tags"],
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
      "fields": ["id", "title", "body", "status", "author", "tags"],
      "actions": [
        {
          "id": "edit",
          "label": "編集",
          "allowedWhen": "role == 'admin'"
        }
      ]
    },
    {
      "resource": "articles",
      "type": "form",
      "fields": ["title", "body", "author", "tags"],
      "actions": [
        {
          "id": "save",
          "label": "保存"
        }
      ]
    }
  ]
}`;

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

describe("統合テスト: リレーションフィールド", () => {
  const spec = parseSpec(relationSpecJson);
  const resource = spec.resources[0];

  describe("リレーションフィールド定義", () => {
    it("単一リレーション (author) が正しく定義される", () => {
      const authorField = resource.fields.find((f) => f.name === "author");
      expect(authorField).toBeDefined();
      expect(authorField?.kind).toBe("relation");
      expect(authorField?.type).toBe("User");
      expect(authorField?.relation).toEqual({
        resource: "User",
        labelField: "name",
      });
      expect(authorField?.ui?.hint).toBe("avatar");
      expect(authorField?.ui?.inputHint).toBe("autocomplete");
    });

    it("複数リレーション (tags) が正しく定義される", () => {
      const tagsField = resource.fields.find((f) => f.name === "tags");
      expect(tagsField).toBeDefined();
      expect(tagsField?.kind).toBe("relation");
      expect(tagsField?.type).toBe("Tag[]");
      expect(tagsField?.relation).toEqual({
        resource: "Tag",
        labelField: "name",
      });
      expect(tagsField?.validation?.minItems).toBe(1);
      expect(tagsField?.validation?.maxItems).toBe(5);
    });
  });

  describe("一覧画面 (ListView) でのリレーション", () => {
    it("リレーションカラムが含まれる", () => {
      const { resource, view } = getResourceAndView<ListView>(spec, "list");
      const context: Context = { role: "admin" };
      const vm = evaluateListView({
        view,
        resource,
        context,
        data: [],
      });

      expect(vm.fields.map((f) => f.name)).toContain("author");
      expect(vm.fields.map((f) => f.name)).toContain("tags");

      const authorField = vm.fields.find((f) => f.name === "author");
      expect(authorField?.kind).toBe("relation");

      const tagsField = vm.fields.find((f) => f.name === "tags");
      expect(tagsField?.kind).toBe("relation");
    });
  });

  describe("詳細画面 (ShowView) でのリレーション", () => {
    const articleWithRelations = {
      id: 1,
      title: "リレーションテスト記事",
      body: "本文です",
      status: "published",
      author: { id: 10, name: "山田花子" },
      tags: [
        { id: 1, name: "TypeScript" },
        { id: 2, name: "React" },
      ],
    };

    it("リレーションデータが表示される", () => {
      const { resource, view } = getResourceAndView<ShowView>(spec, "show");
      const context: Context = { role: "user" };
      const vm = evaluateShowView({
        view,
        resource,
        context,
        data: articleWithRelations,
      });

      expect(vm.fields).toHaveLength(6);
      expect(vm.fields.map((f) => f.name)).toContain("author");
      expect(vm.fields.map((f) => f.name)).toContain("tags");

      const authorField = vm.fields.find((f) => f.name === "author");
      expect(authorField?.kind).toBe("relation");
      expect(authorField?.relation?.resource).toBe("User");
    });
  });

  describe("フォーム (FormView) でのリレーション", () => {
    it("リレーションフィールドがフォームに含まれる", () => {
      const { resource, view } = getResourceAndView<FormView>(spec, "form");
      const context: Context = { role: "admin" };
      const vm = evaluateFormView({
        view,
        resource,
        context,
        mode: "create",
      });

      expect(vm.fields.map((f) => f.name)).toContain("author");
      expect(vm.fields.map((f) => f.name)).toContain("tags");

      const authorField = vm.fields.find((f) => f.name === "author");
      expect(authorField?.kind).toBe("relation");
      expect(authorField?.ui?.inputHint).toBe("autocomplete");

      const tagsField = vm.fields.find((f) => f.name === "tags");
      expect(tagsField?.kind).toBe("relation");
      expect(tagsField?.validation?.maxItems).toBe(5);
    });
  });

  describe("リレーションフィールドのバリデーション", () => {
    const formFields = resource.fields.filter((f) =>
      ["title", "body", "author", "tags"].includes(f.name),
    );

    it("正常なリレーションデータはエラーなし", () => {
      const data = {
        title: "テスト記事",
        body: "本文です",
        author: { id: 1, name: "田中" },
        tags: [{ id: 1, name: "tech" }],
      };
      const errors = validateForm(formFields, data);
      expect(Object.keys(errors)).toHaveLength(0);
    });

    it("タグが多すぎるとエラー", () => {
      const data = {
        title: "テスト記事",
        body: "本文です",
        author: { id: 1, name: "田中" },
        tags: [
          { id: 1, name: "a" },
          { id: 2, name: "b" },
          { id: 3, name: "c" },
          { id: 4, name: "d" },
          { id: 5, name: "e" },
          { id: 6, name: "f" },
        ],
      };
      const errors = validateForm(formFields, data);
      expect(errors.tags).toContain("5件以内で選択してください");
    });

    it("タグが空だとエラー", () => {
      const data = {
        title: "テスト記事",
        body: "本文です",
        author: { id: 1, name: "田中" },
        tags: [],
      };
      const errors = validateForm(formFields, data);
      expect(errors.tags).toContain("1件以上選択してください");
    });
  });

  describe("フルフロー: リレーションを含む記事作成", () => {
    it("作成 → 詳細表示の流れ", () => {
      const context: Context = { role: "admin" };

      // 1. フォーム画面を取得
      const { resource, view: formView } = getResourceAndView<FormView>(
        spec,
        "form",
      );
      const formVm = evaluateFormView({
        view: formView,
        resource,
        context,
        mode: "create",
      });
      expect(formVm.fields.map((f) => f.name)).toContain("author");
      expect(formVm.fields.map((f) => f.name)).toContain("tags");

      // 2. バリデーション
      const formFields = resource.fields.filter((f) =>
        formVm.fields.map((vf) => vf.name).includes(f.name),
      );
      const validData = {
        title: "新しい記事",
        body: "リレーションテストの本文",
        author: { id: 5, name: "佐藤次郎" },
        tags: [
          { id: 10, name: "testing" },
          { id: 11, name: "integration" },
        ],
      };
      const errors = validateForm(formFields, validData);
      expect(Object.keys(errors)).toHaveLength(0);

      // 3. 保存後、詳細画面で確認
      const savedArticle = {
        id: 999,
        ...validData,
        status: "draft",
      };
      const { view: showView } = getResourceAndView<ShowView>(spec, "show");
      const showVm = evaluateShowView({
        view: showView,
        resource,
        context,
        data: savedArticle,
      });
      expect(showVm.id).toBe("999");
      expect(showVm.fields.find((f) => f.name === "author")?.kind).toBe(
        "relation",
      );
      expect(showVm.fields.find((f) => f.name === "tags")?.kind).toBe(
        "relation",
      );
    });
  });
});
