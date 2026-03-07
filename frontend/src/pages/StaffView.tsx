import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getUserByToken, getProducts, postRecommendation } from "../api/mock";
import { PageWrapper } from "../components/layout/PageWrapper";
import { AppHeader } from "../components/layout/AppHeader";
import { PrimaryButton } from "../components/ui/Button";
import { Card } from "../components/ui/Card";

// フリー素材（src/assets）は import すると Vite がパスを解決する
import hiyakedomeImg from "../assets/hiyakedome_cream.png";
import kuchibeniImg from "../assets/kuchibeni.png";
import eyeshadowImg from "../assets/makeup_eyeshadow.png";

const CATEGORY_IMAGES: Record<string, string> = {
  下地: hiyakedomeImg,
  リップ: kuchibeniImg,
  アイシャドウ: eyeshadowImg,
};

type Product = {
  id: number;
  emoji: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  image_url?: string;
};

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
  const [products, setProducts] = useState<Product[]>([]);
  const [submittingId, setSubmittingId] = useState<number | null>(null);

  useEffect(() => {
    if (!token) return;
    getUserByToken(token)
      .then((u) =>
        setUser(u as { id: number; name: string; personal_color?: string; skin_concern?: string; desired_image?: string; memo?: string; created_at?: string })
      )
      .catch((err: unknown) => console.error(err));
    getProducts().then((data) => setProducts(data as Product[]));
  }, [token]);

  const handlePropose = async (productId: number) => {
    if (!user) return;
    setSubmittingId(productId);
    try {
      await postRecommendation({
        user_id: user.id,
        product_id: productId,
        store_id: 1,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingId(null);
    }
  };

  if (!token) return null;

  return (
    <PageWrapper>
      <AppHeader title="SunQ" staff />
      {user ? (
        <>
          {/* 顧客情報 */}
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

          {/* 商品提案（カテゴリ別カルーセル） */}
          <section style={{ marginTop: "var(--spacing)" }}>
            <h3 style={{ fontFamily: "var(--serif-font)", fontSize: "18px", marginBottom: 8 }}>
              商品を提案する
            </h3>
            {(["下地", "リップ", "アイシャドウ"] as const).map((category) => {
              const categoryProducts = products.filter((p) => p.category === category);
              if (categoryProducts.length === 0) return null;
              return (
                <div key={category} style={{ marginBottom: "var(--spacing)" }}>
                  <h4 style={{ fontSize: "14px", color: "var(--muted)", marginBottom: 8, fontWeight: 500 }}>
                    {category}
                  </h4>
                  <div
                    style={{
                      display: "flex",
                      gap: 12,
                      overflowX: "auto",
                      scrollSnapType: "x mandatory",
                      scrollPadding: "0 4px",
                      paddingBottom: 8,
                      marginLeft: -4,
                      marginRight: -4,
                    }}
                  >
                    {categoryProducts.map((p) => (
                      <Card
                        key={p.id}
                        style={{
                          flex: "0 0 180px",
                          scrollSnapAlign: "start",
                          padding: 0,
                          overflow: "hidden",
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        <div style={{ aspectRatio: "1", background: "var(--surface-alt)", position: "relative", flexShrink: 0 }}>
                          {(CATEGORY_IMAGES[p.category] ?? p.image_url) ? (
                            <img
                              src={CATEGORY_IMAGES[p.category] ?? p.image_url}
                              alt=""
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "contain",
                                display: "block",
                              }}
                              onError={(e) => {
                                e.currentTarget.style.display = "none";
                                const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                                if (fallback) fallback.style.display = "flex";
                              }}
                            />
                          ) : null}
                          <div
                            style={{
                              position: "absolute",
                              inset: 0,
                              display: (CATEGORY_IMAGES[p.category] ?? p.image_url) ? "none" : "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: 48,
                            }}
                          >
                            {p.emoji}
                          </div>
                        </div>
                        <div
                          style={{
                            padding: 12,
                            display: "flex",
                            flexDirection: "column",
                            flex: 1,
                            minHeight: 88,
                          }}
                        >
                          <div style={{ fontWeight: 500, fontSize: "14px", marginBottom: 2 }}>{p.name}</div>
                          <div style={{ fontSize: "12px", color: "var(--muted)" }}>
                            {p.brand} / ¥{p.price.toLocaleString()}
                          </div>
                          <PrimaryButton
                            type="button"
                            style={{ width: "100%", padding: "8px 12px", fontSize: "14px", marginTop: "auto" }}
                            disabled={submittingId === p.id}
                            onClick={() => handlePropose(p.id)}
                          >
                            {submittingId === p.id ? "送信中..." : "提案する"}
                          </PrimaryButton>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              );
            })}
          </section>
        </>
      ) : (
        <p style={{ color: "var(--muted)" }}>読み込み中...</p>
      )}
    </PageWrapper>
  );
}
