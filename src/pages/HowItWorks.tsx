import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Search, Package, Calendar, DollarSign } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      icon: Search,
      title: 'Browse Items',
      description: 'Search through thousands of items available for rent in your area.',
    },
    {
      icon: Calendar,
      title: 'Book Your Item',
      description: 'Select your dates and send a rental request to the owner.',
    },
    {
      icon: DollarSign,
      title: 'Pay Securely',
      description: 'Payment is only processed after the owner approves your request.',
    },
    {
      icon: Package,
      title: 'Pick Up & Enjoy',
      description: 'Coordinate with the owner to pick up your item and enjoy!',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 py-16">
        <div className="page-container max-w-4xl">
          <h1 className="text-4xl font-bold text-center mb-4">How It Works</h1>
          <p className="text-muted-foreground text-center mb-12">
            Renting items on RentAll is simple and secure
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="card-static p-6">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <step.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}