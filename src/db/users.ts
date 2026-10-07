// User Management for Cloud SQL / PostgreSQL & Auth Sync

export interface DbUser {
  id: string;
  uid: string;
  email: string;
  displayName: string | null;
  photoUrl: string | null;
  role: string;
  company: string;
  mfaEnabled: boolean;
  createdAt: string;
  lastLoginAt: string;
}

// In-memory data store with default seed users
const usersStore: Map<string, DbUser> = new Map([
  [
    "usr-yan-aung-001",
    {
      id: "usr-yan-aung-001",
      uid: "usr-yan-aung-001",
      email: "yan.aung@gmail.com",
      displayName: "Yan Aung (Compliance Officer)",
      photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
      role: "Compliance Lead",
      company: "Onyx Enterprise AI",
      mfaEnabled: true,
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
    },
  ],
  [
    "usr-ciso-002",
    {
      id: "usr-ciso-002",
      uid: "usr-ciso-002",
      email: "ciso@onyx-ai.security",
      displayName: "Elena Rostova",
      photoUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80",
      role: "Chief Information Security Officer (CISO)",
      company: "Onyx Enterprise AI",
      mfaEnabled: true,
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
    },
  ],
  [
    "usr-auditor-003",
    {
      id: "usr-auditor-003",
      uid: "usr-auditor-003",
      email: "auditor@deloitte-external.com",
      displayName: "Marcus Vance (BSI Lead Auditor)",
      photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
      role: "External ISO 42001 / SOC 2 Auditor",
      company: "Deloitte / BSI Assurance",
      mfaEnabled: true,
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
    },
  ],
  [
    "usr-dev-004",
    {
      id: "usr-dev-004",
      uid: "usr-dev-004",
      email: "alex.chen@onyx-ai.internal",
      displayName: "Alex Chen (Staff MLOps Architect)",
      photoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80",
      role: "AI/ML Engineer & Data Custodian",
      company: "Onyx Enterprise AI",
      mfaEnabled: false,
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
    },
  ],
]);

export async function getOrCreateUser(profile: {
  uid: string;
  email: string;
  displayName?: string | null;
  photoUrl?: string | null;
  role?: string;
  company?: string;
}): Promise<DbUser> {
  const existing = usersStore.get(profile.uid);
  if (existing) {
    existing.lastLoginAt = new Date().toISOString();
    if (profile.displayName) existing.displayName = profile.displayName;
    if (profile.photoUrl) existing.photoUrl = profile.photoUrl;
    return existing;
  }

  const newUser: DbUser = {
    id: profile.uid,
    uid: profile.uid,
    email: profile.email,
    displayName: profile.displayName || "Compliance Officer",
    photoUrl: profile.photoUrl || null,
    role: profile.role || "Compliance Lead",
    company: profile.company || "Onyx Enterprise AI",
    mfaEnabled: true,
    createdAt: new Date().toISOString(),
    lastLoginAt: new Date().toISOString(),
  };

  usersStore.set(profile.uid, newUser);
  return newUser;
}

export async function getUserByUid(uid: string): Promise<DbUser | null> {
  return usersStore.get(uid) || null;
}

export async function getAllUsers(): Promise<DbUser[]> {
  return Array.from(usersStore.values());
}

export async function updateUserRole(uid: string, role: string): Promise<DbUser | null> {
  const user = usersStore.get(uid);
  if (user) {
    user.role = role;
    return user;
  }
  return null;
}
