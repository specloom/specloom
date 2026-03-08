# CLAUDE.md - solid-project

specloom の管理画面フロントエンド。SolidStart + Tailwind CSS v4 + solid-ui コンポーネントで構成。
specloom runtime で spec 評価・state 管理・validation・UI メタデータ解決を行い、Solid 側は描画に専念する。

## Commands

```bash
# 開発サーバー起動
pnpm dev

# ビルド
pnpm build

# プレビュー
pnpm preview
```

## Architecture

### Tech Stack

- **Framework**: SolidStart 2.0 (alpha) + SolidJS 1.9
- **Styling**: Tailwind CSS v4 (`@tailwindcss/vite` プラグイン)
- **UI Library**: solid-ui (Kobalte ベース) — `src/components/ui/`
- **Build**: Vite 7 + Nitro 3
- **Admin Runtime**: `specloom` (spec 評価・state・validation・UI resolver)
- **Data I/O**: `@specloom/data-provider` (REST impl)
- **Auth**: `@specloom/auth-provider` (Firebase Identity Platform)

### Directory Structure

```
src/
├── app.tsx              # Router + AdminLayout ラッパー
├── app.css              # Tailwind v4 @theme + CSS 変数定義
├── entry-client.tsx     # クライアントエントリ
├── entry-server.tsx     # SSR エントリ
├── lib/
│   └── utils.ts         # cn() ユーティリティ (clsx + tailwind-merge)
├── admin/               # specloom runtime 統合層
│   ├── runtime.ts       # createAdminRuntime() — spec, ui, options 初期化
│   └── FieldRenderer.tsx # renderer key → Solid component の解決
├── auth/                # 認証・データプロバイダ統合層
│   ├── context.tsx      # createAuthContext() — AuthProvider を signal に接続
│   ├── data-context.tsx # DataContextProvider + useDataProvider
│   ├── guard.tsx        # AuthGuard（ロールベースルートガード）
│   ├── setup.ts         # 組み立てファクトリ (Firebase + REST)
│   └── index.ts         # テナント定義 + re-export
├── components/
│   ├── AdminLayout.tsx  # サイドバー + ヘッダー + メインコンテンツ
│   ├── AppSidebar.tsx   # ナビゲーションサイドバー（メニュー定義）
│   └── ui/              # solid-ui プリミティブ（直接編集しない）
└── routes/              # ファイルベースルーティング
    ├── index.tsx         # /
    ├── about.tsx         # /about
    └── [...404].tsx      # 404
```

### specloom Runtime Integration

specloom は framework 非依存。Solid 側では以下のパターンで統合する：

1. **Runtime 初期化** (`src/admin/runtime.ts`)
   - `validateSpec()` で compiled spec JSON をロード
   - `createUiResolver()` で renderer key → presentation マッピング設定
   - `createOptionsResolver()` で relation / optionSource の選択肢取得を統一

2. **State を signal に載せる**
   - `createFormState()` / `createListState()` の戻り値を `createSignal` に格納
   - 変更は `setForm(current => current.setValue(name, value))` のように immutable 更新
   - `form().view()` / `list().view()` で ViewModel を取得

3. **renderer key → Component 解決** (`src/admin/FieldRenderer.tsx`)
   - `createUiResolver().field()` は component を返さず presentation (renderer key, props, layout) を返す
   - Solid 側で `fieldRegistry` を持ち `Dynamic` component で描画

4. **I/O は provider に委譲**
   - `@specloom/data-provider`: list / create / update / action
   - `@specloom/auth-provider`: 認証, token, 権限チェック
   - specloom runtime は I/O を持たない

### Key Patterns

```tsx
// FormState: immutable state + signal
const [form, setForm] = createSignal(
  createFormState({ spec, resource: "User", mode: "create", context: { role: "admin" } })
);
const vm = createMemo(() => form().view());
const setValue = (name: string, value: unknown) => {
  setForm((current) => current.setValue(name, value));
};

// ListState: server data を setData で注入
const [list, setList] = createSignal(
  createListState({ spec, resource: "User", context: { role: "admin" }, data: [] })
);
// rows loaded → setList(current => current.setData(rows))

// Validation: validate() が次 state + result を返す
const { state, result } = form().validate();
setForm(state);
if (!result.valid) return;
await dataProvider.create("User", { data: state.serialize() });
```

### Layout

- `AdminLayout` — `SidebarProvider` > `AppSidebar` + `SidebarInset`（ヘッダー + コンテンツ）
- `AppSidebar` — collapsible="icon" 対応、`Cmd+B` でトグル
- ナビゲーション項目は `AppSidebar.tsx` の `mainNavItems` 配列で管理

### Conventions

- パスエイリアス: `~/` → `src/`
- UIコンポーネント (`src/components/ui/`): solid-ui から生成されたもの。直接編集せず、カスタムコンポーネントは `src/components/` に配置
- CSS 変数: `app.css` の `:root` / `.dark` で light/dark テーマ定義
- Tailwind v4: `@theme inline` ブロックで色・radius をマッピング。`tailwind.config.cjs` は v3 互換用（fontFamily のみ）
- sidebar カラーは `--sidebar-*` CSS 変数 → `@theme` の `--color-sidebar-*` でマッピング
- specloom の state は immutable — mutable store として扱わない
- フィールドの表示制御 (visible/readonly/disabled) は spec の条件式 (`visibleWhen` 等) + context で評価される。UI 側は ViewModel の flags を読むだけ
