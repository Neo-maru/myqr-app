import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../api/client";
import { PageWrapper } from "../components/layout/PageWrapper";
import { AppHeader } from "../components/layout/AppHeader";
import { Input, TextArea } from "../components/ui/Input";
import { PrimaryButton } from "../components/ui/Button";
import { TagButtonGroup } from "../components/ui/TagButton";
import { setStoredUser } from "../hooks/useLocalUser";

const PERSONAL_COLORS = [
  { value: "イエベ春", label: "イエベ春" },
  { value: "イエベ秋", label: "イエベ秋" },
  { value: "ブルベ夏", label: "ブルベ夏" },
  { value: "ブルベ冬", label: "ブルベ冬" },
];

const SKIN_CONCERNS = [
  { value: "DRY", label: "乾燥肌" },
  { value: "SENSITIVE", label: "敏感肌" },
  { value: "OILY", label: "脂性肌" },
];

const DESIRED_IMAGES = [
  { value: "かわいい", label: "かわいい" },
  { value: "かっこいい", label: "かっこいい" },
  { value: "大人っぽい", label: "大人っぽい" },
];

export function Register() {
  const navigate = useNavigate();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [name, setName] = useState("");
  const [personal_color, setPersonal_color] = useState<string | null>(null);
  const [skin_concern, setSkin_concern] = useState<string>("");
  const [desired_image, setDesired_image] = useState<string | null>(null);
  const [memo, setMemo] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (!name.trim()) next.name = "表示名を入力してください";
    if (memo.length > 100) next.memo = "メモは100文字以内で入力してください";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    try {
      const res = await registerUser({
        name: name.trim(),
        personal_color: personal_color ?? undefined,
        skin_concern: skin_concern || undefined,
        desired_image: desired_image ?? undefined,
        memo: memo.trim() || undefined,
      });
      setStoredUser(res.token, res.id);
      navigate("/qr", { replace: true });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <PageWrapper>
      <AppHeader title="SunQ" />
      <h2 style={{ fontFamily: "var(--serif-font)", marginBottom: "var(--spacing)" }}>
        ユーザー情報登録
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
            肌悩み
          </label>
          <TagButtonGroup
            options={SKIN_CONCERNS}
            value={skin_concern}
            onChange={(v) => setSkin_concern(v as string)}
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

        <PrimaryButton type="submit" fullWidth style={{ width: "100%", marginTop: 8 }}>
          登録する
        </PrimaryButton>
      </form>
    </PageWrapper>
  );
}
