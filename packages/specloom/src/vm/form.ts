// ============================================================
// FormVM - Form ViewModel Class (Immutable OOP Style)
// ============================================================

import type { FormViewModel, FormFieldVM, ActionVM } from "./types.js";
import { validateField } from "../validation/index.js";
import type { Field, FieldType } from "../spec/index.js";

// ============================================================
// Submit Value Conversion Helpers
// ============================================================

/** プリミティブ型（スカラー型）の集合 */
const PRIMITIVE_TYPES = new Set([
  "string",
  "int32",
  "float64",
  "boolean",
  "date",
  "datetime",
]);

/** 型がスカラー（プリミティブ）かどうかを判定 */
function isScalarType(type: string): boolean {
  // "int32[]" のような配列型もスカラー配列
  const baseType = type.replace("[]", "");
  return PRIMITIVE_TYPES.has(baseType);
}

/** 型が配列かどうかを判定 */
function isArrayType(type: string): boolean {
  return type.endsWith("[]");
}

/**
 * フィールドの送信値を変換する
 *
 * 送信仕様:
 * - プリミティブ → そのまま
 * - date → ISO date string
 * - datetime → ISO datetime string
 * - enum → そのまま
 * - relation (スカラー型) → valueField で値を抽出
 * - relation (Model型) → オブジェクトそのまま
 * - nested → 子フィールドに再帰適用（FormVM では子 VM を持たないため as-is）
 */
function convertSubmitValue(field: FormFieldVM): unknown {
  const { value, kind, type } = field;

  if (value == null) return value;

  // relation フィールド: 型でスカラー/オブジェクトを判定
  if (kind === "relation" && field.relation) {
    const vf = field.relation.valueField ?? "id";

    if (isArrayType(type)) {
      // 配列 relation
      if (!Array.isArray(value)) return value;
      if (isScalarType(type)) {
        // スカラー配列: 各要素から valueField を抽出
        return value.map((item) =>
          typeof item === "object" && item !== null
            ? (item as Record<string, unknown>)[vf]
            : item,
        );
      }
      // Model 配列: そのまま
      return value;
    }

    // 単一 relation
    if (isScalarType(type)) {
      // スカラー: valueField で値を抽出
      if (typeof value === "object" && value !== null) {
        return (value as Record<string, unknown>)[vf];
      }
      return value;
    }
    // Model 型: そのまま
    return value;
  }

  // date / datetime: ISO 文字列化
  if (kind === "date" || kind === "datetime") {
    if (value instanceof Date) {
      return kind === "date"
        ? value.toISOString().split("T")[0]
        : value.toISOString();
    }
    // 既に文字列の場合はそのまま
    return value;
  }

  // nested: そのまま（子の変換は UI 側の責務）
  // プリミティブ / enum / その他: そのまま
  return value;
}

/**
 * FormVM - Immutable ViewModel class for form views
 *
 * All setter methods return a new instance, preserving immutability.
 * Method chaining is supported for fluent API usage.
 *
 * @example
 * ```typescript
 * const form = new FormVM(data)
 *
 * // Getters
 * form.fields
 * form.isValid
 * form.value("email")
 *
 * // Method chaining
 * const updated = form
 *   .setValue("name", "John")
 *   .setValue("email", "john@example.com")
 *   .validate()
 * ```
 */
export class FormVM {
  constructor(public readonly data: FormViewModel) {}

  // ============================================================
  // Static Factory
  // ============================================================

  /**
   * Create a new FormVM from plain data
   */
  static from(data: FormViewModel): FormVM {
    return new FormVM(data);
  }

  // ============================================================
  // フィールド
  // ============================================================

  /** フィールド一覧 */
  get fields(): FormFieldVM[] {
    return this.data.fields;
  }

  /** 特定のフィールドを取得 */
  field(name: string): FormFieldVM | undefined {
    return this.data.fields.find((f) => f.name === name);
  }

  /** 表示可能なフィールドのみ取得 */
  get visibleFields(): FormFieldVM[] {
    return this.data.fields.filter((f) => f.visible !== false);
  }

  /** 必須フィールドのみ取得 */
  get requiredFields(): FormFieldVM[] {
    return this.data.fields.filter((f) => f.required);
  }

  /** 読み取り専用フィールドのみ取得 */
  get readonlyFields(): FormFieldVM[] {
    return this.data.fields.filter((f) => f.readonly);
  }

  // ============================================================
  // 値
  // ============================================================

  /** フィールドの値を取得 */
  value(name: string): unknown {
    return this.field(name)?.value;
  }

  /** 全フィールドの値をオブジェクトとして取得 */
  get values(): Record<string, unknown> {
    return this.data.fields.reduce(
      (acc, f) => {
        acc[f.name] = f.value;
        return acc;
      },
      {} as Record<string, unknown>,
    );
  }

  /** 送信可能なフィールドの値のみ取得（readonly・非表示を除外、送信仕様に従い変換） */
  get submittableValues(): Record<string, unknown> {
    return this.data.fields
      .filter((f) => !f.readonly && f.visible !== false)
      .reduce(
        (acc, f) => {
          // submitField 指定時: キー名を変更し、オブジェクトから .id を抽出
          if (f.relation?.submitField) {
            const key = f.relation.submitField;
            const val = f.value;
            if (val != null && typeof val === "object" && !Array.isArray(val)) {
              acc[key] = (val as Record<string, unknown>).id;
            } else {
              acc[key] = val;
            }
            return acc;
          }
          acc[f.name] = convertSubmitValue(f);
          return acc;
        },
        {} as Record<string, unknown>,
      );
  }

  // ============================================================
  // バリデーション
  // ============================================================

  /** フォームが有効か */
  get isValid(): boolean {
    return this.data.isValid;
  }

  /** フォームが変更されているか */
  get isDirty(): boolean {
    return this.data.isDirty;
  }

  /** エラーのあるフィールドとそのエラー一覧 */
  get errors(): Array<{ field: string; errors: string[] }> {
    return this.data.fields
      .filter((f) => f.errors.length > 0)
      .map((f) => ({ field: f.name, errors: f.errors }));
  }

  /** 指定フィールドのエラー一覧 */
  fieldErrors(name: string): string[] {
    return this.field(name)?.errors ?? [];
  }

  /** 指定フィールドにエラーがあるか */
  hasError(name: string): boolean {
    return (this.field(name)?.errors.length ?? 0) > 0;
  }

  /** いずれかのフィールドにエラーがあるか */
  get hasErrors(): boolean {
    return this.data.fields.some((f) => f.errors.length > 0);
  }

  /** エラーのあるフィールド一覧 */
  get fieldsWithErrors(): FormFieldVM[] {
    return this.data.fields.filter((f) => f.errors.length > 0);
  }

  // ============================================================
  // フィールド属性
  // ============================================================

  /** フィールドのヒントを取得 */
  hint(name: string): string | undefined {
    return this.field(name)?.hint;
  }

  /** フィールドのプレースホルダーを取得 */
  placeholder(name: string): string | undefined {
    return this.field(name)?.placeholder;
  }

  /** フィールドが表示されているか */
  isVisible(name: string): boolean {
    return this.field(name)?.visible !== false;
  }

  /** フィールドが必須か */
  isRequired(name: string): boolean {
    return this.field(name)?.required ?? false;
  }

  /** フィールドが読み取り専用か */
  isReadonly(name: string): boolean {
    return this.field(name)?.readonly ?? false;
  }

  // ============================================================
  // グループ
  // ============================================================

  /** フィールドグループ一覧 */
  get groups() {
    return this.data.groups ?? [];
  }

  /** 指定グループのフィールドを取得 */
  fieldsInGroup(groupId: string): FormFieldVM[] {
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

  /** 送信可能か（有効かつ送信中でない） */
  get canSubmit(): boolean {
    return this.data.isValid && !this.data.isSubmitting;
  }

  // ============================================================
  // 状態
  // ============================================================

  /** ローディング中か */
  get isLoading(): boolean {
    return this.data.isLoading ?? false;
  }

  /** 送信中か */
  get isSubmitting(): boolean {
    return this.data.isSubmitting ?? false;
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

  /** フォームモード（create または edit） */
  get mode(): "create" | "edit" {
    return this.data.mode;
  }

  /** レコードID（editモードの場合） */
  get id(): string | undefined {
    return this.data.id;
  }

  // ============================================================
  // 状態更新（イミュータブル）- 新しいインスタンスを返す
  // ============================================================

  /** フィールド値を更新 */
  setValue(name: string, value: unknown): FormVM {
    return new FormVM({
      ...this.data,
      isDirty: true,
      fields: this.data.fields.map((f) =>
        f.name === name ? { ...f, value } : f,
      ),
    });
  }

  /** 複数フィールド値を一括更新 */
  setValues(values: Record<string, unknown>): FormVM {
    return new FormVM({
      ...this.data,
      isDirty: true,
      fields: this.data.fields.map((f) =>
        f.name in values ? { ...f, value: values[f.name] } : f,
      ),
    });
  }

  /** フィールドエラーを設定 */
  setFieldErrors(name: string, errors: string[]): FormVM {
    const newFields = this.data.fields.map((f) =>
      f.name === name ? { ...f, errors } : f,
    );
    return new FormVM({
      ...this.data,
      fields: newFields,
      isValid: newFields.every((f) => f.errors.length === 0),
    });
  }

  /** 全フィールドのエラーをクリア */
  clearErrors(): FormVM {
    return new FormVM({
      ...this.data,
      fields: this.data.fields.map((f) => ({ ...f, errors: [] })),
      isValid: true,
    });
  }

  /** 全エラーを一括設定 */
  setAllErrors(errors: Record<string, string[]>): FormVM {
    const newFields = this.data.fields.map((f) => ({
      ...f,
      errors: errors[f.name] ?? [],
    }));
    return new FormVM({
      ...this.data,
      fields: newFields,
      isValid: newFields.every((f) => f.errors.length === 0),
    });
  }

  /** フォーム全体をバリデーション */
  validate(): FormVM {
    const values = this.values;
    const newFields = this.data.fields.map((f) => {
      const field: Field = {
        name: f.name,
        type: f.type,
        label: f.label,
        kind: f.kind,
        required: f.required,
        validation: f.validation,
      };
      const errors = validateField(field, f.value, values);
      return { ...f, errors };
    });
    return new FormVM({
      ...this.data,
      fields: newFields,
      isValid: newFields.every((f) => f.errors.length === 0),
    });
  }

  /** 単一フィールドをバリデーション */
  validateField(name: string): FormVM {
    const newFields = this.data.fields.map((f) => {
      if (f.name !== name) return f;
      const field: Field = {
        name: f.name,
        type: f.type,
        label: f.label,
        kind: f.kind,
        required: f.required,
        validation: f.validation,
      };
      const errors = validateField(field, f.value);
      return { ...f, errors };
    });
    return new FormVM({
      ...this.data,
      fields: newFields,
      isValid: newFields.every((f) => f.errors.length === 0),
    });
  }

  /** 送信中状態を設定 */
  setSubmitting(isSubmitting: boolean): FormVM {
    return new FormVM({
      ...this.data,
      isSubmitting,
    });
  }

  /** ローディング状態を設定 */
  setLoading(isLoading: boolean): FormVM {
    return new FormVM({
      ...this.data,
      isLoading,
    });
  }

  /** エラーを設定 */
  setError(error: string | undefined): FormVM {
    return new FormVM({
      ...this.data,
      error,
    });
  }

  /** フォームをリセット（初期値に戻す） */
  reset(initialValues?: Record<string, unknown>): FormVM {
    return new FormVM({
      ...this.data,
      isDirty: false,
      isValid: true,
      fields: this.data.fields.map((f) => ({
        ...f,
        value: initialValues?.[f.name] ?? f.value,
        errors: [],
      })),
    });
  }

  /** dirty状態をクリア */
  markClean(): FormVM {
    return new FormVM({
      ...this.data,
      isDirty: false,
    });
  }
}
