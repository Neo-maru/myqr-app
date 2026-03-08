const USER_TOKEN_KEY = "user_token";
const USER_ID_KEY = "user_id";
const USER_QR_ID_KEY = "user_qr_id";

export function getStoredToken(): string | null {
  return localStorage.getItem(USER_TOKEN_KEY);
}

export function getStoredUserId(): string | null {
  return localStorage.getItem(USER_ID_KEY);
}

export function getStoredQrId(): string | null {
  return localStorage.getItem(USER_QR_ID_KEY);
}

export function setStoredUser(
  token: string,
  id: number,
  qrId?: string | null,
): void {
  localStorage.setItem(USER_TOKEN_KEY, token);
  localStorage.setItem(USER_ID_KEY, String(id));
  if (qrId != null && qrId !== "") {
    localStorage.setItem(USER_QR_ID_KEY, qrId);
  }
}

export function clearStoredUser(): void {
  localStorage.removeItem(USER_TOKEN_KEY);
  localStorage.removeItem(USER_ID_KEY);
  localStorage.removeItem(USER_QR_ID_KEY);
}

export function useLocalUser(): {
  token: string | null;
  userId: string | null;
  qrId: string | null;
  setUser: (token: string, id: number, qrId?: string | null) => void;
  clearUser: () => void;
} {
  return {
    token: getStoredToken(),
    userId: getStoredUserId(),
    qrId: getStoredQrId(),
    setUser: setStoredUser,
    clearUser: clearStoredUser,
  };
}
