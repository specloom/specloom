# specloom

Headless Admin ViewModel Spec - 管理画面UIの「意味」を定義するライブラリ

## 概要

specloomは、管理画面のUI仕様をJSON形式で定義し、ランタイムコンテキスト（ユーザー、ロール）で評価してViewModelを生成するライブラリです。

```
TypeSpec (定義) → JSON spec (仕様) → ViewModel (評価済み) → UI (描画)
```

**原則: UIにはパーミッションロジックを持たない** - UIはViewModelの`allowed`フラグを読むだけ。

## インストール

```bash
npm install specloom
# or
pnpm add specloom
```

## 基本的な使い方

```typescript
import { 
  ListVM, FormVM, ShowVM,
  type ListViewModel, type FormViewModel, type ShowViewModel
} from "specloom";

// ViewModelを作成
const listVM: ListViewModel = { ... };

// ヘルパーで状態を操作（イミュータブル）
const updated = ListVM.toggleFilter(listVM, "active");
```

## ViewModel ヘルパー

specloomは3種類のViewModelと、それぞれを操作するヘルパー関数を提供します。
全てのヘルパーは**イミュータブル**で、新しいオブジェクトを返します。

### ListVM（一覧画面）

```typescript
import { ListVM, type ListViewModel } from "specloom";

let vm: ListViewModel = createInitialListVM();

// 読み取り
ListVM.fields(vm)           // フィールド一覧
ListVM.rows(vm)             // 行データ
ListVM.page(vm)             // 現在ページ
ListVM.totalPages(vm)       // 総ページ数
ListVM.selectedIds(vm)      // 選択中のID
ListVM.searchable(vm)       // 検索可能か
ListVM.activeFilters(vm)    // アクティブなフィルター

// 状態更新（イミュータブル）
vm = ListVM.setSearchQuery(vm, "検索キーワード");
vm = ListVM.toggleFilter(vm, "active");
vm = ListVM.toggleSelect(vm, "row-1");
vm = ListVM.toggleSelectAll(vm);
vm = ListVM.clearSelection(vm);
vm = ListVM.setSort(vm, "createdAt", "desc");
vm = ListVM.toggleSort(vm, "name");  // asc → desc → なし
vm = ListVM.setPage(vm, 2);
vm = ListVM.setLoading(vm, true);
vm = ListVM.setError(vm, "エラーメッセージ");
vm = ListVM.setRows(vm, newRows, totalCount);
```

### FormVM（フォーム画面）

```typescript
import { FormVM, type FormViewModel } from "specloom";

let vm: FormViewModel = createInitialFormVM();

// 読み取り
FormVM.fields(vm)           // フィールド一覧
FormVM.value(vm, "title")   // フィールド値
FormVM.values(vm)           // 全フィールド値
FormVM.valid(vm)            // バリデーション有効か
FormVM.dirty(vm)            // 変更があるか
FormVM.errors(vm)           // エラー一覧
FormVM.canSubmit(vm)        // 送信可能か

// 状態更新（イミュータブル）
vm = FormVM.setValue(vm, "title", "新しいタイトル");
vm = FormVM.setValues(vm, { title: "タイトル", content: "本文" });
vm = FormVM.validate(vm);                    // フォーム全体をバリデーション
vm = FormVM.validateField(vm, "email");      // 単一フィールドをバリデーション
vm = FormVM.setFieldErrors(vm, "email", ["無効なメールアドレス"]);
vm = FormVM.clearErrors(vm);
vm = FormVM.setAllErrors(vm, { email: ["エラー1"], name: ["エラー2"] });
vm = FormVM.setSubmitting(vm, true);
vm = FormVM.setLoading(vm, true);
vm = FormVM.setError(vm, "保存に失敗しました");
vm = FormVM.reset(vm);                       // フォームをリセット
vm = FormVM.reset(vm, { title: "初期値" });  // 初期値を指定してリセット
vm = FormVM.markClean(vm);                   // dirty状態をクリア
```

### ShowVM（詳細画面）

```typescript
import { ShowVM, type ShowViewModel } from "specloom";

let vm: ShowViewModel = createInitialShowVM();

// 読み取り
ShowVM.fields(vm)           // フィールド一覧
ShowVM.value(vm, "title")   // フィールド値
ShowVM.formatValue(field, value)  // 値をフォーマット
ShowVM.groups(vm)           // グループ一覧
ShowVM.allowedActions(vm)   // 許可されたアクション

// 状態更新（イミュータブル）
vm = ShowVM.setLoading(vm, true);
vm = ShowVM.setError(vm, "データ取得に失敗");
vm = ShowVM.setData(vm, { title: "新タイトル", content: "新本文" });
vm = ShowVM.setFieldValue(vm, "title", "更新されたタイトル");
vm = ShowVM.setId(vm, "new-id");
```

## ViewModel 型定義

### ListViewModel

```typescript
interface ListViewModel {
  type: "list";
  resource: string;
  label: string;
  fields: ListFieldVM[];
  rows: RowVM[];
  headerActions: ActionVM[];
  bulkActions: ActionVM[];
  filters: { named: NamedFilterVM[] };
  selection: { mode: "none" | "single" | "multi"; selected: string[] };
  search: { fields: string[]; query: string };
  defaultSort?: { field: string; order: "asc" | "desc" };
  pagination?: { page: number; pageSize: number; totalCount: number };
  isLoading?: boolean;
  error?: string;
}
```

### FormViewModel

```typescript
interface FormViewModel {
  type: "form";
  resource: string;
  label: string;
  mode: "create" | "edit";
  id?: string;
  fields: FormFieldVM[];
  actions: ActionVM[];
  isValid: boolean;
  isDirty: boolean;
  groups?: FieldGroup[];
  isLoading?: boolean;
  isSubmitting?: boolean;
  error?: string;
}
```

### ShowViewModel

```typescript
interface ShowViewModel {
  type: "show";
  resource: string;
  label: string;
  id: string;
  fields: ShowFieldVM[];
  actions: ActionVM[];
  groups?: FieldGroup[];
  isLoading?: boolean;
  error?: string;
}
```

## その他のユーティリティ

### Validation（バリデーション）

```typescript
import { Validate, validateField, validateForm } from "specloom";

// フォームデータをバリデーション
const errors = validateForm(fields, data);

// 単一フィールドをバリデーション
const fieldErrors = validateField(field, value);

// エラーチェック
Validate.valid(errors)              // エラーがないか
Validate.hasError(errors, "email")  // 特定フィールドにエラーがあるか
Validate.firstError(errors, "email") // 最初のエラーメッセージ
```

### Format（フォーマット）

```typescript
import { Format } from "specloom";

Format.field(value, field)     // フィールド値をフォーマット
Format.date(value)             // 日付フォーマット
Format.datetime(value)         // 日時フォーマット
Format.number(value)           // 数値フォーマット
Format.boolean(value)          // 真偽値フォーマット（はい/いいえ）
```

### i18n（国際化）

```typescript
import { i18n } from "specloom";

i18n.setLocale("ja");  // 日本語
i18n.setLocale("en");  // 英語

const t = i18n.t();
t.validation.required("タイトル")  // "タイトルは必須です"
t.format.boolean.true              // "はい"
```

## UIフレームワーク連携

specloomは「ヘッドレス」ライブラリです。UIコンポーネントは別パッケージで提供：

- `@specloom/svelte` - Svelte/SvelteKit用コンポーネント
- `@specloom/solidjs` - SolidJS用コンポーネント

```svelte
<!-- Svelte例 -->
<script>
  import { ListView, FormView, ShowView } from "@specloom/svelte";
  import { ListVM } from "specloom";
  
  let vm = $state(initialListVM);
  
  function handleSearch(query) {
    vm = ListVM.setSearchQuery(vm, query);
    // APIからデータ再取得...
  }
</script>

<ListView 
  {vm} 
  onSearch={handleSearch}
  onPageChange={(page) => vm = ListVM.setPage(vm, page)}
/>
```

## ライセンス

MIT
