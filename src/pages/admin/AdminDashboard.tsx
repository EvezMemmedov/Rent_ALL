import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Users, Package, DollarSign, AlertTriangle, ArrowRight, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/layout/Navbar';
import { useAdminReports, usePendingUsers } from '@/hooks/useAdmin';
import { useAuthStore } from '@/store/authStore';
import { format } from 'date-fns';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { isAdmin, isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      navigate('/login');
    }
  }, [isAuthenticated, isAdmin, navigate]);

  const { data: reports, isLoading: reportsLoading } = useAdminReports();
  const { data: pendingData, isLoading: pendingLoading } = usePendingUsers();

  const pendingUsers = pendingData?.users || [];

  const stats = [
    {
      label: 'Total Users',
      value: reportsLoading ? '...' : String(reports?.users?.total || 0),
      icon: Users,
      change: `${reports?.users?.pending || 0} pending`,
      positive: true,
    },
    {
      label: 'Active Listings',
      value: reportsLoading ? '...' : String(reports?.items?.available || 0),
      icon: Package,
      change: `${reports?.items?.rented || 0} rented`,
      positive: true,
    },
    {
      label: 'Total Revenue',
      value: reportsLoading ? '...' : `$${reports?.revenue?.total?.toFixed(0) || 0}`,
      icon: DollarSign,
      change: `${reports?.rentals?.completed || 0} completed`,
      positive: true,
    },
    {
      label: 'Pending Verifications',
      value: reportsLoading ? '...' : String(reports?.users?.pending || 0),
      icon: AlertTriangle,
      change: 'Waiting review',
      positive: false,
    },
  ];

  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="py-8">
        <div className="page-container">
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage users, listings, and platform settings</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat) => (
              <div key={stat.label} className="card-static p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
                    <stat.icon className="w-5 h-5 text-primary" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-foreground mb-1">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className={`text-xs mt-1 ${stat.positive ? 'text-success' : 'text-warning'}`}>
                  {stat.change}
                </p>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-foreground">Pending Verifications</h2>
                <Link to="/admin/pending-users" className="text-sm text-primary hover:underline flex items-center gap-1">
                  View all <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
              <div className="space-y-3">
                {pendingLoading ? (
                  <p className="text-muted-foreground text-sm">Loading...</p>
                ) : pendingUsers.length === 0 ? (
                  <div className="card-static p-6 text-center">
                    <p className="text-muted-foreground text-sm">No pending users</p>
                  </div>
                ) : (
                  pendingUsers.slice(0, 3).map((user: any) => (
                    <div key={user.id} className="card-static p-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold">
                          {user.name.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-foreground">{user.name}</h3>
                          <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                        </div>
                        <div className="text-right">
                          <span className="status-badge status-pending mb-1">Pending</span>
                          <p className="text-xs text-muted-foreground flex items-center gap-1 justify-end">
                            <Clock className="w-3 h-3" />
                            {user.createdAt ? format(new Date(user.createdAt), 'MMM d') : 'N/A'}
                          </p>
                        </div>
                      </div>
                      <div className="mt-3">
                        <Link to={`/admin/verify-user/${user.id}`}>
                          <Button size="sm" className="w-full">Review</Button>
                        </Link>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h2>
              <div className="grid gap-3">
                <Link to="/admin/pending-users" className="card-elevated p-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                    <Users className="w-5 h-5 text-warning" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-foreground">Review Pending Users</h3>
                    <p className="text-sm text-muted-foreground">{pendingUsers.length} users waiting</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-muted-foreground" />
                </Link>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}