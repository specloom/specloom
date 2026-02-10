# SolidJS Integration Guide

`@specloom/auth-provider` と `@specloom/data-provider` を SolidJS / SolidStart アプリに統合する方法。

## 概要

パッケージはフレームワーク非依存で設計されています。
SolidJS で使うには、アプリ側で以下の 3 つを実装します:

1. **AuthContext** - 認証状態を Solid の reactivity に接続
2. **DataContext** - DataProvider を Context 経由で供給
3. **AuthGuard** - ロールベースのルートガード

```
@specloom/auth-provider  <-  AuthContext (useAuth)
@specloom/data-provider  <-  DataContext (useDataProvider)
                              AuthGuard (ルート保護)
```

## 1. AuthContext

### 型付き Context の生成

`createAuthContext<TTenant>()` パターンで、プロジェクト固有のテナント型を伝播させます。

```typescript
// src/auth/context.tsx
import {
  createContext, useContext, createSignal, createEffect,
  onCleanup, type ParentComponent,
} from "solid-js";
import { useNavigate } from "@solidjs/router";
import type {
  AuthProvider, AuthIdentity, LoginParams, TenantType,
} from "@specloom/auth-provider";

interface AuthContextValue<TTenant extends TenantType> {
  identity:         () => AuthIdentity<TTenant> | null;
  isAuthenticated:  () => boolean;
  isLoading:        () => boolean;
  login:            (params: LoginParams<TTenant>) => Promise<void>;
  logout:           () => Promise<void>;
  getToken:         () => Promise<string | null>;
  checkPermissions: (roles: TTenant[]) => Promise<boolean>;
  provider:         AuthProvider<TTenant>;
}

interface Props<TTenant extends TenantType> {
  authProvider: AuthProvider<TTenant>;
  loginPath?: string;
}

export function createAuthContext<TTenant extends TenantType>() {
  const AuthContext = createContext<AuthContextValue<TTenant>>();

  const Provider: ParentComponent<Props<TTenant>> = (props) => {
    const [identity, setIdentity] = createSignal<AuthIdentity<TTenant> | null>(null);
    const [isLoading, setIsLoading] = createSignal(true);
    const navigate = useNavigate();

    createEffect(() => {
      if (props.authProvider.onAuthStateChanged) {
        // Firebase等: リアルタイム監視
        const unsub = props.authProvider.onAuthStateChanged((id) => {
          setIdentity(() => id);
          setIsLoading(false);
        });
        onCleanup(unsub);
      } else {
        // onAuthStateChanged 未実装のプロバイダー用フォールバック
        (async () => {
          try {
            await props.authProvider.checkAuth();
            const id = await props.authProvider.getIdentity();
            setIdentity(() => id);
          } catch {
            setIdentity(null);
          } finally {
            setIsLoading(false);
          }
        })();
      }
    });

    const value: AuthContextValue<TTenant> = {
      identity: identity as () => AuthIdentity<TTenant> | null,
      isAuthenticated: () => identity() !== null,
      isLoading,
      async login(params) {
        const id = await props.authProvider.login(params);
        setIdentity(() => id);
      },
      async logout() {
        await props.authProvider.logout();
        setIdentity(null);
        navigate(props.loginPath ?? "/login");
      },
      getToken: () => props.authProvider.getToken(),
      async checkPermissions(roles) {
        try {
          await props.authProvider.checkPermissions({ requiredRoles: roles });
          return true;
        } catch {
          return false;
        }
      },
      provider: props.authProvider,
    };

    return (
      <AuthContext.Provider value={value}>
        {props.children}
      </AuthContext.Provider>
    );
  };

  const useAuth = (): AuthContextValue<TTenant> => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthContext.Provider");
    return ctx;
  };

  return { Provider, useAuth };
}
```

### プロジェクトでの使用

```typescript
// src/auth/index.ts
import { createAuthContext } from "./context";

// プロジェクト固有のテナント型
export const OysterTenant = {
  ADMIN: "ADMIN",
  FARMER: "FARMER",
  CUSTOMER: "CUSTOMER",
} as const;
export type OysterTenant = (typeof OysterTenant)[keyof typeof OysterTenant];

// 型付き Provider と Hook を生成
export const {
  Provider: OysterAuthProvider,
  useAuth: useOysterAuth,
} = createAuthContext<OysterTenant>();
```

## 2. DataContext

DataProvider を Context 経由で配布するシンプルな Provider。

```typescript
// src/auth/data-context.tsx
import { createContext, useContext, type ParentComponent } from "solid-js";
import type { DataProvider } from "@specloom/data-provider";

const DataContext = createContext<DataProvider>();

export const DataContextProvider: ParentComponent<{ provider: DataProvider }> = (props) => (
  <DataContext.Provider value={props.provider}>
    {props.children}
  </DataContext.Provider>
);

export const useDataProvider = (): DataProvider => {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useDataProvider must be used within DataContextProvider");
  return ctx;
};
```

## 3. AuthGuard

ロールベースのルートガードコンポーネント。

```tsx
// src/auth/guard.tsx
import { Show, type ParentComponent, type JSX } from "solid-js";
import { useNavigate } from "@solidjs/router";
import type { TenantType } from "@specloom/auth-provider";

// useAuth は createAuthContext で生成したものを使う
import { useOysterAuth } from "./index";

interface AuthGuardProps {
  /** 許可するロール。省略時は認証済みなら全ロールOK */
  allowedRoles?: TenantType[];
  /** 未認証時のリダイレクト先 */
  loginPath?: string;
  /** 権限不足時のリダイレクト先 */
  forbiddenPath?: string;
  /** ローディング中の表示 */
  fallback?: () => JSX.Element;
}

export const AuthGuard: ParentComponent<AuthGuardProps> = (props) => {
  const { identity, isAuthenticated, isLoading } = useOysterAuth();
  const navigate = useNavigate();

  const hasAccess = () => {
    if (!isAuthenticated()) {
      navigate(props.loginPath ?? "/login");
      return false;
    }
    if (props.allowedRoles?.length) {
      const role = identity()?.tenantType;
      if (!role || !props.allowedRoles.includes(role)) {
        navigate(props.forbiddenPath ?? "/forbidden");
        return false;
      }
    }
    return true;
  };

  return (
    <Show when={!isLoading()} fallback={props.fallback?.() ?? <>Loading...</>}>
      <Show when={hasAccess()}>
        {props.children}
      </Show>
    </Show>
  );
};
```

## 4. 組み立て（setup）

すべてを組み立てるファクトリ関数。

```typescript
// src/auth/setup.ts
import { createFirebaseAuthProvider } from "@specloom/auth-provider/firebase";
import { createHttpClient } from "@specloom/data-provider";
import { createRestDataProvider } from "@specloom/data-provider/rest";
import type { OysterTenant } from "./index";

export function createOysterApp(env: {
  firebaseApiKey: string;
  firebaseAuthDomain: string;
  firebaseProjectId: string;
  tenantAdmin: string;
  tenantFarmer: string;
  tenantCustomer: string;
  apiUrl: string;
}) {
  const authProvider = createFirebaseAuthProvider<OysterTenant>({
    firebase: {
      apiKey: env.firebaseApiKey,
      authDomain: env.firebaseAuthDomain,
      projectId: env.firebaseProjectId,
    },
    tenants: {
      tenantIds: {
        ADMIN: env.tenantAdmin,
        FARMER: env.tenantFarmer,
        CUSTOMER: env.tenantCustomer,
      },
    },
  });

  const httpClient = createHttpClient(authProvider, { baseUrl: env.apiUrl });

  const dataProvider = createRestDataProvider(httpClient, {
    resources: {
      // リソースごとの設定をここに追加
    },
  });

  return { authProvider, httpClient, dataProvider };
}
```

## 5. アプリへの適用

```tsx
// src/app.tsx
import { Router, Route } from "@solidjs/router";
import { OysterAuthProvider } from "./auth";
import { DataContextProvider } from "./auth/data-context";
import { AuthGuard } from "./auth/guard";
import { createOysterApp } from "./auth/setup";

const { authProvider, dataProvider } = createOysterApp({
  firebaseApiKey:     import.meta.env.VITE_FIREBASE_API_KEY,
  firebaseAuthDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  firebaseProjectId:  import.meta.env.VITE_FIREBASE_PROJECT_ID,
  tenantAdmin:        import.meta.env.VITE_TENANT_ADMIN,
  tenantFarmer:       import.meta.env.VITE_TENANT_FARMER,
  tenantCustomer:     import.meta.env.VITE_TENANT_CUSTOMER,
  apiUrl:             import.meta.env.VITE_API_URL,
});

export default function App() {
  return (
    <OysterAuthProvider authProvider={authProvider}>
      <DataContextProvider provider={dataProvider}>
        <Router>
          {/* 公開ルート */}
          <Route path="/login" component={LoginPage} />

          {/* Admin専用 */}
          <Route path="/admin/*" component={() => (
            <AuthGuard allowedRoles={["ADMIN"]} loginPath="/login">
              <Route path="/orders" component={OrderList} />
              <Route path="/users" component={UserList} />
            </AuthGuard>
          )} />

          {/* 牡蠣業者専用 */}
          <Route path="/farmer/*" component={() => (
            <AuthGuard allowedRoles={["FARMER"]} loginPath="/login">
              <Route path="/dashboard" component={FarmerDashboard} />
            </AuthGuard>
          )} />
        </Router>
      </DataContextProvider>
    </OysterAuthProvider>
  );
}
```

## 6. ページでの使用

```tsx
// src/routes/admin/orders.tsx
import { createResource, For } from "solid-js";
import { useOysterAuth } from "~/auth";
import { useDataProvider } from "~/auth/data-context";

export default function OrderList() {
  const { identity, logout } = useOysterAuth();
  const dp = useDataProvider();

  const [orders] = createResource(() =>
    dp.getList("orders", {
      pagination: { page: 1, perPage: 20 },
      sort: { field: "createdAt", order: "desc" },
      filter: {},
    })
  );

  return (
    <div>
      <header>
        <span>{identity()?.email}</span>
        <span>Role: {identity()?.tenantType}</span>
        <button onClick={logout}>ログアウト</button>
      </header>

      <h1>受注一覧</h1>
      <For each={orders()?.data}>
        {(order) => <div>{order.id}: {order.status}</div>}
      </For>
    </div>
  );
}
```

## ファイル構成まとめ

アプリ側で実装するファイル:

```
src/auth/
├── context.tsx        # createAuthContext（型付き Provider + Hook 生成）
├── data-context.tsx   # DataContextProvider + useDataProvider
├── guard.tsx          # AuthGuard（ロールベースルートガード）
├── setup.ts           # 組み立てファクトリ関数
└── index.ts           # テナント定義 + re-export
```
