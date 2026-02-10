import type {
  TenantType,
  AuthIdentity,
  LoginParams,
  CheckAuthParams,
  CheckPermissionsParams,
  AuthError,
} from "./types.js";

export interface AuthProvider<TTenant extends TenantType = TenantType> {
  login(params: LoginParams<TTenant>): Promise<AuthIdentity<TTenant>>;
  logout(): Promise<void>;
  checkAuth(params?: CheckAuthParams): Promise<void>;
  checkError(error: AuthError): Promise<void>;
  getIdentity(): Promise<AuthIdentity<TTenant> | null>;
  getToken(): Promise<string | null>;
  checkPermissions(params: CheckPermissionsParams<TTenant>): Promise<void>;
  getPermissions(): Promise<TTenant | null>;
  onAuthStateChanged?(
    callback: (identity: AuthIdentity<TTenant> | null) => void,
  ): () => void;
}
