# specloom 設計思想

specloom の設計原則と責務の境界を明確にします。

## 全体像

```
TypeSpec (ユーザーまたは AI が書く)
    ↓ コンパイル
Definition Spec (JSON)
    ↓ 評価 (Context: user, role, data)
ViewModel (評価済み)
    ↓
UI (描画するだけ)
```

## コアコンセプト: ViewModel = 評価済み結果

specloom の最も重要な原則は **「UIは判断しない」** ことです。

### allowedWhen → allowed: boolean

TypeSpec:
```typespec
@action("delete")
@allowedWhen("role == 'admin'")
delete: never;
```

Definition Spec (コンパイル結果):
```json
{
  "id": "delete",
  "allowedWhen": "role == 'admin'"
}
```

ViewModel (評価結果):
```json
{
  "id": "delete",
  "allowed": true
}
```

UI は `allowed` を見て `disabled` にするだけ。条件式の評価ロジックを持たない。

## 責務の分離（4つの真実）

### 1. Domain Truth（ドメインの真実）

**誰が定義**: TypeSpec（ユーザーまたは AI）  
**何を定義**: データ構造、フィールド、型、リレーション

```typespec
@resource
model Post {
  id: string;
  title: string;
  status: Status;
  author: User;
}
```

### 2. Capability Truth（能力の真実）

**誰が評価**: specloom Evaluator  
**何を評価**: 許可/不許可、表示/非表示

```json
{
  "allowed": true,
  "visible": true
}
```

### 3. View Truth（画面の真実）

**誰が定義**: TypeSpec（ユーザーまたは AI）  
**何を定義**: どのフィールドを、どの順序で、どのアクションと共に

```typespec
@view(Post, "list")
@columns(["title", "status", "author"])
model PostList {}
```

### 4. UI Truth（見た目の真実）

**誰が定義**: UI フレームワーク / ローカル設定  
**何を定義**: CSS、レイアウト、アニメーション、ダークモード

> **specloom は UI Truth に関与しない**

## specloom が定義するもの

| カテゴリ | 内容 |
|---------|------|
| **意味** | フィールドのラベル、説明 |
| **種別** | kind（text, email, relation, status...） |
| **制約** | バリデーションルール |
| **権限** | allowedWhen（評価されて allowed になる） |
| **ヒント** | ui.hint, ui.inputHint（参考情報） |

## specloom が定義しないもの

| カテゴリ | 理由 |
|---------|------|
| **幅・高さ** | デバイス・レスポンシブ依存 |
| **色・フォント** | デザインシステム依存 |
| **レイアウト** | UI フレームワーク依存 |
| **アニメーション** | UX デザイン依存 |
| **CSS クラス** | 実装詳細 |

## Canonical と Legacy

新規 spec は **canonical 記法** を使い、legacy は互換目的でのみ利用します。

| 分類 | Canonical | Legacy alias |
|------|-----------|--------------|
| Filter operator | `starts_with`, `ends_with`, `not_in` など snake_case | `startsWith`, `endsWith`, `notIn` など camelCase |
| UI ヒント | `@ui(#{ ... })` | `@hint`, `@inputHint` |
| Row/Bulk action | `@rowAction`, `@requiresSelection` | `@placement("row" \| "bulk")` |

原則:
- ドキュメントと新規サンプルは canonical を使う
- legacy は読み込み時に正規化して受理する
- 将来は warning を追加し、段階的に縮退可能な状態を保つ

### ui.hint の役割

`hint` は「意味的なヒント」であり、「見た目の指定」ではない。

```json
{
  "ui": {
    "hint": "avatar"  // 「これは人物を表す」という意味
  }
}
```

UI がどう表現するかは自由：
- 丸いアバター画像
- イニシャルバッジ
- アイコン + 名前
- 写真なしでテキストのみ

## namedFilter について

### タブではない

```json
{
  "namedFilters": [
    { "id": "all", "label": "すべて", "filter": {} },
    { "id": "published", "label": "公開中", "filter": {...} },
    { "id": "draft", "label": "下書き", "filter": {...} }
  ]
}
```

これは「定義済みフィルター」であり、「タブ」ではない。

UI での表現は自由：
- タブ UI
- ドロップダウン
- サイドバーのリンク
- チップ/ピル
- ラジオボタン

### 検索との関係

namedFilter と自由検索は共存する：

```json
{
  "filters": {
    "named": [
      { "id": "published", "label": "公開中", "active": true }
    ],
    "custom": {
      "and": [
        { "field": "title", "operator": "contains", "value": "React" }
      ]
    }
  }
}
```

「公開中の記事」+ 「タイトルに React を含む」

## react-admin との違い

### react-admin

```jsx
<List>
  <Datagrid>
    <TextField source="title" />
    <DateField source="createdAt" />
  </Datagrid>
</List>
```

- UI コンポーネントでスキーマを定義
- React に依存
- 権限ロジックが UI に混在

### specloom

TypeSpec で定義:
```typespec
@view(Post, "list")
@columns(["title", "createdAt"])
model PostList {
  @action("create")
  @allowedWhen("role == 'admin'")
  create: never;
}
```

ViewModel (評価結果):
```json
{
  "type": "list",
  "fields": [
    { "name": "title", "kind": "text" },
    { "name": "createdAt", "kind": "datetime" }
  ],
  "pageActions": [
    { "id": "create", "allowed": true }
  ]
}
```

- TypeSpec でスキーマを定義
- フレームワーク非依存
- 権限は評価済みの boolean

## Headless Admin

specloom は「Headless Admin」のコア：

```
TypeSpec → Definition Spec → ViewModel → 任意の UI
                                              ↓
                                        - React
                                        - Vue
                                        - Angular
                                        - Svelte
                                        - Terminal UI
                                        - Mobile (Flutter, RN)
```

### API ファースト

ViewModel は REST API で提供される：

```
GET /vm/posts      → ListViewModel
GET /vm/posts/1    → ShowViewModel
GET /vm/posts/new  → FormViewModel (create mode)
GET /vm/posts/1/edit → FormViewModel (edit mode)
```

UI は API を叩いて ViewModel を受け取り、描画するだけ。

## BFF としての specloom

specloom は BFF（Backend for Frontend）の進化形：

```
従来の BFF:
  Backend → BFF → Frontend
  (データ加工、認可チェック、レスポンス整形)

specloom:
  Backend → specloom Evaluator → ViewModel → Frontend
  (スキーマ定義、権限評価、UI ヒント付与)
```

### 違い

| 観点 | 従来の BFF | specloom |
|------|-----------|----------|
| 定義方法 | コードで実装 | 宣言的スキーマ |
| 権限評価 | ロジックを書く | 式を評価 |
| 出力形式 | 任意 | 標準化された ViewModel |
| 再利用性 | プロジェクト固有 | 汎用ライブラリ |

## 実装優先順位

1. **TypeScript** - 最初の実装言語
2. **Rust** - パフォーマンス重視の実装
3. **Go** - サーバーサイド実装
4. **Python** - データ分析/ML 連携

各言語で同じ Definition Spec を処理し、同じ ViewModel を出力する。

## 関連ドキュメント

- [Definition Spec](./v0.1.md) - 静的定義の仕様
- [ViewModel Spec](./view_model.md) - 評価結果の仕様
- [Filter Spec](./filter.md) - 高度なフィルタリング仕様
- [API Spec](./api.md) - HTTP API 仕様
