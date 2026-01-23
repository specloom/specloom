// ============================================================
// ShowVM - Show ViewModel Class (Immutable OOP Style)
// ============================================================

import type { ShowViewModel, ShowFieldVM, ActionVM } from "./types.js";
import { Format, type FormatOptions } from "../format/index.js";

/**
 * ShowVM - Immutable ViewModel class for show/detail views
 *
 * All setter methods return a new instance, preserving immutability.
 * Method chaining is supported for fluent API usage.
 *
 * @example
 * ```typescript
 * const show = new ShowVM(data)
 *
 * // Getters
 * show.fields
 * show.label
 * show.value("title")
 *
 * // Method chaining
 * const updated = show
 *   .setLoading(true)
 *   .setFieldValue("status", "published")
 * ```
 */
export class ShowVM {
  constructor(public readonly data: ShowViewModel) {}

  // ============================================================
  // Static Factory
  // ============================================================

  /**
   * Create a new ShowVM from plain data
   */
  static from(data: ShowViewModel): ShowVM {
    return new ShowVM(data);
  }

  // ============================================================
  // フィールド
  // ============================================================

  /** フィールド一覧 */
  get fields(): ShowFieldVM[] {
    return this.data.fields;
  }

  /** 特定のフィールドを取得 */
  field(name: string): ShowFieldVM | undefined {
    return this.data.fields.find((f) => f.name === name);
  }

  // ============================================================
  // 値
  // ============================================================

  /** フィールドの値を取得 */
  value(name: string): unknown {
    return this.field(name)?.value;
  }

  /** フィールド値をフォーマット */
  formatValue(
    field: ShowFieldVM,
    value: unknown,
    options?: FormatOptions,
  ): string {
    return Format.field(value, field, options);
  }

  // ============================================================
  // グループ
  // ============================================================

  /** フィールドグループ一覧 */
  get groups() {
    return this.data.groups ?? [];
  }

  /** 指定グループのフィールドを取得 */
  fieldsInGroup(groupId: string): ShowFieldVM[] {
    const group = this.data.groups?.find((g) => g.id === groupId);
    if (!group) return [];
    return this.data.fields.filter((f) => group.fields.includes(f.name));
  }

  // ============================================================
  // アクション
  // ============================================================

  /** アクション一覧 */
  get actions(): ActionVM[] {
    return this.data.actions;
  }

  /** 許可されたアクションのみ取得 */
  get allowedActions(): ActionVM[] {
    return this.data.actions.filter((a) => a.allowed);
  }

  // ============================================================
  // 状態
  // ============================================================

  /** ローディング中か */
  get isLoading(): boolean {
    return this.data.isLoading ?? false;
  }

  /** エラーメッセージ */
  get error(): string | undefined {
    return this.data.error;
  }

  // ============================================================
  // メタ
  // ============================================================

  /** ラベル */
  get label(): string {
    return this.data.label;
  }

  /** リソース名 */
  get resource(): string {
    return this.data.resource;
  }

  /** レコードID */
  get id(): string {
    return this.data.id;
  }

  // ============================================================
  // 状態更新（イミュータブル）- 新しいインスタンスを返す
  // ============================================================

  /** ローディング状態を設定 */
  setLoading(isLoading: boolean): ShowVM {
    return new ShowVM({
      ...this.data,
      isLoading,
    });
  }

  /** エラーを設定 */
  setError(error: string | undefined): ShowVM {
    return new ShowVM({
      ...this.data,
      error,
    });
  }

  /** フィールドデータを一括更新 */
  setData(data: Record<string, unknown>): ShowVM {
    return new ShowVM({
      ...this.data,
      fields: this.data.fields.map((f) => ({
        ...f,
        value: f.name in data ? data[f.name] : f.value,
      })),
    });
  }

  /** 単一フィールド値を更新 */
  setFieldValue(name: string, value: unknown): ShowVM {
    return new ShowVM({
      ...this.data,
      fields: this.data.fields.map((f) =>
        f.name === name ? { ...f, value } : f,
      ),
    });
  }

  /** IDを更新 */
  setId(id: string): ShowVM {
    return new ShowVM({
      ...this.data,
      id,
    });
  }
}
