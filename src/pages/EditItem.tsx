import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, Upload, X, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useItem, useUpdateItem } from '@/hooks/useItems';
import api from '@/lib/api';
import type { ItemCategory } from '@/types';

const categories: { value: ItemCategory; label: string }[] = [
    { value: 'cars', label: 'Cars & Vehicles' },
    { value: 'houses', label: 'Houses & Apartments' },
    { value: 'bikes', label: 'Bikes & Scooters' },
    { value: 'tools', label: 'Tools & Equipment' },
    { value: 'electronics', label: 'Electronics & Cameras' },
    { value: 'other', label: 'Other' },
];

export default function EditItem() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data, isLoading: isItemLoading } = useItem(id!);
    const updateItem = useUpdateItem(Number(id));

    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [existingImages, setExistingImages] = useState<string[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [formData, setFormData] = useState({
        title: '',
        category: '' as ItemCategory,
        description: '',
        pricePerDay: '',
        location: '',
    });

    useEffect(() => {
        if (data?.item) {
            const item = data.item;
            setFormData({
                title: item.title,
                category: item.category,
                description: item.description,
                pricePerDay: item.pricePerDay.toString(),
                location: item.location,
            });
            setExistingImages(item.images || []);
        }
    }, [data]);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            const newFiles = Array.from(files);
            const newPreviews = newFiles.map(file => URL.createObjectURL(file));

            setImageFiles(prev => [...prev, ...newFiles].slice(0, 5 - existingImages.length));
            setImagePreviews(prev => [...prev, ...newPreviews].slice(0, 5 - existingImages.length));
        }
    };

    const removeExistingImage = (index: number) => {
        setExistingImages(prev => prev.filter((_, i) => i !== index));
    };

    const removeNewImage = (index: number) => {
        setImageFiles(prev => prev.filter((_, i) => i !== index));
        setImagePreviews(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            // Əvvəlcə yeni şəkilləri yüklə
            const uploadedUrls: string[] = [];
            for (const file of imageFiles) {
                const uploadData = new FormData();
                uploadData.append('file', file);
                uploadData.append('type', 'items');

                const res = await api.post('/uploads/image', uploadData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                uploadedUrls.push(res.data.url);
            }

            // Köhnə və yeni şəkilləri birləşdir
            const allImages = [...existingImages, ...uploadedUrls];

            // Item-i yenilə
            updateItem.mutate(
                {
                    title: formData.title,
                    category: formData.category,
                    description: formData.description,
                    pricePerDay: Number(formData.pricePerDay),
                    location: formData.location,
                    images: allImages,
                },
                { onSuccess: () => navigate('/my-items') }
            );
        } catch (error) {
            console.error('Şəkil yükləmə xətası:', error);
        }
    };

    if (isItemLoading) {
        return (
            <div className="min-h-screen flex flex-col bg-background">
                <Navbar />
                <main className="flex-1 flex items-center justify-center">
                    <p className="text-muted-foreground animate-pulse">Yüklənir...</p>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Navbar />

            <main className="flex-1 py-8">
                <div className="page-container max-w-3xl">
                    <Link to="/my-items" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
                        <ChevronLeft className="w-4 h-4" />
                        Back to My Items
                    </Link>

                    <div className="mb-8">
                        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Edit Item</h1>
                        <p className="text-muted-foreground">Update your item's information and photos</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <section className="card-static p-6">
                            <h2 className="text-lg font-semibold text-foreground mb-4">Photos</h2>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                                {/* Existing Images */}
                                {existingImages.map((img, index) => (
                                    <div key={`exist-${index}`} className="relative aspect-square rounded-lg overflow-hidden group">
                                        <img src={img} alt={`Existing ${index + 1}`} className="w-full h-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => removeExistingImage(index)}
                                            className="absolute top-2 right-2 w-6 h-6 rounded-full bg-foreground/80 text-background flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                        {index === 0 && (
                                            <span className="absolute bottom-2 left-2 px-2 py-0.5 bg-foreground/80 text-background text-xs rounded">Cover</span>
                                        )}
                                    </div>
                                ))}

                                {/* New Image Previews */}
                                {imagePreviews.map((img, index) => (
                                    <div key={`new-${index}`} className="relative aspect-square rounded-lg overflow-hidden group border-2 border-primary/20">
                                        <img src={img} alt={`New ${index + 1}`} className="w-full h-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => removeNewImage(index)}
                                            className="absolute top-2 right-2 w-6 h-6 rounded-full bg-foreground/80 text-background flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}

                                {existingImages.length + imagePreviews.length < 5 && (
                                    <label className="aspect-square rounded-lg border-2 border-dashed border-input flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors">
                                        <Upload className="w-6 h-6 text-muted-foreground mb-2" />
                                        <span className="text-xs text-muted-foreground">Add Photo</span>
                                        <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} />
                                    </label>
                                )}
                            </div>
                            <p className="text-xs text-muted-foreground mt-3">Upload up to 5 photos. Current total: {existingImages.length + imagePreviews.length}</p>
                        </section>

                        <section className="card-static p-6">
                            <h2 className="text-lg font-semibold text-foreground mb-4">Basic Information</h2>
                            <div className="space-y-5">
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-2">Title</label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
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
                                        className="input-field"
                                        required
                                    />
                                </div>
                            </div>
                        </section>

                        <section className="card-static p-6">
                            <h2 className="text-lg font-semibold text-foreground mb-4">Pricing</h2>
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">Price per Day</label>
                                <div className="relative">
                                    <DollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                    <input
                                        type="number"
                                        value={formData.pricePerDay}
                                        onChange={(e) => setFormData({ ...formData, pricePerDay: e.target.value })}
                                        className="input-field pl-11"
                                        min="1"
                                        required
                                    />
                                </div>
                            </div>
                        </section>

                        <div className="flex gap-4">
                            <Button type="button" variant="outline" className="flex-1" onClick={() => navigate(-1)}>
                                Cancel
                            </Button>
                            <Button type="submit" className="flex-1" disabled={updateItem.isPending}>
                                {updateItem.isPending ? 'Yenilənir...' : 'Save Changes'}
                            </Button>
                        </div>
                    </form>
                </div>
            </main>

            <Footer />
        </div>
    );
}
