import { createCipheriv, createDecipheriv, createHash, randomBytes } from "node:crypto";

export const PRESALE_PASSWORD_MIN = 8;

export function assertPresalePassword(password: string, confirmPassword: string) {
  if (password.length < PRESALE_PASSWORD_MIN) return "PASSWORD_SHORT" as const;
  if (password !== confirmPassword) return "PASSWORD_MISMATCH" as const;
  return null;
}

export function passwordKeyFromSecret(secret: string) {
  return createHash("sha256").update(secret).digest();
}

export function sealPassword(password: string, key: Buffer) {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key, iv);
  const encrypted = Buffer.concat([cipher.update(password, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, encrypted]).toString("base64");
}

export function unsealPassword(payload: string, key: Buffer) {
  const buffer = Buffer.from(payload, "base64");
  if (buffer.length < 29) throw new Error("invalid sealed password");
  const iv = buffer.subarray(0, 12);
  const tag = buffer.subarray(12, 28);
  const encrypted = buffer.subarray(28);
  const decipher = createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(encrypted), decipher.final()]).toString("utf8");
}
