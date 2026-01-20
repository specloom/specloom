<script lang="ts">
  import "../app.css";
  import AdminLayout from "$lib/components/AdminLayout.svelte";

  let { children } = $props();
</script>

<AdminLayout>
  {@render children()}
</AdminLayout>
