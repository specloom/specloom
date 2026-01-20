import type { FormViewModel, FormFieldVM, ActionVM, FieldGroup } from "specloom";
export interface RelationOption {
    value: string;
    label: string;
}
export interface FormContextValue {
    readonly vm: FormViewModel;
    onChange: (name: string, value: unknown) => void;
    onSubmit: () => void;
    onAction?: (actionId: string) => void;
    onOptionsSearch?: (resource: string, query: string) => Promise<RelationOption[]>;
    /** Timezone for date/datetime formatting (e.g., 'Asia/Tokyo', 'UTC'). undefined = local time */
    readonly timeZone: string | undefined;
    readonly fields: FormFieldVM[];
    readonly visibleFields: FormFieldVM[];
    readonly groups: FieldGroup[];
    readonly actions: ActionVM[];
    readonly allowedActions: ActionVM[];
    readonly values: Record<string, unknown>;
    readonly valid: boolean;
    readonly dirty: boolean;
    readonly canSubmit: boolean;
    readonly loading: boolean;
    readonly submitting: boolean;
    readonly error: string | undefined;
    readonly label: string;
    readonly mode: "create" | "edit";
}
export interface CreateFormContextOptions {
    vm: () => FormViewModel;
    onChange: (name: string, value: unknown) => void;
    onSubmit: () => void;
    onAction?: (actionId: string) => void;
    onOptionsSearch?: (resource: string, query: string) => Promise<RelationOption[]>;
    /** Timezone for date/datetime formatting (e.g., 'Asia/Tokyo', 'UTC'). undefined = local time. Use getter for reactivity. */
    timeZone?: () => string | undefined;
}
export declare function createFormContext(options: CreateFormContextOptions): FormContextValue;
export declare function getFormContext(): FormContextValue;
