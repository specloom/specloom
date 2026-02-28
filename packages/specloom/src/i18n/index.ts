// ============================================================
// i18n - 国際化モジュール
// ============================================================

export type { SupportedLocale, Messages, PartialMessages } from "./types.js";
import type { SupportedLocale, Messages, PartialMessages } from "./types.js";
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
  /** ロケール別にメッセージを部分上書きする */
  configure: (locale: SupportedLocale, overrides: PartialMessages) => void;
}

/**
 * i18n インスタンスを作成（ファクトリ関数）
 * SSRやマルチテナント環境で独立したロケール状態を持てる
 */
export function createI18n(
  initialLocale: SupportedLocale = "ja",
): I18nInstance {
  let currentLocale: SupportedLocale = initialLocale;
  const overrideMap: Partial<Record<SupportedLocale, Messages>> = {};

  function mergeMessages(
    base: Readonly<Messages>,
    overrides: PartialMessages,
  ): Messages {
    const result: Record<string, unknown> = {};
    for (const key of Object.keys(base) as (keyof Messages)[]) {
      const ov = overrides[key];
      if (ov && typeof ov === "object" && !Array.isArray(ov)) {
        result[key] = { ...(base[key] as object), ...ov };
      } else if (ov !== undefined) {
        result[key] = ov;
      } else {
        result[key] = base[key];
      }
    }
    return result as unknown as Messages;
  }

  return {
    getLocale: () => currentLocale,
    setLocale: (locale: SupportedLocale) => {
      currentLocale = locale;
    },
    t: (locale?: SupportedLocale) => {
      const loc = locale ?? currentLocale;
      return overrideMap[loc] ?? messages[loc];
    },
    resolveLocale: (locale: string) => (locale.startsWith("ja") ? "ja" : "en"),
    configure: (locale: SupportedLocale, overrides: PartialMessages) => {
      overrideMap[locale] = mergeMessages(messages[locale], overrides);
    },
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
