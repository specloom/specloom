import { describe, it, expect } from "vitest";
import { Serialize } from "../../src/serialize/index.js";
import type { FormViewModel } from "../../src/ui/types.js";

const createFormVM = (overrides?: Partial<FormViewModel>): FormViewModel => ({
  type: "form",
  resource: "Post",
  label: "投稿",
  mode: "edit",
  id: "1",
  fields: [
    {
      name: "title",
      label: "タイトル",
      kind: "text",
      value: "テスト記事",
      required: true,
      readonly: false,
      errors: [],
    },
    {
      name: "content",
      label: "本文",
      kind: "textarea",
      value: "本文です",
      required: false,
      readonly: false,
      errors: [],
    },
    {
      name: "status",
      label: "ステータス",
      kind: "enum",
      value: "draft",
      required: true,
      readonly: false,
      errors: [],
    },
    {
      name: "publishedAt",
      label: "公開日",
      kind: "datetime",
      value: new Date("2024-01-15T10:00:00Z"),
      required: false,
      readonly: false,
      errors: [],
    },
    {
      name: "empty",
      label: "空",
      kind: "text",
      value: null,
      required: false,
      readonly: false,
      errors: [],
    },
    {
      name: "blank",
      label: "空文字",
      kind: "text",
      value: "",
      required: false,
      readonly: false,
      errors: [],
    },
  ],
  actions: [],
  isValid: true,
  isDirty: false,
  ...overrides,
});

describe("Serialize", () => {
  describe("formData", () => {
    it("フォームデータをオブジェクトに変換できる", () => {
      const vm = createFormVM();
      const data = Serialize.formData(vm);

      expect(data.title).toBe("テスト記事");
      expect(data.content).toBe("本文です");
      expect(data.status).toBe("draft");
    });

    it("Date を ISO 文字列に変換できる", () => {
      const vm = createFormVM();
      const data = Serialize.formData(vm);

      expect(data.publishedAt).toBe("2024-01-15T10:00:00.000Z");
    });

    it("excludeNull で null を除外できる", () => {
      const vm = createFormVM();
      const data = Serialize.formData(vm, { excludeNull: true });

      expect(data).not.toHaveProperty("empty");
      expect(data).toHaveProperty("blank");
    });

    it("excludeEmpty で空文字を除外できる", () => {
      const vm = createFormVM();
      const data = Serialize.formData(vm, { excludeEmpty: true });

      expect(data).not.toHaveProperty("blank");
    });

    it("dateFormat で日付形式を指定できる", () => {
      const vm = createFormVM();

      const iso = Serialize.formData(vm, { dateFormat: "iso" });
      expect(iso.publishedAt).toBe("2024-01-15T10:00:00.000Z");

      const timestamp = Serialize.formData(vm, { dateFormat: "timestamp" });
      expect(timestamp.publishedAt).toBe(new Date("2024-01-15T10:00:00Z").getTime());

      const dateOnly = Serialize.formData(vm, { dateFormat: "date-only" });
      expect(dateOnly.publishedAt).toBe("2024-01-15");
    });
  });

  describe("dirtyFields", () => {
    it("変更されたフィールドのみ抽出できる", () => {
      const vm = createFormVM();
      const original = {
        title: "元のタイトル",
        content: "本文です",
        status: "draft",
      };

      const dirty = Serialize.dirtyFields(vm, original);

      expect(dirty).toHaveProperty("title");
      expect(dirty.title).toBe("テスト記事");
      expect(dirty).not.toHaveProperty("content");
      expect(dirty).not.toHaveProperty("status");
    });

    it("配列の変更を検出できる", () => {
      const vm = createFormVM({
        fields: [
          {
            name: "tags",
            label: "タグ",
            kind: "tags",
            value: ["a", "b", "c"],
            required: false,
            readonly: false,
            errors: [],
          },
        ],
      });

      const original = { tags: ["a", "b"] };
      const dirty = Serialize.dirtyFields(vm, original);

      expect(dirty).toHaveProperty("tags");
    });

    it("オブジェクトの変更を検出できる", () => {
      const vm = createFormVM({
        fields: [
          {
            name: "author",
            label: "著者",
            kind: "relation",
            value: { id: "2", name: "鈴木" },
            required: false,
            readonly: false,
            errors: [],
          },
        ],
      });

      const original = { author: { id: "1", name: "田中" } };
      const dirty = Serialize.dirtyFields(vm, original);

      expect(dirty).toHaveProperty("author");
    });
  });

  describe("queryParams", () => {
    it("オブジェクトをクエリパラメータに変換できる", () => {
      const params = { page: 1, status: "draft", search: "テスト" };
      const result = Serialize.queryParams(params);

      expect(result).toContain("page=1");
      expect(result).toContain("status=draft");
      expect(result).toContain("search=");
    });

    it("null/undefined は除外される", () => {
      const params = { page: 1, status: null, search: undefined };
      const result = Serialize.queryParams(params);

      expect(result).toContain("page=1");
      expect(result).not.toContain("status");
      expect(result).not.toContain("search");
    });

    it("配列を bracket 形式で変換できる", () => {
      const params = { tags: ["a", "b"] };
      const result = Serialize.queryParams(params, { arrayFormat: "bracket" });

      expect(result).toContain("tags%5B%5D=a");
      expect(result).toContain("tags%5B%5D=b");
    });

    it("配列を index 形式で変換できる", () => {
      const params = { tags: ["a", "b"] };
      const result = Serialize.queryParams(params, { arrayFormat: "index" });

      expect(result).toContain("tags%5B0%5D=a");
      expect(result).toContain("tags%5B1%5D=b");
    });

    it("配列を comma 形式で変換できる", () => {
      const params = { tags: ["a", "b", "c"] };
      const result = Serialize.queryParams(params, { arrayFormat: "comma" });

      expect(result).toBe("tags=a%2Cb%2Cc");
    });

    it("オブジェクトは JSON 文字列化される", () => {
      const params = { filter: { status: "draft" } };
      const result = Serialize.queryParams(params);

      expect(result).toContain("filter=");
    });
  });

  describe("json", () => {
    it("フォームデータを JSON 文字列に変換できる", () => {
      const vm = createFormVM();
      const json = Serialize.json(vm);

      const parsed = JSON.parse(json);
      expect(parsed.title).toBe("テスト記事");
    });

    it("pretty オプションで整形できる", () => {
      const vm = createFormVM();
      const json = Serialize.json(vm, { pretty: true });

      expect(json).toContain("\n");
      expect(json).toContain("  ");
    });
  });

  describe("listFilters", () => {
    it("フィルターをクエリパラメータに変換できる", () => {
      const filters = { status: "draft", tags: ["tech", "news"] };
      const result = Serialize.listFilters(filters);

      expect(result).toContain("status=draft");
      expect(result).toContain("tags%5B%5D=tech");
    });
  });

  describe("pagination", () => {
    it("ページネーションパラメータを生成できる", () => {
      const params = Serialize.pagination(2, 20);

      expect(params.page).toBe(2);
      expect(params.pageSize).toBe(20);
    });

    it("カスタムキーを指定できる", () => {
      const params = Serialize.pagination(2, 20, {
        pageKey: "p",
        sizeKey: "limit",
      });

      expect(params.p).toBe(2);
      expect(params.limit).toBe(20);
    });
  });

  describe("sort", () => {
    it("ソートパラメータを生成できる", () => {
      const params = Serialize.sort("title", "asc");

      expect(params.sortField).toBe("title");
      expect(params.sortOrder).toBe("asc");
    });

    it("カスタムキーを指定できる", () => {
      const params = Serialize.sort("title", "desc", {
        fieldKey: "orderBy",
        orderKey: "direction",
      });

      expect(params.orderBy).toBe("title");
      expect(params.direction).toBe("desc");
    });

    it("combined 形式で生成できる", () => {
      const params = Serialize.sort("title", "asc", { combined: true });

      expect(params.sort).toBe("title:asc");
    });
  });
});
