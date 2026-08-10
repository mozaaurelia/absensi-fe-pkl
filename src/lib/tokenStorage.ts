const TOKEN_KEY = "sams_token";
const COOKIE_MAX_AGE = 7 * 24 * 60 * 60; // 7 hari (kalau "remember me" dicentang)

export function getToken(): string | null {
  if (typeof window === "undefined") return null;

  const cookie = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${TOKEN_KEY}=`));
  if (cookie) {
    return decodeURIComponent(cookie.split("=").slice(1).join("="));
  }

  return sessionStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string, remember: boolean) {
  if (typeof window === "undefined") return;

  if (remember) {
    document.cookie = `${TOKEN_KEY}=${encodeURIComponent(
      token,
    )}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
  } else {
    sessionStorage.setItem(TOKEN_KEY, token);
  }
}

export function removeToken() {
  if (typeof window === "undefined") return;

  document.cookie = `${TOKEN_KEY}=; path=/; max-age=0; SameSite=Lax`;
  sessionStorage.removeItem(TOKEN_KEY);
}
