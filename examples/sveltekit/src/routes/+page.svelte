<script lang="ts">
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";

  onMount(() => {
    goto("/users");
  });
</script>

<div class="flex items-center justify-center h-full">
  <p class="text-muted-foreground">リダイレクト中...</p>
</div>
