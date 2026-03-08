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

export interface CreateSpecloomClientArgs<
  TTenant extends TenantType = TenantType,
> {
  spec: CompiledSpec | unknown;
  authProvider?: AuthProvider<TTenant>;
  dataProvider?: DataProvider;
  context?: Context;
  optionsFetcher?: OptionsFetcher;
}

export interface SpecloomClient<TTenant extends TenantType = TenantType> {
  spec: CompiledSpec;
  authProvider?: AuthProvider<TTenant>;
  dataProvider?: DataProvider;
  context: Context;
  optionsResolver: OptionsResolver;
  resolveContext(context?: Context): Context;
  resolveOptions(
    args: Omit<ResolveOptionsArgs, "context"> & { context?: Context },
  ): Promise<ResolvedOptions>;
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

export function createSpecloomClient<
  TTenant extends TenantType = TenantType,
>(args: CreateSpecloomClientArgs<TTenant>): SpecloomClient<TTenant> {
  const spec = validateSpec(args.spec);
  const baseContext = cloneContext(args.context);
  const optionsFetcher =
    args.optionsFetcher ??
    (args.dataProvider
      ? createDataProviderOptionsFetcher({
          dataProvider: args.dataProvider,
        })
      : undefined);
  const optionsResolver = createOptionsResolver({
    spec,
    fetcher: optionsFetcher,
  });

  return {
    spec,
    authProvider: args.authProvider,
    dataProvider: args.dataProvider,
    context: baseContext,
    optionsResolver,
    resolveContext(context) {
      return mergeContext(baseContext, context);
    },
    resolveOptions({ field, context, query }) {
      return optionsResolver.resolve({
        field,
        context: mergeContext(baseContext, context),
        query,
      });
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
