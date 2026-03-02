import { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Mail, Calendar, Check, X, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/layout/Navbar';
import { useAdminUser, useVerifyUser } from '@/hooks/useAdmin';
import { format } from 'date-fns';

export default function VerifyUser() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);

  const { data, isLoading } = useAdminUser(userId!);
  const verifyUser = useVerifyUser();
  const user = data?.user;

  const handleApprove = () => {
    verifyUser.mutate(
      { userId: Number(userId), action: 'approve' },
      { onSuccess: () => navigate('/admin/pending-users') }
    );
  };

  const handleReject = () => {
    verifyUser.mutate(
      { userId: Number(userId), action: 'reject' },
      { onSuccess: () => navigate('/admin/pending-users') }
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="py-8">
          <div className="page-container max-w-4xl">
            <p className="text-muted-foreground">Yüklənir...</p>
          </div>
        </main>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="py-8">
          <div className="page-container max-w-4xl">
            <p className="text-destructive">İstifadəçi tapılmadı.</p>
            <Link to="/admin/pending-users" className="text-primary hover:underline mt-2 inline-block">
              Geri qayıt
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="py-8">
        <div className="page-container max-w-4xl">
          <Link to="/admin/pending-users" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
            <ChevronLeft className="w-4 h-4" />
            Back to Pending Users
          </Link>

          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">User Verification</h1>
            <p className="text-muted-foreground">Review the user's submitted documents</p>
          </div>

          {/* User Info */}
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
                </ul>
              </div>
            </div>
          </div>

          {/* ID Documents */}
          <div className="card-static p-6 mb-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">ID Documents</h3>
            {user.idCardFront || user.idCardBack ? (
              <div className="grid md:grid-cols-2 gap-6">
                {user.idCardFront && (
                  <div>
                    <p className="text-sm font-medium text-foreground mb-2">Front Side</p>
                    <div
                      className="aspect-[3/2] rounded-lg bg-muted overflow-hidden cursor-pointer"
                      onClick={() => setZoomedImage(`http://127.0.0.1:5000${user.idCardFront}`)}
                    >
                      <img
                        src={`http://127.0.0.1:5000${user.idCardFront}`}
                        alt="ID Front"
                        className="w-full h-full object-cover hover:opacity-90 transition-opacity"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Böyütmək üçün klik et</p>
                  </div>
                )}
                {user.idCardBack && (
                  <div>
                    <p className="text-sm font-medium text-foreground mb-2">Back Side</p>
                    <div
                      className="aspect-[3/2] rounded-lg bg-muted overflow-hidden cursor-pointer"
                      onClick={() => setZoomedImage(`http://127.0.0.1:5000${user.idCardBack}`)}
                    >
                      <img
                        src={`http://127.0.0.1:5000${user.idCardBack}`}
                        alt="ID Back"
                        className="w-full h-full object-cover hover:opacity-90 transition-opacity"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Böyütmək üçün klik et</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>Bu istifadəçi ID şəkli yükləməyib.</p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="card-static p-6">
            <h3 className="text-lg font-semibold text-foreground mb-2">Decision</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Status: <span className="font-medium capitalize">{user.status}</span>
            </p>

            {verifyUser.isError && (
              <div className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                {(verifyUser.error as any)?.response?.data?.message || 'Xəta baş verdi.'}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={handleApprove}
                className="flex-1 gap-2 bg-success hover:bg-success/90"
                disabled={verifyUser.isPending || user.status === 'approved'}
              >
                <Check className="w-4 h-4" />
                {verifyUser.isPending ? 'Gözləyin...' : 'Approve User'}
              </Button>
              <Button
                onClick={() => setShowRejectModal(true)}
                variant="outline"
                className="flex-1 gap-2"
                disabled={verifyUser.isPending || user.status === 'blocked'}
              >
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
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/80 backdrop-blur-sm"
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
              Bu istifadəçinin müraciəti rədd ediləcək.
            </p>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setShowRejectModal(false)}>
                Cancel
              </Button>
              <Button variant="destructive" className="flex-1" onClick={handleReject} disabled={verifyUser.isPending}>
                {verifyUser.isPending ? 'Gözləyin...' : 'Confirm Rejection'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}