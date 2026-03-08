/** 1テーマの定義（名前・メイン色・背景系） */
export type ThemePreset = {
  id: string;
  name: string;
  primary: string;
  /** 背景色（primary のごく薄いトーン） */
  bg: string;
  /** 表面の代替色（カード背景など） */
  surfaceAlt: string;
};

/** デフォルトのテーマID（index.css の --primary と一致） */
export const DEFAULT_THEME_ID = "coral";

/** テーマのプリセット（背景もセット） */
export const THEME_PRESETS: ThemePreset[] = [
  { id: "coral", name: "コーラル", primary: "#c4846a", bg: "#f8f4ef", surfaceAlt: "#f2ece5" },
  { id: "rose", name: "ローズ", primary: "#c4726a", bg: "#f8f2f1", surfaceAlt: "#f0e6e4" },
  { id: "beige", name: "ベージュ", primary: "#a89080", bg: "#f6f3f0", surfaceAlt: "#eee8e4" },
  { id: "mint", name: "ミント", primary: "#6a9c8c", bg: "#f0f6f4", surfaceAlt: "#e4eeeb" },
  { id: "sage", name: "サージ", primary: "#6a7a9c", bg: "#f2f3f6", surfaceAlt: "#e6e8ee" },
  { id: "lavender", name: "ラベンダー", primary: "#8a7a9c", bg: "#f4f2f6", surfaceAlt: "#ebe8ee" },
  { id: "olive", name: "オリーブ", primary: "#8a9c6a", bg: "#f4f6f0", surfaceAlt: "#eaeee4" },
];

export function getPresetById(id: string): ThemePreset | undefined {
  return THEME_PRESETS.find((p) => p.id === id);
}

export function getDefaultPreset(): ThemePreset {
  return THEME_PRESETS.find((p) => p.id === DEFAULT_THEME_ID) ?? THEME_PRESETS[0];
}
