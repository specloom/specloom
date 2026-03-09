import type { CompiledResource } from "@specloom/spec";
import { A } from "@solidjs/router";
import { createMemo, For, Show } from "solid-js";
import { createShowVM, type ShowFieldVM } from "specloom";
import { generateMockData } from "~/admin/mock-data";
import { Separator } from "~/components/ui/separator";
import { Button } from "~/components/ui/button";
import { SpecFieldValue } from "~/components/vm/SpecValue";

export function ResourceShowPage(props: {
  resource: CompiledResource;
  id: string;
}) {
  const keyField = () => {
    for (const f of Object.values(props.resource.fields)) {
      if (f.key) return f.name;
    }
    return "id";
  };

  const record = createMemo(() => {
    const data = generateMockData(props.resource);
    return data.find((r) => r[keyField()] === props.id);
  });

  const vm = createMemo(() => {
    const current = record();
    if (!current) return undefined;
    return createShowVM(props.resource, {
      context: {},
      record: current,
    });
  });

  return record() && vm() ? (
    <div>
      <div class="flex items-center gap-4 mb-6">
        <A
          href={`/resources/${props.resource.name}`}
          class="text-sm text-muted-foreground hover:text-foreground"
        >
          ← {props.resource.meta.pluralLabel ?? props.resource.meta.label}
        </A>
      </div>

      <div class="flex items-center justify-between mb-6">
        <h1 class="text-2xl font-bold">
          {props.resource.meta.label}: {props.id}
        </h1>
        <A href={`/resources/${props.resource.name}/${props.id}/edit`}>
          <Button variant="outline">Edit</Button>
        </A>
      </div>

      <div class="max-w-2xl space-y-6">
        <Show
          when={vm()!.sections.length > 0}
          fallback={<FieldGrid fields={vm()!.fields} />}
        >
          <For each={vm()!.sections}>
            {(section) => (
              <div>
                <h2 class="text-lg font-semibold mb-3">{section.label}</h2>
                <FieldGrid fields={section.fields} />
                <Separator class="mt-4" />
              </div>
            )}
          </For>
        </Show>
      </div>
    </div>
  ) : (
    <div class="text-sm text-muted-foreground">
      Record not found: {props.id}
    </div>
  );
}

function FieldGrid(props: { fields: ShowFieldVM[] }) {
  return (
    <dl class="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <For each={props.fields}>
        {(field) => (
          <div>
            <dt class="text-sm font-medium text-muted-foreground">
              {field.label}
            </dt>
            <dd class="mt-1 text-sm">
              <SpecFieldValue field={field} value={field.value} />
            </dd>
          </div>
        )}
      </For>
    </dl>
  );
}
