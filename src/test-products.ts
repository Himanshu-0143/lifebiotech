import { supabase } from './integrations/supabase/client';

async function testProductsQuery() {
  console.log('Testing products table access...');
  
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .limit(1);
    
  if (error) {
    console.error('Error accessing products:', error);
    return;
  }
  
  console.log('Successfully queried products table');
  console.log('Number of products found:', data?.length);
  if (data?.length > 0) {
    console.log('Sample product:', data[0]);
  }
}

testProductsQuery();