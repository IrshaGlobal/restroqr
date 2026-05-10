-- Add delivery/takeout support to orders table
-- Run this in Supabase SQL Editor to update your existing database

-- Add new columns to orders table
alter table orders 
  add column if not exists order_type text not null default 'dinein' check (order_type in ('dinein', 'takeout', 'delivery')),
  add column if not exists customer_name text,
  add column if not exists customer_phone text,
  add column if not exists customer_email text,
  add column if not exists delivery_address text,
  add column if not exists delivery_instructions text;

-- Make table_id nullable for delivery/takeout orders
alter table orders 
  alter column table_id drop not null;

-- Add index for order_type filtering
create index if not exists idx_orders_type on orders(order_type);
