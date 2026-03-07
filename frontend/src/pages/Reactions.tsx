import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getRecommendations, postReaction } from "../api/client";
import { PageWrapper } from "../components/layout/PageWrapper";
import { AppHeader } from "../components/layout/AppHeader";
import { Card } from "../components/ui/Card";
import { getStoredUserId } from "../hooks/useLocalUser";

import hiyakedomeImg from "../assets/hiyakedome_cream.png";
import kuchibeniImg from "../assets/kuchibeni.png";
import eyeshadowImg from "../assets/makeup_eyeshadow.png";

const CATEGORY_IMAGES: Record<string, string> = {
  下地: hiyakedomeImg,
  リップ: kuchibeniImg,
  アイシャドウ: eyeshadowImg,
};

type Recommendation = {
  id: number;
  product: {
    id: number;
    name: string;
    brand: string;
    category: string;
    price: number;
    tags?: string[];
  };
  reaction: string | null;
  store_name: string;
  created_at: string;
};

const REACTIONS = [
  { type: "like", emoji: "👍", label: "好き" },
  { type: "want", emoji: "😍", label: "欲しい！" },
  { type: "dislike", emoji: "👎", label: "違うかも" },
] as const;

const CATEGORY_ORDER = ["下地", "リップ", "アイシャドウ"] as const;

export function Reactions() {
  const userId = getStoredUserId();
  const [items, setItems] = useState<Recommendation[]>([]);

  useEffect(() => {
    if (!userId) return;
    getRecommendations(Number(userId)).then((data) => setItems(data as Recommendation[]));
  }, [userId]);

  const handleReaction = async (productId: number, reactionType: string) => {
    if (!userId) return;
    const current = items.find((r) => r.product.id === productId);
    const nextType = current?.reaction === reactionType ? null : reactionType;
    try {
      await postReaction({
        user_id: Number(userId),
        product_id: productId,
        reaction: nextType,
      });
      setItems((prev) =>
        prev.map((r) =>
          r.product.id === productId ? { ...r, reaction: nextType } : r
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  const byCategory = CATEGORY_ORDER.map((cat) => ({
    category: cat,
    recs: items.filter((r) => r.product.category === cat),
  }));

  return (
    <PageWrapper>
      <AppHeader title="SunQ" backTo="/qr" />
      <h2 style={{ fontFamily: "var(--serif-font)", marginBottom: "var(--spacing)" }}>
        スタッフからのおすすめ
      </h2>
      {items.length === 0 ? (
        <p style={{ color: "var(--muted)" }}>まだおすすめはありません。</p>
      ) : (
        <>
          {byCategory.map(
            ({ category, recs }) =>
              recs.length > 0 && (
                <div key={category} style={{ marginBottom: "var(--spacing)" }}>
                  <h4
                    style={{
                      fontSize: "14px",
                      color: "var(--muted)",
                      marginBottom: 8,
                      fontWeight: 500,
                    }}
                  >
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
                    {recs.map((rec) => (
                      <Card
                        key={rec.id}
                        style={{
                          flex: "0 0 180px",
                          scrollSnapAlign: "start",
                          padding: 0,
                          overflow: "hidden",
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        <div
                          style={{
                            aspectRatio: "1",
                            background: "var(--surface-alt)",
                            position: "relative",
                            flexShrink: 0,
                          }}
                        >
                          {(CATEGORY_IMAGES[rec.product.category] ?? null) ? (
                            <img
                              src={CATEGORY_IMAGES[rec.product.category]}
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
                              width: "100%",
                              height: "100%",
                              display: CATEGORY_IMAGES[rec.product.category] ? "none" : "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: 48,
                            }}
                          >
                            <span style={{ lineHeight: 1 }}>💄</span>
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
                          <div
                            style={{
                              fontWeight: 500,
                              fontSize: "14px",
                              marginBottom: 2,
                            }}
                          >
                            {rec.product.name}
                          </div>
                          <div
                            style={{
                              fontSize: "12px",
                              color: "var(--muted)",
                              marginBottom: 8,
                            }}
                          >
                            {rec.product.brand} / ¥
                            {rec.product.price.toLocaleString()}
                          </div>
                          <div
                            style={{
                              display: "flex",
                              gap: 6,
                              flexWrap: "wrap",
                              marginTop: "auto",
                              justifyContent: "center",
                            }}
                          >
                            {REACTIONS.map(({ type, emoji, label }) => (
                              <button
                                key={type}
                                type="button"
                                aria-label={label}
                                onClick={() => handleReaction(rec.id, type)}
                                style={{
                                  padding: "6px 10px",
                                  borderRadius: "var(--btn-radius)",
                                  border:
                                    rec.reaction === type
                                      ? "2px solid var(--primary)"
                                      : "1px solid var(--border)",
                                  background:
                                    rec.reaction === type
                                      ? "var(--primary-light)"
                                      : "var(--surface-alt)",
                                  color:
                                    rec.reaction === type
                                      ? "var(--primary-dark)"
                                      : "var(--text)",
                                  fontSize: "12px",
                                }}
                              >
                                {emoji}
                              </button>
                            ))}
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )
          )}
        </>
      )}
      <p style={{ marginTop: "var(--spacing)" }}>
        <Link to="/qr" style={{ color: "var(--primary)" }}>
          ← QRに戻る
        </Link>
      </p>
    </PageWrapper>
  );
}
