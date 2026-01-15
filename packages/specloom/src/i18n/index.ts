// ============================================================
// i18n - 国際化モジュール
// ============================================================

export type { SupportedLocale, Messages } from "./types.js";
import type { SupportedLocale, Messages } from "./types.js";
import { ja } from "./locales/ja.js";
import { en } from "./locales/en.js";

/**
 * メッセージ辞書
 */
const messages = { ja, en } satisfies Record<
  SupportedLocale,
  Readonly<Messages>
>;

/**
 * i18n インスタンスの型
 */
export interface I18nInstance {
  getLocale: () => SupportedLocale;
  setLocale: (locale: SupportedLocale) => void;
  t: (locale?: SupportedLocale) => Readonly<Messages>;
  resolveLocale: (locale: string) => SupportedLocale;
}

/**
 * i18n インスタンスを作成（ファクトリ関数）
 * SSRやマルチテナント環境で独立したロケール状態を持てる
 */
export function createI18n(
  initialLocale: SupportedLocale = "ja",
): I18nInstance {
  let currentLocale: SupportedLocale = initialLocale;

  return {
    getLocale: () => currentLocale,
    setLocale: (locale: SupportedLocale) => {
      currentLocale = locale;
    },
    t: (locale?: SupportedLocale) => messages[locale ?? currentLocale],
    resolveLocale: (locale: string) => (locale.startsWith("ja") ? "ja" : "en"),
  };
}

/**
 * デフォルトのグローバルインスタンス（シングルトン）
 * クライアントサイドや単一ロケール環境向け
 */
export const i18n = createI18n("ja");

// ロケールファイルを個別エクスポート
export { ja } from "./locales/ja.js";
export { en } from "./locales/en.js";
