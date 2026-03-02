# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SolidJS example app for the specloom admin UI framework. Uses SolidStart v2 (alpha) with Vite 7, Tailwind CSS v4, and Kobalte headless primitives. Consumes specloom ViewModels to render admin interfaces where the UI contains no permission logic — it just reads `allowed` flags from the ViewModel.

Part of the specloom monorepo at `examples/solid-example/`. See the root `CLAUDE.md` for full monorepo architecture.

## Commands

```bash
pnpm dev       # Start dev server (Vite)
pnpm build     # Production build
pnpm start     # Start production server
pnpm preview   # Preview production build
```

No test or lint scripts are configured in this package.

## Architecture

- **SolidStart 2.0-alpha** with Nitro server — `src/entry-client.tsx` (client mount) and `src/entry-server.tsx` (SSR handler)
- **File-based routing** via `@solidjs/router` + `FileRoutes` — routes live in `src/routes/`
- **Layout**: `app.tsx` wraps all routes in `SidebarProvider` + `AppSidebar` + `SidebarInset`
- **Route pattern**: Resource CRUD follows `src/routes/{resource}/index.tsx` (list), `[id].tsx` (show), `new.tsx` (create), `[id]/edit.tsx` (edit)
- **Sidebar navigation**: `src/components/app-sidebar.tsx` — static `navItems` array drives the sidebar menu
- **UI components**: `src/components/ui/` — Kobalte primitives + CVA variants + `cn()` utility (solid-ui pattern)
- **Styling**: Tailwind CSS v4 via `@tailwindcss/vite` plugin — no `tailwind.config.cjs`, all theme config in `src/app.css` using `@theme inline` directive
- **Dark mode**: `@custom-variant dark` targets `.dark` class and `[data-kb-theme="dark"]` attribute
- **Path alias**: `~/` maps to `./src/` (configured in both `tsconfig.json` and `vite.config.ts`)
- **UI config**: `ui.config.json` defines aliases for the solid-ui component CLI tool

## Conventions

- UI components follow the solid-ui pattern: Kobalte primitive + CVA variants + `cn()` from `~/lib/utils` (wraps `clsx` + `tailwind-merge`)
- Route pages include a consistent header pattern: `SidebarTrigger` + `Separator` + page title inside a `header` element
- The `specloom` workspace package is a dependency — import types and evaluator from it

## Git ワークフロー

- コミット前に必ず確認を求める
- コミットメッセージは日本語で記述
- conventional commit 形式を使用（feat:, fix:, refactor:, docs: など）
