import { Link, useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Calendar, Check, X, MessageCircle, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { useOwnerRequests, useUpdateRentalStatus } from '@/hooks/useRentals';
import { useItem } from '@/hooks/useItems';

export default function OwnerRequests() {
  const { itemId } = useParams();
  const navigate = useNavigate();
  const { data: itemData } = useItem(itemId!);
  const { data, isLoading } = useOwnerRequests(itemId!);
  const updateStatus = useUpdateRentalStatus();

  const item = itemData?.item;
  const requests = data?.rentals || [];

  const getImageUrl = (img: string | undefined) => {
    if (!img) return 'https://via.placeholder.com/80';
    if (img.startsWith('http')) return img;
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:5000';
    if (img.startsWith('/api/uploads')) return `${baseUrl}${img}`;
    return 'https://via.placeholder.com/80';
  };

  const handleApprove = (id: number) => {
    updateStatus.mutate({ id, status: 'approved' });
  };

  const handleReject = (id: number) => {
    updateStatus.mutate({ id, status: 'rejected' });
  };

  const handleComplete = (id: number) => {
    updateStatus.mutate({ id, status: 'completed' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 py-8">
        <div className="page-container max-w-4xl">
          <Link to="/my-items" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
            <ChevronLeft className="w-4 h-4" />
            Back to My Items
          </Link>

          <div className="flex flex-col md:flex-row gap-4 mb-8">
            {item?.images?.[0] && (
              <img
                src={getImageUrl(item.images[0])}
                alt={item.title}
                className="w-20 h-20 rounded-lg object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/80';
                }}
              />
            )}
            <div>
              <h1 className="text-2xl font-bold text-foreground mb-1">Rental Requests</h1>
              <p className="text-muted-foreground">{item?.title || 'Loading...'}</p>
            </div>
          </div>

          {isLoading ? (
            <p className="text-muted-foreground text-center py-16">Loading...</p>
          ) : requests.length > 0 ? (
            <div className="space-y-4">
              {requests.map((request: any) => (
                <div key={request.id} className="card-static p-6">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold">
                        {request.renter?.name?.charAt(0) || '?'}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-foreground">{request.renter?.name}</h3>
                          {request.renter?.status === 'approved' && (
                            <span className="flex items-center gap-1 text-xs text-success">
                              <Shield className="w-3.5 h-3.5" />
                              Verified
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{request.renter?.phone}</p>
                      </div>
                    </div>
                    <StatusBadge status={request.status} />
                  </div>

                  <div className="bg-muted/50 rounded-lg p-4 mb-4">
                    <div className="grid sm:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground block mb-1">Check-in</span>
                        <span className="font-medium">{request.startDate}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block mb-1">Check-out</span>
                        <span className="font-medium">{request.endDate}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block mb-1">Total</span>
                        <span className="font-semibold text-lg">${request.totalPrice}</span>
                      </div>
                    </div>
                  </div>

                  {request.message && (
                    <div className="mb-4">
                      <p className="text-sm text-muted-foreground mb-1">Message from renter:</p>
                      <p className="text-foreground">{request.message}</p>
                    </div>
                  )}

                  {request.status === 'pending' && (
                    <div className="flex flex-wrap gap-3 pt-4 border-t border-border">
                      <Button
                        onClick={() => handleApprove(request.id)}
                        className="gap-2"
                        disabled={updateStatus.isPending}
                      >
                        <Check className="w-4 h-4" />
                        Approve
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleReject(request.id)}
                        className="gap-2"
                        disabled={updateStatus.isPending}
                      >
                        <X className="w-4 h-4" />
                        Decline
                      </Button>
                      <Button
                        variant="ghost"
                        className="gap-2"
                        onClick={() => request.renter?.id && navigate(`/messages/${request.renter.id}`)}
                      >
                        <MessageCircle className="w-4 h-4" />
                        Message
                      </Button>
                    </div>
                  )}

                  {request.status === 'approved' && (
                    <div className="pt-4 border-t border-border flex flex-wrap items-center justify-between gap-3">
                      <p className="text-sm text-success flex items-center gap-2">
                        <Check className="w-4 h-4" />
                        You approved this request
                      </p>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleComplete(request.id)}
                        disabled={updateStatus.isPending}
                      >
                        Mark as Completed
                      </Button>
                    </div>
                  )}

                  {request.status === 'rejected' && (
                    <div className="pt-4 border-t border-border">
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <X className="w-4 h-4" />
                        You declined this request
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-medium text-foreground mb-2">No rental requests</p>
              <p className="text-muted-foreground">When someone requests to rent this item, it will appear here.</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}