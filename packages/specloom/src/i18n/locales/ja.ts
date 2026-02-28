// ============================================================
// 日本語メッセージ
// ============================================================

import type { Messages } from "../types.js";

export const ja: Messages = {
  format: {
    booleanTrue: "✓",
    booleanFalse: "-",
    empty: "-",
  },
  validation: {
    required: (label: string) => `${label}は必須です`,
    minLength: (min: number) => `${min}文字以上で入力してください`,
    maxLength: (max: number) => `${max}文字以内で入力してください`,
    min: (min: number) => `${min}以上の値を入力してください`,
    max: (max: number) => `${max}以下の値を入力してください`,
    minItems: (min: number) => `${min}件以上選択してください`,
    maxItems: (max: number) => `${max}件以内で選択してください`,
    match: (field: string) => `${field}と一致しません`,
    email: "有効なメールアドレスを入力してください",
    url: "有効なURLを入力してください",
    tel: "有効な電話番号を入力してください",
    pattern: "入力形式が正しくありません",
  },
  action: {
    confirm: "本当によろしいですか？",
  },
  intlLocale: "ja-JP",
  defaultCurrency: "JPY",
};
