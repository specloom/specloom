// ============================================================
// 英語メッセージ
// ============================================================

import type { Messages } from "../types.js";

export const en: Messages = {
  format: {
    booleanTrue: "Yes",
    booleanFalse: "No",
    empty: "-",
  },
  validation: {
    required: (label: string) => `${label} is required`,
    minLength: (min: number) => `Must be at least ${min} characters`,
    maxLength: (max: number) => `Must be at most ${max} characters`,
    min: (min: number) => `Must be at least ${min}`,
    max: (max: number) => `Must be at most ${max}`,
    minItems: (min: number) => `Select at least ${min} items`,
    maxItems: (max: number) => `Select at most ${max} items`,
    email: "Please enter a valid email address",
    url: "Please enter a valid URL",
    tel: "Please enter a valid phone number",
    pattern: "Invalid format",
  },
  intlLocale: "en-US",
  defaultCurrency: "USD",
};
