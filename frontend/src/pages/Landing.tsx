import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { PageWrapper } from "../components/layout/PageWrapper";
import { PrimaryButton } from "../components/ui/Button";
import { getStoredToken } from "../hooks/useLocalUser";

export function Landing() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = getStoredToken();
    if (token) {
      navigate("/qr", { replace: true });
    }
  }, [navigate]);

  return (
    <PageWrapper>
      <div
        style={{
          minHeight: "60vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontFamily: "var(--serif-font)",
            fontSize: "var(--title-size)",
            marginBottom: 8,
          }}
        >
          MyQR
        </h1>
        <p
          style={{
            color: "var(--muted)",
            fontSize: "18px",
            marginBottom: "var(--spacing)",
          }}
        >
          あなたのパーソナル情報をQRで。<br />
          店舗スタッフが、あなたにぴったりの提案を。
        </p>
        <Link to="/register">
          <PrimaryButton
            style={{
              padding: "14px 32px",
              fontSize: "16px",
            }}
          >
            はじめる
          </PrimaryButton>
        </Link>
      </div>
    </PageWrapper>
  );
}
