import { SignJWT, jwtVerify } from "jose";

const getKey = () =>
  new TextEncoder().encode(process.env.SESSION_SECRET ?? "fallback-dev-secret-change-in-production");

export async function encrypt(payload: Record<string, unknown>) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(await getKey());
}

export async function decrypt(token: string | undefined = "") {
  try {
    const { payload } = await jwtVerify(token, await getKey(), {
      algorithms: ["HS256"],
    });
    return payload;
  } catch {
    return null;
  }
}
