/**
 * 16進カラーを [r, g, b] に変換（0-255）
 */
function hexToRgb(hex: string): [number, number, number] | null {
  const m = hex.replace(/^#/, "").match(/^([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i);
  if (!m) return null;
  return [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)];
}

function rgbToHex(r: number, g: number, b: number): string {
  return "#" + [r, g, b].map((x) => Math.round(Math.max(0, Math.min(255, x))).toString(16).padStart(2, "0")).join("");
}

/**
 * 2色を指定比率で混ぜる（amount: 0 = 全部 c1、1 = 全部 c2）
 */
function mixRgb(
  c1: [number, number, number],
  c2: [number, number, number],
  amount: number
): [number, number, number] {
  return [
    c1[0] + (c2[0] - c1[0]) * amount,
    c1[1] + (c2[1] - c1[1]) * amount,
    c1[2] + (c2[2] - c1[2]) * amount,
  ];
}

/**
 * メインカラーから primary-light / primary-dark を算出
 */
export function primaryLightDark(hex: string): { primaryLight: string; primaryDark: string } {
  const rgb = hexToRgb(hex);
  const white: [number, number, number] = [255, 255, 255];
  const black: [number, number, number] = [0, 0, 0];
  if (!rgb) return { primaryLight: hex, primaryDark: hex };
  const light = mixRgb(rgb, white, 0.72);
  const dark = mixRgb(rgb, black, 0.22);
  return {
    primaryLight: rgbToHex(light[0], light[1], light[2]),
    primaryDark: rgbToHex(dark[0], dark[1], dark[2]),
  };
}

import { THEME_PRESETS, getPresetById, getDefaultPreset } from "../constants/themeColors";

const THEME_STORAGE_KEY = "theme_primary";

/** 保存されているテーマID（プリセットid）。互換のため hex が入ってる場合は id に変換 */
export function getStoredThemeId(): string | null {
  try {
    const v = localStorage.getItem(THEME_STORAGE_KEY);
    if (!v) return null;
    if (/^#[0-9a-fA-F]{6}$/.test(v)) {
      const found = THEME_PRESETS.find((p) => p.primary.toLowerCase() === v.toLowerCase());
      return found ? found.id : null;
    }
    return v;
  } catch {
    return null;
  }
}

export function setStoredThemeId(id: string): void {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, id);
  } catch {
    // ignore
  }
}

/**
 * プリセット情報を元に document の CSS 変数を更新
 */
export function applyThemeFromPreset(preset: {
  primary: string;
  bg: string;
  surfaceAlt: string;
}): void {
  const { primaryLight, primaryDark } = primaryLightDark(preset.primary);
  const root = document.documentElement;
  root.style.setProperty("--primary", preset.primary);
  root.style.setProperty("--primary-light", primaryLight);
  root.style.setProperty("--primary-dark", primaryDark);
  root.style.setProperty("--bg", preset.bg);
  root.style.setProperty("--surface-alt", preset.surfaceAlt);
}

/** テーマIDでプリセットを取得して適用 */
export function applyThemeById(id: string): void {
  const preset = getPresetById(id) ?? getDefaultPreset();
  applyThemeFromPreset(preset);
}
