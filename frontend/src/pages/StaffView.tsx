import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getUserByToken } from "../api/mock";
import { PageWrapper } from "../components/layout/PageWrapper";
import { AppHeader } from "../components/layout/AppHeader";
import { PrimaryButton } from "../components/ui/Button";
import { Card } from "../components/ui/Card";

export function StaffView() {
  const { token } = useParams<{ token: string }>();
  const [user, setUser] = useState<{
    id: number;
    name: string;
    personal_color?: string;
    skin_concern?: string;
    desired_image?: string;
    memo?: string;
    created_at?: string;
  } | null>(null);

  useEffect(() => {
    if (!token) return;
    getUserByToken(token)
      .then((u) =>
        setUser(u as { id: number; name: string; personal_color?: string; skin_concern?: string; desired_image?: string; memo?: string; created_at?: string })
      )
      .catch((err: unknown) => console.error(err));
  }, [token]);

  if (!token) return null;

  return (
    <PageWrapper>
      <AppHeader title="顧客情報" staff />
      {user ? (
        <>
          <Card style={{ marginBottom: "var(--spacing)" }}>
            <h2 style={{ fontFamily: "var(--serif-font)", marginBottom: 16 }}>{user.name}</h2>
            <dl style={{ margin: 0 }}>
              {user.personal_color && (
                <>
                  <dt style={{ fontSize: "12px", color: "var(--muted)", marginBottom: 4 }}>パーソナルカラー</dt>
                  <dd style={{ margin: "0 0 12px" }}>{user.personal_color}</dd>
                </>
              )}
              {user.skin_concern && (
                <>
                  <dt style={{ fontSize: "12px", color: "var(--muted)", marginBottom: 4 }}>肌悩み</dt>
                  <dd style={{ margin: "0 0 12px" }}>{user.skin_concern}</dd>
                </>
              )}
              {user.desired_image && (
                <>
                  <dt style={{ fontSize: "12px", color: "var(--muted)", marginBottom: 4 }}>なりたいイメージ</dt>
                  <dd style={{ margin: "0 0 12px" }}>{user.desired_image}</dd>
                </>
              )}
              {user.memo && (
                <>
                  <dt style={{ fontSize: "12px", color: "var(--muted)", marginBottom: 4 }}>メモ</dt>
                  <dd style={{ margin: "0 0 12px" }}>{user.memo}</dd>
                </>
              )}
              {user.created_at && (
                <>
                  <dt style={{ fontSize: "12px", color: "var(--muted)", marginBottom: 4 }}>登録日</dt>
                  <dd style={{ margin: 0 }}>{new Date(user.created_at).toLocaleDateString("ja-JP")}</dd>
                </>
              )}
            </dl>
          </Card>
          <Link to="/staff/recommend" state={{ userId: user.id, token }}>
            <PrimaryButton style={{ width: "100%" }}>商品を提案する</PrimaryButton>
          </Link>
        </>
      ) : (
        <p style={{ color: "var(--muted)" }}>読み込み中...</p>
      )}
    </PageWrapper>
  );
}
