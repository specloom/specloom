import { describe, it, expect } from "vitest";
import { FormVM } from "../../src/vm/form.js";
import type { FormViewModel, FormFieldVM } from "../../src/vm/types.js";

// ============================================================
// Helper: FormFieldVM を簡潔に作成
// ============================================================
const field = (overrides: Partial<FormFieldVM> & Pick<FormFieldVM, "name" | "type" | "kind" | "value">): FormFieldVM => ({
  label: overrides.name,
  required: false,
  readonly: false,
  errors: [],
  ...overrides,
});

const createFormVM = (fields: FormFieldVM[]): FormVM =>
  new FormVM({
    type: "form",
    resource: "Test",
    label: "テスト",
    mode: "create",
    fields,
    actions: [],
    isValid: true,
    isDirty: false,
  });

describe("送信仕様 (Submit Specification)", () => {
  describe("プリミティブフィールド", () => {
    it("string はそのまま送信される", () => {
      const vm = createFormVM([
        field({ name: "name", type: "string", kind: "text", value: "渋谷店" }),
      ]);
      expect(vm.submittableValues).toEqual({ name: "渋谷店" });
    });

    it("int32 はそのまま送信される", () => {
      const vm = createFormVM([
        field({ name: "quantity", type: "int32", kind: "number", value: 5 }),
      ]);
      expect(vm.submittableValues).toEqual({ quantity: 5 });
    });

    it("float64 はそのまま送信される", () => {
      const vm = createFormVM([
        field({ name: "price", type: "float64", kind: "number", value: 99.99 }),
      ]);
      expect(vm.submittableValues).toEqual({ price: 99.99 });
    });

    it("boolean はそのまま送信される", () => {
      const vm = createFormVM([
        field({ name: "active", type: "boolean", kind: "boolean", value: true }),
      ]);
      expect(vm.submittableValues).toEqual({ active: true });
    });

    it("enum はそのまま送信される", () => {
      const vm = createFormVM([
        field({
          name: "status",
          type: "string",
          kind: "enum",
          value: "draft",
          options: [
            { value: "draft", label: "下書き" },
            { value: "published", label: "公開" },
          ],
        }),
      ]);
      expect(vm.submittableValues).toEqual({ status: "draft" });
    });

    it("null/undefined はそのまま送信される", () => {
      const vm = createFormVM([
        field({ name: "memo", type: "string", kind: "text", value: null }),
      ]);
      expect(vm.submittableValues).toEqual({ memo: null });
    });
  });

  describe("Date / DateTime フィールド", () => {
    it("date の Date オブジェクトは ISO date string に変換される", () => {
      const vm = createFormVM([
        field({
          name: "birthDate",
          type: "date",
          kind: "date",
          value: new Date("1990-05-15T00:00:00Z"),
        }),
      ]);
      expect(vm.submittableValues.birthDate).toBe("1990-05-15");
    });

    it("datetime の Date オブジェクトは ISO datetime string に変換される", () => {
      const vm = createFormVM([
        field({
          name: "createdAt",
          type: "datetime",
          kind: "datetime",
          value: new Date("2024-01-15T10:00:00Z"),
        }),
      ]);
      expect(vm.submittableValues.createdAt).toBe("2024-01-15T10:00:00.000Z");
    });

    it("date の文字列はそのまま送信される", () => {
      const vm = createFormVM([
        field({
          name: "openDate",
          type: "date",
          kind: "date",
          value: "2024-04-01",
        }),
      ]);
      expect(vm.submittableValues.openDate).toBe("2024-04-01");
    });

    it("datetime の文字列はそのまま送信される", () => {
      const vm = createFormVM([
        field({
          name: "createdAt",
          type: "datetime",
          kind: "datetime",
          value: "2024-01-15T10:00:00Z",
        }),
      ]);
      expect(vm.submittableValues.createdAt).toBe("2024-01-15T10:00:00Z");
    });
  });

  describe("Relation フィールド（スカラー型 → valueField 抽出）", () => {
    it("int32 型の relation は id を抽出して送信する（デフォルト valueField）", () => {
      const vm = createFormVM([
        field({
          name: "prefecture_id",
          type: "int32",
          kind: "relation",
          value: { id: 13, name: "東京", code: "13" },
          relation: { resource: "Prefecture", labelField: "name" },
        }),
      ]);
      expect(vm.submittableValues).toEqual({ prefecture_id: 13 });
    });

    it("string 型の relation は id を抽出して送信する", () => {
      const vm = createFormVM([
        field({
          name: "category_id",
          type: "string",
          kind: "relation",
          value: { id: "cat-1", name: "技術" },
          relation: { resource: "Category", labelField: "name" },
        }),
      ]);
      expect(vm.submittableValues).toEqual({ category_id: "cat-1" });
    });

    it("valueField を指定した場合はそのフィールドで抽出する", () => {
      const vm = createFormVM([
        field({
          name: "prefecture_code",
          type: "string",
          kind: "relation",
          value: { id: 13, name: "東京", code: "13" },
          relation: { resource: "Prefecture", labelField: "name", valueField: "code" },
        }),
      ]);
      expect(vm.submittableValues).toEqual({ prefecture_code: "13" });
    });

    it("値が既にスカラーの場合はそのまま送信する", () => {
      const vm = createFormVM([
        field({
          name: "prefecture_id",
          type: "int32",
          kind: "relation",
          value: 13,
          relation: { resource: "Prefecture", labelField: "name" },
        }),
      ]);
      expect(vm.submittableValues).toEqual({ prefecture_id: 13 });
    });

    it("null の relation フィールドはそのまま送信される", () => {
      const vm = createFormVM([
        field({
          name: "prefecture_id",
          type: "int32",
          kind: "relation",
          value: null,
          relation: { resource: "Prefecture", labelField: "name" },
        }),
      ]);
      expect(vm.submittableValues).toEqual({ prefecture_id: null });
    });
  });

  describe("Relation フィールド（Model 型 → オブジェクトそのまま）", () => {
    it("Model 型の relation はオブジェクトそのまま送信する", () => {
      const vm = createFormVM([
        field({
          name: "owner",
          type: "User",
          kind: "relation",
          value: { id: "u1", name: "田中太郎" },
          relation: { resource: "User", labelField: "name" },
        }),
      ]);
      expect(vm.submittableValues).toEqual({
        owner: { id: "u1", name: "田中太郎" },
      });
    });

    it("Prefecture 型の relation はオブジェクトそのまま送信する", () => {
      const vm = createFormVM([
        field({
          name: "prefecture",
          type: "Prefecture",
          kind: "relation",
          value: { id: 13, name: "東京", code: "13" },
          relation: { resource: "Prefecture", labelField: "name" },
        }),
      ]);
      expect(vm.submittableValues).toEqual({
        prefecture: { id: 13, name: "東京", code: "13" },
      });
    });
  });

  describe("複数リレーション（配列）", () => {
    it("Model[] 型はオブジェクト配列そのまま送信する", () => {
      const vm = createFormVM([
        field({
          name: "tags",
          type: "Tag[]",
          kind: "relation",
          value: [
            { id: 1, name: "tech" },
            { id: 2, name: "react" },
          ],
          relation: { resource: "Tag", labelField: "name" },
        }),
      ]);
      expect(vm.submittableValues).toEqual({
        tags: [
          { id: 1, name: "tech" },
          { id: 2, name: "react" },
        ],
      });
    });

    it("int32[] 型は ID 配列を抽出して送信する", () => {
      const vm = createFormVM([
        field({
          name: "tag_ids",
          type: "int32[]",
          kind: "relation",
          value: [
            { id: 1, name: "tech" },
            { id: 2, name: "react" },
            { id: 3, name: "vue" },
          ],
          relation: { resource: "Tag", labelField: "name" },
        }),
      ]);
      expect(vm.submittableValues).toEqual({
        tag_ids: [1, 2, 3],
      });
    });

    it("string[] 型は valueField で抽出した配列を送信する", () => {
      const vm = createFormVM([
        field({
          name: "tag_codes",
          type: "string[]",
          kind: "relation",
          value: [
            { id: 1, name: "tech", code: "T01" },
            { id: 2, name: "react", code: "T02" },
          ],
          relation: { resource: "Tag", labelField: "name", valueField: "code" },
        }),
      ]);
      expect(vm.submittableValues).toEqual({
        tag_codes: ["T01", "T02"],
      });
    });

    it("既にスカラー配列の場合はそのまま送信する", () => {
      const vm = createFormVM([
        field({
          name: "tag_ids",
          type: "int32[]",
          kind: "relation",
          value: [1, 2, 3],
          relation: { resource: "Tag", labelField: "name" },
        }),
      ]);
      expect(vm.submittableValues).toEqual({
        tag_ids: [1, 2, 3],
      });
    });
  });

  describe("readonly・非表示の除外", () => {
    it("readonly フィールドは送信から除外される", () => {
      const vm = createFormVM([
        field({ name: "id", type: "string", kind: "text", value: "1", readonly: true }),
        field({ name: "name", type: "string", kind: "text", value: "店舗A" }),
      ]);
      expect(vm.submittableValues).toEqual({ name: "店舗A" });
    });

    it("visible=false のフィールドは送信から除外される", () => {
      const vm = createFormVM([
        field({ name: "name", type: "string", kind: "text", value: "店舗A" }),
        field({ name: "hidden", type: "string", kind: "text", value: "秘密", visible: false }),
      ]);
      expect(vm.submittableValues).toEqual({ name: "店舗A" });
    });
  });

  describe("完全な例（Shop モデル）", () => {
    it("Shop の送信データが仕様通りに変換される", () => {
      const vm = createFormVM([
        field({ name: "id", type: "string", kind: "text", value: "s1", readonly: true }),
        field({ name: "name", type: "string", kind: "text", value: "渋谷店", required: true }),
        field({
          name: "prefecture_id",
          type: "int32",
          kind: "relation",
          value: { id: 13, name: "東京", code: "13" },
          relation: { resource: "Prefecture", labelField: "name" },
        }),
        field({
          name: "owner",
          type: "User",
          kind: "relation",
          value: { id: "u1", name: "田中太郎" },
          relation: { resource: "User", labelField: "name" },
        }),
        field({
          name: "openDate",
          type: "date",
          kind: "date",
          value: new Date("2024-04-01T00:00:00Z"),
        }),
      ]);

      expect(vm.submittableValues).toEqual({
        name: "渋谷店",
        prefecture_id: 13,
        owner: { id: "u1", name: "田中太郎" },
        openDate: "2024-04-01",
      });
    });
  });
});
