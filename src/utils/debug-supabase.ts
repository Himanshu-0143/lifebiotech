import { supabase } from '@/integrations/supabase/client';

export async function debugSupabase() {
  console.group('🔍 Supabase Debug Info');
  
  try {
    console.log('1. Checking Supabase connection...');
    const { data: health, error: healthError } = await supabase.from('products').select('count');
    
    if (healthError) {
      console.error('❌ Connection failed:', healthError.message);
      if (healthError.message.includes('JWT')) {
        console.warn('⚠️ Possible auth issue. Check VITE_SUPABASE_PUBLISHABLE_KEY in .env');
      }
      return;
    }

    console.log('✅ Connection successful');

    // Try to get one product
    console.log('\n2. Attempting to fetch one product...');
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('*')
      .limit(1)
      .single();

    if (productError) {
      console.error('❌ Failed to fetch product:', productError.message);
      return;
    }

    if (!product) {
      console.warn('⚠️ No products found in database');
    } else {
      console.log('✅ Found product:', {
        id: product.id,
        name: product.name,
        // Show other fields exist
        hasPrice: 'price' in product,
        hasDescription: 'description' in product
      });
    }

    // Get total count
    console.log('\n3. Checking total products...');
    const { count, error: countError } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      console.error('❌ Failed to get count:', countError.message);
    } else {
      console.log(`✅ Total products in database: ${count}`);
    }

  } catch (e) {
    console.error('❌ Unexpected error:', e);
  }

  console.groupEnd();
}

// Run the debug check
debugSupabase();