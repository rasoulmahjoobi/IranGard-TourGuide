export interface JwtUser {
  username: string;
  name: string;
  role: string;
  phone?: string;
}

export function decodeJwt(token: string): JwtUser {
  const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
  const json = decodeURIComponent(
    Array.from(atob(padded), (c) => `%${c.charCodeAt(0).toString(16).padStart(2, "0")}`).join(""),
  );
  return JSON.parse(json) as JwtUser;
}
