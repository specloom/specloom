# Submit Serialization

送信用 payload は `submit` metadata と runtime state から組み立てます。

## APIs

```ts
import {
  serializeForm,
  serializeResource,
  serializeInput,
} from "specloom";
```

## Rules

- `submit.field` を送信先 key として使う
- `submit.shape` に応じて `self`, `scalar`, `scalar[]`, `object`, `object[]` を変換する
- `submit.valueField` がある relation は scalar 値へ落とす
- `serializeForm()` は readonly / disabled field を送信対象から外す
- schema ベースの serialize では computed field を送信対象から外す

## Example

```ts
const payload = serializeResource(resource, {
  name: "Alice",
  departmentId: { id: "dep-1", name: "HR" },
  addresses: [{ line1: "Tokyo" }],
});

// =>
// {
//   name: "Alice",
//   departmentId: "dep-1",
//   addresses: [{ line1: "Tokyo" }]
// }
```
