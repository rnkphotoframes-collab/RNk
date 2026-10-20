import { MapPin, Phone, MessageCircle, ShieldCheck, Award, Heart, CheckCircle2 } from 'lucide-react';
import { BusinessSettings } from '../types/index.js';
import { useLanguage } from '../lib/i18n.js';
import { BUSINESS_PHONE_DISPLAY, getCallDirectUrl, getGeneralWhatsAppUrl } from '../lib/whatsapp.js';

interface AboutPageProps {
  settings?: BusinessSettings | null;
}

export default function AboutPage({ settings }: AboutPageProps) {
  const { lang, t } = useLanguage();

  const intro =
    lang === 'ta' && settings?.introduction_ta
      ? settings.introduction_ta
      : settings?.introduction_en || t.footer_desc;

  const aboutBody =
    lang === 'ta' && settings?.about_text_ta
      ? settings.about_text_ta
      : settings?.about_text_en ||
        'RNK Photo Frames was established with a singular passion: turning fleeting moments into everlasting treasures. Every frame is assembled with high-density moisture-resistant backboards, premium glass or unbreakable acrylic, and meticulous finishing.';

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-8 py-12 sm:py-16 space-y-16">
      {/* Title Header */}
      <div className="text-center space-y-4 max-w-2xl mx-auto border-b border-[#E8E2D5] pb-10">
        <span className="text-xs font-bold text-[#997A4D] uppercase tracking-widest block">
          Our Heritage & Craftsmanship
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#1C1917] leading-tight">
          {lang === 'ta' ? 'RNK போட்டோ ஃப்ரேம்ஸ் பற்றி' : 'About RNK Photo Frames'}
        </h1>
        <p className="text-xs sm:text-sm text-[#57534E] leading-relaxed">
          {lang === 'ta'
            ? 'பொதட்டூர்பேட்டையில் அமைந்துள்ள பாரம்பரிய போட்டோ ஃப்ரேம் தயாரிப்பகம்.'
            : 'Artisan frame crafting studio rooted in PodaturPet, Tiruttani, Tamil Nadu.'}
        </p>
      </div>

      {/* Main Story & Image Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <div className="relative aspect-4/3 rounded-xl overflow-hidden border border-[#E8E2D5] shadow-md">
          <img
            src="https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=1000"
            alt="RNK Studio Framing"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 text-white text-xs font-medium">
            Handcrafted with precision in PodaturPet, Tiruttani.
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="font-serif text-2xl font-bold text-[#1C1917]">
            {lang === 'ta' ? 'அழகான நினைவுகளை பாதுகாக்கும் கலை' : 'Preserving Life’s Most Beautiful Memories'}
          </h2>
          <p className="text-xs sm:text-sm text-[#57534E] leading-relaxed">
            {intro}
          </p>
          <p className="text-xs sm:text-sm text-[#57534E] leading-relaxed">
            {aboutBody}
          </p>

          <div className="pt-2 space-y-2">
            <div className="flex items-center gap-2 text-xs text-[#1C1917] font-semibold">
              <CheckCircle2 className="w-4 h-4 text-[#997A4D]" />
              <span>Moisture-proof, warp-resistant backing boards</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-[#1C1917] font-semibold">
              <CheckCircle2 className="w-4 h-4 text-[#997A4D]" />
              <span>UV-resistant photo printing to prevent fading</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-[#1C1917] font-semibold">
              <CheckCircle2 className="w-4 h-4 text-[#997A4D]" />
              <span>Bulk return gift hampers with custom names & packaging</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quality Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
        <div className="bg-white p-6 rounded-xl border border-[#E8E2D5] space-y-3">
          <div className="w-10 h-10 rounded-full bg-[#F7F3EB] flex items-center justify-center text-[#997A4D]">
            <Award className="w-5 h-5" />
          </div>
          <h3 className="font-serif text-lg font-bold text-[#1C1917]">
            {lang === 'ta' ? 'உயர்ந்த தரம்' : 'Artisan Quality'}
          </h3>
          <p className="text-xs text-[#57534E] leading-relaxed">
            Every frame undergoes multi-stage edge polishing, corner reinforcing, and crystal-clear front inspection before dispatch.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-[#E8E2D5] space-y-3">
          <div className="w-10 h-10 rounded-full bg-[#F7F3EB] flex items-center justify-center text-[#997A4D]">
            <Heart className="w-5 h-5" />
          </div>
          <h3 className="font-serif text-lg font-bold text-[#1C1917]">
            {lang === 'ta' ? 'தனிப்பயனாக்கம்' : 'Tailored to You'}
          </h3>
          <p className="text-xs text-[#57534E] leading-relaxed">
            Choose bespoke sizes, warm LED backlights, collage layouts, or customized wedding couple portraits.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-[#E8E2D5] space-y-3">
          <div className="w-10 h-10 rounded-full bg-[#F7F3EB] flex items-center justify-center text-[#997A4D]">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-serif text-lg font-bold text-[#1C1917]">
            {lang === 'ta' ? 'நேரடி தயாரிப்பாளர் விலை' : 'Workshop Direct Pricing'}
          </h3>
          <p className="text-xs text-[#57534E] leading-relaxed">
            Enjoy factory-direct prices without intermediary markups, ideal for both retail customers and wholesale bulk event organizers.
          </p>
        </div>
      </div>

      {/* Workshop Location & Contact Card */}
      <div className="bg-[#FAF8F5] p-6 sm:p-8 rounded-xl border border-[#C5A880]/40 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center sm:text-left">
          <h4 className="font-serif text-xl font-bold text-[#1C1917]">
            RNK Photo Frames • PodaturPet
          </h4>
          <p className="text-xs text-[#57534E]">
            Main Bazaar Road, PodaturPet, Tiruttani Taluk, Tamil Nadu - 631208
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href={getCallDirectUrl()}
            className="flex items-center gap-2 px-4 py-2.5 rounded-md bg-white border border-[#E8E2D5] text-[#1C1917] text-xs font-semibold hover:bg-stone-50 transition-colors"
          >
            <Phone className="w-4 h-4 text-[#997A4D]" />
            <span>{BUSINESS_PHONE_DISPLAY}</span>
          </a>
          <a
            href={getGeneralWhatsAppUrl('About Page Inquiry', lang)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2.5 rounded-md bg-[#1C1917] text-white text-xs font-semibold hover:bg-stone-800 transition-colors"
          >
            <MessageCircle className="w-4 h-4 text-emerald-400" />
            <span>WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
}
