# specloom アーキテクチャ

## 概要

specloom は headless admin ViewModel specification library です。

```
TypeSpec (定義) → JSON Spec (仕様) → ViewModel (評価済み) → UI (描画)
```

**原則: UI は権限ロジックを持たない** - `allowed` フラグを読むだけ

---

## パッケージ構成

```
specloom (core) - フレームワーク非依存
│
├── spec/           # Spec 型定義（JSON仕様）
├── ui/             # ViewModel 型 + 操作関数（純粋関数）
├── validation/     # バリデーション
├── format/         # フォーマット関数
├── serialize/      # 送信用データ変換
├── loader/         # Spec 読み込み
├── builder/        # Spec 構築
└── evaluator/      # Spec + Context → ViewModel

認証・データアクセス
│
├── @specloom/auth-provider   # 認証プロバイダー抽象化
│   ├── core/                 #   AuthProvider<TTenant> インターフェース
│   └── providers/firebase/   #   Firebase Identity Platform 実装
│
└── @specloom/data-provider   # データプロバイダー抽象化
    ├── core/                 #   DataProvider インターフェース
    ├── http/                 #   認証付き HTTP クライアント
    └── providers/rest/       #   REST 実装

フレームワークアダプター（オプション）
│
├── @specloom/solidjs  # SolidJS コンポーネント
├── @specloom/svelte   # Svelte コンポーネント
└── @specloom/api      # OpenAPI 定義
```

---

## レイヤーの責務

| レイヤー | 責務 | 状態 |
|---------|------|------|
| specloom (core) | 型 + 純粋関数 | 持たない |
| @specloom/auth-provider | 認証抽象化（login, logout, token, permissions） | 認証状態 |
| @specloom/data-provider | データアクセス抽象化（CRUD, カスタムアクション） | 持たない |
| @specloom/xxx (UI) | フレームワーク固有の状態管理 | 持つ |
| UI コンポーネント | 描画のみ | アダプター経由 |

## パッケージ依存関係

```
@specloom/auth-provider    外部依存なし（firebase は peerDep/optional）
          ↑
@specloom/data-provider    auth-provider の AuthProvider 型 + getToken/checkError
          ↑
アプリケーション            auth-provider + data-provider + core + UI アダプター
```

---

## core モジュール詳細

### spec/

JSON Spec の TypeScript 型定義。

```ts
interface ResourceSpec { ... }
interface ViewSpec { ... }
interface ActionSpec { ... }
```

### ui/

ViewModel の型定義と操作関数（純粋関数、状態を持たない）。

```ts
// 型
ListViewModel, FormViewModel, ShowViewModel, ActionVM

// 操作関数
ListVM, FormVM, ShowVM, ActionVM
```

### validation/

バリデーションルールと検証関数。

```ts
// 検証関数
validateForm(fields, data)   → ValidationErrors
validateField(field, value)  → string[]

// Validate ヘルパー
Validate.form(fields, data)  → ValidationErrors
Validate.field(field, value) → string[]
Validate.valid(errors)       → boolean
Validate.errors(errors, name)    → string[]
Validate.hasError(errors, name)  → boolean
Validate.firstError(errors, name) → string | null
Validate.allErrors(errors)   → string[]
Validate.empty(value)        → boolean
```

### format/

値のフォーマット関数。

```ts
Format.date(value, locale?)
Format.datetime(value, locale?)
Format.currency(value, currency?)
Format.number(value, decimals?)
Format.percent(value)
Format.boolean(value, trueLabel?, falseLabel?)
```

### serialize/

ViewModel から送信用データへの変換。

```ts
Serialize.formData(vm)      → Record<string, unknown>
Serialize.dirtyFields(vm)   → Record<string, unknown>
Serialize.queryParams(vm)   → URLSearchParams
```

### loader/

JSON Spec の読み込み・パース。

### builder/

プログラムで Spec を構築。

### evaluator/

Spec + Context → ViewModel 変換（allowedWhen 評価等）。

---

## UI 操作関数 (ListVM, FormVM, ShowVM)

### 設計原則

1. **純粋関数** - 状態を持たない、引数から計算するだけ
2. **短い名前** - `get`, `is` プレフィックス不要
3. **フレームワーク非依存** - どこでも使える

### ListVM メソッド一覧

| カテゴリ | メソッド | 説明 |
|---------|---------|------|
| **フィールド** | | |
| | `fields(vm)` | 全フィールド定義 |
| | `field(vm, name)` | フィールド取得 |
| | `sortable(vm, name)` | ソート可能か |
| **ソート** | | |
| | `sortField(vm)` | ソート中のフィールド名 |
| | `sortOrder(vm, name)` | ソート順（asc/desc/null） |
| | `sortIcon(vm, name)` | アイコン（↑/↓/⇅） |
| **検索** | | |
| | `searchable(vm)` | 検索が有効か |
| | `searchQuery(vm)` | 検索クエリ |
| | `searchFields(vm)` | 検索対象フィールド |
| **選択** | | |
| | `selectable(vm)` | 選択可能か |
| | `multiSelect(vm)` | 複数選択か |
| | `selected(vm, rowId)` | 行が選択中か |
| | `allSelected(vm)` | 全選択か |
| | `selectedIds(vm)` | 選択中ID一覧 |
| | `selectedCount(vm)` | 選択数 |
| | `selectedRows(vm)` | 選択中の行データ |
| **フィルター** | | |
| | `filters(vm)` | フィルター一覧 |
| | `activeFilters(vm)` | アクティブなフィルター |
| | `filterActive(vm, id)` | フィルターがアクティブか |
| | `customFilter(vm)` | カスタムフィルター式 |
| **ページネーション** | | |
| | `page(vm)` | 現在ページ |
| | `pageSize(vm)` | 件数/ページ |
| | `totalPages(vm)` | 総ページ数 |
| | `total(vm)` | 総件数 |
| | `hasNext(vm)` | 次ページあるか |
| | `hasPrev(vm)` | 前ページあるか |
| **アクション** | | |
| | `pageActions(vm)` | ページアクション |
| | `bulkActions(vm)` | バルクアクション |
| | `rowActions(row)` | 行アクション |
| | `allowedActions(actions)` | 許可されたもののみ |
| **行** | | |
| | `rows(vm)` | 全行 |
| | `row(vm, id)` | 行取得 |
| | `rowCount(vm)` | 行数 |
| | `empty(vm)` | 空か |
| **セル** | | |
| | `cellValue(row, name)` | セルの生値 |
| | `formatCell(field, value)` | 表示用に整形 |
| **状態** | | |
| | `loading(vm)` | 読み込み中か |
| | `error(vm)` | エラーメッセージ |
| **メタ** | | |
| | `label(vm)` | ラベル |
| | `resource(vm)` | リソース名 |
| | `clickAction(vm)` | クリック時アクション |

### FormVM メソッド一覧

| メソッド | 説明 |
|---------|------|
| `fields(vm)` | 全フィールド |
| `field(vm, name)` | フィールド取得 |
| `value(vm, name)` | 値取得 |
| `values(vm)` | 全値をオブジェクトで |
| `valid(vm)` | 有効か |
| `dirty(vm)` | 変更ありか |
| `errors(vm)` | 全エラー |
| `fieldErrors(vm, name)` | フィールドのエラー |
| `hasError(vm, name)` | エラーありか |
| `actions(vm)` | アクション一覧 |
| `canSubmit(vm)` | 送信可能か |
| `loading(vm)` | 読み込み中か |
| `submitting(vm)` | 送信中か |
| `hint(vm, name)` | ヒント |
| `placeholder(vm, name)` | プレースホルダー |
| `groups(vm)` | フィールドグループ |
| `label(vm)` | ラベル |
| `mode(vm)` | create/edit |
| `id(vm)` | レコードID |

### ShowVM メソッド一覧

| メソッド | 説明 |
|---------|------|
| `fields(vm)` | 全フィールド |
| `field(vm, name)` | フィールド取得 |
| `value(vm, name)` | 値取得 |
| `formatValue(field, value)` | 表示用に整形 |
| `actions(vm)` | アクション一覧 |
| `loading(vm)` | 読み込み中か |
| `groups(vm)` | フィールドグループ |
| `label(vm)` | ラベル |
| `id(vm)` | レコードID |

### ActionVM メソッド一覧

| メソッド | 説明 |
|---------|------|
| `allowed(action)` | 許可されているか |
| `needsConfirm(action)` | 確認が必要か |
| `confirmMsg(action)` | 確認メッセージ |
| `variant(action)` | UIバリアント |
| `icon(action)` | アイコン |

---

## Auth Provider (`@specloom/auth-provider`)

認証プロバイダーの抽象化レイヤー。テナント型 `TTenant` をジェネリクスで受け取る。

### AuthProvider インターフェース

| メソッド | 説明 |
|---------|------|
| `login(params)` | テナント指定でログイン → `AuthIdentity` を返す |
| `logout()` | ログアウト |
| `checkAuth(params?)` | 認証状態チェック（未認証なら throw） |
| `checkError(error)` | API エラーをチェック（401/403 なら自動ログアウト） |
| `getIdentity()` | 現在のユーザー情報を取得 |
| `getToken()` | Bearer トークンを取得 |
| `checkPermissions(params)` | 権限チェック（`requiredRoles` による制御） |
| `getPermissions()` | 現在のテナント種別を取得 |
| `onAuthStateChanged?(cb)` | 認証状態変更の購読（オプション） |

### SignInMethod

`EMAIL_PASSWORD` | `GOOGLE` | `LINE` | `APPLE` | `OIDC`

### Firebase 実装

`@specloom/auth-provider/firebase` サブパスから import。

```ts
import { createFirebaseAuthProvider } from "@specloom/auth-provider/firebase";

const authProvider = createFirebaseAuthProvider<MyTenant>({
  firebase: { apiKey, authDomain, projectId },
  tenants: { tenantIds: { ADMIN: "admin-xxx", USER: "user-xxx" } },
});
```

- Google Identity Platform のマルチテナント対応
- `tenantIds` マッピングで tenantId → TTenant 変換
- EMAIL_PASSWORD / GOOGLE サインインをサポート

---

## Data Provider (`@specloom/data-provider`)

REST API との通信を抽象化。リソースごとの URL マッピング、リクエスト/レスポンス変換をプラグイン的に注入できる。

### DataProvider インターフェース

| メソッド | 説明 |
|---------|------|
| `getList(resource, params)` | 一覧取得（ページネーション、ソート、フィルター） |
| `getOne(resource, params)` | 単一リソース取得 |
| `create(resource, params)` | リソース作成 |
| `update(resource, params)` | リソース更新 |
| `delete(resource, params)` | リソース削除 |
| `getMany?(resource, params)` | 複数ID一括取得（オプション） |

### HTTP クライアント

`createHttpClient(authProvider, config)` で作成。AuthProvider からトークンを取得し自動付与。

```ts
import { createHttpClient } from "@specloom/data-provider";

const http = createHttpClient(authProvider, { baseUrl: "http://localhost:8080" });
```

- 全リクエストに `Authorization: Bearer <token>` を自動付与
- 401/403 レスポンスで `authProvider.checkError()` を呼び出し

### REST 実装

`@specloom/data-provider/rest` サブパスから import。

```ts
import { createRestDataProvider } from "@specloom/data-provider/rest";

const dataProvider = createRestDataProvider(http, {
  apiPrefix: "/api",
  resources: {
    orders: {
      endpoint: "/api/v1/orders",
      transformResponse: (raw) => ({ id: raw.id, status: raw.order_status }),
      transformRequest: (data) => ({ order_status: data.status }),
      actions: {
        approve: { method: "POST", path: (id) => `/api/v1/orders/${id}/approve` },
      },
    },
  },
});

// カスタムアクション実行
await dataProvider.action("orders", "approve", orderId);
```

### ResourceConfig

| プロパティ | 説明 |
|-----------|------|
| `endpoint` | リソースのベース URL（文字列 or 関数） |
| `itemEndpoint` | 個別リソースの URL 関数 |
| `transformResponse` | レスポンス変換 |
| `transformListResponse` | 一覧レスポンス変換 |
| `transformRequest` | リクエスト変換 |
| `transformFilter` | フィルターパラメータ変換 |
| `transformSort` | ソートフィールド名変換 |
| `defaultFilter` | デフォルトフィルター |
| `defaultSort` | デフォルトソート |
| `actions` | カスタムアクション定義 |

---

## 使用例

### core のみ使用

```ts
import { ListVM, FormVM, Format, Validate } from "specloom";

// データ取得
const fields = ListVM.fields(vm);
const isSelected = ListVM.selected(vm, "row-1");

// フォーマット
const date = Format.date(value, "ja-JP");

// バリデーション
const validatedVm = Validate.form(vm);
```

### フレームワークアダプター使用

```tsx
// React
import { useListVM } from "@specloom/react";

function MyList({ initialVm }) {
  const list = useListVM(initialVm);
  
  return (
    <table>
      {list.fields.map(f => (
        <th onClick={() => list.sort(f.name)}>
          {f.label} {list.sortIcon(f.name)}
        </th>
      ))}
    </table>
  );
}
```

```tsx
// SolidJS
import { createListVM } from "@specloom/solid";

function MyList(props) {
  const list = createListVM(props.vm);
  
  return (
    <table>
      <For each={list.fields()}>
        {f => <th onClick={() => list.sort(f.name)}>{f.label}</th>}
      </For>
    </table>
  );
}
```

---

## カスタマイズ

### CSS カスタマイズ

```css
/* data-specloom 属性でスタイル上書き */
[data-specloom="list-table"] thead {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

[data-specloom="action-button"][data-variant="danger"] {
  background: #ef4444;
}
```

### コンポーネント差し替え（slots）

```tsx
<ListView 
  vm={vm}
  slots={{
    button: MyCustomButton,
    table: MyCustomTable,
  }}
/>
```
