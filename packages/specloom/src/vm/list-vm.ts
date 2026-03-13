import type { ActionVM, ListFieldVM, ListRowVM, ListViewModel, NamedFilterVM } from "./types.js";
import { formatColumnValue, formatValue, type FormatValueOptions } from "../format/index.js";

/**
 * OOP wrapper around ListViewModel providing convenience accessors
 * for UI components. Framework-agnostic (pure TypeScript).
 */
export class ListVM {
  constructor(private readonly vm: ListViewModel) {}

  // === Data accessors ===

  get type(): "list" { return this.vm.type; }
  get resource(): string { return this.vm.resource; }
  get label(): string { return this.vm.label; }
  get fields(): ListFieldVM[] { return this.vm.fields; }
  get rows(): ListRowVM[] { return this.vm.rows; }
  get clickAction(): "none" | "show" | "edit" { return this.vm.clickAction; }

  // === Convenience booleans ===

  get isEmpty(): boolean { return this.vm.rows.length === 0; }
  get isSelectable(): boolean { return this.vm.selection.mode !== "none"; }
  get hasFilters(): boolean { return this.vm.namedFilters.length > 0; }

  // === Search ===

  get searchFields(): string[] { return this.vm.search.fields; }
  get searchQuery(): string { return this.vm.search.query; }

  // === Filters ===

  get filters(): NamedFilterVM[] { return this.vm.namedFilters; }

  // === Actions ===

  get pageActions(): ActionVM[] { return this.vm.pageActions; }
  get bulkActions(): ActionVM[] { return this.vm.selectionActions; }

  get allowedPageActions(): ActionVM[] {
    return this.vm.pageActions.filter((a) => a.allowed);
  }

  get allowedBulkActions(): ActionVM[] {
    return this.vm.selectionActions.filter((a) => a.allowed);
  }

  allowedActions(actions: ActionVM[]): ActionVM[] {
    return actions.filter((a) => a.allowed);
  }

  // === Field lookup ===

  field(name: string): ListFieldVM | undefined {
    return this.vm.fields.find((f) => f.name === name);
  }

  // === Cell value access ===

  cellValue(row: ListRowVM, fieldName: string): unknown {
    return row.values[fieldName];
  }

  formatCell(
    field: ListFieldVM,
    value: unknown,
    options?: FormatValueOptions,
  ): string {
    if (field.template) {
      return formatColumnValue(field, { [field.name]: value }, options);
    }
    return formatValue(field.fieldSpec, value, options);
  }

  // === Raw view model access ===

  toJSON(): ListViewModel { return this.vm; }
}
