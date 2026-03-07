import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getProducts, postRecommendation } from "../api/mock";
import { PageWrapper } from "../components/layout/PageWrapper";
import { AppHeader } from "../components/layout/AppHeader";
import { PrimaryButton } from "../components/ui/Button";
import { Card } from "../components/ui/Card";

type Product = {
  id: number;
  emoji: string;
  name: string;
  brand: string;
  category: string;
  price: number;
};

export function StaffRecommend() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { userId?: number; token?: string } | null;
  const userId = state?.userId ?? 1;
  const token = state?.token ?? "";

  const [products, setProducts] = useState<Product[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [staffComment, setStaffComment] = useState("");

  useEffect(() => {
    getProducts().then((data) => setProducts(data as Product[]));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedId == null) return;
    try {
      await postRecommendation({
        user_id: userId,
        product_id: selectedId,
        staff_comment: staffComment.trim() || undefined,
        store_id: 1,
      });
      navigate(`/users/${token}`, { replace: true });
    } catch (err) {
      console.error(err);
    }
  };

  const backTo = token ? `/users/${token}` : "/";

  return (
    <PageWrapper>
      <AppHeader title="商品を提案する" backTo={backTo} staff />
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "var(--spacing)" }}>
          <label style={{ display: "block", marginBottom: 8, fontSize: "14px", color: "var(--muted)" }}>
            商品を選択
          </label>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {products.map((p) => (
              <Card
                key={p.id}
                style={{
                  cursor: "pointer",
                  border: selectedId === p.id ? "2px solid var(--primary)" : "2px solid transparent",
                  background: selectedId === p.id ? "var(--primary-light)" : undefined,
                }}
                onClick={() => setSelectedId(selectedId === p.id ? null : p.id)}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontSize: "24px" }}>{p.emoji}</span>
                  <div>
                    <div style={{ fontWeight: 500 }}>{p.name}</div>
                    <div style={{ fontSize: "14px", color: "var(--muted)" }}>
                      {p.brand} / {p.category} / ¥{p.price.toLocaleString()}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
        <div style={{ marginBottom: "var(--spacing)" }}>
          <label style={{ display: "block", marginBottom: 4, fontSize: "14px", color: "var(--muted)" }}>
            スタッフコメント（任意）
          </label>
          <textarea
            value={staffComment}
            onChange={(e) => setStaffComment(e.target.value)}
            placeholder="お客様へのメッセージ"
            style={{
              width: "100%",
              padding: 12,
              border: "2px solid var(--border)",
              borderRadius: "var(--card-radius)",
              fontFamily: "var(--sans-font)",
              fontSize: 16,
              minHeight: 80,
              resize: "vertical",
            }}
          />
        </div>
        <PrimaryButton
          type="submit"
          style={{ width: "100%" }}
          disabled={selectedId == null}
        >
          提案する
        </PrimaryButton>
      </form>
    </PageWrapper>
  );
}
