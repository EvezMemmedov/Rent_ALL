import { Link } from 'react-router-dom';
import { ChevronLeft, Clock, Mail, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/layout/Navbar';
import { mockPendingUsers } from '@/data/mockData';
import { format } from 'date-fns';

export default function PendingUsers() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar isAuthenticated={true} userStatus="approved" isAdmin={true} />
      
      <main className="py-8">
        <div className="page-container max-w-4xl">
          {/* Header */}
          <Link to="/admin" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
            <ChevronLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>

          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Pending Verifications</h1>
            <p className="text-muted-foreground">Review and verify user ID documents</p>
          </div>

          {/* Users List */}
          {mockPendingUsers.length > 0 ? (
            <div className="space-y-4">
              {mockPendingUsers.map((user) => (
                <div key={user.id} className="card-static p-6">
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xl font-semibold shrink-0">
                      {user.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
                        <h3 className="text-lg font-semibold text-foreground">{user.name}</h3>
                        <span className="status-badge status-pending">Pending Review</span>
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Mail className="w-4 h-4" />
                          {user.email}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          Submitted {format(new Date(user.createdAt), 'MMM d, yyyy')}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* ID Preview */}
                  <div className="grid sm:grid-cols-2 gap-4 mt-4">
                    <div>
                      <p className="text-sm font-medium text-foreground mb-2">ID Card - Front</p>
                      <div className="aspect-[3/2] rounded-lg bg-muted overflow-hidden">
                        <img 
                          src={user.idCardFront} 
                          alt="ID Front"
                          className="w-full h-full object-cover blur-sm hover:blur-none transition-all cursor-pointer"
                        />
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground mb-2">ID Card - Back</p>
                      <div className="aspect-[3/2] rounded-lg bg-muted overflow-hidden">
                        <img 
                          src={user.idCardBack} 
                          alt="ID Back"
                          className="w-full h-full object-cover blur-sm hover:blur-none transition-all cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 mt-6 pt-4 border-t border-border">
                    <Link to={`/admin/verify-user/${user.id}`}>
                      <Button className="gap-2">
                        <Shield className="w-4 h-4" />
                        Review Details
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Shield className="w-12 h-12 text-success mx-auto mb-4" />
              <p className="text-lg font-medium text-foreground mb-2">All caught up!</p>
              <p className="text-muted-foreground">No pending verifications at this time.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
