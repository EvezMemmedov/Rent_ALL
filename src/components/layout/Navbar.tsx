import { Link, useLocation } from 'react-router-dom';
import { Package, User, LogOut, Menu, X, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useLogout } from '@/hooks/useAuth';
import { useAuthStore } from '@/store/authStore';
import { useUnreadCount } from '@/hooks/useMessages';

export function Navbar() {
  const location = useLocation();
  const logout = useLogout();
  const { isAuthenticated, isAdmin, user } = useAuthStore();
  const { data: unreadData } = useUnreadCount();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;
  const unreadCount = unreadData?.count || 0;

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="sticky top-0 z-50 bg-card/80 backdrop-blur-md border-b border-border">
      <div className="page-container">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
              <Package className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-semibold text-foreground">RentAll</span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            <Link to="/browse" className={`nav-link px-4 py-2 rounded-lg ${isActive('/browse') ? 'nav-link-active bg-accent' : ''}`}>
              Browse
            </Link>
            {isAuthenticated && user?.status === 'approved' && (
              <>
                <Link to={isAdmin ? "/admin" : "/dashboard"} className={`nav-link px-4 py-2 rounded-lg ${isActive(isAdmin ? '/admin' : '/dashboard') ? 'nav-link-active bg-accent' : ''}`}>
                  Dashboard
                </Link>
                <Link to="/my-items" className={`nav-link px-4 py-2 rounded-lg ${isActive('/my-items') ? 'nav-link-active bg-accent' : ''}`}>
                  My Items
                </Link>
                <Link to="/my-rentals" className={`nav-link px-4 py-2 rounded-lg ${isActive('/my-rentals') ? 'nav-link-active bg-accent' : ''}`}>
                  My Rentals
                </Link>
              </>
            )}
            {isAdmin && (
              <Link to="/admin" className={`nav-link px-4 py-2 rounded-lg ${isActive('/admin') ? 'nav-link-active bg-accent' : ''}`}>
                Admin
              </Link>
            )}
          </div>

          <div className="hidden md:flex items-center gap-3">
            {!isAuthenticated ? (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm">Log in</Button>
                </Link>
                <Link to="/register">
                  <Button size="sm">Sign up</Button>
                </Link>
              </>
            ) : (
              <div className="flex items-center gap-3">
                {/* Messages Icon with Badge */}
                <Link to="/messages" className="relative">
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <MessageCircle className="w-5 h-5" />
                  </Button>
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center font-semibold">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </Link>

                <Link to={isAdmin ? "/admin" : "/dashboard"}>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <User className="w-5 h-5" />
                  </Button>
                </Link>
                <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground" onClick={handleLogout}>
                  <LogOut className="w-5 h-5" />
                </Button>
              </div>
            )}
          </div>

          <button className="md:hidden p-2 rounded-lg hover:bg-accent" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border animate-fade-in">
            <div className="flex flex-col gap-2">
              <Link to="/browse" className="nav-link px-4 py-2 rounded-lg hover:bg-accent">Browse</Link>
              {isAuthenticated && user?.status === 'approved' && (
                <>
                  <Link to={isAdmin ? "/admin" : "/dashboard"} className="nav-link px-4 py-2 rounded-lg hover:bg-accent">Dashboard</Link>
                  <Link to="/my-items" className="nav-link px-4 py-2 rounded-lg hover:bg-accent">My Items</Link>
                  <Link to="/my-rentals" className="nav-link px-4 py-2 rounded-lg hover:bg-accent">My Rentals</Link>
                  <Link to="/messages" className="nav-link px-4 py-2 rounded-lg hover:bg-accent flex items-center justify-between">
                    <span>Messages</span>
                    {unreadCount > 0 && (
                      <span className="px-2 py-0.5 bg-destructive text-destructive-foreground text-xs rounded-full font-semibold">
                        {unreadCount}
                      </span>
                    )}
                  </Link>
                </>
              )}
              {isAdmin && (
                <Link to="/admin" className="nav-link px-4 py-2 rounded-lg hover:bg-accent">Admin</Link>
              )}
              {!isAuthenticated ? (
                <div className="flex flex-col gap-2 pt-2 border-t border-border mt-2">
                  <Link to="/login"><Button variant="ghost" className="w-full justify-start">Log in</Button></Link>
                  <Link to="/register"><Button className="w-full">Sign up</Button></Link>
                </div>
              ) : (
                <Button variant="ghost" className="w-full justify-start text-muted-foreground" onClick={handleLogout}>
                  <LogOut className="w-5 h-5 mr-2" />
                  Log out
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}