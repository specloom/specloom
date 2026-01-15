import { Show, splitProps } from "solid-js";
import { ark } from "@ark-ui/solid/factory";
import { styled } from "styled-system/jsx";
import { button } from "styled-system/recipes";
import type { ComponentProps } from "styled-system/types";

const BaseButton = styled(ark.button, button);

export interface ButtonProps extends ComponentProps<typeof BaseButton> {
  loading?: boolean;
  loadingText?: string;
}

export function Button(props: ButtonProps) {
  const [local, rest] = splitProps(props, ["loading", "loadingText", "children"]);

  return (
    <BaseButton disabled={local.loading || props.disabled} {...rest}>
      <Show when={local.loading} fallback={local.children}>
        {local.loadingText ?? "Loading..."}
      </Show>
    </BaseButton>
  );
}
