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

フレームワークアダプター（オプション）
│
├── @specloom/react    # React hooks
├── @specloom/solid    # Solid signals
├── @specloom/vue      # Vue composables
└── @specloom/svelte   # Svelte stores
```

---

## レイヤーの責務

| レイヤー | 責務 | 状態 |
|---------|------|------|
| specloom (core) | 型 + 純粋関数 | 持たない |
| @specloom/xxx | フレームワーク固有の状態管理 | 持つ |
| UI コンポーネント | 描画のみ | アダプター経由 |

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
| | `headerActions(vm)` | ヘッダーアクション |
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
