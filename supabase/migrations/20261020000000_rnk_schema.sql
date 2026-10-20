-- ==============================================================================
-- RNK PHOTO FRAMES — Supabase / PostgreSQL Schema Migration
-- Location: PodaturPet, Tiruttani, Tamil Nadu, India
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS categories (
    id TEXT PRIMARY KEY DEFAULT ('cat-' || uuid_generate_v4()::text),
    name_en TEXT NOT NULL,
    name_ta TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description_en TEXT,
    description_ta TEXT,
    display_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY DEFAULT ('prod-' || uuid_generate_v4()::text),
    name_en TEXT NOT NULL,
    name_ta TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    short_description_en TEXT,
    short_description_ta TEXT,
    description_en TEXT,
    description_ta TEXT,
    category_id TEXT NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
    original_price NUMERIC(10, 2),
    offer_price NUMERIC(10, 2),
    primary_image_path TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    is_featured BOOLEAN NOT NULL DEFAULT false,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT check_prices CHECK (
        (original_price IS NULL OR original_price >= 0) AND
        (offer_price IS NULL OR (original_price IS NOT NULL AND offer_price < original_price AND offer_price >= 0))
    )
);

-- 3. PRODUCT IMAGES TABLE
CREATE TABLE IF NOT EXISTS product_images (
    id TEXT PRIMARY KEY DEFAULT ('img-' || uuid_generate_v4()::text),
    product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    storage_path TEXT NOT NULL,
    alt_text_en TEXT,
    alt_text_ta TEXT,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. PRODUCT SIZES AND PRICES TABLE
CREATE TABLE IF NOT EXISTS product_sizes (
    id TEXT PRIMARY KEY DEFAULT ('size-' || uuid_generate_v4()::text),
    product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    size_label_en TEXT NOT NULL,
    size_label_ta TEXT NOT NULL,
    width NUMERIC(6, 2),
    height NUMERIC(6, 2),
    measurement_unit TEXT NOT NULL DEFAULT 'inch',
    original_price NUMERIC(10, 2) NOT NULL CHECK (original_price >= 0),
    offer_price NUMERIC(10, 2),
    is_available BOOLEAN NOT NULL DEFAULT true,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT check_size_offer_price CHECK (
        offer_price IS NULL OR (offer_price < original_price AND offer_price >= 0)
    )
);

-- 5. RETURN GIFT COMBOS TABLE
CREATE TABLE IF NOT EXISTS return_gift_combos (
    id TEXT PRIMARY KEY DEFAULT ('combo-' || uuid_generate_v4()::text),
    name_en TEXT NOT NULL,
    name_ta TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description_en TEXT,
    description_ta TEXT,
    included_items JSONB NOT NULL DEFAULT '[]'::jsonb,
    original_price NUMERIC(10, 2) NOT NULL CHECK (original_price >= 0),
    offer_price NUMERIC(10, 2),
    primary_image_path TEXT,
    images JSONB NOT NULL DEFAULT '[]'::jsonb,
    is_available BOOLEAN NOT NULL DEFAULT true,
    is_featured BOOLEAN NOT NULL DEFAULT false,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT check_combo_offer_price CHECK (
        offer_price IS NULL OR (offer_price < original_price AND offer_price >= 0)
    )
);

-- 6. ENQUIRIES TABLE
CREATE TABLE IF NOT EXISTS enquiries (
    id TEXT PRIMARY KEY DEFAULT ('enq-' || uuid_generate_v4()::text),
    customer_name TEXT NOT NULL,
    phone_number TEXT NOT NULL,
    product_id TEXT REFERENCES products(id) ON DELETE SET NULL,
    product_name TEXT,
    combo_id TEXT REFERENCES return_gift_combos(id) ON DELETE SET NULL,
    combo_name TEXT,
    selected_size TEXT,
    enquiry_type TEXT NOT NULL DEFAULT 'general' CHECK (enquiry_type IN ('product', 'combo', 'general', 'custom_order')),
    message TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'NEW' CHECK (status IN ('NEW', 'CONTACTED', 'RESOLVED', 'SPAM')),
    admin_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 7. BANNERS TABLE
CREATE TABLE IF NOT EXISTS banners (
    id TEXT PRIMARY KEY DEFAULT ('banner-' || uuid_generate_v4()::text),
    image_path TEXT NOT NULL,
    heading_en TEXT NOT NULL,
    heading_ta TEXT NOT NULL,
    subtitle_en TEXT,
    subtitle_ta TEXT,
    cta_label_en TEXT NOT NULL DEFAULT 'Explore',
    cta_label_ta TEXT NOT NULL DEFAULT 'பார்வையிட',
    cta_destination TEXT NOT NULL DEFAULT '/catalogue',
    is_active BOOLEAN NOT NULL DEFAULT true,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 8. BUSINESS SETTINGS TABLE
CREATE TABLE IF NOT EXISTS business_settings (
    id TEXT PRIMARY KEY DEFAULT 'primary',
    business_name TEXT NOT NULL DEFAULT 'RNK Photo Frames',
    phone TEXT NOT NULL DEFAULT '+91 8681917433',
    whatsapp_number TEXT NOT NULL DEFAULT '+91 8681917433',
    location TEXT NOT NULL DEFAULT 'PodaturPet, Tiruttani, Tamil Nadu, India',
    address_en TEXT,
    address_ta TEXT,
    introduction_en TEXT,
    introduction_ta TEXT,
    about_text_en TEXT,
    about_text_ta TEXT,
    logo_url TEXT,
    social_instagram TEXT,
    social_facebook TEXT,
    default_language TEXT NOT NULL DEFAULT 'en',
    seo_title TEXT,
    seo_description TEXT,
    google_maps_url TEXT,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- INDEXES
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(is_featured);
CREATE INDEX IF NOT EXISTS idx_combos_slug ON return_gift_combos(slug);
CREATE INDEX IF NOT EXISTS idx_combos_active ON return_gift_combos(is_available);
CREATE INDEX IF NOT EXISTS idx_enquiries_status ON enquiries(status);
CREATE INDEX IF NOT EXISTS idx_enquiries_created ON enquiries(created_at DESC);

-- ROW LEVEL SECURITY (RLS)
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_sizes ENABLE ROW LEVEL SECURITY;
ALTER TABLE return_gift_combos ENABLE ROW LEVEL SECURITY;
ALTER TABLE enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_settings ENABLE ROW LEVEL SECURITY;

-- 1. Public Read Policies (Only active/published content)
CREATE POLICY "Public read active categories" ON categories FOR SELECT USING (is_active = true);
CREATE POLICY "Public read active products" ON products FOR SELECT USING (is_active = true);
CREATE POLICY "Public read product images" ON product_images FOR SELECT USING (
    EXISTS (SELECT 1 FROM products WHERE products.id = product_images.product_id AND products.is_active = true)
);
CREATE POLICY "Public read available sizes" ON product_sizes FOR SELECT USING (
    is_available = true AND
    EXISTS (SELECT 1 FROM products WHERE products.id = product_sizes.product_id AND products.is_active = true)
);
CREATE POLICY "Public read available combos" ON return_gift_combos FOR SELECT USING (is_available = true);
CREATE POLICY "Public read active banners" ON banners FOR SELECT USING (is_active = true);
CREATE POLICY "Public read business settings" ON business_settings FOR SELECT USING (true);

-- 2. Public Enquiry Submission (Insert Only with validation)
CREATE POLICY "Public create enquiries" ON enquiries FOR INSERT WITH CHECK (
    customer_name IS NOT NULL AND
    length(customer_name) >= 2 AND
    phone_number IS NOT NULL AND
    length(phone_number) >= 8
);

-- 3. Admin Full Access Policies (Authenticated admin role)
CREATE POLICY "Admin full categories" ON categories FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full products" ON products FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full product images" ON product_images FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full product sizes" ON product_sizes FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full combos" ON return_gift_combos FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full enquiries" ON enquiries FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full banners" ON banners FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full settings" ON business_settings FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- SEED THE 6 MANDATORY CATEGORIES
INSERT INTO categories (id, name_en, name_ta, slug, description_en, description_ta, display_order, is_active)
VALUES
    ('cat-photo-frames', 'Photo Frames', 'போட்டோ ஃப்ரேம்கள்', 'photo-frames', 'Classic wooden, gold-rimmed, and contemporary frames for timeless family memories.', 'பாரம்பரிய மர வேலைப்பாடு மற்றும் நவீன பாணியிலான நேர்த்தியான போட்டோ ஃப்ரேம்கள்.', 1, true),
    ('cat-return-gifts', 'Return Gift Combos', 'ரிட்டர்ன் கிஃப்ட் காம்போக்கள்', 'return-gift-combos', 'Curated gift combos with personalized mini frames, bag, and spiritual tokens for guests.', 'திருமணம் மற்றும் விசேஷங்களுக்கு விருந்தினர்களுக்கு வழங்கக்கூடிய சிறப்பு பரிசு காம்போக்கள்.', 2, true),
    ('cat-customized', 'Customized Frames', 'தனிப்பயனாக்கப்பட்ட ஃப்ரேம்கள்', 'customized-frames', 'Bespoke collage frames, acrylic cutouts, name boards, and customized song/date plaques.', 'பெயர்கள், தேதிகள் மற்றும் பிரத்யேக வடிவமைப்புடன் உருவாக்கப்படும் பிரத்தியேக ஃப்ரேம்கள்.', 3, true),
    ('cat-birthday', 'Birthday Frames', 'பிறந்தநாள் ஃப்ரேம்கள்', 'birthday-frames', 'Joyful milestone collage designs and themed memory frames for boys, girls, and adults.', 'பிறந்தநாள் நினைவுகளை என்றும் நினைவில் நிறுத்த உதவும் வண்ணமயமான போட்டோ ஃப்ரேம்கள்.', 4, true),
    ('cat-wedding', 'Wedding Frames', 'திருமண ஃப்ரேம்கள்', 'wedding-frames', 'Regal bridal portraits, couple anniversary boards, and gold-embossed holy blessing frames.', 'மணமக்கள் மற்றும் திருமண நாள் நினைவுகளை போற்றும் ராஜரீக தங்க நிற பார்டர் ஃப்ரேம்கள்.', 5, true),
    ('cat-other-gifts', 'Other Gift Items', 'பிற பரிசுப் பொருட்கள்', 'other-gift-items', 'Customized keychains, acrylic clocks, desktop stands, and devotional art plaques.', 'மேஜை அலங்கார பொருட்கள், சாவி கொத்துகள், மற்றும் ஆன்மீக பரிசு பொருட்கள்.', 6, true)
ON CONFLICT (slug) DO NOTHING;
