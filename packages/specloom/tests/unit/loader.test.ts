import { describe, it, expect } from "vitest";
import { parseSpec, validateSpec, SpecError } from "../../src/loader/index.js";

describe("loader", () => {
  describe("parseSpec", () => {
    it("有効な JSON をパースできる", () => {
      const json = JSON.stringify({
        version: "0.1",
        resources: [],
        views: [],
      });

      const spec = parseSpec(json);

      expect(spec.version).toBe("0.1");
      expect(spec.resources).toEqual([]);
      expect(spec.views).toEqual([]);
    });

    it("無効な JSON でエラーになる", () => {
      expect(() => parseSpec("invalid json")).toThrow();
    });
  });

  describe("validateSpec", () => {
    it("有効な Spec を検証できる", () => {
      const data = {
        version: "0.1",
        resources: [
          {
            name: "Post",
            fields: [{ name: "id", type: "string" }],
          },
        ],
        views: [
          {
            resource: "Post",
            type: "list",
            columns: ["id"],
            actions: [],
          },
        ],
      };

      const spec = validateSpec(data);

      expect(spec.version).toBe("0.1");
      expect(spec.resources).toHaveLength(1);
      expect(spec.views).toHaveLength(1);
    });

    it("リレーションフィールドを含む Spec を検証できる", () => {
      const data = {
        version: "0.1",
        resources: [
          {
            name: "Post",
            label: "投稿",
            fields: [
              { name: "id", type: "string", readonly: true },
              {
                name: "title",
                type: "string",
                label: "タイトル",
                kind: "text",
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
            ],
          },
          {
            name: "User",
            label: "ユーザー",
            fields: [
              { name: "id", type: "string", readonly: true },
              { name: "name", type: "string", label: "名前" },
            ],
          },
          {
            name: "Tag",
            label: "タグ",
            fields: [
              { name: "id", type: "string", readonly: true },
              { name: "name", type: "string", label: "名前" },
            ],
          },
        ],
        views: [
          {
            resource: "Post",
            type: "list",
            columns: ["title", "author", "tags"],
            actions: [],
          },
        ],
      };

      const spec = validateSpec(data);

      expect(spec.resources).toHaveLength(3);

      const postResource = spec.resources.find((r) => r.name === "Post");
      expect(postResource).toBeDefined();

      // 単一リレーション (User)
      const authorField = postResource?.fields.find((f) => f.name === "author");
      expect(authorField?.type).toBe("User");
      expect(authorField?.kind).toBe("relation");
      expect(authorField?.relation).toEqual({
        resource: "User",
        labelField: "name",
      });
      expect(authorField?.ui).toMatchObject({
        hint: "avatar",
        inputHint: "autocomplete",
      });

      // 複数リレーション (Tag[])
      const tagsField = postResource?.fields.find((f) => f.name === "tags");
      expect(tagsField?.type).toBe("Tag[]");
      expect(tagsField?.kind).toBe("relation");
      expect(tagsField?.relation).toEqual({
        resource: "Tag",
        labelField: "name",
      });
      expect(tagsField?.validation).toMatchObject({ maxItems: 5 });
    });

    it("version がない場合エラーになる", () => {
      const data = {
        resources: [],
        views: [],
      };

      expect(() => validateSpec(data)).toThrow(SpecError);
    });

    it("サポートされていない version でエラーになる", () => {
      const data = {
        version: "0.2",
        resources: [],
        views: [],
      };

      expect(() => validateSpec(data)).toThrow("Unsupported version");
    });

    it("resources がない場合エラーになる", () => {
      const data = {
        version: "0.1",
        views: [],
      };

      expect(() => validateSpec(data)).toThrow("resources array");
    });

    it("views がない場合エラーになる", () => {
      const data = {
        version: "0.1",
        resources: [],
      };

      expect(() => validateSpec(data)).toThrow("views array");
    });

    it("オブジェクト以外でエラーになる", () => {
      expect(() => validateSpec(null)).toThrow("must be an object");
      expect(() => validateSpec("string")).toThrow("must be an object");
      expect(() => validateSpec([])).toThrow("must be an object");
    });
  });
});
