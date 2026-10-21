import fs from 'fs';
import path from 'path';
import {
  Category,
  Product,
  ReturnGiftCombo,
  CustomerEnquiry,
  Banner,
  BusinessSettings,
  DashboardStats,
  EnquiryStatus,
  ProductSize,
  ProductImage
} from '../types/index.js';

const isServerless = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.NOW_REGION);
const DATA_DIR = isServerless
  ? path.resolve('/tmp', 'rnk_data')
  : path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'rnk_database.json');

interface DatabaseSchema {
  categories: Category[];
  products: Product[];
  combos: ReturnGiftCombo[];
  enquiries: CustomerEnquiry[];
  banners: Banner[];
  settings: BusinessSettings;
}

const DEFAULT_CATEGORIES: Category[] = [
  {
    id: 'cat-photo-frames',
    name_en: 'Photo Frames',
    name_ta: 'போட்டோ ஃப்ரேம்கள்',
    slug: 'photo-frames',
    description_en: 'Classic wooden, gold-rimmed, and contemporary frames for timeless family memories.',
    description_ta: 'பாரம்பரிய மர வேலைப்பாடு மற்றும் நவீன பாணியிலான நேர்த்தியான போட்டோ ஃப்ரேம்கள்.',
    display_order: 1,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'cat-return-gifts',
    name_en: 'Return Gift Combos',
    name_ta: 'ரிட்டர்ன் கிஃப்ட் காம்போக்கள்',
    slug: 'return-gift-combos',
    description_en: 'Curated gift combos with personalized mini frames, bag, and spiritual tokens for guests.',
    description_ta: 'திருமணம் மற்றும் விசேஷங்களுக்கு விருந்தினர்களுக்கு வழங்கக்கூடிய சிறப்பு பரிசு காம்போக்கள்.',
    display_order: 2,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'cat-customized',
    name_en: 'Customized Frames',
    name_ta: 'தனிப்பயனாக்கப்பட்ட ஃப்ரேம்கள்',
    slug: 'customized-frames',
    description_en: 'Bespoke collage frames, acrylic cutouts, name boards, and customized song/date plaques.',
    description_ta: 'பெயர்கள், தேதிகள் மற்றும் பிரத்யேக வடிவமைப்புடன் உருவாக்கப்படும் பிரத்தியேக ஃப்ரேம்கள்.',
    display_order: 3,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'cat-birthday',
    name_en: 'Birthday Frames',
    name_ta: 'பிறந்தநாள் ஃப்ரேம்கள்',
    slug: 'birthday-frames',
    description_en: 'Joyful milestone collage designs and themed memory frames for boys, girls, and adults.',
    description_ta: 'பிறந்தநாள் நினைவுகளை என்றும் நினைவில் நிறுத்த உதவும் வண்ணமயமான போட்டோ ஃப்ரேம்கள்.',
    display_order: 4,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'cat-wedding',
    name_en: 'Wedding Frames',
    name_ta: 'திருமண ஃப்ரேம்கள்',
    slug: 'wedding-frames',
    description_en: 'Regal bridal portraits, couple anniversary boards, and gold-embossed holy blessing frames.',
    description_ta: 'மணமக்கள் மற்றும் திருமண நாள் நினைவுகளை போற்றும் ராஜரீக தங்க நிற பார்டர் ஃப்ரேம்கள்.',
    display_order: 5,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'cat-other-gifts',
    name_en: 'Other Gift Items',
    name_ta: 'பிற பரிசுப் பொருட்கள்',
    slug: 'other-gift-items',
    description_en: 'Customized keychains, acrylic clocks, desktop stands, and devotional art plaques.',
    description_ta: 'மேஜை அலங்கார பொருட்கள், சாவி கொத்துகள், மற்றும் ஆன்மீக பரிசு பொருட்கள்.',
    display_order: 6,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const DEFAULT_SETTINGS: BusinessSettings = {
  business_name: 'RNK Photo Frames',
  phone: '+91 8681917433',
  whatsapp_number: '+91 8681917433',
  location: 'PodaturPet, Tiruttani, Tamil Nadu, India',
  address_en: 'Main Bazaar Road, PodaturPet, Tiruttani Taluk, Tiruvallur District, Tamil Nadu - 631208',
  address_ta: 'மெயின் பஜார் சாலை, பொதட்டூர்பேட்டை, திருத்தணி தாலுகா, திருவள்ளூர் மாவட்டம், தமிழ்நாடு - 631208',
  introduction_en: 'Welcome to RNK Photo Frames, where memories are preserved in timeless craftsmanship. Located in PodaturPet near Tiruttani, we specialize in luxury wooden frames, bespoke couple frames, vibrant birthday collages, and thoughtful wedding return gift combos.',
  introduction_ta: 'பொதட்டூர்பேட்டை மற்றும் திருத்தணி பகுதியில் சிறந்த போட்டோ ஃப்ரேம்ஸ், திருமண நினைவுகள், பிறந்தநாள் பரிசுகள் மற்றும் விசேஷங்களுக்கான ரிட்டர்ன் கிஃப்ட் காம்போக்களை மிக உயர்ந்த தரத்தில் தயாரித்து வழங்குகிறோம்.',
  about_text_en: 'RNK Photo Frames was established with a singular passion: turning fleeting moments into everlasting treasures. Every frame is assembled with high-density moisture-resistant backboards, premium glass or unbreakable acrylic, and meticulous finishing.',
  about_text_ta: 'உங்கள் பொன்னான தருணங்களை காலத்தால் அழியாத கலையாக மாற்றுவதே எங்கள் நோக்கம். நீடித்த உழைப்பும், நேர்த்தியான வடிவமைப்பும் கொண்ட போட்டோ ஃப்ரேம்களை நியாயமான விலையில் வழங்குகிறோம்.',
  logo_url: '/logo.png',
  social_instagram: 'https://instagram.com',
  social_facebook: 'https://facebook.com',
  default_language: 'en',
  seo_title: 'RNK Photo Frames | Premium Photo Frames & Return Gift Combos | PodaturPet, Tiruttani',
  seo_description: 'Premium handcrafted photo frames, return gift combos, and customized gifts in PodaturPet, Tiruttani. Enquire via WhatsApp or Call +91 8681917433.',
  google_maps_url: 'https://maps.google.com/?q=Podaturpet,Tiruttani,Tamil+Nadu',
  updated_at: new Date().toISOString(),
};

const DEFAULT_BANNERS: Banner[] = [
  {
    id: 'banner-1',
    image_path: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=1600',
    heading_en: 'Frames That Preserve Your Beautiful Moments',
    heading_ta: 'உங்கள் அழகான நினைவுகளை என்றும் பாதுகாக்கும் ஃப்ரேம்கள்',
    subtitle_en: 'Handcrafted luxury photo frames, bridal portraits & customized return gifts from PodaturPet, Tiruttani.',
    subtitle_ta: 'பொதட்டூர்பேட்டையில் சிறந்த தரத்தில் போட்டோ ஃப்ரேம்கள் மற்றும் விசேஷங்களுக்கான பரிசு காம்போக்கள்.',
    cta_label_en: 'Explore Catalogue',
    cta_label_ta: 'பொருட்களைப் பார்க்க',
    cta_destination: '/catalogue',
    is_active: true,
    display_order: 1,
    created_at: new Date().toISOString(),
  },
  {
    id: 'banner-2',
    image_path: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=1600',
    heading_en: 'Wedding & Celebration Return Gift Combos',
    heading_ta: 'திருமண மற்றும் விசேஷங்களுக்கான சிறப்பு ரிட்டர்ன் கிஃப்ட் காம்போக்கள்',
    subtitle_en: 'Delight your cherished guests with personalized photo frames, divine blessings & elegant packaging.',
    subtitle_ta: 'உங்கள் விசேஷத்திற்கு வருகை தரும் விருந்தினர்களுக்கு அன்பான நினைவாக வழங்க சிறந்த தேர்வுகள்.',
    cta_label_en: 'View Gift Combos',
    cta_label_ta: 'காம்போக்களைப் பார்க்க',
    cta_destination: '/combos',
    is_active: true,
    display_order: 2,
    created_at: new Date().toISOString(),
  },
];

const DEFAULT_PRODUCTS: Product[] = [
  {
    id: 'prod-classic-gold-teak',
    name_en: 'Royal Antique Gold Carved Wooden Frame',
    name_ta: 'ராயல் ஆன்டிக் தங்க வேலைப்பாடு மர ஃப்ரேம்',
    slug: 'royal-antique-gold-carved-wooden-frame',
    short_description_en: 'Traditional filigree gold-leaf finished frame perfect for family portraits and deity blessings.',
    short_description_ta: 'குடும்ப புகைப்படங்கள் மற்றும் சாமி படங்களுக்கு ஏற்ற ஆன்டிக் தங்க பார்டர் கொண்ட நேர்த்தியான ஃப்ரேம்.',
    description_en: 'Hand-carved synthetic teak border with deep gold leaf gilding. Features 2mm distortion-free glass, velvet moisture-proof back support, and wall mount hooks for both landscape and portrait orientation.',
    description_ta: 'நீடித்த உழைக்கும் சிந்தெடிக் தேக்கு பார்டர் மற்றும் தங்க வேலைப்பாடு. உயர்தர கண்ணாடி மற்றும் ஈரப்பதம் புகாத பேனல் உடன் வருகிறது.',
    category_id: 'cat-photo-frames',
    original_price: null,
    offer_price: null,
    primary_image_path: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&q=80&w=1000',
    images: [
      {
        id: 'img-1-1',
        storage_path: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&q=80&w=1000',
        alt_text_en: 'Antique gold carved frame front view',
        alt_text_ta: 'தங்க வேலைப்பாடு ஃப்ரேம் முன் தோற்றம்',
        display_order: 1,
      },
      {
        id: 'img-1-2',
        storage_path: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=1000',
        alt_text_en: 'Gold frame corner detail',
        alt_text_ta: 'ஃப்ரேம் மூலையின் நுணுக்கம்',
        display_order: 2,
      },
    ],
    sizes: [
      {
        id: 'size-1-1',
        size_label_en: '6 x 8 inches',
        size_label_ta: '6 x 8 அங்குலம்',
        width: 6,
        height: 8,
        measurement_unit: 'inch',
        original_price: 350,
        offer_price: 290,
        is_available: true,
        display_order: 1,
      },
      {
        id: 'size-1-2',
        size_label_en: '8 x 10 inches',
        size_label_ta: '8 x 10 அங்குலம்',
        width: 8,
        height: 10,
        measurement_unit: 'inch',
        original_price: 490,
        offer_price: 399,
        is_available: true,
        display_order: 2,
      },
      {
        id: 'size-1-3',
        size_label_en: '10 x 12 inches',
        size_label_ta: '10 x 12 அங்குலம்',
        width: 10,
        height: 12,
        measurement_unit: 'inch',
        original_price: 650,
        offer_price: 549,
        is_available: true,
        display_order: 3,
      },
      {
        id: 'size-1-4',
        size_label_en: '12 x 18 inches',
        size_label_ta: '12 x 18 அங்குலம்',
        width: 12,
        height: 18,
        measurement_unit: 'inch',
        original_price: 1100,
        offer_price: 899,
        is_available: true,
        display_order: 4,
      },
    ],
    is_active: true,
    is_featured: true,
    display_order: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'prod-wedding-portrait-deluxe',
    name_en: 'Grand Bridal & Wedding Couple Portrait Frame',
    name_ta: 'கிராண்ட் மணமக்கள் திருமண உருவப்பட ஃப்ரேம்',
    slug: 'grand-bridal-wedding-couple-portrait-frame',
    short_description_en: 'Opulent dual-matte wedding memory frame with champagne gold borders.',
    short_description_ta: 'திருமண நினைவுகளை அழகாக்கும் இரட்டை மேட் மற்றும் ஷாம்பெயின் தங்க பார்டர் ஃப்ரேம்.',
    description_en: 'Specially crafted for wedding stages and master bedrooms. Incorporates custom UV-laminated archival print protection to safeguard photographs from sunlight fading.',
    description_ta: 'வெயிலினாலும் காலத்தினாலும் மங்காத UV லேமினேஷன் செய்யப்பட்ட புகைப்படப் பாதுகாப்புடன் கூடிய திருமண ஃப்ரேம்.',
    category_id: 'cat-wedding',
    original_price: null,
    offer_price: null,
    primary_image_path: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=1000',
    images: [
      {
        id: 'img-2-1',
        storage_path: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=1000',
        alt_text_en: 'Wedding couple portrait framed',
        alt_text_ta: 'திருமண போட்டோ ஃப்ரேம்',
        display_order: 1,
      },
    ],
    sizes: [
      {
        id: 'size-2-1',
        size_label_en: '12 x 18 inches',
        size_label_ta: '12 x 18 அங்குலம்',
        width: 12,
        height: 18,
        measurement_unit: 'inch',
        original_price: 1250,
        offer_price: 990,
        is_available: true,
        display_order: 1,
      },
      {
        id: 'size-2-2',
        size_label_en: '16 x 24 inches',
        size_label_ta: '16 x 24 அங்குலம்',
        width: 16,
        height: 24,
        measurement_unit: 'inch',
        original_price: 1950,
        offer_price: 1590,
        is_available: true,
        display_order: 2,
      },
      {
        id: 'size-2-3',
        size_label_en: '20 x 30 inches',
        size_label_ta: '20 x 30 அங்குலம்',
        width: 20,
        height: 30,
        measurement_unit: 'inch',
        original_price: 2800,
        offer_price: 2290,
        is_available: true,
        display_order: 3,
      },
    ],
    is_active: true,
    is_featured: true,
    display_order: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'prod-customized-acrylic-collage',
    name_en: 'Customized Multi-Photo Collage with LED Backlight',
    name_ta: 'LED வெளிச்சத்துடன் கூடிய தனிப்பயனாக்கப்பட்ட போட்டோ கொலாஜ்',
    slug: 'customized-multi-photo-collage-led-backlight',
    short_description_en: 'Personalized 9-photo memory grid on crystal acrylic with warm golden LED illumination.',
    short_description_ta: '9 புகைப்படங்கள், பெயர்கள் மற்றும் வாழ்த்துகளுடன் கூடிய ஒளிரும் அக்ரிலிக் கொலாஜ் ஃப்ரேம்.',
    description_en: 'A modern masterpiece. Includes 9 of your selected photos, customized typography (names, wedding date, or birthday quote), and hidden ambient 12V LED backlighting.',
    description_ta: 'உங்கள் விருப்பத்திற்கு ஏற்ப 9 புகைப்படங்கள், பெயர்கள் மற்றும் தேதிகளுடன் அழகுற வடிவமைக்கப்படுகிறது. 12V மின்சார எல்இடி ஒளி அமைப்புடன் வருகிறது.',
    category_id: 'cat-customized',
    original_price: 1600,
    offer_price: 1299,
    primary_image_path: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=1000',
    images: [
      {
        id: 'img-3-1',
        storage_path: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=1000',
        alt_text_en: 'Acrylic collage with warm glow',
        alt_text_ta: 'எல்இடி வெளிச்ச கொலாஜ் ஃப்ரேம்',
        display_order: 1,
      },
    ],
    sizes: [
      {
        id: 'size-3-1',
        size_label_en: '10 x 14 inches',
        size_label_ta: '10 x 14 அங்குலம்',
        width: 10,
        height: 14,
        measurement_unit: 'inch',
        original_price: 1400,
        offer_price: 1150,
        is_available: true,
        display_order: 1,
      },
      {
        id: 'size-3-2',
        size_label_en: '12 x 18 inches',
        size_label_ta: '12 x 18 அங்குலம்',
        width: 12,
        height: 18,
        measurement_unit: 'inch',
        original_price: 1850,
        offer_price: 1490,
        is_available: true,
        display_order: 2,
      },
    ],
    is_active: true,
    is_featured: true,
    display_order: 3,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'prod-birthday-milestone-frame',
    name_en: 'First Birthday & Childhood Milestone Frame',
    name_ta: 'முதல் பிறந்தநாள் நினைவுகள் போட்டோ ஃப்ரேம்',
    slug: 'first-birthday-childhood-milestone-frame',
    short_description_en: 'Celebrate your child’s first year with 12 monthly memory slots and playful accents.',
    short_description_ta: 'குழந்தையின் 12 மாத வளர்ச்சிப் புகைப்படங்களை ஒரே ஃப்ரேமில் இணைக்கும் பிறந்தநாள் பொக்கிஷம்.',
    description_en: 'Features 12 mini photo panels tracking each month of baby development, plus a central 5x7 main portrait. Crafted with non-toxic paints and shatterproof acrylic safety glass.',
    description_ta: 'குழந்தைகளுக்கான பாதுகாப்பான அக்ரிலிக் கண்ணாடி மற்றும் இயற்கை வண்ணங்களுடன் உருவாக்கப்படுகிறது.',
    category_id: 'cat-birthday',
    original_price: null,
    offer_price: null,
    primary_image_path: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&q=80&w=1000',
    images: [
      {
        id: 'img-4-1',
        storage_path: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&q=80&w=1000',
        alt_text_en: 'Baby milestone frame',
        alt_text_ta: 'குழந்தை பிறந்தநாள் ஃப்ரேம்',
        display_order: 1,
      },
    ],
    sizes: [
      {
        id: 'size-4-1',
        size_label_en: '12 x 18 inches',
        size_label_ta: '12 x 18 அங்குலம்',
        width: 12,
        height: 18,
        measurement_unit: 'inch',
        original_price: 1200,
        offer_price: 950,
        is_available: true,
        display_order: 1,
      },
      {
        id: 'size-4-2',
        size_label_en: '14 x 20 inches',
        size_label_ta: '14 x 20 அங்குலம்',
        width: 14,
        height: 20,
        measurement_unit: 'inch',
        original_price: 1550,
        offer_price: 1250,
        is_available: true,
        display_order: 2,
      },
    ],
    is_active: true,
    is_featured: false,
    display_order: 4,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'prod-acrylic-desktop-clock',
    name_en: 'Personalized Photo Desk Clock & Stand',
    name_ta: 'மேஜை அலங்கார போட்டோ கடிகாரம்',
    slug: 'personalized-photo-desk-clock-stand',
    short_description_en: 'High-gloss acrylic desktop clock personalized with family picture and golden numerals.',
    short_description_ta: 'குடும்ப புகைப்படம் மற்றும் தங்க நிற எண்களுடன் கூடிய மேஜை கடிகார பரிசு.',
    description_en: 'Silent sweep quartz mechanism mounted on 5mm diamond-polished cast acrylic. Stands firmly on office desks, bedside tables, or display showcases.',
    description_ta: 'சத்தம் இல்லாத குவார்ட்ஸ் இயந்திரம் மற்றும் 5 மிமீ தடிமனான பளபளப்பான அக்ரிலிக் தகடுடன் உருவாக்கப்பட்டது.',
    category_id: 'cat-other-gifts',
    original_price: 550,
    offer_price: 440,
    primary_image_path: 'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?auto=format&fit=crop&q=80&w=1000',
    images: [
      {
        id: 'img-5-1',
        storage_path: 'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?auto=format&fit=crop&q=80&w=1000',
        alt_text_en: 'Photo desk clock',
        alt_text_ta: 'போட்டோ மேஜை கடிகாரம்',
        display_order: 1,
      },
    ],
    sizes: [
      {
        id: 'size-5-1',
        size_label_en: '6 x 6 inches',
        size_label_ta: '6 x 6 அங்குலம்',
        width: 6,
        height: 6,
        measurement_unit: 'inch',
        original_price: 550,
        offer_price: 440,
        is_available: true,
        display_order: 1,
      },
      {
        id: 'size-5-2',
        size_label_en: '8 x 8 inches',
        size_label_ta: '8 x 8 அங்குலம்',
        width: 8,
        height: 8,
        measurement_unit: 'inch',
        original_price: 750,
        offer_price: 590,
        is_available: true,
        display_order: 2,
      },
    ],
    is_active: true,
    is_featured: false,
    display_order: 5,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const DEFAULT_COMBOS: ReturnGiftCombo[] = [
  {
    id: 'combo-shubh-vivah-deluxe',
    name_en: 'Shubh Vivah Premium Return Gift Set (50+ Units Pack)',
    name_ta: 'சுப விவாகம் பிரீமியம் ரிட்டர்ன் கிஃப்ட் செட்',
    slug: 'shubh-vivah-premium-return-gift-set',
    description_en: 'A most dignified wedding return gift combination. Each set includes a golden blessing frame with couple initials, embossed thamboolam jute bag, and auspicious kumkum holder.',
    description_ta: 'திருமணத்திற்கு வருகை தரும் விருந்தினர்களுக்கு வழங்கக்கூடிய உயர்தர பரிசு தொகுப்பு. தங்க நிற ஃபிரேம், பாரம்பரிய தாம்பூல பை மற்றும் குங்கும சிமிழ் அடங்கியது.',
    included_items: [
      { id: 'item-1', name_en: 'Golden Blessing Mini Photo Frame (4x6")', name_ta: 'தங்க நிற மினி போட்டோ ஃப்ரேம் (4x6")', quantity: 1 },
      { id: 'item-2', name_en: 'Embroidered Silk-Jute Thamboolam Bag', name_ta: 'பட்டு-சணல் வேலைப்பாடு தாம்பூல பை', quantity: 1 },
      { id: 'item-3', name_en: 'Brass Kumkum/Haldi Chimizh', name_ta: 'பித்தளை குங்கும சிமிழ்', quantity: 1 },
      { id: 'item-4', name_en: 'Personalized Thank You Blessing Card', name_ta: 'நன்றி நவிலல் வாழ்த்து அட்டை', quantity: 1 },
    ],
    original_price: 180,
    offer_price: 135,
    primary_image_path: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=1000',
    images: [
      { id: 'cimg-1', storage_path: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=1000' }.storage_path,
      { id: 'cimg-2', storage_path: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=1000' }.storage_path,
    ],
    is_available: true,
    is_featured: true,
    display_order: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'combo-ayush-birthday-combo',
    name_en: 'Ayush Baby Birthday Celebration Gift Combo',
    name_ta: 'குழந்தை பிறந்தநாள் கொண்டாட்ட பரிசு காம்போ',
    slug: 'ayush-baby-birthday-celebration-gift-combo',
    description_en: 'Designed for first birthdays and ear-piercing ceremonies. Features an adorable miniature cartoon memory frame, customized sweet box, and keepsake pouch.',
    description_ta: 'குழந்தை பிறந்தநாள் மற்றும் காதுகுத்து விசேஷங்களுக்கு கொடுக்க ஏற்ற கியூட் போட்டோ ஃப்ரேம், இனிப்பு பெட்டி மற்றும் வண்ண பை அடங்கிய காம்போ.',
    included_items: [
      { id: 'item-2-1', name_en: 'Personalized Cartoon/Baby Mini Frame (4x4")', name_ta: 'குழந்தை போட்டோ மினி ஃப்ரேம் (4x4")', quantity: 1 },
      { id: 'item-2-2', name_en: 'Cute Printed Return Gift Bag', name_ta: 'வண்ணமயமான பரிசு பை', quantity: 1 },
      { id: 'item-2-3', name_en: 'Handmade Keyring with Baby Name', name_ta: 'குழந்தையின் பெயர் பொறித்த சாவி கொத்து', quantity: 1 },
    ],
    original_price: 120,
    offer_price: 95,
    primary_image_path: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&q=80&w=1000',
    images: [
      { id: 'cimg-3', storage_path: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&q=80&w=1000' }.storage_path,
    ],
    is_available: true,
    is_featured: true,
    display_order: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'combo-housewarming-grihapravesh',
    name_en: 'Divine Grihapravesam / Housewarming Spiritual Gift Combo',
    name_ta: 'கிரகப்பிரவேசம் மற்றும் விசேஷங்களுக்கான ஆன்மீக பரிசு காம்போ',
    slug: 'divine-grihapravesam-housewarming-spiritual-gift-combo',
    description_en: 'Ideal for housewarmings and family poojas. Features Goddess Lakshmi/Ganesha gold-leaf portrait frame, scented dhoop, and premium carry pouch.',
    description_ta: 'புதுமனை புகுவிழா மற்றும் பூஜைகளுக்கு அன்பளிப்பாக வழங்க லட்சுமி-விநாயகர் தங்க உருவப்பட ஃப்ரேம் மற்றும் நறுமண தூப பரிசு தொகுப்பு.',
    included_items: [
      { id: 'item-3-1', name_en: 'Embossed Lakshmi Ganesha Gold Foil Frame (5x7")', name_ta: 'லட்சுமி விநாயகர் தங்க பட ஃப்ரேம் (5x7")', quantity: 1 },
      { id: 'item-3-2', name_en: 'Traditional Golden Potli Bag', name_ta: 'பாரம்பரிய பொட்லி பை', quantity: 1 },
      { id: 'item-3-3', name_en: 'Natural Herbal Dhoop & Akshata Pack', name_ta: 'இயற்கை மூலிகை தூபம் & அட்சதை', quantity: 1 },
    ],
    original_price: 220,
    offer_price: 175,
    primary_image_path: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&q=80&w=1000',
    images: [
      { id: 'cimg-4', storage_path: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&q=80&w=1000' }.storage_path,
    ],
    is_available: true,
    is_featured: false,
    display_order: 3,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const DEFAULT_ENQUIRIES: CustomerEnquiry[] = [
  {
    id: 'enq-sample-1',
    customer_name: 'Karthik Subramanian',
    phone_number: '9840123456',
    product_id: 'prod-wedding-portrait-deluxe',
    product_name: 'Grand Bridal & Wedding Couple Portrait Frame',
    selected_size: '16 x 24 inches',
    enquiry_type: 'product',
    message: 'Hello RNK Frames, we need 2 frames for our wedding reception next month in Tiruttani. Can we inspect the finish?',
    status: 'NEW',
    created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
  {
    id: 'enq-sample-2',
    customer_name: 'Devaki Murali',
    phone_number: '9443654321',
    combo_id: 'combo-shubh-vivah-deluxe',
    combo_name: 'Shubh Vivah Premium Return Gift Set (50+ Units Pack)',
    enquiry_type: 'combo',
    message: 'We are ordering 150 return gift combos for our daughter wedding in PodaturPet. What is the delivery time?',
    status: 'CONTACTED',
    admin_notes: 'Spoke on WhatsApp, confirmed delivery within 5 days.',
    created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 18).toISOString(),
  },
];

class DatabaseManager {
  private data: DatabaseSchema;

  constructor() {
    this.ensureDirectory();
    this.data = this.loadDatabase();
  }

  private ensureDirectory() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
    } catch (err) {
      // In-memory mode if filesystem is read-only
    }
  }

  private loadDatabase(): DatabaseSchema {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        // Fill missing defaults if any
        return {
          categories: parsed.categories || DEFAULT_CATEGORIES,
          products: parsed.products || DEFAULT_PRODUCTS,
          combos: parsed.combos || DEFAULT_COMBOS,
          enquiries: parsed.enquiries || DEFAULT_ENQUIRIES,
          banners: parsed.banners || DEFAULT_BANNERS,
          settings: parsed.settings || DEFAULT_SETTINGS,
        };
      }
    } catch (err) {
      console.warn('Notice: Using default dataset for database:', err);
    }

    const freshDb: DatabaseSchema = {
      categories: DEFAULT_CATEGORIES,
      products: DEFAULT_PRODUCTS,
      combos: DEFAULT_COMBOS,
      enquiries: DEFAULT_ENQUIRIES,
      banners: DEFAULT_BANNERS,
      settings: DEFAULT_SETTINGS,
    };
    try {
      this.saveDatabase(freshDb);
    } catch {}
    return freshDb;
  }

  private saveDatabase(data: DatabaseSchema) {
    try {
      this.ensureDirectory();
      const tmpFile = `${DB_FILE}.tmp`;
      fs.writeFileSync(tmpFile, JSON.stringify(data, null, 2), 'utf-8');
      fs.renameSync(tmpFile, DB_FILE);
    } catch (err) {
      // In serverless / read-only filesystem, state stays persistent in memory
    }
  }

  private slugify(text: string): string {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  // Categories
  getCategories(): Category[] {
    return [...this.data.categories].sort((a, b) => a.display_order - b.display_order);
  }

  getCategoryBySlug(slug: string): Category | undefined {
    return this.data.categories.find(c => c.slug === slug || c.id === slug);
  }

  // Products
  getProducts(options?: { activeOnly?: boolean; categorySlug?: string; search?: string; featuredOnly?: boolean }): Product[] {
    let list = this.data.products;

    if (options?.activeOnly) {
      list = list.filter(p => p.is_active);
    }

    if (options?.featuredOnly) {
      list = list.filter(p => p.is_featured);
    }

    if (options?.categorySlug) {
      const cat = this.getCategoryBySlug(options.categorySlug);
      if (cat) {
        list = list.filter(p => p.category_id === cat.id);
      }
    }

    if (options?.search) {
      const q = options.search.toLowerCase().trim();
      list = list.filter(
        p =>
          p.name_en.toLowerCase().includes(q) ||
          p.name_ta.toLowerCase().includes(q) ||
          p.description_en.toLowerCase().includes(q) ||
          p.description_ta.toLowerCase().includes(q)
      );
    }

    // Attach category details
    const catMap = new Map(this.data.categories.map(c => [c.id, c]));
    return list
      .map(p => {
        const cat = catMap.get(p.category_id);
        return {
          ...p,
          category_slug: cat?.slug,
          category_name_en: cat?.name_en,
          category_name_ta: cat?.name_ta,
        };
      })
      .sort((a, b) => a.display_order - b.display_order);
  }

  getProductBySlugOrId(identifier: string): Product | undefined {
    const p = this.data.products.find(item => item.slug === identifier || item.id === identifier);
    if (!p) return undefined;
    const cat = this.data.categories.find(c => c.id === p.category_id);
    return {
      ...p,
      category_slug: cat?.slug,
      category_name_en: cat?.name_en,
      category_name_ta: cat?.name_ta,
    };
  }

  createProduct(data: Omit<Product, 'id' | 'slug' | 'created_at' | 'updated_at'> & { slug?: string }): Product {
    const id = `prod-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const baseSlug = data.slug || this.slugify(data.name_en || 'product');
    let uniqueSlug = baseSlug;
    let counter = 1;
    while (this.data.products.some(p => p.slug === uniqueSlug)) {
      uniqueSlug = `${baseSlug}-${counter++}`;
    }

    // Validate size prices
    const sizes = (data.sizes || []).map((s, idx) => {
      const orig = Number(s.original_price) || 0;
      const off = s.offer_price != null && Number(s.offer_price) > 0 ? Number(s.offer_price) : null;
      if (off != null && off >= orig) {
        throw new Error(`Size ${s.size_label_en} offer price must be less than original price`);
      }
      return {
        ...s,
        id: s.id || `size-${Date.now()}-${idx}`,
        product_id: id,
        original_price: orig,
        offer_price: off,
        display_order: s.display_order ?? idx + 1,
      };
    });

    const newProduct: Product = {
      ...data,
      id,
      slug: uniqueSlug,
      sizes,
      images: (data.images || []).map((img, idx) => ({
        ...img,
        id: img.id || `img-${Date.now()}-${idx}`,
        product_id: id,
        display_order: img.display_order ?? idx + 1,
      })),
      display_order: data.display_order ?? this.data.products.length + 1,
      is_active: data.is_active ?? true,
      is_featured: data.is_featured ?? false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    this.data.products.push(newProduct);
    this.saveDatabase(this.data);
    return this.getProductBySlugOrId(id)!;
  }

  updateProduct(id: string, updates: Partial<Product>): Product {
    const idx = this.data.products.findIndex(p => p.id === id);
    if (idx === -1) {
      throw new Error(`Product with ID ${id} not found`);
    }

    const current = this.data.products[idx];
    let slug = current.slug;
    if (updates.name_en && updates.name_en !== current.name_en && !updates.slug) {
      const baseSlug = this.slugify(updates.name_en);
      slug = baseSlug;
      let counter = 1;
      while (this.data.products.some(p => p.slug === slug && p.id !== id)) {
        slug = `${baseSlug}-${counter++}`;
      }
    } else if (updates.slug && updates.slug !== current.slug) {
      slug = this.slugify(updates.slug);
    }

    // Validate sizes if provided
    let sizes = current.sizes;
    if (updates.sizes) {
      sizes = updates.sizes.map((s, sIdx) => {
        const orig = Number(s.original_price) || 0;
        const off = s.offer_price != null && Number(s.offer_price) > 0 ? Number(s.offer_price) : null;
        if (off != null && off >= orig) {
          throw new Error(`Size ${s.size_label_en} offer price must be lower than original price`);
        }
        return {
          ...s,
          id: s.id || `size-${Date.now()}-${sIdx}`,
          product_id: id,
          original_price: orig,
          offer_price: off,
          display_order: s.display_order ?? sIdx + 1,
        };
      });
    }

    const updated: Product = {
      ...current,
      ...updates,
      id,
      slug,
      sizes,
      images: updates.images ? updates.images : current.images,
      updated_at: new Date().toISOString(),
    };

    this.data.products[idx] = updated;
    this.saveDatabase(this.data);
    return this.getProductBySlugOrId(id)!;
  }

  deleteProduct(id: string): boolean {
    const initialLen = this.data.products.length;
    this.data.products = this.data.products.filter(p => p.id !== id);
    if (this.data.products.length !== initialLen) {
      this.saveDatabase(this.data);
      return true;
    }
    return false;
  }

  // Combos
  getCombos(options?: { activeOnly?: boolean; featuredOnly?: boolean }): ReturnGiftCombo[] {
    let list = this.data.combos;
    if (options?.activeOnly) {
      list = list.filter(c => c.is_available);
    }
    if (options?.featuredOnly) {
      list = list.filter(c => c.is_featured);
    }
    return [...list].sort((a, b) => a.display_order - b.display_order);
  }

  getComboBySlugOrId(identifier: string): ReturnGiftCombo | undefined {
    return this.data.combos.find(c => c.slug === identifier || c.id === identifier);
  }

  createCombo(data: Omit<ReturnGiftCombo, 'id' | 'slug' | 'created_at' | 'updated_at'> & { slug?: string }): ReturnGiftCombo {
    const id = `combo-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const baseSlug = data.slug || this.slugify(data.name_en || 'combo');
    let uniqueSlug = baseSlug;
    let counter = 1;
    while (this.data.combos.some(c => c.slug === uniqueSlug)) {
      uniqueSlug = `${baseSlug}-${counter++}`;
    }

    const orig = Number(data.original_price) || 0;
    const off = data.offer_price != null && Number(data.offer_price) > 0 ? Number(data.offer_price) : null;
    if (off != null && off >= orig) {
      throw new Error('Combo offer price must be lower than original price');
    }

    const newCombo: ReturnGiftCombo = {
      ...data,
      id,
      slug: uniqueSlug,
      original_price: orig,
      offer_price: off,
      included_items: (data.included_items || []).map((item, idx) => ({
        ...item,
        id: item.id || `item-${Date.now()}-${idx}`,
        quantity: Number(item.quantity) || 1,
      })),
      display_order: data.display_order ?? this.data.combos.length + 1,
      is_available: data.is_available ?? true,
      is_featured: data.is_featured ?? false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    this.data.combos.push(newCombo);
    this.saveDatabase(this.data);
    return newCombo;
  }

  updateCombo(id: string, updates: Partial<ReturnGiftCombo>): ReturnGiftCombo {
    const idx = this.data.combos.findIndex(c => c.id === id);
    if (idx === -1) throw new Error(`Combo with ID ${id} not found`);

    const current = this.data.combos[idx];
    const orig = updates.original_price !== undefined ? Number(updates.original_price) : current.original_price;
    const off = updates.offer_price !== undefined ? (updates.offer_price ? Number(updates.offer_price) : null) : current.offer_price;
    if (off != null && off >= orig) {
      throw new Error('Combo offer price must be lower than original price');
    }

    const updated: ReturnGiftCombo = {
      ...current,
      ...updates,
      id,
      original_price: orig,
      offer_price: off,
      updated_at: new Date().toISOString(),
    };

    this.data.combos[idx] = updated;
    this.saveDatabase(this.data);
    return updated;
  }

  deleteCombo(id: string): boolean {
    const len = this.data.combos.length;
    this.data.combos = this.data.combos.filter(c => c.id !== id);
    if (this.data.combos.length !== len) {
      this.saveDatabase(this.data);
      return true;
    }
    return false;
  }

  // Banners
  getBanners(options?: { activeOnly?: boolean }): Banner[] {
    let list = this.data.banners;
    if (options?.activeOnly) {
      list = list.filter(b => b.is_active);
    }
    return [...list].sort((a, b) => a.display_order - b.display_order);
  }

  createBanner(data: Omit<Banner, 'id' | 'created_at'>): Banner {
    const id = `banner-${Date.now()}`;
    const newBanner: Banner = {
      ...data,
      id,
      created_at: new Date().toISOString(),
    };
    this.data.banners.push(newBanner);
    this.saveDatabase(this.data);
    return newBanner;
  }

  updateBanner(id: string, updates: Partial<Banner>): Banner {
    const idx = this.data.banners.findIndex(b => b.id === id);
    if (idx === -1) throw new Error(`Banner with ID ${id} not found`);
    const updated = { ...this.data.banners[idx], ...updates, id };
    this.data.banners[idx] = updated;
    this.saveDatabase(this.data);
    return updated;
  }

  deleteBanner(id: string): boolean {
    const len = this.data.banners.length;
    this.data.banners = this.data.banners.filter(b => b.id !== id);
    if (this.data.banners.length !== len) {
      this.saveDatabase(this.data);
      return true;
    }
    return false;
  }

  // Enquiries
  getEnquiries(options?: { status?: EnquiryStatus; search?: string }): CustomerEnquiry[] {
    let list = this.data.enquiries;
    if (options?.status) {
      list = list.filter(e => e.status === options.status);
    }
    if (options?.search) {
      const q = options.search.toLowerCase();
      list = list.filter(
        e =>
          e.customer_name.toLowerCase().includes(q) ||
          e.phone_number.toLowerCase().includes(q) ||
          e.message.toLowerCase().includes(q)
      );
    }
    return [...list].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  createEnquiry(data: {
    customer_name: string;
    phone_number: string;
    product_id?: string | null;
    combo_id?: string | null;
    selected_size?: string | null;
    enquiry_type?: CustomerEnquiry['enquiry_type'];
    message: string;
  }): CustomerEnquiry {
    if (!data.customer_name?.trim() || !data.phone_number?.trim()) {
      throw new Error('Customer name and phone number are required');
    }

    let productName: string | null = null;
    if (data.product_id) {
      const prod = this.getProductBySlugOrId(data.product_id);
      if (prod) productName = prod.name_en;
    }

    let comboName: string | null = null;
    if (data.combo_id) {
      const combo = this.getComboBySlugOrId(data.combo_id);
      if (combo) comboName = combo.name_en;
    }

    const id = `enq-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const enquiry: CustomerEnquiry = {
      id,
      customer_name: data.customer_name.trim(),
      phone_number: data.phone_number.trim(),
      product_id: data.product_id || null,
      product_name: productName,
      combo_id: data.combo_id || null,
      combo_name: comboName,
      selected_size: data.selected_size || null,
      enquiry_type: data.enquiry_type || (data.product_id ? 'product' : data.combo_id ? 'combo' : 'general'),
      message: (data.message || '').trim(),
      status: 'NEW',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    this.data.enquiries.unshift(enquiry);
    this.saveDatabase(this.data);
    return enquiry;
  }

  updateEnquiryStatus(id: string, status: EnquiryStatus, admin_notes?: string): CustomerEnquiry {
    const idx = this.data.enquiries.findIndex(e => e.id === id);
    if (idx === -1) throw new Error(`Enquiry ${id} not found`);
    const current = this.data.enquiries[idx];
    const updated: CustomerEnquiry = {
      ...current,
      status,
      admin_notes: admin_notes !== undefined ? admin_notes : current.admin_notes,
      updated_at: new Date().toISOString(),
    };
    this.data.enquiries[idx] = updated;
    this.saveDatabase(this.data);
    return updated;
  }

  deleteEnquiry(id: string): boolean {
    const len = this.data.enquiries.length;
    this.data.enquiries = this.data.enquiries.filter(e => e.id !== id);
    if (this.data.enquiries.length !== len) {
      this.saveDatabase(this.data);
      return true;
    }
    return false;
  }

  // Business Settings
  getSettings(): BusinessSettings {
    return { ...this.data.settings };
  }

  updateSettings(updates: Partial<BusinessSettings>): BusinessSettings {
    this.data.settings = {
      ...this.data.settings,
      ...updates,
      updated_at: new Date().toISOString(),
    };
    this.saveDatabase(this.data);
    return { ...this.data.settings };
  }

  // Stats
  getDashboardStats(): DashboardStats {
    const total_products = this.data.products.length;
    const active_products = this.data.products.filter(p => p.is_active).length;
    const inactive_products = total_products - active_products;
    const total_categories = this.data.categories.length;
    const total_combos = this.data.combos.length;
    const new_enquiries = this.data.enquiries.filter(e => e.status === 'NEW').length;
    const unresolved_enquiries = this.data.enquiries.filter(e => e.status === 'NEW' || e.status === 'CONTACTED').length;

    return {
      total_products,
      active_products,
      inactive_products,
      total_categories,
      total_combos,
      new_enquiries,
      unresolved_enquiries,
    };
  }

  // Full backup
  exportFullBackup(): DatabaseSchema {
    return JSON.parse(JSON.stringify(this.data));
  }
}

export const db = new DatabaseManager();
