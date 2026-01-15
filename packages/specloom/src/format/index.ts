// ============================================================
// Format - 表示用フォーマット関数
// ============================================================

import type { FieldKind } from "../spec/index.js";
import { i18n } from "../i18n/index.js";

/**
 * フォーマットオプション
 */
export interface FormatOptions {
  locale?: string;
  currency?: string;
  dateStyle?: "full" | "long" | "medium" | "short";
  timeStyle?: "full" | "long" | "medium" | "short";
  maximumFractionDigits?: number;
  minimumFractionDigits?: number;
}

/**
 * フォーマット関数
 */
export const Format = {
  /**
   * 日付フォーマット
   */
  date: (
    value: Date | string | number | null | undefined,
    options?: Pick<FormatOptions, "locale" | "dateStyle">,
  ): string => {
    if (value == null) return "";
    try {
      const date = value instanceof Date ? value : new Date(value);
      if (isNaN(date.getTime())) return String(value);
      const t = i18n.t();
      return date.toLocaleDateString(options?.locale ?? t.intlLocale, {
        dateStyle: options?.dateStyle ?? "medium",
      });
    } catch {
      return String(value);
    }
  },

  /**
   * 時刻フォーマット
   */
  time: (
    value: Date | string | number | null | undefined,
    options?: Pick<FormatOptions, "locale" | "timeStyle">,
  ): string => {
    if (value == null) return "";
    try {
      const date = value instanceof Date ? value : new Date(value);
      if (isNaN(date.getTime())) return String(value);
      const t = i18n.t();
      return date.toLocaleTimeString(options?.locale ?? t.intlLocale, {
        timeStyle: options?.timeStyle ?? "short",
      });
    } catch {
      return String(value);
    }
  },

  /**
   * 日時フォーマット
   */
  datetime: (
    value: Date | string | number | null | undefined,
    options?: Pick<FormatOptions, "locale" | "dateStyle" | "timeStyle">,
  ): string => {
    if (value == null) return "";
    try {
      const date = value instanceof Date ? value : new Date(value);
      if (isNaN(date.getTime())) return String(value);
      const t = i18n.t();
      return date.toLocaleString(options?.locale ?? t.intlLocale, {
        dateStyle: options?.dateStyle ?? "medium",
        timeStyle: options?.timeStyle ?? "short",
      });
    } catch {
      return String(value);
    }
  },

  /**
   * 数値フォーマット
   */
  number: (
    value: number | string | null | undefined,
    options?: Pick<
      FormatOptions,
      "locale" | "maximumFractionDigits" | "minimumFractionDigits"
    >,
  ): string => {
    if (value == null) return "";
    const num = typeof value === "string" ? parseFloat(value) : value;
    if (isNaN(num)) return String(value);
    const t = i18n.t();
    return num.toLocaleString(options?.locale ?? t.intlLocale, {
      maximumFractionDigits: options?.maximumFractionDigits,
      minimumFractionDigits: options?.minimumFractionDigits,
    });
  },

  /**
   * 通貨フォーマット
   */
  currency: (
    value: number | string | null | undefined,
    options?: Pick<FormatOptions, "locale" | "currency">,
  ): string => {
    if (value == null) return "";
    const num = typeof value === "string" ? parseFloat(value) : value;
    if (isNaN(num)) return String(value);
    const t = i18n.t();
    return num.toLocaleString(options?.locale ?? t.intlLocale, {
      style: "currency",
      currency: options?.currency ?? t.defaultCurrency,
    });
  },

  /**
   * パーセントフォーマット
   */
  percent: (
    value: number | string | null | undefined,
    options?: Pick<FormatOptions, "locale" | "maximumFractionDigits">,
  ): string => {
    if (value == null) return "";
    const num = typeof value === "string" ? parseFloat(value) : value;
    if (isNaN(num)) return String(value);
    const t = i18n.t();
    return num.toLocaleString(options?.locale ?? t.intlLocale, {
      style: "percent",
      maximumFractionDigits: options?.maximumFractionDigits ?? 0,
    });
  },

  /**
   * ブール値フォーマット
   */
  boolean: (
    value: boolean | null | undefined,
    labels?: { true?: string; false?: string },
  ): string => {
    if (value == null) return "";
    const t = i18n.t();
    return value
      ? (labels?.true ?? t.format.booleanTrue)
      : (labels?.false ?? t.format.booleanFalse);
  },

  /**
   * 配列フォーマット（カンマ区切り）
   */
  list: (value: unknown[] | null | undefined, separator?: string): string => {
    if (value == null || value.length === 0) return "";
    return value.map(String).join(separator ?? ", ");
  },

  /**
   * テキスト省略
   */
  truncate: (
    value: string | null | undefined,
    maxLength: number,
    suffix?: string,
  ): string => {
    if (value == null) return "";
    if (value.length <= maxLength) return value;
    return value.slice(0, maxLength) + (suffix ?? "...");
  },

  /**
   * ファイルサイズフォーマット
   */
  fileSize: (bytes: number | null | undefined): string => {
    if (bytes == null) return "";
    if (bytes === 0) return "0 B";
    const units = ["B", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    const size = bytes / Math.pow(1024, i);
    return `${size.toFixed(i > 0 ? 1 : 0)} ${units[i]}`;
  },

  /**
   * 相対時間フォーマット
   */
  relative: (
    value: Date | string | number | null | undefined,
    options?: Pick<FormatOptions, "locale">,
  ): string => {
    if (value == null) return "";
    try {
      const date = value instanceof Date ? value : new Date(value);
      if (isNaN(date.getTime())) return String(value);

      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffSec = Math.floor(diffMs / 1000);
      const diffMin = Math.floor(diffSec / 60);
      const diffHour = Math.floor(diffMin / 60);
      const diffDay = Math.floor(diffHour / 24);

      const t = i18n.t();
      const rtf = new Intl.RelativeTimeFormat(options?.locale ?? t.intlLocale, {
        numeric: "auto",
      });

      if (diffDay > 30) return Format.date(value, options);
      if (diffDay > 0) return rtf.format(-diffDay, "day");
      if (diffHour > 0) return rtf.format(-diffHour, "hour");
      if (diffMin > 0) return rtf.format(-diffMin, "minute");
      return rtf.format(-diffSec, "second");
    } catch {
      return String(value);
    }
  },

  /**
   * FieldKindに基づく自動フォーマット
   */
  auto: (value: unknown, kind: FieldKind, options?: FormatOptions): string => {
    if (value == null) return "";

    switch (kind) {
      case "date":
        return Format.date(value as Date | string, options);
      case "datetime":
        return Format.datetime(value as Date | string, options);
      case "number":
      case "integer":
        return Format.number(value as number, options);
      case "currency":
        return Format.currency(value as number, options);
      case "boolean":
        return Format.boolean(value as boolean);
      case "multiselect":
      case "tags":
        return Format.list(value as unknown[]);
      default:
        return String(value);
    }
  },

  /**
   * フィールド定義に基づくフォーマット
   * UIモジュールから使用される
   */
  field: (
    value: unknown,
    field: {
      kind: FieldKind;
      options?: Array<{ value: unknown; label: string }>;
      relation?: { labelField?: string };
    },
    options?: FormatOptions,
  ): string => {
    const t = i18n.t();
    if (value == null) return t.format.empty;

    switch (field.kind) {
      case "boolean":
        return Format.boolean(value as boolean);
      case "date":
        return Format.date(value as Date | string, options) || t.format.empty;
      case "datetime":
        return (
          Format.datetime(value as Date | string, options) || t.format.empty
        );
      case "number":
      case "integer":
        return Format.number(value as number, options) || t.format.empty;
      case "currency":
        return Format.currency(value as number, options) || t.format.empty;
      case "enum":
      case "status":
        return (
          field.options?.find((o) => o.value === value)?.label ?? String(value)
        );
      case "relation": {
        if (typeof value !== "object" || value === null) return String(value);
        const rel = value as Record<string, unknown>;
        const labelField = field.relation?.labelField ?? "name";
        return String(rel[labelField] ?? rel.id ?? t.format.empty);
      }
      case "multiselect":
      case "tags":
        return Format.list(value as unknown[]) || t.format.empty;
      default:
        return String(value);
    }
  },
};
