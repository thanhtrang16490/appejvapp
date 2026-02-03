-- APPE JV Database Schema
-- Run this script in your Supabase SQL editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create roles table
CREATE TABLE IF NOT EXISTS roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default roles
INSERT INTO roles (name, description) VALUES
    ('admin', 'Administrator with full access'),
    ('agent', 'Sales agent with limited access'),
    ('customer', 'Customer with basic access'),
    ('public', 'Public user with read-only access')
ON CONFLICT (name) DO NOTHING;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    password VARCHAR(255),
    role_id INTEGER NOT NULL REFERENCES roles(id),
    parent_id UUID REFERENCES users(id),
    commission_rate DECIMAL(5,2),
    total_commission DECIMAL(15,2) DEFAULT 0,
    address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create sectors table
CREATE TABLE IF NOT EXISTS sectors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    image VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert APPE JV sectors
INSERT INTO sectors (name, description) VALUES
    ('Thức ăn gia súc', 'Thức ăn hỗn hợp và đậm đặc cho lợn, bò các giai đoạn phát triển'),
    ('Thức ăn gia cầm', 'Thức ăn hỗn hợp cho gà, vịt, ngan các giai đoạn phát triển')
ON CONFLICT DO NOTHING;

-- Create products table
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(500) NOT NULL,
    description TEXT,
    price DECIMAL(15,2) NOT NULL,
    sector_id INTEGER NOT NULL REFERENCES sectors(id),
    image VARCHAR(500),
    stock_quantity INTEGER DEFAULT 0,
    min_stock_level INTEGER DEFAULT 0,
    max_stock_level INTEGER DEFAULT 1000,
    unit VARCHAR(50) DEFAULT 'kg',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create contents table
CREATE TABLE IF NOT EXISTS contents (
    id SERIAL PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    content TEXT NOT NULL,
    image VARCHAR(500),
    brand VARCHAR(100),
    category VARCHAR(50),
    sector_id INTEGER NOT NULL REFERENCES sectors(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_role_id ON users(role_id);
CREATE INDEX IF NOT EXISTS idx_users_parent_id ON users(parent_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_products_sector_id ON products(sector_id);
CREATE INDEX IF NOT EXISTS idx_products_name ON products USING gin(to_tsvector('english', name));
CREATE INDEX IF NOT EXISTS idx_contents_sector_id ON contents(sector_id);
CREATE INDEX IF NOT EXISTS idx_contents_category ON contents(category);
CREATE INDEX IF NOT EXISTS idx_contents_title ON contents USING gin(to_tsvector('english', title));

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sectors_updated_at BEFORE UPDATE ON sectors
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contents_updated_at BEFORE UPDATE ON contents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample APPE JV products
INSERT INTO products (name, description, price, sector_id, stock_quantity, min_stock_level, max_stock_level, unit) VALUES
    -- Thức ăn gia súc
    ('HH cho lợn sữa (7 ngày tuổi - 10kg)', 'Mã SP: A1 - Đạm 20% - Bao 20kg', 27100, 1, 150, 20, 500, 'bao'),
    ('HH cho lợn con tập ăn (10 ngày tuổi - 20kg)', 'Mã SP: A2 - Đạm 19% - Bao 25kg', 18090, 1, 200, 30, 600, 'bao'),
    ('HH cho lợn con tập ăn (10 ngày tuổi - 25kg)', 'Mã SP: A2GP - Đạm 19% - Bao 25kg', 14640, 1, 180, 25, 550, 'bao'),
    ('HH cho lợn siêu nạc (10 - 25kg)', 'Mã SP: A3 - Đạm 18.5% - Bao 25kg', 12830, 1, 220, 35, 650, 'bao'),
    ('Đậm đặc cao cấp cho lợn tập ăn - xuất chuồng', 'Mã SP: A999 - Đạm 46% - Bao 25kg', 18770, 1, 120, 15, 400, 'bao'),
    ('HH cho bò thịt', 'Mã SP: A618 - Đạm 16% - Bao 25kg', 10640, 1, 100, 20, 350, 'bao'),
    
    -- Thức ăn gia cầm
    ('HH cho gà công nghiệp 01 - 12 ngày tuổi', 'Mã SP: A2010 - Đạm 21% - Bao 25kg', 13480, 2, 250, 40, 700, 'bao'),
    ('HH cho gà công nghiệp 13 - 24 ngày tuổi', 'Mã SP: A2011 - Đạm 20% - Bao 25kg', 13180, 2, 230, 35, 650, 'bao'),
    ('HH cho gà công nghiệp 25 - 39 ngày tuổi', 'Mã SP: A2012 - Đạm 18% - Bao 25kg', 12980, 2, 210, 30, 600, 'bao'),
    ('HH gà trắng siêu thịt từ 1-14 ngày tuổi', 'Mã SP: L310-S - Đạm 21% - Bao 25kg', 13500, 2, 190, 25, 550, 'bao'),
    ('HH cho vịt, ngan con (từ 01 - 21 ngày tuổi)', 'Mã SP: L810 - Đạm 20% - Bao 25kg', 12360, 2, 160, 20, 500, 'bao'),
    ('Đậm đặc cho gà thịt 01 ngày tuổi - xuất chuồng', 'Mã SP: A308 - Đạm 43% - Bao 25kg', 18450, 2, 140, 18, 450, 'bao')
ON CONFLICT DO NOTHING;

-- Insert sample contents
INSERT INTO contents (title, content, brand, category, sector_id) VALUES
    ('Thức ăn chăn nuôi APPE JV - Giải pháp dinh dưỡng tối ưu', 
     'APPE JV mang đến những sản phẩm thức ăn chăn nuôi chất lượng cao với công thức dinh dưỡng cân bằng, giúp vật nuôi phát triển khỏe mạnh và đạt hiệu quả kinh tế tối ưu. Với nhiều năm kinh nghiệm trong ngành chăn nuôi, chúng tôi cam kết cung cấp những giải pháp dinh dưỡng tốt nhất cho từng giai đoạn phát triển của vật nuôi.',
     'APPE JV', 'product', 1),
    
    ('Hướng dẫn chăn nuôi lợn hiệu quả với thức ăn APPE JV',
     'Thức ăn hỗn hợp APPE JV được nghiên cứu và sản xuất theo công nghệ tiên tiến, đảm bảo cung cấp đầy đủ dinh dưỡng cho lợn ở mọi giai đoạn phát triển. Với hàm lượng đạm từ 13-20%, sản phẩm giúp tối ưu hóa tỷ lệ chuyển đổi thức ăn và tăng trọng nhanh.',
     'APPE JV', 'guide', 1),
    
    ('Thức ăn gia cầm APPE JV - Chất lượng vượt trội',
     'Thức ăn hỗn hợp cho gà, vịt, ngan APPE JV được thiết kế phù hợp với đặc điểm sinh lý của gia cầm. Với công thức dinh dưỡng cân bằng và hàm lượng đạm từ 17-21%, sản phẩm giúp gia cầm phát triển đều, tăng trọng nhanh và đạt hiệu quả kinh tế cao.',
     'APPE JV', 'product', 2),
    
    ('Công nghệ sản xuất thức ăn chăn nuôi hiện đại tại APPE JV',
     'APPE JV áp dụng công nghệ sản xuất hiện đại với dây chuyền tự động, đảm bảo chất lượng sản phẩm ổn định. Quy trình kiểm soát chất lượng nghiêm ngặt từ khâu nguyên liệu đầu vào đến sản phẩm hoàn thiện.',
     'APPE JV', 'news', 1)
ON CONFLICT DO NOTHING;

-- Insert sample admin user (password should be hashed in real implementation)
INSERT INTO users (email, name, phone, role_id, password, address) VALUES
    ('admin@appejv.vn', 'Admin User', '03513595030', 1, '123456', 'Km 50, Quốc lộ 1A, xã Tiên Tân, Tp Phủ Lý, tỉnh Hà Nam')
ON CONFLICT (email) DO NOTHING;

-- Insert additional test users
INSERT INTO users (email, name, phone, role_id, password, commission_rate, total_commission, address) VALUES
    ('agent@appejv.vn', 'Nguyễn Văn A', '0987654321', 2, '123456', 5.0, 500000, 'Km 50, Quốc lộ 1A, xã Tiên Tân, Tp Phủ Lý, tỉnh Hà Nam'),
    ('customer@appejv.vn', 'Trần Thị B', '0111222333', 3, '123456', NULL, NULL, 'Km 50, Quốc lộ 1A, xã Tiên Tân, Tp Phủ Lý, tỉnh Hà Nam')
ON CONFLICT (email) DO NOTHING;

-- Row Level Security (RLS) policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE sectors ENABLE ROW LEVEL SECURITY;
ALTER TABLE contents ENABLE ROW LEVEL SECURITY;

-- Create policies (adjust based on your authentication setup)
-- Allow authenticated users to read all data
CREATE POLICY "Allow authenticated users to read users" ON users
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to read products" ON products
    FOR SELECT USING (true);

CREATE POLICY "Allow authenticated users to read sectors" ON sectors
    FOR SELECT USING (true);

CREATE POLICY "Allow authenticated users to read contents" ON contents
    FOR SELECT USING (true);

-- Allow service role to do everything (for admin operations)
CREATE POLICY "Allow service role full access to users" ON users
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Allow service role full access to products" ON products
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Allow service role full access to sectors" ON sectors
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Allow service role full access to contents" ON contents
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- ========================================
-- MISSING FEATURES TABLES
-- ========================================

-- Create quotations table
CREATE TABLE IF NOT EXISTS quotations (
  id SERIAL PRIMARY KEY,
  customer_id UUID REFERENCES users(id),
  agent_id UUID REFERENCES users(id),
  customer_code VARCHAR(50),
  customer_name VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(20) NOT NULL,
  customer_email VARCHAR(255),
  customer_address TEXT,
  province VARCHAR(100),
  district VARCHAR(100),
  ward VARCHAR(100),
  total_price DECIMAL(15,2) DEFAULT 0,
  status VARCHAR(50) DEFAULT 'draft',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create quotation_items table
CREATE TABLE IF NOT EXISTS quotation_items (
  id SERIAL PRIMARY KEY,
  quotation_id INTEGER REFERENCES quotations(id) ON DELETE CASCADE,
  product_id INTEGER REFERENCES products(id),
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price DECIMAL(15,2) NOT NULL,
  total_price DECIMAL(15,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create contacts table
CREATE TABLE IF NOT EXISTS contacts (
  id SERIAL PRIMARY KEY,
  agent_id UUID REFERENCES users(id),
  assumed_code VARCHAR(50),
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(255),
  gender BOOLEAN,
  address TEXT,
  province VARCHAR(100),
  district VARCHAR(100),
  ward VARCHAR(100),
  interested_product_id INTEGER REFERENCES products(id),
  description TEXT,
  status VARCHAR(50) DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create contracts table
CREATE TABLE IF NOT EXISTS contracts (
  id SERIAL PRIMARY KEY,
  quotation_id INTEGER REFERENCES quotations(id),
  customer_id UUID REFERENCES users(id),
  agent_id UUID REFERENCES users(id),
  contract_code VARCHAR(50) UNIQUE,
  customer_name VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(20) NOT NULL,
  total_price DECIMAL(15,2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  signed_date DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create commissions table
CREATE TABLE IF NOT EXISTS commissions (
  id SERIAL PRIMARY KEY,
  agent_id UUID REFERENCES users(id),
  contract_id INTEGER REFERENCES contracts(id),
  amount DECIMAL(15,2) NOT NULL,
  commission_rate DECIMAL(5,2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  paid_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  data JSONB,
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create appointments table
CREATE TABLE IF NOT EXISTS appointments (
  id SERIAL PRIMARY KEY,
  customer_id UUID REFERENCES users(id),
  agent_id UUID REFERENCES users(id),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  appointment_date TIMESTAMP WITH TIME ZONE NOT NULL,
  status VARCHAR(50) DEFAULT 'scheduled',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- ORDER MANAGEMENT TABLES
-- ========================================

-- Create orders table (replacing commissions focus with revenue/order focus)
CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  order_code VARCHAR(50) UNIQUE NOT NULL,
  customer_id UUID REFERENCES users(id),
  agent_id UUID REFERENCES users(id),
  quotation_id INTEGER REFERENCES quotations(id),
  customer_name VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(20) NOT NULL,
  customer_email VARCHAR(255),
  customer_address TEXT,
  province VARCHAR(100),
  district VARCHAR(100),
  ward VARCHAR(100),
  subtotal DECIMAL(15,2) NOT NULL DEFAULT 0,
  tax_amount DECIMAL(15,2) DEFAULT 0,
  discount_amount DECIMAL(15,2) DEFAULT 0,
  total_amount DECIMAL(15,2) NOT NULL DEFAULT 0,
  status VARCHAR(50) DEFAULT 'pending', -- pending, confirmed, processing, shipped, delivered, cancelled
  payment_status VARCHAR(50) DEFAULT 'unpaid', -- unpaid, partial, paid, overdue
  delivery_status VARCHAR(50) DEFAULT 'preparing', -- preparing, shipped, in_transit, delivered, returned
  order_date DATE NOT NULL DEFAULT CURRENT_DATE,
  expected_delivery_date DATE,
  actual_delivery_date DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
  product_id INTEGER REFERENCES products(id),
  product_name VARCHAR(500) NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price DECIMAL(15,2) NOT NULL,
  total_price DECIMAL(15,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create payments table for payment tracking
CREATE TABLE IF NOT EXISTS payments (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id),
  payment_code VARCHAR(50) UNIQUE NOT NULL,
  amount DECIMAL(15,2) NOT NULL,
  payment_method VARCHAR(50) NOT NULL, -- cash, bank_transfer, credit_card, check
  payment_date DATE NOT NULL,
  reference_number VARCHAR(100),
  status VARCHAR(50) DEFAULT 'completed', -- pending, completed, failed, cancelled
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create delivery_tracking table
CREATE TABLE IF NOT EXISTS delivery_tracking (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id),
  status VARCHAR(50) NOT NULL, -- preparing, picked_up, in_transit, out_for_delivery, delivered, failed_delivery
  location VARCHAR(255),
  description TEXT,
  tracking_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create accounts_receivable table for debt management
CREATE TABLE IF NOT EXISTS accounts_receivable (
  id SERIAL PRIMARY KEY,
  customer_id UUID REFERENCES users(id),
  order_id INTEGER REFERENCES orders(id),
  invoice_code VARCHAR(50) UNIQUE NOT NULL,
  total_amount DECIMAL(15,2) NOT NULL,
  paid_amount DECIMAL(15,2) DEFAULT 0,
  outstanding_amount DECIMAL(15,2) NOT NULL,
  due_date DATE NOT NULL,
  status VARCHAR(50) DEFAULT 'outstanding', -- outstanding, overdue, paid, written_off
  payment_terms VARCHAR(100), -- e.g., "Net 30", "COD", "50% advance"
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create revenue_tracking table (replacing commission tracking)
CREATE TABLE IF NOT EXISTS revenue_tracking (
  id SERIAL PRIMARY KEY,
  agent_id UUID REFERENCES users(id),
  order_id INTEGER REFERENCES orders(id),
  revenue_amount DECIMAL(15,2) NOT NULL,
  commission_amount DECIMAL(15,2) DEFAULT 0,
  commission_rate DECIMAL(5,2) DEFAULT 0,
  period_month INTEGER NOT NULL,
  period_year INTEGER NOT NULL,
  status VARCHAR(50) DEFAULT 'recorded', -- recorded, paid, cancelled
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Update commissions table to reference orders instead of contracts
ALTER TABLE commissions ADD COLUMN IF NOT EXISTS order_id INTEGER REFERENCES orders(id);
ALTER TABLE commissions ALTER COLUMN contract_id DROP NOT NULL;

-- Add indexes for better performance on new tables
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_agent_id ON orders(agent_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_orders_delivery_status ON orders(delivery_status);
CREATE INDEX IF NOT EXISTS idx_orders_order_date ON orders(order_date);
CREATE INDEX IF NOT EXISTS idx_orders_order_code ON orders(order_code);

CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id);

CREATE INDEX IF NOT EXISTS idx_payments_order_id ON payments(order_id);
CREATE INDEX IF NOT EXISTS idx_payments_payment_date ON payments(payment_date);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);

CREATE INDEX IF NOT EXISTS idx_delivery_tracking_order_id ON delivery_tracking(order_id);
CREATE INDEX IF NOT EXISTS idx_delivery_tracking_status ON delivery_tracking(status);
CREATE INDEX IF NOT EXISTS idx_delivery_tracking_date ON delivery_tracking(tracking_date);

CREATE INDEX IF NOT EXISTS idx_accounts_receivable_customer_id ON accounts_receivable(customer_id);
CREATE INDEX IF NOT EXISTS idx_accounts_receivable_order_id ON accounts_receivable(order_id);
CREATE INDEX IF NOT EXISTS idx_accounts_receivable_status ON accounts_receivable(status);
CREATE INDEX IF NOT EXISTS idx_accounts_receivable_due_date ON accounts_receivable(due_date);

CREATE INDEX IF NOT EXISTS idx_revenue_tracking_agent_id ON revenue_tracking(agent_id);
CREATE INDEX IF NOT EXISTS idx_revenue_tracking_order_id ON revenue_tracking(order_id);
CREATE INDEX IF NOT EXISTS idx_revenue_tracking_period ON revenue_tracking(period_year, period_month);

CREATE INDEX IF NOT EXISTS idx_commissions_order_id ON commissions(order_id);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_quotations_customer_id ON quotations(customer_id);
CREATE INDEX IF NOT EXISTS idx_quotations_agent_id ON quotations(agent_id);
CREATE INDEX IF NOT EXISTS idx_quotations_status ON quotations(status);
CREATE INDEX IF NOT EXISTS idx_quotation_items_quotation_id ON quotation_items(quotation_id);
CREATE INDEX IF NOT EXISTS idx_contacts_agent_id ON contacts(agent_id);
CREATE INDEX IF NOT EXISTS idx_contacts_phone ON contacts(phone);
CREATE INDEX IF NOT EXISTS idx_contracts_customer_id ON contracts(customer_id);
CREATE INDEX IF NOT EXISTS idx_contracts_agent_id ON contracts(agent_id);
CREATE INDEX IF NOT EXISTS idx_contracts_status ON contracts(status);
CREATE INDEX IF NOT EXISTS idx_commissions_agent_id ON commissions(agent_id);
CREATE INDEX IF NOT EXISTS idx_commissions_status ON commissions(status);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read_at ON notifications(read_at);
CREATE INDEX IF NOT EXISTS idx_appointments_customer_id ON appointments(customer_id);
CREATE INDEX IF NOT EXISTS idx_appointments_agent_id ON appointments(agent_id);

-- Create triggers for updated_at on new tables
CREATE TRIGGER update_quotations_updated_at BEFORE UPDATE ON quotations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contacts_updated_at BEFORE UPDATE ON contacts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contracts_updated_at BEFORE UPDATE ON contracts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_commissions_updated_at BEFORE UPDATE ON commissions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON appointments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create triggers for updated_at on order management tables
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_accounts_receivable_updated_at BEFORE UPDATE ON accounts_receivable
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_revenue_tracking_updated_at BEFORE UPDATE ON revenue_tracking
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS on new tables
ALTER TABLE quotations ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotation_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE commissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- Enable RLS on order management tables
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE accounts_receivable ENABLE ROW LEVEL SECURITY;
ALTER TABLE revenue_tracking ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for new tables
CREATE POLICY "Allow users to manage their quotations" ON quotations
    FOR ALL USING (auth.uid() = customer_id OR auth.uid() = agent_id);

CREATE POLICY "Allow service role full access to quotations" ON quotations
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Allow users to view quotation items" ON quotation_items
    FOR SELECT USING (EXISTS (
        SELECT 1 FROM quotations q 
        WHERE q.id = quotation_items.quotation_id 
        AND (auth.uid() = q.customer_id OR auth.uid() = q.agent_id)
    ));

CREATE POLICY "Allow service role full access to quotation_items" ON quotation_items
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Allow agents to manage their contacts" ON contacts
    FOR ALL USING (auth.uid() = agent_id);

CREATE POLICY "Allow service role full access to contacts" ON contacts
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Allow users to view their contracts" ON contracts
    FOR SELECT USING (auth.uid() = customer_id OR auth.uid() = agent_id);

CREATE POLICY "Allow service role full access to contracts" ON contracts
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Allow agents to view their commissions" ON commissions
    FOR SELECT USING (auth.uid() = agent_id);

CREATE POLICY "Allow service role full access to commissions" ON commissions
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Allow users to view their notifications" ON notifications
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Allow service role full access to notifications" ON notifications
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Allow users to manage their appointments" ON appointments
    FOR ALL USING (auth.uid() = customer_id OR auth.uid() = agent_id);

CREATE POLICY "Allow service role full access to appointments" ON appointments
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- Create RLS policies for order management tables
CREATE POLICY "Allow users to view their orders" ON orders
    FOR SELECT USING (auth.uid() = customer_id OR auth.uid() = agent_id);

CREATE POLICY "Allow service role full access to orders" ON orders
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Allow users to view order items" ON order_items
    FOR SELECT USING (EXISTS (
        SELECT 1 FROM orders o 
        WHERE o.id = order_items.order_id 
        AND (auth.uid() = o.customer_id OR auth.uid() = o.agent_id)
    ));

CREATE POLICY "Allow service role full access to order_items" ON order_items
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Allow users to view their payments" ON payments
    FOR SELECT USING (EXISTS (
        SELECT 1 FROM orders o 
        WHERE o.id = payments.order_id 
        AND (auth.uid() = o.customer_id OR auth.uid() = o.agent_id)
    ));

CREATE POLICY "Allow service role full access to payments" ON payments
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Allow users to view delivery tracking" ON delivery_tracking
    FOR SELECT USING (EXISTS (
        SELECT 1 FROM orders o 
        WHERE o.id = delivery_tracking.order_id 
        AND (auth.uid() = o.customer_id OR auth.uid() = o.agent_id)
    ));

CREATE POLICY "Allow service role full access to delivery_tracking" ON delivery_tracking
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Allow customers to view their receivables" ON accounts_receivable
    FOR SELECT USING (auth.uid() = customer_id);

CREATE POLICY "Allow service role full access to accounts_receivable" ON accounts_receivable
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Allow agents to view their revenue" ON revenue_tracking
    FOR SELECT USING (auth.uid() = agent_id);

CREATE POLICY "Allow service role full access to revenue_tracking" ON revenue_tracking
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');