// Sector model based on API response
export interface Combo {
  id: number;
  name: string;
  price: number;
  description: string | null;
  image: string | null;
  sector_id: number;
  product_ids: number[];
  stock_quantity?: number;
  min_stock_level?: number;
  max_stock_level?: number;
  unit?: string;
  created_at: string;
  updated_at: string;
}

export interface Content {
  id: number;
  title: string;
  content: string;
  image: string | null;
  brand: string;
  category: string;
  sector_id: number;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: number;
  name: string;
  description: string | null;
  price: number;
  image: string | null;
  category_id: number;
  sector_id: number;
  brand_id: number;
  stock_quantity?: number;
  min_stock_level?: number;
  max_stock_level?: number;
  unit?: string;
  created_at: string;
  updated_at: string;
}

export interface Sector {
  id: number;
  name: string;
  description: string | null;
  image: string | null;
  products?: Product[];
  contents?: Content[];
  list_combos?: Combo[]; // Keep for backward compatibility
  list_contents?: Content[]; // Keep for backward compatibility
  created_at: string;
  updated_at: string;
}
