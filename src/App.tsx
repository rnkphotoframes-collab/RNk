import { useState, useEffect } from 'react';
import { MessageCircle, Phone, Sparkles } from 'lucide-react';
import { Category, Product, ReturnGiftCombo, Banner, BusinessSettings, ProductSize } from './types/index.js';
import { fetchCategories, fetchProducts, fetchCombos, fetchBanners, fetchSettings, checkAdminSession } from './lib/api.js';
import { useLanguage } from './lib/i18n.js';
import { BUSINESS_PHONE_DISPLAY, getCallDirectUrl, getGeneralWhatsAppUrl } from './lib/whatsapp.js';
import Navbar from './components/Navbar.js';
import Footer from './components/Footer.js';
import ProductDetailModal from './components/ProductDetailModal.js';
import EnquiryModal from './components/EnquiryModal.js';
import HomePage from './pages/HomePage.js';
import CataloguePage from './pages/CataloguePage.js';
import CombosPage from './pages/CombosPage.js';
import AboutPage from './pages/AboutPage.js';
import ContactPage from './pages/ContactPage.js';
import AdminLogin from './pages/admin/AdminLogin.js';
import AdminDashboard from './pages/admin/AdminDashboard.js';

export default function App() {
  const { lang, t } = useLanguage();

  // Navigation State
  const [currentRoute, setCurrentRoute] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      return path && path !== '' ? path : '/';
    }
    return '/';
  });

  // Selected Category filter for catalogue
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');

  // Application Data
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [combos, setCombos] = useState<ReturnGiftCombo[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [settings, setSettings] = useState<BusinessSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Admin Auth State
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  // Modals
  const [selectedProductForModal, setSelectedProductForModal] = useState<Product | null>(null);
  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState(false);
  const [enquiryContextProduct, setEnquiryContextProduct] = useState<Product | null>(null);
  const [enquiryContextSize, setEnquiryContextSize] = useState<ProductSize | null>(null);

  // Load initial data
  const loadData = async () => {
    try {
      const [cats, prods, cmbs, bans, sets, adminAuth] = await Promise.all([
        fetchCategories(),
        fetchProducts(),
        fetchCombos(),
        fetchBanners(),
        fetchSettings(),
        checkAdminSession(),
      ]);
      setCategories(cats);
      setProducts(prods);
      setCombos(cmbs);
      setBanners(bans);
      setSettings(sets);
      setIsAdminLoggedIn(adminAuth);
    } catch (err) {
      console.error('Failed to load application data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();

    // Browser navigation handling
    const handlePopState = () => {
      setCurrentRoute(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (route: string) => {
    if (route.includes('?category=')) {
      const parts = route.split('?category=');
      setSelectedCategoryFilter(parts[1]);
      route = parts[0];
    } else {
      setSelectedCategoryFilter('all');
    }

    setCurrentRoute(route);
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', route);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Open Enquiry Modal helper
  const handleOpenEnquiryModal = (product?: Product | null, size?: ProductSize | null) => {
    setEnquiryContextProduct(product || null);
    setEnquiryContextSize(size || null);
    setIsEnquiryModalOpen(true);
  };

  // Is Admin Route
  const isAdminRoute = currentRoute.startsWith('/admin');

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#1C1917] selection:bg-[#C5A880]/30 selection:text-[#1C1917]">
      {/* Public Navbar (Hidden on full admin dashboard) */}
      {(!isAdminRoute || !isAdminLoggedIn) && (
        <Navbar
          currentRoute={currentRoute}
          onNavigate={navigateTo}
          isAdminLoggedIn={isAdminLoggedIn}
        />
      )}

      {/* Main Content Area */}
      <main className="flex-1">
        {isLoading ? (
          <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-3">
            <div className="w-10 h-10 border-3 border-[#C5A880] border-t-transparent rounded-full animate-spin" />
            <p className="font-serif text-base text-[#1C1917] font-medium tracking-wide">
              RNK Photo Frames • PodaturPet
            </p>
          </div>
        ) : (
          <>
            {/* 1. Admin Portal */}
            {isAdminRoute ? (
              isAdminLoggedIn ? (
                <AdminDashboard
                  categories={categories}
                  initialSettings={settings || ({} as any)}
                  onLogout={() => {
                    setIsAdminLoggedIn(false);
                    navigateTo('/admin/login');
                  }}
                  onNavigateHome={() => navigateTo('/')}
                  onPreviewProduct={product => setSelectedProductForModal(product)}
                />
              ) : (
                <AdminLogin
                  onLoginSuccess={() => {
                    setIsAdminLoggedIn(true);
                    navigateTo('/admin');
                  }}
                  onNavigateHome={() => navigateTo('/')}
                />
              )
            ) : null}

            {/* 2. Public Pages */}
            {!isAdminRoute && currentRoute === '/' && (
              <HomePage
                banners={banners}
                categories={categories}
                products={products}
                combos={combos}
                onNavigate={navigateTo}
                onViewProductDetails={product => setSelectedProductForModal(product)}
                onOpenEnquiryModal={() => handleOpenEnquiryModal()}
              />
            )}

            {!isAdminRoute && currentRoute === '/catalogue' && (
              <CataloguePage
                categories={categories}
                products={products}
                initialCategory={selectedCategoryFilter}
                onViewProductDetails={product => setSelectedProductForModal(product)}
              />
            )}

            {!isAdminRoute && currentRoute === '/combos' && (
              <CombosPage
                combos={combos}
                onOpenEnquiryModal={() => handleOpenEnquiryModal()}
              />
            )}

            {!isAdminRoute && currentRoute === '/about' && (
              <AboutPage settings={settings} />
            )}

            {!isAdminRoute && currentRoute === '/contact' && (
              <ContactPage settings={settings} />
            )}
          </>
        )}
      </main>

      {/* Public Footer */}
      {(!isAdminRoute || !isAdminLoggedIn) && (
        <Footer onNavigate={navigateTo} />
      )}

      {/* Floating WhatsApp Quick Action Button on public pages */}
      {!isAdminRoute && (
        <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2">
          <a
            href={getGeneralWhatsAppUrl('Floating Button Contact', lang)}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat on WhatsApp with RNK Photo Frames"
            className="flex items-center gap-2.5 px-4 py-3 rounded-full bg-[#25D366] hover:bg-[#20BD5A] text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 group"
          >
            <MessageCircle className="w-5 h-5 fill-current" />
            <span className="text-xs font-bold tracking-wide hidden sm:inline">
              {lang === 'ta' ? 'வாட்ஸ்அப் தகவல்' : 'Chat on WhatsApp'}
            </span>
          </a>
        </div>
      )}

      {/* Modals */}
      <ProductDetailModal
        product={selectedProductForModal}
        onClose={() => setSelectedProductForModal(null)}
        onOpenEnquiryModal={(prod, sz) => handleOpenEnquiryModal(prod, sz)}
        onSelectRelatedProduct={prod => setSelectedProductForModal(prod)}
        allProducts={products}
      />

      <EnquiryModal
        isOpen={isEnquiryModalOpen}
        onClose={() => {
          setIsEnquiryModalOpen(false);
          setEnquiryContextProduct(null);
          setEnquiryContextSize(null);
        }}
        product={enquiryContextProduct}
        selectedSize={enquiryContextSize}
      />
    </div>
  );
}
