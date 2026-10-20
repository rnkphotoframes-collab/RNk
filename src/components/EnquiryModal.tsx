import { useState } from 'react';
import { X, Send, CheckCircle2, AlertCircle, Phone, MessageCircle } from 'lucide-react';
import { Product, ProductSize, ReturnGiftCombo } from '../types/index.js';
import { useLanguage } from '../lib/i18n.js';
import { submitCustomerEnquiry } from '../lib/api.js';

interface EnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product | null;
  selectedSize?: ProductSize | null;
  combo?: ReturnGiftCombo | null;
}

export default function EnquiryModal({
  isOpen,
  onClose,
  product,
  selectedSize,
  combo,
}: EnquiryModalProps) {
  const { lang, t } = useLanguage();

  const [customerName, setCustomerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || customerName.trim().length < 2) {
      setErrorMessage(lang === 'ta' ? 'தயவுசெய்து உங்கள் பெயரை உள்ளிடவும்' : 'Please enter your name');
      setStatus('error');
      return;
    }
    if (!phoneNumber.trim() || phoneNumber.trim().length < 8) {
      setErrorMessage(lang === 'ta' ? 'சரியான தொலைபேசி எண்ணை உள்ளிடவும்' : 'Please enter a valid phone number');
      setStatus('error');
      return;
    }

    setIsSubmitting(true);
    setStatus('idle');
    setErrorMessage('');

    try {
      await submitCustomerEnquiry({
        customer_name: customerName,
        phone_number: phoneNumber,
        product_id: product?.id || null,
        combo_id: combo?.id || null,
        selected_size: selectedSize ? `${selectedSize.size_label_en}` : null,
        enquiry_type: product ? 'product' : combo ? 'combo' : 'general',
        message: message.trim() || 'Customer requested contact regarding this item.',
      });

      setStatus('success');
      setTimeout(() => {
        // Reset after success
        setCustomerName('');
        setPhoneNumber('');
        setMessage('');
      }, 500);
    } catch (err: any) {
      setStatus('error');
      setErrorMessage(err.message || t.enquiry_error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="relative bg-[#FAF8F5] rounded-xl border border-[#E8E2D5] max-w-lg w-full overflow-hidden shadow-2xl p-6 sm:p-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-stone-200 text-stone-600 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {status === 'success' ? (
          <div className="text-center py-8 space-y-4">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto border border-emerald-300">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-[#1C1917]">
              {lang === 'ta' ? 'தகவல் பெறப்பட்டது!' : 'Enquiry Received!'}
            </h3>
            <p className="text-xs sm:text-sm text-[#57534E] leading-relaxed max-w-sm mx-auto">
              {t.enquiry_success}
            </p>
            <div className="pt-4">
              <button
                onClick={() => {
                  setStatus('idle');
                  onClose();
                }}
                className="px-6 py-2.5 rounded-md bg-[#1C1917] text-white text-xs font-semibold hover:bg-stone-800 transition-all cursor-pointer"
              >
                {t.close}
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <span className="text-xs font-bold text-[#997A4D] tracking-widest uppercase block mb-1">
                RNK Photo Frames • PodaturPet
              </span>
              <h3 className="font-serif text-2xl font-bold text-[#1C1917]">
                {t.enquiry_title}
              </h3>
              <p className="text-xs text-[#57534E] mt-1 leading-relaxed">
                {t.enquiry_subtitle}
              </p>
            </div>

            {/* Context Item Preview if opened for a product/combo */}
            {(product || combo) && (
              <div className="p-3 rounded-lg bg-white border border-[#E8E2D5] flex items-center gap-3">
                <img
                  src={product?.primary_image_path || combo?.primary_image_path}
                  alt="Item"
                  className="w-12 h-12 object-cover rounded-md shrink-0 border border-stone-200"
                />
                <div className="overflow-hidden">
                  <p className="text-xs font-bold text-[#1C1917] truncate">
                    {product
                      ? lang === 'ta' && product.name_ta ? product.name_ta : product.name_en
                      : lang === 'ta' && combo?.name_ta ? combo.name_ta : combo?.name_en}
                  </p>
                  {selectedSize && (
                    <p className="text-[11px] text-[#997A4D] font-medium">
                      {t.label_size}: {selectedSize.size_label_en} (₹{selectedSize.offer_price || selectedSize.original_price})
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Error Message */}
            {status === 'error' && (
              <div className="p-3 rounded-md bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Form Fields */}
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-[#1C1917] block mb-1">
                  {t.label_name} *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Kumar"
                  value={customerName}
                  onChange={e => setCustomerName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-md bg-white border border-[#D8D0C0] text-xs text-[#1C1917] focus:border-[#C5A880] focus:ring-1 focus:ring-[#C5A880] outline-none transition-all"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#1C1917] block mb-1">
                  {t.label_phone} *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 9876543210"
                  value={phoneNumber}
                  onChange={e => setPhoneNumber(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-md bg-white border border-[#D8D0C0] text-xs text-[#1C1917] focus:border-[#C5A880] focus:ring-1 focus:ring-[#C5A880] outline-none transition-all"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#1C1917] block mb-1">
                  {t.label_message}
                </label>
                <textarea
                  rows={3}
                  placeholder={lang === 'ta' ? 'தேவையான எண்ணிக்கை, அளவு அல்லது கூடுதல் விவரங்கள்...' : 'Quantity needed, delivery date, custom photo requirements...'}
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-md bg-white border border-[#D8D0C0] text-xs text-[#1C1917] focus:border-[#C5A880] focus:ring-1 focus:ring-[#C5A880] outline-none transition-all resize-none"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-md bg-[#1C1917] hover:bg-stone-800 text-white font-semibold text-xs tracking-wide transition-all shadow-md cursor-pointer disabled:opacity-60"
              >
                <Send className="w-3.5 h-3.5 text-[#C5A880]" />
                <span>{isSubmitting ? 'Sending...' : t.btn_submit_enquiry}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
