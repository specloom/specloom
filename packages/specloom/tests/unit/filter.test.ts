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
          operator: "eq",
          value: "published",
        };
        expect(evaluateFilter(filter, data)).toBe(true);

        const filter2: FilterExpression = {
          field: "status",
          operator: "eq",
          value: "draft",
        };
        expect(evaluateFilter(filter2, data)).toBe(false);
      });

      it("ne: 等しくない", () => {
        const filter: FilterExpression = {
          field: "status",
          operator: "ne",
          value: "draft",
        };
        expect(evaluateFilter(filter, data)).toBe(true);

        const filter2: FilterExpression = {
          field: "status",
          operator: "ne",
          value: "published",
        };
        expect(evaluateFilter(filter2, data)).toBe(false);
      });

      it("gt: より大きい", () => {
        const filter: FilterExpression = {
          field: "price",
          operator: "gt",
          value: 500,
        };
        expect(evaluateFilter(filter, data)).toBe(true);

        const filter2: FilterExpression = {
          field: "price",
          operator: "gt",
          value: 1000,
        };
        expect(evaluateFilter(filter2, data)).toBe(false);
      });

      it("gte: 以上", () => {
        const filter: FilterExpression = {
          field: "price",
          operator: "gte",
          value: 1000,
        };
        expect(evaluateFilter(filter, data)).toBe(true);

        const filter2: FilterExpression = {
          field: "price",
          operator: "gte",
          value: 1001,
        };
        expect(evaluateFilter(filter2, data)).toBe(false);
      });

      it("lt: より小さい", () => {
        const filter: FilterExpression = {
          field: "count",
          operator: "lt",
          value: 10,
        };
        expect(evaluateFilter(filter, data)).toBe(true);
      });

      it("lte: 以下", () => {
        const filter: FilterExpression = {
          field: "count",
          operator: "lte",
          value: 5,
        };
        expect(evaluateFilter(filter, data)).toBe(true);
      });
    });

    describe("文字列演算子", () => {
      it("contains: 部分一致", () => {
        const filter: FilterExpression = {
          field: "title",
          operator: "contains",
          value: "World",
        };
        expect(evaluateFilter(filter, data)).toBe(true);

        const filter2: FilterExpression = {
          field: "title",
          operator: "contains",
          value: "React",
        };
        expect(evaluateFilter(filter2, data)).toBe(false);
      });

      it("starts_with: 前方一致", () => {
        const filter: FilterExpression = {
          field: "title",
          operator: "starts_with",
          value: "Hello",
        };
        expect(evaluateFilter(filter, data)).toBe(true);

        const filter2: FilterExpression = {
          field: "title",
          operator: "starts_with",
          value: "World",
        };
        expect(evaluateFilter(filter2, data)).toBe(false);
      });

      it("ends_with: 後方一致", () => {
        const filter: FilterExpression = {
          field: "title",
          operator: "ends_with",
          value: "World",
        };
        expect(evaluateFilter(filter, data)).toBe(true);
      });

      it("matches: 正規表現", () => {
        const filter: FilterExpression = {
          field: "title",
          operator: "matches",
          value: "^Hello.*$",
        };
        expect(evaluateFilter(filter, data)).toBe(true);

        const filter2: FilterExpression = {
          field: "title",
          operator: "matches",
          value: "^Goodbye.*$",
        };
        expect(evaluateFilter(filter2, data)).toBe(false);
      });

      it("ilike: 大文字小文字を区別しない部分一致", () => {
        const filter: FilterExpression = {
          field: "title",
          operator: "ilike",
          value: "hello",
        };
        expect(evaluateFilter(filter, data)).toBe(true);

        const filter2: FilterExpression = {
          field: "title",
          operator: "ilike",
          value: "WORLD",
        };
        expect(evaluateFilter(filter2, data)).toBe(true);

        const filter3: FilterExpression = {
          field: "title",
          operator: "ilike",
          value: "React",
        };
        expect(evaluateFilter(filter3, data)).toBe(false);
      });
    });

    describe("集合演算子", () => {
      it("in: いずれかに一致", () => {
        const filter: FilterExpression = {
          field: "status",
          operator: "in",
          value: ["draft", "published", "archived"],
        };
        expect(evaluateFilter(filter, data)).toBe(true);

        const filter2: FilterExpression = {
          field: "status",
          operator: "in",
          value: ["draft", "archived"],
        };
        expect(evaluateFilter(filter2, data)).toBe(false);
      });

      it("not_in: いずれにも一致しない", () => {
        const filter: FilterExpression = {
          field: "status",
          operator: "not_in",
          value: ["draft", "archived"],
        };
        expect(evaluateFilter(filter, data)).toBe(true);

        const filter2: FilterExpression = {
          field: "status",
          operator: "not_in",
          value: ["published", "archived"],
        };
        expect(evaluateFilter(filter2, data)).toBe(false);
      });
    });

    describe("存在演算子", () => {
      it("is_null: null である", () => {
        const filter: FilterExpression = {
          field: "description",
          operator: "is_null",
          value: true,
        };
        expect(evaluateFilter(filter, data)).toBe(true);

        const filter2: FilterExpression = {
          field: "title",
          operator: "is_null",
          value: true,
        };
        expect(evaluateFilter(filter2, data)).toBe(false);

        const filter3: FilterExpression = {
          field: "title",
          operator: "is_null",
          value: false,
        };
        expect(evaluateFilter(filter3, data)).toBe(true);
      });

      it("is_empty: 空である", () => {
        const filter: FilterExpression = {
          field: "items",
          operator: "is_empty",
          value: true,
        };
        expect(evaluateFilter(filter, data)).toBe(true);

        const filter2: FilterExpression = {
          field: "tags",
          operator: "is_empty",
          value: true,
        };
        expect(evaluateFilter(filter2, data)).toBe(false);

        const filter3: FilterExpression = {
          field: "tags",
          operator: "is_empty",
          value: false,
        };
        expect(evaluateFilter(filter3, data)).toBe(true);
      });
    });

    describe("配列演算子", () => {
      it("has_any: いずれかを含む", () => {
        const filter: FilterExpression = {
          field: "tags",
          operator: "has_any",
          value: ["tech", "sports"],
        };
        expect(evaluateFilter(filter, data)).toBe(true);

        const filter2: FilterExpression = {
          field: "tags",
          operator: "has_any",
          value: ["sports", "music"],
        };
        expect(evaluateFilter(filter2, data)).toBe(false);
      });

      it("has_all: すべてを含む", () => {
        const filter: FilterExpression = {
          field: "tags",
          operator: "has_all",
          value: ["tech", "news"],
        };
        expect(evaluateFilter(filter, data)).toBe(true);

        const filter2: FilterExpression = {
          field: "tags",
          operator: "has_all",
          value: ["tech", "sports"],
        };
        expect(evaluateFilter(filter2, data)).toBe(false);
      });

      it("has_none: いずれも含まない", () => {
        const filter: FilterExpression = {
          field: "tags",
          operator: "has_none",
          value: ["sports", "music"],
        };
        expect(evaluateFilter(filter, data)).toBe(true);

        const filter2: FilterExpression = {
          field: "tags",
          operator: "has_none",
          value: ["tech", "music"],
        };
        expect(evaluateFilter(filter2, data)).toBe(false);
      });
    });

    describe("論理演算子", () => {
      it("and: すべて満たす", () => {
        const filter: FilterExpression = {
          and: [
            { field: "status", operator: "eq", value: "published" },
            { field: "price", operator: "gte", value: 500 },
          ],
        };
        expect(evaluateFilter(filter, data)).toBe(true);

        const filter2: FilterExpression = {
          and: [
            { field: "status", operator: "eq", value: "published" },
            { field: "price", operator: "gte", value: 2000 },
          ],
        };
        expect(evaluateFilter(filter2, data)).toBe(false);
      });

      it("or: いずれかを満たす", () => {
        const filter: FilterExpression = {
          or: [
            { field: "status", operator: "eq", value: "draft" },
            { field: "price", operator: "gte", value: 500 },
          ],
        };
        expect(evaluateFilter(filter, data)).toBe(true);

        const filter2: FilterExpression = {
          or: [
            { field: "status", operator: "eq", value: "draft" },
            { field: "price", operator: "gte", value: 2000 },
          ],
        };
        expect(evaluateFilter(filter2, data)).toBe(false);
      });

      it("not: 否定", () => {
        const filter: FilterExpression = {
          not: { field: "status", operator: "eq", value: "draft" },
        };
        expect(evaluateFilter(filter, data)).toBe(true);

        const filter2: FilterExpression = {
          not: { field: "status", operator: "eq", value: "published" },
        };
        expect(evaluateFilter(filter2, data)).toBe(false);
      });

      it("複合条件: 公開中 かつ (tech タグ または 高価格)", () => {
        const filter: FilterExpression = {
          and: [
            { field: "status", operator: "eq", value: "published" },
            {
              or: [
                { field: "tags", operator: "has_any", value: ["tech"] },
                { field: "price", operator: "gte", value: 5000 },
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
          operator: "eq",
          value: "admin",
        };
        expect(evaluateFilter(filter, data)).toBe(true);

        const filter2: FilterExpression = {
          field: "author.name",
          operator: "contains",
          value: "田中",
        };
        expect(evaluateFilter(filter2, data)).toBe(true);

        const filter3: FilterExpression = {
          field: "author.id",
          operator: "eq",
          value: "user-1",
        };
        expect(evaluateFilter(filter3, data)).toBe(true);
      });

      it("存在しないパスは undefined として扱う", () => {
        const filter: FilterExpression = {
          field: "author.email",
          operator: "is_null",
          value: true,
        };
        expect(evaluateFilter(filter, data)).toBe(true);

        const filter2: FilterExpression = {
          field: "nonexistent.field",
          operator: "eq",
          value: "test",
        };
        expect(evaluateFilter(filter2, data)).toBe(false);
      });
    });
  });

  describe("isFilterExpression", () => {
    it("有効な FilterCondition を検出する", () => {
      expect(
        isFilterExpression({
          field: "status",
          operator: "eq",
          value: "published",
        }),
      ).toBe(true);
    });

    it("有効な AND 式を検出する", () => {
      expect(
        isFilterExpression({
          and: [
            { field: "status", operator: "eq", value: "published" },
            { field: "price", operator: "gte", value: 100 },
          ],
        }),
      ).toBe(true);
    });

    it("有効な OR 式を検出する", () => {
      expect(
        isFilterExpression({
          or: [
            { field: "status", operator: "eq", value: "draft" },
            { field: "status", operator: "eq", value: "published" },
          ],
        }),
      ).toBe(true);
    });

    it("有効な NOT 式を検出する", () => {
      expect(
        isFilterExpression({
          not: { field: "status", operator: "eq", value: "archived" },
        }),
      ).toBe(true);
    });

    it("無効な値を拒否する", () => {
      expect(isFilterExpression(null)).toBe(false);
      expect(isFilterExpression(undefined)).toBe(false);
      expect(isFilterExpression("string")).toBe(false);
      expect(isFilterExpression(123)).toBe(false);
      expect(isFilterExpression({})).toBe(false);
      expect(isFilterExpression({ field: "status" })).toBe(false);
      expect(isFilterExpression({ field: "status", operator: "eq" })).toBe(
        false,
      );
    });

    it("ネストした式を検証する", () => {
      expect(
        isFilterExpression({
          and: [
            { field: "status", operator: "eq", value: "published" },
            {
              or: [
                { field: "category", operator: "eq", value: "news" },
                { field: "featured", operator: "eq", value: true },
              ],
            },
          ],
        }),
      ).toBe(true);

      // 不正なネスト
      expect(
        isFilterExpression({
          and: [
            { field: "status", operator: "eq", value: "published" },
            "invalid",
          ],
        }),
      ).toBe(false);
    });
  });

  describe("エッジケース", () => {
    const data = {
      status: "published",
      title: "Hello World",
      nested: {
        deep: {
          value: 42,
        },
      },
      items: [],
    };

    it("matches: 不正な正規表現は false を返す", () => {
      const filter: FilterExpression = {
        field: "title",
        operator: "matches",
        value: "[invalid(",
      };
      expect(evaluateFilter(filter, data)).toBe(false);
    });

    it("matches: 非文字列フィールドは false を返す", () => {
      const filter: FilterExpression = {
        field: "nested",
        operator: "matches",
        value: ".*",
      };
      expect(evaluateFilter(filter, data)).toBe(false);
    });

    it("matches: 非文字列パターンは false を返す", () => {
      const filter: FilterExpression = {
        field: "title",
        operator: "matches",
        value: 123 as unknown as string,
      };
      expect(evaluateFilter(filter, data)).toBe(false);
    });

    it("深くネストしたパスを解決できる", () => {
      const filter: FilterExpression = {
        field: "nested.deep.value",
        operator: "eq",
        value: 42,
      };
      expect(evaluateFilter(filter, data)).toBe(true);
    });

    it("配列インデックスを含むパスも解決できる", () => {
      const dataWithArray = {
        items: [{ name: "first" }, { name: "second" }],
      };
      const filter: FilterExpression = {
        field: "items.0.name",
        operator: "eq",
        value: "first",
      };
      expect(evaluateFilter(filter, dataWithArray)).toBe(true);

      const filter2: FilterExpression = {
        field: "items.1.name",
        operator: "eq",
        value: "second",
      };
      expect(evaluateFilter(filter2, dataWithArray)).toBe(true);
    });

    it("未知の演算子は false を返す", () => {
      const filter = {
        field: "status",
        operator: "unknown" as FilterExpression extends { operator: infer O }
          ? O
          : never,
        value: "published",
      } as FilterExpression;
      expect(evaluateFilter(filter, data)).toBe(false);
    });

    it("プリミティブ値の途中でネストアクセスすると undefined を返す", () => {
      const filter: FilterExpression = {
        field: "status.nested.value",
        operator: "eq",
        value: "something",
      };
      expect(evaluateFilter(filter, data)).toBe(false);
    });
  });
});
