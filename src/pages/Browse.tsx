import { useState } from 'react';
import { Search, SlidersHorizontal, X, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ItemCard } from '@/components/ui/ItemCard';
import { useItems } from '@/hooks/useItems';
import type { ItemCategory } from '@/types';

const categories: { value: ItemCategory | 'all'; label: string }[] = [
  { value: 'all', label: 'All Categories' },
  { value: 'cars', label: 'Cars' },
  { value: 'houses', label: 'Houses' },
  { value: 'bikes', label: 'Bikes' },
  { value: 'tools', label: 'Tools' },
  { value: 'electronics', label: 'Electronics' },
  { value: 'other', label: 'Other' },
];

const priceRanges = [
  { value: 'all', label: 'Any Price' },
  { value: '0-50', label: 'Under $50' },
  { value: '50-100', label: '$50 - $100' },
  { value: '100-200', label: '$100 - $200' },
  { value: '200+', label: '$200+' },
];

export default function Browse() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ItemCategory | 'all'>('all');
  const [selectedPrice, setSelectedPrice] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('newest');

  const getPriceParams = () => {
    if (selectedPrice === '0-50') return { minPrice: 0, maxPrice: 50 };
    if (selectedPrice === '50-100') return { minPrice: 50, maxPrice: 100 };
    if (selectedPrice === '100-200') return { minPrice: 100, maxPrice: 200 };
    if (selectedPrice === '200+') return { minPrice: 200 };
    return {};
  };

  const { data, isLoading, isError } = useItems({
    search: searchQuery || undefined,
    category: selectedCategory !== 'all' ? selectedCategory : undefined,
    sortBy,
    ...getPriceParams(),
  });

  const items = data?.items || [];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar isAuthenticated={true} userStatus="approved" />

      <main className="flex-1 py-8">
        <div className="page-container">
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Browse Items</h1>
            <p className="text-muted-foreground">Discover items available for rent near you</p>
          </div>

          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for cars, cameras, tools..."
                className="input-field pl-11 pr-4"
              />
            </div>
            <div className="relative flex-1 md:max-w-xs">
              <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input type="text" placeholder="Location" className="input-field pl-11 pr-4" />
            </div>
            <Button variant="outline" className="gap-2 md:w-auto" onClick={() => setShowFilters(!showFilters)}>
              <SlidersHorizontal className="w-4 h-4" />
              Filters
            </Button>
          </div>

          {showFilters && (
            <div className="card-static p-4 mb-6 animate-fade-in">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-foreground">Filters</h3>
                <button onClick={() => setShowFilters(false)} className="text-muted-foreground hover:text-foreground">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Category</label>
                  <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value as ItemCategory | 'all')} className="input-field">
                    {categories.map((cat) => <option key={cat.value} value={cat.value}>{cat.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Price Range</label>
                  <select value={selectedPrice} onChange={(e) => setSelectedPrice(e.target.value)} className="input-field">
                    {priceRanges.map((range) => <option key={range.value} value={range.value}>{range.label}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button variant="outline" size="sm" onClick={() => { setSelectedCategory('all'); setSelectedPrice('all'); }}>
                  Clear All
                </Button>
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-2 mb-6">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === cat.value
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-muted-foreground">
              {isLoading ? 'Yüklənir...' : `${items.length} items found`}
            </p>
            <select
              className="text-sm border border-input rounded-lg px-3 py-2 bg-background"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="newest">Most Relevant</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>

          {isLoading ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground">Yüklənir...</p>
            </div>
          ) : isError ? (
            <div className="text-center py-16">
              <p className="text-destructive">Xəta baş verdi. Yenidən cəhd edin.</p>
            </div>
          ) : items.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((item: any) => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-lg font-medium text-foreground mb-2">No items found</p>
              <p className="text-muted-foreground">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}