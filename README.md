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

@Specloom.resource
@Specloom.label("投稿")
model Post {
  @Specloom.readonly
  id: string;

  @Specloom.label("タイトル")
  @Specloom.kind("text")
  @Specloom.required
  @Specloom.maxLength(100)
  title: string;

  @Specloom.label("状態")
  @Specloom.kind("enum")
  @Specloom.options(#[
    #{ value: "draft", label: "下書き" },
    #{ value: "published", label: "公開中" }
  ])
  @Specloom.ui(#{ hint: "badge", inputHint: "select" })
  status: PostStatus;

  @Specloom.label("著者")
  @Specloom.kind("relation")
  @Specloom.relation(User, #{ labelField: "name" })
  @Specloom.required
  author: User;
}

@Specloom.view(Post, "list")
@Specloom.columns(#["title", "status", "author"])
@Specloom.sortable(#["title"])
@Specloom.searchable(#["title"])
model PostList {
  @Specloom.action("delete")
  @Specloom.label("削除")
  @Specloom.placement("row")
  @Specloom.allowedWhen("role == 'admin'")
  @Specloom.confirm("本当に削除しますか？")
  @Specloom.ui(#{ icon: "trash", variant: "danger" })
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
  "headerActions": [],
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

## Packages

| Package | Description | Status |
|---------|-------------|--------|
| `specloom` | Loader, Validator, Evaluator | ✅ 実装済み |
| `@specloom/typespec` | TypeSpec デコレーター + JSON Spec エミッター | ✅ 実装済み |
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

- **30+ デコレーター**: `@resource`, `@label`, `@kind`, `@relation`, `@required`, `@ui`, etc.
- **JSON Spec エミッター**: `tsp compile` で JSON Spec を出力
- **TypeSpec enum サポート**: enum 型から options を自動生成

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

## Validation

フィールドに設定可能なバリデーション：

```typespec
@Specloom.required           // 必須
@Specloom.minLength(1)       // 最小文字数
@Specloom.maxLength(100)     // 最大文字数
@Specloom.min(0)             // 最小値
@Specloom.max(100)           // 最大値
@Specloom.pattern("[a-z]+")  // 正規表現
@Specloom.minItems(1)        // 配列の最小要素数
@Specloom.maxItems(5)        // 配列の最大要素数
```

## Actions

```typespec
@Specloom.action("delete")
@Specloom.label("削除")
@Specloom.placement("row")           // header | row | bulk
@Specloom.allowedWhen("role == 'admin'")
@Specloom.confirm("本当に削除しますか？")
@Specloom.ui(#{ icon: "trash", variant: "danger" })
delete: never;
```

- **placement**: `header`（ヘッダー）, `row`（行ごと）, `bulk`（一括選択）
- **allowedWhen**: 式を評価して `allowed: true/false` を返す
- **confirm**: 確認ダイアログのメッセージ

## Documentation

- [TypeSpec Guide](./docs/typespec/README.md) - TypeSpec での定義方法
- [Resource](./docs/typespec/resource.md) - リソース定義
- [Relation](./docs/typespec/relation.md) - リレーション
- [Validation](./docs/typespec/validation.md) - バリデーション
- [Action](./docs/typespec/action.md) - アクション
- [Form](./docs/typespec/form.md) - フォーム画面
- [Show](./docs/typespec/show.md) - 詳細画面

## Development

```bash
# インストール
pnpm install

# ビルド
pnpm build

# テスト
pnpm test

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
| Filter (client-side) | ✅ |
| TypeSpec デコレーター | ✅ |
| TypeSpec エミッター | ✅ |
| SolidJS コンポーネント | 🚧 Next |
| React コンポーネント | 📋 Planned |
| CLI ツール | 📋 Planned |

## License

MIT
