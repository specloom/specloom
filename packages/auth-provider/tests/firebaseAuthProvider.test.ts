import { beforeEach, describe, expect, it, vi } from "vitest";

const firebaseMocks = vi.hoisted(() => {
  const mockAuth = {
    currentUser: null as null | {
      uid: string;
      email: string | null;
      displayName: string | null;
      photoURL: string | null;
      emailVerified: boolean;
      tenantId?: string;
      getIdToken: () => Promise<string>;
      getIdTokenResult: () => Promise<{ claims: Record<string, unknown> }>;
    },
    tenantId: null as string | null,
  };

  const mockUser = {
    uid: "user-1",
    email: "alice@example.com",
    displayName: "Alice",
    photoURL: null,
    emailVerified: true,
    tenantId: "tenant-admin",
    getIdToken: vi.fn().mockResolvedValue("token-123"),
    getIdTokenResult: vi.fn().mockResolvedValue({
      claims: {
        email: "alice@example.com",
        role: "admin",
        featureFlag: true,
      },
    }),
  };

  return {
    mockAuth,
    mockUser,
    signInWithEmailAndPassword: vi.fn(async () => {
      mockAuth.currentUser = mockUser;
      return { user: mockUser };
    }),
    signInWithPopup: vi.fn(),
    signOut: vi.fn(async () => {
      mockAuth.currentUser = null;
    }),
    onAuthStateChanged: vi.fn((_auth, callback) => {
      callback(mockAuth.currentUser);
      return () => {};
    }),
  };
});

vi.mock("firebase/app", () => ({
  initializeApp: vi.fn(() => ({ name: "app" })),
}));

vi.mock("firebase/auth", () => ({
  getAuth: vi.fn(() => firebaseMocks.mockAuth),
  signInWithEmailAndPassword: firebaseMocks.signInWithEmailAndPassword,
  signInWithPopup: firebaseMocks.signInWithPopup,
  signOut: firebaseMocks.signOut,
  onAuthStateChanged: firebaseMocks.onAuthStateChanged,
  GoogleAuthProvider: class GoogleAuthProvider {},
}));

import { SignInMethod } from "../src/core/types.js";
import { createFirebaseAuthProvider } from "../src/providers/firebase/firebaseAuthProvider.js";

describe("createFirebaseAuthProvider", () => {
  beforeEach(() => {
    firebaseMocks.mockAuth.currentUser = null;
    firebaseMocks.mockAuth.tenantId = null;
    firebaseMocks.signInWithEmailAndPassword.mockClear();
    firebaseMocks.signInWithPopup.mockClear();
    firebaseMocks.signOut.mockClear();
    firebaseMocks.onAuthStateChanged.mockClear();
    firebaseMocks.mockUser.getIdToken.mockClear();
    firebaseMocks.mockUser.getIdTokenResult.mockClear();
  });

  it("maps a Firebase user into the configured tenant identity", async () => {
    const provider = createFirebaseAuthProvider({
      firebase: {
        apiKey: "key",
        authDomain: "example.firebaseapp.com",
        projectId: "demo",
      },
      tenants: {
        tenantIds: {
          admin: "tenant-admin",
          staff: "tenant-staff",
        },
      },
    });

    const identity = await provider.login({
      tenant: "admin",
      method: SignInMethod.EMAIL_PASSWORD,
      email: "alice@example.com",
      password: "secret",
    });

    expect(firebaseMocks.mockAuth.tenantId).toBe("tenant-admin");
    expect(firebaseMocks.signInWithEmailAndPassword).toHaveBeenCalledWith(
      firebaseMocks.mockAuth,
      "alice@example.com",
      "secret",
    );
    expect(identity).toEqual({
      uid: "user-1",
      email: "alice@example.com",
      displayName: "Alice",
      photoURL: null,
      tenantId: "tenant-admin",
      tenantType: "admin",
      emailVerified: true,
      customClaims: {
        role: "admin",
        featureFlag: true,
      },
    });
  });

  it("signs out and rethrows auth errors for unauthorized responses", async () => {
    const provider = createFirebaseAuthProvider({
      firebase: {
        apiKey: "key",
        authDomain: "example.firebaseapp.com",
        projectId: "demo",
      },
      tenants: {
        tenantIds: {
          admin: "tenant-admin",
        },
      },
    });

    await expect(
      provider.checkError({ message: "expired", status: 401 }),
    ).rejects.toEqual({
      message: "expired",
      status: 401,
    });

    expect(firebaseMocks.signOut).toHaveBeenCalledWith(firebaseMocks.mockAuth);
  });
});
