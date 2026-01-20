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

## モジュール一覧

| モジュール | 説明 |
|-----------|------|
| `vm/` | ViewModel型とヘルパー関数 |
| `spec/` | JSON spec形式の型定義 |
| `validation/` | フィールドバリデーション |
| `format/` | 表示用フォーマット |
| `serialize/` | API送信用データ変換 |
| `filter/` | フィルター式評価 |
| `i18n/` | 国際化（日本語/英語） |
| `loader/` | JSON spec読み込み |
| `evaluator/` | spec + context → ViewModel評価 |

---

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
vm = ListVM.setFilterActive(vm, "status", true);
vm = ListVM.clearFilters(vm);
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

#### フィルター機能

ListVMは定義済みフィルター（named filter）とカスタムフィルターの両方をサポートします。

```typescript
import { ListVM, type FilterExpression } from "specloom";

// 定義済みフィルターの操作
vm = ListVM.toggleFilter(vm, "published");     // フィルターのON/OFF
vm = ListVM.setFilterActive(vm, "draft", true); // 明示的に設定
vm = ListVM.clearFilters(vm);                   // 全フィルターをクリア

// 定義済みフィルターの条件式を取得
const filter = ListVM.getFilterExpression(vm, "published");
// → { field: "status", op: "eq", value: "published" }

// カスタムフィルターを設定（動的なフィルター条件）
vm = ListVM.setCustomFilter(vm, {
  field: "name",
  op: "ilike",
  value: "田中",
});

// 複合条件のカスタムフィルター
vm = ListVM.setCustomFilter(vm, {
  and: [
    { field: "status", op: "eq", value: "active" },
    { field: "price", op: "gte", value: 1000 },
  ],
});

// カスタムフィルターをクリア
vm = ListVM.clearCustomFilter(vm);

// アクティブな全フィルター条件を結合して取得（API送信用）
const activeFilter = ListVM.getActiveFilterExpression(vm);
// 複数のフィルターがアクティブな場合はANDで結合される

// クライアントサイドでフィルタリング
const filteredRows = ListVM.filterRows(vm);

// 行がフィルター条件にマッチするか判定
const matches = ListVM.rowMatchesFilter(vm, row);
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

---

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

---

## Serialize（API送信用データ変換）

フォームデータをAPI送信用に変換するユーティリティ。

```typescript
import { Serialize } from "specloom";

// フォームデータを送信用オブジェクトに変換
const data = Serialize.formData(vm, {
  excludeNull: true,      // nullを除外
  excludeEmpty: true,     // 空文字を除外
  dateFormat: "iso",      // "iso" | "timestamp" | "date-only"
});

// 変更されたフィールドのみ取得（PATCH用）
const original = { title: "旧タイトル", content: "本文" };
const dirty = Serialize.dirtyFields(vm, original);
// → { title: "新タイトル" }  // 変更されたフィールドのみ

// URLクエリパラメータに変換
const query = Serialize.queryParams(
  { tags: ["a", "b"], page: 1 },
  { arrayFormat: "bracket" }  // "bracket" | "index" | "comma"
);
// → "tags[]=a&tags[]=b&page=1"

// FormDataに変換（ファイルアップロード対応）
const formData = Serialize.multipart(vm, {
  avatar: avatarFile,
  documents: [doc1, doc2],
});

// JSON文字列に変換
const json = Serialize.json(vm, { pretty: true });

// リストフィルターをクエリパラメータに変換
const filterQuery = Serialize.listFilters({ status: "active", category: 1 });

// ページネーションパラメータ生成
const pageParams = Serialize.pagination(2, 20, {
  pageKey: "p",
  sizeKey: "limit",
});
// → { p: 2, limit: 20 }

// ソートパラメータ生成
const sortParams = Serialize.sort("createdAt", "desc", { combined: true });
// → { sort: "createdAt:desc" }
```

---

## Filter（フィルター式評価）

クライアントサイドでフィルター式を評価するユーティリティ。

```typescript
import { evaluateFilter, isFilterExpression } from "specloom";

const data = {
  status: "active",
  price: 1500,
  tags: ["sale", "new"],
  author: { name: "田中" },
};

// 単純な条件
evaluateFilter({ field: "status", op: "eq", value: "active" }, data);
// → true

// 比較演算子
evaluateFilter({ field: "price", op: "gte", value: 1000 }, data);
// → true

// 文字列演算子
evaluateFilter({ field: "author.name", op: "contains", value: "田" }, data);
// → true（ドット記法でネストアクセス）

// 大文字小文字を無視した部分一致
evaluateFilter({ field: "status", op: "ilike", value: "ACTIVE" }, data);
// → true

// 配列演算子
evaluateFilter({ field: "tags", op: "hasAny", value: ["sale", "hot"] }, data);
// → true

// AND条件
evaluateFilter({
  and: [
    { field: "status", op: "eq", value: "active" },
    { field: "price", op: "lt", value: 2000 },
  ]
}, data);
// → true

// OR条件
evaluateFilter({
  or: [
    { field: "status", op: "eq", value: "draft" },
    { field: "price", op: "gte", value: 1000 },
  ]
}, data);
// → true

// NOT条件
evaluateFilter({
  not: { field: "status", op: "eq", value: "deleted" }
}, data);
// → true

// 型ガード
if (isFilterExpression(userInput)) {
  const result = evaluateFilter(userInput, data);
}
```

### 利用可能な演算子

| 演算子 | 説明 | 例 |
|--------|------|-----|
| `eq` | 等しい | `{ field: "status", op: "eq", value: "active" }` |
| `ne` | 等しくない | `{ field: "status", op: "ne", value: "deleted" }` |
| `gt` | より大きい | `{ field: "price", op: "gt", value: 100 }` |
| `gte` | 以上 | `{ field: "price", op: "gte", value: 100 }` |
| `lt` | より小さい | `{ field: "price", op: "lt", value: 1000 }` |
| `lte` | 以下 | `{ field: "price", op: "lte", value: 1000 }` |
| `contains` | 含む（文字列） | `{ field: "name", op: "contains", value: "田" }` |
| `startsWith` | 前方一致 | `{ field: "name", op: "startsWith", value: "山" }` |
| `endsWith` | 後方一致 | `{ field: "name", op: "endsWith", value: "郎" }` |
| `matches` | 正規表現 | `{ field: "email", op: "matches", value: "^[a-z]+@" }` |
| `ilike` | 大文字小文字無視の部分一致 | `{ field: "name", op: "ilike", value: "JOHN" }` |
| `in` | 配列に含まれる | `{ field: "status", op: "in", value: ["a", "b"] }` |
| `notIn` | 配列に含まれない | `{ field: "status", op: "notIn", value: ["x"] }` |
| `isNull` | null/undefined | `{ field: "deletedAt", op: "isNull", value: true }` |
| `isEmpty` | 空値 | `{ field: "tags", op: "isEmpty", value: true }` |
| `hasAny` | いずれかを含む（配列） | `{ field: "tags", op: "hasAny", value: ["a", "b"] }` |
| `hasAll` | すべてを含む（配列） | `{ field: "tags", op: "hasAll", value: ["a", "b"] }` |
| `hasNone` | いずれも含まない（配列） | `{ field: "tags", op: "hasNone", value: ["x"] }` |

---

## Format（表示用フォーマット）

値を表示用にフォーマットするユーティリティ。ロケール対応。

```typescript
import { Format } from "specloom";

// 日付
Format.date(new Date());                    // "2024/01/15"
Format.date("2024-01-15", { dateStyle: "long" });  // "2024年1月15日"

// 時刻
Format.time(new Date());                    // "14:30"
Format.time(new Date(), { timeStyle: "long" });  // "14:30:45"

// 日時
Format.datetime(new Date());                // "2024/01/15 14:30"

// 数値
Format.number(12345.67);                    // "12,345.67"
Format.number(12345, { maximumFractionDigits: 0 });  // "12,345"

// 通貨
Format.currency(1234);                      // "¥1,234"
Format.currency(1234, { currency: "USD" }); // "$1,234.00"

// パーセント
Format.percent(0.156);                      // "16%"
Format.percent(0.156, { maximumFractionDigits: 1 });  // "15.6%"

// ブール値
Format.boolean(true);                       // "はい"
Format.boolean(false);                      // "いいえ"
Format.boolean(true, { true: "有効", false: "無効" });  // "有効"

// 配列
Format.list(["赤", "青", "緑"]);            // "赤, 青, 緑"
Format.list(["a", "b"], " | ");             // "a | b"

// テキスト省略
Format.truncate("長いテキスト...", 5);      // "長いテ..."
Format.truncate("長いテキスト", 5, "…");    // "長いテ…"

// ファイルサイズ
Format.fileSize(1024);                      // "1.0 KB"
Format.fileSize(1536000);                   // "1.5 MB"

// 相対時間
Format.relative(new Date(Date.now() - 60000));  // "1分前"
Format.relative(new Date(Date.now() - 3600000)); // "1時間前"

// FieldKindに基づく自動フォーマット
Format.auto(new Date(), "date");            // "2024/01/15"
Format.auto(1234, "currency");              // "¥1,234"
Format.auto(true, "boolean");               // "はい"

// フィールド定義に基づくフォーマット（UIモジュール向け）
Format.field(value, {
  kind: "enum",
  options: [
    { value: "active", label: "有効" },
    { value: "inactive", label: "無効" },
  ],
});
```

---

## Validation（バリデーション）

フィールドバリデーションユーティリティ。

```typescript
import { Validate, validateField, validateForm } from "specloom";

// フォーム全体をバリデーション
const errors = validateForm(fields, data);
// → { email: ["無効なメールアドレスです"], name: [] }

// 単一フィールドをバリデーション
const fieldErrors = validateField(emailField, "invalid-email");
// → ["無効なメールアドレスです"]

// エラーチェックユーティリティ
Validate.valid(errors);                // true（エラーがない場合）
Validate.hasError(errors, "email");    // true
Validate.errors(errors, "email");      // ["無効なメールアドレスです"]
Validate.firstError(errors, "email");  // "無効なメールアドレスです"
Validate.allErrors(errors);            // 全エラーをフラット配列で取得
Validate.empty();                      // 空のエラーオブジェクト生成
```

---

## i18n（国際化）

日本語と英語のロケールをサポート。

```typescript
import { i18n, createI18n } from "specloom";

// グローバルインスタンス（シングルトン）
i18n.setLocale("ja");  // 日本語
i18n.setLocale("en");  // 英語

const t = i18n.t();
t.validation.required("タイトル");  // "タイトルは必須です"
t.format.booleanTrue;               // "はい"
t.format.booleanFalse;              // "いいえ"
t.format.empty;                     // "-"

// SSR/マルチテナント用：独立したインスタンス作成
const userI18n = createI18n("en");
userI18n.setLocale("ja");
const userT = userI18n.t();

// ブラウザロケールから解決
const locale = i18n.resolveLocale(navigator.language);
// "ja-JP" → "ja", "en-US" → "en"
```

### メッセージ構造

```typescript
interface Messages {
  intlLocale: string;        // "ja-JP" | "en-US"
  defaultCurrency: string;   // "JPY" | "USD"
  validation: {
    required: (field: string) => string;
    minLength: (field: string, min: number) => string;
    maxLength: (field: string, max: number) => string;
    min: (field: string, min: number) => string;
    max: (field: string, max: number) => string;
    pattern: (field: string) => string;
    email: (field: string) => string;
    url: (field: string) => string;
    // ...
  };
  format: {
    booleanTrue: string;
    booleanFalse: string;
    empty: string;
  };
}
```

---

## UIフレームワーク連携

specloomは「ヘッドレス」ライブラリです。UIコンポーネントは別パッケージで提供：

- `@specloom/svelte` - Svelte/SvelteKit用コンポーネント
- `@specloom/solidjs` - SolidJS用コンポーネント

```svelte
<!-- Svelte例 -->
<script>
  import { ListView, FormView, ShowView } from "@specloom/svelte";
  import { ListVM, Serialize } from "specloom";
  
  let vm = $state(initialListVM);
  
  async function handleSearch(query) {
    vm = ListVM.setSearchQuery(vm, query);
    vm = ListVM.setLoading(vm, true);
    
    const params = Serialize.queryParams({
      q: query,
      ...Serialize.pagination(ListVM.page(vm), 20),
    });
    
    const res = await fetch(`/api/posts?${params}`);
    const { data, total } = await res.json();
    
    vm = ListVM.setRows(vm, data, total);
    vm = ListVM.setLoading(vm, false);
  }
</script>

<ListView 
  {vm} 
  onSearch={handleSearch}
  onPageChange={(page) => vm = ListVM.setPage(vm, page)}
/>
```

---

## ライセンス

MIT
