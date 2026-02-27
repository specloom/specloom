# specloom

Headless admin ViewModel specification library.

TypeSpec で管理画面の「意味」を定義し、JSON spec にコンパイルし、ランタイムコンテキスト（ユーザー、ロール）で評価して ViewModel を生成します。UI フレームワークは ViewModel を描画するだけです。

```
TypeSpec (定義) → JSON spec (仕様) → ViewModel (評価済み) → UI (描画)
```

**原則: UI は権限ロジックを持たない** — `allowed` フラグを読むだけ。

## インストール

```bash
# コアライブラリ
npm install specloom

# TypeSpec で定義する場合
npm install @specloom/typespec --save-dev

# 認証プロバイダー（Firebase）
npm install @specloom/auth-provider

# データプロバイダー（REST）
npm install @specloom/data-provider

# UI フレームワーク（いずれか）
npm install @specloom/solidjs
npm install @specloom/svelte
```

## クイックスタート

### 1. TypeSpec でリソースとビューを定義

```typespec
import "@specloom/typespec";

@S.resource
@S.label("投稿")
model Post {
  @S.readonly id: string;
  @S.label("タイトル") @S.kind("text") @S.required title: string;
  @S.label("状態") @S.kind("enum") @S.options(#[
    #{ value: "draft", label: "下書き" },
    #{ value: "published", label: "公開中" }
  ]) status: string;
  @S.label("作成日時") @S.kind("datetime") @S.readonly createdAt: utcDateTime;
}

@S.view(Post, "list")
@S.columns(["title", "status", "createdAt"])
@S.searchable(["title"])
@S.defaultSort("createdAt", "desc")
model PostList {
  @S.action("create") @S.label("新規作成")
  @S.allowedWhen("role == 'admin' || role == 'editor'")
  create: never;

  @S.rowAction("delete") @S.label("削除")
  @S.allowedWhen("role == 'admin'")
  @S.confirm("本当に削除しますか？")
  delete: never;
}
```

### 2. JSON spec にコンパイル

```bash
npx tsp compile .
```

### 3. ViewModel を生成して UI で描画

```ts
import { createAdmin, ListVM, ActionVMHelper, Format } from "specloom";

// Spec + デフォルトコンテキストで Admin レジストリを生成
const admin = createAdmin(spec, { role: "admin", user: { id: "1" } });

// ListVM を生成（イミュータブルクラス）
const list = admin.list("Post", { data: posts });

// プロパティアクセス
list.fields;       // ListFieldVM[]
list.rows;         // RowVM[]
list.pageActions;   // ActionVM[]

// メソッドチェーン（各操作は新しいインスタンスを返す）
const updated = list
  .setSearchQuery("test")
  .toggleFilter("active")
  .setPage(2);

// アクションの許可チェック（UI は boolean を見るだけ）
const allowed = ActionVMHelper.allowed(list.pageActions);

// 値のフォーマット
Format.date(value, { locale: "ja-JP" });
Format.currency(1000);      // "¥1,000"
Format.relative(createdAt);  // "3日前"
```

## アーキテクチャ

### パッケージ構成

| パッケージ | 説明 |
|-----------|------|
| `specloom` | コアライブラリ: spec 型定義、ViewModel、evaluator、validation、format |
| `@specloom/typespec` | TypeSpec デコレーター + emitter（`.tsp` → JSON spec） |
| `@specloom/auth-provider` | 認証プロバイダー抽象化（Firebase Identity Platform 実装） |
| `@specloom/data-provider` | データプロバイダー抽象化（REST 実装 + 認証付き HTTP クライアント） |
| `@specloom/solidjs` | SolidJS UI コンポーネント（Ark UI + Panda CSS） |
| `@specloom/svelte` | Svelte UI コンポーネント（bits-ui + Tailwind CSS v4） |
| `@specloom/api` | OpenAPI 仕様定義（TypeSpec） |

### コアモジュール（`specloom`）

| モジュール | 説明 |
|-----------|------|
| `spec/` | JSON spec の TypeScript 型定義（Resource, Field, View, Action） |
| `vm/` | ViewModel イミュータブルクラス（ListVM, FormVM, ShowVM, ActionVMHelper） |
| `evaluator/` | Spec + Context → ViewModel 変換（式パーサー内蔵、`eval()` 不使用） |
| `validation/` | フィールドバリデーション（required, pattern, min/max, match） |
| `format/` | 値のフォーマット（日付、通貨、数値、相対時間、ファイルサイズ） |
| `serialize/` | 送信用データ変換（JSON, multipart, query params） |
| `filter/` | フィルター式の構築・評価（20+ 演算子、AND/OR/NOT） |
| `i18n/` | 国際化（ja/en、SSR 対応ファクトリパターン） |
| `facade/` | ViewModel 生成のショートカット関数（createListVM, createShowVM, createFormVM） |
| `admin/` | Admin レジストリ（Spec + Context を保持、ViewModel 生成を簡潔化） |
| `loader/` | JSON spec の読み込み・バリデーション |

### Spec の3要素

| 要素 | 説明 |
|------|------|
| **Resource** | データモデル（フィールド、型、バリデーション、リレーション） |
| **View** | 画面定義（list / form / show）— 表示カラム、フィルター、ソート |
| **Action** | 操作定義（`allowedWhen` 式による権限、確認ダイアログ、配置） |

### 認証プロバイダー（`@specloom/auth-provider`）

```ts
import type { AuthProvider } from "@specloom/auth-provider";
import { createFirebaseAuthProvider } from "@specloom/auth-provider/firebase";

const auth = createFirebaseAuthProvider({
  firebaseConfig: { /* ... */ },
  tenantId: "tenant-abc",
});

await auth.login({ email, password });
const token = await auth.getToken();
const identity = await auth.getIdentity();
```

- `AuthProvider<TTenant>` インターフェース: login, logout, checkAuth, getToken, getIdentity, checkPermissions
- Firebase Identity Platform マルチテナント実装
- Firebase はオプショナル peer dependency

### データプロバイダー（`@specloom/data-provider`）

```ts
import { createHttpClient } from "@specloom/data-provider";
import { createRestDataProvider } from "@specloom/data-provider/rest";

const http = createHttpClient(auth, { baseUrl: "/api" });
const dataProvider = createRestDataProvider({ httpClient: http });

const { data, total } = await dataProvider.getList("posts", {
  page: 1,
  perPage: 20,
  sort: { field: "createdAt", order: "desc" },
});
```

- `DataProvider` インターフェース: getList, getOne, create, update, delete, getMany
- `TokenProvider` インターフェース: `getToken()` + オプショナル `checkError()` — auth-provider への依存なし
- `createHttpClient`: Bearer トークン自動付与、401/403 エラーハンドリング
- REST 実装: リソース毎のエンドポイント・変換・カスタムアクション設定

### Spec 読み込みと Data API

- 管理画面の spec は `spec.json` をアプリ側でローカル読み込みします
- API は ViewModel を返さず、リソースのデータ取得/更新に専念します

```
GET    /api/posts
GET    /api/posts/{id}
POST   /api/posts
PUT    /api/posts/{id}
DELETE /api/posts/{id}
```

### TypeSpec デコレーター

| カテゴリ | デコレーター |
|---------|-------------|
| リソース | `@resource`, `@label`, `@requiredOneOf` |
| フィールド | `@kind`, `@readonly`, `@createOnly`, `@computed`, `@options`, `@relation`, `@cardinality`, `@ui`, `@hint`, `@inputHint`, `@filter`, `@visibleWhen`, `@requiredWhen` |
| ビュー | `@view`, `@columns`, `@fields`, `@searchable`, `@sortable`, `@defaultSort`, `@clickAction`, `@selection`, `@namedFilters`, `@namedFilter` |
| アクション | `@action`, `@rowAction`, `@placement`, `@requiresSelection`, `@allowedWhen`, `@confirm`, `@dialog`, `@api` |
| バリデーション | `@required`, `@min`, `@max`, `@minLength`, `@maxLength`, `@pattern`, `@minItems`, `@maxItems`, `@match` |

## 開発

```bash
pnpm install
pnpm build        # 全パッケージをビルド（Turborepo）
pnpm test         # テスト実行
pnpm typecheck    # 型チェック
pnpm dev          # ウォッチモード
```

## ドキュメント

- [TypeSpec ガイド](./docs/typespec/README.md) — デコレーターリファレンスと使い方
- [Spec v0.1](./docs/spec/v0.1.md) — JSON spec フォーマット仕様
- [ViewModel Spec](./docs/spec/view_model.md) — ViewModel 仕様
- [API Spec](./docs/spec/api.md) — HTTP API 仕様
- [Filter Spec](./docs/spec/filter.md) — フィルター式仕様
- [設計思想](./docs/spec/philosophy.md) — 責務の分離と設計原則
- [アーキテクチャ](./docs/architecture.md) — モジュール構成と使用例
- [SolidJS 統合ガイド](./docs/guides/solid-integration.md) — AuthContext, DataContext, AuthGuard

## ライセンス

MIT
