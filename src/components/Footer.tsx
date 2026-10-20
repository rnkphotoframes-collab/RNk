import { Phone, MessageCircle, MapPin, Clock, ShieldCheck, Heart } from 'lucide-react';
import { useLanguage } from '../lib/i18n.js';
import { BUSINESS_PHONE_DISPLAY, getCallDirectUrl, getGeneralWhatsAppUrl } from '../lib/whatsapp.js';

interface FooterProps {
  onNavigate: (route: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  const { lang, t } = useLanguage();

  return (
    <footer className="bg-[#1C1917] text-[#E8E2D5] pt-16 pb-10 border-t-4 border-[#C5A880]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-stone-800">
          {/* Brand Column */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="font-serif text-2xl font-bold tracking-tight text-white">
                RNK
              </span>
              <span className="text-xs uppercase tracking-[0.25em] text-[#C5A880] font-semibold border-l border-stone-700 pl-2">
                Photo Frames
              </span>
            </div>
            <p className="text-stone-400 text-xs leading-relaxed">
              {t.footer_desc}
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs text-[#C5A880]">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>Moisture-proof Backboards & Glass Protection</span>
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="space-y-4">
            <h4 className="font-serif text-base font-semibold text-white tracking-wide border-b border-stone-800 pb-2">
              {t.footer_quick_links}
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-300">
              <li>
                <button
                  onClick={() => onNavigate('/')}
                  className="hover:text-[#C5A880] transition-colors text-left cursor-pointer"
                >
                  {t.nav_home}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/catalogue')}
                  className="hover:text-[#C5A880] transition-colors text-left cursor-pointer"
                >
                  {t.nav_catalogue}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/combos')}
                  className="hover:text-[#C5A880] transition-colors text-left cursor-pointer"
                >
                  {t.nav_combos}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/about')}
                  className="hover:text-[#C5A880] transition-colors text-left cursor-pointer"
                >
                  {t.nav_about}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/contact')}
                  className="hover:text-[#C5A880] transition-colors text-left cursor-pointer"
                >
                  {t.nav_contact}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/admin')}
                  className="hover:text-[#C5A880] transition-colors text-left cursor-pointer text-stone-500"
                >
                  {t.nav_admin}
                </button>
              </li>
            </ul>
          </div>

          {/* Categories Column */}
          <div className="space-y-4">
            <h4 className="font-serif text-base font-semibold text-white tracking-wide border-b border-stone-800 pb-2">
              {t.footer_categories}
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-300">
              <li>
                <button
                  onClick={() => onNavigate('/catalogue?category=photo-frames')}
                  className="hover:text-[#C5A880] transition-colors text-left cursor-pointer"
                >
                  {lang === 'ta' ? 'போட்டோ ஃப்ரேம்கள்' : 'Photo Frames'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/catalogue?category=return-gift-combos')}
                  className="hover:text-[#C5A880] transition-colors text-left cursor-pointer"
                >
                  {lang === 'ta' ? 'ரிட்டர்ன் கிஃப்ட் காம்போக்கள்' : 'Return Gift Combos'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/catalogue?category=customized-frames')}
                  className="hover:text-[#C5A880] transition-colors text-left cursor-pointer"
                >
                  {lang === 'ta' ? 'தனிப்பயனாக்கப்பட்ட ஃப்ரேம்கள்' : 'Customized Frames'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/catalogue?category=birthday-frames')}
                  className="hover:text-[#C5A880] transition-colors text-left cursor-pointer"
                >
                  {lang === 'ta' ? 'பிறந்தநாள் ஃப்ரேம்கள்' : 'Birthday Frames'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/catalogue?category=wedding-frames')}
                  className="hover:text-[#C5A880] transition-colors text-left cursor-pointer"
                >
                  {lang === 'ta' ? 'திருமண ஃப்ரேம்கள்' : 'Wedding Frames'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/catalogue?category=other-gift-items')}
                  className="hover:text-[#C5A880] transition-colors text-left cursor-pointer"
                >
                  {lang === 'ta' ? 'பிற பரிசுப் பொருட்கள்' : 'Other Gift Items'}
                </button>
              </li>
            </ul>
          </div>

          {/* Contact & Studio Column */}
          <div className="space-y-4">
            <h4 className="font-serif text-base font-semibold text-white tracking-wide border-b border-stone-800 pb-2">
              {t.footer_contact_info}
            </h4>
            <div className="space-y-3 text-xs text-stone-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#C5A880] shrink-0 mt-0.5" />
                <span>
                  PodaturPet, Tiruttani Taluk, Tiruvallur District, Tamil Nadu - 631208
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#C5A880] shrink-0" />
                <a href={getCallDirectUrl()} className="hover:text-white transition-colors">
                  {BUSINESS_PHONE_DISPLAY}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <a
                  href={getGeneralWhatsAppUrl('Footer Enquiry', lang)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400 hover:text-emerald-300 transition-colors"
                >
                  WhatsApp: +91 8681917433
                </a>
              </div>
              <div className="flex items-center gap-2.5 text-stone-400">
                <Clock className="w-4 h-4 text-stone-500 shrink-0" />
                <span>Mon – Sun: 9:00 AM – 9:00 PM</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p>© {new Date().getFullYear()} RNK Photo Frames. {t.footer_rights}</p>
          <div className="flex items-center gap-1.5 text-stone-400">
            <Heart className="w-3.5 h-3.5 text-red-400 fill-current" />
            <span>{t.footer_made_with_care}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
