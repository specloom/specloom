import { type Component, splitProps } from "solid-js";
import type { JSX } from "solid-js";
import { cx } from "./utils.js";

const baseInputClasses =
  "flex h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50";

export const inputClasses = (className?: string) =>
  cx(baseInputClasses, className);

export interface InputProps
  extends JSX.InputHTMLAttributes<HTMLInputElement> {
  class?: string;
}

export const Input: Component<InputProps> = (props) => {
  const [local, others] = splitProps(props, ["class"]);
  return <input class={inputClasses(local.class)} {...others} />;
};
