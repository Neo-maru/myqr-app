import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
import { getUser } from "../api/client";
import { PageWrapper } from "../components/layout/PageWrapper";
import { AppHeader } from "../components/layout/AppHeader";
import { PrimaryButton } from "../components/ui/Button";
import { getStoredToken, getStoredUserId } from "../hooks/useLocalUser";
import { useThemeColor } from "../hooks/useThemeColor";
import { getPresetById } from "../constants/themeColors";
import { toTypeLabel } from "../constants/typeMaster";

const baseUrl =
  import.meta.env.VITE_APP_PUBLIC_URL ||
  import.meta.env.VITE_API_BASE_URL ||
  "";
const QR_SIZE = 220;
const LOGO_SIZE = 72;

export function QRDisplay() {
  const navigate = useNavigate();
  const { themeId } = useThemeColor();
  const preset = getPresetById(themeId);
  const qrFgColor = preset?.primary ?? "#c4846a";
  const token = getStoredToken();
  const userId = getStoredUserId();
  const [user, setUser] = useState<{
    name: string;
    personal_color?: string;
    skin_concern?: string;
    desired_image?: string;
    face_type?: string;
  } | null>(null);

  useEffect(() => {
    if (!token || !userId) {
      navigate("/", { replace: true });
      return;
    }
    getUser(token)
      .then((u) => {
        if (
          u &&
          (typeof (u as { name?: unknown }).name === "string" ||
            typeof (u as { id?: unknown }).id === "number")
        ) {
          setUser({
            name: (u as { name?: string }).name ?? "",
            personal_color: (u as { personal_color?: string }).personal_color,
            skin_concern: (u as { skin_concern?: string }).skin_concern,
            desired_image:
              (u as { desired_image?: string }).desired_image ??
              (u as { face_type?: string }).face_type,
          });
        }
      })
      .catch(() => navigate("/", { replace: true }));
  }, [userId, token, navigate]);

  if (!token || !userId) return null;
  const qrUrl = `${baseUrl}/users/${token}`;

  return (
    <PageWrapper>
      <AppHeader title="SunQ" pageName="マイQRコード" />
      <div style={{ textAlign: "center", padding: "var(--spacing) 0" }}>
        <p style={{ marginBottom: 8, fontSize: "18px", fontWeight: 500 }}>
          {user?.name ?? "..."} さん
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
          <div style={{ position: "relative", display: "inline-block" }}>
            <QRCodeCanvas
              value={qrUrl}
              size={QR_SIZE}
              level="M"
              fgColor={qrFgColor}
              bgColor="#ffffff"
            />
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: LOGO_SIZE,
                height: LOGO_SIZE,
                borderRadius: 8,
                background: "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxSizing: "border-box",
                padding: 6,
              }}
            >
              <img
                src="/favicon.svg"
                alt="SunQ"
                width={LOGO_SIZE}
                height={LOGO_SIZE}
                style={{ display: "block" }}
              />
            </div>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 8,
            justifyContent: "center",
            marginBottom: "var(--spacing)",
          }}
        >
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
              {toTypeLabel(user.personal_color)}
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
              {toTypeLabel(user.skin_concern)}
            </span>
          )}
          {(user?.desired_image ?? user?.face_type) && (
            <span
              style={{
                padding: "6px 12px",
                background: "var(--surface-alt)",
                borderRadius: "var(--btn-radius)",
                fontSize: "14px",
                color: "var(--muted)",
              }}
            >
              {toTypeLabel(user.desired_image ?? user.face_type)}
            </span>
          )}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <Link to="/edit">
            <PrimaryButton style={{ width: "100%" }}>
              情報を編集する
            </PrimaryButton>
          </Link>
          <Link to="/reactions">
            <PrimaryButton style={{ width: "100%" }}>
              スタッフからのおすすめ商品を見る
            </PrimaryButton>
          </Link>
        </div>
        {/* コピーライト */}
        <p
          style={{
            fontSize: "10px",
            color: "var(--muted)",
            margin: "12px 0 0",
            textAlign: "center",
          }}
        >
          © 2026 Himawari Inc. All rights reserved.
        </p>
      </div>
    </PageWrapper>
  );
}
