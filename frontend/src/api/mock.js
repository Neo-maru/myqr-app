// フロント単体の動作確認用。本番では client に差し替える。

export const registerUser = async (data) => ({
  id: 1,
  name: data.name,
  token: "mock-token-abc123",
  created_at: new Date().toISOString(),
});

/** 引数は token（ページが getUser(token) で呼ぶため） */
export const getUser = async (token) => ({
  id: 1,
  user_id: 1,
  name: "みう",
  personal_color: "SUMMER",
  skin_concern: "DRY",
  memo: "香料アレルギーあり",
  face_type: "ELEGANT",
  desired_image: "ELEGANT",
});

const mockProductsByCategory = [
  { product_id: 1, product_name: "スキンセンサーベース EX", brand: "SHISEIDO", price: 2200, type_name: ["乾燥肌向け"], is_recommendation: false },
  { product_id: 2, product_name: "ポアプリベース", brand: "CANMAKE", price: 715, type_name: [], is_recommendation: false },
  { product_id: 3, product_name: "ウォータリールージュ 01", brand: "CEZANNE", price: 660, type_name: ["透け感"], is_recommendation: false },
  { product_id: 4, product_name: "パウダーアイシャドウ N", brand: "CANMAKE", price: 715, type_name: ["ナチュラル"], is_recommendation: false },
];

/** StaffView 用: base_info / shadow_info / lip_info を返す */
export const getUserByToken = async (token) => ({
  id: 1,
  user_id: 1,
  name: "みう",
  personal_color: "SUMMER",
  skin_concern: "DRY",
  desired_image: "ELEGANT",
  face_type: "ELEGANT",
  memo: "香料アレルギーあり",
  base_info: mockProductsByCategory.slice(0, 2),
  shadow_info: mockProductsByCategory.slice(2, 3),
  lip_info: mockProductsByCategory.slice(3, 4),
});

/** 引数 (id, data, token) でページと揃える */
export const updateUser = async (id, data, token) => ({ id, ...data });

/** 戻り値は client の getRecommendations と同じ形（平坦リスト・staff_comment なし） */
export const getRecommendations = async (userId) => [
  {
    id: 1,
    product: { id: 1, name: "スキンセンサーベース EX", brand: "SHISEIDO", category: "下地", price: 2200, tags: ["乾燥肌向け", "セミマット"] },
    reaction: null,
    store_name: "ルミネ新宿店",
    created_at: "2026-03-01T14:00:00",
  },
  {
    id: 2,
    product: { id: 2, name: "ウォータリールージュ 01", brand: "CEZANNE", category: "リップ", price: 660, tags: ["透け感", "大人っぽい"] },
    reaction: null,
    store_name: "ルミネ新宿店",
    created_at: "2026-03-01T14:00:00",
  },
  {
    id: 5,
    product: { id: 5, name: "パウダーアイシャドウ N", brand: "CANMAKE", category: "アイシャドウ", price: 715, tags: ["ナチュラル"] },
    reaction: null,
    store_name: "ルミネ新宿店",
    created_at: "2026-03-01T14:00:00",
  },
];

/** ページは { user_id, product_id, reaction } で呼ぶ */
export const postReaction = async (data) => ({ id: Date.now(), ...data });

export const postRecommendation = async (data) => ({ id: Date.now(), ...data });

export const getStores = async () => [{ id: 1, store_name: "ルミネ新宿店" }];
