-- Add delivery support to orders table
-- This migration adds columns needed for delivery and takeout orders

-- Step 1: Add order_type column (nullable initially)
ALTER TABLE orders ADD COLUMN IF NOT EXISTS order_type TEXT;

-- Step 2: Update ALL existing rows to have 'dinein' 
UPDATE orders SET order_type = 'dinein' WHERE order_type IS NULL OR order_type = '';

-- Step 3: Verify no NULL values remain (safety check)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM orders WHERE order_type IS NULL) THEN
    RAISE NOTICE 'Warning: Some orders still have NULL order_type';
  END IF;
END $$;

-- Step 4: Set default value for NEW rows
ALTER TABLE orders ALTER COLUMN order_type SET DEFAULT 'dinein';

-- Add customer information fields (nullable, used for delivery/takeout)
ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_name TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_phone TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivery_address TEXT;

-- Add delivery-specific fields
ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivery_fee DECIMAL DEFAULT 0;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS estimated_delivery_time TIMESTAMP;

-- Make table_id nullable for delivery/takeout orders
ALTER TABLE orders ALTER COLUMN table_id DROP NOT NULL;

-- Drop existing check constraint if it exists (to avoid conflicts)
ALTER TABLE orders DROP CONSTRAINT IF EXISTS valid_order_type;

-- Add check constraint for order_type values
-- Only add if all rows have valid values
DO $$
BEGIN
  -- Check if there are any invalid values
  IF NOT EXISTS (
    SELECT 1 FROM orders 
    WHERE order_type IS NOT NULL 
    AND order_type NOT IN ('dinein', 'takeout', 'delivery')
  ) THEN
    ALTER TABLE orders ADD CONSTRAINT valid_order_type 
      CHECK (order_type IN ('dinein', 'takeout', 'delivery'));
    RAISE NOTICE 'Check constraint added successfully';
  ELSE
    RAISE NOTICE 'Skipping constraint: Invalid order_type values found';
  END IF;
END $$;

-- Update RLS policies to allow public INSERT for delivery orders
-- Drop existing insert policy if it exists
DROP POLICY IF EXISTS "Customers can create orders" ON orders;

-- Recreate with support for delivery orders (table_id can be null)
CREATE POLICY "Customers can create orders"
  ON orders FOR INSERT
  WITH CHECK (true);

-- Add comment to document the changes
COMMENT ON COLUMN orders.order_type IS 'Type of order: dinein, takeout, or delivery';
COMMENT ON COLUMN orders.customer_name IS 'Customer name for delivery/takeout orders';
COMMENT ON COLUMN orders.customer_phone IS 'Customer phone for delivery/takeout orders';
COMMENT ON COLUMN orders.delivery_address IS 'Delivery address for delivery orders';
COMMENT ON COLUMN orders.delivery_fee IS 'Delivery fee charged for delivery orders';
COMMENT ON COLUMN orders.estimated_delivery_time IS 'Estimated delivery time for delivery orders';
