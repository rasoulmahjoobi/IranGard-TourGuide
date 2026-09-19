import Cookies from "js-cookie";

const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";

export function setAuthCookies(accessToken: string, refreshToken: string) {
  Cookies.set(ACCESS_TOKEN_KEY, accessToken, { expires: 1 / 24, path: "/" }); // ۱ ساعت
  Cookies.set(REFRESH_TOKEN_KEY, refreshToken, { expires: 1, path: "/" }); // ۱ روز
}

export function updateAccessTokenCookie(accessToken: string) {
  Cookies.set(ACCESS_TOKEN_KEY, accessToken, { expires: 1 / 24, path: "/" });
}

export function clearAuthCookies() {
  Cookies.remove(ACCESS_TOKEN_KEY, { path: "/" });
  Cookies.remove(REFRESH_TOKEN_KEY, { path: "/" });
}

export function getAccessTokenCookie(): string | undefined {
  return Cookies.get(ACCESS_TOKEN_KEY);
}

export function getRefreshTokenCookie(): string | undefined {
  return Cookies.get(REFRESH_TOKEN_KEY);
}