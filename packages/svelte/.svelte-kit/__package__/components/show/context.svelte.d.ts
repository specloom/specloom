import type { ShowViewModel, ShowFieldVM, ActionVM, FieldGroup } from "specloom";
export interface ShowContextValue {
    readonly vm: ShowViewModel;
    onAction?: (actionId: string) => void;
    readonly fields: ShowFieldVM[];
    readonly groups: FieldGroup[];
    readonly actions: ActionVM[];
    readonly allowedActions: ActionVM[];
    readonly loading: boolean;
    readonly error: string | undefined;
    readonly label: string;
    readonly id: string;
}
export interface CreateShowContextOptions {
    vm: () => ShowViewModel;
    onAction?: (actionId: string) => void;
}
export declare function createShowContext(options: CreateShowContextOptions): ShowContextValue;
export declare function getShowContext(): ShowContextValue;
