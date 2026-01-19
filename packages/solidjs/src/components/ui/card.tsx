import { type Component, splitProps } from "solid-js";
import type { JSX } from "solid-js";
import { cx } from "./utils.js";

export interface CardProps extends JSX.HTMLAttributes<HTMLDivElement> {
  class?: string;
}

export const cardClasses = (className?: string) =>
  cx("rounded-lg border border-border bg-card text-card-foreground shadow-sm", className);

export const Card: Component<CardProps> = (props) => {
  const [local, others] = splitProps(props, ["class"]);
  return <div class={cardClasses(local.class)} {...others} />;
};
