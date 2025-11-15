import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Shield, Menu, X, UserCircle, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export const Header = () => {
  const { user, isAdmin, signOut } = useAuth();
  const { totalItems, clearCart } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const handleSignOut = async () => {
    await signOut();
    clearCart(); // Clear cart when user signs out
  };

  const NavLink = ({ to, children }: { to: string; children: React.ReactNode }) => (
    <Link
      to={to}
      className={`text-foreground hover:text-primary transition-all font-medium relative group ${
        isActive(to) ? 'text-primary' : ''
      }`}
      onClick={() => setMobileMenuOpen(false)}
    >
      {children}
      <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full ${
        isActive(to) ? 'w-full' : ''
      }`}></span>
    </Link>
  );

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b shadow-sm">
      <nav className="container-custom py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 bg-gradient-hero rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform shadow-md">
              <span className="text-xl font-bold text-white">LB</span>
            </div>
            <span className="text-xl sm:text-2xl font-bold gradient-text">Life Biotech</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <NavLink to="/">Home</NavLink>
            <NavLink to="/products">Products</NavLink>
            <NavLink to="/about">About</NavLink>
            <NavLink to="/contact">Contact</NavLink>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-4">
            <Link to="/cart">
              <Button variant="ghost" size="icon" className="relative hover:bg-primary/10">
                <ShoppingCart className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center animate-scale-in font-bold shadow-md">
                    {totalItems}
                  </span>
                )}
              </Button>
            </Link>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="hover:bg-primary/10">
                    <User className="w-5 h-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="cursor-pointer">
                      <UserCircle className="w-4 h-4 mr-2" />
                      My Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/orders" className="cursor-pointer">
                      <Package className="w-4 h-4 mr-2" />
                      My Orders
                    </Link>
                  </DropdownMenuItem>
                  {isAdmin && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link to="/admin" className="cursor-pointer">
                          <Shield className="w-4 h-4 mr-2" />
                          Admin Dashboard
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/auth">
                <Button className="hidden sm:flex shadow-md hover:shadow-lg">Sign In</Button>
                <Button size="sm" className="flex sm:hidden">Sign In</Button>
              </Link>
            )}

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden hover:bg-primary/10"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-3 animate-fade-in">
            <Link
              to="/"
              className={`block py-2 px-4 rounded-lg hover:bg-primary/10 transition-colors ${
                isActive('/') ? 'bg-primary/10 text-primary font-semibold' : ''
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/products"
              className={`block py-2 px-4 rounded-lg hover:bg-primary/10 transition-colors ${
                isActive('/products') ? 'bg-primary/10 text-primary font-semibold' : ''
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Products
            </Link>
            <Link
              to="/about"
              className={`block py-2 px-4 rounded-lg hover:bg-primary/10 transition-colors ${
                isActive('/about') ? 'bg-primary/10 text-primary font-semibold' : ''
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link
              to="/contact"
              className={`block py-2 px-4 rounded-lg hover:bg-primary/10 transition-colors ${
                isActive('/contact') ? 'bg-primary/10 text-primary font-semibold' : ''
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
};
