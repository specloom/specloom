import type { CompiledField, CompiledSpec } from "@specloom/spec";
import type { Context } from "../vm/types.js";

export interface ResolvedOption {
  value: string | number | boolean;
  label: string;
  raw?: unknown;
}

export interface ResolvedOptions {
  items: ResolvedOption[];
  searchable: boolean;
}

export interface OptionsFetchArgs {
  resource: string;
  op?: string;
  query?: string;
  searchFields?: string[];
  context: Context;
}

export type OptionsFetcher = (
  args: OptionsFetchArgs,
) => Promise<Record<string, unknown>[]>;

export interface CreateOptionsResolverArgs {
  spec: CompiledSpec;
  fetcher?: OptionsFetcher;
}

export interface ResolveOptionsArgs {
  field: CompiledField;
  context?: Context;
  query?: string;
}

export interface OptionsResolver {
  resolve(args: ResolveOptionsArgs): Promise<ResolvedOptions>;
}

export function createOptionsResolver(
  args: CreateOptionsResolverArgs,
): OptionsResolver {
  const { spec, fetcher } = args;

  return {
    async resolve({ field, context = {}, query }) {
      if (field.options) {
        return {
          items: field.options.map((option) => ({
            value: option.value,
            label: option.label,
            raw: option,
          })),
          searchable: false,
        };
      }

      if (field.optionsSource) {
        if (!fetcher) {
          throw new Error(
            `Options fetcher is required for ${field.name} optionsSource`,
          );
        }

        const rows = await fetcher({
          resource: field.optionsSource.resource ?? inferFieldResource(spec, field),
          op: field.optionsSource.op,
          query,
          searchFields: field.optionsSource.searchFields,
          context,
        });

        return {
          items: rows.map((row) => ({
            value: toPrimitive(row[field.optionsSource!.valueField]),
            label: String(row[field.optionsSource!.labelField] ?? ""),
            raw: row,
          })),
          searchable: Boolean(field.optionsSource.searchFields?.length),
        };
      }

      if (field.relation) {
        if (!fetcher) {
          return {
            items: [],
            searchable: Boolean(field.relation.searchFields?.length),
          };
        }

        const rows = await fetcher({
          resource: field.relation.lookupResource ?? field.relation.resource,
          op: field.relation.lookupOp,
          query,
          searchFields: field.relation.searchFields,
          context,
        });

        return {
          items: rows.map((row) => ({
            value: toPrimitive(row[field.relation!.valueField]),
            label: String(row[field.relation!.labelField] ?? ""),
            raw: row,
          })),
          searchable: Boolean(field.relation.searchFields?.length),
        };
      }

      return {
        items: [],
        searchable: false,
      };
    },
  };
}

function inferFieldResource(spec: CompiledSpec, field: CompiledField): string {
  if (field.relation) {
    return field.relation.lookupResource ?? field.relation.resource;
  }

  const first = Object.keys(spec.resources)[0];
  return first ?? "";
}

function toPrimitive(value: unknown): string | number | boolean {
  if (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return value;
  }

  return String(value ?? "");
}
