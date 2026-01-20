<script lang="ts">
  import type { Snippet } from "svelte";
  import type { FormFieldVM } from "specloom";
  import { getFormContext } from "./context.svelte.js";
  import * as Field from "$lib/components/ui/field/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import { Textarea } from "$lib/components/ui/textarea/index.js";
  import { Checkbox } from "$lib/components/ui/checkbox/index.js";
  import * as Select from "$lib/components/ui/select/index.js";
  import { cn } from "$lib/utils.js";
  import { ja as labels } from "$lib/i18n/ja.js";

  interface Props {
    field: FormFieldVM;
    class?: string;
    children?: Snippet<[{ field: FormFieldVM; value: unknown; onChange: (value: unknown) => void }]>;
  }

  let { field, class: className, children }: Props = $props();
  const ctx = getFormContext();

  const value = $derived(ctx.values[field.name]);
  const hasError = $derived(field.errors.length > 0);

  // リレーション用の検索結果
  let relationOptions = $state<Array<{ value: string; label: string }>>([]);

  function handleChange(newValue: unknown) {
    ctx.onChange(field.name, newValue);
  }

  /**
   * Parse value to Date object
   * - Date objects: used directly
   * - Numbers: treated as Unix timestamp (milliseconds)
   * - Strings: parsed, with date-only strings (YYYY-MM-DD) treated as local time
   */
  function parseToDate(val: unknown): Date | null {
    if (val == null) return null;
    if (val instanceof Date) return val;
    if (typeof val === "number") return new Date(val);
    if (typeof val === "string") {
      // Date-only string (YYYY-MM-DD) - parse as local time to avoid UTC shift
      if (/^\d{4}-\d{2}-\d{2}$/.test(val)) {
        const [year, month, day] = val.split("-").map(Number);
        return new Date(year, month - 1, day);
      }
      // Datetime-local string (YYYY-MM-DDTHH:mm) - parse as local time
      if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(val)) {
        const [datePart, timePart] = val.split("T");
        const [year, month, day] = datePart.split("-").map(Number);
        const [hours, minutes] = timePart.split(":").map(Number);
        return new Date(year, month - 1, day, hours, minutes);
      }
      // Other strings - let Date parse them
      return new Date(val);
    }
    return null;
  }

  /**
   * Format date value for <input type="date"> (YYYY-MM-DD)
   * Uses ctx.timeZone if specified, otherwise local time
   */
  function formatDateValue(val: unknown): string {
    const date = parseToDate(val);
    if (!date || isNaN(date.getTime())) return "";

    if (ctx.timeZone) {
      // Use specified timezone
      const formatter = new Intl.DateTimeFormat('sv-SE', {
        timeZone: ctx.timeZone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      });
      return formatter.format(date);
    }

    // Use local time
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  /**
   * Format datetime value for <input type="datetime-local"> (YYYY-MM-DDTHH:mm)
   * Uses ctx.timeZone if specified, otherwise local time
   */
  function formatDateTimeValue(val: unknown): string {
    const date = parseToDate(val);
    if (!date || isNaN(date.getTime())) return "";

    if (ctx.timeZone) {
      // Use specified timezone
      const dateFormatter = new Intl.DateTimeFormat('sv-SE', {
        timeZone: ctx.timeZone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      });
      const timeFormatter = new Intl.DateTimeFormat('en-GB', {
        timeZone: ctx.timeZone,
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });
      return `${dateFormatter.format(date)}T${timeFormatter.format(date)}`;
    }

    // Use local time
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }
</script>

{#if children}
  {@render children({ field, value, onChange: handleChange })}
{:else}
  <Field.Root class={cn(className)}>
    <Field.Label for={field.name}>
      {field.label}
      {#if field.required}
        <span class="ml-0.5 text-destructive">*</span>
      {/if}
    </Field.Label>

    {#if field.kind === "boolean"}
      <div class="flex items-center gap-2">
        <Checkbox
          id={field.name}
          checked={Boolean(value)}
          disabled={field.readonly}
          onCheckedChange={(checked) => handleChange(checked)}
        />
      </div>
    {:else if field.kind === "longText" || field.kind === "json"}
      <Textarea
        id={field.name}
        value={String(value ?? "")}
        placeholder={field.placeholder}
        disabled={field.readonly}
        rows={4}
        oninput={(e) => handleChange(e.currentTarget.value)}
      />
    {:else if field.kind === "number" || field.kind === "currency"}
      <Input
        type="number"
        id={field.name}
        value={value != null ? String(value) : ""}
        placeholder={field.placeholder}
        disabled={field.readonly}
        min={field.validation?.min}
        max={field.validation?.max}
        oninput={(e) => {
          const val = e.currentTarget.valueAsNumber;
          handleChange(Number.isNaN(val) ? undefined : val);
        }}
      />
    {:else if field.kind === "enum" || field.kind === "status"}
      {@const selectedLabel = field.options?.find(o => o.value === value)?.label}
      <Select.Root
        type="single"
        value={value != null ? String(value) : undefined}
        onValueChange={(v) => handleChange(v)}
        disabled={field.readonly}
      >
        <Select.Trigger id={field.name}>
          <Select.Value placeholder={field.placeholder ?? labels.selectPlaceholder}>
            {selectedLabel}
          </Select.Value>
        </Select.Trigger>
        <Select.Content>
          {#each field.options ?? [] as option}
            <Select.Item value={option.value} label={option.label}>
              {option.label}
            </Select.Item>
          {/each}
        </Select.Content>
      </Select.Root>
    {:else if field.kind === "date"}
      <Input
        type="date"
        id={field.name}
        value={formatDateValue(value)}
        disabled={field.readonly}
        oninput={(e) => handleChange(e.currentTarget.value)}
      />
    {:else if field.kind === "datetime"}
      <Input
        type="datetime-local"
        id={field.name}
        value={formatDateTimeValue(value)}
        disabled={field.readonly}
        oninput={(e) => handleChange(e.currentTarget.value)}
      />
    {:else if field.kind === "email"}
      <Input
        type="email"
        id={field.name}
        value={String(value ?? "")}
        placeholder={field.placeholder}
        disabled={field.readonly}
        oninput={(e) => handleChange(e.currentTarget.value)}
      />
    {:else if field.kind === "password"}
      <Input
        type="password"
        id={field.name}
        value={String(value ?? "")}
        placeholder={field.placeholder}
        disabled={field.readonly}
        oninput={(e) => handleChange(e.currentTarget.value)}
      />
    {:else if field.kind === "relation"}
      {@const relationValue = value as Record<string, unknown> | string | null}
      {@const currentValue = typeof relationValue === 'object' && relationValue !== null ? String(relationValue.id ?? '') : relationValue}
      {@const labelField = field.relation?.labelField ?? 'name'}
      {@const currentLabel = typeof relationValue === 'object' && relationValue !== null
        ? String(relationValue.label ?? relationValue[labelField] ?? '')
        : field.options?.find(o => o.value === relationValue)?.label}
      <Select.Root
        type="single"
        value={currentValue != null ? String(currentValue) : undefined}
        onValueChange={(v) => handleChange(v)}
        disabled={field.readonly}
      >
        <Select.Trigger id={field.name}>
          <Select.Value placeholder={field.placeholder ?? labels.selectPlaceholder}>
            {currentLabel ?? field.placeholder ?? labels.selectPlaceholder}
          </Select.Value>
        </Select.Trigger>
        <Select.Content>
          {#if ctx.onOptionsSearch && field.relation}
            <div class="p-2 border-b border-border">
              <Input
                type="text"
                placeholder="検索..."
                class="h-8"
                oninput={async (e) => {
                  const query = e.currentTarget.value;
                  if (ctx.onOptionsSearch && field.relation) {
                    relationOptions = await ctx.onOptionsSearch(field.relation.resource, query);
                  }
                }}
              />
            </div>
            {#each relationOptions as option}
              <Select.Item value={option.value} label={option.label}>
                {option.label}
              </Select.Item>
            {/each}
          {:else}
            {#each field.options ?? [] as option}
              <Select.Item value={option.value} label={option.label}>
                {option.label}
              </Select.Item>
            {/each}
          {/if}
        </Select.Content>
      </Select.Root>
    {:else}
      <Input
        type="text"
        id={field.name}
        value={String(value ?? "")}
        placeholder={field.placeholder}
        disabled={field.readonly}
        oninput={(e) => handleChange(e.currentTarget.value)}
      />
    {/if}

    {#if field.hint}
      <Field.Description>{field.hint}</Field.Description>
    {/if}

    {#if hasError}
      {#each field.errors as err}
        <Field.Error>{err}</Field.Error>
      {/each}
    {/if}
  </Field.Root>
{/if}
