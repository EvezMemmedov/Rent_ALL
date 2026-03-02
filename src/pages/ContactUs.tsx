import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Mail, MessageCircle } from 'lucide-react';

export default function ContactUs() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 py-16">
        <div className="page-container max-w-2xl">
          <h1 className="text-4xl font-bold text-center mb-4">Contact Us</h1>
          <p className="text-muted-foreground text-center mb-12">
            We're here to help
          </p>

          <div className="space-y-6">
            <div className="card-static p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Email Support</h3>
                  <p className="text-muted-foreground">rentall2002@gmail.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}