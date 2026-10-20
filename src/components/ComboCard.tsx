import { MessageCircle, Gift, CheckCircle2 } from 'lucide-react';
import { ReturnGiftCombo } from '../types/index.js';
import { useLanguage } from '../lib/i18n.js';
import { getComboWhatsAppUrl } from '../lib/whatsapp.js';

interface ComboCardProps {
  combo: ReturnGiftCombo;
  onViewDetails?: (combo: ReturnGiftCombo) => void;
}

export default function ComboCard({ combo, onViewDetails }: ComboCardProps) {
  const { lang, t } = useLanguage();

  const name = lang === 'ta' && combo.name_ta ? combo.name_ta : combo.name_en;
  const desc = lang === 'ta' && combo.description_ta ? combo.description_ta : combo.description_en;

  const price = combo.offer_price || combo.original_price;
  const originalPrice = combo.offer_price ? combo.original_price : null;
  const discountPercent =
    originalPrice && price && originalPrice > price
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : null;

  return (
    <div className="group bg-white rounded-lg border border-[#E8E2D5] overflow-hidden flex flex-col hover:border-[#C5A880] transition-all duration-300 hover:shadow-md">
      {/* Combo Image Area */}
      <div className="relative aspect-16/10 w-full bg-[#F4F0E8] overflow-hidden">
        <img
          src={combo.primary_image_path || 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=800'}
          alt={name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />

        {/* Combo Badge */}
        <div className="absolute top-3 left-3 px-2.5 py-1 rounded-sm bg-[#1C1917]/90 text-white text-[11px] font-semibold tracking-wider uppercase flex items-center gap-1.5 backdrop-blur-xs">
          <Gift className="w-3 h-3 text-[#C5A880]" />
          <span>{lang === 'ta' ? 'ரிட்டர்ன் கிஃப்ட் காம்போ' : 'Return Gift Combo'}</span>
        </div>

        {/* Discount Badge */}
        {discountPercent && (
          <div className="absolute top-3 right-3 px-2 py-0.5 rounded-sm bg-[#997A4D] text-white text-[11px] font-bold tracking-wider">
            {discountPercent}% OFF
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <h3
            onClick={() => onViewDetails && onViewDetails(combo)}
            className="font-serif text-lg font-bold text-[#1C1917] line-clamp-1 group-hover:text-[#997A4D] transition-colors cursor-pointer"
          >
            {name}
          </h3>
          <p className="text-xs text-[#57534E] line-clamp-2 leading-relaxed">
            {desc}
          </p>

          {/* Included Items Checklist */}
          {combo.included_items && combo.included_items.length > 0 && (
            <div className="pt-2">
              <span className="text-[11px] font-semibold text-[#1C1917] block mb-1.5">
                {t.included_in_combo}
              </span>
              <ul className="space-y-1 bg-[#FBF9F6] p-2.5 rounded-md border border-[#E8E2D5]/70">
                {combo.included_items.map((item, idx) => (
                  <li key={item.id || idx} className="text-xs text-[#57534E] flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#997A4D] shrink-0" />
                    <span>
                      <strong className="text-[#1C1917]">{item.quantity}x</strong>{' '}
                      {lang === 'ta' && item.name_ta ? item.name_ta : item.name_en}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Pricing and Action */}
        <div className="pt-3 border-t border-[#F4F0E8] flex items-end justify-between gap-2">
          <div>
            <span className="text-[11px] text-stone-500 block leading-tight">
              {lang === 'ta' ? 'தொகுப்பு விலை (ஒரு செட்)' : 'Price per Set'}
            </span>
            <div className="flex items-baseline gap-2">
              <span className="font-serif text-xl font-bold text-[#1C1917]">
                ₹{price}
              </span>
              {originalPrice && (
                <span className="text-xs text-stone-400 line-through">
                  ₹{originalPrice}
                </span>
              )}
            </div>
          </div>

          <a
            href={getComboWhatsAppUrl(combo, lang)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md bg-[#1C1917] hover:bg-[#292524] text-white text-xs font-semibold tracking-wide transition-all cursor-pointer shadow-xs"
          >
            <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span>{t.enquire_whatsapp}</span>
          </a>
        </div>
      </div>
    </div>
  );
}
