import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, Upload, X, Plus, DollarSign, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import type { ItemCategory, PricingType } from '@/types';

const categories: { value: ItemCategory; label: string }[] = [
  { value: 'cars', label: 'Cars & Vehicles' },
  { value: 'houses', label: 'Houses & Apartments' },
  { value: 'bikes', label: 'Bikes & Scooters' },
  { value: 'tools', label: 'Tools & Equipment' },
  { value: 'electronics', label: 'Electronics & Cameras' },
  { value: 'other', label: 'Other' },
];

export default function AddItem() {
  const navigate = useNavigate();
  const [images, setImages] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    category: '' as ItemCategory,
    description: '',
    pricePerDay: '',
    pricePerHour: '',
    pricingType: 'daily' as PricingType,
    location: '',
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages = Array.from(files).map(file => URL.createObjectURL(file));
      setImages(prev => [...prev, ...newImages].slice(0, 5));
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Would submit to backend
    navigate('/my-items');
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar isAuthenticated={true} userStatus="approved" />
      
      <main className="flex-1 py-8">
        <div className="page-container max-w-3xl">
          {/* Header */}
          <Link to="/dashboard" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
            <ChevronLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>

          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">List a New Item</h1>
            <p className="text-muted-foreground">Share your item with the RentAll community</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Images */}
            <section className="card-static p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">Photos</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                {images.map((img, index) => (
                  <div key={index} className="relative aspect-square rounded-lg overflow-hidden group">
                    <img src={img} alt={`Upload ${index + 1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 w-6 h-6 rounded-full bg-foreground/80 text-background flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    {index === 0 && (
                      <span className="absolute bottom-2 left-2 px-2 py-0.5 bg-foreground/80 text-background text-xs rounded">
                        Cover
                      </span>
                    )}
                  </div>
                ))}
                {images.length < 5 && (
                  <label className="aspect-square rounded-lg border-2 border-dashed border-input flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors">
                    <Upload className="w-6 h-6 text-muted-foreground mb-2" />
                    <span className="text-xs text-muted-foreground">Add Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </label>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-3">Upload up to 5 photos. First photo will be the cover.</p>
            </section>

            {/* Basic Info */}
            <section className="card-static p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">Basic Information</h2>
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., Tesla Model 3 - Long Range"
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as ItemCategory })}
                    className="input-field"
                    required
                  >
                    <option value="">Select a category</option>
                    {categories.map((cat) => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe your item, its features, and any important details..."
                    rows={4}
                    className="input-field resize-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="City, State"
                    className="input-field"
                    required
                  />
                </div>
              </div>
            </section>

            {/* Pricing */}
            <section className="card-static p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">Pricing</h2>
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Pricing Type</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="pricingType"
                        value="daily"
                        checked={formData.pricingType === 'daily'}
                        onChange={(e) => setFormData({ ...formData, pricingType: e.target.value as PricingType })}
                        className="w-4 h-4 text-primary"
                      />
                      <span className="text-sm">Daily</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="pricingType"
                        value="hourly"
                        checked={formData.pricingType === 'hourly'}
                        onChange={(e) => setFormData({ ...formData, pricingType: e.target.value as PricingType })}
                        className="w-4 h-4 text-primary"
                      />
                      <span className="text-sm">Hourly</span>
                    </label>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Price per Day
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <input
                        type="number"
                        value={formData.pricePerDay}
                        onChange={(e) => setFormData({ ...formData, pricePerDay: e.target.value })}
                        placeholder="0"
                        className="input-field pl-11"
                        required
                      />
                    </div>
                  </div>
                  {formData.pricingType === 'hourly' && (
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Price per Hour
                      </label>
                      <div className="relative">
                        <DollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <input
                          type="number"
                          value={formData.pricePerHour}
                          onChange={(e) => setFormData({ ...formData, pricePerHour: e.target.value })}
                          placeholder="0"
                          className="input-field pl-11"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* Actions */}
            <div className="flex gap-4">
              <Button type="button" variant="outline" className="flex-1" onClick={() => navigate(-1)}>
                Cancel
              </Button>
              <Button type="submit" className="flex-1">
                List Item
              </Button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
