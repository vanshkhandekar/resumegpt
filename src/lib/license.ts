type LicenseSecrets = {
  version: string;
  secret: string;
};

const SECRETS_KEY = "arb_license_secrets";
const PREMIUM_UNTIL_KEY = "arb_premium_until";

function base64UrlEncode(input: ArrayBuffer) {
  const bytes = new Uint8Array(input);
  let str = "";
  for (const b of bytes) str += String.fromCharCode(b);
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

async function hmacSha256(secret: string, message: string) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
  return crypto.subtle.sign("HMAC", key, enc.encode(message));
}

export function getLicenseSecrets(): LicenseSecrets {
  const raw = localStorage.getItem(SECRETS_KEY);
  if (raw) {
    try {
      const parsed = JSON.parse(raw) as LicenseSecrets;
      if (parsed?.version && parsed?.secret) return parsed;
    } catch {
      // ignore
    }
  }
  // Default demo secret (admin can rotate in Admin panel)
  const initial = { version: "V1", secret: "DEMO_SECRET_CHANGE_IN_ADMIN" };
  localStorage.setItem(SECRETS_KEY, JSON.stringify(initial));
  return initial;
}

export function setLicenseSecrets(next: LicenseSecrets) {
  localStorage.setItem(SECRETS_KEY, JSON.stringify(next));
}

export function getPremiumUntil(): number {
  const raw = localStorage.getItem(PREMIUM_UNTIL_KEY);
  const ts = raw ? Number(raw) : 0;
  return Number.isFinite(ts) ? ts : 0;
}

export function setPremiumUntil(untilEpochMs: number) {
  localStorage.setItem(PREMIUM_UNTIL_KEY, String(untilEpochMs));
}

export function isPremiumActive(): boolean {
  return Date.now() < getPremiumUntil();
}

// Key format: {version}.{expiryEpochMs}.{signatureB64Url}
export async function generateLicenseKey(expiryEpochMs: number, secrets = getLicenseSecrets()) {
  const payload = `${secrets.version}.${expiryEpochMs}`;
  const sig = await hmacSha256(secrets.secret, payload);
  return `${payload}.${base64UrlEncode(sig)}`;
}

export async function validateAndActivateLicenseKey(key: string) {
  const parts = key.trim().split(".");
  if (parts.length !== 3) return { ok: false as const, message: "Invalid key format" };

  const [version, expiryRaw, signature] = parts;
  const expiryEpochMs = Number(expiryRaw);
  if (!Number.isFinite(expiryEpochMs) || expiryEpochMs <= 0) return { ok: false as const, message: "Invalid expiry" };
  if (Date.now() > expiryEpochMs) return { ok: false as const, message: "License key expired" };

  const secrets = getLicenseSecrets();
  if (version !== secrets.version) {
    return { ok: false as const, message: `Key version mismatch (expected ${secrets.version})` };
  }

  const payload = `${version}.${expiryEpochMs}`;
  const expectedSig = await hmacSha256(secrets.secret, payload);
  const expected = base64UrlEncode(expectedSig);
  if (signature !== expected) return { ok: false as const, message: "Invalid signature" };

  setPremiumUntil(expiryEpochMs);
  return { ok: true as const, message: "Premium activated" };
}
