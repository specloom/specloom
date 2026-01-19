import { type Component, Show } from "solid-js";
import { useList } from "./context.jsx";

export interface ListLoadingProps {
  class?: string;
}

export const ListLoading: Component<ListLoadingProps> = (props) => {
  const { loading } = useList();

  return (
    <Show when={loading()}>
      <div class={props.class ?? "flex items-center justify-center py-12"}>
        <div class="flex items-center gap-2 text-muted-foreground">
          <svg
            class="h-5 w-5 animate-spin"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <circle cx="12" cy="12" r="10" stroke-opacity="0.25" />
            <path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round" />
          </svg>
          <span class="text-sm">読み込み中...</span>
        </div>
      </div>
    </Show>
  );
};
