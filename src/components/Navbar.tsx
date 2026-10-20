import { useState } from 'react';
import { Phone, MessageCircle, Menu, X, Shield, MapPin, Sparkles } from 'lucide-react';
import { useLanguage } from '../lib/i18n.js';
import { BUSINESS_PHONE_DISPLAY, getCallDirectUrl, getGeneralWhatsAppUrl } from '../lib/whatsapp.js';

interface NavbarProps {
  currentRoute: string;
  onNavigate: (route: string) => void;
  isAdminLoggedIn?: boolean;
}

export default function Navbar({ currentRoute, onNavigate, isAdminLoggedIn }: NavbarProps) {
  const { lang, toggleLang, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: t.nav_home, route: '/' },
    { label: t.nav_catalogue, route: '/catalogue' },
    { label: t.nav_combos, route: '/combos' },
    { label: t.nav_about, route: '/about' },
    { label: t.nav_contact, route: '/contact' },
  ];

  const handleNavClick = (route: string) => {
    onNavigate(route);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#E8E2D5] transition-all">
      {/* Top micro bar with location and instant phone contact */}
      <div className="bg-[#1C1917] text-[#E8E2D5] text-xs py-1.5 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-1.5 text-center sm:text-left">
          <div className="flex items-center gap-2 tracking-wide font-light">
            <MapPin className="w-3.5 h-3.5 text-[#C5A880] shrink-0" />
            <span>PodaturPet, Tiruttani • Tamil Nadu</span>
            <span className="hidden md:inline text-stone-500">|</span>
            <span className="hidden md:inline text-stone-400">Personalized Frames & Return Gift Combos</span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href={getCallDirectUrl()}
              className="flex items-center gap-1.5 text-[#EFE7DB] hover:text-[#C5A880] transition-colors"
            >
              <Phone className="w-3 h-3 text-[#C5A880]" />
              <span className="font-medium tracking-wider">{BUSINESS_PHONE_DISPLAY}</span>
            </a>
            <a
              href={getGeneralWhatsAppUrl('', lang)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-medium"
            >
              <MessageCircle className="w-3 h-3" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main navigation header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between">
        {/* Brand Wordmark */}
        <button
          onClick={() => handleNavClick('/')}
          className="text-left group cursor-pointer focus:outline-none"
        >
          <div className="flex items-center gap-2">
            <span className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#1C1917] group-hover:text-[#997A4D] transition-colors">
              RNK
            </span>
            <span className="text-xs uppercase tracking-[0.25em] text-[#997A4D] font-semibold border-l border-[#C5A880] pl-2">
              Photo Frames
            </span>
          </div>
          <p className="text-[11px] text-[#57534E] font-medium tracking-wide">
            {lang === 'ta' ? 'பொதட்டூர்பேட்டை • திருத்தணி' : 'PodaturPet • Tiruttani'}
          </p>
        </button>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-7">
          {navItems.map(item => {
            const isActive = currentRoute === item.route;
            return (
              <button
                key={item.route}
                onClick={() => handleNavClick(item.route)}
                className={`text-sm font-medium transition-all relative py-1 cursor-pointer focus:outline-none ${
                  isActive
                    ? 'text-[#1C1917] font-semibold'
                    : 'text-[#57534E] hover:text-[#1C1917]'
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#C5A880] rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Language Switcher */}
          <button
            onClick={toggleLang}
            title={lang === 'en' ? 'தமிழில் படிக்க' : 'Switch to English'}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-[#D8D0C0] bg-white text-xs font-semibold text-[#1C1917] hover:border-[#C5A880] hover:bg-[#F7F3EB] transition-all cursor-pointer shadow-xs"
          >
            <Sparkles className="w-3 h-3 text-[#997A4D]" />
            <span>{lang === 'en' ? 'தமிழ்' : 'English'}</span>
          </button>

          {/* Quick WhatsApp Action */}
          <a
            href={getGeneralWhatsAppUrl('Enquiry from Website Navbar', lang)}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-2 bg-[#1C1917] hover:bg-[#292524] text-white px-3.5 py-1.5 rounded-md text-xs font-semibold tracking-wide transition-all shadow-xs"
          >
            <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span>{t.hero_cta_secondary}</span>
          </a>

          {/* Admin link */}
          <button
            onClick={() => handleNavClick('/admin')}
            title="Admin Portal"
            className={`p-2 rounded-md border transition-all cursor-pointer ${
              currentRoute.startsWith('/admin') || isAdminLoggedIn
                ? 'bg-[#C5A880] text-white border-[#C5A880]'
                : 'border-[#D8D0C0] text-[#57534E] hover:text-[#1C1917] hover:bg-white'
            }`}
          >
            <Shield className="w-4 h-4" />
          </button>

          {/* Mobile hamburger button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-md border border-[#D8D0C0] text-[#1C1917] hover:bg-white cursor-pointer"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#FAF8F5] border-b border-[#E8E2D5] px-6 py-5 shadow-lg animate-fadeIn">
          <div className="flex flex-col gap-3">
            {navItems.map(item => {
              const isActive = currentRoute === item.route;
              return (
                <button
                  key={item.route}
                  onClick={() => handleNavClick(item.route)}
                  className={`text-left text-base py-2 font-medium cursor-pointer transition-colors ${
                    isActive ? 'text-[#997A4D] font-bold pl-2 border-l-2 border-[#C5A880]' : 'text-[#1C1917]'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
            <div className="pt-3 mt-2 border-t border-[#E8E2D5] flex flex-col gap-2.5">
              <a
                href={getCallDirectUrl()}
                className="flex items-center justify-center gap-2 py-2.5 rounded-md bg-[#F4F0E8] text-[#1C1917] font-semibold text-sm border border-[#E8E2D5]"
              >
                <Phone className="w-4 h-4 text-[#997A4D]" />
                <span>{t.call_now}</span>
              </a>
              <a
                href={getGeneralWhatsAppUrl('Mobile Menu Enquiry', lang)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-2.5 rounded-md bg-[#1C1917] text-white font-semibold text-sm"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>{t.hero_cta_secondary}</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
