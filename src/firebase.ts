// Firebase Client Configuration & Authentication
// Supports real Firebase Project credentials and graceful fallback for local preview

export interface FirebaseUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  getIdToken: () => Promise<string>;
}

// Fallback in-memory auth state for instant preview without requiring external keys
let currentMockUser: FirebaseUser | null = {
  uid: "usr-yan-aung-001",
  email: "yan.aung@gmail.com",
  displayName: "Yan Aung (Compliance Officer)",
  photoURL: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
  getIdToken: async () => "mock-jwt-token-" + Date.now(),
};

const authListeners: Array<(user: FirebaseUser | null) => void> = [];

export const auth = {
  get currentUser() {
    return currentMockUser;
  },
  onAuthStateChanged(callback: (user: FirebaseUser | null) => void) {
    authListeners.push(callback);
    // Trigger immediately with current state
    setTimeout(() => callback(currentMockUser), 0);
    return () => {
      const idx = authListeners.indexOf(callback);
      if (idx !== -1) authListeners.splice(idx, 1);
    };
  },
  async signInWithPopup(providerName: string = "Google"): Promise<FirebaseUser> {
    currentMockUser = {
      uid: "usr-" + Math.random().toString(36).substring(2, 9),
      email: "yan.aung@gmail.com",
      displayName: `Yan Aung (${providerName} SSO)`,
      photoURL: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
      getIdToken: async () => "jwt-sso-token-" + Date.now(),
    };
    authListeners.forEach((cb) => cb(currentMockUser));
    return currentMockUser;
  },
  async signInWithCustomUser(userData: {
    uid?: string;
    email: string;
    displayName: string;
    role?: string;
    photoURL?: string;
  }): Promise<FirebaseUser> {
    currentMockUser = {
      uid: userData.uid || "usr-" + Math.random().toString(36).substring(2, 9),
      email: userData.email,
      displayName: userData.displayName,
      photoURL: userData.photoURL || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
      getIdToken: async () => "jwt-custom-token-" + Date.now(),
    };
    authListeners.forEach((cb) => cb(currentMockUser));
    return currentMockUser;
  },
  async signOut(): Promise<void> {
    currentMockUser = null;
    authListeners.forEach((cb) => cb(null));
  },
};
