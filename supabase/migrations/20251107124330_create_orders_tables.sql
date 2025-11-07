-- Create orders table
create table if not exists public.orders (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references auth.users(id),
    total_amount decimal(10,2) not null,
    shipping_address text not null,
    status text not null default 'pending',
    payment_status text not null default 'pending',
    payment_id text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create order items table
create table if not exists public.order_items (
    id uuid default gen_random_uuid() primary key,
    order_id uuid references public.orders(id) on delete cascade,
    product_id uuid references public.products(id),
    quantity integer not null,
    price decimal(10,2) not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Add RLS policies
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

-- Allow authenticated users to view their own orders
create policy "Users can view their own orders"
    on public.orders for select
    using (auth.uid() = user_id);

-- Allow authenticated users to create orders
create policy "Users can create orders"
    on public.orders for insert
    with check (auth.uid() = user_id);

-- Allow users to view their order items
create policy "Users can view their order items"
    on public.order_items for select
    using (
        exists(
            select 1 from public.orders
            where orders.id = order_items.order_id
            and orders.user_id = auth.uid()
        )
    );

-- Allow users to create order items
create policy "Users can create order items"
    on public.order_items for insert
    with check (
        exists(
            select 1 from public.orders
            where orders.id = order_items.order_id
            and orders.user_id = auth.uid()
        )
    );