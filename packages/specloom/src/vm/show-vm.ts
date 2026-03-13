import type {
  ActionVM,
  RecordSectionVM,
  ShowFieldVM,
  ShowViewModel,
} from "./types.js";
import { formatValue, type FormatValueOptions } from "../format/index.js";

/**
 * OOP wrapper around ShowViewModel providing convenience accessors
 * for UI components. Framework-agnostic (pure TypeScript).
 */
export class ShowVM {
  constructor(private readonly vm: ShowViewModel) {}

  // === Data accessors ===

  get type(): "show" { return this.vm.type; }
  get resource(): string { return this.vm.resource; }
  get label(): string { return this.vm.label; }
  get id(): string { return this.vm.id; }
  get fields(): ShowFieldVM[] { return this.vm.fields; }
  get sections(): RecordSectionVM<ShowFieldVM>[] { return this.vm.sections; }

  // === Convenience booleans ===

  get hasSections(): boolean { return this.vm.sections.length > 1; }

  // === Actions ===

  get actions(): ActionVM[] { return this.vm.actions; }

  get allowedActions(): ActionVM[] {
    return this.vm.actions.filter((a) => a.allowed);
  }

  // === Field lookup ===

  field(name: string): ShowFieldVM | undefined {
    return this.vm.fields.find((f) => f.name === name);
  }

  // === Field value access ===

  fieldValue(name: string): unknown {
    const f = this.field(name);
    return f?.value;
  }

  formatField(
    field: ShowFieldVM,
    options?: FormatValueOptions,
  ): string {
    return formatValue(field, field.value, options);
  }

  // === Raw view model access ===

  toJSON(): ShowViewModel { return this.vm; }
}
