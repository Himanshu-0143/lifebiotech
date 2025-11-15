import { createContext, useContext, useState, useEffect } from 'react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  form: string;
}

interface CartData {
  items: CartItem[];
  timestamp: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalAmount: number;
  totalItems: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Cart expiration time: 24 hours (in milliseconds)
const CART_EXPIRATION_TIME = 24 * 60 * 60 * 1000;

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const savedCartData = localStorage.getItem('life-biotech-cart');
      if (!savedCartData) return [];

      const cartData: CartData = JSON.parse(savedCartData);
      
      // Check if cart has expired (older than 24 hours)
      const now = Date.now();
      const timeDiff = now - (cartData.timestamp || 0);
      
      if (timeDiff > CART_EXPIRATION_TIME) {
        // Cart expired, clear it
        localStorage.removeItem('life-biotech-cart');
        return [];
      }

      return cartData.items || [];
    } catch (error) {
      console.error('Error loading cart:', error);
      localStorage.removeItem('life-biotech-cart');
      return [];
    }
  });

  useEffect(() => {
    // Save cart with timestamp
    const cartData: CartData = {
      items: cart,
      timestamp: Date.now(),
    };
    localStorage.setItem('life-biotech-cart', JSON.stringify(cartData));
  }, [cart]);

  const addToCart = (product: Omit<CartItem, 'quantity'>) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('life-biotech-cart');
  };

  const totalAmount = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Periodic check for expired cart (every 5 minutes)
  useEffect(() => {
    const checkExpiration = () => {
      try {
        const savedCartData = localStorage.getItem('life-biotech-cart');
        if (!savedCartData) return;

        const cartData: CartData = JSON.parse(savedCartData);
        const now = Date.now();
        const timeDiff = now - (cartData.timestamp || 0);

        if (timeDiff > CART_EXPIRATION_TIME) {
          // Cart expired, clear it
          clearCart();
        }
      } catch (error) {
        console.error('Error checking cart expiration:', error);
      }
    };

    // Check immediately
    checkExpiration();

    // Check every 5 minutes
    const intervalId = setInterval(checkExpiration, 5 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalAmount,
        totalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
