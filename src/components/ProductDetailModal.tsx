import { useState, useEffect } from 'react';
import { X, MessageCircle, Phone, Tag, Check, ShieldCheck, Mail } from 'lucide-react';
import { Product, ProductSize } from '../types/index.js';
import { useLanguage } from '../lib/i18n.js';
import { getProductWhatsAppUrl, getCallDirectUrl, BUSINESS_PHONE_DISPLAY } from '../lib/whatsapp.js';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onOpenEnquiryModal: (product: Product, size?: ProductSize | null) => void;
  onSelectRelatedProduct?: (product: Product) => void;
  allProducts?: Product[];
}

export default function ProductDetailModal({
  product,
  onClose,
  onOpenEnquiryModal,
  onSelectRelatedProduct,
  allProducts = [],
}: ProductDetailModalProps) {
  const { lang, t } = useLanguage();

  const [selectedImage, setSelectedImage] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<ProductSize | null>(null);

  useEffect(() => {
    if (product) {
      setSelectedImage(product.primary_image_path || '');
      if (product.sizes && product.sizes.length > 0) {
        const defaultSize = product.sizes.find(s => s.is_available) || product.sizes[0];
        setSelectedSize(defaultSize || null);
      } else {
        setSelectedSize(null);
      }
    }
  }, [product]);

  if (!product) return null;

  const name = lang === 'ta' && product.name_ta ? product.name_ta : product.name_en;
  const description = lang === 'ta' && product.description_ta ? product.description_ta : product.description_en;
  const categoryName = lang === 'ta' && product.category_name_ta ? product.category_name_ta : product.category_name_en;

  // Gallery images list (primary image + all gallery images)
  const allImages = [
    product.primary_image_path,
    ...(product.images || []).map(img => img.storage_path),
  ].filter(Boolean);
  const uniqueImages = Array.from(new Set(allImages));

  // Determine current active price
  let currentOriginalPrice: number | null = null;
  let currentOfferPrice: number | null = null;

  if (selectedSize) {
    currentOriginalPrice = selectedSize.original_price;
    currentOfferPrice = selectedSize.offer_price;
  } else {
    currentOriginalPrice = product.original_price;
    currentOfferPrice = product.offer_price;
  }

  const finalDisplayPrice = currentOfferPrice || currentOriginalPrice;
  const discountPercent =
    currentOriginalPrice && currentOfferPrice && currentOriginalPrice > currentOfferPrice
      ? Math.round(((currentOriginalPrice - currentOfferPrice) / currentOriginalPrice) * 100)
      : null;

  // Related products from same category
  const related = allProducts
    .filter(p => p.id !== product.id && p.category_id === product.category_id)
    .slice(0, 3);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="relative bg-[#FAF8F5] rounded-xl border border-[#E8E2D5] max-w-4xl w-full overflow-hidden shadow-2xl my-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label={t.close}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/80 hover:bg-white text-stone-700 hover:text-stone-900 border border-stone-200 transition-all cursor-pointer shadow-xs"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left Column: Image Gallery */}
          <div className="p-6 bg-[#F4F0E8] flex flex-col justify-between">
            <div className="space-y-4">
              {/* Main Preview Image */}
              <div className="relative aspect-4/3 w-full bg-white rounded-lg overflow-hidden border border-[#E8E2D5] shadow-xs">
                <img
                  src={selectedImage || product.primary_image_path}
                  alt={name}
                  className="w-full h-full object-cover object-center transition-all duration-300"
                />
                {discountPercent && (
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-sm bg-[#997A4D] text-white text-xs font-bold tracking-wider">
                    {discountPercent}% OFF
                  </div>
                )}
              </div>

              {/* Thumbnail Bar */}
              {uniqueImages.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-2">
                  {uniqueImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(img)}
                      className={`relative w-16 h-16 rounded-md overflow-hidden border-2 shrink-0 cursor-pointer transition-all ${
                        selectedImage === img
                          ? 'border-[#C5A880] ring-2 ring-[#C5A880]/30'
                          : 'border-white opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Quality badge note */}
            <div className="pt-4 mt-4 border-t border-[#E8E2D5] flex items-center gap-2 text-xs text-[#57534E]">
              <ShieldCheck className="w-4 h-4 text-[#997A4D] shrink-0" />
              <span>Authentic finish with crystal-clear moisture resistant protection.</span>
            </div>
          </div>

          {/* Right Column: Information, Sizes, Prices & WhatsApp Enquiry */}
          <div className="p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              {/* Category Pill */}
              {categoryName && (
                <span className="inline-block px-2.5 py-1 rounded-sm bg-[#F7F3EB] text-[#997A4D] text-[11px] font-semibold tracking-wider uppercase border border-[#E8E2D5]">
                  {categoryName}
                </span>
              )}

              {/* Title */}
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1C1917] leading-tight">
                {name}
              </h2>

              {/* Price display based on selected size or base product */}
              <div className="p-3.5 rounded-lg bg-white border border-[#E8E2D5] space-y-1">
                <span className="text-xs text-stone-500 font-medium block">
                  {selectedSize ? `${t.label_size}: ${lang === 'ta' && selectedSize.size_label_ta ? selectedSize.size_label_ta : selectedSize.size_label_en}` : t.offer_price}
                </span>
                <div className="flex items-baseline gap-3">
                  <span className="font-serif text-2xl sm:text-3xl font-bold text-[#1C1917]">
                    {finalDisplayPrice ? `₹${finalDisplayPrice}` : 'Price on Request'}
                  </span>
                  {currentOriginalPrice && currentOfferPrice && (
                    <span className="text-sm text-stone-400 line-through">
                      ₹{currentOriginalPrice}
                    </span>
                  )}
                  {discountPercent && (
                    <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-xs border border-emerald-200">
                      Save ₹{currentOriginalPrice! - currentOfferPrice!}
                    </span>
                  )}
                </div>
              </div>

              {/* Size Selector */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold text-[#1C1917]">
                    <span>{t.select_size}:</span>
                    <span className="text-stone-500 font-normal">
                      (Prices adjust per frame dimensions)
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {product.sizes.map(size => {
                      const isSelected = selectedSize?.id === size.id;
                      const sizePrice = size.offer_price || size.original_price;
                      return (
                        <button
                          key={size.id}
                          onClick={() => setSelectedSize(size)}
                          className={`p-2.5 rounded-md border text-left transition-all cursor-pointer flex flex-col justify-between ${
                            isSelected
                              ? 'border-[#C5A880] bg-[#F7F3EB] text-[#1C1917] ring-1 ring-[#C5A880]'
                              : 'border-[#E8E2D5] bg-white text-stone-700 hover:border-stone-400'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold">
                              {lang === 'ta' && size.size_label_ta ? size.size_label_ta : size.size_label_en}
                            </span>
                            {isSelected && <Check className="w-3.5 h-3.5 text-[#997A4D]" />}
                          </div>
                          <span className="text-xs font-bold text-[#1C1917] mt-1">
                            ₹{sizePrice}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Description */}
              <div className="space-y-1.5 pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-600">
                  {t.product_details}
                </h4>
                <p className="text-xs text-[#57534E] leading-relaxed">
                  {description}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2.5 pt-3 border-t border-[#E8E2D5]">
              <a
                href={getProductWhatsAppUrl(product, selectedSize, lang)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-3 rounded-md bg-[#1C1917] hover:bg-[#292524] text-white font-semibold text-sm tracking-wide transition-all shadow-md cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>{t.enquire_whatsapp}</span>
              </a>

              <div className="grid grid-cols-2 gap-2">
                <a
                  href={getCallDirectUrl()}
                  className="flex items-center justify-center gap-2 py-2.5 rounded-md bg-white hover:bg-stone-50 border border-[#E8E2D5] text-[#1C1917] font-medium text-xs transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-[#997A4D]" />
                  <span>{BUSINESS_PHONE_DISPLAY}</span>
                </a>

                <button
                  onClick={() => {
                    onClose();
                    onOpenEnquiryModal(product, selectedSize);
                  }}
                  className="flex items-center justify-center gap-2 py-2.5 rounded-md bg-[#F4F0E8] hover:bg-[#EAE4D8] border border-[#E8E2D5] text-[#1C1917] font-medium text-xs transition-colors cursor-pointer"
                >
                  <Mail className="w-3.5 h-3.5 text-[#997A4D]" />
                  <span>{t.quick_enquiry}</span>
                </button>
              </div>
            </div>

            {/* Related products snippet */}
            {related.length > 0 && onSelectRelatedProduct && (
              <div className="pt-2 border-t border-[#E8E2D5]">
                <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block mb-2">
                  {t.related_products}
                </span>
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {related.map(rel => (
                    <button
                      key={rel.id}
                      onClick={() => onSelectRelatedProduct(rel)}
                      className="flex items-center gap-2 p-1.5 rounded-md bg-white border border-[#E8E2D5] hover:border-[#C5A880] transition-all text-left shrink-0 cursor-pointer"
                    >
                      <img
                        src={rel.primary_image_path}
                        alt={rel.name_en}
                        className="w-8 h-8 rounded-sm object-cover"
                      />
                      <span className="text-[11px] font-medium text-[#1C1917] max-w-[120px] truncate">
                        {lang === 'ta' && rel.name_ta ? rel.name_ta : rel.name_en}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
