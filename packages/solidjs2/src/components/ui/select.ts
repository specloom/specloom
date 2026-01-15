import { cx } from "./utils.js";

export const selectTriggerClasses = (className?: string) =>
  cx(
    "flex h-9 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
    className,
  );

export const selectContentClasses = (className?: string) =>
  cx(
    "relative z-50 max-h-60 min-w-[8rem] overflow-hidden rounded-md border border-border bg-popover text-popover-foreground shadow-md",
    className,
  );

export const selectItemClasses = (className?: string) =>
  cx(
    "relative flex w-full cursor-default select-none items-center rounded-sm px-3 py-2 text-sm outline-none data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground",
    className,
  );
