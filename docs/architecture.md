# specloom Architecture

## Overview

```text
TypeSpec -> compiled spec JSON -> specloom -> state / validation / VM / UI metadata -> UI
```

`specloom` は runtime core です。UI component は同梱せず、React / Solid / Svelte 側では renderer registry や adapter を薄く被せる前提です。

## Packages

| Package | Responsibility |
| --- | --- |
| `specloom` | Runtime core |
| `@specloom/typespec` | TypeSpec decorators and emitter |
| `@specloom/spec` | Compiled spec contract |
| `@specloom/auth-provider` | Auth abstraction |
| `@specloom/data-provider` | Data abstraction |
| `@specloom/api` | API TypeSpec package |

## Runtime Layers

1. Loader
   `parseSpec`, `validateSpec`
2. Resolver
   resource / input / field 解決
3. Expression
   `visibleWhen`, `requiredWhen`, `when` などの AST 評価
4. Validation
   field validation と cross-field rule validation
5. Normalize
   input の raw value を spec に沿って正規化
6. State
   `createFormState`, `createInputState`, `createListState`
7. ViewModel
   `createListVM`, `createShowVM`, `createFormVM`, `createInputVM`
8. Supporting helpers
   options, filter, format, action request, UI resolver, serialize

## Current Direction

- runtime core は pure function / immutable state を優先する
- `Admin` facade や class-based VM helper は持たない
- bundled UI library は持たない
- backend 側でも validation / filter / action request helper を再利用できる

## Guides

- runtime:
  [docs/runtime/README.md](/Volumes/SSD/projects/specloom/docs/runtime/README.md)
- typespec:
  [docs/typespec/README.md](/Volumes/SSD/projects/specloom/docs/typespec/README.md)
- compiled spec:
  [docs/spec/v1-compiled.md](/Volumes/SSD/projects/specloom/docs/spec/v1-compiled.md)
