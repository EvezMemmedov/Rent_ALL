import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Star, MoreVertical, Edit, Trash2, Eye, EyeOff, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useMyItems, useDeleteItem } from '@/hooks/useItems';

export default function MyItems() {
  const [showMenu, setShowMenu] = useState<number | null>(null);
  const { data, isLoading } = useMyItems();
  const deleteItem = useDeleteItem();
  const items = data?.items || [];

  const getImageUrl = (img: string | undefined) => {
    if (!img) return 'https://via.placeholder.com/160x112';
    if (img.startsWith('http')) return img;
    if (img.startsWith('/api/uploads')) return `http://127.0.0.1:5000${img}`;
    return 'https://via.placeholder.com/160x112';
  };

  const handleDelete = (id: number) => {
    if (confirm('Bu əşyanı silmək istədiyinizə əminsiniz?')) {
      deleteItem.mutate(id);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 py-8">
        <div className="page-container">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">My Listed Items</h1>
              <p className="text-muted-foreground">Manage your items available for rent</p>
            </div>
            <Link to="/add-item">
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Add New Item
              </Button>
            </Link>
          </div>

          {isLoading ? (
            <p className="text-muted-foreground text-center py-16">Yüklənir...</p>
          ) : items.length > 0 ? (
            <div className="grid gap-4">
              {items.map((item: any) => (
                <div key={item.id} className="card-static p-4 md:p-6">
                  <div className="flex flex-col md:flex-row gap-4">
                    <Link to={`/items/${item.id}`}>
                      <img
                        src={getImageUrl(item.images?.[0])}
                        alt={item.title}
                        className="w-full md:w-40 h-48 md:h-28 rounded-lg object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/160x112';
                        }}
                      />
                    </Link>
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <Link to={`/items/${item.id}`}>
                            <h3 className="font-semibold text-foreground hover:text-primary transition-colors text-lg">
                              {item.title}
                            </h3>
                          </Link>
                          <p className="text-sm text-muted-foreground capitalize">{item.category}</p>
                        </div>
                        <div className="relative">
                          <button
                            onClick={() => setShowMenu(showMenu === item.id ? null : item.id)}
                            className="p-2 rounded-lg hover:bg-muted transition-colors"
                          >
                            <MoreVertical className="w-5 h-5 text-muted-foreground" />
                          </button>
                          {showMenu === item.id && (
                            <div className="absolute right-0 top-full mt-1 w-40 card-static shadow-lg py-1 z-10 animate-fade-in">
                              <Link
                                to={`/items/${item.id}`}
                                className="w-full px-4 py-2 text-sm text-left hover:bg-muted flex items-center gap-2"
                              >
                                <Edit className="w-4 h-4" />
                                Edit
                              </Link>
                              <button className="w-full px-4 py-2 text-sm text-left hover:bg-muted flex items-center gap-2">
                                <EyeOff className="w-4 h-4" />
                                Hide Listing
                              </button>
                              <button
                                onClick={() => handleDelete(item.id)}
                                className="w-full px-4 py-2 text-sm text-left hover:bg-muted flex items-center gap-2 text-destructive"
                                disabled={deleteItem.isPending}
                              >
                                <Trash2 className="w-4 h-4" />
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 mt-3">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-warning text-warning" />
                          <span className="font-medium">{item.avgRating || '—'}</span>
                          <span className="text-muted-foreground">({item.reviews?.length || 0} reviews)</span>
                        </div>
                        <span className="text-muted-foreground">•</span>
                        <span className="font-medium">${item.pricePerDay}/day</span>
                        <span className="text-muted-foreground">•</span>
                        <span className={`text-sm font-medium ${item.status === 'available' ? 'text-success' : 'text-warning'}`}>
                          {item.status === 'available' ? 'Available' : 'Rented'}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-2 mt-4">
                        <Link to={`/owner-requests/${item.id}`}>
                          <Button size="sm" variant="outline">View Requests</Button>
                        </Link>
                        <Link to={`/items/${item.id}`}>
                          <Button size="sm" variant="ghost" className="gap-1">
                            <Eye className="w-4 h-4" />
                            Preview
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-medium text-foreground mb-2">No items listed yet</p>
              <p className="text-muted-foreground mb-4">Start earning by listing your first item</p>
              <Link to="/add-item">
                <Button>List Your First Item</Button>
              </Link>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}