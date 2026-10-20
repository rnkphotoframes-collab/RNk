import { MessageCircle, Eye, Images, Tag } from 'lucide-react';
import { Product } from '../types/index.js';
import { useLanguage } from '../lib/i18n.js';
import { getProductWhatsAppUrl } from '../lib/whatsapp.js';

interface ProductCardProps {
  product: Product;
  onViewDetails: (product: Product) => void;
}

export default function ProductCard({ product, onViewDetails }: ProductCardProps) {
  const { lang, t } = useLanguage();

  const name = lang === 'ta' && product.name_ta ? product.name_ta : product.name_en;
  const shortDesc = lang === 'ta' && product.short_description_ta ? product.short_description_ta : product.short_description_en;
  const categoryName = lang === 'ta' && product.category_name_ta ? product.category_name_ta : product.category_name_en;

  // Determine displayed price:
  // If sizes exist, find lowest offer_price or lowest original_price
  let displayPrice: number | null = null;
  let displayOriginalPrice: number | null = null;
  let hasMultipleSizes = product.sizes && product.sizes.length > 0;

  if (hasMultipleSizes) {
    const availableSizes = product.sizes.filter(s => s.is_available);
    if (availableSizes.length > 0) {
      // Pick first or lowest price size
      const firstSize = availableSizes[0];
      displayPrice = firstSize.offer_price || firstSize.original_price;
      displayOriginalPrice = firstSize.offer_price ? firstSize.original_price : null;
    }
  } else {
    displayPrice = product.offer_price || product.original_price;
    displayOriginalPrice = product.offer_price ? product.original_price : null;
  }

  const discountPercent =
    displayOriginalPrice && displayPrice && displayOriginalPrice > displayPrice
      ? Math.round(((displayOriginalPrice - displayPrice) / displayOriginalPrice) * 100)
      : null;

  const imageCount = (product.images?.length || 0) + (product.primary_image_path ? 1 : 0);

  return (
    <div className="group bg-white rounded-lg border border-[#E8E2D5] overflow-hidden flex flex-col hover:border-[#C5A880] transition-all duration-300 hover:shadow-md">
      {/* Product Image Area */}
      <div className="relative aspect-4/3 w-full bg-[#F4F0E8] overflow-hidden">
        <img
          src={product.primary_image_path || 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=800'}
          alt={name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />

        {/* Category Badge */}
        {categoryName && (
          <div className="absolute top-3 left-3 px-2.5 py-1 rounded-sm bg-white/90 backdrop-blur-xs text-[11px] font-semibold text-[#1C1917] tracking-wider uppercase border border-stone-200">
            {categoryName}
          </div>
        )}

        {/* Discount Badge */}
        {discountPercent && (
          <div className="absolute top-3 right-3 px-2 py-0.5 rounded-sm bg-[#997A4D] text-white text-[11px] font-bold tracking-wider">
            {discountPercent}% OFF
          </div>
        )}

        {/* Image count pill */}
        {imageCount > 1 && (
          <div className="absolute bottom-3 right-3 px-2 py-1 rounded-sm bg-black/60 backdrop-blur-xs text-white text-[11px] font-medium flex items-center gap-1">
            <Images className="w-3 h-3" />
            <span>{imageCount}</span>
          </div>
        )}
      </div>

      {/* Product Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-1.5">
          <h3
            onClick={() => onViewDetails(product)}
            className="font-serif text-lg font-bold text-[#1C1917] line-clamp-1 group-hover:text-[#997A4D] transition-colors cursor-pointer"
          >
            {name}
          </h3>
          <p className="text-xs text-[#57534E] line-clamp-2 leading-relaxed">
            {shortDesc}
          </p>
        </div>

        {/* Sizes preview if available */}
        {hasMultipleSizes && (
          <div className="pt-1 flex flex-wrap items-center gap-1.5">
            <Tag className="w-3 h-3 text-[#C5A880] shrink-0" />
            <span className="text-[11px] text-stone-500 font-medium">
              {product.sizes.length} {lang === 'ta' ? 'அளவுகள் உள்ளன' : 'Sizes'}:
            </span>
            <div className="flex flex-wrap gap-1">
              {product.sizes.slice(0, 3).map(s => (
                <span
                  key={s.id}
                  className="px-1.5 py-0.5 rounded-xs bg-[#F7F3EB] text-[#1C1917] text-[10px] font-medium border border-[#E8E2D5]"
                >
                  {lang === 'ta' && s.size_label_ta ? s.size_label_ta : s.size_label_en}
                </span>
              ))}
              {product.sizes.length > 3 && (
                <span className="text-[10px] text-stone-400">+{product.sizes.length - 3}</span>
              )}
            </div>
          </div>
        )}

        {/* Price and Actions */}
        <div className="pt-2 border-t border-[#F4F0E8] flex items-end justify-between gap-2">
          <div>
            <span className="text-[11px] text-stone-500 block leading-tight">
              {hasMultipleSizes ? t.price_from : t.offer_price}
            </span>
            <div className="flex items-baseline gap-2">
              <span className="font-serif text-xl font-bold text-[#1C1917]">
                {displayPrice ? `₹${displayPrice}` : 'Price on Request'}
              </span>
              {displayOriginalPrice && (
                <span className="text-xs text-stone-400 line-through">
                  ₹{displayOriginalPrice}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onViewDetails(product)}
              className="p-2 rounded-md bg-[#FAF8F5] hover:bg-[#F4F0E8] text-[#1C1917] border border-[#E8E2D5] transition-colors cursor-pointer"
              title={t.view_details}
            >
              <Eye className="w-4 h-4 text-[#57534E]" />
            </button>

            <a
              href={getProductWhatsAppUrl(product, null, lang)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md bg-[#1C1917] hover:bg-[#292524] text-white text-xs font-semibold tracking-wide transition-all cursor-pointer shadow-xs"
              title={t.enquire_whatsapp}
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
