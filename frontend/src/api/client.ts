/**
 * 実API用クライアント（develop ブランチのバックエンドに合わせたパス・メソッド・レスポンス）
 * ベースURL: VITE_API_BASE_URL（例: http://localhost:8000/api/v1）
 */

const getBaseUrl = (): string => {
  const url = import.meta.env.VITE_API_BASE_URL;
  if (!url) {
    console.warn("VITE_API_BASE_URL が未設定です");
    return "";
  }
  return url.replace(/\/$/, "");
};

async function request<T>(
  method: string,
  path: string,
  body?: Record<string, unknown>
): Promise<T> {
  const base = getBaseUrl();
  const url = path.startsWith("http") ? path : `${base}${path.startsWith("/") ? path : `/${path}`}`;
  const options: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
  };
  if (body !== undefined && method !== "GET") {
    options.body = JSON.stringify(body);
  }
  const res = await fetch(url, options);
  if (!res.ok) {
    const text = await res.text();
    console.error(`API ${method} ${path}: ${res.status}`, text);
    throw new Error(text || `API error ${res.status}`);
  }
  const contentType = res.headers.get("Content-Type");
  if (contentType?.includes("application/json")) {
    return res.json() as Promise<T>;
  }
  return undefined as unknown as T;
}

// --- API レスポンス型（設計書のパラメータ名） ---

type UserGetResponse = {
  user_id: number;
  name: string;
  personal_color?: string | null;
  skin_concern?: string | null;
  memo?: string | null;
  face_type?: string | null;
};

type UserPostResponse = {
  token: string;
  user_id: number;
  qr_id?: string;
  name: string;
  personal_color?: string | null;
  skin_concern?: string | null;
  face_type?: string | null;
};

/** バックエンド store/get は単体で { id, name } を返す */
type StoreGetResponse = {
  id: number;
  name: string;
};

type CategoryProduct = {
  product_id: number;
  product_name: string;
  brand: string;
  price: number;
  type_id?: string[] | unknown;
  type_name?: string[] | unknown;
  reaction?: string | null;
  is_recommendation?: boolean;
};

type RecommendationGetResponse = {
  user_id: number;
  base_info?: CategoryProduct[];
  shadow_info?: CategoryProduct[];
  lip_info?: CategoryProduct[];
};

type UserInfoProduct = {
  product_id: number;
  product_name: string;
  brand: string;
  price: number;
  type_name?: string[] | unknown;
  is_recommendation?: boolean;
};

type UserInfoGetResponse = {
  user_id: number;
  name: string;
  personal_color?: string | null;
  skin_concern?: string | null;
  memo?: string | null;
  face_type?: string | null;
  base_info?: UserInfoProduct[];
  shadow_info?: UserInfoProduct[];
  lip_info?: UserInfoProduct[];
};

// フロント用: カテゴリ名マッピング（API base_info → 下地, shadow_info → アイシャドウ, lip_info → リップ）
const CATEGORY_MAP = {
  base_info: "下地",
  shadow_info: "アイシャドウ",
  lip_info: "リップ",
} as const;

/** おすすめ取得レスポンスをフロント用の平坦リストに変換 */
function flattenRecommendations(res: RecommendationGetResponse): Array<{
  id: number;
  product: { id: number; name: string; brand: string; category: string; price: number; tags?: string[] };
  reaction: string | null;
  store_name: string;
  created_at: string;
}> {
  const out: Array<{
    id: number;
    product: { id: number; name: string; brand: string; category: string; price: number; tags?: string[] };
    reaction: string | null;
    store_name: string;
    created_at: string;
  }> = [];
  const entries: (keyof typeof CATEGORY_MAP)[] = ["base_info", "shadow_info", "lip_info"];
  for (const key of entries) {
    const list = res[key];
    const category = CATEGORY_MAP[key];
    if (!Array.isArray(list)) continue;
    for (const p of list) {
      const tags = Array.isArray(p.type_id)
        ? p.type_id
        : Array.isArray(p.type_name)
          ? p.type_name
          : undefined;
      const reaction = p.reaction ?? null;
      out.push({
        id: p.product_id,
        product: {
          id: p.product_id,
          name: p.product_name,
          brand: p.brand,
          category,
          price: p.price,
          tags,
        },
        reaction,
        store_name: "",
        created_at: "",
      });
    }
  }
  return out;
}

// --- ユーザー ---

/** ユーザー情報取得: POST /user/user/get（バックエンドの prefix + path に合わせる） */
export async function getUser(token: string): Promise<Record<string, unknown> & { id: number }> {
  const res = await request<UserGetResponse>("POST", "/user/user/get", { token });
  return {
    id: res.user_id,
    user_id: res.user_id,
    name: res.name,
    personal_color: res.personal_color ?? undefined,
    skin_concern: res.skin_concern ?? undefined,
    memo: res.memo ?? undefined,
    face_type: res.face_type ?? undefined,
    desired_image: res.face_type ?? undefined,
  } as Record<string, unknown> & { id: number };
}

/** ユーザー新規登録: POST /user/post（token・user_id なし） */
export async function registerUser(data: {
  name: string;
  personal_color?: string;
  skin_concern?: string;
  desired_image?: string;
  face_type?: string;
  memo?: string;
}): Promise<{ id: number; name: string; token: string; created_at: string }> {
  const body: Record<string, unknown> = {
    name: data.name,
    personal_color: data.personal_color ?? null,
    skin_concern: data.skin_concern ?? null,
    memo: data.memo ?? null,
    face_type: data.face_type ?? data.desired_image ?? null,
  };
  const res = await request<UserPostResponse>("POST", "/user/user/post", body);
  return {
    id: res.user_id,
    name: res.name,
    token: res.token,
    created_at: new Date().toISOString(),
  };
}

/** ユーザー更新: POST /user/user/post（token と user_id を付与） */
export async function updateUser(
  id: number,
  data: Record<string, unknown>,
  token: string
): Promise<Record<string, unknown>> {
  const body: Record<string, unknown> = {
    ...data,
    user_id: id,
    token,
    face_type: data.face_type ?? data.desired_image ?? null,
  };
  return request("POST", "/user/user/post", body);
}

/** お客様情報取得: GET /user_info/user_info/get/{qr_id}（バックエンドの prefix + path に合わせる） */
export async function getUserByToken(
  token: string
): Promise<{
  id: number;
  name: string;
  personal_color?: string | null;
  skin_concern?: string | null;
  memo?: string | null;
  face_type?: string | null;
  desired_image?: string | null;
  base_info?: UserInfoProduct[];
  shadow_info?: UserInfoProduct[];
  lip_info?: UserInfoProduct[];
}> {
  const path = `/user_info/user_info/get/${encodeURIComponent(token)}`;
  const res = await request<UserInfoGetResponse>("GET", path);
  return {
    id: res.user_id,
    name: res.name,
    personal_color: res.personal_color ?? null,
    skin_concern: res.skin_concern ?? null,
    memo: res.memo ?? null,
    face_type: res.face_type ?? null,
    desired_image: res.face_type ?? null,
    base_info: res.base_info ?? [],
    shadow_info: res.shadow_info ?? [],
    lip_info: res.lip_info ?? [],
  };
}

// --- おすすめ・リアクション ---

/** おすすめ商品取得: POST /recommendation/get → フロント用に平坦化して返す */
export async function getRecommendations(
  userId: number
): Promise<Array<{
  id: number;
  product: { id: number; name: string; brand: string; category: string; price: number; tags?: string[] };
  reaction: string | null;
  store_name: string;
  created_at: string;
}>> {
  const res = await request<RecommendationGetResponse>("POST", "/recommendation/recommendation/get", {
    user_id: userId,
  });
  return flattenRecommendations(res);
}

/** おすすめ商品の登録: POST /recommendation/recommendation/post */
export async function postRecommendation(data: {
  user_id: number;
  product_id: number;
}): Promise<void> {
  await request("POST", "/recommendation/recommendation/post", data as Record<string, unknown>);
}

/** リアクション登録: POST /reaction/reaction/post */
export async function postReaction(data: {
  user_id: number;
  product_id: number;
  reaction: string | null;
}): Promise<void> {
  await request("POST", "/reaction/reaction/post", data as Record<string, unknown>);
}

// --- 店舗 ---

/** 店舗情報取得: POST /store/store/get（バックエンドは単体 { id, name } を返す → 配列1件に変換） */
export async function getStores(): Promise<Array<{ id: number; store_name: string }>> {
  const res = await request<StoreGetResponse>("POST", "/store/store/get");
  if (!res || typeof res.id === "undefined") return [];
  return [{ id: res.id, store_name: res.name }];
}
