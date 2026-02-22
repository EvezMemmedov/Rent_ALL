import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Package, User, LogOut, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useLogout } from '@/hooks/useAuth';
import { useAuthStore } from '@/store/authStore';

export function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const logout = useLogout();
  const { isAuthenticated, isAdmin, user } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

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
            {isAuthenticated && user?.status === 'approved' && (
              <>
                <Link to="/browse" className={`nav-link px-4 py-2 rounded-lg ${isActive('/browse') ? 'nav-link-active bg-accent' : ''}`}>
                  Browse
                </Link>
                <Link to="/dashboard" className={`nav-link px-4 py-2 rounded-lg ${isActive('/dashboard') ? 'nav-link-active bg-accent' : ''}`}>
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
                <Link to="/dashboard">
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
              {isAuthenticated && user?.status === 'approved' && (
                <>
                  <Link to="/browse" className="nav-link px-4 py-2 rounded-lg hover:bg-accent">Browse</Link>
                  <Link to="/dashboard" className="nav-link px-4 py-2 rounded-lg hover:bg-accent">Dashboard</Link>
                  <Link to="/my-items" className="nav-link px-4 py-2 rounded-lg hover:bg-accent">My Items</Link>
                  <Link to="/my-rentals" className="nav-link px-4 py-2 rounded-lg hover:bg-accent">My Rentals</Link>
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