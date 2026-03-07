import { useNavigate } from "react-router-dom";
import { PageWrapper } from "../components/layout/PageWrapper";
import { AppHeader } from "../components/layout/AppHeader";
import { PrimaryButton } from "../components/ui/Button";
import { getStoredToken } from "../hooks/useLocalUser";

export function Landing() {
  const navigate = useNavigate();

  const handleStart = () => {
    const token = getStoredToken();
    if (token) {
      navigate("/qr");
    } else {
      navigate("/register");
    }
  };

  return (
    <PageWrapper>
      <AppHeader title="SunQ" />
      <div style={{ paddingBottom: "var(--spacing)", paddingTop: 8 }}>
        {/* 1. ビジュアル（ひまわり＋中央にQRファインダー） */}
        <div
          style={{
            position: "relative",
            width: "100%",
            maxWidth: 280,
            height: 220,
            margin: "0 auto 18px",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: 200,
              height: 200,
              marginLeft: -100,
              marginTop: -100,
              borderRadius: "50%",
              background: "radial-gradient(circle, var(--primary-light) 0%, transparent 70%)",
              opacity: 0.9,
              animation: "landing-circle-pulse 3s ease-in-out infinite",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              animation: "landing-circle-rotate 22s linear infinite",
            }}
          >
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  width: `${36 + i * 28}px`,
                  height: `${36 + i * 28}px`,
                  marginLeft: `${-(36 + i * 28) / 2}px`,
                  marginTop: `${-(36 + i * 28) / 2}px`,
                  borderRadius: "50%",
                  border: `2.5px solid var(--primary-light)`,
                  opacity: 1 - (i - 1) * 0.12,
                  animation: "landing-circle-pulse 2.6s ease-in-out infinite",
                  animationDelay: `${i * 0.18}s`,
                }}
              />
            ))}
          </div>
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: 140,
              height: 140,
              transform: "translate(-50%, -50%)",
              animation: "landing-flower-sway 2.8s ease-in-out infinite",
              filter: "drop-shadow(0 4px 12px rgba(92, 64, 51, 0.2))",
            }}
          >
            <svg
              viewBox="0 0 64 64"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ width: "100%", height: "100%", overflow: "visible" }}
            >
              <defs>
                <linearGradient id="petal-outer" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="var(--sunflower-petal-light)" stopOpacity="1" />
                  <stop offset="50%" stopColor="var(--sunflower-petal)" stopOpacity="1" />
                  <stop offset="100%" stopColor="var(--sunflower-petal-dark)" stopOpacity="0.95" />
                </linearGradient>
                <linearGradient id="petal-inner" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="var(--sunflower-petal-light)" stopOpacity="1" />
                  <stop offset="100%" stopColor="var(--sunflower-petal)" stopOpacity="0.9" />
                </linearGradient>
              </defs>
              {[...Array(20)].map((_, i) => {
                const angle = (i / 20) * 360;
                return (
                  <ellipse
                    key={`outer-${i}`}
                    cx="32"
                    cy="32"
                    rx="4.5"
                    ry="20"
                    fill="url(#petal-outer)"
                    transform={`rotate(${angle} 32 32)`}
                  />
                );
              })}
              {[...Array(14)].map((_, i) => {
                const angle = (i / 14) * 360 + 6;
                return (
                  <ellipse
                    key={`inner-${i}`}
                    cx="32"
                    cy="32"
                    rx="3.5"
                    ry="12"
                    fill="url(#petal-inner)"
                    transform={`rotate(${angle} 32 32)`}
                  />
                );
              })}
              {/* 中心：QRファインダーパターン（3重の四角） */}
              <g transform="translate(32, 32)">
                <rect x="-7" y="-7" width="14" height="14" fill="var(--sunflower-center)" />
                <rect x="-5" y="-5" width="10" height="10" fill="var(--surface)" />
                <rect x="-3" y="-3" width="6" height="6" fill="var(--sunflower-center)" />
              </g>
            </svg>
          </div>
        </div>

        {/* 2. ロゴ（大きめ・ヘッダーではなくここで） */}
        <h1
          style={{
            fontFamily: "var(--serif-font)",
            fontSize: "42px",
            fontWeight: 400,
            color: "var(--text)",
            margin: "0 0 4px",
            textAlign: "center",
          }}
        >
          Sun<span style={{ color: "var(--primary)" }}>Q</span>
        </h1>

        {/* キャッチコピー */}
        <p
          style={{
            fontFamily: "var(--serif-font)",
            fontSize: "20px",
            fontWeight: 400,
            lineHeight: 1.5,
            color: "var(--text)",
            margin: "0 0 6px",
            textAlign: "center",
          }}
        >
          あなたの美を、
          <span style={{ color: "var(--primary)" }}>QR</span>
          に宿す。
        </p>

        {/* 3. ベネフィット（一言で刺さる） */}
        <p
          style={{
            fontSize: "15px",
            fontWeight: 500,
            lineHeight: 1.5,
            color: "var(--text)",
            margin: "0 0 8px",
            textAlign: "center",
          }}
        >
          店舗で、あなただけの提案がもらえる。
        </p>

        {/* 4. 補足説明 */}
        <p
          style={{
            fontSize: "12px",
            lineHeight: 1.6,
            color: "var(--muted)",
            margin: "0 0 18px",
            textAlign: "center",
          }}
        >
          パーソナル情報を一度登録するだけ。<br/>QRを見せるだけで、コスメ体験がはじまります。
        </p>

        {/* 5. CTA */}
        <PrimaryButton
          type="button"
          style={{
            width: "100%",
            padding: "14px 24px",
            fontSize: "16px",
          }}
          onClick={handleStart}
        >
          はじめる
        </PrimaryButton>

        {/* 6. スローガン（下で余白を自然に使う）
        <p
          style={{
            fontFamily: "var(--serif-font)",
            fontStyle: "italic",
            fontSize: "12px",
            color: "var(--muted)",
            margin: "14px 0 0",
            textAlign: "center",
          }}
        >
          your personal beauty passport
        </p> */}
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
