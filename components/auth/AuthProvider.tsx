"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  getRedirectResult,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  signOut as firebaseSignOut,
  updateProfile,
  type User,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { mapAuthError } from "@/lib/auth-errors";
import { isMobileOrPwa } from "@/lib/utils";
import { useAppStore } from "@/store/app-store";

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const hydrate = useAppStore((s) => s.hydrate);
  const resetStore = useAppStore((s) => s.reset);

  useEffect(() => {
    let unsub = () => {};
    void (async () => {
      try {
        await getRedirectResult(auth);
      } catch {
        // ignore redirect errors here; login page can surface them
      }
      unsub = onAuthStateChanged(auth, (next) => {
        setUser(next);
        setLoading(false);
        if (next) {
          void hydrate(next.uid);
        } else {
          resetStore();
        }
      });
    })();
    return () => unsub();
  }, [hydrate, resetStore]);

  const signUp = useCallback(
    async (email: string, password: string, name: string) => {
      try {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        if (name.trim()) {
          await updateProfile(cred.user, { displayName: name.trim() });
        }
      } catch (e) {
        const code =
          e && typeof e === "object" && "code" in e
            ? String((e as { code: string }).code)
            : "";
        throw new Error(mapAuthError(code));
      }
    },
    [],
  );

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (e) {
      const code =
        e && typeof e === "object" && "code" in e
          ? String((e as { code: string }).code)
          : "";
      throw new Error(mapAuthError(code));
    }
  }, []);

  const signInWithGoogle = useCallback(async () => {
    const provider = new GoogleAuthProvider();
    try {
      if (isMobileOrPwa()) {
        await signInWithRedirect(auth, provider);
      } else {
        await signInWithPopup(auth, provider);
      }
    } catch (e) {
      const code =
        e && typeof e === "object" && "code" in e
          ? String((e as { code: string }).code)
          : "";
      throw new Error(mapAuthError(code));
    }
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (e) {
      const code =
        e && typeof e === "object" && "code" in e
          ? String((e as { code: string }).code)
          : "";
      throw new Error(mapAuthError(code));
    }
  }, []);

  const signOut = useCallback(async () => {
    await useAppStore.getState().flushNow();
    await firebaseSignOut(auth);
    resetStore();
  }, [resetStore]);

  const value = useMemo(
    () => ({
      user,
      loading,
      signUp,
      signIn,
      signInWithGoogle,
      resetPassword,
      signOut,
    }),
    [user, loading, signUp, signIn, signInWithGoogle, resetPassword, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
