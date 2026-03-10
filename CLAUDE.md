# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

specloom is a headless admin runtime and TypeSpec DSL. It defines admin UI semantics via TypeSpec, compiles to compiled spec v1 JSON, then evaluates with runtime context to produce state, validation, ViewModel, and UI metadata that UI frameworks render.

```
TypeSpec (定義) → compiled spec JSON (仕様) → state / validation / VM / UI metadata → UI
```

Key principle: **UI contains no permission logic**. It reads state, validation results, ViewModel flags, and UI metadata from `specloom`.

## Commands

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm build

# Run tests
pnpm test

# Type check
pnpm typecheck

# Development mode (watch)
pnpm dev
```

Individual package commands from package directories:
```bash
# Run single test file
pnpm vitest run path/to/test.ts

# Watch mode for single package
pnpm dev
```

## Architecture

### Monorepo Structure

| Package | Purpose |
|---------|---------|
| `packages/specloom` | Runtime core: loader, evaluator, facade, state, validation, normalize, serialize, options, filter, format, action, UI resolver |
| `packages/spec` | Shared compiled spec v1 contract |
| `packages/typespec` | TypeSpec decorators + emitter for compiling `.tsp` to compiled spec JSON |
| `packages/auth-provider` | Authentication provider abstraction (Firebase Identity Platform impl) |
| `packages/data-provider` | Data provider abstraction with REST impl and authenticated HTTP client |
| `packages/api` | OpenAPI spec definition |

### Core specloom Modules

- **loader/** - JSON spec loading/parsing
- **resolver/** - Resource, input, and field resolution
- **evaluator/** - Evaluates spec + context → ViewModel
- **state/** - `createFormState`, `createInputState`, `createListState`
- **validation/** - Field and rule validation
- **normalize/** - Input value normalization and nested/relation updates
- **serialize/** - Submit payload generation
- **options/** - Static/remote option resolution
- **filter/** - Named filter and filter expression evaluation
- **format/** - Display formatting helpers
- **action/** - Action request descriptor helpers
- **ui/** - Renderer-agnostic UI presentation resolver
- **vm/** - ViewModel types

### Spec Concepts

Three main elements define an admin UI:

1. **Resource / Input** - Data model, form model, fields, validation, relations
2. **View** - List / form / show config with columns, sections, filters, sorting
3. **Action / Rule** - Operations and cross-field constraints

### Auth Provider (`@specloom/auth-provider`)

- **core/** - `AuthProvider<TTenant>` interface, `AuthIdentity`, `LoginParams`, `SignInMethod` types
- **providers/firebase/** - `createFirebaseAuthProvider()` - Firebase Identity Platform multi-tenant impl
- Firebase is optional peer dependency, imported via `@specloom/auth-provider/firebase` subpath

### Data Provider (`@specloom/data-provider`)

- **core/** - `DataProvider` interface, `ListParams`, `ResourceConfig`, `CustomAction` types
- **http/** - `createHttpClient()` - Bearer token auto-injection, 401/403 error handling via `TokenProvider` interface, `HttpError` type for structured errors
- **providers/rest/** - `createRestDataProvider()` - REST impl with per-resource endpoint/transform/action config
- No dependency on `@specloom/auth-provider` — uses `TokenProvider` (getToken + optional checkError(`HttpError`))

### TypeSpec Decorators

The `@specloom/typespec` package provides decorators:
- `@entity`, `@field`, `@listView`, `@showView`, `@formView`, `@section`
- `@filter`, `@options`, `@optionSource`
- `@relation`, `@nested`
- `@action`, `@rule`
- `@visibleWhen`, `@requiredWhen`, `@readonlyWhen`, `@disabledWhen`, `@match`
- TypeSpec built-ins: `@minValue`, `@maxValue`, `@minLength`, `@maxLength`, `@pattern`, `@minItems`, `@maxItems`

## Documentation

- `docs/typespec/` - TypeSpec usage guide with decorator references
- `docs/spec/v1-compiled.md` - Compiled spec v1 reference
- `docs/spec/v1-status.md` - Current design status
- `docs/spec/view_model.md` - ViewModel spec reference
- `docs/spec/api.md` - API spec reference
- `docs/guides/solid/README.md` - SolidJS guides index
- `docs/guides/solid/runtime.md` - specloom runtime integration for SolidJS
- `docs/guides/solid-integration.md` - provider-oriented SolidJS integration guide (AuthContext, DataContext, AuthGuard)

## Git ワークフロー

- コミット前に必ず確認を求める
- コミットメッセージは日本語で記述
- conventional commit 形式を使用（feat:, fix:, refactor:, docs: など）
