export type TenantType = string;

export const SignInMethod = {
  EMAIL_PASSWORD: "EMAIL_PASSWORD",
  GOOGLE: "GOOGLE",
  LINE: "LINE",
  APPLE: "APPLE",
  OIDC: "OIDC",
} as const;

export type SignInMethod = (typeof SignInMethod)[keyof typeof SignInMethod];

export interface AuthIdentity<TTenant extends TenantType = TenantType> {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  tenantId: string;
  tenantType: TTenant;
  emailVerified: boolean;
  customClaims?: Record<string, unknown>;
}

export interface LoginParams<TTenant extends TenantType = TenantType> {
  tenant: TTenant;
  method: SignInMethod;
  email?: string;
  password?: string;
}

export interface AuthError {
  message: string;
  code?: string;
  status?: number;
}

export interface CheckAuthParams {
  route?: string;
}

export interface CheckPermissionsParams<
  TTenant extends TenantType = TenantType,
> {
  action?: string;
  resource?: string;
  requiredRoles?: TTenant[];
}

export interface TenantConfig<TTenant extends TenantType = TenantType> {
  tenantIds: Record<TTenant, string>;
  loginRedirects?: Record<TTenant, string>;
}

export interface FirebaseProviderConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
}
