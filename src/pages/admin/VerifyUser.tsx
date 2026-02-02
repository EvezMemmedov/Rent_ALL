import { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Mail, Calendar, Check, X, AlertTriangle, ZoomIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/layout/Navbar';
import { mockPendingUsers } from '@/data/mockData';
import { format } from 'date-fns';

export default function VerifyUser() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const user = mockPendingUsers.find(u => u.id === userId) || mockPendingUsers[0];
  
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);

  const handleApprove = () => {
    // Would update user status
    navigate('/admin/pending-users');
  };

  const handleReject = () => {
    // Would update user status with reason
    navigate('/admin/pending-users');
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar isAuthenticated={true} userStatus="approved" isAdmin={true} />
      
      <main className="py-8">
        <div className="page-container max-w-4xl">
          {/* Header */}
          <Link to="/admin/pending-users" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
            <ChevronLeft className="w-4 h-4" />
            Back to Pending Users
          </Link>

          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">User Verification</h1>
            <p className="text-muted-foreground">Review the user's submitted documents</p>
          </div>

          {/* User Info Card */}
          <div className="card-static p-6 mb-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-2xl font-semibold">
                {user.name.charAt(0)}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-foreground">{user.name}</h2>
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mt-1">
                  <span className="flex items-center gap-1">
                    <Mail className="w-4 h-4" />
                    {user.email}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Registered {format(new Date(user.createdAt), 'MMM d, yyyy')}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-warning/10 rounded-lg p-4 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-foreground">Verification Checklist</p>
                <ul className="text-sm text-muted-foreground mt-1 space-y-1">
                  <li>• Ensure the ID is valid and not expired</li>
                  <li>• Check that the photo matches the name provided</li>
                  <li>• Verify the ID is not blurry or tampered with</li>
                  <li>• Confirm both sides of the ID are uploaded</li>
                </ul>
              </div>
            </div>
          </div>

          {/* ID Documents */}
          <div className="card-static p-6 mb-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">ID Documents</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-foreground">Front Side</p>
                  <button 
                    onClick={() => setZoomedImage(user.idCardFront)}
                    className="text-sm text-primary hover:underline flex items-center gap-1"
                  >
                    <ZoomIn className="w-4 h-4" />
                    Enlarge
                  </button>
                </div>
                <div 
                  className="aspect-[3/2] rounded-lg bg-muted overflow-hidden cursor-pointer"
                  onClick={() => setZoomedImage(user.idCardFront)}
                >
                  <img 
                    src={user.idCardFront} 
                    alt="ID Front"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-foreground">Back Side</p>
                  <button 
                    onClick={() => setZoomedImage(user.idCardBack)}
                    className="text-sm text-primary hover:underline flex items-center gap-1"
                  >
                    <ZoomIn className="w-4 h-4" />
                    Enlarge
                  </button>
                </div>
                <div 
                  className="aspect-[3/2] rounded-lg bg-muted overflow-hidden cursor-pointer"
                  onClick={() => setZoomedImage(user.idCardBack)}
                >
                  <img 
                    src={user.idCardBack} 
                    alt="ID Back"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="card-static p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Decision</h3>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button onClick={handleApprove} className="flex-1 gap-2 bg-success hover:bg-success/90">
                <Check className="w-4 h-4" />
                Approve User
              </Button>
              <Button onClick={() => setShowRejectModal(true)} variant="outline" className="flex-1 gap-2">
                <X className="w-4 h-4" />
                Reject Application
              </Button>
            </div>
          </div>
        </div>
      </main>

      {/* Zoom Modal */}
      {zoomedImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/80 backdrop-blur-sm animate-fade-in"
          onClick={() => setZoomedImage(null)}
        >
          <img 
            src={zoomedImage} 
            alt="ID Document"
            className="max-w-full max-h-full object-contain rounded-lg"
          />
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/50 backdrop-blur-sm animate-fade-in">
          <div className="card-static w-full max-w-md p-6 animate-scale-in">
            <h2 className="text-xl font-bold text-foreground mb-2">Reject Application</h2>
            <p className="text-muted-foreground mb-6">
              Please provide a reason for rejection. This will be sent to the user.
            </p>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-foreground mb-2">Reason</label>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                rows={4}
                placeholder="e.g., ID document is blurry and unreadable..."
                className="input-field resize-none"
              />
            </div>

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setShowRejectModal(false)}>
                Cancel
              </Button>
              <Button variant="destructive" className="flex-1" onClick={handleReject}>
                Confirm Rejection
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
