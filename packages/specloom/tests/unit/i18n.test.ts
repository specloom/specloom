import { describe, it, expect, beforeEach } from "vitest";
import { i18n, createI18n, ja, en } from "../../src/i18n/index.js";

describe("i18n", () => {
  beforeEach(() => {
    i18n.setLocale("ja");
  });

  describe("getLocale / setLocale", () => {
    it("デフォルトは ja", () => {
      expect(i18n.getLocale()).toBe("ja");
    });

    it("ロケールを切り替えられる", () => {
      i18n.setLocale("en");
      expect(i18n.getLocale()).toBe("en");
    });
  });

  describe("t (messages)", () => {
    it("現在のロケールのメッセージを取得", () => {
      const t = i18n.t();
      expect(t.format.booleanTrue).toBe("はい");
    });

    it("指定ロケールのメッセージを取得", () => {
      const t = i18n.t("en");
      expect(t.format.booleanTrue).toBe("Yes");
    });

    it("ロケール切り替え後は新しいメッセージ", () => {
      i18n.setLocale("en");
      const t = i18n.t();
      expect(t.format.booleanFalse).toBe("No");
    });
  });

  describe("resolveLocale", () => {
    it("ja-JP は ja に解決", () => {
      expect(i18n.resolveLocale("ja-JP")).toBe("ja");
    });

    it("ja は ja に解決", () => {
      expect(i18n.resolveLocale("ja")).toBe("ja");
    });

    it("en-US は en に解決", () => {
      expect(i18n.resolveLocale("en-US")).toBe("en");
    });

    it("en-GB は en に解決", () => {
      expect(i18n.resolveLocale("en-GB")).toBe("en");
    });

    it("未知のロケールは en に解決", () => {
      expect(i18n.resolveLocale("fr-FR")).toBe("en");
    });
  });

  describe("日本語メッセージ (ja)", () => {
    it("format メッセージ", () => {
      expect(ja.format.booleanTrue).toBe("はい");
      expect(ja.format.booleanFalse).toBe("いいえ");
      expect(ja.format.empty).toBe("-");
    });

    it("validation メッセージ", () => {
      expect(ja.validation.required("名前")).toBe("名前は必須です");
      expect(ja.validation.minLength(3)).toBe("3文字以上で入力してください");
      expect(ja.validation.maxLength(10)).toBe("10文字以内で入力してください");
      expect(ja.validation.min(0)).toBe("0以上の値を入力してください");
      expect(ja.validation.max(100)).toBe("100以下の値を入力してください");
      expect(ja.validation.minItems(1)).toBe("1件以上選択してください");
      expect(ja.validation.maxItems(5)).toBe("5件以内で選択してください");
      expect(ja.validation.email).toBe(
        "有効なメールアドレスを入力してください",
      );
      expect(ja.validation.url).toBe("有効なURLを入力してください");
      expect(ja.validation.tel).toBe("有効な電話番号を入力してください");
      expect(ja.validation.pattern).toBe("入力形式が正しくありません");
    });

    it("Intl 設定", () => {
      expect(ja.intlLocale).toBe("ja-JP");
      expect(ja.defaultCurrency).toBe("JPY");
    });
  });

  describe("英語メッセージ (en)", () => {
    it("format メッセージ", () => {
      expect(en.format.booleanTrue).toBe("Yes");
      expect(en.format.booleanFalse).toBe("No");
      expect(en.format.empty).toBe("-");
    });

    it("validation メッセージ", () => {
      expect(en.validation.required("Name")).toBe("Name is required");
      expect(en.validation.minLength(3)).toBe("Must be at least 3 characters");
      expect(en.validation.maxLength(10)).toBe("Must be at most 10 characters");
      expect(en.validation.min(0)).toBe("Must be at least 0");
      expect(en.validation.max(100)).toBe("Must be at most 100");
      expect(en.validation.minItems(1)).toBe("Select at least 1 items");
      expect(en.validation.maxItems(5)).toBe("Select at most 5 items");
      expect(en.validation.email).toBe("Please enter a valid email address");
      expect(en.validation.url).toBe("Please enter a valid URL");
      expect(en.validation.tel).toBe("Please enter a valid phone number");
      expect(en.validation.pattern).toBe("Invalid format");
    });

    it("Intl 設定", () => {
      expect(en.intlLocale).toBe("en-US");
      expect(en.defaultCurrency).toBe("USD");
    });
  });

  describe("createI18n (ファクトリ)", () => {
    it("独立したインスタンスを作成できる", () => {
      const i18n1 = createI18n("ja");
      const i18n2 = createI18n("en");

      expect(i18n1.getLocale()).toBe("ja");
      expect(i18n2.getLocale()).toBe("en");

      // 一方を変更しても他方に影響しない
      i18n1.setLocale("en");
      expect(i18n1.getLocale()).toBe("en");
      expect(i18n2.getLocale()).toBe("en"); // 変更前から en
    });

    it("デフォルトは ja", () => {
      const instance = createI18n();
      expect(instance.getLocale()).toBe("ja");
    });

    it("初期ロケールを指定できる", () => {
      const instance = createI18n("en");
      expect(instance.getLocale()).toBe("en");
      expect(instance.t().format.booleanTrue).toBe("Yes");
    });

    it("グローバルインスタンスと独立している", () => {
      const local = createI18n("en");

      // グローバルは ja にリセット済み（beforeEach）
      expect(i18n.getLocale()).toBe("ja");
      expect(local.getLocale()).toBe("en");

      // ローカルを変更してもグローバルに影響しない
      local.setLocale("ja");
      expect(i18n.getLocale()).toBe("ja");
    });
  });
});
