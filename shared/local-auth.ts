// Local, browser-only auth stored in localStorage.
// Not secure for production—intended for rapid prototyping.

export type LocalUser = {
  id: string;
  email: string;
  passwordHash: string;
  createdAt: string;
};

export type LocalAuthResponse = {
  token: string;
  user: { id: string; email: string };
};

const USERS_KEY = "auth_users";
const TOKEN_PREFIX = "local";

function getUsers(): LocalUser[] {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? (JSON.parse(raw) as LocalUser[]) : [];
  } catch {
    return [];
  }
}

function saveUsers(users: LocalUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function toBase64(buf: ArrayBuffer) {
  const bytes = new Uint8Array(buf);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
  // btoa might throw on unicode; bytes are safe
  return btoa(binary);
}

export async function hashPassword(password: string): Promise<string> {
  if (typeof window !== "undefined" && window.crypto?.subtle) {
    const enc = new TextEncoder();
    const data = enc.encode(password);
    const digest = await window.crypto.subtle.digest({ name: "SHA-256" }, data);
    return toBase64(digest);
  }
  // Fallback non-crypto hash (weak), but avoids runtime failure in unsupported envs
  let h = 0;
  for (let i = 0; i < password.length; i++) {
    h = (h << 5) - h + password.charCodeAt(i);
    h |= 0;
  }
  return String(h);
}

function randomId() {
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    const arr = new Uint8Array(16);
    crypto.getRandomValues(arr);
    return Array.from(arr, (b) => b.toString(16).padStart(2, "0")).join("");
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function createToken(userId: string) {
  const part = randomId();
  return `${TOKEN_PREFIX}.${userId}.${part}`;
}

export async function registerLocalUser(email: string, password: string): Promise<LocalAuthResponse> {
  const e = normalizeEmail(email);
  const users = getUsers();
  if (users.find((u) => u.email === e)) {
    throw new Error("An account with this email already exists.");
  }
  const passwordHash = await hashPassword(password);
  const user: LocalUser = {
    id: randomId(),
    email: e,
    passwordHash,
    createdAt: new Date().toISOString(),
  };
  users.push(user);
  saveUsers(users);
  const token = createToken(user.id);
  return { token, user: { id: user.id, email: user.email } };
}

export async function loginLocalUser(email: string, password: string): Promise<LocalAuthResponse> {
  const e = normalizeEmail(email);
  const users = getUsers();
  const user = users.find((u) => u.email === e);
  if (!user) throw new Error("Invalid credentials");
  const hash = await hashPassword(password);
  if (hash !== user.passwordHash) throw new Error("Invalid credentials");
  const token = createToken(user.id);
  return { token, user: { id: user.id, email: user.email } };
}

export function getCurrentLocalUser(): { id: string; email: string } | null {
  try {
    const email = localStorage.getItem("auth_email");
    const users = getUsers();
    if (!email) return null;
    const user = users.find((u) => u.email === email);
    return user ? { id: user.id, email: user.email } : null;
  } catch {
    return null;
  }
}
