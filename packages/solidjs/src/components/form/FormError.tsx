import { type Component, Show } from "solid-js";
import { useForm } from "./context.jsx";

export interface FormErrorProps {
  class?: string;
}

export const FormError: Component<FormErrorProps> = (props) => {
  const { error } = useForm();

  return (
    <Show when={error()}>
      <div
        class={
          props.class ??
          "mx-6 mt-4 rounded-lg border border-destructive/30 bg-destructive/10 p-4"
        }
      >
        <div class="flex items-center gap-2">
          <svg
            class="h-5 w-5 text-destructive"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <p class="text-sm font-medium text-destructive">{error()}</p>
        </div>
      </div>
    </Show>
  );
};
