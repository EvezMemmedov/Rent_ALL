import { ArrowRight, Shield, DollarSign, Clock, Star, Car, Home, Bike, Wrench, Smartphone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ItemCard } from '@/components/ui/ItemCard';
import { useItems } from '@/hooks/useItems';

const categories = [
  { icon: Car, label: 'Cars', count: 1240 },
  { icon: Home, label: 'Houses', count: 856 },
  { icon: Bike, label: 'Bikes', count: 423 },
  { icon: Wrench, label: 'Tools', count: 312 },
  { icon: Smartphone, label: 'Electronics', count: 567 },
];

const features = [
  {
    icon: Shield,
    title: 'Verified Users',
    description: 'Every user is verified with ID check for your safety and peace of mind.',
  },
  {
    icon: DollarSign,
    title: 'Competitive Pricing',
    description: 'Set your own rates. Owners keep 85% of every transaction.',
  },
  {
    icon: Clock,
    title: 'Flexible Rentals',
    description: 'Rent by the hour or day. Our system handles availability and scheduling.',
  },
];

export default function Landing() {
  const { data } = useItems({ sortBy: 'newest' });
  const featuredItems = data?.items?.slice(0, 6) || [];
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="gradient-bg">
        <div className="page-container py-20 md:py-28">
          <div className="max-w-3xl mx-auto text-center animate-slide-up">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
              Rent Anything,
              <br />
              <span className="gradient-text">From Anyone</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-xl mx-auto">
              Join thousands of people sharing cars, homes, tools, and more. 
              List what you own or find what you need.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/browse">
                <Button variant="hero" size="xl">
                  Start Browsing
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="hero-outline" size="xl">
                  List Your Item
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-background">
        <div className="page-container">
          <div className="text-center mb-10">
            <h2 className="section-title mb-2">Browse by Category</h2>
            <p className="section-subtitle">Find exactly what you're looking for</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {categories.map((category) => (
              <Link 
                key={category.label}
                to={`/browse?category=${category.label.toLowerCase()}`}
                className="card-elevated p-6 text-center group"
              >
                <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center mx-auto mb-3 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <category.icon className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">{category.label}</h3>
                <p className="text-sm text-muted-foreground">{category.count.toLocaleString()} items</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Items */}
      <section className="py-16 bg-muted/30">
        <div className="page-container">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="section-title mb-2">Featured Items</h2>
              <p className="section-subtitle">Top-rated rentals near you</p>
            </div>
            <Link to="/browse">
              <Button variant="outline">
                View All
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredItems.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-background">
        <div className="page-container">
          <div className="text-center mb-12">
            <h2 className="section-title mb-2">Why Choose RentAll?</h2>
            <p className="section-subtitle">Built for trust, designed for simplicity</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div key={feature.title} className="text-center">
                <div className="w-14 h-14 rounded-2xl bg-accent flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-16 bg-muted/30">
        <div className="page-container">
          <div className="card-static p-8 md:p-12 text-center">
            <div className="flex items-center justify-center gap-1 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className="w-6 h-6 fill-warning text-warning" />
              ))}
            </div>
            <blockquote className="text-xl md:text-2xl font-medium text-foreground mb-4 max-w-2xl mx-auto">
              "RentAll made it so easy to rent out my camera gear. I've earned over $3,000 in the past year!"
            </blockquote>
            <div className="flex items-center justify-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold">
                M
              </div>
              <div className="text-left">
                <p className="font-medium text-foreground">Mike Johnson</p>
                <p className="text-sm text-muted-foreground">Owner since 2023</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary">
        <div className="page-container text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
            Ready to Start?
          </h2>
          <p className="text-primary-foreground/80 text-lg mb-8 max-w-xl mx-auto">
            Join our community of renters and owners. Sign up in minutes and get verified today.
          </p>
          <Link to="/register">
            <Button size="xl" className="bg-white text-primary hover:bg-white/90">
              Create Free Account
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
