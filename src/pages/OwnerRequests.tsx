import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ChevronLeft, Calendar, User, Check, X, MessageCircle, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { mockItems } from '@/data/mockData';
import { format } from 'date-fns';
import type { RentalStatus } from '@/types';

interface RentalRequest {
  id: string;
  renterName: string;
  renterEmail: string;
  renterVerified: boolean;
  startDate: Date;
  endDate: Date;
  totalPrice: number;
  message: string;
  status: RentalStatus;
  createdAt: Date;
}

// Mock rental requests for an item
const mockRequests: RentalRequest[] = [
  {
    id: 'req1',
    renterName: 'Alice Johnson',
    renterEmail: 'alice@example.com',
    renterVerified: true,
    startDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    endDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000),
    totalPrice: 267,
    message: "Hi! I'm interested in renting your Tesla for a weekend road trip. I have experience with EVs and will take great care of it.",
    status: 'requested',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
  {
    id: 'req2',
    renterName: 'Bob Smith',
    renterEmail: 'bob@example.com',
    renterVerified: true,
    startDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000),
    endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    totalPrice: 178,
    message: "Looking to rent for a business trip. Clean driving record, can provide references.",
    status: 'requested',
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
  },
];

export default function OwnerRequests() {
  const { itemId } = useParams();
  const item = mockItems.find(i => i.id === itemId) || mockItems[0];
  const [requests, setRequests] = useState<RentalRequest[]>(mockRequests);

  const handleApprove = (requestId: string) => {
    setRequests(prev => prev.map(req => 
      req.id === requestId ? { ...req, status: 'approved' as RentalStatus } : req
    ));
  };

  const handleReject = (requestId: string) => {
    setRequests(prev => prev.map(req => 
      req.id === requestId ? { ...req, status: 'rejected' as RentalStatus } : req
    ));
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar isAuthenticated={true} userStatus="approved" />
      
      <main className="flex-1 py-8">
        <div className="page-container max-w-4xl">
          {/* Header */}
          <Link to="/my-items" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
            <ChevronLeft className="w-4 h-4" />
            Back to My Items
          </Link>

          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <img 
              src={item.images[0]} 
              alt={item.title}
              className="w-20 h-20 rounded-lg object-cover"
            />
            <div>
              <h1 className="text-2xl font-bold text-foreground mb-1">Rental Requests</h1>
              <p className="text-muted-foreground">{item.title}</p>
            </div>
          </div>

          {/* Requests List */}
          {requests.length > 0 ? (
            <div className="space-y-4">
              {requests.map((request) => (
                <div key={request.id} className="card-static p-6">
                  {/* Renter Info */}
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold">
                        {request.renterName.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-foreground">{request.renterName}</h3>
                          {request.renterVerified && (
                            <span className="flex items-center gap-1 text-xs text-success">
                              <Shield className="w-3.5 h-3.5" />
                              Verified
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{request.renterEmail}</p>
                      </div>
                    </div>
                    <StatusBadge status={request.status} />
                  </div>

                  {/* Dates & Price */}
                  <div className="bg-muted/50 rounded-lg p-4 mb-4">
                    <div className="grid sm:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground block mb-1">Check-in</span>
                        <span className="font-medium">{format(request.startDate, 'MMM d, yyyy')}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block mb-1">Check-out</span>
                        <span className="font-medium">{format(request.endDate, 'MMM d, yyyy')}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block mb-1">Total</span>
                        <span className="font-semibold text-lg">${request.totalPrice}</span>
                      </div>
                    </div>
                  </div>

                  {/* Message */}
                  {request.message && (
                    <div className="mb-4">
                      <p className="text-sm text-muted-foreground mb-1">Message from renter:</p>
                      <p className="text-foreground">{request.message}</p>
                    </div>
                  )}

                  {/* Actions */}
                  {request.status === 'requested' && (
                    <div className="flex flex-wrap gap-3 pt-4 border-t border-border">
                      <Button onClick={() => handleApprove(request.id)} className="gap-2">
                        <Check className="w-4 h-4" />
                        Approve
                      </Button>
                      <Button variant="outline" onClick={() => handleReject(request.id)} className="gap-2">
                        <X className="w-4 h-4" />
                        Decline
                      </Button>
                      <Button variant="ghost" className="gap-2">
                        <MessageCircle className="w-4 h-4" />
                        Message
                      </Button>
                    </div>
                  )}

                  {request.status === 'approved' && (
                    <div className="pt-4 border-t border-border">
                      <p className="text-sm text-success flex items-center gap-2">
                        <Check className="w-4 h-4" />
                        You approved this request
                      </p>
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
