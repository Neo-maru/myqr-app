import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUser, updateUser } from "../api/client";
import { PageWrapper } from "../components/layout/PageWrapper";
import { AppHeader } from "../components/layout/AppHeader";
import { Input, TextArea } from "../components/ui/Input";
import { PrimaryButton } from "../components/ui/Button";
import { TagButtonGroup } from "../components/ui/TagButton";
import { ThemeColorPicker } from "../components/ui/ThemeColorPicker";
import { getStoredToken, getStoredUserId } from "../hooks/useLocalUser";
import { useThemeColor } from "../hooks/useThemeColor";
import {
  PERSONAL_COLORS,
  SKIN_CONCERNS,
  FACE_TYPES,
  toTypeCode,
} from "../constants/typeMaster";

export function Edit() {
  const navigate = useNavigate();
  const { themeId, themeName, setThemeId } = useThemeColor();
  const userId = getStoredUserId();
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [name, setName] = useState("");
  const [personal_color, setPersonal_color] = useState<string | null>(null);
  const [skin_concern, setSkin_concern] = useState<string>("");
  const [face_type, setFace_type] = useState<string>("");
  const [memo, setMemo] = useState("");

  const token = getStoredToken();
  useEffect(() => {
    if (!userId || !token) {
      navigate("/", { replace: true });
      return;
    }
    getUser(token)
      .then((u: Record<string, unknown>) => {
        setName((u.name as string) ?? "");
        setPersonal_color(toTypeCode(u.personal_color) || null);
        const rawSkin = u.skin_concern;
        const skinArr =
          typeof rawSkin === "string"
            ? rawSkin
              ? rawSkin
                  .split(",")
                  .map((s) => toTypeCode(s.trim()))
                  .filter(Boolean)
              : []
            : Array.isArray(rawSkin)
              ? rawSkin.map((s) => toTypeCode(s)).filter(Boolean)
              : rawSkin != null
                ? [toTypeCode(rawSkin)].filter(Boolean)
                : [];
        setSkin_concern(skinArr[0] ?? "");
        setFace_type(toTypeCode(u.face_type ?? u.desired_image) ?? "");
        setMemo((u.memo as string) ?? "");
      })
      .catch(() => navigate("/", { replace: true }))
      .finally(() => setLoading(false));
  }, [userId, token, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;
    const next: Record<string, string> = {};
    if (!name.trim()) next.name = "表示名を入力してください";
    if (memo.length > 100) next.memo = "メモは100文字以内で入力してください";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    if (!token) return;
    try {
      await updateUser(
        Number(userId),
        {
          name: name.trim(),
          personal_color: personal_color ?? undefined,
          skin_concern: skin_concern || undefined,
          face_type: face_type || undefined,
          memo: memo.trim() || undefined,
        },
        token,
      );
      navigate("/qr", { replace: true });
    } catch (err) {
      console.error(err);
    }
  };

  if (loading)
    return (
      <PageWrapper>
        <p style={{ color: "var(--muted)" }}>読み込み中...</p>
      </PageWrapper>
    );

  return (
    <PageWrapper>
      <AppHeader title="SunQ" pageName="編集" backTo="/qr" />

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "var(--spacing)" }}>
          <label
            style={{
              display: "block",
              marginBottom: 4,
              fontSize: "14px",
              color: "var(--muted)",
            }}
          >
            表示名 <span style={{ color: "var(--primary)" }}> *必須</span>
          </label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="例: ひまわり"
            error={errors.name}
          />
        </div>
        <div style={{ marginBottom: "var(--spacing)" }}>
          <label
            style={{
              display: "block",
              marginBottom: 4,
              fontSize: "14px",
              color: "var(--muted)",
            }}
          >
            パーソナルカラー
          </label>
          <TagButtonGroup
            options={[...PERSONAL_COLORS]}
            value={personal_color}
            onChange={(v) => setPersonal_color(v as string)}
          />
        </div>
        <div style={{ marginBottom: "var(--spacing)" }}>
          <label
            style={{
              display: "block",
              marginBottom: 8,
              fontSize: "14px",
              color: "var(--muted)",
            }}
          >
            肌悩み
          </label>
          <TagButtonGroup
            options={[...SKIN_CONCERNS]}
            value={skin_concern}
            onChange={(v) => setSkin_concern(v as string)}
          />
        </div>
        <div style={{ marginBottom: "var(--spacing)" }}>
          <label
            style={{
              display: "block",
              marginBottom: 8,
              fontSize: "14px",
              color: "var(--muted)",
            }}
          >
            顔タイプ
          </label>
          <TagButtonGroup
            options={[...FACE_TYPES]}
            value={face_type}
            onChange={(v) => setFace_type((v as string) ?? "")}
          />
        </div>
        <div style={{ marginBottom: "var(--spacing)" }}>
          <label
            style={{
              display: "block",
              marginBottom: 4,
              fontSize: "14px",
              color: "var(--muted)",
            }}
          >
            メモ（100文字以内）
          </label>
          <TextArea
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            placeholder="例: 香料アレルギーあり"
            maxLength={100}
            error={errors.memo}
          />
          <p style={{ fontSize: "12px", color: "var(--muted)", marginTop: 4 }}>
            {memo.length}/100
          </p>
        </div>

        <div style={{ marginBottom: "var(--spacing)" }}>
          <label
            style={{
              display: "block",
              marginBottom: 8,
              fontSize: "14px",
              color: "var(--muted)",
            }}
          >
            テーマカラー
          </label>
          <ThemeColorPicker
            value={themeId}
            onChange={setThemeId}
            themeName={themeName}
          />
        </div>

        <PrimaryButton type="submit" style={{ width: "100%" }}>
          更新する
        </PrimaryButton>
      </form>
    </PageWrapper>
  );
}
