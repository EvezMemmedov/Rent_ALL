import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export default function TermsOfService() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 py-16">
        <div className="page-container max-w-4xl">
          <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <p>Last updated: March 2026</p>
            <h2>1. Acceptance of Terms</h2>
            <p>By accessing RentAll, you agree to these terms...</p>
            {/* Məzmunu əlavə et */}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}