const USER_TOKEN_KEY = "user_token";
const USER_ID_KEY = "user_id";

export function getStoredToken(): string | null {
  return localStorage.getItem(USER_TOKEN_KEY);
}

export function getStoredUserId(): string | null {
  return localStorage.getItem(USER_ID_KEY);
}

export function setStoredUser(token: string, id: number): void {
  localStorage.setItem(USER_TOKEN_KEY, token);
  localStorage.setItem(USER_ID_KEY, String(id));
}

export function clearStoredUser(): void {
  localStorage.removeItem(USER_TOKEN_KEY);
  localStorage.removeItem(USER_ID_KEY);
}

export function useLocalUser(): {
  token: string | null;
  userId: string | null;
  setUser: (token: string, id: number) => void;
  clearUser: () => void;
} {
  return {
    token: getStoredToken(),
    userId: getStoredUserId(),
    setUser: setStoredUser,
    clearUser: clearStoredUser,
  };
}
