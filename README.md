# specloom

Headless admin ViewModel specification library.

TypeSpec で管理画面の「意味」を定義し、JSON spec にコンパイルし、ランタイムコンテキスト（ユーザー、ロール）で評価して ViewModel を生成します。UI フレームワークは ViewModel を描画するだけです。

```
TypeSpec (定義) → JSON spec (仕様) → ViewModel (評価済み) → UI (描画)
```

**原則: UI は権限ロジックを持たない** — `allowed` フラグを読むだけ。

## インストール

```bash
npm install specloom
# TypeSpec で定義する場合
npm install @specloom/typespec --save-dev
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

### 3. ViewModel を評価して UI で描画

```ts
import { ListVM, Format, ActionVM } from "specloom";

// ViewModel は API から取得（Evaluator がコンテキストに基づき評価済み）
const vm = await fetch("/vm/posts").then(r => r.json());

// 純粋関数でデータにアクセス
const fields = ListVM.fields(vm);
const rows = ListVM.rows(vm);
const actions = ListVM.pageActions(vm);

// アクションの許可チェック（UI は boolean を見るだけ）
actions.forEach(a => {
  if (ActionVM.allowed(a)) {
    // ボタンを有効化
  }
});

// 値のフォーマット
const formatted = Format.date(value, "ja-JP");
```

## アーキテクチャ

### パッケージ構成

| パッケージ | 説明 |
|-----------|------|
| `specloom` | コアライブラリ: spec 型定義、ViewModel、evaluator、validation、format |
| `@specloom/typespec` | TypeSpec デコレーター + emitter（`.tsp` → JSON spec） |

### コアモジュール

| モジュール | 説明 |
|-----------|------|
| `spec/` | JSON spec の TypeScript 型定義 |
| `vm/` | ViewModel 型と操作関数（ListVM, FormVM, ShowVM, ActionVM） |
| `evaluator/` | Spec + Context → ViewModel 変換 |
| `validation/` | フィールドバリデーション |
| `format/` | 値のフォーマット（日付、通貨、数値） |
| `serialize/` | 送信用データ変換 |
| `filter/` | フィルター式の構築・評価 |
| `i18n/` | 国際化 |
| `loader/` | JSON spec の読み込み |

### Spec の3要素

| 要素 | 説明 |
|------|------|
| **Resource** | データモデル（フィールド、型、バリデーション、リレーション） |
| **View** | 画面定義（list / form / show） |
| **Action** | 操作定義（権限、確認ダイアログ、配置） |

### ViewModel API

```
GET /vm/posts          → ListViewModel
GET /vm/posts/1        → ShowViewModel
GET /vm/posts/new      → FormViewModel (create)
GET /vm/posts/1/edit   → FormViewModel (edit)
```

## 開発

```bash
pnpm install
pnpm build        # 全パッケージをビルド
pnpm test         # テスト実行
pnpm typecheck    # 型チェック
pnpm dev          # ウォッチモード
```

## ドキュメント

- [TypeSpec ガイド](./docs/typespec/README.md) — デコレーターリファレンスと使い方
- [Spec v0.1](./docs/spec/v0.1.md) — JSON spec フォーマット仕様
- [ViewModel Spec](./docs/spec/view_model.md) — ViewModel 仕様
- [API Spec](./docs/spec/api.md) — HTTP API 仕様
- [設計思想](./docs/spec/philosophy.md) — 責務の分離と設計原則
- [アーキテクチャ](./docs/architecture.md) — モジュール構成と使用例

## ライセンス

MIT
