import { describe, it, expect, beforeEach } from "vitest";
import { Format } from "../../src/format/index.js";
import { i18n } from "../../src/i18n/index.js";

// テスト前にロケールをリセット
beforeEach(() => {
  i18n.setLocale("ja");
});

describe("Format", () => {
  describe("date", () => {
    it("Date オブジェクトをフォーマットできる", () => {
      const date = new Date("2024-01-15");
      const result = Format.date(date, { locale: "ja-JP" });
      expect(result).toContain("2024");
    });

    it("文字列をフォーマットできる", () => {
      const result = Format.date("2024-01-15", { locale: "ja-JP" });
      expect(result).toContain("2024");
    });

    it("null/undefined は空文字を返す", () => {
      expect(Format.date(null)).toBe("");
      expect(Format.date(undefined)).toBe("");
    });

    it("不正な日付は元の値を文字列化", () => {
      expect(Format.date("invalid")).toBe("invalid");
    });
  });

  describe("time", () => {
    it("Date オブジェクトの時刻をフォーマットできる", () => {
      const date = new Date("2024-01-15T14:30:00");
      const result = Format.time(date, { locale: "ja-JP" });
      expect(result).toMatch(/14|2/); // 24時間または12時間形式
    });

    it("null/undefined は空文字を返す", () => {
      expect(Format.time(null)).toBe("");
      expect(Format.time(undefined)).toBe("");
    });
  });

  describe("datetime", () => {
    it("Date オブジェクトをフォーマットできる", () => {
      const date = new Date("2024-01-15T14:30:00");
      const result = Format.datetime(date, { locale: "ja-JP" });
      expect(result).toContain("2024");
    });

    it("null/undefined は空文字を返す", () => {
      expect(Format.datetime(null)).toBe("");
      expect(Format.datetime(undefined)).toBe("");
    });
  });

  describe("number", () => {
    it("数値をフォーマットできる", () => {
      const result = Format.number(1234567, { locale: "ja-JP" });
      expect(result).toBe("1,234,567");
    });

    it("小数点以下の桁数を指定できる", () => {
      const result = Format.number(1234.5678, {
        locale: "en-US",
        maximumFractionDigits: 2,
      });
      expect(result).toBe("1,234.57");
    });

    it("文字列の数値も変換できる", () => {
      const result = Format.number("1234", { locale: "ja-JP" });
      expect(result).toBe("1,234");
    });

    it("null/undefined は空文字を返す", () => {
      expect(Format.number(null)).toBe("");
      expect(Format.number(undefined)).toBe("");
    });

    it("NaN は元の値を返す", () => {
      expect(Format.number("abc")).toBe("abc");
    });
  });

  describe("currency", () => {
    it("通貨形式でフォーマットできる", () => {
      const result = Format.currency(1234, {
        locale: "ja-JP",
        currency: "JPY",
      });
      expect(result).toContain("1,234");
      expect(result).toMatch(/¥|￥|円/);
    });

    it("USDでフォーマットできる", () => {
      const result = Format.currency(1234.56, {
        locale: "en-US",
        currency: "USD",
      });
      expect(result).toContain("$");
      expect(result).toContain("1,234.56");
    });

    it("null/undefined は空文字を返す", () => {
      expect(Format.currency(null)).toBe("");
      expect(Format.currency(undefined)).toBe("");
    });
  });

  describe("percent", () => {
    it("パーセント形式でフォーマットできる", () => {
      const result = Format.percent(0.1234, { locale: "ja-JP" });
      expect(result).toBe("12%");
    });

    it("小数点以下の桁数を指定できる", () => {
      const result = Format.percent(0.1234, {
        locale: "en-US",
        maximumFractionDigits: 1,
      });
      expect(result).toBe("12.3%");
    });

    it("null/undefined は空文字を返す", () => {
      expect(Format.percent(null)).toBe("");
      expect(Format.percent(undefined)).toBe("");
    });
  });

  describe("boolean", () => {
    it("true/false をラベルに変換できる", () => {
      expect(Format.boolean(true)).toBe("はい");
      expect(Format.boolean(false)).toBe("いいえ");
    });

    it("カスタムラベルを指定できる", () => {
      expect(Format.boolean(true, { true: "Yes", false: "No" })).toBe("Yes");
      expect(Format.boolean(false, { true: "Yes", false: "No" })).toBe("No");
    });

    it("null/undefined は空文字を返す", () => {
      expect(Format.boolean(null)).toBe("");
      expect(Format.boolean(undefined)).toBe("");
    });
  });

  describe("list", () => {
    it("配列をカンマ区切りでフォーマットできる", () => {
      expect(Format.list(["a", "b", "c"])).toBe("a, b, c");
    });

    it("区切り文字を指定できる", () => {
      expect(Format.list(["a", "b", "c"], " / ")).toBe("a / b / c");
    });

    it("null/undefined/空配列は空文字を返す", () => {
      expect(Format.list(null)).toBe("");
      expect(Format.list(undefined)).toBe("");
      expect(Format.list([])).toBe("");
    });
  });

  describe("truncate", () => {
    it("文字列を省略できる", () => {
      expect(Format.truncate("これは長いテキストです", 5)).toBe(
        "これは長い...",
      );
    });

    it("省略記号をカスタマイズできる", () => {
      expect(Format.truncate("これは長いテキストです", 5, "…")).toBe(
        "これは長い…",
      );
    });

    it("指定長以下なら省略しない", () => {
      expect(Format.truncate("短い", 10)).toBe("短い");
    });

    it("null/undefined は空文字を返す", () => {
      expect(Format.truncate(null, 10)).toBe("");
      expect(Format.truncate(undefined, 10)).toBe("");
    });
  });

  describe("fileSize", () => {
    it("バイト数をフォーマットできる", () => {
      expect(Format.fileSize(0)).toBe("0 B");
      expect(Format.fileSize(500)).toBe("500 B");
      expect(Format.fileSize(1024)).toBe("1.0 KB");
      expect(Format.fileSize(1536)).toBe("1.5 KB");
      expect(Format.fileSize(1048576)).toBe("1.0 MB");
      expect(Format.fileSize(1073741824)).toBe("1.0 GB");
    });

    it("null/undefined は空文字を返す", () => {
      expect(Format.fileSize(null)).toBe("");
      expect(Format.fileSize(undefined)).toBe("");
    });
  });

  describe("relative", () => {
    it("相対時間をフォーマットできる", () => {
      const now = new Date();
      const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
      const result = Format.relative(oneHourAgo, { locale: "ja-JP" });
      expect(result).toMatch(/1.*時間|hour/i);
    });

    it("null/undefined は空文字を返す", () => {
      expect(Format.relative(null)).toBe("");
      expect(Format.relative(undefined)).toBe("");
    });
  });

  describe("auto", () => {
    it("date 型を自動フォーマットできる", () => {
      const result = Format.auto("2024-01-15", "date");
      expect(result).toContain("2024");
    });

    it("datetime 型を自動フォーマットできる", () => {
      const result = Format.auto("2024-01-15T14:30:00", "datetime");
      expect(result).toContain("2024");
    });

    it("number 型を自動フォーマットできる", () => {
      const result = Format.auto(1234, "number", { locale: "ja-JP" });
      expect(result).toBe("1,234");
    });

    it("boolean 型を自動フォーマットできる", () => {
      expect(Format.auto(true, "boolean")).toBe("はい");
      expect(Format.auto(false, "boolean")).toBe("いいえ");
    });

    it("null/undefined は空文字を返す", () => {
      expect(Format.auto(null, "text")).toBe("");
      expect(Format.auto(undefined, "text")).toBe("");
    });

    it("未知の型は文字列化", () => {
      expect(Format.auto("テスト", "text")).toBe("テスト");
    });
  });

  describe("field", () => {
    it("enum フィールドをラベルに変換できる", () => {
      const field = {
        kind: "enum" as const,
        options: [
          { value: "draft", label: "下書き" },
          { value: "published", label: "公開" },
        ],
      };
      expect(Format.field("draft", field)).toBe("下書き");
      expect(Format.field("published", field)).toBe("公開");
    });

    it("status フィールドをラベルに変換できる", () => {
      const field = {
        kind: "status" as const,
        options: [
          { value: "active", label: "有効" },
          { value: "inactive", label: "無効" },
        ],
      };
      expect(Format.field("active", field)).toBe("有効");
    });

    it("relation フィールドをラベルに変換できる", () => {
      const field = {
        kind: "relation" as const,
        relation: { labelField: "name" },
      };
      expect(Format.field({ id: "1", name: "田中" }, field)).toBe("田中");
    });

    it("relation フィールドで labelField がない場合は name を使用", () => {
      const field = {
        kind: "relation" as const,
        relation: {},
      };
      expect(Format.field({ id: "1", name: "鈴木" }, field)).toBe("鈴木");
    });

    it("boolean フィールドを locale に応じて変換できる", () => {
      const field = { kind: "boolean" as const };
      // デフォルト（日本語）
      expect(Format.field(true, field)).toBe("はい");
      expect(Format.field(false, field)).toBe("いいえ");
      // 英語に切り替え
      i18n.setLocale("en");
      expect(Format.field(true, field)).toBe("Yes");
      expect(Format.field(false, field)).toBe("No");
    });

    it("null/undefined は - を返す", () => {
      const field = { kind: "text" as const };
      expect(Format.field(null, field)).toBe("-");
      expect(Format.field(undefined, field)).toBe("-");
    });
  });
});
