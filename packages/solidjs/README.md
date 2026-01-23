# @specloom/solidjs

specloom の SolidJS UI コンポーネントライブラリ。Headless + 組み立て式のアーキテクチャで、シンプルな利用とカスタマイズの両方に対応。

## インストール

```bash
pnpm add @specloom/solidjs specloom
```

## 基本的な使い方

### シンプルに使う（デフォルト構成）

```tsx
import { ListView, FormView, ShowView } from "@specloom/solidjs";

// リスト
<ListView vm={listVM} onAction={handleAction} />

// フォーム
<FormView
  vm={formVM}
  onChange={handleChange}
  onSubmit={handleSubmit}
/>

// 詳細
<ShowView vm={showVM} onAction={handleAction} />
```

デフォルト構成では、すべてのコンポーネントが自動的に配置されます。

## カスタマイズ（組み立て式）

children を渡すことで、構成を自由にカスタマイズできます。

### ListView のカスタマイズ

```tsx
import {
  ListView,
  ListToolbar,
  ListHeaderActions,
  ListBulkActions,
  ListTable,
  ListTableHeader,
  ListTableBody,
  ListTableRow,
  ListPagination,
  ListLoading,
  ListError,
  useList,
} from "@specloom/solidjs";

// ツールバーのみカスタマイズ
<ListView vm={vm} onAction={handleAction}>
  <ListToolbar>
    <h2>カスタムタイトル</h2>
    <ListHeaderActions />
  </ListToolbar>
  <ListLoading />
  <ListError />
  <ListTable />
  <ListPagination />
</ListView>

// テーブル行のカスタムレンダリング
<ListView vm={vm} onAction={handleAction}>
  <ListToolbar />
  <ListTable>
    {(row, fields) => (
      <ListTableRow row={row}>
        <td>{row.id}</td>
        <td class="font-bold">{row.values.title}</td>
        <td>{row.values.status}</td>
      </ListTableRow>
    )}
  </ListTable>
  <ListPagination />
</ListView>

// Context を使った完全カスタム
<ListView vm={vm} onAction={handleAction}>
  <MyCustomListContent />
</ListView>

function MyCustomListContent() {
  const { rows, fields, onAction } = useList();
  // 自由にレンダリング
}
```

#### ListView コンポーネント一覧

| コンポーネント | 説明 |
|--------------|------|
| `ListView` | メインコンテナ |
| `ListToolbar` | ツールバー（アクション、検索など） |
| `ListHeaderActions` | ヘッダーアクションボタン群 |
| `ListBulkActions` | 一括操作アクションボタン群 |
| `ListTable` | テーブル本体 |
| `ListTableHeader` | テーブルヘッダー |
| `ListTableHeaderCell` | ヘッダーセル |
| `ListTableBody` | テーブルボディ |
| `ListTableRow` | テーブル行 |
| `ListTableCell` | テーブルセル |
| `ListEmpty` | データなし表示 |
| `ListPagination` | ページネーション |
| `ListPaginationInfo` | ページ情報 |
| `ListPaginationNav` | ページナビゲーション |
| `ListLoading` | ローディング表示 |
| `ListError` | エラー表示 |

### FormView のカスタマイズ

```tsx
import {
  FormView,
  FormHeader,
  FormTitle,
  FormBody,
  FormFooter,
  FormField,
  FormGroup,
  FormActions,
  FormLoading,
  FormError,
  useForm,
} from "@specloom/solidjs";

// ヘッダーのカスタマイズ
<FormView vm={vm} onChange={handleChange} onSubmit={handleSubmit}>
  <FormHeader>
    <FormTitle />
    <button onClick={onCancel}>キャンセル</button>
  </FormHeader>
  <FormLoading />
  <FormError />
  <FormBody />
  <FormFooter />
</FormView>

// フィールドのカスタムレンダリング
<FormView vm={vm} onChange={handleChange} onSubmit={handleSubmit}>
  <FormHeader />
  <FormBody>
    {(field) => (
      <div class="my-custom-field">
        <label>{field.label}</label>
        <FormField field={field} />
      </div>
    )}
  </FormBody>
  <FormFooter />
</FormView>

// Context を使った完全カスタム
<FormView vm={vm} onChange={handleChange} onSubmit={handleSubmit}>
  <MyCustomFormContent />
</FormView>

function MyCustomFormContent() {
  const { fields, values, onChange, onSubmit, isValid } = useForm();
  // 自由にレンダリング
}
```

#### FormView コンポーネント一覧

| コンポーネント | 説明 |
|--------------|------|
| `FormView` | メインコンテナ |
| `FormHeader` | ヘッダー |
| `FormTitle` | タイトル |
| `FormBody` | フィールド群 |
| `FormField` | 単一フィールド |
| `FormFieldLabel` | フィールドラベル |
| `FormFieldHint` | フィールドヒント |
| `FormFieldErrors` | フィールドエラー |
| `FormGroup` | フィールドグループ |
| `FormFooter` | フッター |
| `FormSubmitButton` | 送信ボタン |
| `FormActions` | アクションボタン群 |
| `FormLoading` | ローディング表示 |
| `FormError` | エラー表示 |

### ShowView のカスタマイズ

```tsx
import {
  ShowView,
  ShowHeader,
  ShowTitle,
  ShowBody,
  ShowField,
  ShowGroup,
  ShowActions,
  ShowLoading,
  ShowError,
  useShow,
} from "@specloom/solidjs";

// ヘッダーのカスタマイズ
<ShowView vm={vm} onAction={handleAction}>
  <ShowHeader>
    <ShowTitle />
    <div class="flex gap-2">
      <ShowActions />
      <button onClick={onBack}>戻る</button>
    </div>
  </ShowHeader>
  <ShowLoading />
  <ShowError />
  <ShowBody />
</ShowView>

// フィールドのカスタムレンダリング
<ShowView vm={vm} onAction={handleAction}>
  <ShowHeader />
  <ShowBody>
    {(field, value) => (
      <div class="my-custom-field">
        <span class="label">{field.label}:</span>
        <span class="value">{String(value)}</span>
      </div>
    )}
  </ShowBody>
</ShowView>

// Context を使った完全カスタム
<ShowView vm={vm} onAction={handleAction}>
  <MyCustomShowContent />
</ShowView>

function MyCustomShowContent() {
  const { fields, vm, allowedActions, onAction } = useShow();
  // 自由にレンダリング
}
```

#### ShowView コンポーネント一覧

| コンポーネント | 説明 |
|--------------|------|
| `ShowView` | メインコンテナ |
| `ShowHeader` | ヘッダー |
| `ShowTitle` | タイトル |
| `ShowBody` | フィールド群 |
| `ShowField` | 単一フィールド |
| `ShowGroup` | フィールドグループ |
| `ShowActions` | アクションボタン群 |
| `ShowLoading` | ローディング表示 |
| `ShowError` | エラー表示 |

## Context API

各 View は Context を提供し、子コンポーネントから状態にアクセスできます。

### useList()

```tsx
const {
  vm,           // ListViewModel
  rows,         // 行データ
  fields,       // フィールド定義
  pageActions,  // ページアクション
  bulkActions,  // 一括アクション
  selectedIds,  // 選択中のID
  loading,      // ローディング中か
  error,        // エラーメッセージ
  onSort,       // ソートハンドラ
  onSelect,     // 選択ハンドラ
  onAction,     // アクションハンドラ
  // ...
} = useList();
```

### useForm()

```tsx
const {
  vm,           // FormViewModel
  fields,       // フィールド定義
  visibleFields,// 表示フィールド
  values,       // 現在の値
  isValid,      // バリデーション結果
  isDirty,      // 変更があるか
  canSubmit,    // 送信可能か
  loading,      // ローディング中か
  submitting,   // 送信中か
  error,        // エラーメッセージ
  onChange,     // 値変更ハンドラ
  onSubmit,     // 送信ハンドラ
  // ...
} = useForm();
```

### useShow()

```tsx
const {
  vm,           // ShowViewModel
  fields,       // フィールド定義
  groups,       // グループ定義
  actions,      // アクション
  allowedActions,// 許可されたアクション
  loading,      // ローディング中か
  error,        // エラーメッセージ
  label,        // ラベル
  onAction,     // アクションハンドラ
  // ...
} = useShow();
```

## スタイリング

Tailwind CSS を前提としています。各コンポーネントは `class` prop でスタイルをカスタマイズできます。

```tsx
<ListView vm={vm} class="shadow-lg">
  <ListToolbar class="bg-gray-100" />
  <ListTable class="text-sm" />
</ListView>
```

## ライセンス

MIT
