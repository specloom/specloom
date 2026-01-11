# Validation

Validation はフィールドの制約を定義します。

## @required

必須にします。
```typespec
@required
title: string;
```

## @minLength / @maxLength

文字数制限を設定します。
```typespec
@minLength(1)
@maxLength(100)
title: string;
```

## @min / @max

数値の範囲を設定します。
```typespec
@min(0)
@max(100)
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

配列の要素数を制限します。
```typespec
@kind("relation")
@relation(Tag, #{ labelField: "name" })
@cardinality("many")
@minItems(1)
@maxItems(5)
tags: Tag[];
```

## @requiredOneOf

複数フィールドのうち、少なくとも1つを必須にします。

Resource に付けます。
```typespec
@resource
@requiredOneOf(["email", "phone", "address"])
model Contact {
  @label("メール")
  email?: string;

  @label("電話")
  phone?: string;

  @label("住所")
  address?: string;
}
```

複数のグループを指定できます。
```typespec
@resource
@requiredOneOf(["email", "phone"])
@requiredOneOf(["firstName", "companyName"])
model Contact {
  email?: string;
  phone?: string;
  firstName?: string;
  companyName?: string;
}
```

## @confirm

確認入力を指定します。パスワードなどで使います。
```typespec
@label("パスワード")
@kind("text")
@inputHint("password")
@required
password: string;

@label("パスワード確認")
@kind("text")
@inputHint("password")
@confirm("password")
passwordConfirm: string;
```

`passwordConfirm` は `password` と同じ値でなければなりません。

## 組み合わせ
```typespec
@label("タイトル")
@kind("text")
@required
@minLength(1)
@maxLength(100)
title: string;

@label("メールアドレス")
@kind("email")
@required
@pattern("email")
email: string;

@label("タグ")
@kind("relation")
@relation(Tag, #{ labelField: "name" })
@cardinality("many")
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

## サーバー側で実装するもの

以下は spec では対応しません。サーバー側で実装してください。

| パターン | 例 |
|---------|-----|
| ユニーク制約 | email は重複不可 |
| 存在チェック | author が DB に存在するか |
| 条件付き必須 | status が published なら publishedAt 必須 |
| フィールド比較 | startDate < endDate |

## 次のステップ

- [Relation](./relation.md) - リレーション
- [List View](./list.md) - 一覧画面
