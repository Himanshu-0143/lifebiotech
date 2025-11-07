-- Create products table
create table if not exists "public"."products" (
    "id" uuid default gen_random_uuid() primary key,
    "name" text not null,
    "description" text not null,
    "composition" text,
    "form" text not null,
    "price" numeric(10,2) not null,
    "stock" int default 0,
    "image_url" text,
    "created_at" timestamp with time zone default timezone('utc'::text, now()),
    "updated_at" timestamp with time zone default timezone('utc'::text, now())
);

-- Add sample products
insert into "public"."products" ("name", "description", "composition", "form", "price", "stock")
values
    ('Paracetamol 500mg', 'Effective pain relief and fever reduction', 'Paracetamol 500mg', 'Tablet', 5.99, 100),
    ('Amoxicillin 250mg', 'Broad-spectrum antibiotic', 'Amoxicillin 250mg', 'Capsule', 12.99, 50),
    ('Ibuprofen 400mg', 'Anti-inflammatory pain relief', 'Ibuprofen 400mg', 'Tablet', 7.99, 75),
    ('Omeprazole 20mg', 'Gastric acid reducer', 'Omeprazole 20mg', 'Capsule', 15.99, 60),
    ('Cetirizine 10mg', 'Antihistamine for allergy relief', 'Cetirizine 10mg', 'Tablet', 8.99, 90);

-- Enable Row Level Security (RLS)
alter table "public"."products" enable row level security;

-- Create policy to allow anyone to view products (no auth required)
create policy "Allow public read access"
    on "public"."products"
    for select
    using (true);

-- Create policy to allow only admins to modify products
create policy "Allow admin write access"
    on "public"."products"
    for all
    using (
        exists (
            select 1 from user_roles
            where user_roles.user_id = auth.uid()
            and user_roles.role = 'admin'
        )
    );