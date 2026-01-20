<script lang="ts">
  import type { FormViewModel } from "specloom";
  import type { Snippet } from "svelte";
  import { createFormContext, type RelationOption } from "./context.svelte.js";
  import * as Card from "$lib/components/ui/card/index.js";
  import { cn } from "$lib/utils.js";
  import FormHeader from "./FormHeader.svelte";
  import FormBody from "./FormBody.svelte";
  import FormFooter from "./FormFooter.svelte";
  import FormActions from "./FormActions.svelte";
  import FormLoading from "./FormLoading.svelte";
  import FormError from "./FormError.svelte";

  interface Props {
    vm: FormViewModel;
    onChange?: (name: string, value: unknown) => void;
    onSubmit?: () => void;
    onAction?: (actionId: string) => void;
    onOptionsSearch?: (resource: string, query: string) => Promise<RelationOption[]>;
    /** Timezone for date/datetime formatting (e.g., 'Asia/Tokyo', 'UTC'). undefined = local time */
    timeZone?: string;
    class?: string;
    children?: Snippet;
  }

  let {
    vm,
    onChange = () => {},
    onSubmit = () => {},
    onAction,
    onOptionsSearch,
    timeZone,
    class: className,
    children,
  }: Props = $props();

  // Create context for child components
  // Wrap callbacks in closures to capture latest values (Svelte 5 reactivity)
  createFormContext({
    vm: () => vm,
    onChange: (name, value) => onChange(name, value),
    onSubmit: () => onSubmit(),
    onAction: (actionId) => onAction?.(actionId),
    onOptionsSearch: (resource, query) => onOptionsSearch?.(resource, query) ?? Promise.resolve([]),
    timeZone: () => timeZone,
  });

  function handleSubmit(e: Event) {
    e.preventDefault();
    onSubmit();
  }
</script>

<form onsubmit={handleSubmit}>
  <Card.Root class={cn(className)}>
    {#if children}
      {@render children()}
    {:else}
      <FormHeader>
        {#snippet children({ label })}
          <Card.Title>{label}</Card.Title>
          <FormActions />
        {/snippet}
      </FormHeader>
      {#if vm.isLoading}
        <FormLoading />
      {:else if vm.error}
        <FormError />
      {:else}
        <FormBody />
        <FormFooter />
      {/if}
    {/if}
  </Card.Root>
</form>
