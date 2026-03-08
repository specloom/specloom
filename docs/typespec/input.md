# Input

現行 DSL には `@input` decorator はありません。

`CompiledInput` は action input model から生成されます。

## How Inputs Are Produced

`@pageAction` / `@rowAction` の第3引数に model を渡すと、その model が input として emit されます。

```typespec
model ExportUsersInput {
  @field(#{ label: "Format", form: true })
  format: string;
}

@pageAction(User, #{
  id: "export",
  view: "list",
  label: "Export",
  selection: "query"
}, ExportUsersInput)
op exportUsers(): string;
```

## Compiled Shape

input model は compiled spec の `inputs` に入ります。

```ts
type CompiledInput = {
  name: string;
  label?: string;
  fields: Record<string, CompiledField>;
  form: {
    sections: CompiledSection[];
  };
  rules: CompiledRule[];
};
```

## What Carries Over

input model でも次が使えます。

- `@field`
- `@section`
- `@rule`
- `@relation`
- `@nested`
- `@options`
- `@optionSource`
- `@visibleWhen`
- `@requiredWhen`
- `@readonlyWhen`
- `@disabledWhen`
- TypeSpec built-in validation

## Runtime Use

input は runtime で resource form とほぼ同じように扱えます。

```ts
import {
  createInputState,
  createInputVM,
  validateSpec,
} from "specloom";

const spec = validateSpec(specJson);

let input = createInputState({
  spec,
  input: "ExportUsersInput",
  values: { format: "csv" },
});

input = input.setValue("format", "xlsx");

const vm = input.view();
const { state: validated, result } = input.validate();
const payload = validated.serialize();
```

## Notes

- input model は action input 以外の standalone form schema としても使えます
- compiled spec では `resources` と `inputs` が分かれています
- backend 側でも `validateForm({ resource: input, ... })` と同じ shape で扱えます
