import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, MapPin, Calendar, Clock, User, ChevronLeft, ChevronRight, Shield, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { mockItems } from '@/data/mockData';
import { format, addDays, eachDayOfInterval, isSameDay } from 'date-fns';

export default function ItemDetail() {
  const { id } = useParams();
  const item = mockItems.find(i => i.id === id) || mockItems[0];
  
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(null);
  const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(null);
  const [showRequestModal, setShowRequestModal] = useState(false);

  const today = new Date();
  const calendarDays = eachDayOfInterval({
    start: today,
    end: addDays(today, 30),
  });

  const totalDays = selectedStartDate && selectedEndDate 
    ? Math.ceil((selectedEndDate.getTime() - selectedStartDate.getTime()) / (1000 * 60 * 60 * 24)) + 1
    : 0;
  const totalPrice = totalDays * item.pricePerDay;

  const handleDateClick = (date: Date) => {
    if (!selectedStartDate || (selectedStartDate && selectedEndDate)) {
      setSelectedStartDate(date);
      setSelectedEndDate(null);
    } else if (date > selectedStartDate) {
      setSelectedEndDate(date);
    } else {
      setSelectedStartDate(date);
      setSelectedEndDate(null);
    }
  };

  const isDateSelected = (date: Date) => {
    if (!selectedStartDate) return false;
    if (!selectedEndDate) return isSameDay(date, selectedStartDate);
    return date >= selectedStartDate && date <= selectedEndDate;
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar isAuthenticated={true} userStatus="approved" />
      
      <main className="flex-1 py-8">
        <div className="page-container">
          {/* Breadcrumb */}
          <Link to="/browse" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
            <ChevronLeft className="w-4 h-4" />
            Back to Browse
          </Link>

          <div className="grid lg:grid-cols-5 gap-8">
            {/* Left Column - Images & Details */}
            <div className="lg:col-span-3 space-y-6">
              {/* Image Gallery */}
              <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-muted">
                <img
                  src={item.images[currentImageIndex]}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                {item.images.length > 1 && (
                  <>
                    <button
                      onClick={() => setCurrentImageIndex(i => i === 0 ? item.images.length - 1 : i - 1)}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg hover:bg-white transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setCurrentImageIndex(i => i === item.images.length - 1 ? 0 : i + 1)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg hover:bg-white transition-colors"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>

              {/* Title & Info */}
              <div>
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <span className="px-2.5 py-1 bg-accent rounded-full text-xs font-medium capitalize mb-2 inline-block">
                      {item.category}
                    </span>
                    <h1 className="text-2xl md:text-3xl font-bold text-foreground">{item.title}</h1>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Star className="w-5 h-5 fill-warning text-warning" />
                    <span className="font-semibold">{item.rating}</span>
                    <span className="text-muted-foreground">({item.reviewCount} reviews)</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 text-muted-foreground mb-6">
                  <MapPin className="w-4 h-4" />
                  <span>{item.location}</span>
                </div>

                <p className="text-foreground leading-relaxed">{item.description}</p>
              </div>

              {/* Owner Info */}
              <div className="card-static p-5">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xl font-semibold">
                    {item.ownerName.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{item.ownerName}</h3>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                      <span className="flex items-center gap-1">
                        <Shield className="w-4 h-4 text-success" />
                        Verified Owner
                      </span>
                      <span>•</span>
                      <span>Member since 2023</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="gap-2">
                    <MessageCircle className="w-4 h-4" />
                    Message
                  </Button>
                </div>
              </div>
            </div>

            {/* Right Column - Booking */}
            <div className="lg:col-span-2">
              <div className="card-static p-6 sticky top-24">
                <div className="flex items-baseline gap-2 mb-6">
                  <span className="text-3xl font-bold text-foreground">${item.pricePerDay}</span>
                  <span className="text-muted-foreground">/ day</span>
                </div>

                {/* Calendar */}
                <div className="mb-6">
                  <h3 className="font-medium text-foreground mb-3 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Select Dates
                  </h3>
                  <div className="grid grid-cols-7 gap-1 text-center text-xs mb-2">
                    {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                      <div key={day} className="py-2 text-muted-foreground font-medium">{day}</div>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 gap-1">
                    {calendarDays.slice(0, 28).map((date) => {
                      const isSelected = isDateSelected(date);
                      const isStart = selectedStartDate && isSameDay(date, selectedStartDate);
                      const isEnd = selectedEndDate && isSameDay(date, selectedEndDate);
                      
                      return (
                        <button
                          key={date.toISOString()}
                          onClick={() => handleDateClick(date)}
                          className={`
                            py-2 text-sm rounded-lg transition-colors
                            ${isSelected ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}
                            ${isStart || isEnd ? 'font-semibold' : ''}
                          `}
                        >
                          {format(date, 'd')}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Selected Dates Summary */}
                {selectedStartDate && (
                  <div className="bg-muted/50 rounded-lg p-4 mb-6">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Check-in</span>
                      <span className="font-medium">{format(selectedStartDate, 'MMM d, yyyy')}</span>
                    </div>
                    {selectedEndDate && (
                      <>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-muted-foreground">Check-out</span>
                          <span className="font-medium">{format(selectedEndDate, 'MMM d, yyyy')}</span>
                        </div>
                        <div className="border-t border-border pt-2 mt-2">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-muted-foreground">${item.pricePerDay} × {totalDays} days</span>
                            <span>${totalPrice}</span>
                          </div>
                          <div className="flex justify-between font-semibold mt-2">
                            <span>Total</span>
                            <span>${totalPrice}</span>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                )}

                <Button 
                  className="w-full" 
                  size="lg"
                  disabled={!selectedStartDate || !selectedEndDate}
                  onClick={() => setShowRequestModal(true)}
                >
                  Request to Rent
                </Button>

                <p className="text-xs text-muted-foreground text-center mt-3">
                  You won't be charged until the owner approves
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Request Modal */}
      {showRequestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/50 backdrop-blur-sm animate-fade-in">
          <div className="card-static w-full max-w-md p-6 animate-scale-in">
            <h2 className="text-xl font-bold text-foreground mb-2">Confirm Rental Request</h2>
            <p className="text-muted-foreground mb-6">
              You're requesting to rent {item.title}
            </p>
            
            <div className="bg-muted/50 rounded-lg p-4 mb-6">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Dates</span>
                <span className="font-medium">
                  {selectedStartDate && format(selectedStartDate, 'MMM d')} - {selectedEndDate && format(selectedEndDate, 'MMM d, yyyy')}
                </span>
              </div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Duration</span>
                <span className="font-medium">{totalDays} days</span>
              </div>
              <div className="flex justify-between font-semibold pt-2 border-t border-border">
                <span>Total</span>
                <span>${totalPrice}</span>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-foreground mb-2">
                Message to owner (optional)
              </label>
              <textarea
                rows={3}
                placeholder="Introduce yourself and explain why you'd like to rent this item..."
                className="input-field resize-none"
              />
            </div>

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setShowRequestModal(false)}>
                Cancel
              </Button>
              <Button className="flex-1" onClick={() => setShowRequestModal(false)}>
                Send Request
              </Button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
