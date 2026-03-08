# Relation

relation, nested, static options, remote options source の詳細です。

## `@relation`

既存 resource への参照を定義します。

```typespec
@field(#{ label: "Department", form: true, show: true, list: true })
@relation(Department, #{
  kind: "belongsTo",
  cardinality: "one",
  labelField: "name",
  valueField: "id",
  submitField: "departmentId",
  searchFields: #["name"],
  lookupResource: "Department",
  linkTo: "show",
  creatable: false,
  client: #{
    modalSize: "lg"
  }
})
departmentId?: string;
```

主な option:

- `kind`
- `cardinality`
- `labelField`
- `valueField`
- `submitField`
- `searchFields`
- `lookupResource`
- `lookupOp`
- `linkTo`
- `creatable`
- `client`

## `@nested`

owned child を親 form に inline で含めます。

```typespec
@field(#{ label: "Addresses", form: true, show: true })
@nested(Address, #{
  cardinality: "many",
  minItems: 1,
  maxItems: 3,
  widget: "table"
})
addresses: Address[];
```

`widget`:

- `"inline-form"`
- `"table"`
- `"cards"`

## `@options`

静的な選択肢です。

```typespec
@field(#{ label: "Status", form: true })
@options(#[
  #{ value: "draft", label: "Draft" },
  #{ value: "published", label: "Published" }
])
status: string;
```

## `@optionSource`

remote options source を定義します。

```typespec
@field(#{ label: "Assignee", form: true })
@optionSource(#{
  resource: "User",
  labelField: "name",
  valueField: "id",
  searchFields: #["name", "email"]
})
assigneeId?: string;
```

## Runtime Connection

compiled metadata は runtime の次へ接続されます。

```ts
import {
  createOptionsResolver,
  createUiResolver,
  normalizeInputValue,
  serializeResource,
} from "specloom";
```

対応する責務:

- `createOptionsResolver`
  static options / optionsSource / relation lookup を統一解決
- `normalizeInputValue`
  relation / nested 入力値の正規化
- `serializeResource`
  `submitField` / `valueField` に従って送信用 shape を生成
- `createUiResolver`
  relation picker / nested table などの renderer key 解決

## Compiled Shape Summary

relation:

```ts
type CompiledRelation = {
  resource: string;
  kind: "belongsTo" | "hasOne" | "hasMany" | "manyToMany";
  cardinality: "one" | "many";
  labelField: string;
  valueField: string;
  submitField?: string;
  searchFields?: string[];
  lookupResource?: string;
  lookupOp?: string;
  linkTo?: "show" | "edit" | "none";
  creatable?: boolean;
  client?: Record<string, unknown>;
};
```

nested:

```ts
type CompiledNested = {
  resource: string;
  cardinality: "one" | "many";
  minItems?: number;
  maxItems?: number;
  widget?: "inline-form" | "table" | "cards";
  maxDepth: 3;
};
```
