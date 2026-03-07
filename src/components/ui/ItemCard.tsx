import { Star, MapPin, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { useDeleteItem } from '@/hooks/useItems';

interface ItemCardProps {
  item: any;
}

export function ItemCard({ item }: ItemCardProps) {
  const { user } = useAuthStore();
  const deleteItem = useDeleteItem();
  const rating = item.avgRating || item.rating || 0;

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm('Bu əşyanı silmək istədiyinizə əminsiniz? (Admin Action)')) {
      deleteItem.mutate(item.id);
    }
  };


  let image = '/placeholder.svg';
  if (item.images?.[0]) {
    const img = item.images[0];
    if (img.startsWith('http')) {
      image = img;
    } else if (img.startsWith('/api/uploads')) {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:5000';
      image = `${baseUrl}${img}`;
    } else {
      image = `/placeholder.svg`;
    }
  }

  return (
    <Link to={`/items/${item.id}`} className="block">
      <div className="card-elevated overflow-hidden group">
        <div className="aspect-[4/3] relative overflow-hidden">
          <img
            src={image}
            alt={item.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/placeholder.svg';
            }}
          />
          <div className="absolute top-3 left-3">
            <span className="px-2.5 py-1 bg-card/90 backdrop-blur-sm rounded-full text-xs font-medium capitalize">
              {item.category}
            </span>
          </div>
          <div className="absolute top-3 right-3 flex gap-2">
            {user?.role === 'admin' && (
              <button
                onClick={handleDelete}
                className="p-2 bg-destructive/90 backdrop-blur-sm rounded-full text-destructive-foreground hover:bg-destructive transition-colors shadow-sm"
                title="Delete Item"
                disabled={deleteItem.isPending}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
        <div className="p-4">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-semibold text-foreground line-clamp-1">{item.title}</h3>
            <div className="flex items-center gap-1 shrink-0">
              <Star className="w-4 h-4 fill-warning text-warning" />
              <span className="text-sm font-medium">
                {rating ? Number(rating).toFixed(1) : '—'}
              </span>
              {item.reviewCount > 0 && (
                <span className="text-xs text-muted-foreground ml-0.5">
                  ({item.reviewCount})
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground text-sm mb-3">
            <MapPin className="w-3.5 h-3.5" />
            <span className="line-clamp-1">{item.location}</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-bold text-foreground">${item.pricePerDay}</span>
            <span className="text-sm text-muted-foreground">/ day</span>
          </div>
        </div>
      </div>
    </Link>
  );
}