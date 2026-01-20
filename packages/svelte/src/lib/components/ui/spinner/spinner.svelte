<script lang="ts">
	import { cn } from "$lib/utils.js";
	import Loader2Icon from "@lucide/svelte/icons/loader-2";

	interface Props {
		class?: string;
		size?: number | string;
		strokeWidth?: number | string;
	}

	let { class: className, size, strokeWidth }: Props = $props();
</script>

<Loader2Icon
	role="status"
	aria-label="Loading"
	class={cn("size-4 animate-spin", className)}
	{size}
	{strokeWidth}
/>
