import { describe, it, expect } from "vitest";
import { evaluateFilter, isFilterExpression } from "../../src/filter/index.js";
import type { FilterExpression } from "../../src/spec/index.js";

describe("filter", () => {
  describe("evaluateFilter", () => {
    const data = {
      status: "published",
      title: "Hello World",
      price: 1000,
      count: 5,
      tags: ["tech", "news"],
      author: {
        id: "user-1",
        name: "田中太郎",
        role: "admin",
      },
      description: null,
      items: [],
    };

    describe("比較演算子", () => {
      it("eq: 等しい", () => {
        const filter: FilterExpression = {
          field: "status",
          op: "eq",
          value: "published",
        };
        expect(evaluateFilter(filter, data)).toBe(true);

        const filter2: FilterExpression = {
          field: "status",
          op: "eq",
          value: "draft",
        };
        expect(evaluateFilter(filter2, data)).toBe(false);
      });

      it("ne: 等しくない", () => {
        const filter: FilterExpression = {
          field: "status",
          op: "ne",
          value: "draft",
        };
        expect(evaluateFilter(filter, data)).toBe(true);

        const filter2: FilterExpression = {
          field: "status",
          op: "ne",
          value: "published",
        };
        expect(evaluateFilter(filter2, data)).toBe(false);
      });

      it("gt: より大きい", () => {
        const filter: FilterExpression = {
          field: "price",
          op: "gt",
          value: 500,
        };
        expect(evaluateFilter(filter, data)).toBe(true);

        const filter2: FilterExpression = {
          field: "price",
          op: "gt",
          value: 1000,
        };
        expect(evaluateFilter(filter2, data)).toBe(false);
      });

      it("gte: 以上", () => {
        const filter: FilterExpression = {
          field: "price",
          op: "gte",
          value: 1000,
        };
        expect(evaluateFilter(filter, data)).toBe(true);

        const filter2: FilterExpression = {
          field: "price",
          op: "gte",
          value: 1001,
        };
        expect(evaluateFilter(filter2, data)).toBe(false);
      });

      it("lt: より小さい", () => {
        const filter: FilterExpression = {
          field: "count",
          op: "lt",
          value: 10,
        };
        expect(evaluateFilter(filter, data)).toBe(true);
      });

      it("lte: 以下", () => {
        const filter: FilterExpression = {
          field: "count",
          op: "lte",
          value: 5,
        };
        expect(evaluateFilter(filter, data)).toBe(true);
      });
    });

    describe("文字列演算子", () => {
      it("contains: 部分一致", () => {
        const filter: FilterExpression = {
          field: "title",
          op: "contains",
          value: "World",
        };
        expect(evaluateFilter(filter, data)).toBe(true);

        const filter2: FilterExpression = {
          field: "title",
          op: "contains",
          value: "React",
        };
        expect(evaluateFilter(filter2, data)).toBe(false);
      });

      it("startsWith: 前方一致", () => {
        const filter: FilterExpression = {
          field: "title",
          op: "startsWith",
          value: "Hello",
        };
        expect(evaluateFilter(filter, data)).toBe(true);

        const filter2: FilterExpression = {
          field: "title",
          op: "startsWith",
          value: "World",
        };
        expect(evaluateFilter(filter2, data)).toBe(false);
      });

      it("endsWith: 後方一致", () => {
        const filter: FilterExpression = {
          field: "title",
          op: "endsWith",
          value: "World",
        };
        expect(evaluateFilter(filter, data)).toBe(true);
      });

      it("matches: 正規表現", () => {
        const filter: FilterExpression = {
          field: "title",
          op: "matches",
          value: "^Hello.*$",
        };
        expect(evaluateFilter(filter, data)).toBe(true);

        const filter2: FilterExpression = {
          field: "title",
          op: "matches",
          value: "^Goodbye.*$",
        };
        expect(evaluateFilter(filter2, data)).toBe(false);
      });
    });

    describe("集合演算子", () => {
      it("in: いずれかに一致", () => {
        const filter: FilterExpression = {
          field: "status",
          op: "in",
          value: ["draft", "published", "archived"],
        };
        expect(evaluateFilter(filter, data)).toBe(true);

        const filter2: FilterExpression = {
          field: "status",
          op: "in",
          value: ["draft", "archived"],
        };
        expect(evaluateFilter(filter2, data)).toBe(false);
      });

      it("notIn: いずれにも一致しない", () => {
        const filter: FilterExpression = {
          field: "status",
          op: "notIn",
          value: ["draft", "archived"],
        };
        expect(evaluateFilter(filter, data)).toBe(true);

        const filter2: FilterExpression = {
          field: "status",
          op: "notIn",
          value: ["published", "archived"],
        };
        expect(evaluateFilter(filter2, data)).toBe(false);
      });
    });

    describe("存在演算子", () => {
      it("isNull: null である", () => {
        const filter: FilterExpression = {
          field: "description",
          op: "isNull",
          value: true,
        };
        expect(evaluateFilter(filter, data)).toBe(true);

        const filter2: FilterExpression = {
          field: "title",
          op: "isNull",
          value: true,
        };
        expect(evaluateFilter(filter2, data)).toBe(false);

        const filter3: FilterExpression = {
          field: "title",
          op: "isNull",
          value: false,
        };
        expect(evaluateFilter(filter3, data)).toBe(true);
      });

      it("isEmpty: 空である", () => {
        const filter: FilterExpression = {
          field: "items",
          op: "isEmpty",
          value: true,
        };
        expect(evaluateFilter(filter, data)).toBe(true);

        const filter2: FilterExpression = {
          field: "tags",
          op: "isEmpty",
          value: true,
        };
        expect(evaluateFilter(filter2, data)).toBe(false);

        const filter3: FilterExpression = {
          field: "tags",
          op: "isEmpty",
          value: false,
        };
        expect(evaluateFilter(filter3, data)).toBe(true);
      });
    });

    describe("配列演算子", () => {
      it("hasAny: いずれかを含む", () => {
        const filter: FilterExpression = {
          field: "tags",
          op: "hasAny",
          value: ["tech", "sports"],
        };
        expect(evaluateFilter(filter, data)).toBe(true);

        const filter2: FilterExpression = {
          field: "tags",
          op: "hasAny",
          value: ["sports", "music"],
        };
        expect(evaluateFilter(filter2, data)).toBe(false);
      });

      it("hasAll: すべてを含む", () => {
        const filter: FilterExpression = {
          field: "tags",
          op: "hasAll",
          value: ["tech", "news"],
        };
        expect(evaluateFilter(filter, data)).toBe(true);

        const filter2: FilterExpression = {
          field: "tags",
          op: "hasAll",
          value: ["tech", "sports"],
        };
        expect(evaluateFilter(filter2, data)).toBe(false);
      });

      it("hasNone: いずれも含まない", () => {
        const filter: FilterExpression = {
          field: "tags",
          op: "hasNone",
          value: ["sports", "music"],
        };
        expect(evaluateFilter(filter, data)).toBe(true);

        const filter2: FilterExpression = {
          field: "tags",
          op: "hasNone",
          value: ["tech", "music"],
        };
        expect(evaluateFilter(filter2, data)).toBe(false);
      });
    });

    describe("論理演算子", () => {
      it("and: すべて満たす", () => {
        const filter: FilterExpression = {
          and: [
            { field: "status", op: "eq", value: "published" },
            { field: "price", op: "gte", value: 500 },
          ],
        };
        expect(evaluateFilter(filter, data)).toBe(true);

        const filter2: FilterExpression = {
          and: [
            { field: "status", op: "eq", value: "published" },
            { field: "price", op: "gte", value: 2000 },
          ],
        };
        expect(evaluateFilter(filter2, data)).toBe(false);
      });

      it("or: いずれかを満たす", () => {
        const filter: FilterExpression = {
          or: [
            { field: "status", op: "eq", value: "draft" },
            { field: "price", op: "gte", value: 500 },
          ],
        };
        expect(evaluateFilter(filter, data)).toBe(true);

        const filter2: FilterExpression = {
          or: [
            { field: "status", op: "eq", value: "draft" },
            { field: "price", op: "gte", value: 2000 },
          ],
        };
        expect(evaluateFilter(filter2, data)).toBe(false);
      });

      it("not: 否定", () => {
        const filter: FilterExpression = {
          not: { field: "status", op: "eq", value: "draft" },
        };
        expect(evaluateFilter(filter, data)).toBe(true);

        const filter2: FilterExpression = {
          not: { field: "status", op: "eq", value: "published" },
        };
        expect(evaluateFilter(filter2, data)).toBe(false);
      });

      it("複合条件: 公開中 かつ (tech タグ または 高価格)", () => {
        const filter: FilterExpression = {
          and: [
            { field: "status", op: "eq", value: "published" },
            {
              or: [
                { field: "tags", op: "hasAny", value: ["tech"] },
                { field: "price", op: "gte", value: 5000 },
              ],
            },
          ],
        };
        expect(evaluateFilter(filter, data)).toBe(true);
      });
    });

    describe("リレーションフィルター", () => {
      it("ドット記法でネストした値を参照できる", () => {
        const filter: FilterExpression = {
          field: "author.role",
          op: "eq",
          value: "admin",
        };
        expect(evaluateFilter(filter, data)).toBe(true);

        const filter2: FilterExpression = {
          field: "author.name",
          op: "contains",
          value: "田中",
        };
        expect(evaluateFilter(filter2, data)).toBe(true);

        const filter3: FilterExpression = {
          field: "author.id",
          op: "eq",
          value: "user-1",
        };
        expect(evaluateFilter(filter3, data)).toBe(true);
      });

      it("存在しないパスは undefined として扱う", () => {
        const filter: FilterExpression = {
          field: "author.email",
          op: "isNull",
          value: true,
        };
        expect(evaluateFilter(filter, data)).toBe(true);

        const filter2: FilterExpression = {
          field: "nonexistent.field",
          op: "eq",
          value: "test",
        };
        expect(evaluateFilter(filter2, data)).toBe(false);
      });
    });
  });

  describe("isFilterExpression", () => {
    it("有効な FilterCondition を検出する", () => {
      expect(
        isFilterExpression({ field: "status", op: "eq", value: "published" })
      ).toBe(true);
    });

    it("有効な AND 式を検出する", () => {
      expect(
        isFilterExpression({
          and: [
            { field: "status", op: "eq", value: "published" },
            { field: "price", op: "gte", value: 100 },
          ],
        })
      ).toBe(true);
    });

    it("有効な OR 式を検出する", () => {
      expect(
        isFilterExpression({
          or: [
            { field: "status", op: "eq", value: "draft" },
            { field: "status", op: "eq", value: "published" },
          ],
        })
      ).toBe(true);
    });

    it("有効な NOT 式を検出する", () => {
      expect(
        isFilterExpression({
          not: { field: "status", op: "eq", value: "archived" },
        })
      ).toBe(true);
    });

    it("無効な値を拒否する", () => {
      expect(isFilterExpression(null)).toBe(false);
      expect(isFilterExpression(undefined)).toBe(false);
      expect(isFilterExpression("string")).toBe(false);
      expect(isFilterExpression(123)).toBe(false);
      expect(isFilterExpression({})).toBe(false);
      expect(isFilterExpression({ field: "status" })).toBe(false);
      expect(isFilterExpression({ field: "status", op: "eq" })).toBe(false);
    });

    it("ネストした式を検証する", () => {
      expect(
        isFilterExpression({
          and: [
            { field: "status", op: "eq", value: "published" },
            {
              or: [
                { field: "category", op: "eq", value: "news" },
                { field: "featured", op: "eq", value: true },
              ],
            },
          ],
        })
      ).toBe(true);

      // 不正なネスト
      expect(
        isFilterExpression({
          and: [{ field: "status", op: "eq", value: "published" }, "invalid"],
        })
      ).toBe(false);
    });
  });
});
