import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUser, updateUser } from "../api/client";
import { PageWrapper } from "../components/layout/PageWrapper";
import { AppHeader } from "../components/layout/AppHeader";
import { Input, TextArea } from "../components/ui/Input";
import { PrimaryButton } from "../components/ui/Button";
import { TagButtonGroup } from "../components/ui/TagButton";
import { getStoredToken, getStoredUserId } from "../hooks/useLocalUser";

const PERSONAL_COLORS = [
  { value: "イエベ春", label: "イエベ春" },
  { value: "イエベ秋", label: "イエベ秋" },
  { value: "ブルベ夏", label: "ブルベ夏" },
  { value: "ブルベ冬", label: "ブルベ冬" },
];

const SKIN_CONCERNS = [
  { value: "乾燥肌", label: "乾燥肌" },
  { value: "敏感肌", label: "敏感肌" },
  { value: "テカり", label: "テカり" },
];

const DESIRED_IMAGES = [
  { value: "かわいい", label: "かわいい" },
  { value: "かっこいい", label: "かっこいい" },
  { value: "大人っぽい", label: "大人っぽい" },
];

export function Edit() {
  const navigate = useNavigate();
  const userId = getStoredUserId();
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone_number, setPhone_number] = useState("");
  const [personal_color, setPersonal_color] = useState<string | null>(null);
  const [skin_concern, setSkin_concern] = useState<string[]>([]);
  const [desired_image, setDesired_image] = useState<string | null>(null);
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
        setEmail((u.email as string) ?? "");
        setPhone_number((u.phone_number as string) ?? "");
        setPersonal_color((u.personal_color as string) ?? null);
        setSkin_concern(
          typeof u.skin_concern === "string"
            ? (u.skin_concern ? (u.skin_concern as string).split(",") : [])
            : []
        );
        setDesired_image((u.desired_image as string) ?? (u.face_type as string) ?? null);
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
    if (!email.trim()) next.email = "メールアドレスを入力してください";
    if (!phone_number.trim()) next.phone_number = "電話番号を入力してください";
    if (memo.length > 100) next.memo = "メモは100文字以内で入力してください";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    if (!token) return;
    try {
      await updateUser(Number(userId), {
        name: name.trim(),
        email: email.trim(),
        phone_number: phone_number.trim(),
        personal_color: personal_color ?? undefined,
        skin_concern: skin_concern.length ? skin_concern.join(",") : undefined,
        desired_image: desired_image ?? undefined,
        face_type: desired_image ?? undefined,
        memo: memo.trim() || undefined,
      }, token);
      navigate("/qr", { replace: true });
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <PageWrapper><p style={{ color: "var(--muted)" }}>読み込み中...</p></PageWrapper>;

  return (
    <PageWrapper>
      <AppHeader title="SunQ" backTo="/qr" />
      <h2 style={{ fontFamily: "var(--serif-font)", marginBottom: "var(--spacing)" }}>
        ユーザー情報編集
      </h2>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "var(--spacing)" }}>
          <label style={{ display: "block", marginBottom: 4, fontSize: "14px", color: "var(--muted)" }}>
            表示名 <span style={{ color: "var(--primary)" }}>*</span>
          </label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="例: みう"
            error={errors.name}
          />
        </div>
        <div style={{ marginBottom: "var(--spacing)" }}>
          <label style={{ display: "block", marginBottom: 4, fontSize: "14px", color: "var(--muted)" }}>
            メールアドレス <span style={{ color: "var(--primary)" }}>*</span>
          </label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="example@email.com"
            error={errors.email}
          />
        </div>
        <div style={{ marginBottom: "var(--spacing)" }}>
          <label style={{ display: "block", marginBottom: 4, fontSize: "14px", color: "var(--muted)" }}>
            電話番号 <span style={{ color: "var(--primary)" }}>*</span>
          </label>
          <Input
            type="tel"
            value={phone_number}
            onChange={(e) => setPhone_number(e.target.value)}
            placeholder="090-1234-5678"
            error={errors.phone_number}
          />
        </div>

        <div style={{ marginBottom: "var(--spacing)" }}>
          <label style={{ display: "block", marginBottom: 8, fontSize: "14px", color: "var(--muted)" }}>
            パーソナルカラー
          </label>
          <TagButtonGroup
            options={PERSONAL_COLORS}
            value={personal_color}
            onChange={(v) => setPersonal_color(v as string)}
          />
        </div>
        <div style={{ marginBottom: "var(--spacing)" }}>
          <label style={{ display: "block", marginBottom: 8, fontSize: "14px", color: "var(--muted)" }}>
            肌悩み（複数選択可）
          </label>
          <TagButtonGroup
            options={SKIN_CONCERNS}
            value={skin_concern}
            multiple
            onChange={(v) => setSkin_concern(v as string[])}
          />
        </div>
        <div style={{ marginBottom: "var(--spacing)" }}>
          <label style={{ display: "block", marginBottom: 8, fontSize: "14px", color: "var(--muted)" }}>
            なりたいイメージ
          </label>
          <TagButtonGroup
            options={DESIRED_IMAGES}
            value={desired_image}
            onChange={(v) => setDesired_image(v as string)}
          />
        </div>
        <div style={{ marginBottom: "var(--spacing)" }}>
          <label style={{ display: "block", marginBottom: 4, fontSize: "14px", color: "var(--muted)" }}>
            メモ（100文字以内）
          </label>
          <TextArea
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            placeholder="例: 香料アレルギーあり"
            maxLength={100}
            error={errors.memo}
          />
          <p style={{ fontSize: "12px", color: "var(--muted)", marginTop: 4 }}>{memo.length}/100</p>
        </div>

        <PrimaryButton type="submit" style={{ width: "100%" }}>
          更新する
        </PrimaryButton>
      </form>
    </PageWrapper>
  );
}
