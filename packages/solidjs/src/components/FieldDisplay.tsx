import { Show, Switch, Match } from "solid-js";
import { Format, type ShowFieldVM, type ListFieldVM } from "specloom";
import { css } from "../../styled-system/css";

export interface FieldDisplayProps {
  field: ShowFieldVM | ListFieldVM;
  value: unknown;
}

function isSafeUrl(url: unknown): boolean {
  if (typeof url !== "string") return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

export function FieldDisplay(props: FieldDisplayProps) {
  const formatted = () => Format.field(props.value, props.field);
  const safeUrl = () => isSafeUrl(props.value);

  return (
    <Switch fallback={<span>{formatted()}</span>}>
      <Match when={props.field.kind === "boolean"}>
        <span
          class={css({
            display: "inline-flex",
            alignItems: "center",
            gap: 1,
          })}
        >
          <span
            class={css({
              w: 2,
              h: 2,
              borderRadius: "full",
              bg: props.value ? "green.500" : "gray.300",
            })}
          />
          {formatted()}
        </span>
      </Match>

      <Match when={props.field.kind === "enum"}>
        <span
          class={css({
            display: "inline-block",
            px: 2,
            py: 0.5,
            borderRadius: "full",
            bg: "gray.100",
            fontSize: "sm",
          })}
        >
          {formatted()}
        </span>
      </Match>

      <Match when={props.field.kind === "url"}>
        <Show when={props.value && safeUrl()} fallback={<span>{formatted()}</span>}>
          <a
            href={String(props.value)}
            target="_blank"
            rel="noopener noreferrer"
            class={css({
              color: "blue.500",
              textDecoration: "underline",
              _hover: { color: "blue.600" },
            })}
          >
            {formatted()}
          </a>
        </Show>
      </Match>

      <Match when={props.field.kind === "email"}>
        <Show when={props.value} fallback={<span>{formatted()}</span>}>
          <a
            href={`mailto:${props.value}`}
            class={css({
              color: "blue.500",
              textDecoration: "underline",
              _hover: { color: "blue.600" },
            })}
          >
            {formatted()}
          </a>
        </Show>
      </Match>

      <Match when={props.field.kind === "number" || props.field.kind === "currency"}>
        <span class={css({ fontVariantNumeric: "tabular-nums" })}>{formatted()}</span>
      </Match>
    </Switch>
  );
}
