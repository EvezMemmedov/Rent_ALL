import { Users, Package, DollarSign, AlertTriangle, ArrowRight, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/layout/Navbar';
import { mockPendingUsers } from '@/data/mockData';
import { format } from 'date-fns';

const stats = [
  { label: 'Total Users', value: '2,453', icon: Users, change: '+12%', positive: true },
  { label: 'Active Listings', value: '1,287', icon: Package, change: '+8%', positive: true },
  { label: 'Monthly Revenue', value: '$45,230', icon: DollarSign, change: '+23%', positive: true },
  { label: 'Pending Verifications', value: mockPendingUsers.length.toString(), icon: AlertTriangle, change: '3 new', positive: false },
];

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar isAuthenticated={true} userStatus="approved" isAdmin={true} />
      
      <main className="py-8">
        <div className="page-container">
          {/* Header */}
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
            {/* Pending Verifications */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-foreground">Pending Verifications</h2>
                <Link to="/admin/pending-users" className="text-sm text-primary hover:underline flex items-center gap-1">
                  View all <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
              <div className="space-y-3">
                {mockPendingUsers.map((user) => (
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
                          {format(new Date(user.createdAt), 'MMM d')}
                        </p>
                      </div>
                    </div>
                    <div className="mt-3 flex gap-2">
                      <Link to={`/admin/verify-user/${user.id}`} className="flex-1">
                        <Button size="sm" className="w-full">Review</Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Quick Actions */}
            <section>
              <h2 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h2>
              <div className="grid gap-3">
                <Link to="/admin/pending-users" className="card-elevated p-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                    <Users className="w-5 h-5 text-warning" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-foreground">Review Pending Users</h3>
                    <p className="text-sm text-muted-foreground">{mockPendingUsers.length} users waiting for verification</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-muted-foreground" />
                </Link>
                
                <div className="card-elevated p-4 flex items-center gap-4 opacity-60">
                  <div className="w-10 h-10 rounded-lg bg-info/10 flex items-center justify-center">
                    <Package className="w-5 h-5 text-info" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-foreground">Manage Listings</h3>
                    <p className="text-sm text-muted-foreground">Review and moderate item listings</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-muted-foreground" />
                </div>

                <div className="card-elevated p-4 flex items-center gap-4 opacity-60">
                  <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-destructive" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-foreground">View Reports</h3>
                    <p className="text-sm text-muted-foreground">Handle user reports and disputes</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-muted-foreground" />
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
