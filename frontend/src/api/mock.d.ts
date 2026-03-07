export function registerUser(data: {
  name: string;
  personal_color?: string;
  skin_concern?: string;
  desired_image?: string;
  memo?: string;
}): Promise<{ id: number; name: string; token: string; created_at: string }>;

export function getUser(token: string): Promise<Record<string, unknown>>;

type UserInfoProduct = {
  product_id: number;
  product_name: string;
  brand: string;
  price: number;
  type_name?: unknown;
  is_recommendation?: boolean;
};

export function getUserByToken(token: string): Promise<{
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
}>;

export function updateUser(id: number, data: Record<string, unknown>, token: string): Promise<Record<string, unknown>>;

export function getRecommendations(userId: number): Promise<Array<Record<string, unknown>>>;

export function postReaction(data: { user_id: number; product_id: number; reaction: string | null }): Promise<Record<string, unknown>>;

export function postRecommendation(data: { user_id: number; product_id: number; store_id?: number }): Promise<Record<string, unknown>>;

export function getStores(): Promise<Array<{ id: number; store_name: string }>>;
