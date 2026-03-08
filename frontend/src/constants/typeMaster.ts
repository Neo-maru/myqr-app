/**
 * Type マスタ（id / type_group / type_code / type_name）に合わせた定義。
 * DB は type id (整数) を保存。API で type_code のやりとりを想定。
 * value = type_code（API送信・フォーム値）、label = type_name（表示用）。
 */

// type_group=1: パーソナルカラー
export const PERSONAL_COLORS = [
  { value: "SPRING", label: "イエベ春" },
  { value: "SUMMER", label: "ブルベ夏" },
  { value: "AUTUMN", label: "イエベ秋" },
  { value: "WINTER", label: "ブルベ冬" },
] as const;

// type_group=2: 肌悩み
export const SKIN_CONCERNS = [
  { value: "DRY", label: "乾燥肌" },
  { value: "SENSITIVE", label: "敏感肌" },
  { value: "OILY", label: "脂性肌" },
] as const;

// type_group=3: 顔タイプ
export const FACE_TYPES = [
  { value: "CUTE", label: "キュート" },
  { value: "FRESH", label: "フレッシュ" },
  { value: "FEMININE", label: "フェミニン" },
  { value: "COOL", label: "クール" },
  { value: "NATURAL", label: "ナチュラル" },
  { value: "ELEGANT", label: "エレガント" },
  { value: "SOFT_ELEGANT", label: "ソフトエレガント" },
  { value: "ACTIVE_CUTE", label: "アクティブキュート" },
  { value: "COOL_CASUAL", label: "クールカジュアル" },
  { value: "", label: "未選択" },
] as const;

/** type id → type_code（API が id を返す場合にフォームの value に変換） */
export const TYPE_ID_TO_CODE: Record<number, string> = {
  1: "SPRING",
  2: "SUMMER",
  3: "AUTUMN",
  4: "WINTER",
  5: "DRY",
  6: "SENSITIVE",
  7: "OILY",
  8: "CUTE",
  9: "FRESH",
  10: "FEMININE",
  11: "COOL",
  12: "NATURAL",
  13: "ELEGANT",
  14: "SOFT_ELEGANT",
  15: "ACTIVE_CUTE",
  16: "COOL_CASUAL",
  17: "BASE",
  18: "SHADOW",
  19: "LIP",
  20: "MELTY_MOOD",
  21: "UNVEIL",
  22: "RAW_EDGE",
  23: "SOLUM",
  24: "CARE_NOTE",
};

/** type_code → 表示ラベル（type_name） */
export const TYPE_CODE_TO_LABEL: Record<string, string> = {
  SPRING: "イエベ春",
  SUMMER: "ブルベ夏",
  AUTUMN: "イエベ秋",
  WINTER: "ブルベ冬",
  DRY: "乾燥肌",
  SENSITIVE: "敏感肌",
  OILY: "脂性肌",
  CUTE: "キュート",
  FRESH: "フレッシュ",
  FEMININE: "フェミニン",
  COOL: "クール",
  NATURAL: "ナチュラル",
  ELEGANT: "エレガント",
  SOFT_ELEGANT: "ソフトエレガント",
  ACTIVE_CUTE: "アクティブキュート",
  COOL_CASUAL: "クールカジュアル",
  BASE: "下地",
  SHADOW: "アイシャドウ",
  LIP: "リップ",
  MELTY_MOOD: "Melty mood",
  UNVEIL: "unveil",
  RAW_EDGE: "Raw edge",
  SOLUM: "SOLUM",
  CARE_NOTE: "carenote",
};

/** type_name（表示ラベル）→ type_code の逆引き */
const TYPE_LABEL_TO_CODE: Record<string, string> = Object.fromEntries(
  Object.entries(TYPE_CODE_TO_LABEL).map(([code, label]) => [label, code]),
);

/**
 * API の戻り値（id / type_code / type_name のどれか）を type_code に正規化する。
 * フォームの value は type_code で持つ想定。
 */
export function toTypeCode(v: unknown): string {
  if (v == null || v === "") return "";
  if (typeof v === "number" && TYPE_ID_TO_CODE[v]) return TYPE_ID_TO_CODE[v];
  if (typeof v === "string") {
    if (TYPE_ID_TO_CODE[Number(v)]) return TYPE_ID_TO_CODE[Number(v)];
    if (TYPE_CODE_TO_LABEL[v]) return v; // すでに type_code
    if (TYPE_LABEL_TO_CODE[v]) return TYPE_LABEL_TO_CODE[v]; // type_name
    return v;
  }
  return "";
}

/**
 * 表示用ラベルを取得（id / type_code / type_name のどれかから）。
 */
export function toTypeLabel(v: unknown): string {
  if (v == null || v === "") return "";
  const code = toTypeCode(v);
  return TYPE_CODE_TO_LABEL[code] ?? (typeof v === "string" ? v : "");
}
