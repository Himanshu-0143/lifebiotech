-- Create products table
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  composition TEXT,
  form TEXT NOT NULL, -- Tablet, Injection, Syrup, etc
  price DECIMAL(10,2) NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  phone TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  pincode TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create orders table
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  total_amount DECIMAL(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending', -- pending, processing, shipped, delivered, cancelled
  payment_status TEXT NOT NULL DEFAULT 'pending', -- pending, completed, failed
  payment_id TEXT,
  shipping_address TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create order_items table
CREATE TABLE public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id),
  quantity INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create user_roles table for admin access
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Function to check user role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Enable RLS on all tables
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for products (public read, admin write)
CREATE POLICY "Products are viewable by everyone"
  ON public.products FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert products"
  ON public.products FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update products"
  ON public.products FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete products"
  ON public.products FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for profiles
CREATE POLICY "Profiles are viewable by owner"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- RLS Policies for orders
CREATE POLICY "Users can view their own orders"
  ON public.orders FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all orders"
  ON public.orders FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can create their own orders"
  ON public.orders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can update all orders"
  ON public.orders FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for order_items
CREATE POLICY "Users can view their own order items"
  ON public.order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all order items"
  ON public.order_items FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can create order items for their orders"
  ON public.order_items FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );

-- RLS Policies for user_roles
CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
  ON public.user_roles FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage roles"
  ON public.user_roles FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Function to automatically create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (new.id, new.email);
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (new.id, 'user');
  
  RETURN new;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert initial products based on Life Biotech product range
INSERT INTO public.products (name, description, composition, form, price, stock) VALUES
  ('D3Life-60K', 'High potency Vitamin D3 supplement for bone health and immunity', 'Cholecalciferol 60000 IU', 'Softgel Capsule', 120.00, 500),
  ('Life Vit 9G', 'Comprehensive multivitamin supplement', 'Vitamins, Minerals, Zinc', 'Softgel Capsule', 199.00, 450),
  ('Life Vit Syrup', 'Multivitamin and multimineral syrup (Sugar Free)', 'Lycopene, Multivitamin, Multimineral', 'Syrup', 145.00, 300),
  ('RALCI-GOLD', 'Complete bone health supplement with Calcium and Vitamin D3', 'Calcium Citrate 1250mg, Vitamin D3 1000 IU, Methylcobalamin 1500mcg, Zinc 4mg', 'Tablets', 285.00, 400),
  ('Methypre-NT', 'Effective neuropathic pain management', 'Pregabalin, Nortriptyline & Mecobalamin', 'Tablets', 320.00, 250),
  ('Lifepan-40', 'Gastro-resistant proton pump inhibitor for acidity', 'Pantoprazole IP 40mg', 'Tablets', 95.00, 600),
  ('RG Care', 'Comprehensive health supplement', 'Calcitriol, Calcium Carbonate, Omega-3, Methylcobalamin, Vitamin K2-7, Boron, Zinc', 'Tablet', 275.00, 350),
  ('KG.Cort-6', 'Anti-inflammatory corticosteroid', 'Deflazacort 6mg', 'Tablets', 185.00, 200),
  ('Templow-TH4', 'Effective pain and inflammation relief', 'Aceclofenac 100mg & Thiocolchicoside 4mg', 'Tablet', 135.00, 500),
  ('Templow-TH8', 'Enhanced pain and muscle relaxation therapy', 'Aceclofenac 100mg & Thiocolchicoside 8mg', 'Tablet', 165.00, 450),
  ('Templow-AP', 'Dual action pain and fever relief', 'Aceclofenac 100mg & Paracetamol 325mg', 'Tablet', 125.00, 550),
  ('Templow-SP', 'Triple action anti-inflammatory formula', 'Aceclofenac 100mg, Paracetamol 325mg & Serratiopeptidase 15mg', 'Tablet', 195.00, 480),
  ('Orthokg Oil', 'Topical pain relief oil for joint and muscle pain', 'Diclofenac Diethylamine, Methyl Salicylate & Menthol', 'Oil', 210.00, 300),
  ('LMox-CV.LB', 'Broad spectrum antibiotic with probiotic protection', 'Amoxicillin 500mg, Clavulanic Acid 125mg & Lactic Acid Bacillus', 'Tablet', 245.00, 400),
  ('Lifefer-XT Tablet', 'Iron supplement for anemia prevention', 'Ferrous Ascorbate 100mg + Folic Acid 1500mcg', 'Tablet', 155.00, 450),
  ('Lifefer-XT Syrup', 'Liquid iron supplement for better absorption', 'Ferrous Ascorbate 100mg + Folic Acid 1500mcg', 'Syrup', 165.00, 320),
  ('PN-40 Injection', 'Injectable proton pump inhibitor for severe acidity', 'Pantoprazole 40mg', 'Injection', 85.00, 250),
  ('Life-Cef Injection', 'Powerful broad-spectrum injectable antibiotic', 'Cefoperazone & Sulbactam 1.5gm', 'Injection', 395.00, 200);

-- Create an admin user note: You'll need to manually assign admin role after first user signup