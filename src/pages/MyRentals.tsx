import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Star, MessageCircle, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { useMyRentals, useUpdateRentalStatus } from '@/hooks/useRentals';
import { format } from 'date-fns';

type Tab = 'all' | 'active' | 'completed';

export default function MyRentals() {
  const [activeTab, setActiveTab] = useState<Tab>('all');
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedRentalId, setSelectedRentalId] = useState<number | null>(null);
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');

  const { data, isLoading } = useMyRentals();
  const updateStatus = useUpdateRentalStatus();
  const rentals = data?.rentals || [];

  const filteredRentals = rentals.filter((rental: any) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'active') return ['pending', 'approved', 'active'].includes(rental.status);
    if (activeTab === 'completed') return ['completed', 'cancelled', 'rejected'].includes(rental.status);
    return true;
  });

  const handleCancel = (id: number) => {
    updateStatus.mutate({ id, status: 'cancelled' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar isAuthenticated={true} userStatus="approved" />

      <main className="flex-1 py-8">
        <div className="page-container">
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">My Rentals</h1>
            <p className="text-muted-foreground">Track and manage your rental history</p>
          </div>

          <div className="flex gap-2 mb-6 border-b border-border pb-1">
            {(['all', 'active', 'completed'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                  activeTab === tab
                    ? 'text-primary border-b-2 border-primary -mb-px'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {isLoading ? (
            <p className="text-muted-foreground text-center py-16">Yüklənir...</p>
          ) : filteredRentals.length > 0 ? (
            <div className="space-y-4">
              {filteredRentals.map((rental: any) => (
                <div key={rental.id} className="card-static p-4 md:p-6">
                  <div className="flex flex-col md:flex-row gap-4">
                    <Link to={`/items/${rental.itemId}`}>
                      <img
                        src={rental.item?.images?.[0] || 'https://via.placeholder.com/128x96'}
                        alt={rental.item?.title}
                        className="w-full md:w-32 h-40 md:h-24 rounded-lg object-cover"
                      />
                    </Link>
                    <div className="flex-1">
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-2 mb-2">
                        <div>
                          <Link to={`/items/${rental.itemId}`}>
                            <h3 className="font-semibold text-foreground hover:text-primary transition-colors">
                              {rental.item?.title}
                            </h3>
                          </Link>
                        </div>
                        <StatusBadge status={rental.status} />
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mt-3">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {rental.startDate} - {rental.endDate}
                        </span>
                        <span className="font-medium text-foreground">${rental.totalPrice} total</span>
                      </div>

                      {rental.message && (
                        <p className="text-sm text-muted-foreground mt-2 italic">"{rental.message}"</p>
                      )}

                      <div className="flex flex-wrap gap-2 mt-4">
                        {rental.status === 'completed' && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="gap-2"
                            onClick={() => { setSelectedRentalId(rental.id); setShowReviewModal(true); }}
                          >
                            <Star className="w-4 h-4" />
                            Leave Review
                          </Button>
                        )}
                        {rental.status === 'pending' && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="gap-2 text-destructive"
                            onClick={() => handleCancel(rental.id)}
                            disabled={updateStatus.isPending}
                          >
                            <AlertTriangle className="w-4 h-4" />
                            Cancel Request
                          </Button>
                        )}
                        <Button size="sm" variant="ghost" className="gap-2">
                          <MessageCircle className="w-4 h-4" />
                          Message Owner
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-medium text-foreground mb-2">No rentals found</p>
              <p className="text-muted-foreground mb-4">Start browsing items to rent</p>
              <Link to="/browse">
                <Button>Browse Items</Button>
              </Link>
            </div>
          )}
        </div>
      </main>

      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/50 backdrop-blur-sm animate-fade-in">
          <div className="card-static w-full max-w-md p-6 animate-scale-in">
            <h2 className="text-xl font-bold text-foreground mb-2">Leave a Review</h2>
            <p className="text-muted-foreground mb-6">Share your experience with this rental</p>
            <div className="mb-6">
              <label className="block text-sm font-medium text-foreground mb-3">Rating</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button key={star} type="button" onClick={() => setRating(star)} className="p-1">
                    <Star className={`w-8 h-8 transition-colors ${star <= rating ? 'fill-warning text-warning' : 'text-muted-foreground'}`} />
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-foreground mb-2">Your Review</label>
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                rows={4}
                placeholder="Tell others about your experience..."
                className="input-field resize-none"
              />
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setShowReviewModal(false)}>Cancel</Button>
              <Button className="flex-1" onClick={() => setShowReviewModal(false)}>Submit Review</Button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}