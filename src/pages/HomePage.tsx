import { useState, useEffect } from 'react';
import { ArrowRight, Sparkles, Shield, Truck, Award, Gift, MessageCircle, Phone, MapPin } from 'lucide-react';
import { Banner, Category, Product, ReturnGiftCombo } from '../types/index.js';
import { useLanguage } from '../lib/i18n.js';
import { BUSINESS_PHONE_DISPLAY, getCallDirectUrl, getGeneralWhatsAppUrl } from '../lib/whatsapp.js';
import HeroBanner from '../components/HeroBanner.js';
import ProductCard from '../components/ProductCard.js';
import ComboCard from '../components/ComboCard.js';

interface HomePageProps {
  banners: Banner[];
  categories: Category[];
  products: Product[];
  combos: ReturnGiftCombo[];
  onNavigate: (route: string) => void;
  onViewProductDetails: (product: Product) => void;
  onOpenEnquiryModal: () => void;
}

export default function HomePage({
  banners,
  categories,
  products,
  combos,
  onNavigate,
  onViewProductDetails,
  onOpenEnquiryModal,
}: HomePageProps) {
  const { lang, t } = useLanguage();

  // Filter groups
  const featuredFrames = products.filter(p => p.is_featured).slice(0, 4);
  const weddingFrames = products.filter(p => p.category_id === 'cat-wedding' || p.category_slug === 'wedding-frames').slice(0, 3);
  const customizedFrames = products.filter(p => p.category_id === 'cat-customized' || p.category_slug === 'customized-frames').slice(0, 3);
  const birthdayFrames = products.filter(p => p.category_id === 'cat-birthday' || p.category_slug === 'birthday-frames').slice(0, 3);
  const otherGifts = products.filter(p => p.category_id === 'cat-other-gifts' || p.category_slug === 'other-gift-items').slice(0, 3);
  const popularCombos = combos.slice(0, 3);

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* Hero Banner */}
      <HeroBanner banners={banners} onNavigate={onNavigate} />

      {/* Trust Highlights Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-6 sm:p-8 bg-white rounded-xl border border-[#E8E2D5] shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#F7F3EB] flex items-center justify-center shrink-0 border border-[#E8E2D5]">
              <Sparkles className="w-5 h-5 text-[#997A4D]" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-[#1C1917]">{t.badge_custom_sizes}</h4>
              <p className="text-[11px] text-stone-500">4x6 to 24x36 inches</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#F7F3EB] flex items-center justify-center shrink-0 border border-[#E8E2D5]">
              <Award className="w-5 h-5 text-[#997A4D]" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-[#1C1917]">{t.badge_handcrafted}</h4>
              <p className="text-[11px] text-stone-500">Fine teak & gold leaf</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#F7F3EB] flex items-center justify-center shrink-0 border border-[#E8E2D5]">
              <Truck className="w-5 h-5 text-[#997A4D]" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-[#1C1917]">{t.badge_fast_delivery}</h4>
              <p className="text-[11px] text-stone-500">Secure bubble packed</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#F7F3EB] flex items-center justify-center shrink-0 border border-[#E8E2D5]">
              <Shield className="w-5 h-5 text-[#997A4D]" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-[#1C1917]">{t.badge_best_price}</h4>
              <p className="text-[11px] text-stone-500">Direct workshop prices</p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 1: Featured Photo Frames */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#E8E2D5] pb-4">
          <div className="space-y-1">
            <span className="text-xs font-bold text-[#997A4D] uppercase tracking-widest block">
              RNK Collection
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#1C1917]">
              {t.sec_featured_title}
            </h2>
            <p className="text-xs sm:text-sm text-[#57534E]">
              {t.sec_featured_subtitle}
            </p>
          </div>
          <button
            onClick={() => onNavigate('/catalogue')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1C1917] hover:text-[#997A4D] transition-colors cursor-pointer group shrink-0"
          >
            <span>{t.sec_view_all}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {(featuredFrames.length > 0 ? featuredFrames : products.slice(0, 4)).map(p => (
            <ProductCard
              key={p.id}
              product={p}
              onViewDetails={onViewProductDetails}
            />
          ))}
        </div>
      </section>

      {/* Section 2: Popular Return Gift Combos */}
      <section className="bg-[#F4F0E8] py-16 sm:py-20 border-y border-[#E8E2D5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#D8D0C0] pb-4">
            <div className="space-y-1">
              <span className="text-xs font-bold text-[#997A4D] uppercase tracking-widest flex items-center gap-1.5">
                <Gift className="w-3.5 h-3.5" />
                <span>Wedding & Function Bulk Favourites</span>
              </span>
              <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#1C1917]">
                {t.sec_combos_title}
              </h2>
              <p className="text-xs sm:text-sm text-[#57534E]">
                {t.sec_combos_subtitle}
              </p>
            </div>
            <button
              onClick={() => onNavigate('/combos')}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1C1917] hover:text-[#997A4D] transition-colors cursor-pointer group shrink-0"
            >
              <span>{t.sec_view_all}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {popularCombos.map(combo => (
              <ComboCard key={combo.id} combo={combo} />
            ))}
          </div>
        </div>
      </section>

      {/* Section 3: Customized & LED Memory Plaques */}
      {customizedFrames.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-8 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#E8E2D5] pb-4">
            <div className="space-y-1">
              <span className="text-xs font-bold text-[#997A4D] uppercase tracking-widest block">
                Bespoke Creations
              </span>
              <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#1C1917]">
                {t.sec_customized_title}
              </h2>
              <p className="text-xs sm:text-sm text-[#57534E]">
                {t.sec_customized_subtitle}
              </p>
            </div>
            <button
              onClick={() => onNavigate('/catalogue?category=customized-frames')}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1C1917] hover:text-[#997A4D] transition-colors cursor-pointer group shrink-0"
            >
              <span>{t.sec_view_all}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {customizedFrames.map(p => (
              <ProductCard
                key={p.id}
                product={p}
                onViewDetails={onViewProductDetails}
              />
            ))}
          </div>
        </section>
      )}

      {/* Section 4: Wedding & Birthday Collections */}
      {(weddingFrames.length > 0 || birthdayFrames.length > 0) && (
        <section className="max-w-7xl mx-auto px-4 sm:px-8 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#E8E2D5] pb-4">
            <div className="space-y-1">
              <span className="text-xs font-bold text-[#997A4D] uppercase tracking-widest block">
                Occasions & Milestones
              </span>
              <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#1C1917]">
                {t.sec_occasions_title}
              </h2>
              <p className="text-xs sm:text-sm text-[#57534E]">
                From first birthdays to golden anniversaries, preserved with regal dignity.
              </p>
            </div>
            <button
              onClick={() => onNavigate('/catalogue')}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1C1917] hover:text-[#997A4D] transition-colors cursor-pointer group shrink-0"
            >
              <span>{t.sec_view_all}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...weddingFrames, ...birthdayFrames].slice(0, 3).map(p => (
              <ProductCard
                key={p.id}
                product={p}
                onViewDetails={onViewProductDetails}
              />
            ))}
          </div>
        </section>
      )}

      {/* Section 5: Other Gift Items */}
      {otherGifts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-8 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#E8E2D5] pb-4">
            <div className="space-y-1">
              <span className="text-xs font-bold text-[#997A4D] uppercase tracking-widest block">
                Novelty & Accessories
              </span>
              <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#1C1917]">
                {t.sec_other_gifts_title}
              </h2>
            </div>
            <button
              onClick={() => onNavigate('/catalogue?category=other-gift-items')}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1C1917] hover:text-[#997A4D] transition-colors cursor-pointer group shrink-0"
            >
              <span>{t.sec_view_all}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherGifts.map(p => (
              <ProductCard
                key={p.id}
                product={p}
                onViewDetails={onViewProductDetails}
              />
            ))}
          </div>
        </section>
      )}

      {/* Section 6: Business Story & PodaturPet Roots */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="bg-[#1C1917] rounded-2xl text-white p-8 sm:p-12 lg:p-16 relative overflow-hidden">
          <div className="relative z-10 max-w-2xl space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#C5A880] uppercase tracking-widest">
              <MapPin className="w-3.5 h-3.5" />
              <span>PodaturPet • Tiruttani</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#FAF8F5] leading-tight">
              {t.sec_about_heading}
            </h2>
            <p className="text-sm sm:text-base text-stone-300 font-light leading-relaxed">
              {lang === 'ta'
                ? 'RNK போட்டோ ஃப்ரேம்ஸ் உங்கள் குடும்ப நினைவுகளையும், திருமண நிகழ்வுகளையும் காலத்தால் அழிக்க முடியாத கலையாக மாற்றுகிறது. எங்களின் பிரத்யேக வேலைப்பாடு மற்றும் நவீன தொழில்நுட்பம் உங்கள் புகைப்படங்களுக்கு புதிய அழகை சேர்க்கிறது.'
                : 'At RNK Photo Frames, every piece is shaped with an unwavering commitment to beauty and longevity. Whether you seek a grand centerpiece for your living room or 200 customized return gift sets for your guests, we provide unparalleled personal care and direct workshop pricing.'}
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={() => onNavigate('/about')}
                className="px-5 py-2.5 rounded-md bg-[#C5A880] hover:bg-[#B89758] text-[#1C1917] font-semibold text-xs tracking-wide transition-all cursor-pointer"
              >
                {t.nav_about}
              </button>
              <a
                href={getGeneralWhatsAppUrl('Story Section Contact', lang)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-white/10 hover:bg-white/20 text-white font-medium text-xs transition-all cursor-pointer border border-white/20"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>{t.hero_cta_secondary}</span>
              </a>
              <a
                href={getCallDirectUrl()}
                className="inline-flex items-center gap-2 text-stone-400 hover:text-white text-xs font-medium transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-[#C5A880]" />
                <span>{BUSINESS_PHONE_DISPLAY}</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Section 7: Quick Enquiry Callout */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 text-center space-y-4">
        <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#1C1917]">
          {lang === 'ta' ? 'தனிப்பயனாக்கப்பட்ட ஃபிரேம் தேவையா?' : 'Need a Custom Frame or Bulk Return Gifts?'}
        </h3>
        <p className="text-xs sm:text-sm text-[#57534E] max-w-xl mx-auto leading-relaxed">
          {lang === 'ta'
            ? 'உங்கள் விருப்பத்திற்கேற்ப எந்த அளவிலும், விரும்பிய புகைப்படங்களுடன் ஃப்ரேம்களை உருவாக்கி தருகிறோம். உடனே தொடர்பு கொள்ளவும்.'
            : 'We craft frames in any dimension, finish, or layout. Share your pictures and event requirements with us for a quick quotation.'}
        </p>
        <div className="pt-2 flex justify-center gap-3">
          <button
            onClick={onOpenEnquiryModal}
            className="px-6 py-3 rounded-md bg-[#1C1917] hover:bg-stone-800 text-white font-semibold text-xs tracking-wider transition-all shadow-md cursor-pointer"
          >
            {t.enquiry_title}
          </button>
          <a
            href={getGeneralWhatsAppUrl('Custom Order Request', lang)}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs tracking-wider transition-all shadow-md cursor-pointer inline-flex items-center gap-2"
          >
            <MessageCircle className="w-4 h-4" />
            <span>WhatsApp</span>
          </a>
        </div>
      </section>
    </div>
  );
}
