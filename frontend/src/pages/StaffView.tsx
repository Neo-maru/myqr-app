import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getStores, getUserByToken, postRecommendation } from "../api/client";
import { PageWrapper } from "../components/layout/PageWrapper";
import { AppHeader } from "../components/layout/AppHeader";
import { Card } from "../components/ui/Card";
import { toTypeLabel } from "../constants/typeMaster";

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
  name: string;
  brand: string;
  category: string;
  price: number;
  is_recommendation?: boolean;
  type_name?: string[];
};

export function StaffView() {
  const { token } = useParams<{ token: string }>();
  const [user, setUser] = useState<{
    id: number;
    name: string;
    personal_color?: string;
    skin_concern?: string;
    face_type?: string;
    memo?: string;
  } | null>(null);
  const [productsByCategory, setProductsByCategory] = useState<{
    下地: Product[];
    リップ: Product[];
    アイシャドウ: Product[];
  }>({ 下地: [], リップ: [], アイシャドウ: [] });
  const [submittingId, setSubmittingId] = useState<number | null>(null);
  const [storeName, setStoreName] = useState<string | undefined>(undefined);
  const [storeId, setStoreId] = useState<number | null>(null);

  useEffect(() => {
    if (!token) return;
    getStores()
      .then((stores) => {
        if (stores[0]) {
          setStoreName(stores[0].store_name ?? null);
          setStoreId(stores[0].id);
        }
      })
      .catch((err) => {
        console.warn(
          "店舗情報の取得に失敗しました（store/get が 404 の場合は run_seeds で store を投入してください）",
          err,
        );
      });
    getUserByToken(token)
      .then((res) => {
        setUser({
          id: res.id,
          name: res.name,
          personal_color: res.personal_color ?? undefined,
          skin_concern: res.skin_concern ?? undefined,
          face_type: res.face_type ?? undefined,
          memo: res.memo ?? undefined,
        });
        const toProduct = (
          p: {
            product_id: number;
            product_name: string;
            brand: string | number;
            price: number;
            type_name?: unknown;
            product_tags?: unknown;
            is_recommendation?: boolean;
          },
          category: string,
        ): Product => ({
          id: p.product_id,
          name: p.product_name,
          brand: typeof p.brand === "string" ? p.brand : String(p.brand ?? ""),
          price: p.price,
          category,
          is_recommendation: p.is_recommendation,
          type_name: Array.isArray(p.product_tags)
            ? (p.product_tags as string[])
            : Array.isArray(p.type_name)
              ? (p.type_name as string[])
              : undefined,
        });
        setProductsByCategory({
          下地: (res.base_info ?? []).map((p) => toProduct(p, "下地")),
          リップ: (res.lip_info ?? []).map((p) => toProduct(p, "リップ")),
          アイシャドウ: (res.shadow_info ?? []).map((p) =>
            toProduct(p, "アイシャドウ"),
          ),
        });
      })
      .catch((err: unknown) => console.error(err));
  }, [token]);

  const handlePropose = async (productId: number) => {
    if (!user || storeId == null) return;
    const current = [
      ...productsByCategory.下地,
      ...productsByCategory.リップ,
      ...productsByCategory.アイシャドウ,
    ].find((p) => p.id === productId);
    const isCurrentlyRecommended = current?.is_recommendation ?? false;
    setSubmittingId(productId);
    try {
      await postRecommendation({
        user_id: user.id,
        product_id: productId,
        store_id: storeId,
      });
      const nextRecommended = !isCurrentlyRecommended;
      setProductsByCategory((prev) => ({
        下地: prev.下地.map((p) =>
          p.id === productId ? { ...p, is_recommendation: nextRecommended } : p,
        ),
        リップ: prev.リップ.map((p) =>
          p.id === productId ? { ...p, is_recommendation: nextRecommended } : p,
        ),
        アイシャドウ: prev.アイシャドウ.map((p) =>
          p.id === productId ? { ...p, is_recommendation: nextRecommended } : p,
        ),
      }));
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingId(null);
    }
  };

  if (!token) return null;

  return (
    <PageWrapper>
      <AppHeader title="SunQ" storeName={storeName} staff />
      {user ? (
        <>
          {/* 顧客情報 */}
          <Card style={{ marginBottom: "var(--spacing)" }}>
            <h2 style={{ fontFamily: "var(--serif-font)", marginBottom: 16 }}>
              {user.name}
            </h2>
            <dl style={{ margin: 0 }}>
              {user.personal_color && (
                <>
                  <dt
                    style={{
                      fontSize: "12px",
                      color: "var(--muted)",
                      marginBottom: 4,
                    }}
                  >
                    パーソナルカラー
                  </dt>
                  <dd style={{ margin: "0 0 12px" }}>
                    {toTypeLabel(user.personal_color)}
                  </dd>
                </>
              )}
              {user.skin_concern && (
                <>
                  <dt
                    style={{
                      fontSize: "12px",
                      color: "var(--muted)",
                      marginBottom: 4,
                    }}
                  >
                    肌悩み
                  </dt>
                  <dd style={{ margin: "0 0 12px" }}>
                    {toTypeLabel(user.skin_concern)}
                  </dd>
                </>
              )}
              {user.face_type && (
                <>
                  <dt
                    style={{
                      fontSize: "12px",
                      color: "var(--muted)",
                      marginBottom: 4,
                    }}
                  >
                    顔タイプ
                  </dt>
                  <dd style={{ margin: "0 0 12px" }}>
                    {toTypeLabel(user.face_type)}
                  </dd>
                </>
              )}
              {user.memo && (
                <>
                  <dt
                    style={{
                      fontSize: "12px",
                      color: "var(--muted)",
                      marginBottom: 4,
                    }}
                  >
                    メモ
                  </dt>
                  <dd style={{ margin: "0 0 12px" }}>{user.memo}</dd>
                </>
              )}
            </dl>
          </Card>

          {/* 商品提案（カテゴリ別カルーセル） */}
          <section style={{ marginTop: "var(--spacing)" }}>
            <h3
              style={{
                fontFamily: "var(--serif-font)",
                fontSize: "18px",
                marginBottom: 8,
              }}
            >
              商品を提案する
            </h3>
            {(["下地", "リップ", "アイシャドウ"] as const).map((category) => {
              const categoryProducts = productsByCategory[category];
              if (!categoryProducts?.length) return null;
              return (
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
                        <div
                          style={{
                            aspectRatio: "1",
                            background: "var(--surface-alt)",
                            position: "relative",
                            flexShrink: 0,
                            overflow: "hidden",
                          }}
                        >
                          {CATEGORY_IMAGES[p.category] ? (
                            <img
                              src={CATEGORY_IMAGES[p.category]}
                              alt=""
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "contain",
                                display: "block",
                                background: "var(--surface-alt)",
                              }}
                            />
                          ) : (
                            <div
                              style={{
                                position: "absolute",
                                inset: 0,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: 48,
                              }}
                            >
                              💄
                            </div>
                          )}
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
                            {p.name}
                          </div>
                          <div
                            style={{
                              fontSize: "12px",
                              color: "var(--muted)",
                              marginBottom: p.type_name?.length ? 6 : 0,
                            }}
                          >
                            {toTypeLabel(p.brand) || String(p.brand ?? "")} / ¥
                            {p.price.toLocaleString()}
                          </div>
                          {p.type_name && p.type_name.length > 0 && (
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
                              {p.type_name.map((tag) => (
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
                          <button
                            type="button"
                            disabled={submittingId === p.id}
                            onClick={() => handlePropose(p.id)}
                            style={{
                              width: "100%",
                              padding: "8px 12px",
                              fontSize: "14px",
                              marginTop: "auto",
                              borderRadius: "var(--btn-radius)",
                              fontWeight: 500,
                              border: p.is_recommendation
                                ? "1px solid var(--border)"
                                : "none",
                              background: p.is_recommendation
                                ? "var(--surface-alt)"
                                : "var(--primary)",
                              color: p.is_recommendation
                                ? "var(--muted)"
                                : "#fff",
                              cursor:
                                submittingId === p.id ? "default" : "pointer",
                            }}
                          >
                            {submittingId === p.id
                              ? "送信中..."
                              : p.is_recommendation
                                ? "提案を取り消す"
                                : "提案する"}
                          </button>
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
    </PageWrapper>
  );
}
