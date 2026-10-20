import { useState } from 'react';
import { Phone, MessageCircle, MapPin, Clock, Send, CheckCircle2, AlertCircle, ExternalLink } from 'lucide-react';
import { BusinessSettings } from '../types/index.js';
import { useLanguage } from '../lib/i18n.js';
import { BUSINESS_PHONE_DISPLAY, getCallDirectUrl, getGeneralWhatsAppUrl } from '../lib/whatsapp.js';
import { submitCustomerEnquiry } from '../lib/api.js';

interface ContactPageProps {
  settings?: BusinessSettings | null;
}

export default function ContactPage({ settings }: ContactPageProps) {
  const { lang, t } = useLanguage();

  const [customerName, setCustomerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [enquiryType, setEnquiryType] = useState<'general' | 'custom_order' | 'product' | 'combo'>('general');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const phone = settings?.phone || BUSINESS_PHONE_DISPLAY;
  const location = settings?.location || 'PodaturPet, Tiruttani, Tamil Nadu, India';
  const mapsUrl = settings?.google_maps_url || 'https://maps.google.com/?q=Podaturpet,Tiruttani,Tamil+Nadu';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || customerName.trim().length < 2) {
      setErrorMessage(lang === 'ta' ? 'தயவுசெய்து உங்கள் பெயரை உள்ளிடவும்' : 'Please enter your name');
      return;
    }
    if (!phoneNumber.trim() || phoneNumber.trim().length < 8) {
      setErrorMessage(lang === 'ta' ? 'சரியான தொலைபேசி எண்ணை உள்ளிடவும்' : 'Please enter a valid phone number');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      await submitCustomerEnquiry({
        customer_name: customerName,
        phone_number: phoneNumber,
        enquiry_type: enquiryType,
        message: message.trim() || 'Customer requested contact via website contact form.',
      });
      setIsSuccess(true);
      setCustomerName('');
      setPhoneNumber('');
      setMessage('');
    } catch (err: any) {
      setErrorMessage(err.message || t.enquiry_error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 sm:py-16 space-y-12">
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto border-b border-[#E8E2D5] pb-8">
        <span className="text-xs font-bold text-[#997A4D] uppercase tracking-widest block">
          Get in Touch
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#1C1917]">
          {t.contact_title}
        </h1>
        <p className="text-xs sm:text-sm text-[#57534E] leading-relaxed">
          {t.contact_subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Contact Info & Action Cards (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Studio card */}
          <div className="bg-white p-6 sm:p-8 rounded-xl border border-[#E8E2D5] shadow-xs space-y-6">
            <h3 className="font-serif text-xl font-bold text-[#1C1917] border-b border-[#F4F0E8] pb-3">
              RNK Photo Frames
            </h3>

            <div className="space-y-4 text-xs text-[#57534E]">
              {/* Location */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-[#F7F3EB] flex items-center justify-center shrink-0 text-[#997A4D]">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-semibold text-[#1C1917] block mb-0.5">{t.contact_address_label}</span>
                  <p className="leading-relaxed">{location}</p>
                  <a
                    href={mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[#997A4D] hover:underline font-semibold mt-1.5"
                  >
                    <span>{t.get_directions}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-[#F7F3EB] flex items-center justify-center shrink-0 text-[#997A4D]">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-semibold text-[#1C1917] block mb-0.5">{t.contact_phone_label}</span>
                  <a href={getCallDirectUrl()} className="text-sm font-bold text-[#1C1917] hover:text-[#997A4D]">
                    {phone}
                  </a>
                </div>
              </div>

              {/* WhatsApp */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center shrink-0 text-emerald-600">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-semibold text-[#1C1917] block mb-0.5">{t.contact_whatsapp_label}</span>
                  <a
                    href={getGeneralWhatsAppUrl('Contact Page Quick Enquiry', lang)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-bold text-emerald-700 hover:underline"
                  >
                    +91 8681917433 (Chat Now)
                  </a>
                </div>
              </div>

              {/* Working Hours */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-[#F7F3EB] flex items-center justify-center shrink-0 text-stone-500">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-semibold text-[#1C1917] block mb-0.5">{t.contact_hours_label}</span>
                  <p>{t.contact_hours_val}</p>
                </div>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="pt-2 flex flex-col gap-2.5">
              <a
                href={getGeneralWhatsAppUrl('Direct Chat', lang)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-3 rounded-md bg-[#1C1917] hover:bg-stone-800 text-white font-semibold text-xs tracking-wider transition-all shadow-xs"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>Open WhatsApp Enquiry</span>
              </a>

              <a
                href={getCallDirectUrl()}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-md bg-[#F4F0E8] hover:bg-[#EAE4D8] border border-[#E8E2D5] text-[#1C1917] font-semibold text-xs transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-[#997A4D]" />
                <span>Call +91 8681917433</span>
              </a>
            </div>
          </div>
        </div>

        {/* Database Connected Enquiry Form (7 cols) */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-10 rounded-xl border border-[#E8E2D5] shadow-xs">
          {isSuccess ? (
            <div className="text-center py-12 space-y-4">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto border border-emerald-300">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-[#1C1917]">
                {lang === 'ta' ? 'தகவல் வெற்றிகரமாக பெறப்பட்டது!' : 'Enquiry Received Successfully!'}
              </h3>
              <p className="text-xs sm:text-sm text-[#57534E] leading-relaxed max-w-md mx-auto">
                {t.enquiry_success}
              </p>
              <button
                onClick={() => setIsSuccess(false)}
                className="px-6 py-2.5 rounded-md bg-[#1C1917] text-white text-xs font-semibold hover:bg-stone-800 transition-all cursor-pointer"
              >
                Send Another Enquiry
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1">
                <h3 className="font-serif text-2xl font-bold text-[#1C1917]">
                  {t.enquiry_title}
                </h3>
                <p className="text-xs text-[#57534E]">
                  {t.enquiry_subtitle}
                </p>
              </div>

              {errorMessage && (
                <div className="p-3 rounded-md bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-[#1C1917] block mb-1">
                    {t.label_name} *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Anand Kumar"
                    value={customerName}
                    onChange={e => setCustomerName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-md bg-[#FAF8F5] border border-[#D8D0C0] text-xs text-[#1C1917] focus:border-[#C5A880] focus:ring-1 focus:ring-[#C5A880] outline-none"
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
                    className="w-full px-3.5 py-2.5 rounded-md bg-[#FAF8F5] border border-[#D8D0C0] text-xs text-[#1C1917] focus:border-[#C5A880] focus:ring-1 focus:ring-[#C5A880] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#1C1917] block mb-1">
                  Enquiry Category
                </label>
                <select
                  value={enquiryType}
                  onChange={e => setEnquiryType(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-md bg-[#FAF8F5] border border-[#D8D0C0] text-xs text-[#1C1917] focus:border-[#C5A880] outline-none cursor-pointer"
                >
                  <option value="general">General Framing Inquiry</option>
                  <option value="custom_order">Custom Size / LED Photo Frame</option>
                  <option value="combo">Bulk Return Gift Combos (Weddings / Ceremonies)</option>
                  <option value="product">Specific Product Inquiry</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#1C1917] block mb-1">
                  {t.label_message}
                </label>
                <textarea
                  rows={4}
                  placeholder={lang === 'ta' ? 'தேவையான எண்ணிக்கை, அளவுகள் அல்லது விசேஷ விவரங்கள்...' : 'Please describe your frame dimensions, quantity, occasion, and delivery requirements...'}
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-md bg-[#FAF8F5] border border-[#D8D0C0] text-xs text-[#1C1917] focus:border-[#C5A880] focus:ring-1 focus:ring-[#C5A880] outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-md bg-[#1C1917] hover:bg-stone-800 text-white font-semibold text-xs tracking-wider transition-all shadow-md cursor-pointer disabled:opacity-60"
              >
                <Send className="w-3.5 h-3.5 text-[#C5A880]" />
                <span>{isSubmitting ? 'Submitting to Workshop...' : t.btn_submit_enquiry}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
