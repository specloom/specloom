# Repository Guidelines

## Project Structure & Module Organization
This repository is a `pnpm` workspace managed with Turborepo. Core packages live in `packages/`: `specloom` contains the runtime core and headless helpers, `typespec` contains TypeSpec decorators and emitter support, `spec` holds the compiled spec contract, `api` holds the TypeSpec API definitions, and `auth-provider` / `data-provider` provide integration layers. Core runtime tests live in `packages/specloom/tests`. Reference docs live under `docs/`.

## Build, Test, and Development Commands
Install once with `pnpm install`.

- `pnpm build` runs all workspace builds through Turbo.
- `pnpm test` runs workspace tests after dependent builds.
- `pnpm typecheck` runs TypeScript and TypeSpec checks.
- `pnpm dev` starts package watch tasks where available.
- `pnpm --filter specloom test` runs the core Vitest suite only.
- `pnpm --filter @specloom/api build` compiles the API TypeSpec package.
- `pnpm --filter @specloom/typespec test` runs the TypeSpec emitter tests.

## Coding Style & Naming Conventions
Use TypeScript with strict settings and ESM conventions. Follow the existing style: 2-space indentation, double quotes, trailing commas where already present, and explicit `.js` extensions in internal imports under NodeNext. Keep package entrypoints in `src/index.ts`; prefer descriptive module names such as `vm-show.ts` or `restDataProvider.ts`. There is no dedicated formatter or linter configured at the root, so keep changes consistent with nearby files and rely on `tsc` and tests to catch issues.

## Testing Guidelines
Vitest is the active test framework. Add fast tests as `*.test.ts` under the relevant package. For `specloom`, keep runtime flows under `packages/specloom/tests`. Run `pnpm test` before opening a PR; for focused work, use package filters such as `pnpm --filter specloom test`.

## Commit & Pull Request Guidelines
Recent history follows Conventional Commit style, for example `feat: ...`, `feat(specloom): ...`, and `docs: ...`. Use an imperative subject, and add a scope when the change is package-specific. PRs should describe the affected workspace packages, summarize behavior changes, list verification commands, and link related issues or spec docs when the change alters TypeSpec or API behavior.
