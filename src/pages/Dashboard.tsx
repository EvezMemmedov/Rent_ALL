import { Package, TrendingUp, Calendar, Star, Plus, ArrowRight, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { mockRentals, mockItems } from '@/data/mockData';

const stats = [
  { label: 'Active Rentals', value: '3', icon: Calendar, trend: '+2 this week' },
  { label: 'Total Earnings', value: '$2,450', icon: DollarSign, trend: '+$340 this month' },
  { label: 'Items Listed', value: '5', icon: Package, trend: '2 rented out' },
  { label: 'Avg Rating', value: '4.8', icon: Star, trend: 'Based on 23 reviews' },
];

export default function Dashboard() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar isAuthenticated={true} userStatus="approved" />
      
      <main className="flex-1 py-8">
        <div className="page-container">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">Welcome back, John</h1>
              <p className="text-muted-foreground mt-1">Here's what's happening with your rentals</p>
            </div>
            <Link to="/add-item">
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                List New Item
              </Button>
            </Link>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat) => (
              <div key={stat.label} className="card-static p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
                    <stat.icon className="w-5 h-5 text-primary" />
                  </div>
                  <TrendingUp className="w-4 h-4 text-success" />
                </div>
                <p className="text-2xl font-bold text-foreground mb-1">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-xs text-success mt-1">{stat.trend}</p>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Recent Rentals */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-foreground">Your Rentals</h2>
                <Link to="/my-rentals" className="text-sm text-primary hover:underline flex items-center gap-1">
                  View all <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
              <div className="space-y-3">
                {mockRentals.slice(0, 3).map((rental) => (
                  <div key={rental.id} className="card-static p-4">
                    <div className="flex gap-4">
                      <img 
                        src={rental.item.images[0]} 
                        alt={rental.item.title}
                        className="w-20 h-20 rounded-lg object-cover shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-medium text-foreground line-clamp-1">{rental.item.title}</h3>
                          <StatusBadge status={rental.status} />
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {new Date(rental.startDate).toLocaleDateString()} - {new Date(rental.endDate).toLocaleDateString()}
                        </p>
                        <p className="text-sm font-medium text-foreground mt-2">${rental.totalPrice}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* My Listed Items */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-foreground">My Listed Items</h2>
                <Link to="/my-items" className="text-sm text-primary hover:underline flex items-center gap-1">
                  View all <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
              <div className="space-y-3">
                {mockItems.slice(0, 3).map((item) => (
                  <div key={item.id} className="card-static p-4">
                    <div className="flex gap-4">
                      <img 
                        src={item.images[0]} 
                        alt={item.title}
                        className="w-20 h-20 rounded-lg object-cover shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-medium text-foreground line-clamp-1">{item.title}</h3>
                          <div className="flex items-center gap-1 shrink-0">
                            <Star className="w-4 h-4 fill-warning text-warning" />
                            <span className="text-sm font-medium">{item.rating}</span>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1 capitalize">{item.category}</p>
                        <p className="text-sm font-medium text-foreground mt-2">${item.pricePerDay}/day</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
