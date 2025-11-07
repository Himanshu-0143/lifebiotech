import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, ShoppingCart } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import { slugify } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { medicines } from '@/data/medicines';
import { Medicine } from '@/types/medicine';

export default function Products() {
  const [searchQuery, setSearchQuery] = useState('');
  const { addToCart } = useCart();
  const { toast } = useToast();

  // First try to get products from Supabase
  const { data: supabaseProducts, isLoading, error } = useQuery({
    queryKey: ['products', searchQuery],
    queryFn: async () => {
      console.log('Fetching products from Supabase...');
      let query = supabase
        .from('products')
        .select('*');
      
      if (searchQuery) {
        query = query.or(`name.ilike.%${searchQuery}%,composition.ilike.%${searchQuery}%`);
      }

      const { data, error } = await query;
      console.log('Supabase query result:', { data, error });
      
      if (error) {
        console.error('Supabase query error:', error);
        return null;
      }
      return data;
    },
  });

  // Fallback to local data if Supabase fails or returns empty
  const products = supabaseProducts?.length ? supabaseProducts : medicines;
  console.log('Using products:', products);

  const filteredProducts = products?.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.composition?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  // Helper function to get stock quantity regardless of data source
  const getStock = (product: any): number => {
    return product.stock ?? product.stockQuantity ?? 0;
  };

  const handleAddToCart = (product: any) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: typeof product.price === 'string' ? parseFloat(product.price) : product.price,
      form: product.form,
    });
    toast({
      title: 'Added to cart',
      description: `${product.name} has been added to your cart.`,
    });
  };



  // Add warning if products array is empty
  if (!products?.length) {
    console.warn('Products array is empty. This might indicate a database issue or no products in the table.');
  }

  return (
    <div className="container-custom py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Our Products</h1>
        <p className="text-muted-foreground mb-6">
          Explore our comprehensive range of quality pharmaceutical products
        </p>
        
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
          <Input
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts?.map((product) => (
          <Card key={product.id} className="card-hover overflow-hidden border-0 shadow-card">
            <div className="bg-gradient-primary h-24"></div>
            <CardContent className="pt-6">
              <h3 className="font-bold text-lg mb-1">{product.name}</h3>
              <p className="text-sm text-muted-foreground mb-2">{product.form}</p>
              <p className="text-xs text-muted-foreground mb-4 line-clamp-2">
                {product.composition}
              </p>
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl font-bold text-primary">₹{product.price}</span>
                <span className="text-sm text-muted-foreground">
                  Stock: {getStock(product)}
                </span>
              </div>
              <div className="flex gap-2">
                <Link 
                  to={`/products/${encodeURIComponent(slugify(product.id))}`} 
                  className="flex-1"
                >
                  <Button variant="outline" className="w-full">
                    Details
                  </Button>
                </Link>
                <Button
                  onClick={() => handleAddToCart(product)}
                  disabled={getStock(product) === 0}
                  className="flex-1"
                >
                  <ShoppingCart className="w-4 h-4 mr-1" />
                  Add
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProducts?.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No products found matching your search.</p>
        </div>
      )}
    </div>
  );
}
