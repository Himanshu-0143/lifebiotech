import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-muted mt-20">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold gradient-text mb-4">Life Biotech</h3>
            <p className="text-muted-foreground text-sm">
              Manufacturing quality medicines for a healthier tomorrow.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <div className="space-y-2">
              <Link to="/" className="block text-sm text-muted-foreground hover:text-primary">
                Home
              </Link>
              <Link to="/products" className="block text-sm text-muted-foreground hover:text-primary">
                Products
              </Link>
              <Link to="/about" className="block text-sm text-muted-foreground hover:text-primary">
                About Us
              </Link>
              <Link to="/contact" className="block text-sm text-muted-foreground hover:text-primary">
                Contact
              </Link>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Customer Service</h4>
            <div className="space-y-2">
              <Link to="/orders" className="block text-sm text-muted-foreground hover:text-primary">
                My Orders
              </Link>
              <Link to="/cart" className="block text-sm text-muted-foreground hover:text-primary">
                Cart
              </Link>
              <Link to="/auth" className="block text-sm text-muted-foreground hover:text-primary">
                Sign In
              </Link>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <div className="space-y-3">
              <div className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 mt-1 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Plot No. 120, Vishwapriya Nagar, Bengur, Bengaluru, Karnataka
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <a href="mailto:info@lifebiotech.org" className="text-sm text-muted-foreground hover:text-primary">
                  info@lifebiotech.org
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <a href="https://www.lifebiotech.org" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-primary">
                  www.lifebiotech.org
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Life Biotech. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
