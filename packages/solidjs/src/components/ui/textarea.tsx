import { type Component, splitProps } from "solid-js";
import type { JSX } from "solid-js";
import { cx } from "./utils.js";

const baseTextareaClasses =
  "flex min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50";

export const textareaClasses = (className?: string) =>
  cx(baseTextareaClasses, className);

export interface TextareaProps
  extends JSX.TextareaHTMLAttributes<HTMLTextAreaElement> {
  class?: string;
}

export const Textarea: Component<TextareaProps> = (props) => {
  const [local, others] = splitProps(props, ["class"]);
  return <textarea class={textareaClasses(local.class)} {...others} />;
};
