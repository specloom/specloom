import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged as firebaseOnAuthStateChanged,
  GoogleAuthProvider,
  type Auth,
  type User,
} from "firebase/auth";
import type { AuthProvider } from "../../core/authProvider.js";
import type {
  TenantType,
  AuthIdentity,
  LoginParams,
  CheckPermissionsParams,
  AuthError,
  TenantConfig,
  FirebaseProviderConfig,
} from "../../core/types.js";
import { SignInMethod } from "../../core/types.js";

export interface FirebaseAuthProviderOptions<TTenant extends TenantType> {
  firebase: FirebaseProviderConfig;
  tenants: TenantConfig<TTenant>;
}

export function createFirebaseAuthProvider<TTenant extends TenantType>(
  options: FirebaseAuthProviderOptions<TTenant>,
): AuthProvider<TTenant> {
  const app = initializeApp(options.firebase);
  const auth: Auth = getAuth(app);

  const tenantIdToType = new Map<string, TTenant>(
    (Object.entries(options.tenants.tenantIds) as [TTenant, string][]).map(
      ([type, id]) => [id, type],
    ),
  );

  function waitForUser(): Promise<User | null> {
    return new Promise((resolve) => {
      const unsub = firebaseOnAuthStateChanged(auth, (user) => {
        unsub();
        resolve(user);
      });
    });
  }

  async function toIdentity(user: User): Promise<AuthIdentity<TTenant>> {
    const tenantId =
      (user as unknown as { tenantId?: string }).tenantId ||
      auth.tenantId ||
      "";
    const tenantType = tenantIdToType.get(tenantId);
    if (!tenantType) {
      throw { message: `Unknown tenant: ${tenantId}`, code: "UNKNOWN_TENANT" };
    }

    // カスタムクレームを取得
    const tokenResult = await user.getIdTokenResult();
    const customClaims: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(tokenResult.claims)) {
      // Firebase標準クレームを除外し、カスタムクレームのみ抽出
      if (
        ![
          "iss",
          "aud",
          "auth_time",
          "user_id",
          "sub",
          "iat",
          "exp",
          "email",
          "email_verified",
          "firebase",
          "name",
          "picture",
        ].includes(key)
      ) {
        customClaims[key] = value;
      }
    }

    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      tenantId,
      tenantType,
      emailVerified: user.emailVerified,
      ...(Object.keys(customClaims).length > 0 ? { customClaims } : {}),
    };
  }

  const provider: AuthProvider<TTenant> = {
    async login(params: LoginParams<TTenant>) {
      const tenantId = options.tenants.tenantIds[params.tenant];
      if (!tenantId) throw { message: `Invalid tenant: ${params.tenant}` };
      auth.tenantId = tenantId;

      switch (params.method) {
        case SignInMethod.EMAIL_PASSWORD: {
          if (!params.email || !params.password)
            throw { message: "Email and password required" };
          const cred = await signInWithEmailAndPassword(
            auth,
            params.email,
            params.password,
          );
          return await toIdentity(cred.user);
        }
        case SignInMethod.GOOGLE: {
          const cred = await signInWithPopup(auth, new GoogleAuthProvider());
          return await toIdentity(cred.user);
        }
        default:
          throw { message: `Unsupported method: ${params.method}` };
      }
    },

    async logout() {
      await signOut(auth);
    },

    async checkAuth() {
      const user = auth.currentUser ?? (await waitForUser());
      if (!user) throw { message: "Not authenticated", status: 401 };
    },

    async checkError(error: AuthError) {
      if (error.status === 401 || error.status === 403) {
        await signOut(auth);
        throw error;
      }
    },

    async getIdentity() {
      const user = auth.currentUser ?? (await waitForUser());
      return user ? toIdentity(user) : null;
    },

    async getToken() {
      const user = auth.currentUser ?? (await waitForUser());
      return user ? user.getIdToken() : null;
    },

    async checkPermissions(params: CheckPermissionsParams<TTenant>) {
      const identity = await provider.getIdentity();
      if (!identity) throw { message: "Not authenticated", status: 401 };
      if (
        params.requiredRoles?.length &&
        !params.requiredRoles.includes(identity.tenantType)
      ) {
        throw { message: `Forbidden: ${identity.tenantType}`, status: 403 };
      }
    },

    async getPermissions() {
      return (await provider.getIdentity())?.tenantType ?? null;
    },

    onAuthStateChanged(callback) {
      return firebaseOnAuthStateChanged(auth, (user) => {
        if (user) {
          toIdentity(user).then(
            (identity) => callback(identity),
            (err) => {
              console.error("[auth] onAuthStateChanged toIdentity failed:", err);
              callback(null);
            },
          );
        } else {
          callback(null);
        }
      });
    },
  };

  return provider;
}
