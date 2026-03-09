import type { AuthProvider, TenantType } from "@specloom/auth-provider";
import type {
  DataProvider,
  ListParams,
  ListResult,
} from "@specloom/data-provider";
import type { CompiledSpec } from "@specloom/spec";
import {
  createOptionsResolver,
  validateSpec,
  type Context,
  type OptionsFetchArgs,
  type OptionsFetcher,
  type OptionsResolver,
  type ResolveOptionsArgs,
  type ResolvedOptions,
} from "specloom";

export interface CreateDataProviderOptionsFetcherArgs {
  dataProvider: DataProvider;
  mapParams?: (args: OptionsFetchArgs) => ListParams;
}

export interface CreateSpecloomRuntimeArgs<
  TTenant extends TenantType = TenantType,
> {
  authProvider?: AuthProvider<TTenant>;
  dataProvider?: DataProvider;
  context?: Context;
}

export interface CreateSpecloomOptionsResolverArgs {
  spec: CompiledSpec | unknown;
  dataProvider?: DataProvider;
  optionsFetcher?: OptionsFetcher;
  mapParams?: (args: OptionsFetchArgs) => ListParams;
}

export interface SpecloomRuntime<TTenant extends TenantType = TenantType> {
  authProvider?: AuthProvider<TTenant>;
  dataProvider?: DataProvider;
  context: Context;
  resolveContext(context?: Context): Context;
}

export function createDataProviderOptionsFetcher(
  args: CreateDataProviderOptionsFetcherArgs,
): OptionsFetcher {
  return async (fetchArgs) => {
    const result = await args.dataProvider.getList<Record<string, unknown>>(
      fetchArgs.resource,
      args.mapParams?.(fetchArgs) ?? defaultListParams(fetchArgs),
    );
    return toRows(result);
  };
}

export function createSpecloomOptionsResolver(
  args: CreateSpecloomOptionsResolverArgs,
): OptionsResolver {
  const spec = validateSpec(args.spec);
  const fetcher =
    args.optionsFetcher ??
    (args.dataProvider
      ? createDataProviderOptionsFetcher({
          dataProvider: args.dataProvider,
          mapParams: args.mapParams,
        })
      : undefined);

  return createOptionsResolver({
    spec,
    fetcher,
  });
}

export async function resolveSpecloomOptions(
  args: CreateSpecloomOptionsResolverArgs &
    Omit<ResolveOptionsArgs, "context"> & { context?: Context },
): Promise<ResolvedOptions> {
  return createSpecloomOptionsResolver(args).resolve({
    field: args.field,
    context: args.context,
    query: args.query,
  });
}

export function createSpecloomRuntime<
  TTenant extends TenantType = TenantType,
>(args: CreateSpecloomRuntimeArgs<TTenant>): SpecloomRuntime<TTenant> {
  const baseContext = cloneContext(args.context);

  return {
    authProvider: args.authProvider,
    dataProvider: args.dataProvider,
    context: baseContext,
    resolveContext(context) {
      return mergeContext(baseContext, context);
    },
  };
}

function defaultListParams(args: OptionsFetchArgs): ListParams {
  return {
    pagination: { page: 1, perPage: 50 },
    sort: { field: "id", order: "asc" },
    filter: args.query
      ? {
          q: args.query,
          searchFields: args.searchFields ?? [],
        }
      : {},
  };
}

function toRows(
  result: ListResult<Record<string, unknown>>,
): Record<string, unknown>[] {
  return result.data;
}

function cloneContext(context?: Context): Context {
  if (!context) {
    return {};
  }

  return {
    ...context,
    ...(context.user ? { user: { ...context.user } } : {}),
    ...(context.permissions ? { permissions: [...context.permissions] } : {}),
    ...(context.custom ? { custom: { ...context.custom } } : {}),
  };
}

function mergeContext(base: Context, override?: Context): Context {
  if (!override) {
    return cloneContext(base);
  }

  return {
    ...base,
    ...override,
    ...(base.user || override.user
      ? {
          user: {
            ...(base.user ?? {}),
            ...(override.user ?? {}),
          },
        }
      : {}),
    ...(base.permissions || override.permissions
      ? {
          permissions: override.permissions ?? base.permissions,
        }
      : {}),
    ...(base.custom || override.custom
      ? {
          custom: {
            ...(base.custom ?? {}),
            ...(override.custom ?? {}),
          },
        }
      : {}),
  };
}
