import { useState } from 'react';
import { Star, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ReviewModalProps {
  itemTitle: string;
  onClose: () => void;
  onSubmit: (data: { rating: number; comment: string }) => void;
  isLoading?: boolean;
}

export function ReviewModal({ itemTitle, onClose, onSubmit, isLoading }: ReviewModalProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');

  const handleSubmit = () => {
    if (rating === 0) return;
    onSubmit({ rating, comment });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/50 backdrop-blur-sm animate-fade-in">
      <div className="card-static w-full max-w-md p-6 animate-scale-in">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Write a Review</h2>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-muted-foreground mb-6">How was your experience with {itemTitle}?</p>

        {/* Rating Stars */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Rating</label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                className="transition-transform hover:scale-110"
              >
                <Star
                  className={`w-8 h-8 ${
                    star <= (hoveredRating || rating)
                      ? 'fill-warning text-warning'
                      : 'text-muted-foreground'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Comment */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Comment (optional)</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience..."
            rows={4}
            className="input-field resize-none"
          />
        </div>

        <div className="flex gap-3">
          <Button variant="outline" className="flex-1" onClick={onClose}>
            Cancel
          </Button>
          <Button
            className="flex-1"
            onClick={handleSubmit}
            disabled={rating === 0 || isLoading}
          >
            {isLoading ? 'Submitting...' : 'Submit Review'}
          </Button>
        </div>
      </div>
    </div>
  );
}