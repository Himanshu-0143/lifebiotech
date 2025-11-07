-- Create products table if it doesn't exist
create table if not exists public.products (
    id uuid default gen_random_uuid() primary key,
    name text not null unique,
    form text,
    description text,
    composition text,
    price numeric(10,2) not null,
    manufacturer text,
    stock_quantity integer default 0,
    category text,
    image_url text,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- Create function to update updated_at timestamp
create or replace function update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

-- Create trigger for updated_at
create trigger set_timestamp
    before update on products
    for each row
    execute procedure update_updated_at_column();

-- Insert initial products
insert into public.products (name, form, description, composition, price, manufacturer, stock_quantity, category, image_url)
values
    ('D3Life-60K', 'Capsule', 'High-potency Vitamin D3 supplement for bone health and immunity', 'Cholecalciferol (Vitamin D3) 60,000 IU', 120.00, 'LifeBiotech Pharmaceuticals', 500, 'Supplements', '/medicines/d3life-60k.jpg'),
    ('Templow-TH4', 'Tablet', 'Pain relief and inflammation reduction medication', 'Aceclofenac 100mg & Thiocolchicoside 4mg', 89.99, 'LifeBiotech Pharmaceuticals', 150, 'Pain Relief', '/medicines/templow-th4.jpg'),
    ('Life Vit 9G', 'Syrup', 'Complete multivitamin syrup with minerals and antioxidants', null, 195.00, 'LifeBiotech Pharmaceuticals', 300, 'Supplements', '/medicines/life-vit-9g.jpg'),
    ('Templow-TH8', 'Tablet', 'Strong pain relief for severe muscular and joint pain', null, 125.00, 'LifeBiotech Pharmaceuticals', 750, 'Pain Relief', '/medicines/templow-th8.jpg'),
    ('Life Vit', 'Syrup', 'General multivitamin syrup for daily health maintenance', null, 145.00, 'LifeBiotech Pharmaceuticals', 400, 'Supplements', '/medicines/life-vit.jpg'),
    ('KALCI-GOLD', 'Tablet', 'High-strength calcium supplement with Vitamin D3', null, 180.00, 'LifeBiotech Pharmaceuticals', 600, 'Supplements', '/medicines/kalci-gold.jpg')
on conflict (name) do update set
    form = excluded.form,
    description = excluded.description,
    composition = excluded.composition,
    price = excluded.price,
    manufacturer = excluded.manufacturer,
    stock_quantity = excluded.stock_quantity,
    category = excluded.category,
    image_url = excluded.image_url,
    updated_at = now();

-- Enable RLS
alter table public.products enable row level security;

-- Create policy to allow anonymous read access
create policy "Allow anonymous read access"
    on public.products
    for select
    to anon
    using (true);

-- Create policy to allow authenticated users to read
create policy "Allow authenticated read access"
    on public.products
    for select
    to authenticated
    using (true);