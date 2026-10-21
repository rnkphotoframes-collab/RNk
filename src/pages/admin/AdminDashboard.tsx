import { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Package,
  Gift,
  Image as ImageIcon,
  MessageSquare,
  Settings as SettingsIcon,
  LogOut,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  Phone,
  MessageCircle,
  Eye,
  Download,
  Database,
  ExternalLink,
  Search,
  Upload,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react';
import {
  Category,
  Product,
  ReturnGiftCombo,
  Banner,
  CustomerEnquiry,
  BusinessSettings,
  DashboardStats,
  EnquiryStatus,
  ProductSize,
  ComboIncludedItem,
} from '../../types/index.js';
import {
  fetchAdminStats,
  fetchAdminProducts,
  createAdminProduct,
  updateAdminProduct,
  deleteAdminProduct,
  fetchAdminCombos,
  createAdminCombo,
  updateAdminCombo,
  deleteAdminCombo,
  fetchAdminBanners,
  createAdminBanner,
  updateAdminBanner,
  deleteAdminBanner,
  fetchAdminEnquiries,
  updateAdminEnquiry,
  deleteAdminEnquiry,
  updateAdminSettings,
  uploadImageFile,
  fetchSupabaseStatus,
  adminLogout,
} from '../../lib/api.js';

interface AdminDashboardProps {
  categories: Category[];
  initialSettings: BusinessSettings;
  onLogout: () => void;
  onNavigateHome: () => void;
  onPreviewProduct: (product: Product) => void;
}

type TabType = 'overview' | 'products' | 'combos' | 'banners' | 'enquiries' | 'settings' | 'supabase';

export default function AdminDashboard({
  categories,
  initialSettings,
  onLogout,
  onNavigateHome,
  onPreviewProduct,
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [combos, setCombos] = useState<ReturnGiftCombo[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [enquiries, setEnquiries] = useState<CustomerEnquiry[]>([]);
  const [settings, setSettings] = useState<BusinessSettings>(initialSettings);
  const [supabaseInfo, setSupabaseInfo] = useState<any>(null);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Modals state
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);

  const [isComboModalOpen, setIsComboModalOpen] = useState(false);
  const [editingCombo, setEditingCombo] = useState<Partial<ReturnGiftCombo> | null>(null);

  const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Partial<Banner> | null>(null);
  const [newAdminPassword, setNewAdminPassword] = useState('');

  // Enquiry filters
  const [enquiryStatusFilter, setEnquiryStatusFilter] = useState<string>('ALL');
  const [enquirySearchQuery, setEnquirySearchQuery] = useState('');

  // Product filters
  const [productSearchQuery, setProductSearchQuery] = useState('');

  // Load stats and primary data
  const loadAllData = async () => {
    setLoading(true);
    try {
      const [s, p, c, b, e, sub] = await Promise.all([
        fetchAdminStats(),
        fetchAdminProducts(),
        fetchAdminCombos(),
        fetchAdminBanners(),
        fetchAdminEnquiries(),
        fetchSupabaseStatus(),
      ]);
      setStats(s);
      setProducts(p);
      setCombos(c);
      setBanners(b);
      setEnquiries(e);
      setSupabaseInfo(sub);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to sync admin data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const showNotification = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  // -------------------------------------------------------------
  // PRODUCT HANDLERS
  // -------------------------------------------------------------
  const handleOpenAddProduct = () => {
    setEditingProduct({
      name_en: '',
      name_ta: '',
      category_id: categories[0]?.id || 'cat-photo-frames',
      short_description_en: '',
      short_description_ta: '',
      description_en: '',
      description_ta: '',
      primary_image_path: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=800',
      is_active: true,
      is_featured: false,
      original_price: null,
      offer_price: null,
      sizes: [
        {
          id: `size-${Date.now()}-1`,
          size_label_en: '8 x 10 inches',
          size_label_ta: '8 x 10 அங்குலம்',
          width: 8,
          height: 10,
          measurement_unit: 'inch',
          original_price: 450,
          offer_price: 380,
          is_available: true,
          display_order: 1,
        },
      ],
      images: [],
    });
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct?.name_en?.trim()) {
      alert('Product name in English is required');
      return;
    }

    try {
      if (editingProduct.id) {
        await updateAdminProduct(editingProduct.id, editingProduct);
        showNotification('Product updated successfully!');
      } else {
        await createAdminProduct(editingProduct);
        showNotification('Product created successfully!');
      }
      setIsProductModalOpen(false);
      loadAllData();
    } catch (err: any) {
      alert(err.message || 'Failed to save product');
    }
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${name}"?`)) return;
    try {
      await deleteAdminProduct(id);
      showNotification('Product removed');
      loadAllData();
    } catch (err: any) {
      alert(err.message || 'Failed to delete product');
    }
  };

  const handleToggleProductActive = async (product: Product) => {
    try {
      await updateAdminProduct(product.id, { is_active: !product.is_active });
      loadAllData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleToggleProductFeatured = async (product: Product) => {
    try {
      await updateAdminProduct(product.id, { is_featured: !product.is_featured });
      loadAllData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  // -------------------------------------------------------------
  // COMBO HANDLERS
  // -------------------------------------------------------------
  const handleOpenAddCombo = () => {
    setEditingCombo({
      name_en: '',
      name_ta: '',
      description_en: '',
      description_ta: '',
      primary_image_path: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=800',
      original_price: 150,
      offer_price: 120,
      is_available: true,
      is_featured: false,
      included_items: [
        { id: `item-1`, name_en: 'Mini Golden Blessing Frame (4x6")', name_ta: 'தங்க நிற மினி போட்டோ ஃப்ரேம் (4x6")', quantity: 1 },
        { id: `item-2`, name_en: 'Silk Thamboolam Carry Bag', name_ta: 'பட்டு தாம்பூல பை', quantity: 1 },
      ],
      images: [],
    });
    setIsComboModalOpen(true);
  };

  const handleSaveCombo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCombo?.name_en?.trim()) {
      alert('Combo name is required');
      return;
    }
    try {
      if (editingCombo.id) {
        await updateAdminCombo(editingCombo.id, editingCombo);
        showNotification('Combo updated successfully!');
      } else {
        await createAdminCombo(editingCombo);
        showNotification('Combo created successfully!');
      }
      setIsComboModalOpen(false);
      loadAllData();
    } catch (err: any) {
      alert(err.message || 'Failed to save combo');
    }
  };

  const handleDeleteCombo = async (id: string, name: string) => {
    if (!window.confirm(`Delete combo "${name}"?`)) return;
    try {
      await deleteAdminCombo(id);
      showNotification('Combo deleted');
      loadAllData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  // -------------------------------------------------------------
  // BANNER HANDLERS
  // -------------------------------------------------------------
  const handleOpenAddBanner = () => {
    setEditingBanner({
      heading_en: 'Frames That Preserve Your Beautiful Moments',
      heading_ta: 'உங்கள் அழகான நினைவுகளை என்றும் பாதுகாக்கும் ஃப்ரேம்கள்',
      subtitle_en: 'Handcrafted photo frames from PodaturPet, Tiruttani.',
      subtitle_ta: 'பொதட்டூர்பேட்டையில் சிறந்த தரத்தில் போட்டோ ஃப்ரேம்கள்.',
      image_path: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=1600',
      cta_label_en: 'Explore Catalogue',
      cta_label_ta: 'பொருட்களைப் பார்க்க',
      cta_destination: '/catalogue',
      is_active: true,
      display_order: banners.length + 1,
    });
    setIsBannerModalOpen(true);
  };

  const handleSaveBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingBanner?.id) {
        await updateAdminBanner(editingBanner.id, editingBanner);
        showNotification('Banner updated');
      } else {
        await createAdminBanner(editingBanner as any);
        showNotification('Banner added');
      }
      setIsBannerModalOpen(false);
      loadAllData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDeleteBanner = async (id: string) => {
    if (!window.confirm('Delete this banner?')) return;
    try {
      await deleteAdminBanner(id);
      showNotification('Banner deleted');
      loadAllData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  // -------------------------------------------------------------
  // ENQUIRY STATUS HANDLERS
  // -------------------------------------------------------------
  const handleUpdateEnquiryStatus = async (id: string, status: EnquiryStatus) => {
    try {
      await updateAdminEnquiry(id, status);
      showNotification(`Enquiry status changed to ${status}`);
      loadAllData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDeleteEnquiry = async (id: string) => {
    if (!window.confirm('Delete this enquiry record?')) return;
    try {
      await deleteAdminEnquiry(id);
      showNotification('Enquiry deleted');
      loadAllData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  // -------------------------------------------------------------
  // SETTINGS HANDLER
  // -------------------------------------------------------------
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updated = await updateAdminSettings(settings);
      setSettings(updated);
      showNotification('Business settings updated successfully!');
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleUpdatePassword = () => {
    if (!newAdminPassword.trim()) {
      alert('Please enter a new password');
      return;
    }
    const clean = newAdminPassword.trim();
    localStorage.setItem('rnk_custom_admin_password', clean);
    showNotification('Security password updated! You can now use this password for all future admin logins.');
    setNewAdminPassword('');
  };

  // Image Upload helper
  const handleFileUpload = async (file: File, onSuccess: (url: string) => void) => {
    try {
      const res = await uploadImageFile(file);
      onSuccess(res.url);
      showNotification('Image uploaded successfully');
    } catch (err: any) {
      alert(err.message || 'Image upload failed');
    }
  };

  // Filtered enquiries
  const filteredEnquiries = enquiries.filter(e => {
    if (enquiryStatusFilter !== 'ALL' && e.status !== enquiryStatusFilter) return false;
    if (enquirySearchQuery.trim()) {
      const q = enquirySearchQuery.toLowerCase();
      const match =
        e.customer_name.toLowerCase().includes(q) ||
        e.phone_number.includes(q) ||
        (e.product_name && e.product_name.toLowerCase().includes(q)) ||
        (e.combo_name && e.combo_name.toLowerCase().includes(q));
      if (!match) return false;
    }
    return true;
  });

  // Filtered products for admin
  const filteredAdminProducts = products.filter(p => {
    if (!productSearchQuery.trim()) return true;
    const q = productSearchQuery.toLowerCase();
    return p.name_en.toLowerCase().includes(q) || p.slug.includes(q);
  });

  return (
    <div className="min-h-screen bg-[#F4F0E8] flex flex-col">
      {/* Top Admin Header */}
      <header className="bg-[#1C1917] text-white border-b border-stone-800 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-serif text-xl font-bold tracking-tight text-[#FAF8F5]">
              RNK Photo Frames
            </span>
            <span className="text-xs bg-[#C5A880] text-[#1C1917] px-2 py-0.5 rounded-xs font-bold uppercase tracking-wider">
              Admin Portal
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onNavigateHome}
              className="text-xs text-stone-300 hover:text-white flex items-center gap-1.5 cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">View Public Website</span>
            </button>

            <button
              onClick={() => {
                adminLogout();
                onLogout();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold cursor-pointer transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Admin Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 w-full flex-1 space-y-6">
        {/* Success / Error notification */}
        {successMsg && (
          <div className="p-3 rounded-md bg-emerald-50 border border-emerald-300 text-xs text-emerald-800 flex items-center gap-2 animate-fadeIn">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}
        {errorMsg && (
          <div className="p-3 rounded-md bg-red-50 border border-red-300 text-xs text-red-800 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-[#E8E2D5]">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-lg text-xs font-bold tracking-wide transition-all cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-white text-[#1C1917] border-t-2 border-t-[#C5A880] shadow-xs'
                : 'text-[#57534E] hover:text-[#1C1917]'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-lg text-xs font-bold tracking-wide transition-all cursor-pointer ${
              activeTab === 'products'
                ? 'bg-white text-[#1C1917] border-t-2 border-t-[#C5A880] shadow-xs'
                : 'text-[#57534E] hover:text-[#1C1917]'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Products ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('combos')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-lg text-xs font-bold tracking-wide transition-all cursor-pointer ${
              activeTab === 'combos'
                ? 'bg-white text-[#1C1917] border-t-2 border-t-[#C5A880] shadow-xs'
                : 'text-[#57534E] hover:text-[#1C1917]'
            }`}
          >
            <Gift className="w-4 h-4" />
            <span>Combos ({combos.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('banners')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-lg text-xs font-bold tracking-wide transition-all cursor-pointer ${
              activeTab === 'banners'
                ? 'bg-white text-[#1C1917] border-t-2 border-t-[#C5A880] shadow-xs'
                : 'text-[#57534E] hover:text-[#1C1917]'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>Banners ({banners.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('enquiries')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-lg text-xs font-bold tracking-wide transition-all cursor-pointer relative ${
              activeTab === 'enquiries'
                ? 'bg-white text-[#1C1917] border-t-2 border-t-[#C5A880] shadow-xs'
                : 'text-[#57534E] hover:text-[#1C1917]'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Enquiries ({enquiries.length})</span>
            {stats && stats.new_enquiries > 0 && (
              <span className="w-2 h-2 rounded-full bg-red-500 absolute top-2 right-2" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-lg text-xs font-bold tracking-wide transition-all cursor-pointer ${
              activeTab === 'settings'
                ? 'bg-white text-[#1C1917] border-t-2 border-t-[#C5A880] shadow-xs'
                : 'text-[#57534E] hover:text-[#1C1917]'
            }`}
          >
            <SettingsIcon className="w-4 h-4" />
            <span>Settings</span>
          </button>

          <button
            onClick={() => setActiveTab('supabase')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-lg text-xs font-bold tracking-wide transition-all cursor-pointer ${
              activeTab === 'supabase'
                ? 'bg-white text-[#1C1917] border-t-2 border-t-[#C5A880] shadow-xs'
                : 'text-[#57534E] hover:text-[#1C1917]'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>Database & Supabase</span>
          </button>
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stat Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
              <div className="bg-white p-4 rounded-xl border border-[#E8E2D5] shadow-xs">
                <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block">
                  Total Products
                </span>
                <span className="font-serif text-2xl font-bold text-[#1C1917]">
                  {stats?.total_products ?? products.length}
                </span>
              </div>

              <div className="bg-white p-4 rounded-xl border border-[#E8E2D5] shadow-xs">
                <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block">
                  Active Products
                </span>
                <span className="font-serif text-2xl font-bold text-emerald-700">
                  {stats?.active_products ?? products.filter(p => p.is_active).length}
                </span>
              </div>

              <div className="bg-white p-4 rounded-xl border border-[#E8E2D5] shadow-xs">
                <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block">
                  Inactive / Hidden
                </span>
                <span className="font-serif text-2xl font-bold text-stone-400">
                  {stats?.inactive_products ?? products.filter(p => !p.is_active).length}
                </span>
              </div>

              <div className="bg-white p-4 rounded-xl border border-[#E8E2D5] shadow-xs">
                <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block">
                  Categories
                </span>
                <span className="font-serif text-2xl font-bold text-[#1C1917]">
                  {categories.length}
                </span>
              </div>

              <div className="bg-white p-4 rounded-xl border border-[#E8E2D5] shadow-xs">
                <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block">
                  Gift Combos
                </span>
                <span className="font-serif text-2xl font-bold text-[#997A4D]">
                  {stats?.total_combos ?? combos.length}
                </span>
              </div>

              <div className="bg-white p-4 rounded-xl border border-[#E8E2D5] shadow-xs">
                <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block">
                  New Enquiries
                </span>
                <span className="font-serif text-2xl font-bold text-red-600">
                  {stats?.new_enquiries ?? enquiries.filter(e => e.status === 'NEW').length}
                </span>
              </div>

              <div className="bg-white p-4 rounded-xl border border-[#E8E2D5] shadow-xs">
                <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block">
                  Unresolved
                </span>
                <span className="font-serif text-2xl font-bold text-amber-600">
                  {stats?.unresolved_enquiries ?? enquiries.filter(e => e.status !== 'RESOLVED' && e.status !== 'SPAM').length}
                </span>
              </div>
            </div>

            {/* Quick Actions Bar */}
            <div className="bg-white p-6 rounded-xl border border-[#E8E2D5] shadow-xs flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#1C1917]">
                  Catalogue Actions
                </h3>
                <p className="text-xs text-stone-500">
                  Quick shortcuts to create products, return gift combos, and review enquiries.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  onClick={handleOpenAddProduct}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-md bg-[#1C1917] hover:bg-stone-800 text-white text-xs font-semibold shadow-xs cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Product</span>
                </button>

                <button
                  onClick={handleOpenAddCombo}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-md bg-[#997A4D] hover:bg-[#85683F] text-white text-xs font-semibold shadow-xs cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create Combo</span>
                </button>

                <button
                  onClick={handleOpenAddBanner}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-md bg-stone-200 hover:bg-stone-300 text-stone-800 text-xs font-semibold cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>New Banner</span>
                </button>

                <button
                  onClick={() => setActiveTab('enquiries')}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-md bg-red-100 hover:bg-red-200 text-red-800 text-xs font-semibold cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Review Enquiries</span>
                </button>
              </div>
            </div>

            {/* Recent Enquiries snippet */}
            <div className="bg-white rounded-xl border border-[#E8E2D5] shadow-xs overflow-hidden">
              <div className="p-4 border-b border-[#F4F0E8] flex items-center justify-between">
                <h3 className="font-serif text-base font-bold text-[#1C1917]">
                  Recent Customer Inquiries
                </h3>
                <button
                  onClick={() => setActiveTab('enquiries')}
                  className="text-xs text-[#997A4D] font-bold hover:underline cursor-pointer"
                >
                  View All Enquiries →
                </button>
              </div>

              <div className="divide-y divide-[#F4F0E8]">
                {enquiries.slice(0, 4).map(enq => (
                  <div key={enq.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <strong className="text-stone-900 text-sm">{enq.customer_name}</strong>
                        <span className="text-stone-400">•</span>
                        <span className="font-mono text-stone-600">{enq.phone_number}</span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            enq.status === 'NEW'
                              ? 'bg-red-100 text-red-700'
                              : enq.status === 'CONTACTED'
                              ? 'bg-amber-100 text-amber-800'
                              : enq.status === 'RESOLVED'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-stone-100 text-stone-600'
                          }`}
                        >
                          {enq.status}
                        </span>
                      </div>
                      <p className="text-stone-600 mt-1 line-clamp-1">{enq.message}</p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <a
                        href={`tel:${enq.phone_number}`}
                        className="p-1.5 rounded-md bg-stone-100 hover:bg-stone-200 text-stone-700"
                        title="Call Customer"
                      >
                        <Phone className="w-3.5 h-3.5" />
                      </a>
                      <a
                        href={`https://wa.me/91${enq.phone_number.replace(/\D/g, '')}?text=Hello%20${encodeURIComponent(enq.customer_name)},%20this%20is%20RNK%20Photo%20Frames,%20PodaturPet.`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-md bg-emerald-50 hover:bg-emerald-100 text-emerald-700"
                        title="Chat on WhatsApp"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PRODUCTS */}
        {activeTab === 'products' && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-xl border border-[#E8E2D5] shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input
                  type="text"
                  placeholder="Filter products by name..."
                  value={productSearchQuery}
                  onChange={e => setProductSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-md bg-[#FAF8F5] border border-[#D8D0C0] text-xs text-[#1C1917] outline-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={loadAllData}
                  className="p-2 rounded-md border border-[#D8D0C0] hover:bg-stone-50 text-stone-600 cursor-pointer"
                  title="Refresh"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
                <button
                  onClick={handleOpenAddProduct}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-md bg-[#1C1917] text-white text-xs font-semibold hover:bg-stone-800 transition-all cursor-pointer shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Product</span>
                </button>
              </div>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-xl border border-[#E8E2D5] shadow-xs overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF8F5] border-b border-[#E8E2D5] text-stone-600 font-semibold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3 px-4">Item</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Sizes & Prices</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Featured</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F4F0E8]">
                  {filteredAdminProducts.map(prod => (
                    <tr key={prod.id} className="hover:bg-stone-50/70 transition-colors">
                      <td className="py-3 px-4 flex items-center gap-3">
                        <img
                          src={prod.primary_image_path}
                          alt={prod.name_en}
                          className="w-12 h-12 object-cover rounded-md border border-stone-200 shrink-0"
                        />
                        <div>
                          <p className="font-bold text-stone-900">{prod.name_en}</p>
                          <p className="text-[11px] text-stone-500">{prod.name_ta || '—'}</p>
                          <span className="text-[10px] text-stone-400 font-mono">/{prod.slug}</span>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-xs bg-[#F7F3EB] text-[#997A4D] font-medium border border-[#E8E2D5]">
                          {prod.category_name_en || prod.category_id}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        {prod.sizes && prod.sizes.length > 0 ? (
                          <div className="space-y-0.5">
                            <span className="font-semibold text-stone-800">
                              {prod.sizes.length} sizes configured:
                            </span>
                            <p className="text-[11px] text-stone-500">
                              ₹{prod.sizes[0].offer_price || prod.sizes[0].original_price} – ₹{prod.sizes[prod.sizes.length - 1].offer_price || prod.sizes[prod.sizes.length - 1].original_price}
                            </p>
                          </div>
                        ) : (
                          <span className="font-bold text-stone-800">
                            ₹{prod.offer_price || prod.original_price || '—'}
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleToggleProductActive(prod)}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold cursor-pointer transition-colors ${
                            prod.is_active
                              ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                              : 'bg-stone-100 text-stone-500 hover:bg-stone-200'
                          }`}
                        >
                          {prod.is_active ? 'Active' : 'Disabled'}
                        </button>
                      </td>

                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleToggleProductFeatured(prod)}
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold cursor-pointer ${
                            prod.is_featured
                              ? 'bg-[#997A4D] text-white'
                              : 'bg-stone-100 text-stone-400 hover:text-stone-700'
                          }`}
                        >
                          {prod.is_featured ? '★ Featured' : 'Normal'}
                        </button>
                      </td>

                      <td className="py-3 px-4 text-right space-x-1.5 whitespace-nowrap">
                        <button
                          onClick={() => onPreviewProduct(prod)}
                          className="p-1.5 rounded-md hover:bg-stone-100 text-stone-600 transition-colors"
                          title="Preview Product"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => {
                            setEditingProduct({ ...prod });
                            setIsProductModalOpen(true);
                          }}
                          className="p-1.5 rounded-md hover:bg-stone-100 text-stone-700 transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleDeleteProduct(prod.id, prod.name_en)}
                          className="p-1.5 rounded-md hover:bg-red-50 text-red-600 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: COMBOS */}
        {activeTab === 'combos' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-[#E8E2D5] shadow-xs">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#1C1917]">
                  Return Gift Combos
                </h3>
                <p className="text-xs text-stone-500">
                  Manage gift sets, included items & quantities for wedding and celebration bulk orders.
                </p>
              </div>

              <button
                onClick={handleOpenAddCombo}
                className="flex items-center gap-1.5 px-4 py-2 rounded-md bg-[#1C1917] text-white text-xs font-semibold hover:bg-stone-800 transition-all cursor-pointer shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Combo</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {combos.map(combo => (
                <div key={combo.id} className="bg-white rounded-xl border border-[#E8E2D5] p-5 space-y-4 shadow-xs">
                  <div className="relative aspect-16/9 rounded-lg overflow-hidden bg-stone-100">
                    <img
                      src={combo.primary_image_path}
                      alt={combo.name_en}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2 px-2 py-0.5 rounded-xs bg-[#997A4D] text-white text-[10px] font-bold">
                      ₹{combo.offer_price || combo.original_price}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-serif text-base font-bold text-stone-900">{combo.name_en}</h4>
                    <p className="text-xs text-stone-500 line-clamp-1">{combo.description_en}</p>
                  </div>

                  {/* Included Items preview */}
                  <div className="text-[11px] bg-[#FAF8F5] p-2.5 rounded-md border border-[#E8E2D5] space-y-1">
                    <span className="font-bold text-stone-700 block">Included gifts:</span>
                    {combo.included_items.map((item, idx) => (
                      <div key={idx} className="text-stone-600">
                        • {item.quantity}x {item.name_en}
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-[#F4F0E8]">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${combo.is_available ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-600'}`}>
                      {combo.is_available ? 'Available' : 'Disabled'}
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setEditingCombo({ ...combo });
                          setIsComboModalOpen(true);
                        }}
                        className="p-1.5 rounded-md hover:bg-stone-100 text-stone-700"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteCombo(combo.id, combo.name_en)}
                        className="p-1.5 rounded-md hover:bg-red-50 text-red-600"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: BANNERS */}
        {activeTab === 'banners' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-[#E8E2D5] shadow-xs">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#1C1917]">
                  Hero Banner Carousel
                </h3>
                <p className="text-xs text-stone-500">
                  Update homepage hero images, headings in Tamil & English, and call-to-actions.
                </p>
              </div>

              <button
                onClick={handleOpenAddBanner}
                className="flex items-center gap-1.5 px-4 py-2 rounded-md bg-[#1C1917] text-white text-xs font-semibold hover:bg-stone-800 transition-all cursor-pointer shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Add Banner</span>
              </button>
            </div>

            <div className="space-y-4">
              {banners.map((ban, idx) => (
                <div key={ban.id} className="bg-white p-5 rounded-xl border border-[#E8E2D5] shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={ban.image_path}
                      alt={ban.heading_en}
                      className="w-24 h-16 object-cover rounded-md border border-stone-200 shrink-0"
                    />
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#997A4D]">Banner #{idx + 1}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${ban.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-600'}`}>
                          {ban.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <h4 className="font-serif text-base font-bold text-stone-900">{ban.heading_en}</h4>
                      <p className="text-xs text-stone-500">{ban.heading_ta}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => {
                        setEditingBanner({ ...ban });
                        setIsBannerModalOpen(true);
                      }}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-md border border-[#D8D0C0] text-xs font-semibold hover:bg-stone-50"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDeleteBanner(ban.id)}
                      className="p-1.5 rounded-md hover:bg-red-50 text-red-600"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: ENQUIRIES */}
        {activeTab === 'enquiries' && (
          <div className="space-y-4">
            {/* Filter bar */}
            <div className="bg-white p-4 rounded-xl border border-[#E8E2D5] shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2 overflow-x-auto">
                {['ALL', 'NEW', 'CONTACTED', 'RESOLVED', 'SPAM'].map(st => (
                  <button
                    key={st}
                    onClick={() => setEnquiryStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
                      enquiryStatusFilter === st
                        ? 'bg-[#1C1917] text-white shadow-xs'
                        : 'bg-[#FAF8F5] text-stone-600 hover:bg-stone-200 border border-[#E8E2D5]'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input
                  type="text"
                  placeholder="Search customer name or phone..."
                  value={enquirySearchQuery}
                  onChange={e => setEnquirySearchQuery(e.target.value)}
                  className="w-full sm:w-64 pl-9 pr-3 py-1.5 rounded-md bg-[#FAF8F5] border border-[#D8D0C0] text-xs text-[#1C1917] outline-none"
                />
              </div>
            </div>

            {/* Enquiries list */}
            <div className="space-y-3">
              {filteredEnquiries.length === 0 ? (
                <div className="bg-white p-8 rounded-xl border border-[#E8E2D5] text-center text-xs text-stone-500">
                  No customer enquiries match the selected filter.
                </div>
              ) : (
                filteredEnquiries.map(enq => (
                  <div
                    key={enq.id}
                    className="bg-white p-5 rounded-xl border border-[#E8E2D5] shadow-xs space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#F4F0E8] pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm text-stone-900">{enq.customer_name}</h4>
                          <span className="text-stone-300">•</span>
                          <span className="font-mono text-xs font-semibold text-stone-700">{enq.phone_number}</span>
                        </div>
                        <span className="text-[11px] text-stone-400">
                          Received on {new Date(enq.created_at).toLocaleString()}
                        </span>
                      </div>

                      {/* Status Selector */}
                      <div className="flex items-center gap-2">
                        <select
                          value={enq.status}
                          onChange={e => handleUpdateEnquiryStatus(enq.id, e.target.value as EnquiryStatus)}
                          className={`text-xs font-bold px-2.5 py-1 rounded-md border outline-none cursor-pointer ${
                            enq.status === 'NEW'
                              ? 'bg-red-50 text-red-700 border-red-300'
                              : enq.status === 'CONTACTED'
                              ? 'bg-amber-50 text-amber-800 border-amber-300'
                              : enq.status === 'RESOLVED'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                              : 'bg-stone-100 text-stone-600 border-stone-300'
                          }`}
                        >
                          <option value="NEW">Status: NEW</option>
                          <option value="CONTACTED">Status: CONTACTED</option>
                          <option value="RESOLVED">Status: RESOLVED</option>
                          <option value="SPAM">Status: SPAM</option>
                        </select>

                        <button
                          onClick={() => handleDeleteEnquiry(enq.id)}
                          className="p-1.5 rounded-md hover:bg-red-50 text-red-600"
                          title="Delete Enquiry"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Associated item if any */}
                    {(enq.product_name || enq.combo_name) && (
                      <div className="text-xs bg-[#FAF8F5] p-2.5 rounded-md border border-[#E8E2D5] text-[#997A4D] font-medium flex items-center justify-between">
                        <span>
                          Target Item: <strong>{enq.product_name || enq.combo_name}</strong>
                          {enq.selected_size && ` (Size: ${enq.selected_size})`}
                        </span>
                        <span className="text-[10px] uppercase font-bold tracking-wider text-stone-500">
                          Type: {enq.enquiry_type}
                        </span>
                      </div>
                    )}

                    {/* Customer Message */}
                    <p className="text-xs text-stone-700 leading-relaxed bg-stone-50 p-3 rounded-md">
                      "{enq.message}"
                    </p>

                    {/* Quick Contact Actions */}
                    <div className="pt-2 flex items-center gap-3">
                      <a
                        href={`tel:${enq.phone_number}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#FAF8F5] hover:bg-stone-200 border border-[#D8D0C0] text-xs font-semibold text-stone-800 transition-colors"
                      >
                        <Phone className="w-3.5 h-3.5 text-[#997A4D]" />
                        <span>Call Customer ({enq.phone_number})</span>
                      </a>

                      <a
                        href={`https://wa.me/91${enq.phone_number.replace(/\D/g, '')}?text=Hello%20${encodeURIComponent(enq.customer_name)},%20this%20is%20RNK%20Photo%20Frames,%20PodaturPet.%20Thank%20you%20for%20your%20enquiry.`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>Chat on WhatsApp</span>
                      </a>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB 6: SETTINGS */}
        {activeTab === 'settings' && (
          <div className="bg-white p-6 sm:p-8 rounded-xl border border-[#E8E2D5] shadow-xs max-w-3xl space-y-6">
            <div>
              <h3 className="font-serif text-2xl font-bold text-[#1C1917]">
                Business Information & Settings
              </h3>
              <p className="text-xs text-stone-500 mt-1">
                These settings drive the phone links, WhatsApp destination numbers, location addresses, and bilingual intros across the public site.
              </p>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-stone-800 block mb-1">Business Name</label>
                  <input
                    type="text"
                    value={settings.business_name}
                    onChange={e => setSettings({ ...settings, business_name: e.target.value })}
                    className="w-full px-3 py-2 rounded-md bg-[#FAF8F5] border border-[#D8D0C0] text-xs"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-800 block mb-1">Phone Number (+91)</label>
                  <input
                    type="text"
                    value={settings.phone}
                    onChange={e => setSettings({ ...settings, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-md bg-[#FAF8F5] border border-[#D8D0C0] text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-stone-800 block mb-1">WhatsApp Number</label>
                  <input
                    type="text"
                    value={settings.whatsapp_number}
                    onChange={e => setSettings({ ...settings, whatsapp_number: e.target.value })}
                    className="w-full px-3 py-2 rounded-md bg-[#FAF8F5] border border-[#D8D0C0] text-xs"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-800 block mb-1">Studio Location</label>
                  <input
                    type="text"
                    value={settings.location}
                    onChange={e => setSettings({ ...settings, location: e.target.value })}
                    className="w-full px-3 py-2 rounded-md bg-[#FAF8F5] border border-[#D8D0C0] text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-800 block mb-1">Google Maps URL</label>
                <input
                  type="text"
                  value={settings.google_maps_url}
                  onChange={e => setSettings({ ...settings, google_maps_url: e.target.value })}
                  className="w-full px-3 py-2 rounded-md bg-[#FAF8F5] border border-[#D8D0C0] text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-800 block mb-1">Introduction (English)</label>
                <textarea
                  rows={2}
                  value={settings.introduction_en}
                  onChange={e => setSettings({ ...settings, introduction_en: e.target.value })}
                  className="w-full px-3 py-2 rounded-md bg-[#FAF8F5] border border-[#D8D0C0] text-xs resize-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-800 block mb-1">Introduction (Tamil)</label>
                <textarea
                  rows={2}
                  value={settings.introduction_ta}
                  onChange={e => setSettings({ ...settings, introduction_ta: e.target.value })}
                  className="w-full px-3 py-2 rounded-md bg-[#FAF8F5] border border-[#D8D0C0] text-xs resize-none"
                />
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 rounded-md bg-[#1C1917] hover:bg-stone-800 text-white text-xs font-semibold shadow-xs cursor-pointer"
              >
                Save Settings
              </button>
            </form>

            {/* Change Security Password Card */}
            <div className="pt-6 border-t border-[#E8E2D5] space-y-3">
              <div>
                <h4 className="font-serif text-lg font-bold text-[#1C1917]">
                  Change Admin Password
                </h4>
                <p className="text-xs text-stone-500">
                  Update your personal login password. You can also configure it in Vercel / .env via <code className="font-mono bg-stone-100 px-1 py-0.5 rounded text-stone-800">ADMIN_PASSWORD</code>.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  placeholder="Type new custom password (e.g. MySecret@2026)"
                  value={newAdminPassword}
                  onChange={e => setNewAdminPassword(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-md bg-[#FAF8F5] border border-[#D8D0C0] text-xs font-mono outline-none focus:border-[#C5A880]"
                />
                <button
                  type="button"
                  onClick={handleUpdatePassword}
                  className="px-5 py-2 rounded-md bg-[#997A4D] hover:bg-[#85683F] text-white text-xs font-semibold cursor-pointer shrink-0 transition-colors"
                >
                  Update Password
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: SUPABASE & DATABASE TOOLS */}
        {activeTab === 'supabase' && (
          <div className="space-y-6 max-w-4xl">
            <div className="bg-white p-6 rounded-xl border border-[#E8E2D5] shadow-xs space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-xl font-bold text-[#1C1917]">
                    Database Architecture & Cloud Sync
                  </h3>
                  <p className="text-xs text-stone-500">
                    Active Storage Mode: <strong className="text-stone-900 font-mono">{supabaseInfo?.mode || 'local_database_engine'}</strong>
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-[#FAF8F5] border border-[#E8E2D5] text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-stone-700">Persistent Local Engine:</span>
                  <span className="text-emerald-700 font-bold">Active & Synchronized</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-stone-700">Supabase Cloud Connection:</span>
                  <span className="text-stone-500">
                    {supabaseInfo?.isConfigured ? 'Connected to ' + supabaseInfo.url : 'Ready for deployment (placeholders configured in .env.example)'}
                  </span>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <a
                  href="/api/admin/export"
                  download="rnk_database_backup.json"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-[#1C1917] hover:bg-stone-800 text-white text-xs font-semibold cursor-pointer shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Full Database Export (JSON)</span>
                </a>
              </div>
            </div>

            {/* Migration Script Viewer */}
            <div className="bg-white p-6 rounded-xl border border-[#E8E2D5] shadow-xs space-y-3">
              <h4 className="font-serif text-base font-bold text-[#1C1917]">
                Supabase / PostgreSQL Migration Script
              </h4>
              <p className="text-xs text-stone-500">
                Found at <code className="bg-stone-100 px-1 py-0.5 rounded text-stone-800">supabase/migrations/20261020000000_rnk_schema.sql</code>. Contains all normalized tables, foreign keys, numeric money precision, and Supabase Row Level Security (RLS) rules.
              </p>
              <div className="bg-stone-900 text-stone-200 p-4 rounded-md font-mono text-[11px] max-h-56 overflow-y-auto">
                <pre>{`-- Sample schema snippet:
CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    name_en TEXT NOT NULL,
    name_ta TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    category_id TEXT NOT NULL REFERENCES categories(id),
    original_price NUMERIC(10, 2),
    offer_price NUMERIC(10, 2),
    is_active BOOLEAN NOT NULL DEFAULT true
);

-- RLS: Public read active products
CREATE POLICY "Public read active products" ON products FOR SELECT USING (is_active = true);`}</pre>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* PRODUCT ADD/EDIT MODAL */}
      {isProductModalOpen && editingProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
          <div className="relative bg-[#FAF8F5] rounded-xl border border-[#E8E2D5] max-w-2xl w-full p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsProductModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-700 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-serif text-2xl font-bold text-[#1C1917] mb-4">
              {editingProduct.id ? 'Edit Photo Frame' : 'Create New Photo Frame'}
            </h3>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-stone-800 block mb-1">Name (English) *</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.name_en || ''}
                    onChange={e => setEditingProduct({ ...editingProduct, name_en: e.target.value })}
                    className="w-full px-3 py-2 rounded-md bg-white border border-[#D8D0C0] text-xs"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-800 block mb-1">Name (Tamil)</label>
                  <input
                    type="text"
                    value={editingProduct.name_ta || ''}
                    onChange={e => setEditingProduct({ ...editingProduct, name_ta: e.target.value })}
                    className="w-full px-3 py-2 rounded-md bg-white border border-[#D8D0C0] text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-800 block mb-1">Category</label>
                <select
                  value={editingProduct.category_id || categories[0]?.id}
                  onChange={e => setEditingProduct({ ...editingProduct, category_id: e.target.value })}
                  className="w-full px-3 py-2 rounded-md bg-white border border-[#D8D0C0] text-xs cursor-pointer"
                >
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name_en} ({c.name_ta})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-800 block mb-1">Primary Image URL or Upload</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={editingProduct.primary_image_path || ''}
                    onChange={e => setEditingProduct({ ...editingProduct, primary_image_path: e.target.value })}
                    className="flex-1 px-3 py-2 rounded-md bg-white border border-[#D8D0C0] text-xs"
                  />
                  <label className="px-3 py-2 rounded-md bg-stone-200 hover:bg-stone-300 text-stone-800 text-xs font-semibold cursor-pointer flex items-center gap-1">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={e => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(file, url => setEditingProduct({ ...editingProduct, primary_image_path: url }));
                      }}
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-800 block mb-1">Short Description (English)</label>
                <input
                  type="text"
                  value={editingProduct.short_description_en || ''}
                  onChange={e => setEditingProduct({ ...editingProduct, short_description_en: e.target.value })}
                  className="w-full px-3 py-2 rounded-md bg-white border border-[#D8D0C0] text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-800 block mb-1">Full Description (English)</label>
                <textarea
                  rows={2}
                  value={editingProduct.description_en || ''}
                  onChange={e => setEditingProduct({ ...editingProduct, description_en: e.target.value })}
                  className="w-full px-3 py-2 rounded-md bg-white border border-[#D8D0C0] text-xs resize-none"
                />
              </div>

              {/* Sizes and Prices Manager */}
              <div className="p-3.5 rounded-lg bg-white border border-[#E8E2D5] space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-stone-900">Configured Sizes & Prices</label>
                  <button
                    type="button"
                    onClick={() => {
                      const newSizes = [...(editingProduct.sizes || [])];
                      newSizes.push({
                        id: `size-${Date.now()}`,
                        size_label_en: '10 x 12 inches',
                        size_label_ta: '10 x 12 அங்குலம்',
                        measurement_unit: 'inch',
                        original_price: 600,
                        offer_price: 490,
                        is_available: true,
                        display_order: newSizes.length + 1,
                      });
                      setEditingProduct({ ...editingProduct, sizes: newSizes });
                    }}
                    className="text-xs text-[#997A4D] font-bold hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Size</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {(editingProduct.sizes || []).map((sz, idx) => (
                    <div key={sz.id || idx} className="grid grid-cols-12 gap-2 items-center text-xs">
                      <div className="col-span-5">
                        <input
                          type="text"
                          placeholder="Size (e.g. 8x10 inches)"
                          value={sz.size_label_en}
                          onChange={e => {
                            const updated = [...(editingProduct.sizes || [])];
                            updated[idx].size_label_en = e.target.value;
                            setEditingProduct({ ...editingProduct, sizes: updated });
                          }}
                          className="w-full px-2 py-1.5 rounded border border-stone-300 text-xs"
                        />
                      </div>
                      <div className="col-span-3">
                        <input
                          type="number"
                          placeholder="MRP (₹)"
                          value={sz.original_price}
                          onChange={e => {
                            const updated = [...(editingProduct.sizes || [])];
                            updated[idx].original_price = Number(e.target.value);
                            setEditingProduct({ ...editingProduct, sizes: updated });
                          }}
                          className="w-full px-2 py-1.5 rounded border border-stone-300 text-xs"
                        />
                      </div>
                      <div className="col-span-3">
                        <input
                          type="number"
                          placeholder="Offer (₹)"
                          value={sz.offer_price || ''}
                          onChange={e => {
                            const updated = [...(editingProduct.sizes || [])];
                            updated[idx].offer_price = e.target.value ? Number(e.target.value) : null;
                            setEditingProduct({ ...editingProduct, sizes: updated });
                          }}
                          className="w-full px-2 py-1.5 rounded border border-stone-300 text-xs"
                        />
                      </div>
                      <div className="col-span-1 text-center">
                        <button
                          type="button"
                          onClick={() => {
                            const updated = (editingProduct.sizes || []).filter((_, i) => i !== idx);
                            setEditingProduct({ ...editingProduct, sizes: updated });
                          }}
                          className="text-red-500 hover:text-red-700"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status toggles */}
              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 text-xs font-semibold text-stone-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProduct.is_active ?? true}
                    onChange={e => setEditingProduct({ ...editingProduct, is_active: e.target.checked })}
                    className="w-4 h-4 rounded text-[#1C1917]"
                  />
                  <span>Active & Published on Website</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-semibold text-stone-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProduct.is_featured ?? false}
                    onChange={e => setEditingProduct({ ...editingProduct, is_featured: e.target.checked })}
                    className="w-4 h-4 rounded text-[#997A4D]"
                  />
                  <span>Feature on Homepage</span>
                </label>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 rounded-md border border-[#D8D0C0] text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-md bg-[#1C1917] hover:bg-stone-800 text-white text-xs font-semibold"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* COMBO ADD/EDIT MODAL */}
      {isComboModalOpen && editingCombo && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
          <div className="relative bg-[#FAF8F5] rounded-xl border border-[#E8E2D5] max-w-xl w-full p-6 sm:p-8 shadow-2xl">
            <button
              onClick={() => setIsComboModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-700 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-serif text-2xl font-bold text-[#1C1917] mb-4">
              {editingCombo.id ? 'Edit Return Gift Combo' : 'Create Return Gift Combo'}
            </h3>

            <form onSubmit={handleSaveCombo} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-stone-800 block mb-1">Combo Name (English) *</label>
                <input
                  type="text"
                  required
                  value={editingCombo.name_en || ''}
                  onChange={e => setEditingCombo({ ...editingCombo, name_en: e.target.value })}
                  className="w-full px-3 py-2 rounded-md bg-white border border-[#D8D0C0] text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-800 block mb-1">Combo Name (Tamil)</label>
                <input
                  type="text"
                  value={editingCombo.name_ta || ''}
                  onChange={e => setEditingCombo({ ...editingCombo, name_ta: e.target.value })}
                  className="w-full px-3 py-2 rounded-md bg-white border border-[#D8D0C0] text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-stone-800 block mb-1">MRP Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={editingCombo.original_price || ''}
                    onChange={e => setEditingCombo({ ...editingCombo, original_price: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-md bg-white border border-[#D8D0C0] text-xs"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-800 block mb-1">Offer Price (₹)</label>
                  <input
                    type="number"
                    value={editingCombo.offer_price || ''}
                    onChange={e => setEditingCombo({ ...editingCombo, offer_price: e.target.value ? Number(e.target.value) : null })}
                    className="w-full px-3 py-2 rounded-md bg-white border border-[#D8D0C0] text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-800 block mb-1">Primary Image URL</label>
                <input
                  type="text"
                  value={editingCombo.primary_image_path || ''}
                  onChange={e => setEditingCombo({ ...editingCombo, primary_image_path: e.target.value })}
                  className="w-full px-3 py-2 rounded-md bg-white border border-[#D8D0C0] text-xs"
                />
              </div>

              {/* Included items */}
              <div className="p-3.5 rounded-lg bg-white border border-[#E8E2D5] space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-stone-900">Included Gifts in Set</label>
                  <button
                    type="button"
                    onClick={() => {
                      const updated = [...(editingCombo.included_items || [])];
                      updated.push({
                        id: `item-${Date.now()}`,
                        name_en: 'Mini Frame or Bag',
                        name_ta: 'பரிசு பொருள்',
                        quantity: 1,
                      });
                      setEditingCombo({ ...editingCombo, included_items: updated });
                    }}
                    className="text-xs text-[#997A4D] font-bold hover:underline"
                  >
                    + Add Item
                  </button>
                </div>
                {(editingCombo.included_items || []).map((itm, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="number"
                      placeholder="Qty"
                      value={itm.quantity}
                      onChange={e => {
                        const items = [...(editingCombo.included_items || [])];
                        items[idx].quantity = Number(e.target.value);
                        setEditingCombo({ ...editingCombo, included_items: items });
                      }}
                      className="w-16 px-2 py-1 rounded border border-stone-300 text-xs"
                    />
                    <input
                      type="text"
                      placeholder="Item Name (e.g. Mini 4x6 Frame)"
                      value={itm.name_en}
                      onChange={e => {
                        const items = [...(editingCombo.included_items || [])];
                        items[idx].name_en = e.target.value;
                        setEditingCombo({ ...editingCombo, included_items: items });
                      }}
                      className="flex-1 px-2 py-1 rounded border border-stone-300 text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const items = (editingCombo.included_items || []).filter((_, i) => i !== idx);
                        setEditingCombo({ ...editingCombo, included_items: items });
                      }}
                      className="text-red-500 font-bold"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>

              <div className="pt-3 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsComboModalOpen(false)}
                  className="px-4 py-2 rounded-md border text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-md bg-[#1C1917] text-white text-xs font-semibold"
                >
                  Save Combo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* BANNER ADD/EDIT MODAL */}
      {isBannerModalOpen && editingBanner && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
          <div className="relative bg-[#FAF8F5] rounded-xl border border-[#E8E2D5] max-w-lg w-full p-6 sm:p-8 shadow-2xl">
            <button
              onClick={() => setIsBannerModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-700 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-serif text-2xl font-bold text-[#1C1917] mb-4">
              {editingBanner.id ? 'Edit Banner' : 'Create Banner'}
            </h3>

            <form onSubmit={handleSaveBanner} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-stone-800 block mb-1">Heading (English)</label>
                <input
                  type="text"
                  required
                  value={editingBanner.heading_en || ''}
                  onChange={e => setEditingBanner({ ...editingBanner, heading_en: e.target.value })}
                  className="w-full px-3 py-2 rounded-md bg-white border border-[#D8D0C0] text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-800 block mb-1">Heading (Tamil)</label>
                <input
                  type="text"
                  value={editingBanner.heading_ta || ''}
                  onChange={e => setEditingBanner({ ...editingBanner, heading_ta: e.target.value })}
                  className="w-full px-3 py-2 rounded-md bg-white border border-[#D8D0C0] text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-800 block mb-1">Subtitle (English)</label>
                <input
                  type="text"
                  value={editingBanner.subtitle_en || ''}
                  onChange={e => setEditingBanner({ ...editingBanner, subtitle_en: e.target.value })}
                  className="w-full px-3 py-2 rounded-md bg-white border border-[#D8D0C0] text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-800 block mb-1">Banner Image URL</label>
                <input
                  type="text"
                  required
                  value={editingBanner.image_path || ''}
                  onChange={e => setEditingBanner({ ...editingBanner, image_path: e.target.value })}
                  className="w-full px-3 py-2 rounded-md bg-white border border-[#D8D0C0] text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-stone-800 block mb-1">CTA Label</label>
                  <input
                    type="text"
                    value={editingBanner.cta_label_en || ''}
                    onChange={e => setEditingBanner({ ...editingBanner, cta_label_en: e.target.value })}
                    className="w-full px-3 py-2 rounded-md bg-white border border-[#D8D0C0] text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-stone-800 block mb-1">CTA Destination</label>
                  <input
                    type="text"
                    value={editingBanner.cta_destination || '/catalogue'}
                    onChange={e => setEditingBanner({ ...editingBanner, cta_destination: e.target.value })}
                    className="w-full px-3 py-2 rounded-md bg-white border border-[#D8D0C0] text-xs"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="banActive"
                  checked={editingBanner.is_active ?? true}
                  onChange={e => setEditingBanner({ ...editingBanner, is_active: e.target.checked })}
                  className="w-4 h-4 rounded text-[#1C1917]"
                />
                <label htmlFor="banActive" className="text-xs font-semibold text-stone-800">
                  Active in Carousel
                </label>
              </div>

              <div className="pt-3 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsBannerModalOpen(false)}
                  className="px-4 py-2 rounded-md border text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-md bg-[#1C1917] text-white text-xs font-semibold"
                >
                  Save Banner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
