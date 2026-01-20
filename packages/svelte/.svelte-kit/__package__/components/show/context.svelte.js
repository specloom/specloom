import { getContext, setContext } from "svelte";
import { ShowHelpers } from "specloom";
const SHOW_CONTEXT_KEY = Symbol("show-context");
export function createShowContext(options) {
    const context = {
        get vm() {
            return options.vm();
        },
        onAction: options.onAction,
        // Derived - 直接プロパティアクセス
        get fields() {
            return options.vm().fields;
        },
        get groups() {
            return options.vm().groups ?? [];
        },
        get actions() {
            return options.vm().actions;
        },
        get allowedActions() {
            return ShowHelpers.allowedActions(options.vm());
        },
        get loading() {
            return options.vm().isLoading ?? false;
        },
        get error() {
            return options.vm().error;
        },
        get label() {
            return options.vm().label;
        },
        get id() {
            return options.vm().id;
        },
    };
    setContext(SHOW_CONTEXT_KEY, context);
    return context;
}
export function getShowContext() {
    const context = getContext(SHOW_CONTEXT_KEY);
    if (!context) {
        throw new Error("Show components must be used within a ShowView");
    }
    return context;
}
