<script lang="ts">
	import { Select as SelectPrimitive } from "bits-ui";

	let {
		open = $bindable(false),
		value = $bindable(),
		...restProps
	}: SelectPrimitive.RootProps = $props();
</script>

<!-- Note: `as never` is required for TypeScript compatibility with Svelte's bindable generic types -->
<SelectPrimitive.Root bind:open bind:value={value as never} {...restProps} />
