import type { CompiledField } from "@specloom/spec";
import type { ListColumnVM } from "../vm/types.js";

export interface FormatValueOptions {
  locale?: string;
  currency?: string;
  now?: Date;
}

export function formatTemplate(
  template: string,
  record: Record<string, unknown>,
): string {
  return template.replace(/\{([^}]+)\}/g, (_, path) => {
    const value = resolvePath(record, path.trim());
    return value == null ? "" : String(value);
  });
}

export function formatValue(
  field: Pick<CompiledField, "type" | "ui" | "relation" | "options">,
  value: unknown,
  options: FormatValueOptions = {},
): string {
  if (value == null || value === "") {
    return field.ui.emptyText ?? "";
  }

  if (Array.isArray(value)) {
    return value
      .map((item) => formatValue(field, item, options))
      .filter(Boolean)
      .join(", ");
  }

  if (field.options && field.options.length > 0) {
    const matched = field.options.find((o) => o.value === value);
    if (matched) {
      return matched.label;
    }
  }

  if (field.relation && typeof value === "object" && value !== null) {
    const label = (value as Record<string, unknown>)[field.relation.labelField];
    if (label != null) {
      return String(label);
    }
  }

  const format = field.ui.format ?? inferFormat(field);
  switch (format) {
    case "date":
      return formatDate(value, {
        locale: options.locale,
        dateStyle: "medium",
      });
    case "datetime":
      return formatDate(value, {
        locale: options.locale,
        dateStyle: "medium",
        timeStyle: "short",
      });
    case "relative":
      return formatRelative(value, options);
    case "currency":
      return new Intl.NumberFormat(options.locale, {
        style: "currency",
        currency: options.currency ?? "JPY",
      }).format(toNumber(value));
    default:
      if (format?.startsWith("currency:")) {
        return new Intl.NumberFormat(options.locale, {
          style: "currency",
          currency: format.slice("currency:".length) || options.currency || "JPY",
        }).format(toNumber(value));
      }
      return formatPrimitive(value);
  }
}

export function formatColumnValue(
  column: ListColumnVM,
  record: Record<string, unknown>,
  options: FormatValueOptions = {},
): string {
  if (column.template) {
    return formatTemplate(column.template, record);
  }

  return formatValue(column.fieldSpec, record[column.field], options);
}

function inferFormat(field: Pick<CompiledField, "type" | "ui" | "relation">): string | undefined {
  if (field.ui.format) {
    return field.ui.format;
  }

  if (field.type.kind !== "scalar") {
    return undefined;
  }

  switch (field.type.name) {
    case "date":
      return "date";
    case "datetime":
    case "utcDateTime":
      return "datetime";
    default:
      return undefined;
  }
}

function formatDate(
  value: unknown,
  options: Intl.DateTimeFormatOptions & { locale?: string },
): string {
  const date = value instanceof Date ? value : new Date(String(value));
  if (Number.isNaN(date.getTime())) {
    return String(value);
  }
  return new Intl.DateTimeFormat(options.locale, options).format(date);
}

function formatRelative(
  value: unknown,
  options: FormatValueOptions,
): string {
  const date = value instanceof Date ? value : new Date(String(value));
  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  const now = options.now ?? new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffDays = Math.round(diffMs / 86_400_000);

  return new Intl.RelativeTimeFormat(options.locale, {
    numeric: "auto",
  }).format(diffDays, "day");
}

function toNumber(value: unknown): number {
  if (typeof value === "number") {
    return value;
  }
  const parsed = Number(value);
  return Number.isNaN(parsed) ? 0 : parsed;
}

function formatPrimitive(value: unknown): string {
  if (typeof value === "boolean") {
    return value ? "true" : "false";
  }
  return String(value);
}

function resolvePath(record: Record<string, unknown>, path: string): unknown {
  return path.split(".").reduce<unknown>((value, segment) => {
    if (typeof value !== "object" || value === null) {
      return undefined;
    }
    return (value as Record<string, unknown>)[segment];
  }, record);
}
