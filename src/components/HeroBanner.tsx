import { useState, useEffect } from 'react';
import { MessageCircle, ChevronRight, ChevronLeft, Sparkles } from 'lucide-react';
import { Banner } from '../types/index.js';
import { useLanguage } from '../lib/i18n.js';
import { getGeneralWhatsAppUrl } from '../lib/whatsapp.js';

interface HeroBannerProps {
  banners: Banner[];
  onNavigate: (route: string) => void;
}

export default function HeroBanner({ banners, onNavigate }: HeroBannerProps) {
  const { lang, t } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);

  // Filter active banners
  const activeBanners = banners.filter(b => b.is_active);

  useEffect(() => {
    if (activeBanners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % activeBanners.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [activeBanners.length]);

  if (activeBanners.length === 0) {
    return null;
  }

  const currentBanner = activeBanners[currentIndex] || activeBanners[0];
  const heading = lang === 'ta' && currentBanner.heading_ta ? currentBanner.heading_ta : currentBanner.heading_en;
  const subtitle = lang === 'ta' && currentBanner.subtitle_ta ? currentBanner.subtitle_ta : currentBanner.subtitle_en;
  const ctaLabel = lang === 'ta' && currentBanner.cta_label_ta ? currentBanner.cta_label_ta : currentBanner.cta_label_en;

  return (
    <section className="relative w-full bg-[#1C1917] overflow-hidden text-white min-h-[500px] lg:min-h-[580px] flex items-center">
      {/* Background image with refined editorial overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={currentBanner.image_path}
          alt={heading}
          className="w-full h-full object-cover object-center brightness-45 scale-105 transition-all duration-1000 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1C1917]/90 via-[#1C1917]/65 to-transparent" />
        <div className="absolute inset-0 bg-radial from-transparent via-transparent to-[#1C1917]/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 py-16 lg:py-24 w-full">
        <div className="max-w-2xl space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FAF8F5]/10 backdrop-blur-md border border-[#C5A880]/40 text-[#EFE7DB] text-xs font-medium tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-[#C5A880]" />
            <span>{t.hero_badge}</span>
          </div>

          {/* Heading */}
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#FAF8F5] leading-[1.15]">
            {heading}
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-stone-300 font-light leading-relaxed max-w-xl">
            {subtitle}
          </p>

          {/* Action CTAs */}
          <div className="pt-2 flex flex-wrap items-center gap-3 sm:gap-4">
            <button
              onClick={() => onNavigate(currentBanner.cta_destination || '/catalogue')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-md bg-[#C5A880] hover:bg-[#B89758] text-[#1C1917] font-semibold text-sm tracking-wide transition-all shadow-md cursor-pointer hover:scale-[1.02]"
            >
              <span>{ctaLabel || t.hero_cta_primary}</span>
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate('/combos')}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-md bg-white/10 hover:bg-white/20 text-[#FAF8F5] border border-white/20 font-medium text-sm tracking-wide transition-all cursor-pointer"
            >
              <span>{t.hero_cta_combos}</span>
            </button>

            <a
              href={getGeneralWhatsAppUrl('Enquiry from Hero Banner', lang)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-md bg-emerald-600/90 hover:bg-emerald-600 text-white font-medium text-sm tracking-wide transition-all cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{t.hero_cta_secondary}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Carousel navigation indicators */}
      {activeBanners.length > 1 && (
        <>
          <button
            onClick={() => setCurrentIndex((currentIndex - 1 + activeBanners.length) % activeBanners.length)}
            aria-label="Previous banner"
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/30 hover:bg-black/60 text-white backdrop-blur-xs transition-all cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => setCurrentIndex((currentIndex + 1) % activeBanners.length)}
            aria-label="Next banner"
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/30 hover:bg-black/60 text-white backdrop-blur-xs transition-all cursor-pointer"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
            {activeBanners.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-1.5 transition-all rounded-full cursor-pointer ${
                  currentIndex === idx ? 'w-8 bg-[#C5A880]' : 'w-2 bg-white/40 hover:bg-white/70'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
