// 本番時は各関数の中身をfetch呼び出しに差し替える

export const registerUser = async (data) => ({
  id: 1,
  name: data.name,
  token: "mock-token-abc123",
  created_at: new Date().toISOString(),
});

export const getUser = async (id) => ({
  id: 1,
  name: "みう",
  token: "mock-token-abc123",
  email: "miu@example.com",
  phone_number: "090-1234-5678",
  personal_color: "ブルベ夏",
  skin_concern: "乾燥肌",
  desired_image: "大人っぽい",
  memo: "香料アレルギーあり",
});

export const getUserByToken = async (token) => ({
  id: 1,
  name: "みう",
  personal_color: "ブルベ夏",
  skin_concern: "乾燥肌",
  desired_image: "大人っぽい",
  memo: "香料アレルギーあり",
  email: "miu@example.com",
  created_at: "2026-03-01T12:00:00",
});

export const updateUser = async (id, data) => ({ id, ...data });

export const getRecommendations = async (userId) => [
  {
    id: 1,
    product: {
      id: 1,
      name: "スキンセンサーベース EX",
      brand: "SHISEIDO",
      category: "化粧下地",
      price: 2200,
      tags: ["乾燥肌向け", "セミマット"],
    },
    staff_comment:
      "乾燥肌さんに優しいセミマット処方。ブルベ夏のお肌に馴染みやすいです。",
    reaction: null,
    store_name: "ルミネ新宿店",
    created_at: "2026-03-01T14:00:00",
  },
  {
    id: 2,
    product: {
      id: 2,
      name: "ウォータリールージュ 01",
      brand: "CEZANNE",
      category: "リップ",
      price: 660,
      tags: ["透け感", "大人っぽい"],
    },
    staff_comment:
      "透け感のある発色で自然な仕上がり。大人っぽいイメージにぴったり！",
    reaction: null,
    store_name: "ルミネ新宿店",
    created_at: "2026-03-01T14:00:00",
  },
];

export const postReaction = async (data) => ({ id: Date.now(), ...data });

export const getProducts = async () => [
  {
    id: 1,
    emoji: "💄",
    name: "スキンセンサーベース EX",
    brand: "SHISEIDO",
    category: "化粧下地",
    price: 2200,
  },
  {
    id: 2,
    emoji: "💋",
    name: "ウォータリールージュ 01",
    brand: "CEZANNE",
    category: "リップ",
    price: 660,
  },
  {
    id: 3,
    emoji: "✨",
    name: "マシュマロフィニッシュパウダー",
    brand: "CANMAKE",
    category: "パウダー",
    price: 880,
  },
];

export const postRecommendation = async (data) => ({ id: Date.now(), ...data });

export const getStores = async () => [{ id: 1, store_name: "ルミネ新宿店" }];
