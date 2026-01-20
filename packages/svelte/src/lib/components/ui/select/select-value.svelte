<script lang="ts">
	import type { HTMLSpanAttributes } from "svelte/elements";
	import { cn } from "$lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		placeholder,
		children,
		...restProps
	}: HTMLSpanAttributes & {
		ref?: HTMLSpanElement | null;
		placeholder?: string;
	} = $props();
</script>

<span
	bind:this={ref}
	data-slot="select-value"
	data-placeholder={!children ? "" : undefined}
	class={cn(className)}
	{...restProps}
>
	{#if children}
		{@render children()}
	{:else}
		<span class="text-muted-foreground">{placeholder ?? ""}</span>
	{/if}
</span>
