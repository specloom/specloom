# Validation

Validation はフィールドの制約を定義します。

## @required

必須にします。
```typespec
@S.required
title: string;
```

## @minLength / @maxLength

> **Note**: これらは TypeSpec 標準のデコレーターです。

文字数制限を設定します。
```typespec
@minLength(1)
@maxLength(100)
title: string;
```

## @min / @max

数値の範囲を設定します。
```typespec
@S.min(0)
@S.max(100)
progress: int32;
```

## @pattern

パターンを指定します。
```typespec
@pattern("email")
email: string;

@pattern("url")
website: string;

@pattern("slug")
slug: string;
```

### pattern 一覧

| pattern | 説明 | 例 |
|---------|------|-----|
| email | メールアドレス | user@example.com |
| url | URL | https://example.com |
| slug | 半角英数ハイフン | my-post-title |
| phone | 電話番号 | 03-1234-5678 |
| alphanumeric | 英数字のみ | abc123 |

## @minItems / @maxItems

> **Note**: これらは TypeSpec 標準のデコレーターです。

配列の要素数を制限します。
```typespec
@S.kind("relation")
@S.relation(Tag, #{ labelField: "name" })
@S.cardinality("many")
@minItems(1)
@maxItems(5)
tags: Tag[];
```

## @requiredOneOf

複数フィールドのうち、少なくとも1つを必須にします。

Resource に付けます。
```typespec
@S.resource
@S.requiredOneOf(["email", "phone", "address"])
model Contact {
  @S.label("メール")
  email?: string;

  @S.label("電話")
  phone?: string;

  @S.label("住所")
  address?: string;
}
```

複数のグループを指定できます。
```typespec
@S.resource
@S.requiredOneOf(["email", "phone"])
@S.requiredOneOf(["firstName", "companyName"])
model Contact {
  email?: string;
  phone?: string;
  firstName?: string;
  companyName?: string;
}
```

## @match

確認入力を指定します。パスワードなどで使います。
```typespec
@S.label("パスワード")
@S.kind("text")
@S.inputHint("password")
@S.required
password: string;

@S.label("パスワード確認")
@S.kind("text")
@S.inputHint("password")
@S.match("password")
passwordConfirm: string;
```

`passwordConfirm` は `password` と同じ値でなければなりません。

## 組み合わせ
```typespec
@S.label("タイトル")
@S.kind("text")
@S.required
@minLength(1)
@maxLength(100)
title: string;

@S.label("メールアドレス")
@S.kind("email")
@S.required
@pattern("email")
email: string;

@S.label("タグ")
@S.kind("relation")
@S.relation(Tag, #{ labelField: "name" })
@S.cardinality("many")
@minItems(1)
@maxItems(5)
tags: Tag[];
```

## バリデーションの原則

spec は **制約のみ** 定義します。

- ⭕ 最大100文字
- ⭕ 必須
- ⭕ A or B 必須
- ❌ エラーメッセージ

エラーメッセージは UI / i18n の責務です。
```
spec: 制約を定義
UI: リアルタイムチェック（UX）
サーバー: 最終判定（セキュリティ）
```

## @requiredWhen

条件付きで必須にします。`@allowedWhen` と同じ式言語を使います。

```typespec
@S.label("URL")
@S.kind("url")
@S.requiredWhen("type == 'external'")
url: string;

@S.label("公開日")
@S.requiredWhen("status == 'published'")
publishedAt?: plainDate;
```

`@required` と `@requiredWhen` は **OR** で結合されます。`@required` がある場合は常に必須です。

詳細は [Field - @requiredWhen](./field.md#requiredwhen) を参照。

## サーバー側で実装するもの

以下は spec では対応しません。サーバー側で実装してください。

| パターン | 例 |
|---------|-----|
| ユニーク制約 | email は重複不可 |
| 存在チェック | author が DB に存在するか |
| フィールド比較 | startDate < endDate |

## 次のステップ

- [Relation](./relation.md) - リレーション
- [List View](./list.md) - 一覧画面
