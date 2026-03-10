# specloom Philosophy

## Overview

```text
TypeSpec -> compiled spec JSON -> specloom runtime -> state / validation / ViewModel / UI metadata -> UI
```

現行の specloom は UI component library ではなく、headless runtime です。

## Core Principle

UI は spec の意味を再実装しません。

- 表示条件は runtime が評価する
- validation は runtime が評価する
- action 実行情報は runtime helper が組み立てる
- UI は state / ViewModel / UI metadata を描画する

## Boundaries

### TypeSpec

TypeSpec 側で定義するもの:

- resource と input の構造
- field metadata
- list/form/show metadata
- relation / nested / options
- conditional rule
- model-level rule
- action metadata

代表的な decorator:

- `@entity`
- `@field`
- `@listView`
- `@showView`
- `@formView`
- `@filter`
- `@relation`
- `@nested`
- `@section`
- `@action`
- `@rule`

### Compiled Spec

compiled spec は runtime の正本です。

- authoring DSL には依存しない
- frontend / backend の両方から読める
- `ExpressionAst` や `submit` metadata まで含む

### Runtime

runtime が解決するもの:

- `parseSpec`, `validateSpec`
- field / form validation
- input value normalization
- form / input / list state
- list / show / form ViewModel
- options resolution
- filter evaluation
- value formatting
- action request descriptor
- UI presentation metadata

### UI

UI 側が持つ責務:

- component 選択
- layout / theme / animation
- renderer registry
- framework ごとの state binding

## Current Shape

### ViewModel is Display Data

ViewModel は表示用です。状態更新 API は持ちません。

- `createListVM`
- `createShowVM`
- `createFormVM`
- `createInputVM`

状態更新は `createFormState` / `createInputState` / `createListState` を使います。

### State is the Mutation Surface

UI が直接触る API は state helper です。

- `setValue`
- `patch`
- `validate`
- `serialize`
- `setSearch`
- `setNamedFilter`
- `setSort`
- `toggleSelect`

### UI Resolver is Metadata, Not Components

`createUiResolver` は component を返しません。

- renderer key
- merged props
- merged client metadata

だけを返します。React / Solid / Svelte 側で registry に結びます。

## What specloom Does Not Do

- React / Solid / Svelte component を同梱しない
- CSS や design token を持たない
- API レスポンスを ViewModel に固定しない
- backend 実装を規定しない

## Backend Use

specloom は frontend 専用ではありません。

backend 側でも次を共通利用できます。

- `validateForm`
- `filterRecords`
- `resolveFilterValue`
- `buildActionRequest`
- `serializeResource`
- `serializeInput`
