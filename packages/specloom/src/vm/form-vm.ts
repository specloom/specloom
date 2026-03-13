import type {
  ActionVM,
  FormFieldVM,
  FormViewModel,
  RecordSectionVM,
} from "./types.js";
import { formatValue, type FormatValueOptions } from "../format/index.js";

/**
 * OOP wrapper around FormViewModel providing convenience accessors
 * for UI components. Framework-agnostic (pure TypeScript).
 */
export class FormVM {
  constructor(private readonly vm: FormViewModel) {}

  // === Data accessors ===

  get type(): "form" { return this.vm.type; }
  get resource(): string { return this.vm.resource; }
  get label(): string { return this.vm.label; }
  get mode(): "create" | "edit" { return this.vm.mode; }
  get id(): string | undefined { return this.vm.id; }
  get fields(): FormFieldVM[] { return this.vm.fields; }
  get sections(): RecordSectionVM<FormFieldVM>[] { return this.vm.sections; }
  get isValid(): boolean { return this.vm.isValid; }
  get isDirty(): boolean { return this.vm.isDirty; }

  // === Convenience booleans ===

  get isCreate(): boolean { return this.vm.mode === "create"; }
  get isEdit(): boolean { return this.vm.mode === "edit"; }
  get hasSections(): boolean { return this.vm.sections.length > 1; }

  // === Filtered fields ===

  get visibleFields(): FormFieldVM[] {
    return this.vm.fields.filter((f) => f.visible && !f.hidden);
  }

  get requiredFields(): FormFieldVM[] {
    return this.vm.fields.filter((f) => f.required);
  }

  get editableFields(): FormFieldVM[] {
    return this.vm.fields.filter((f) => !f.readonly && !f.disabled);
  }

  get fieldsWithErrors(): FormFieldVM[] {
    return this.vm.fields.filter((f) => f.errors.length > 0);
  }

  // === Actions ===

  get actions(): ActionVM[] { return this.vm.actions; }

  get allowedActions(): ActionVM[] {
    return this.vm.actions.filter((a) => a.allowed);
  }

  // === Field lookup ===

  field(name: string): FormFieldVM | undefined {
    return this.vm.fields.find((f) => f.name === name);
  }

  // === Field value access ===

  fieldValue(name: string): unknown {
    const f = this.field(name);
    return f?.value;
  }

  fieldErrors(name: string): string[] {
    const f = this.field(name);
    return f?.errors ?? [];
  }

  hasErrors(name: string): boolean {
    return this.fieldErrors(name).length > 0;
  }

  formatField(
    field: FormFieldVM,
    options?: FormatValueOptions,
  ): string {
    return formatValue(field, field.value, options);
  }

  // === Raw view model access ===

  toJSON(): FormViewModel { return this.vm; }
}
