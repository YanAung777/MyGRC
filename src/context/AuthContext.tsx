// React Authentication & SSO Context
import React, { createContext, useContext, useState, useEffect } from "react";
import { auth, FirebaseUser } from "../firebase";

export interface AuthUserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoUrl: string;
  role: string;
  company: string;
  provider: "google" | "saml" | "oidc" | "password" | "demo";
  mfaEnabled: boolean;
  token?: string;
}

interface AuthContextType {
  user: AuthUserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithSSO: (providerName: string, corporateEmail?: string) => Promise<void>;
  signInAsDemoPersona: (persona: {
    name: string;
    email: string;
    role: string;
    company?: string;
    photoUrl?: string;
  }) => Promise<void>;
  signOut: () => Promise<void>;
  updateRole: (newRole: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUserProfile | null>({
    uid: "usr-yan-aung-001",
    email: "yan.aung@gmail.com",
    displayName: "Yan Aung (Compliance Officer)",
    photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
    role: "Compliance Lead",
    company: "Onyx Enterprise AI",
    provider: "google",
    mfaEnabled: true,
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    // Check with server on mount with resilient error fallback
    const fetchUserProfile = async () => {
      try {
        const res = await fetch("/api/auth/me", {
          headers: {
            "Accept": "application/json",
          },
        });
        if (res.ok) {
          const contentType = res.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            const data = await res.json();
            if (data && data.user) {
              setUser({
                uid: data.user.uid || "usr-yan-aung-001",
                email: data.user.email || "yan.aung@gmail.com",
                displayName: data.user.displayName || "Yan Aung",
                photoUrl: data.user.photoUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
                role: data.user.role || "Compliance Lead",
                company: data.user.company || "Onyx Enterprise AI",
                provider: "google",
                mfaEnabled: true,
              });
            }
          }
        }
      } catch (err) {
        // Graceful fallback to default in-memory user profile
      }
    };

    fetchUserProfile();
  }, []);

  const signInWithGoogle = async () => {
    setIsLoading(true);
    try {
      const fbUser = await auth.signInWithPopup("Google Workspace");
      setUser({
        uid: fbUser.uid,
        email: fbUser.email || "yan.aung@gmail.com",
        displayName: fbUser.displayName || "Yan Aung (Google SSO)",
        photoUrl: fbUser.photoURL || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
        role: "Compliance Lead",
        company: "Onyx Enterprise AI",
        provider: "google",
        mfaEnabled: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithSSO = async (providerName: string, corporateEmail?: string) => {
    setIsLoading(true);
    try {
      const email = corporateEmail || "yan.aung@gmail.com";
      const fbUser = await auth.signInWithPopup(providerName);
      setUser({
        uid: fbUser.uid,
        email: email,
        displayName: `Yan Aung (${providerName})`,
        photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
        role: "Chief Information Security Officer (CISO)",
        company: "Onyx Enterprise AI",
        provider: "saml",
        mfaEnabled: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const signInAsDemoPersona = async (persona: {
    name: string;
    email: string;
    role: string;
    company?: string;
    photoUrl?: string;
  }) => {
    setIsLoading(true);
    try {
      const fbUser = await auth.signInWithCustomUser({
        email: persona.email,
        displayName: persona.name,
        role: persona.role,
        photoURL: persona.photoUrl,
      });
      setUser({
        uid: fbUser.uid,
        email: persona.email,
        displayName: persona.name,
        photoUrl: persona.photoUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
        role: persona.role,
        company: persona.company || "Onyx Enterprise AI",
        provider: "demo",
        mfaEnabled: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    try {
      await auth.signOut();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const updateRole = (newRole: string) => {
    if (user) {
      setUser({ ...user, role: newRole });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        signInWithGoogle,
        signInWithSSO,
        signInAsDemoPersona,
        signOut,
        updateRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
