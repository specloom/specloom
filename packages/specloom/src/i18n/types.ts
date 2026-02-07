// ============================================================
// i18n 型定義
// ============================================================

/**
 * サポートするロケール
 */
export type SupportedLocale = "ja" | "en";

/**
 * メッセージ定義
 */
export interface Messages {
  // Format
  readonly format: {
    readonly booleanTrue: string;
    readonly booleanFalse: string;
    readonly empty: string;
  };
  // Validation
  readonly validation: {
    readonly required: (label: string) => string;
    readonly minLength: (min: number) => string;
    readonly maxLength: (max: number) => string;
    readonly min: (min: number) => string;
    readonly max: (max: number) => string;
    readonly minItems: (min: number) => string;
    readonly maxItems: (max: number) => string;
    readonly match: (field: string) => string;
    readonly email: string;
    readonly url: string;
    readonly tel: string;
    readonly pattern: string;
  };
  // Action
  readonly action: {
    readonly confirm: string;
  };
  // Intl設定
  readonly intlLocale: string;
  readonly defaultCurrency: string;
}
