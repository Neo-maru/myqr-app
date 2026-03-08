import { useEffect, useState } from "react";
import {
  getRecommendations,
  getStores,
  postReaction,
} from "../api/client";
import { PageWrapper } from "../components/layout/PageWrapper";
import { AppHeader } from "../components/layout/AppHeader";
import { Card } from "../components/ui/Card";
import { getStoredUserId } from "../hooks/useLocalUser";
import { toTypeLabel } from "../constants/typeMaster";

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
  const [storeId, setStoreId] = useState<number | null>(null);

  useEffect(() => {
    if (!userId) return;
    getRecommendations(Number(userId)).then((data) =>
      setItems(data as Recommendation[]),
    );
    getStores().then((stores) => {
      if (stores[0]) {
        setStoreId(stores[0].id);
      }
    });
  }, [userId]);

  const handleReaction = async (productId: number, reactionType: string) => {
    if (!userId || storeId == null) return;
    const current = items.find((r) => r.product.id === productId);
    const nextType = current?.reaction === reactionType ? null : reactionType;
    try {
      await postReaction({
        user_id: Number(userId),
        product_id: productId,
        store_id: storeId,
        reaction: nextType,
      });
      setItems((prev) =>
        prev.map((r) =>
          r.product.id === productId ? { ...r, reaction: nextType } : r,
        ),
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
      <AppHeader
        title="SunQ"
        pageName="スタッフからのおすすめ商品"
        backTo="/qr"
      />
      {items.length === 0 ? (
        <p style={{ color: "var(--muted)" }}>
          まだおすすめはありません。
          <br />
          スタッフが商品を提案するとここに表示されます。
        </p>
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
                            overflow: "hidden",
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
                                background: "var(--surface-alt)",
                              }}
                              onError={(e) => {
                                e.currentTarget.style.display = "none";
                                const fallback = e.currentTarget
                                  .nextElementSibling as HTMLElement;
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
                              display: CATEGORY_IMAGES[rec.product.category]
                                ? "none"
                                : "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: 48,
                              pointerEvents: "none",
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
                              marginBottom: 4,
                            }}
                          >
                            {rec.product.brand} / ¥
                            {rec.product.price.toLocaleString()}
                          </div>
                          {rec.product.tags &&
                            rec.product.tags.length > 0 && (
                              <div
                                style={{
                                  display: "flex",
                                  flexWrap: "wrap",
                                  gap: 4,
                                  marginBottom: 8,
                                  fontSize: "11px",
                                  color: "var(--muted)",
                                }}
                              >
                                {rec.product.tags.map((tag) => (
                                  <span
                                    key={tag}
                                    style={{
                                      padding: "2px 6px",
                                      background: "var(--surface-alt)",
                                      borderRadius: "var(--btn-radius)",
                                    }}
                                  >
                                    {toTypeLabel(tag)}
                                  </span>
                                ))}
                              </div>
                            )}
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
              ),
          )}
        </>
      )}
      <p style={{ marginTop: "var(--spacing)" }}></p>
    </PageWrapper>
  );
}
