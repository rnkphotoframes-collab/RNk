export type Language = 'en' | 'ta';

export interface Category {
  id: string;
  name_en: string;
  name_ta: string;
  slug: string;
  description_en?: string;
  description_ta?: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductImage {
  id: string;
  product_id?: string;
  storage_path: string;
  alt_text_en?: string;
  alt_text_ta?: string;
  display_order: number;
  created_at?: string;
}

export interface ProductSize {
  id: string;
  product_id?: string;
  size_label_en: string; // e.g. "8 x 10 inches"
  size_label_ta: string; // e.g. "8 x 10 அங்குலம்"
  width?: number;
  height?: number;
  measurement_unit: 'inch' | 'cm';
  original_price: number;
  offer_price: number | null;
  is_available: boolean;
  display_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface Product {
  id: string;
  name_en: string;
  name_ta: string;
  slug: string;
  short_description_en: string;
  short_description_ta: string;
  description_en: string;
  description_ta: string;
  category_id: string;
  category_slug?: string;
  category_name_en?: string;
  category_name_ta?: string;
  original_price: number | null;
  offer_price: number | null;
  primary_image_path: string;
  images: ProductImage[];
  sizes: ProductSize[];
  is_active: boolean;
  is_featured: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface ComboIncludedItem {
  id: string;
  name_en: string;
  name_ta: string;
  quantity: number;
}

export interface ReturnGiftCombo {
  id: string;
  name_en: string;
  name_ta: string;
  slug: string;
  description_en: string;
  description_ta: string;
  included_items: ComboIncludedItem[];
  original_price: number;
  offer_price: number | null;
  primary_image_path: string;
  images: string[];
  is_available: boolean;
  is_featured: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export type EnquiryStatus = 'NEW' | 'CONTACTED' | 'RESOLVED' | 'SPAM';
export type EnquiryType = 'product' | 'combo' | 'general' | 'custom_order';

export interface CustomerEnquiry {
  id: string;
  customer_name: string;
  phone_number: string;
  product_id?: string | null;
  product_name?: string | null;
  combo_id?: string | null;
  combo_name?: string | null;
  selected_size?: string | null;
  enquiry_type: EnquiryType;
  message: string;
  status: EnquiryStatus;
  admin_notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Banner {
  id: string;
  image_path: string;
  heading_en: string;
  heading_ta: string;
  subtitle_en: string;
  subtitle_ta: string;
  cta_label_en: string;
  cta_label_ta: string;
  cta_destination: string;
  is_active: boolean;
  display_order: number;
  created_at: string;
}

export interface BusinessSettings {
  business_name: string;
  phone: string;
  whatsapp_number: string;
  location: string;
  address_en: string;
  address_ta: string;
  introduction_en: string;
  introduction_ta: string;
  about_text_en: string;
  about_text_ta: string;
  logo_url: string;
  social_instagram: string;
  social_facebook: string;
  default_language: Language;
  seo_title: string;
  seo_description: string;
  google_maps_url: string;
  updated_at: string;
}

export interface DashboardStats {
  total_products: number;
  active_products: number;
  inactive_products: number;
  total_categories: number;
  total_combos: number;
  new_enquiries: number;
  unresolved_enquiries: number;
}
