import {
  createHmac,
  pbkdf2 as pbkdf2Callback,
  timingSafeEqual,
} from "node:crypto";
import { promisify } from "node:util";
import { cookies } from "next/headers";

const pbkdf2 = promisify(pbkdf2Callback);
const SESSION_COOKIE = "silicatechem_admin_session";
const SESSION_DURATION_SECONDS = 60 * 60 * 24 * 7;

type AdminSession = {
  username: string;
  expiresAt: number;
};

function sessionSecret(): string | null {
  return process.env.ADMIN_SESSION_SECRET ?? null;
}

function sign(payload: string, secret: string): string {
  return createHmac("sha256", secret).update(payload).digest("base64url");
}

function encodeSession(session: AdminSession, secret: string): string {
  const payload = Buffer.from(JSON.stringify(session)).toString("base64url");
  return `${payload}.${sign(payload, secret)}`;
}

function decodeSession(token: string, secret: string): AdminSession | null {
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;

  const expected = Buffer.from(sign(payload, secret));
  const received = Buffer.from(signature);
  if (expected.length !== received.length || !timingSafeEqual(expected, received)) {
    return null;
  }

  try {
    const parsed = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf8")
    ) as AdminSession;
    if (!parsed.username || parsed.expiresAt <= Date.now()) return null;
    return parsed;
  } catch {
    return null;
  }
}

async function verifyPassword(password: string, encodedHash: string): Promise<boolean> {
  const [algorithm, iterationsValue, salt, expectedHash] = encodedHash.split("$");
  const iterations = Number(iterationsValue);
  if (
    algorithm !== "pbkdf2-sha256" ||
    !Number.isInteger(iterations) ||
    iterations < 100_000 ||
    !salt ||
    !expectedHash
  ) {
    return false;
  }

  const derived = await pbkdf2(password, salt, iterations, 32, "sha256");
  const expected = Buffer.from(expectedHash, "base64url");
  return expected.length === derived.length && timingSafeEqual(expected, derived);
}

export async function authenticateAdmin(
  username: string,
  password: string
): Promise<boolean> {
  const configuredUsername = process.env.ADMIN_USERNAME;
  const passwordHash = process.env.ADMIN_PASSWORD_HASH;
  if (!configuredUsername || !passwordHash) return false;
  if (username.trim().toLowerCase() !== configuredUsername.trim().toLowerCase()) {
    return false;
  }
  return verifyPassword(password, passwordHash);
}

export async function createAdminSession(username: string): Promise<void> {
  const secret = sessionSecret();
  if (!secret) throw new Error("ADMIN_SESSION_SECRET is not configured");

  const expiresAt = Date.now() + SESSION_DURATION_SECONDS * 1_000;
  const token = encodeSession({ username, expiresAt }, secret);
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: SESSION_DURATION_SECONDS,
  });
}

export async function clearAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function getAdminSession(): Promise<AdminSession | null> {
  const secret = sessionSecret();
  if (!secret) return null;
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  return token ? decodeSession(token, secret) : null;
}
