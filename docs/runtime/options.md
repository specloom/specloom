# Options

select, autocomplete, relation picker 向けの option 解決 API です。

## API

```ts
import { createOptionsResolver } from "specloom";
```

```ts
const resolver = createOptionsResolver({
  spec,
  fetcher: async ({ resource, op, query, searchFields, context }) => {
    return rows;
  },
});
```

## Resolver Contract

```ts
type OptionsResolver = {
  resolve(args: {
    field: CompiledField;
    context?: Context;
    query?: string;
  }): Promise<ResolvedOptions>;
};

type ResolvedOptions = {
  items: Array<{
    value: string | number | boolean;
    label: string;
    raw?: unknown;
  }>;
  searchable: boolean;
};
```

## Resolution Order

`resolve()` は次の順で判定します。

1. `field.options`
   static options を同期的に返す
2. `field.optionsSource`
   injected `fetcher` を呼ぶ
3. `field.relation`
   relation lookup として `fetcher` を呼ぶ
4. それ以外
   空配列を返す

## Static Options

```ts
const options = await resolver.resolve({ field });
```

`field.options` がある場合:

- `items` は `value/label` をそのまま使う
- `searchable` は `false`

## Remote Options

`field.optionsSource` がある場合、`fetcher` へ次が渡ります。

```ts
type OptionsFetchArgs = {
  resource: string;
  op?: string;
  query?: string;
  searchFields?: string[];
  context: Context;
};
```

戻り値の row は:

- `valueField`
- `labelField`

で `ResolvedOption` へ変換されます。

## Relation Fallback

`field.relation` がある場合は:

- `lookupResource ?? resource`
- `lookupOp`
- `searchFields`

を使って relation options として解決します。

`fetcher` が未指定なら:

- error にはせず
- `items: []`
- `searchable: Boolean(searchFields?.length)`

を返します。

## Typical Usage

```ts
const resolver = createOptionsResolver({ spec, fetcher });

const departmentOptions = await resolver.resolve({
  field: departmentField,
  context: { role: "admin" },
  query: "eng",
});
```
