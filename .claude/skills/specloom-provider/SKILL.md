---
name: specloom-provider
description: Use this skill when setting up authentication or data providers for specloom admin apps. Covers AuthProvider (Firebase multi-tenant), DataProvider (REST), HttpClient, ResourceConfig, and app-side wiring patterns.
---

# specloom Provider Skill

This skill helps you set up and configure `@specloom/auth-provider` and `@specloom/data-provider` for admin applications built on specloom.

## When to Activate

- Setting up authentication for a specloom admin app
- Configuring Firebase Identity Platform with multi-tenant
- Creating a REST data provider with custom resource mappings
- Wiring auth + data providers together
- Defining custom actions on resources
- Implementing request/response transforms for API integration
- Creating a custom AuthProvider or DataProvider implementation

## Package Overview

```
@specloom/auth-provider          認証プロバイダー抽象化
  ├── core/                      AuthProvider<TTenant> インターフェース + 型定義
  └── providers/firebase/        Firebase Identity Platform 実装

@specloom/data-provider          データプロバイダー抽象化
  ├── core/                      DataProvider インターフェース + 型定義
  ├── http/                      認証付き HTTP クライアント
  └── providers/rest/            REST 実装
```

### Import Paths

```typescript
// Core types and interfaces (firebase-free)
import type { AuthProvider, AuthIdentity, LoginParams } from "@specloom/auth-provider";
import { SignInMethod } from "@specloom/auth-provider";

// Firebase implementation (requires firebase peer dep)
import { createFirebaseAuthProvider } from "@specloom/auth-provider/firebase";

// Data provider core + HTTP client
import type { DataProvider, ListParams, ResourceConfig } from "@specloom/data-provider";
import { createHttpClient } from "@specloom/data-provider";

// REST implementation
import { createRestDataProvider } from "@specloom/data-provider/rest";
```

### Dependency Chain

```
@specloom/auth-provider    外部依存なし (firebase は optional peerDep)

@specloom/data-provider    外部依存なし (TokenProvider インターフェースで抽象化)

アプリケーション
```

## Installing (npm公開前)

```bash
# ローカルパス参照 (package.json)
{
  "dependencies": {
    "@specloom/auth-provider": "file:../specloom/packages/auth-provider",
    "@specloom/data-provider": "file:../specloom/packages/data-provider"
  }
}

# Firebase を使う場合
pnpm add firebase
```

## Auth Provider

### AuthProvider Interface

```typescript
interface AuthProvider<TTenant extends TenantType = TenantType> {
  login(params: LoginParams<TTenant>): Promise<AuthIdentity<TTenant>>;
  logout(): Promise<void>;
  checkAuth(params?: CheckAuthParams): Promise<void>;
  checkError(error: AuthError): Promise<void>;
  getIdentity(): Promise<AuthIdentity<TTenant> | null>;
  getToken(): Promise<string | null>;
  checkPermissions(params: CheckPermissionsParams<TTenant>): Promise<void>;
  getPermissions(): Promise<TTenant | null>;
  onAuthStateChanged?(callback: (identity: AuthIdentity<TTenant> | null) => void): () => void;
}
```

### Core Types

```typescript
// テナント型はジェネリクス。プロジェクト固有の型を利用側で定義する
type TenantType = string;

const SignInMethod = {
  EMAIL_PASSWORD: "EMAIL_PASSWORD",
  GOOGLE: "GOOGLE",
  LINE: "LINE",
  APPLE: "APPLE",
  OIDC: "OIDC",
} as const;

interface AuthIdentity<TTenant extends TenantType = TenantType> {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  tenantId: string;
  tenantType: TTenant;
  emailVerified: boolean;
  customClaims?: Record<string, unknown>;
}

interface LoginParams<TTenant extends TenantType = TenantType> {
  tenant: TTenant;
  method: SignInMethod;
  email?: string;
  password?: string;
}

interface AuthError {
  message: string;
  code?: string;
  status?: number;
}

interface CheckPermissionsParams<TTenant extends TenantType = TenantType> {
  action?: string;
  resource?: string;
  requiredRoles?: TTenant[];
}

interface TenantConfig<TTenant extends TenantType = TenantType> {
  tenantIds: Record<TTenant, string>;
  loginRedirects?: Record<TTenant, string>;
}

interface FirebaseProviderConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
}
```

### Firebase Implementation

Google Identity Platform のマルチテナント対応。

```typescript
import { createFirebaseAuthProvider } from "@specloom/auth-provider/firebase";

// 1. プロジェクト固有のテナント型を定義
const MyTenant = { ADMIN: "ADMIN", FARMER: "FARMER", CUSTOMER: "CUSTOMER" } as const;
type MyTenant = (typeof MyTenant)[keyof typeof MyTenant];

// 2. AuthProvider を作成
const authProvider = createFirebaseAuthProvider<MyTenant>({
  firebase: {
    apiKey: "AIza...",
    authDomain: "my-project.firebaseapp.com",
    projectId: "my-project",
  },
  tenants: {
    tenantIds: {
      ADMIN: "admin-tenant-xxxx",
      FARMER: "farmer-tenant-xxxx",
      CUSTOMER: "customer-tenant-xxxx",
    },
    loginRedirects: {
      ADMIN: "/admin",
      FARMER: "/farmer",
      CUSTOMER: "/customer",
    },
  },
});
```

**Firebase 実装の動作:**

| メソッド | 動作 |
|---------|------|
| `login()` | `auth.tenantId` をセットして `signInWithEmailAndPassword` or `signInWithPopup(GoogleAuthProvider)` |
| `logout()` | `signOut(auth)` |
| `checkAuth()` | `auth.currentUser` or `onAuthStateChanged` で待機、なければ throw (401) |
| `checkError(err)` | 401/403 なら `signOut` して re-throw |
| `getIdentity()` | Firebase User → `AuthIdentity` に変換（`tenantId` → `tenantType` マッピング） |
| `getToken()` | `user.getIdToken()` |
| `checkPermissions()` | `requiredRoles` に `identity.tenantType` が含まれなければ throw (403) |
| `onAuthStateChanged()` | Firebase の `onAuthStateChanged` をラップ、unsubscribe 関数を返す |

**サポートする SignInMethod:**
- `EMAIL_PASSWORD` - メール/パスワード認証
- `GOOGLE` - Google ポップアップ認証
- `LINE`, `APPLE`, `OIDC` - 型定義のみ（実装は拡張が必要）

### Custom AuthProvider Implementation

Firebase 以外のプロバイダーを実装する場合:

```typescript
import type { AuthProvider, AuthIdentity } from "@specloom/auth-provider";

type MyTenant = "ADMIN" | "USER";

function createMyAuthProvider(): AuthProvider<MyTenant> {
  let currentIdentity: AuthIdentity<MyTenant> | null = null;

  return {
    async login(params) {
      const res = await fetch("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email: params.email, password: params.password }),
      });
      const data = await res.json();
      currentIdentity = {
        uid: data.id,
        email: data.email,
        displayName: data.name,
        photoURL: null,
        tenantId: data.tenantId,
        tenantType: params.tenant,
        emailVerified: true,
      };
      localStorage.setItem("token", data.token);
      return currentIdentity;
    },

    async logout() {
      localStorage.removeItem("token");
      currentIdentity = null;
    },

    async checkAuth() {
      if (!localStorage.getItem("token")) {
        throw { message: "Not authenticated", status: 401 };
      }
    },

    async checkError(error) {
      if (error.status === 401 || error.status === 403) {
        localStorage.removeItem("token");
        currentIdentity = null;
        throw error;
      }
    },

    async getIdentity() { return currentIdentity; },
    async getToken() { return localStorage.getItem("token"); },

    async checkPermissions(params) {
      if (params.requiredRoles?.length && currentIdentity) {
        if (!params.requiredRoles.includes(currentIdentity.tenantType)) {
          throw { message: "Forbidden", status: 403 };
        }
      }
    },

    async getPermissions() { return currentIdentity?.tenantType ?? null; },
  };
}
```

## Data Provider

### DataProvider Interface

```typescript
interface DataProvider {
  getList<T = unknown>(resource: string, params: ListParams): Promise<ListResult<T>>;
  getOne<T = unknown>(resource: string, params: GetOneParams): Promise<T>;
  create<T = unknown>(resource: string, params: CreateParams): Promise<T>;
  update<T = unknown>(resource: string, params: UpdateParams): Promise<T>;
  delete<T = unknown>(resource: string, params: DeleteParams): Promise<T>;
  getMany?<T = unknown>(resource: string, params: GetManyParams): Promise<T[]>;
}
```

### Core Types

```typescript
interface ListParams {
  pagination: { page: number; perPage: number };
  sort: { field: string; order: "asc" | "desc" };
  filter: Record<string, unknown>;
}

interface ListResult<T = unknown> {
  data: T[];
  total: number;
}

interface GetOneParams  { id: string | number; }
interface CreateParams  { data: Record<string, unknown>; }
interface UpdateParams  { id: string | number; data: Record<string, unknown>; }
interface DeleteParams  { id: string | number; }
interface GetManyParams { ids: (string | number)[]; }
```

### HTTP Client

`TokenProvider` からトークンを取得し、全リクエストに Bearer ヘッダーを自動付与。
`AuthProvider` は `TokenProvider` を満たすのでそのまま渡せる。

```typescript
import { createHttpClient } from "@specloom/data-provider";
import type { TokenProvider } from "@specloom/data-provider";

// AuthProvider をそのまま渡せる
const http = createHttpClient(authProvider, {
  baseUrl: "https://api.example.com",
  defaultHeaders: {
    "X-Custom-Header": "value",
  },
});
```

**HttpClient の動作:**
- 全リクエストに `Authorization: Bearer <token>` を付与
- `Content-Type: application/json` を自動設定
- トークンが取得できない場合は `{ message: "Not authenticated", status: 401 }` を throw
- レスポンスが `!res.ok` の場合、`tokenProvider.checkError?.()` を呼び出してから throw

```typescript
interface HttpClient {
  get:    <T>(path: string) => Promise<T>;
  post:   <T>(path: string, body: unknown) => Promise<T>;
  put:    <T>(path: string, body: unknown) => Promise<T>;
  delete: <T>(path: string) => Promise<T>;
}
```

### REST Data Provider

```typescript
import { createRestDataProvider } from "@specloom/data-provider/rest";

const dataProvider = createRestDataProvider(http, {
  apiPrefix: "/api",        // デフォルト: "/api"
  defaultConfig: {          // 全リソース共通設定
    transformSort: (field) => field === "createdAt" ? "created_at" : field,
  },
  resources: {
    // リソースごとの設定
    orders: { /* ... */ },
    users:  { /* ... */ },
  },
});
```

**REST 実装の動作:**

| メソッド | HTTP | URL |
|---------|------|-----|
| `getList("orders", params)` | `GET` | `{endpoint}?_page=1&_limit=20&_sort=id&_order=asc&...filter` |
| `getOne("orders", { id: "1" })` | `GET` | `{endpoint}/1` |
| `create("orders", { data })` | `POST` | `{endpoint}` |
| `update("orders", { id: "1", data })` | `PUT` | `{endpoint}/1` |
| `delete("orders", { id: "1" })` | `DELETE` | `{endpoint}/1` |

**エンドポイント解決の優先順位:**
1. `config.endpoint` が関数 → `endpoint(resource)` の戻り値
2. `config.endpoint` が文字列 → その値をそのまま使用
3. 未設定 → `{apiPrefix}/{resource}` (例: `/api/orders`)

個別アイテムは `config.itemEndpoint` があればそれを使い、なければ `{endpoint}/{id}`.

### ResourceConfig

```typescript
interface ResourceConfig<TData, TApiResponse, TApiRequest> {
  endpoint?: string | ((resource: string) => string);
  itemEndpoint?: (id: string | number) => string;
  transformResponse?: (raw: TApiResponse) => TData;
  transformListResponse?: (raw: unknown) => ListResult<TData>;
  transformRequest?: (data: Record<string, unknown>) => TApiRequest;
  transformFilter?: (filter: Record<string, unknown>) => Record<string, unknown>;
  transformSort?: (field: string) => string;
  defaultFilter?: Record<string, unknown>;
  defaultSort?: { field: string; order: "asc" | "desc" };
  actions?: Record<string, CustomAction>;
}
```

### ResourceConfig Examples

#### Basic: カスタムエンドポイント

```typescript
resources: {
  orders: {
    endpoint: "/api/v1/oyster-orders",
  },
}
```

#### Transform: snake_case API ↔ camelCase フロント

```typescript
resources: {
  orders: {
    endpoint: "/api/v1/orders",
    transformResponse: (raw: any) => ({
      id: raw.id,
      customerId: raw.customer_id,
      orderStatus: raw.order_status,
      createdAt: new Date(raw.created_at),
    }),
    transformRequest: (data) => ({
      customer_id: data.customerId,
      order_status: data.orderStatus,
    }),
  },
}
```

#### Transform: 一覧レスポンスのカスタム形式

```typescript
resources: {
  orders: {
    // API が { items: [...], pagination: { total: 100 } } を返す場合
    transformListResponse: (raw: any) => ({
      data: raw.items.map((item: any) => ({
        id: item.id,
        status: item.order_status,
      })),
      total: raw.pagination.total,
    }),
  },
}
```

#### Filter/Sort 変換

```typescript
resources: {
  orders: {
    transformFilter: (filter) => {
      const result: Record<string, unknown> = {};
      for (const [key, value] of Object.entries(filter)) {
        // camelCase → snake_case
        result[key.replace(/[A-Z]/g, (c) => `_${c.toLowerCase()}`)] = value;
      }
      return result;
    },
    transformSort: (field) => {
      const map: Record<string, string> = {
        createdAt: "created_at",
        updatedAt: "updated_at",
        orderStatus: "order_status",
      };
      return map[field] ?? field;
    },
    defaultFilter: { is_active: true },
    defaultSort: { field: "created_at", order: "desc" },
  },
}
```

### Custom Actions

リソースに紐づくカスタム API アクション。

```typescript
resources: {
  orders: {
    endpoint: "/api/v1/orders",
    actions: {
      approve: {
        method: "POST",
        path: (id) => `/api/v1/orders/${id}/approve`,
      },
      reject: {
        method: "POST",
        path: (id) => `/api/v1/orders/${id}/reject`,
        transformRequest: (data) => ({ reason: data.reason }),
        transformResponse: (raw: any) => ({ success: raw.ok }),
      },
      exportCsv: {
        method: "GET",
        path: () => `/api/v1/orders/export`,
      },
    },
  },
}

// 実行
await dataProvider.action("orders", "approve", orderId);
await dataProvider.action("orders", "reject", orderId, { reason: "品質不良" });
await dataProvider.action("orders", "exportCsv");
```

## Complete Wiring Example

```typescript
import { createFirebaseAuthProvider } from "@specloom/auth-provider/firebase";
import { createHttpClient } from "@specloom/data-provider";
import { createRestDataProvider } from "@specloom/data-provider/rest";

// 1. テナント型
const Tenant = { ADMIN: "ADMIN", FARMER: "FARMER" } as const;
type Tenant = (typeof Tenant)[keyof typeof Tenant];

// 2. AuthProvider
const authProvider = createFirebaseAuthProvider<Tenant>({
  firebase: {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  },
  tenants: {
    tenantIds: {
      ADMIN: import.meta.env.VITE_TENANT_ADMIN,
      FARMER: import.meta.env.VITE_TENANT_FARMER,
    },
  },
});

// 3. HttpClient
const http = createHttpClient(authProvider, {
  baseUrl: import.meta.env.VITE_API_BASE_URL,
});

// 4. DataProvider
const dataProvider = createRestDataProvider(http, {
  apiPrefix: "/api/v1",
  resources: {
    users: {
      transformResponse: (raw: any) => ({
        id: raw.id,
        name: raw.display_name,
        email: raw.email,
        role: raw.user_role,
      }),
    },
    orders: {
      endpoint: "/api/v1/oyster-orders",
      transformResponse: (raw: any) => ({
        id: raw.id,
        customerId: raw.customer_id,
        status: raw.order_status,
        createdAt: new Date(raw.created_at),
      }),
      transformRequest: (data) => ({
        customer_id: data.customerId,
        order_status: data.status,
      }),
      actions: {
        approve: {
          method: "POST",
          path: (id) => `/api/v1/oyster-orders/${id}/approve`,
        },
        ship: {
          method: "POST",
          path: (id) => `/api/v1/oyster-orders/${id}/ship`,
          transformRequest: (data) => ({ tracking_number: data.trackingNumber }),
        },
      },
    },
  },
});

// 5. 使用
const identity = await authProvider.getIdentity();
const orders = await dataProvider.getList("orders", {
  pagination: { page: 1, perPage: 20 },
  sort: { field: "createdAt", order: "desc" },
  filter: { status: "pending" },
});
await dataProvider.action("orders", "approve", "order-123");
```

## SolidJS Integration

SolidJS の Context / Hook / Guard はアプリ側で実装する（@specloom パッケージには含まない）。

詳細なガイドは **[docs/guides/solid-integration.md](../../docs/guides/solid-integration.md)** を参照。

実装するファイル:

```
src/auth/
├── context.tsx        # createAuthContext<TTenant>() - 型付き Provider + Hook 生成
├── data-context.tsx   # DataContextProvider + useDataProvider
├── guard.tsx          # AuthGuard - ロールベースルートガード
├── setup.ts           # createOysterApp() - auth + http + data の組み立て
└── index.ts           # テナント定義 + re-export
```

主なパターン:
- `createAuthContext<TTenant>()` で型安全な AuthProvider/useAuth を生成
- `onAuthStateChanged` があれば Solid の signal にリアルタイム同期
- `AuthGuard` で `allowedRoles` によるルート保護
- `createResource` + `useDataProvider()` でデータ取得

## Checklist

Before completing provider setup:

- [ ] プロジェクト固有のテナント型を `as const` + type で定義
- [ ] Firebase config の値を環境変数から取得（ハードコードしない）
- [ ] `tenantIds` マッピングが全テナント分揃っている
- [ ] `createHttpClient` の `baseUrl` が正しい
- [ ] 各リソースの `transformResponse` / `transformRequest` で snake_case ↔ camelCase 変換
- [ ] カスタムアクションの `path` が API 仕様と一致
- [ ] `defaultFilter` / `defaultSort` を必要に応じて設定
- [ ] `transformListResponse` が API の一覧レスポンス形式に合っている
