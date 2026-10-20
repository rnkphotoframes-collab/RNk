import { Gift, Sparkles, MessageCircle, Phone, CheckCircle2 } from 'lucide-react';
import { ReturnGiftCombo } from '../types/index.js';
import { useLanguage } from '../lib/i18n.js';
import { BUSINESS_PHONE_DISPLAY, getCallDirectUrl, getGeneralWhatsAppUrl } from '../lib/whatsapp.js';
import ComboCard from '../components/ComboCard.js';

interface CombosPageProps {
  combos: ReturnGiftCombo[];
  onOpenEnquiryModal: () => void;
}

export default function CombosPage({ combos, onOpenEnquiryModal }: CombosPageProps) {
  const { lang, t } = useLanguage();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 sm:py-14 space-y-12">
      {/* Page Header */}
      <div className="space-y-3 border-b border-[#E8E2D5] pb-8 text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F7F3EB] border border-[#E8E2D5] text-[#997A4D] text-xs font-semibold uppercase tracking-wider">
          <Gift className="w-3.5 h-3.5" />
          <span>Wedding & Event Favours</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#1C1917] leading-tight">
          {lang === 'ta' ? 'ரிட்டர்ன் கிஃப்ட் காம்போக்கள்' : 'Return Gift Combos'}
        </h1>
        <p className="text-xs sm:text-sm text-[#57534E] leading-relaxed">
          {lang === 'ta'
            ? 'திருமணம், கிரகப்பிரவேசம், பிறந்தநாள் மற்றும் சஷ்டியப்தபூர்த்தி போன்ற விசேஷங்களுக்கு வருகை தரும் விருந்தினர்களுக்கு அன்பான பரிசாக வழங்க பிரத்யேகமாக வடிவமைக்கப்பட்ட பரிசு தொகுப்புகள்.'
            : 'Pre-assembled gift hampers curated for weddings, housewarmings, baby ceremonies, and celebrations. Each set includes personalized mini frames and festive tokens.'}
        </p>

        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
          <a
            href={getGeneralWhatsAppUrl('Bulk Return Gifts Order Inquiry', lang)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-[#1C1917] hover:bg-stone-800 text-white text-xs font-semibold tracking-wide transition-all shadow-xs"
          >
            <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span>{t.enquire_whatsapp}</span>
          </a>
          <button
            onClick={onOpenEnquiryModal}
            className="px-5 py-2.5 rounded-md bg-[#F4F0E8] hover:bg-[#EAE4D8] border border-[#E8E2D5] text-[#1C1917] text-xs font-semibold transition-all cursor-pointer"
          >
            {t.quick_enquiry}
          </button>
        </div>
      </div>

      {/* Grid of combos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {combos.map(combo => (
          <ComboCard key={combo.id} combo={combo} />
        ))}
      </div>

      {/* Bulk Order Promise Banner */}
      <div className="bg-[#FAF8F5] rounded-xl border-2 border-dashed border-[#C5A880]/60 p-6 sm:p-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center sm:text-left">
          <div className="space-y-1">
            <h4 className="font-serif text-lg font-bold text-[#1C1917]">
              {lang === 'ta' ? 'மொத்த ஆர்டர் தள்ளுபடி' : 'Bulk Order Benefits'}
            </h4>
            <p className="text-xs text-[#57534E] leading-relaxed">
              Attractive discounted slabs for orders over 50, 100, and 250 units.
            </p>
          </div>

          <div className="space-y-1">
            <h4 className="font-serif text-lg font-bold text-[#1C1917]">
              {lang === 'ta' ? 'தனிப்பயனாக்கம்' : 'Free Personalization'}
            </h4>
            <p className="text-xs text-[#57534E] leading-relaxed">
              Couple initials, baby photo, or devotional artwork inserted free of charge.
            </p>
          </div>

          <div className="space-y-1">
            <h4 className="font-serif text-lg font-bold text-[#1C1917]">
              {lang === 'ta' ? 'நேரடி விநியோகம்' : 'Safe Delivery'}
            </h4>
            <p className="text-xs text-[#57534E] leading-relaxed">
              Dispatched safely across Tiruvallur, Chennai, Vellore, and Chittoor districts.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
