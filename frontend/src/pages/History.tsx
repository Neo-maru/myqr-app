import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getRecommendations } from "../api/mock";
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

const FILTERS = [
  { value: "all", label: "すべて" },
  { value: "want", label: "😍" },
  { value: "like", label: "👍" },
  { value: "dislike", label: "👎" },
] as const;

const REACTION_LABEL: Record<string, string> = {
  want: "😍 欲しい！",
  like: "👍 好き",
  dislike: "👎 違うかも",
};

export function History() {
  const userId = getStoredUserId();
  const [items, setItems] = useState<Recommendation[]>([]);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    if (!userId) return;
    getRecommendations(Number(userId)).then((data) => setItems(data as Recommendation[]));
  }, [userId]);

  const filtered = items.filter((r) => {
    if (filter === "all") return true;
    return r.reaction === filter;
  });

  return (
    <PageWrapper>
      <AppHeader title="評価履歴" backTo="/qr" />
      <h2 style={{ fontFamily: "var(--serif-font)", marginBottom: 8 }}>評価履歴</h2>
      <div style={{ display: "flex", gap: 8, marginBottom: "var(--spacing)", flexWrap: "wrap" }}>
        {FILTERS.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => setFilter(f.value)}
            style={{
              padding: "8px 16px",
              borderRadius: "var(--btn-radius)",
              border: filter === f.value ? "2px solid var(--primary)" : "1px solid var(--border)",
              background: filter === f.value ? "var(--primary-light)" : "var(--surface)",
              color: filter === f.value ? "var(--primary-dark)" : "var(--text)",
              fontSize: "14px",
            }}
          >
            {f.label}
          </button>
        ))}
      </div>
      {filtered.length === 0 ? (
        <p style={{ color: "var(--muted)" }}>該当する履歴はありません。</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing)" }}>
          {filtered.map((rec) => (
            <Card key={rec.id}>
              <div style={{ fontSize: "12px", color: "var(--muted)", marginBottom: 4 }}>
                {new Date(rec.created_at).toLocaleString("ja-JP")} · {rec.store_name}
              </div>
              <div style={{ fontWeight: 500, marginBottom: 4 }}>{rec.product.name}</div>
              <div style={{ fontSize: "14px", color: "var(--muted)", marginBottom: 4 }}>
                {rec.product.brand} / {rec.product.category} / ¥{rec.product.price.toLocaleString()}
              </div>
              {rec.reaction && (
                <div style={{ marginBottom: 4 }}>{REACTION_LABEL[rec.reaction] ?? rec.reaction}</div>
              )}
              {rec.staff_comment && (
                <p style={{ fontSize: "14px", color: "var(--text)" }}>{rec.staff_comment}</p>
              )}
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
