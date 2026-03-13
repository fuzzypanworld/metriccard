"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import type { User } from "firebase/auth";
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, signOut as firebaseSignOut } from "firebase/auth";
import { auth } from "./firebase";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  authReady: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      setAuthReady(true);
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
      setAuthReady(true);
    });
    return () => unsubscribe();
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    if (!auth) throw new Error("Firebase Auth not configured");
    await signInWithEmailAndPassword(auth, email, password);
  }, []);

  const signUp = useCallback(async (email: string, password: string) => {
    if (!auth) throw new Error("Firebase Auth not configured");
    await createUserWithEmailAndPassword(auth, email, password);
  }, []);

  const signInWithGoogle = useCallback(async () => {
    if (!auth) throw new Error("Firebase Auth not configured");
    await signInWithPopup(auth, new GoogleAuthProvider());
  }, []);

  const signOut = useCallback(async () => {
    if (!auth) return;
    await firebaseSignOut(auth);
  }, []);

  const value: AuthContextValue = {
    user,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
    authReady,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
