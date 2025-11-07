import { useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { createPaymentSession } from '@/lib/payment';

export default function Checkout() {
  const { user } = useAuth();
  const { cart, totalAmount, clearCart } = useCart();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!user) navigate('/auth');
    if (cart.length === 0) navigate('/cart');
  }, [user, cart, navigate]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    try {
      setIsProcessing(true);
      
      // 1. Create order in Supabase
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user?.id,
          total_amount: totalAmount,
          shipping_address: formData.get('address')?.toString() || '',
          status: 'pending',
          payment_status: 'pending'
        })
        .select()
        .single();

      if (orderError) throw new Error(orderError.message);

      // 2. Create order items
      // The products table expects product_id to be a UUID (from DB). Cart items
      // may contain local product slugs/names (e.g., 'Lifer-XT'). Attempt to
      // resolve to the DB product id first; if item.id already looks like a UUID,
      // use it directly.
      const isUUID = (s: string) => /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(s);

      const resolvedOrderItems = [] as Array<{ order_id: string; product_id: string; quantity: number; price: number }>;

      for (const item of cart) {
        let productId = item.id;

        if (!isUUID(productId)) {
          // Try to find the product in the database by name or original id
          const { data: prodData, error: prodError } = await supabase
            .from('products')
            .select('id')
            .or(`name.eq.${item.name},name.eq.${item.id}`)
            .limit(1)
            .single();

          if (prodError) {
            console.warn('Product lookup failed:', { item, error: prodError });
            
            // Try another lookup with exact match
            const { data: retryData, error: retryError } = await supabase
              .from('products')
              .select('id')
              .eq('name', item.name)
              .limit(1)
              .single();

            if (retryError || !retryData) {
              throw new Error(`Product not found: ${item.name}. Please try adding the product to cart again.`);
            }
            
            productId = retryData.id;
          } else if (prodData && prodData.id) {
            productId = prodData.id;
          } else {
            // If we couldn't resolve a DB id, throw a clear error
            throw new Error(`Product not available: ${item.name}. Please remove it from cart and try again.`);
          }
        }

        resolvedOrderItems.push({
          order_id: order.id,
          product_id: productId,
          quantity: item.quantity,
          price: item.price,
        });
      }

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(resolvedOrderItems);

      if (itemsError) throw new Error(itemsError.message);

      // 3. Create Razorpay order and open checkout
      await createPaymentSession({
        amount: totalAmount,
        metadata: {
          order_id: order.id,
          user_id: user?.id,
          shipping_address: `${formData.get('address')}, ${formData.get('city')}, ${formData.get('pincode')}`
        },
        onSuccess: async (resp) => {
          // Update order as paid in Supabase
          try {
            await supabase
              .from('orders')
              .update({ payment_status: 'paid', payment_id: resp.razorpay_payment_id })
              .eq('id', order.id);
          } catch (e) {
            console.error('Failed to update order after payment:', e);
          }
          // Clear cart and navigate to orders page
          clearCart();
          navigate('/orders');
        },
        onError: (err) => {
          throw err;
        }
      });
      
    } catch (error) {
      console.error('Checkout error:', error);
      toast({
        title: 'Checkout failed',
        description: error instanceof Error ? error.message : 'Please try again',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container-custom py-12 max-w-2xl">
      <h1 className="text-4xl font-bold mb-8">Checkout</h1>
      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Shipping Address</Label>
              <Input name="address" placeholder="Full address" required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>City</Label>
                <Input name="city" placeholder="City" required />
              </div>
              <div>
                <Label>Pincode</Label>
                {/* Restrict pincode input to numeric characters only (max 6 digits) */}
                <Input
                  name="pincode"
                  placeholder="Pincode"
                  required
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={6}
                  onInput={(e: any) => {
                    // Remove any non-digit characters as the user types/pastes
                    const el = e.currentTarget as HTMLInputElement;
                    const cleaned = el.value.replace(/\D+/g, '');
                    if (el.value !== cleaned) el.value = cleaned;
                  }}
                />
              </div>
            </div>
            <div className="border-t pt-4">
              <div className="flex justify-between text-xl font-bold">
                <span>Total</span>
                <span className="text-primary">₹{totalAmount.toFixed(2)}</span>
              </div>
            </div>
            <Button type="submit" className="w-full btn-primary" size="lg">
              Place Order & Pay ₹{totalAmount.toFixed(2)}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
