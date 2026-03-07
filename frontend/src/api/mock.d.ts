export function registerUser(data: {
  name: string;
  email: string;
  phone_number: string;
  personal_color?: string;
  skin_concern?: string;
  desired_image?: string;
  memo?: string;
}): Promise<{ id: number; name: string; token: string; created_at: string }>;

export function getUser(id: number): Promise<Record<string, unknown>>;

export function getUserByToken(token: string): Promise<Record<string, unknown> & { id: number }>;

export function updateUser(id: number, data: Record<string, unknown>): Promise<Record<string, unknown>>;

export function getRecommendations(userId: number): Promise<Array<Record<string, unknown>>>;

export function postReaction(data: { recommendation_id: number; reaction_type: string | null }): Promise<Record<string, unknown>>;

export function getProducts(): Promise<Array<Record<string, unknown>>>;

export function postRecommendation(data: {
  user_id: number;
  product_id: number;
  staff_comment?: string;
  store_id: number;
}): Promise<Record<string, unknown>>;

export function getStores(): Promise<Array<{ id: number; store_name: string }>>;
