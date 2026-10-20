import { useState, useEffect } from 'react';
import { Language } from '../types/index.js';

export const translations = {
  en: {
    brand_name: 'RNK Photo Frames',
    brand_tagline: 'Preserving Your Beautiful Moments',
    location_short: 'PodaturPet, Tiruttani',
    nav_home: 'Home',
    nav_catalogue: 'All Frames',
    nav_combos: 'Return Gift Combos',
    nav_about: 'About Us',
    nav_contact: 'Contact',
    nav_admin: 'Admin Portal',
    nav_all_categories: 'All Categories',

    // Hero
    hero_badge: 'Handcrafted in PodaturPet • Delivering across Tamil Nadu & Andhra',
    hero_title: 'Frames That Preserve Your Beautiful Moments',
    hero_subtitle: 'Handcrafted luxury photo frames, bridal portraits & customized return gifts from PodaturPet, Tiruttani.',
    hero_cta_primary: 'Explore Catalogue',
    hero_cta_secondary: 'WhatsApp Enquiry',
    hero_cta_combos: 'Return Gift Combos',

    // Highlights
    badge_custom_sizes: 'Custom Sizes Available',
    badge_handcrafted: 'Artisan Wood Crafting',
    badge_fast_delivery: 'Prompt Dispatch',
    badge_best_price: 'Wholesale & Retail Value',

    // Sections
    sec_featured_title: 'Featured Photo Frames',
    sec_featured_subtitle: 'Our most cherished and timeless creations for your living space and family galleries.',
    sec_combos_title: 'Popular Return Gift Combos',
    sec_combos_subtitle: 'Curated gift hampers designed to delight wedding guests and milestone celebration attendees.',
    sec_customized_title: 'Customized & LED Frames',
    sec_customized_subtitle: 'Add personal names, marriage dates, and illuminated backlighting to your memories.',
    sec_occasions_title: 'Wedding & Birthday Collections',
    sec_other_gifts_title: 'Unique Gifts & Desktop Art',
    sec_view_all: 'View All',
    sec_about_heading: 'Craftsmanship Rooted in PodaturPet',

    // Product Card & Details
    price_from: 'From',
    original_price: 'MRP',
    offer_price: 'Special Price',
    save_amount: 'Save',
    sizes_available: 'Available Sizes',
    select_size: 'Select Size',
    dimensions: 'Dimensions',
    enquire_whatsapp: 'Enquire on WhatsApp',
    call_now: 'Call +91 8681917433',
    quick_enquiry: 'Send Enquiry',
    out_of_stock: 'Currently Unavailable',
    in_stock: 'Available on Order',
    included_in_combo: 'What is included in this combo:',
    product_details: 'Product Details',
    close: 'Close',
    related_products: 'You May Also Like',
    view_details: 'View Details',
    view_large: 'Tap to view gallery',

    // Filter & Search
    search_placeholder: 'Search frames, gifts, or combos...',
    filter_all: 'All Items',
    no_products_found: 'No frames found matching your criteria.',
    clear_filters: 'Reset Filters',

    // Enquiry Form & Modal
    enquiry_title: 'Send a Direct Enquiry',
    enquiry_subtitle: 'Fill in your details and we will call or WhatsApp you with exact customization pricing.',
    label_name: 'Your Name',
    label_phone: 'Phone / WhatsApp Number',
    label_message: 'Your Requirement / Message',
    label_size: 'Selected Size',
    btn_submit_enquiry: 'Submit Enquiry',
    enquiry_success: 'Thank you! Your enquiry has been received. Our team from PodaturPet will contact you shortly.',
    enquiry_error: 'Could not send enquiry. Please contact us directly on WhatsApp or Call.',

    // Contact Page
    contact_title: 'Visit or Get in Touch',
    contact_subtitle: 'We welcome customers and bulk wedding order enquiries across Tiruttani, Arakkonam, Tiruvallur, Nagari, and Chennai.',
    contact_address_label: 'Workshop & Studio Address',
    contact_phone_label: 'Call Direct',
    contact_whatsapp_label: 'Instant WhatsApp',
    contact_hours_label: 'Working Hours',
    contact_hours_val: 'Monday to Sunday: 9:00 AM – 9:00 PM',
    get_directions: 'Get Google Maps Directions',

    // Footer
    footer_desc: 'RNK Photo Frames is your premier artisan frame workshop in PodaturPet, Tiruttani. Dedicated to high-definition preservation of life’s unforgettable milestones.',
    footer_quick_links: 'Quick Links',
    footer_categories: 'Categories',
    footer_contact_info: 'Contact Information',
    footer_rights: 'All rights reserved. RNK Photo Frames.',
    footer_made_with_care: 'Crafted with passion in PodaturPet, Tiruttani, Tamil Nadu.',
  },
  ta: {
    brand_name: 'RNK போட்டோ ஃப்ரேம்ஸ்',
    brand_tagline: 'உங்கள் அழகான நினைவுகளை என்றும் பாதுகாக்கும் ஃப்ரேம்கள்',
    location_short: 'பொதட்டூர்பேட்டை, திருத்தணி',
    nav_home: 'முகப்பு',
    nav_catalogue: 'அனைத்து ஃப்ரேம்கள்',
    nav_combos: 'ரிட்டர்ன் கிஃப்ட் காம்போ',
    nav_about: 'எங்களை பற்றி',
    nav_contact: 'தொடர்புக்கு',
    nav_admin: 'நிர்வாக பக்கம்',
    nav_all_categories: 'அனைத்து பிரிவுகள்',

    // Hero
    hero_badge: 'பொதட்டூர்பேட்டையில் கைவினை தயாரிப்பு • தமிழகம் & ஆந்திரா முழுவதும் டெலிவரி',
    hero_title: 'உங்கள் அழகான நினைவுகளை என்றும் பாதுகாக்கும் ஃப்ரேம்கள்',
    hero_subtitle: 'பொதட்டூர்பேட்டை மற்றும் திருத்தணியில் சிறந்த தரத்தில் போட்டோ ஃப்ரேம்கள் மற்றும் விசேஷங்களுக்கான பரிசு காம்போக்கள்.',
    hero_cta_primary: 'பொருட்களைப் பார்க்க',
    hero_cta_secondary: 'வாட்ஸ்அப் தகவல்',
    hero_cta_combos: 'பரிசு காம்போக்கள்',

    // Highlights
    badge_custom_sizes: 'விரும்பிய அளவுகளில் தயார்',
    badge_handcrafted: 'தரமான மர வேலைப்பாடு',
    badge_fast_delivery: 'விரைவான தயாரிப்பு',
    badge_best_price: 'மொத்த & சில்லறை விலை',

    // Sections
    sec_featured_title: 'சிறப்பு போட்டோ ஃப்ரேம்கள்',
    sec_featured_subtitle: 'உங்கள் இல்லத்தை அலங்கரிக்கும் அழகான மற்றும் நேர்த்தியான ஃப்ரேம்கள்.',
    sec_combos_title: 'பிரபலமான ரிட்டர்ன் கிஃப்ட் காம்போக்கள்',
    sec_combos_subtitle: 'திருமணம் மற்றும் விசேஷங்களுக்கு விருந்தினர்களுக்கு வழங்கக்கூடிய சிறப்பு பரிசு தொகுப்புகள்.',
    sec_customized_title: 'தனிப்பயனாக்கப்பட்ட & LED ஃப்ரேம்கள்',
    sec_customized_subtitle: 'பெயர்கள், திருமண தேதிகள் மற்றும் ஒளிரும் எல்இடி விளக்குகளுடன் கூடிய நவீன ஃப்ரேம்கள்.',
    sec_occasions_title: 'திருமண & பிறந்தநாள் தொகுப்பு',
    sec_other_gifts_title: 'சிறப்பு பரிசுகள் & மேஜை அலங்காரங்கள்',
    sec_view_all: 'அனைத்தையும் பார்க்க',
    sec_about_heading: 'பொதட்டூர்பேட்டையின் பாரம்பரிய கைவினை தரம்',

    // Product Card & Details
    price_from: 'ஆரம்ப விலை',
    original_price: 'அசல் விலை',
    offer_price: 'சிறப்பு சலுகை விலை',
    save_amount: 'சேமிப்பு',
    sizes_available: 'கிடைக்கும் அளவுகள்',
    select_size: 'அளவைத் தேர்ந்தெடுக்கவும்',
    dimensions: 'அளவீடு',
    enquire_whatsapp: 'வாட்ஸ்அப்பில் விசாரிக்க',
    call_now: 'அழைக்க +91 8681917433',
    quick_enquiry: 'தகவல் அனுப்ப',
    out_of_stock: 'தற்காலிகமாக கையிருப்பில் இல்லை',
    in_stock: 'ஆர்டரின் பேரில் கிடைக்கும்',
    included_in_combo: 'இந்த காம்போவில் அடங்கியவை:',
    product_details: 'தயாரிப்பு விவரங்கள்',
    close: 'மூடுக',
    related_products: 'தொடர்புடைய ஃப்ரேம்கள்',
    view_details: 'முழு விவரம்',
    view_large: 'படங்களை பார்க்க தொடவும்',

    // Filter & Search
    search_placeholder: 'ஃப்ரேம்கள் அல்லது பரிசுகளை தேடுங்கள்...',
    filter_all: 'அனைத்தும்',
    no_products_found: 'பொருட்கள் எதுவும் கிடைக்கவில்லை.',
    clear_filters: 'அனைத்தையும் காட்டு',

    // Enquiry Form & Modal
    enquiry_title: 'நேரடி தகவல் அனுப்ப',
    enquiry_subtitle: 'உங்கள் விவரங்களை உள்ளிடுங்கள், எங்கள் குழு உங்களுடன் தொலைபேசி அல்லது வாட்ஸ்அப்பில் தொடர்பு கொள்ளும்.',
    label_name: 'உங்கள் பெயர்',
    label_phone: 'தொலைபேசி / வாட்ஸ்அப் எண்',
    label_message: 'உங்கள் தேவை / விபரம்',
    label_size: 'தேர்ந்தெடுக்கப்பட்ட அளவு',
    btn_submit_enquiry: 'அனுப்பவும்',
    enquiry_success: 'நன்றி! உங்கள் தகவல் பெறப்பட்டது. பொதட்டூர்பேட்டை RNK குழு உங்களை விரைவில் தொடர்பு கொள்ளும்.',
    enquiry_error: 'தகவல் அனுப்ப இயலவில்லை. தயவுசெய்து வாட்ஸ்அப் அல்லது தொலைபேசி மூலம் நேரடியாக அழைக்கவும்.',

    // Contact Page
    contact_title: 'எங்களை அணுக / தொடர்பு கொள்ள',
    contact_subtitle: 'பொதட்டூர்பேட்டை, திருத்தணி, அரக்கோணம், திருவள்ளூர் மற்றும் சென்னை வாடிக்கையாளர்கள் மொத்த ஆர்டர்களுக்கு எங்களை அணுகலாம்.',
    contact_address_label: 'பட்டறை முகவரி',
    contact_phone_label: 'நேரடி அழைப்பு',
    contact_whatsapp_label: 'உடனடி வாட்ஸ்அப்',
    contact_hours_label: 'நேரம்',
    contact_hours_val: 'திங்கள் முதல் ஞாயிறு வரை: காலை 9:00 - இரவு 9:00',
    get_directions: 'கூகுள் மேப் வழிகாட்டல்',

    // Footer
    footer_desc: 'பொதட்டூர்பேட்டையில் அமைந்துள்ள RNK போட்டோ ஃப்ரேம்ஸ், உங்கள் வாழ்க்கையின் இனிய தருணங்களை சிறந்த மர ஃப்ரேம்களில் அழியாமல் நிலைநிறுத்துகிறது.',
    footer_quick_links: 'முக்கிய இணைப்புகள்',
    footer_categories: 'பிரிவுகள்',
    footer_contact_info: 'தொடர்பு முகவரி',
    footer_rights: 'அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை. RNK போட்டோ ஃப்ரேம்ஸ்.',
    footer_made_with_care: 'பொதட்டூர்பேட்டை, திருத்தணி, தமிழ்நாட்டில் அன்புடன் உருவாக்கப்பட்டது.',
  },
};

export function useLanguage() {
  const [lang, setLang] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('rnk_lang');
      if (stored === 'ta' || stored === 'en') return stored;
    }
    return 'en';
  });

  useEffect(() => {
    localStorage.setItem('rnk_lang', lang);
    document.documentElement.lang = lang;
  }, [lang]);

  const toggleLang = () => {
    setLang(prev => (prev === 'en' ? 'ta' : 'en'));
  };

  const t = translations[lang];

  return { lang, setLang, toggleLang, t };
}
