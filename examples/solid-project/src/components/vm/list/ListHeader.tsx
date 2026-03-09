import { A } from "@solidjs/router";
import { useI18n } from "@specloom/solidjs";
import { Button } from "~/components/ui/button";

export function ListHeader(props: {
  resourceName: string;
  label: string;
  pluralLabel?: string;
  rowCount: number;
}) {
  const { t } = useI18n();

  return (
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold">
          {props.pluralLabel ?? props.label}
        </h1>
        <p class="text-sm text-muted-foreground mt-1">
          {t("list.recordCount", { count: props.rowCount })}
        </p>
      </div>
      <A href={`/resources/${props.resourceName}/new`}>
        <Button>{t("list.newButton", { label: props.label })}</Button>
      </A>
    </div>
  );
}
