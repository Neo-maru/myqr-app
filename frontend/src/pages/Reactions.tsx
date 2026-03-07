import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getRecommendations, postReaction } from "../api/mock";
import { PageWrapper } from "../components/layout/PageWrapper";
import { AppHeader } from "../components/layout/AppHeader";
import { Card } from "../components/ui/Card";
import { getStoredUserId } from "../hooks/useLocalUser";

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
  staff_comment: string | null;
  reaction: string | null;
  store_name: string;
  created_at: string;
};

const REACTIONS = [
  { type: "like", emoji: "👍", label: "好き" },
  { type: "want", emoji: "😍", label: "欲しい！" },
  { type: "dislike", emoji: "👎", label: "違うかも" },
] as const;

export function Reactions() {
  const userId = getStoredUserId();
  const [items, setItems] = useState<Recommendation[]>([]);

  useEffect(() => {
    if (!userId) return;
    getRecommendations(Number(userId)).then((data) => setItems(data as Recommendation[]));
  }, [userId]);

  const handleReaction = async (recommendationId: number, reactionType: string) => {
    const current = items.find((r) => r.id === recommendationId);
    const nextType = current?.reaction === reactionType ? null : reactionType;
    try {
      await postReaction({ recommendation_id: recommendationId, reaction_type: nextType });
      setItems((prev) =>
        prev.map((r) =>
          r.id === recommendationId ? { ...r, reaction: nextType } : r
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <PageWrapper>
      <AppHeader title="おすすめ" backTo="/qr" />
      <h2 style={{ fontFamily: "var(--serif-font)", marginBottom: "var(--spacing)" }}>
        スタッフからのおすすめ
      </h2>
      {items.length === 0 ? (
        <p style={{ color: "var(--muted)" }}>まだおすすめはありません。</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing)" }}>
          {items.map((rec) => (
            <Card key={rec.id}>
              <div style={{ marginBottom: 8 }}>
                <div style={{ fontWeight: 500, fontSize: "18px" }}>{rec.product.name}</div>
                <div style={{ fontSize: "14px", color: "var(--muted)" }}>
                  {rec.product.brand} / {rec.product.category} / ¥{rec.product.price.toLocaleString()}
                </div>
                {rec.product.tags?.length ? (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 4 }}>
                    {rec.product.tags.map((tag) => (
                      <span
                        key={tag}
                        style={{
                          fontSize: "12px",
                          padding: "2px 8px",
                          background: "var(--surface-alt)",
                          borderRadius: "var(--btn-radius)",
                          color: "var(--muted)",
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>
              {rec.staff_comment && (
                <p style={{ fontSize: "14px", color: "var(--text)", marginBottom: 12 }}>
                  {rec.staff_comment}
                </p>
              )}
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {REACTIONS.map(({ type, emoji, label }) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => handleReaction(rec.id, type)}
                    style={{
                      padding: "8px 14px",
                      borderRadius: "var(--btn-radius)",
                      border: rec.reaction === type ? "2px solid var(--primary)" : "1px solid var(--border)",
                      background: rec.reaction === type ? "var(--primary-light)" : "var(--surface-alt)",
                      color: rec.reaction === type ? "var(--primary-dark)" : "var(--text)",
                      fontSize: "14px",
                    }}
                  >
                    {emoji} {label}
                  </button>
                ))}
              </div>
            </Card>
          ))}
        </div>
      )}
      <p style={{ marginTop: "var(--spacing)" }}>
        <Link to="/qr" style={{ color: "var(--primary)" }}>← QRに戻る</Link>
      </p>
    </PageWrapper>
  );
}
