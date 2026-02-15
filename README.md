# specloom

Headless Admin ViewModel Spec

## What is specloom?

specloom は管理画面の「意味」を定義する仕様（spec）と、それを評価して ViewModel を生成するライブラリです。

- **Headless**: UI を含まない。React / Solid / Vue どれでも使える
- **Spec-driven**: TypeSpec で画面の意味を定義
- **ViewModel**: 評価済みの結果を返す。UI は描画するだけ

## Why?

管理画面の課題：

- 権限ロジックが UI に散らばる
- フロントエンドが肥大化する
- UI フレームワークに縛られる

specloom の答え：

- **spec** で意味を定義
- **VM** で評価済みの結果を返す
- **UI** は描画するだけ

## How it works

```
TypeSpec (定義)
    ↓ tsp compile
JSON Spec (仕様)
    ↓ loadSpec()
Spec Object
    ↓ evaluateListView() + context + data
EvaluatedViewModel
    ↓
UI (描画するだけ)
```

## Quick Example

### 1. TypeSpec で定義

```typespec
import "@specloom/typespec";

@S.resource
@S.label("投稿")
model Post {
  @S.readonly
  id: string;

  @S.label("タイトル")
  @S.kind("text")
  @S.required
  @S.maxLength(100)
  title: string;

  @S.label("状態")
  @S.kind("enum")
  @S.options(#[
    #{ value: "draft", label: "下書き" },
    #{ value: "published", label: "公開中" }
  ])
  @S.ui(#{ hint: "badge", inputHint: "select" })
  status: PostStatus;

  @S.label("著者")
  @S.kind("relation")
  @S.relation(User, #{ labelField: "name" })
  @S.required
  author: User;

  @S.label("公開日時")
  @S.kind("datetime")
  @S.visibleWhen("data.status == 'published'")
  @S.requiredWhen("data.status == 'published'")
  publishedAt: utcDateTime;
}

@S.view(Post, "list")
@S.columns(#["title", "status", "author"])
@S.sortable(#["title"])
@S.searchable(#["title"])
model PostList {
  @S.action("create")
  @S.label("新規作成")
  @S.allowedWhen("role == 'admin' || role == 'editor'")
  @S.ui(#{ icon: "plus", variant: "primary" })
  create: never;

  @S.rowAction("delete")
  @S.label("削除")
  @S.allowedWhen("role == 'admin'")
  @S.confirm("本当に削除しますか？")
  @S.ui(#{ icon: "trash", variant: "danger" })
  delete: never;
}
```

### 2. コンパイル

```bash
tsp compile .
# → spec.json が生成される
```

### 3. Evaluator で ViewModel 生成

```typescript
import { loadSpec, validateSpec, evaluateListView } from "specloom";

// JSON Spec を読み込み・検証
const spec = loadSpec(jsonSpec);
validateSpec(spec);

// Context（認証情報など）
const context = { role: "editor", userId: "user-1" };

// データ（API から取得）
const data = [
  { id: "1", title: "Hello", status: "published", author: { id: "u1", name: "田中" } },
];

// ViewModel を評価
const vm = evaluateListView({
  view: spec.views.find(v => v.resource === "Post" && v.type === "list"),
  resource: spec.resources.find(r => r.name === "Post"),
  context,
  data,
});
```

### 4. EvaluatedViewModel（評価結果）

```json
{
  "resource": "Post",
  "fields": [
    { "name": "title", "kind": "text", "label": "タイトル", "sortable": true },
    { "name": "status", "kind": "enum", "label": "状態", "options": [...], "ui": { "hint": "badge" } },
    { "name": "author", "kind": "relation", "label": "著者" }
  ],
  "pageActions": [],
  "rows": [
    {
      "id": "1",
      "values": { "title": "Hello", "status": "published", "author": { "id": "u1", "name": "田中" } },
      "actions": [
        { "id": "delete", "label": "削除", "allowed": false, "confirm": "本当に削除しますか？" }
      ]
    }
  ],
  "filters": [],
  "searchableFields": ["title"]
}
```

### 5. UI（描画するだけ）

```tsx
// SolidJS の例
<For each={vm.rows}>
  {(row) => (
    <tr>
      <td>{row.values.title}</td>
      <td><Badge>{row.values.status}</Badge></td>
      <td>{row.values.author.name}</td>
      <td>
        <For each={row.actions}>
          {(action) => (
            <button 
              disabled={!action.allowed}
              onClick={() => action.confirm && confirm(action.confirm) && handleAction(action.id, row.id)}
            >
              {action.label}
            </button>
          )}
        </For>
      </td>
    </tr>
  )}
</For>
```

**UI に権限ロジックがない。`allowed` を見るだけ。**

## ViewModel Classes (OOP Style)

評価された ViewModel を操作するための OOP スタイルのクラス：

```typescript
import { ListVM, ShowVM, FormVM } from "specloom";

// ListVM - イミュータブルなリスト操作
const list = new ListVM(listData);

// Getters
list.fields;          // フィールド一覧
list.rows;            // 行一覧
list.pageActions;     // ページアクション（選択不要）
list.bulkActions;     // バルクアクション（選択必須）
list.searchQuery;     // 検索クエリ
list.isLoading;       // ローディング状態
list.selectedCount;   // 選択数

// Methods
list.field("title");           // 特定のフィールドを取得
list.isSelected("row-1");      // 行が選択されているか
list.sortIcon("title");        // ソートアイコン (▲/▼/−)
list.formatCell(field, value); // セル値をフォーマット
list.rowActions(row);          // 行アクション（row.actionsから取得）

// Immutable Setters (メソッドチェーン対応)
const updated = list
  .setSearchQuery("test")
  .toggleFilter("active")
  .setPage(2);
// 元の list は変更されない

// ShowVM - 詳細画面
const show = new ShowVM(showData);
show.value("title");              // フィールド値を取得
show.formatValue(field, value);   // フォーマット済み値

// FormVM - フォーム操作
const form = new FormVM(formData);
form.value("title");              // フィールド値
form.isValid;                     // バリデーション状態
form.hasError("email");           // エラーがあるか

const updated = form
  .setValue("title", "New Title")
  .setFieldErrors("email", ["必須です"])
  .setSubmitting(true);
```

## Packages

| Package | Description | Status |
|---------|-------------|--------|
| `specloom` | Loader, Validator, Evaluator, ViewModel Classes | ✅ 実装済み |
| `@specloom/typespec` | TypeSpec デコレーター + JSON Spec エミッター | ✅ 実装済み |
| `@specloom/solidjs` | SolidJS UI コンポーネント | ✅ 実装済み |
| `@specloom/svelte` | Svelte UI コンポーネント | ✅ 実装済み |
| `@specloom/api` | OpenAPI 定義 | ✅ 実装済み |

## Features

### specloom (core)

- **Loader**: JSON Spec を読み込み、型付きオブジェクトに変換
- **Validator**: JSON Spec の構造・整合性を検証
- **Evaluator**: Context + Data から ViewModel を評価
  - `evaluateListView()` - 一覧画面
  - `evaluateFormView()` - 作成・編集画面
  - `evaluateShowView()` - 詳細画面
- **Filter**: クライアントサイドフィルタリング

### @specloom/typespec

- **40+ デコレーター**: `@resource`, `@label`, `@kind`, `@relation`, `@required`, `@ui`, `@visibleWhen`, `@requiredWhen`, etc.
- **JSON Spec エミッター**: `tsp compile` で JSON Spec を出力（tsp ファイルごとに分割出力）
- **TypeSpec enum サポート**: enum 型から options を自動生成

## TypeSpec Decorators

### Resource

| デコレーター | 対象 | 説明 |
|-------------|------|------|
| `@resource` | Model | リソースとしてマーク |
| `@label` | Model / Field | 表示ラベル |
| `@kind` | Field | フィールド種類（text, longText, enum, relation, etc.） |
| `@required` | Field | 必須 |
| `@readonly` | Field | 読み取り専用 |
| `@computed` | Field | 算出フィールド（DB に保存しない） |
| `@createOnly` | Field | 作成時のみ表示（編集時は読み取り専用） |
| `@options` | Field | enum の選択肢（value / label） |
| `@relation` | Field | 他リソースへの参照 |
| `@filter` | Field | フィルター可能 |
| `@ui` | Model / Field | UI ヒント（hint, inputHint, icon, variant, etc.） |
| `@visibleWhen` | Field | 条件付き表示（式が true の場合のみ表示） |
| `@requiredWhen` | Field | 条件付き必須（式が true の場合に必須化） |

### View

| デコレーター | 対象 | 説明 |
|-------------|------|------|
| `@view` | Model | ビュー定義（list / form / show） |
| `@columns` | Model | リスト表示列 |
| `@fields` | Model | フォーム / 詳細表示フィールド |
| `@searchable` | Model | 検索対象フィールド |
| `@sortable` | Model | ソート可能フィールド |
| `@defaultSort` | Model | デフォルトソート |
| `@clickAction` | Model | 行クリック時のアクション |
| `@selection` | Model | 選択モード（none / single / multi） |
| `@namedFilter` | Model | 名前付きフィルター |

### Action

| デコレーター | 対象 | 説明 |
|-------------|------|------|
| `@action` | Field | ページレベルアクション |
| `@rowAction` | Field | 行アクション |
| `@requiresSelection` | Field | バルクアクションの選択要件 |
| `@allowedWhen` | Field | 権限式（`role == 'admin'` など） |
| `@confirm` | Field | 確認ダイアログ |
| `@dialog` | Field | ダイアログフォーム |
| `@api` | Field | API エンドポイント定義 |

### Validation

| デコレーター | 対象 | 説明 |
|-------------|------|------|
| `@required` | Field | 必須 |
| `@minLength` | Field | 最小文字数 |
| `@maxLength` | Field | 最大文字数 |
| `@min` | Field | 最小値 |
| `@max` | Field | 最大値 |
| `@pattern` | Field | 正規表現 |
| `@match` | Field | 他フィールドとの一致（パスワード確認など） |
| `@minItems` | Field | 配列の最小要素数 |
| `@maxItems` | Field | 配列の最大要素数 |
| `@requiredWhen` | Field | 条件付き必須 |

## Field Kinds

| Kind | 説明 | UI ヒント例 |
|------|------|------------|
| `text` | 短いテキスト | input |
| `longText` | 長いテキスト | textarea, richtext |
| `number` | 数値 | input[type=number] |
| `boolean` | 真偽値 | checkbox, switch |
| `date` | 日付 | datepicker |
| `datetime` | 日時 | datetimepicker |
| `enum` | 列挙値 | select, radio, badge |
| `relation` | 他リソースへの参照 | autocomplete, select, modal |
| `password` | パスワード | input[type=password] |

## Documentation

- [TypeSpec Guide](./docs/typespec/README.md) - TypeSpec での定義方法
- [Resource](./docs/typespec/resource.md) - リソース定義
- [Field](./docs/typespec/field.md) - フィールド（@ui, @filter, @visibleWhen, @requiredWhen）
- [Validation](./docs/typespec/validation.md) - バリデーション
- [Relation](./docs/typespec/relation.md) - リレーション
- [List View](./docs/typespec/list.md) - 一覧画面、namedFilter
- [Form View](./docs/typespec/form.md) - 作成・編集画面
- [Show View](./docs/typespec/show.md) - 詳細画面
- [Action](./docs/typespec/action.md) - アクション（@dialog, @api）
- [Examples](./docs/typespec/examples.md) - 完全な例

### Spec Reference

- [JSON Spec v0.1](./docs/spec/v0.1.md) - JSON Spec フォーマットリファレンス
- [ViewModel Spec](./docs/spec/view_model.md) - ViewModel 仕様
- [Filter Spec](./docs/spec/filter.md) - フィルター式仕様
- [Philosophy](./docs/spec/philosophy.md) - 設計思想

## Development

```bash
# インストール
pnpm install

# ビルド
pnpm build

# テスト
pnpm test

# 型チェック
pnpm typecheck

# TypeSpec サンプルのコンパイル
cd packages/typespec/test
npx tsp compile sample.tsp
```

## Status

| 機能 | 状態 |
|------|------|
| JSON Spec v0.1 | ✅ |
| Loader / Validator | ✅ |
| Evaluator (ListView, FormView, ShowView) | ✅ |
| ViewModel Classes (ListVM, ShowVM, FormVM) | ✅ |
| Filter (client-side) | ✅ |
| visibleWhen / requiredWhen | ✅ |
| TypeSpec デコレーター (40+) | ✅ |
| TypeSpec エミッター | ✅ |
| SolidJS コンポーネント | ✅ |
| Svelte コンポーネント | ✅ |
| React コンポーネント | 📋 Planned |
| CLI ツール | 📋 Planned |

## License

MIT
