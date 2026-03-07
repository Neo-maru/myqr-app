import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
import { getUser } from "../api/mock";
import { PageWrapper } from "../components/layout/PageWrapper";
import { AppHeader } from "../components/layout/AppHeader";
import { SecondaryButton, GhostButton } from "../components/ui/Button";
import { getStoredToken, getStoredUserId } from "../hooks/useLocalUser";

const baseUrl = import.meta.env.VITE_API_BASE_URL || "";

export function QRDisplay() {
  const navigate = useNavigate();
  const token = getStoredToken();
  const userId = getStoredUserId();
  const [user, setUser] = useState<{ name: string; personal_color?: string; skin_concern?: string; desired_image?: string } | null>(null);

  useEffect(() => {
    if (!token || !userId) {
      navigate("/", { replace: true });
      return;
    }
    getUser(Number(userId))
      .then((u) => setUser(u as { name: string; personal_color?: string; skin_concern?: string; desired_image?: string }))
      .catch(() => navigate("/", { replace: true }));
  }, [userId, token, navigate]);

  if (!token || !userId) return null;
  const qrUrl = `${baseUrl}/users/${token}`;

  return (
    <PageWrapper>
      <AppHeader title="MyQR" />
      <div style={{ textAlign: "center", padding: "var(--spacing) 0" }}>
        <p style={{ marginBottom: 8, fontSize: "18px", fontWeight: 500 }}>
          {user?.name ?? "..."}
        </p>
        <div
          style={{
            background: "var(--surface)",
            borderRadius: "var(--card-radius)",
            padding: 24,
            display: "inline-block",
            marginBottom: "var(--spacing)",
          }}
        >
          <QRCodeCanvas value={qrUrl} size={220} level="M" />
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", marginBottom: "var(--spacing)" }}>
          {user?.personal_color && (
            <span
              style={{
                padding: "6px 12px",
                background: "var(--primary-light)",
                borderRadius: "var(--btn-radius)",
                fontSize: "14px",
                color: "var(--primary-dark)",
              }}
            >
              {user.personal_color}
            </span>
          )}
          {user?.skin_concern && (
            <span
              style={{
                padding: "6px 12px",
                background: "var(--surface-alt)",
                borderRadius: "var(--btn-radius)",
                fontSize: "14px",
                color: "var(--muted)",
              }}
            >
              {user.skin_concern}
            </span>
          )}
          {user?.desired_image && (
            <span
              style={{
                padding: "6px 12px",
                background: "var(--surface-alt)",
                borderRadius: "var(--btn-radius)",
                fontSize: "14px",
                color: "var(--muted)",
              }}
            >
              {user.desired_image}
            </span>
          )}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <Link to="/edit">
            <SecondaryButton style={{ width: "100%" }}>情報を編集する</SecondaryButton>
          </Link>
          <Link to="/reactions">
            <SecondaryButton style={{ width: "100%" }}>おすすめを見る</SecondaryButton>
          </Link>
        </div>
      </div>
    </PageWrapper>
  );
}
