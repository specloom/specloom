declare const InputGroupInput: import("svelte").Component<(Omit<import("svelte/elements").HTMLInputAttributes, "type"> & ({
    type: "file";
    files?: FileList;
} | {
    type?: "number" | "hidden" | "color" | "search" | "button" | "checkbox" | "radio" | (string & {}) | "text" | "tel" | "url" | "email" | "submit" | "reset" | "date" | "time" | "range" | "datetime-local" | "image" | "month" | "password" | "week";
    files?: undefined;
})) & {
    ref?: HTMLElement | null | undefined;
}, {}, "ref" | "value">;
type InputGroupInput = ReturnType<typeof InputGroupInput>;
export default InputGroupInput;
