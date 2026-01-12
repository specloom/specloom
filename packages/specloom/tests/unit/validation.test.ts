import { describe, it, expect } from "vitest";
import { validateField, validateForm } from "../../src/validation/index.js";
import type { Field } from "../../src/spec/index.js";

describe("validation", () => {
  describe("validateField", () => {
    describe("required", () => {
      const field: Field = {
        name: "title",
        type: "string",
        label: "タイトル",
        required: true,
      };

      it("値があればエラーなし", () => {
        expect(validateField(field, "Hello")).toEqual([]);
      });

      it("null でエラー", () => {
        const errors = validateField(field, null);
        expect(errors).toHaveLength(1);
        expect(errors[0]).toContain("必須");
      });

      it("undefined でエラー", () => {
        const errors = validateField(field, undefined);
        expect(errors).toHaveLength(1);
      });

      it("空文字でエラー", () => {
        const errors = validateField(field, "");
        expect(errors).toHaveLength(1);
      });

      it("空配列でエラー", () => {
        const errors = validateField(field, []);
        expect(errors).toHaveLength(1);
      });
    });

    describe("minLength / maxLength", () => {
      const field: Field = {
        name: "title",
        type: "string",
        label: "タイトル",
        validation: { minLength: 3, maxLength: 10 },
      };

      it("範囲内ならエラーなし", () => {
        expect(validateField(field, "Hello")).toEqual([]);
      });

      it("minLength 未満でエラー", () => {
        const errors = validateField(field, "ab");
        expect(errors).toHaveLength(1);
        expect(errors[0]).toContain("3文字以上");
      });

      it("maxLength 超過でエラー", () => {
        const errors = validateField(field, "12345678901");
        expect(errors).toHaveLength(1);
        expect(errors[0]).toContain("10文字以内");
      });
    });

    describe("min / max", () => {
      const field: Field = {
        name: "price",
        type: "int32",
        label: "価格",
        validation: { min: 0, max: 1000 },
      };

      it("範囲内ならエラーなし", () => {
        expect(validateField(field, 500)).toEqual([]);
      });

      it("min 未満でエラー", () => {
        const errors = validateField(field, -1);
        expect(errors).toHaveLength(1);
        expect(errors[0]).toContain("0以上");
      });

      it("max 超過でエラー", () => {
        const errors = validateField(field, 1001);
        expect(errors).toHaveLength(1);
        expect(errors[0]).toContain("1000以下");
      });
    });

    describe("minItems / maxItems", () => {
      const field: Field = {
        name: "tags",
        type: "Tag[]",
        label: "タグ",
        validation: { minItems: 1, maxItems: 3 },
      };

      it("範囲内ならエラーなし", () => {
        expect(validateField(field, ["a", "b"])).toEqual([]);
      });

      it("minItems 未満でエラー", () => {
        const errors = validateField(field, []);
        expect(errors).toHaveLength(1);
        expect(errors[0]).toContain("1件以上");
      });

      it("maxItems 超過でエラー", () => {
        const errors = validateField(field, ["a", "b", "c", "d"]);
        expect(errors).toHaveLength(1);
        expect(errors[0]).toContain("3件以内");
      });
    });

    describe("pattern", () => {
      it("email パターン", () => {
        const field: Field = {
          name: "email",
          type: "string",
          label: "メール",
          validation: { pattern: "email" },
        };

        expect(validateField(field, "test@example.com")).toEqual([]);
        expect(validateField(field, "invalid")).toHaveLength(1);
      });

      it("url パターン", () => {
        const field: Field = {
          name: "website",
          type: "string",
          label: "URL",
          validation: { pattern: "url" },
        };

        expect(validateField(field, "https://example.com")).toEqual([]);
        expect(validateField(field, "not a url")).toHaveLength(1);
      });

      it("tel パターン", () => {
        const field: Field = {
          name: "phone",
          type: "string",
          label: "電話番号",
          validation: { pattern: "tel" },
        };

        expect(validateField(field, "03-1234-5678")).toEqual([]);
        expect(validateField(field, "abc")).toHaveLength(1);
      });

      it("カスタム正規表現", () => {
        const field: Field = {
          name: "code",
          type: "string",
          label: "コード",
          validation: { pattern: "^[A-Z]{3}$" },
        };

        expect(validateField(field, "ABC")).toEqual([]);
        expect(validateField(field, "abc")).toHaveLength(1);
        expect(validateField(field, "ABCD")).toHaveLength(1);
      });
    });

    describe("オプショナルフィールド", () => {
      const field: Field = {
        name: "description",
        type: "string",
        label: "説明",
        validation: { maxLength: 100 },
      };

      it("値がなければバリデーションをスキップ", () => {
        expect(validateField(field, null)).toEqual([]);
        expect(validateField(field, undefined)).toEqual([]);
        expect(validateField(field, "")).toEqual([]);
      });
    });
  });

  describe("validateForm", () => {
    const fields: Field[] = [
      { name: "title", type: "string", label: "タイトル", required: true },
      { name: "price", type: "int32", label: "価格", validation: { min: 0 } },
    ];

    it("有効なデータならエラーなし", () => {
      const errors = validateForm(fields, { title: "Hello", price: 100 });
      expect(errors).toEqual({});
    });

    it("複数フィールドのエラーを返す", () => {
      const errors = validateForm(fields, { title: "", price: -1 });
      expect(errors.title).toHaveLength(1);
      expect(errors.price).toHaveLength(1);
    });

    it("エラーのないフィールドは含まない", () => {
      const errors = validateForm(fields, { title: "", price: 100 });
      expect(errors.title).toHaveLength(1);
      expect(errors.price).toBeUndefined();
    });
  });
});
