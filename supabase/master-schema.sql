-- Restaurant QR Ordering SaaS - Supabase Database Setup
-- Run this SQL in your Supabase SQL Editor to set up the database schema

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Restaurants table
create table restaurants (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  currency text not null default '$',
  is_open boolean not null default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Tables table
create table tables (
  id uuid primary key default uuid_generate_v4(),
  restaurant_id uuid references restaurants(id) on delete cascade not null,
  table_number integer not null,
  qr_code_id text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(restaurant_id, table_number)
);

-- Categories table
create table categories (
  id uuid primary key default uuid_generate_v4(),
  restaurant_id uuid references restaurants(id) on delete cascade not null,
  name text not null,
  sort_order integer not null default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Menu items table
create table menu_items (
  id uuid primary key default uuid_generate_v4(),
  restaurant_id uuid references restaurants(id) on delete cascade not null,
  category_id uuid references categories(id) on delete set null,
  name text not null,
  description text,
  price numeric(10, 2) not null,
  image_url text,
  allergens text,
  prep_time integer not null default 15,
  is_available boolean not null default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Orders table
create table orders (
  id uuid primary key default uuid_generate_v4(),
  restaurant_id uuid references restaurants(id) on delete cascade not null,
  table_id uuid references tables(id) on delete set null,
  status text not null default 'new' check (status in ('new', 'preparing', 'ready', 'delivered')),
  order_type text not null default 'dinein' check (order_type in ('dinein', 'takeout', 'delivery')),
  customer_name text,
  customer_phone text,
  customer_email text,
  delivery_address text,
  delivery_instructions text,
  notes text,
  total numeric(10, 2) not null default 0,
  order_number text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Order items table
create table order_items (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid references orders(id) on delete cascade not null,
  menu_item_id uuid references menu_items(id) on delete set null,
  quantity integer not null default 1,
  price_at_time_of_order numeric(10, 2) not null
);

-- Help requests table
create table help_requests (
  id uuid primary key default uuid_generate_v4(),
  restaurant_id uuid references restaurants(id) on delete cascade not null,
  table_id uuid references tables(id) on delete cascade not null,
  status text not null default 'pending' check (status in ('pending', 'dismissed')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Staff/Restaurant relationship table
create table restaurant_staff (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  restaurant_id uuid references restaurants(id) on delete cascade not null,
  role text not null default 'staff' check (role in ('admin', 'staff')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, restaurant_id)
);

-- Create indexes for better performance
create index idx_tables_restaurant on tables(restaurant_id);
create index idx_categories_restaurant on categories(restaurant_id);
create index idx_menu_items_restaurant on menu_items(restaurant_id);
create index idx_menu_items_category on menu_items(category_id);
create index idx_orders_restaurant on orders(restaurant_id);
create index idx_orders_table on orders(table_id);
create index idx_orders_status on orders(status);
create index idx_order_items_order on order_items(order_id);
create index idx_help_requests_restaurant on help_requests(restaurant_id);
create index idx_help_requests_status on help_requests(status);
create index idx_restaurant_staff_user on restaurant_staff(user_id);
create index idx_restaurant_staff_restaurant on restaurant_staff(restaurant_id);

-- Enable Row Level Security
alter table restaurants enable row level security;
alter table tables enable row level security;
alter table categories enable row level security;
alter table menu_items enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;
alter table help_requests enable row level security;
alter table restaurant_staff enable row level security;

-- RLS Policies for restaurants
create policy "Staff can view their restaurants"
  on restaurants for select
  using (
    id in (
      select restaurant_id from restaurant_staff
      where user_id = auth.uid()
    )
  );

create policy "Admins can update their restaurants"
  on restaurants for update
  using (
    id in (
      select restaurant_id from restaurant_staff
      where user_id = auth.uid() and role = 'admin'
    )
  );

-- RLS Policies for tables
create policy "Staff can view tables"
  on tables for select
  using (
    restaurant_id in (
      select restaurant_id from restaurant_staff
      where user_id = auth.uid()
    )
  );

create policy "Admins can manage tables"
  on tables for all
  using (
    restaurant_id in (
      select restaurant_id from restaurant_staff
      where user_id = auth.uid() and role = 'admin'
    )
  );

-- RLS Policies for categories
create policy "Anyone can view categories"
  on categories for select
  using (true);

create policy "Admins can manage categories"
  on categories for all
  using (
    restaurant_id in (
      select restaurant_id from restaurant_staff
      where user_id = auth.uid() and role = 'admin'
    )
  );

-- RLS Policies for menu_items
create policy "Anyone can view available menu items"
  on menu_items for select
  using (true);

create policy "Admins can manage menu items"
  on menu_items for all
  using (
    restaurant_id in (
      select restaurant_id from restaurant_staff
      where user_id = auth.uid() and role = 'admin'
    )
  );

-- RLS Policies for orders
create policy "Staff can view orders"
  on orders for select
  using (
    restaurant_id in (
      select restaurant_id from restaurant_staff
      where user_id = auth.uid()
    )
  );

create policy "Customers can create orders"
  on orders for insert
  with check (true);

create policy "Staff can update orders"
  on orders for update
  using (
    restaurant_id in (
      select restaurant_id from restaurant_staff
      where user_id = auth.uid()
    )
  );

-- RLS Policies for order_items
create policy "Staff can view order items"
  on order_items for select
  using (
    order_id in (
      select id from orders
      where restaurant_id in (
        select restaurant_id from restaurant_staff
        where user_id = auth.uid()
      )
    )
  );

create policy "Customers can create order items"
  on order_items for insert
  with check (true);

-- RLS Policies for help_requests
create policy "Staff can view help requests"
  on help_requests for select
  using (
    restaurant_id in (
      select restaurant_id from restaurant_staff
      where user_id = auth.uid()
    )
  );

create policy "Customers can create help requests"
  on help_requests for insert
  with check (true);

create policy "Staff can update help requests"
  on help_requests for update
  using (
    restaurant_id in (
      select restaurant_id from restaurant_staff
      where user_id = auth.uid()
    )
  );

-- RLS Policies for restaurant_staff
create policy "Users can view their staff memberships"
  on restaurant_staff for select
  using (user_id = auth.uid());

create policy "Admins can manage staff"
  on restaurant_staff for all
  using (
    restaurant_id in (
      select restaurant_id from restaurant_staff
      where user_id = auth.uid() and role = 'admin'
    )
  );

-- Function to automatically update updated_at timestamp
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

-- Triggers for updated_at
create trigger update_restaurants_updated_at
  before update on restaurants
  for each row
  execute function update_updated_at_column();

create trigger update_menu_items_updated_at
  before update on menu_items
  for each row
  execute function update_updated_at_column();

create trigger update_orders_updated_at
  before update on orders
  for each row
  execute function update_updated_at_column();

-- Create storage bucket for menu item images
insert into storage.buckets (id, name, public)
values ('menu-images', 'menu-images', true);

-- Storage policy: Allow authenticated users to upload
create policy "Authenticated users can upload menu images"
  on storage.objects for insert
  with check (
    bucket_id = 'menu-images' and
    auth.role() = 'authenticated'
  );

-- Storage policy: Anyone can view menu images
create policy "Anyone can view menu images"
  on storage.objects for select
  using (bucket_id = 'menu-images');

-- Storage policy: Admins can delete menu images
create policy "Admins can delete menu images"
  on storage.objects for delete
  using (
    bucket_id = 'menu-images' and
    auth.uid() in (
      select user_id from restaurant_staff where role = 'admin'
    )
  );
