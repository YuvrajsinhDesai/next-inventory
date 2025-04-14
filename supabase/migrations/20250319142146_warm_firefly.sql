/*
  # Create inventory and supplier tracking tables

  1. New Tables
    - `suppliers`
      - `id` (uuid, primary key)
      - `name` (text)
      - `email` (text, unique)
      - `phone` (text)
      - `address` (text)
      - `status` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `products`
      - `id` (uuid, primary key) 
      - `name` (text)
      - `sku` (text, unique)
      - `description` (text)
      - `category` (text)
      - `price` (numeric)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `supplier_inventory`
      - `id` (uuid, primary key)
      - `supplier_id` (uuid, foreign key)
      - `product_id` (uuid, foreign key)
      - `quantity` (integer)
      - `unit_cost` (numeric)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create suppliers table
CREATE TABLE IF NOT EXISTS suppliers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  phone text,
  address text,
  status text DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  sku text UNIQUE NOT NULL,
  description text,
  category text,
  price numeric NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create supplier_inventory table
CREATE TABLE IF NOT EXISTS supplier_inventory (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_id uuid REFERENCES suppliers(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  quantity integer NOT NULL DEFAULT 0,
  unit_cost numeric NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(supplier_id, product_id)
);

-- Enable RLS
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE supplier_inventory ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow authenticated users to read suppliers"
  ON suppliers
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to insert suppliers"
  ON suppliers
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update suppliers"
  ON suppliers
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to read products"
  ON products
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to insert products"
  ON products
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update products"
  ON products
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to read supplier_inventory"
  ON supplier_inventory
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to insert supplier_inventory"
  ON supplier_inventory
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update supplier_inventory"
  ON supplier_inventory
  FOR UPDATE
  TO authenticated
  USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_suppliers_updated_at
  BEFORE UPDATE ON suppliers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_supplier_inventory_updated_at
  BEFORE UPDATE ON supplier_inventory
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create view for total product quantity across all suppliers
CREATE OR REPLACE VIEW product_total_quantity AS
SELECT 
  p.id,
  p.name,
  p.sku,
  COALESCE(SUM(si.quantity), 0) as total_quantity
FROM products p
LEFT JOIN supplier_inventory si ON p.id = si.product_id
GROUP BY p.id, p.name, p.sku;