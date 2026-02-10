# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

specloom is a headless admin ViewModel specification library. It defines admin UI "meaning" via TypeSpec, compiles to JSON spec, then evaluates with runtime context (user, role) to produce ViewModels that UI frameworks render.

```
TypeSpec (定義) → JSON spec (仕様) → ViewModel (評価済み) → UI (描画)
```

Key principle: **UI contains no permission logic** - it just reads `allowed` flags from the ViewModel.

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
| `packages/specloom` | Core library: spec types, ViewModel, builder, loader, evaluator, validation |
| `packages/typespec` | TypeSpec decorators + emitter for compiling `.tsp` to JSON spec |
| `packages/auth-provider` | Authentication provider abstraction (Firebase Identity Platform impl) |
| `packages/data-provider` | Data provider abstraction with REST impl and authenticated HTTP client |
| `packages/solidjs` | SolidJS UI components |
| `packages/svelte` | Svelte UI components |
| `packages/api` | OpenAPI spec definition |

### Core specloom Modules

- **spec/** - TypeScript types for JSON spec format (resources, views, fields, actions)
- **vm/** - ViewModel types (evaluated spec with runtime context)
- **builder/** - Programmatic spec construction
- **loader/** - JSON spec loading/parsing
- **evaluator/** - Evaluates spec + context → ViewModel (handles `allowedWhen` expressions)
- **validation/** - Field validation rules

### Spec Concepts

Three main elements define an admin UI:

1. **Resource** - Data model with fields, kinds, validation, relations
2. **View** - Screen type (list/form/show) with columns, filters, sorting
3. **Action** - Operations with placement, permissions (`allowedWhen`), confirmation

### Auth Provider (`@specloom/auth-provider`)

- **core/** - `AuthProvider<TTenant>` interface, `AuthIdentity`, `LoginParams`, `SignInMethod` types
- **providers/firebase/** - `createFirebaseAuthProvider()` - Firebase Identity Platform multi-tenant impl
- Firebase is optional peer dependency, imported via `@specloom/auth-provider/firebase` subpath

### Data Provider (`@specloom/data-provider`)

- **core/** - `DataProvider` interface, `ListParams`, `ResourceConfig`, `CustomAction` types
- **http/** - `createHttpClient()` - Bearer token auto-injection, 401/403 error handling via AuthProvider
- **providers/rest/** - `createRestDataProvider()` - REST impl with per-resource endpoint/transform/action config
- Depends on `@specloom/auth-provider` for token management

### TypeSpec Decorators

The `@specloom/typespec` package provides decorators:
- `@resource`, `@label`, `@kind`, `@ui`, `@options`
- `@view`, `@columns`, `@fields`, `@searchable`, `@defaultSort`
- `@action`, `@placement`, `@allowedWhen`, `@confirm`
- `@relation`, `@required`, `@readonly`, validation decorators

## Documentation

- `docs/typespec/` - TypeSpec usage guide with decorator references
- `docs/spec/v0.1.md` - JSON spec format reference
- `docs/spec/view_model.md` - ViewModel spec reference
- `docs/spec/api.md` - API spec reference
- `docs/guides/solid-integration.md` - SolidJS integration guide (AuthContext, DataContext, AuthGuard)

## Git ワークフロー

- コミット前に必ず確認を求める
- コミットメッセージは日本語で記述
- conventional commit 形式を使用（feat:, fix:, refactor:, docs: など）

## Development Status

🚧 Under development - source files are scaffolded but implementations are empty.
