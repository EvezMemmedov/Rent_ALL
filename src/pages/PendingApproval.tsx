import { Link } from 'react-router-dom';
import { Package, Clock, Mail, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PendingApproval() {
  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-slide-up">
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
            <Package className="w-6 h-6 text-primary-foreground" />
          </div>
          <span className="text-2xl font-semibold text-foreground">RentAll</span>
        </Link>

        {/* Card */}
        <div className="card-static p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-warning/10 flex items-center justify-center mx-auto mb-6">
            <Clock className="w-8 h-8 text-warning" />
          </div>
          
          <h1 className="text-2xl font-bold text-foreground mb-3">Verification Pending</h1>
          <p className="text-muted-foreground mb-6">
            Thank you for registering! Our team is reviewing your documents. 
            This usually takes 1-2 business days.
          </p>

          <div className="bg-muted/50 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-3 text-left">
              <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">We'll notify you by email</p>
                <p className="text-xs text-muted-foreground">Once your account is approved, you'll get full access</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <span className="text-sm text-muted-foreground">Account Status</span>
              <span className="status-badge status-pending">Pending Review</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <span className="text-sm text-muted-foreground">Submitted</span>
              <span className="text-sm font-medium text-foreground">Just now</span>
            </div>
          </div>

          <div className="mt-8">
            <Link to="/">
              <Button variant="outline" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
