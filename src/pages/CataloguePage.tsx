import { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, RotateCcw, Sparkles } from 'lucide-react';
import { Category, Product } from '../types/index.js';
import { useLanguage } from '../lib/i18n.js';
import ProductCard from '../components/ProductCard.js';

interface CataloguePageProps {
  categories: Category[];
  products: Product[];
  initialCategory?: string;
  onViewProductDetails: (product: Product) => void;
}

export default function CataloguePage({
  categories,
  products,
  initialCategory,
  onViewProductDetails,
}: CataloguePageProps) {
  const { lang, t } = useLanguage();

  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc'>('featured');

  // Filtered & Sorted products
  const filteredProducts = useMemo(() => {
    return products
      .filter(p => {
        // Category filter
        if (selectedCategory !== 'all') {
          const matchCat =
            p.category_id === selectedCategory ||
            p.category_slug === selectedCategory;
          if (!matchCat) return false;
        }

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchName =
            p.name_en.toLowerCase().includes(q) ||
            (p.name_ta && p.name_ta.toLowerCase().includes(q));
          const matchDesc =
            p.description_en.toLowerCase().includes(q) ||
            (p.description_ta && p.description_ta.toLowerCase().includes(q));
          if (!matchName && !matchDesc) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'featured') {
          if (a.is_featured === b.is_featured) return a.display_order - b.display_order;
          return a.is_featured ? -1 : 1;
        }

        const priceA = (a.sizes?.[0]?.offer_price || a.sizes?.[0]?.original_price || a.offer_price || a.original_price || 0);
        const priceB = (b.sizes?.[0]?.offer_price || b.sizes?.[0]?.original_price || b.offer_price || b.original_price || 0);

        if (sortBy === 'price-asc') return priceA - priceB;
        if (sortBy === 'price-desc') return priceB - priceA;
        return 0;
      });
  }, [products, selectedCategory, searchQuery, sortBy]);

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setSortBy('featured');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 sm:py-14 space-y-8">
      {/* Page Header */}
      <div className="space-y-2 border-b border-[#E8E2D5] pb-6">
        <div className="inline-flex items-center gap-2 text-xs font-bold text-[#997A4D] uppercase tracking-widest">
          <Sparkles className="w-3.5 h-3.5" />
          <span>RNK Photo Frames Catalogue</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1C1917]">
          {lang === 'ta' ? 'அனைத்து போட்டோ ஃப்ரேம் தொகுப்பு' : 'Full Catalogue & Collections'}
        </h1>
        <p className="text-xs sm:text-sm text-[#57534E] max-w-2xl">
          {lang === 'ta'
            ? 'பொதட்டூர்பேட்டையில் தயாரிக்கப்படும் பாரம்பரிய மற்றும் நவீன பாணியிலான அனைத்து போட்டோ ஃப்ரேம்களையும் ஆராயுங்கள்.'
            : 'Browse through our bespoke handcrafted wooden frames, LED collages, birthday collections, and luxury gifts.'}
        </p>
      </div>

      {/* Filter and Search Controls Bar */}
      <div className="space-y-4 bg-white p-4 sm:p-5 rounded-xl border border-[#E8E2D5] shadow-xs">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-[#1C1917] text-white shadow-xs'
                : 'bg-[#F7F3EB] text-[#57534E] hover:bg-[#EAE4D8] border border-[#E8E2D5]'
            }`}
          >
            {t.filter_all}
          </button>
          {categories.map(cat => {
            const isSelected = selectedCategory === cat.slug || selectedCategory === cat.id;
            const catName = lang === 'ta' && cat.name_ta ? cat.name_ta : cat.name_en;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#1C1917] text-white shadow-xs'
                    : 'bg-[#F7F3EB] text-[#57534E] hover:bg-[#EAE4D8] border border-[#E8E2D5]'
                }`}
              >
                {catName}
              </button>
            );
          })}
        </div>

        {/* Search bar and sort dropdown */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2 border-t border-[#F4F0E8]">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              placeholder={t.search_placeholder}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-md bg-[#FAF8F5] border border-[#D8D0C0] text-xs text-[#1C1917] placeholder:text-stone-400 focus:border-[#C5A880] focus:ring-1 focus:ring-[#C5A880] outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-600"
              >
                ×
              </button>
            )}
          </div>

          <div className="flex items-center gap-2.5 justify-end">
            <div className="flex items-center gap-1.5 text-xs text-stone-500 font-medium">
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#997A4D]" />
              <span className="hidden sm:inline">Sort:</span>
            </div>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="px-3 py-1.5 rounded-md bg-[#FAF8F5] border border-[#D8D0C0] text-xs text-[#1C1917] outline-none focus:border-[#C5A880] cursor-pointer"
            >
              <option value="featured">Featured First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Product Grid or Empty State */}
      {filteredProducts.length > 0 ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-stone-500">
            <span>
              Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'item' : 'items'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map(p => (
              <ProductCard
                key={p.id}
                product={p}
                onViewDetails={onViewProductDetails}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-16 px-4 bg-white rounded-xl border border-[#E8E2D5] space-y-4">
          <div className="w-12 h-12 bg-[#F7F3EB] text-[#997A4D] rounded-full flex items-center justify-center mx-auto">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-xl font-bold text-[#1C1917]">
            {t.no_products_found}
          </h3>
          <p className="text-xs text-[#57534E] max-w-sm mx-auto">
            Try adjusting your search keywords or resetting the category filter.
          </p>
          <button
            onClick={handleResetFilters}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-[#1C1917] text-white text-xs font-semibold hover:bg-stone-800 transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t.clear_filters}</span>
          </button>
        </div>
      )}
    </div>
  );
}
