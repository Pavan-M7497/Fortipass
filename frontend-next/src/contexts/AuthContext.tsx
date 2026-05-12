"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  masterKey: CryptoKey | null; // The derived AES key stored IN MEMORY ONLY
  setMasterKey: (key: CryptoKey | null) => void;
  isVaultLocked: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  masterKey: null,
  setMasterKey: () => {},
  isVaultLocked: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [masterKey, setMasterKey] = useState<CryptoKey | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
      // On sign out or session expiration, clear the memory-stored master key to lock the vault
      if (!firebaseUser) {
        setMasterKey(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        masterKey,
        setMasterKey,
        isVaultLocked: !masterKey,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
