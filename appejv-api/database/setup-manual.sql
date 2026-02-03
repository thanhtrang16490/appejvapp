-- APPE JV Database Manual Setup Guide
-- Copy and paste this entire script into Supabase SQL Editor

-- Step 1: Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Step 2: Create roles table
CREATE TABLE IF NOT EXISTS roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 3: Insert default roles
INSERT INTO roles (name, description) VALUES
    ('admin', 'Administrator with full access'),
    ('agent', 'Sales agent with limited access'),
    ('customer', 'Customer with basic access'),
    ('public', 'Public user with read-only access')
ON CONFLICT (name) DO NOTHING;

-- Step 4: Create users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    role_id INTEGER NOT NULL REFERENCES roles(id),
    parent_id UUID REFERENCES users(id),
    commission_rate DECIMAL(5,2),
    total_commission DECIMAL(15,2) DEFAULT 0,
    address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 5: Create sectors table
CREATE TABLE IF NOT EXISTS sectors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    image VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 6: Insert APPE JV sectors
INSERT INTO sectors (name, description) VALUES
    ('Thức ăn gia súc', 'Thức ăn hỗn hợp và đậm đặc cho lợn, bò các giai đoạn phát triển'),
    ('Thức ăn gia cầm', 'Thức ăn hỗn hợp cho gà, vịt, ngan các giai đoạn phát triển')
ON CONFLICT DO NOTHING;

-- Step 7: Create products table
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(500) NOT NULL,
    description TEXT,
    price DECIMAL(15,2) NOT NULL,
    sector_id INTEGER NOT NULL REFERENCES sectors(id),
    image VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 8: Create contents table
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

-- Step 9: Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_role_id ON users(role_id);
CREATE INDEX IF NOT EXISTS idx_users_parent_id ON users(parent_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_products_sector_id ON products(sector_id);
CREATE INDEX IF NOT EXISTS idx_contents_sector_id ON contents(sector_id);
CREATE INDEX IF NOT EXISTS idx_contents_category ON contents(category);

-- Step 10: Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Step 11: Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sectors_updated_at BEFORE UPDATE ON sectors
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contents_updated_at BEFORE UPDATE ON contents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Step 12: Insert sample admin user
INSERT INTO users (email, name, phone, role_id, address) VALUES
    ('admin@appejv.vn', 'Admin User', '03513595030', 1, 'Km 50, Quốc lộ 1A, xã Tiên Tân, Tp Phủ Lý, tỉnh Hà Nam')
ON CONFLICT (email) DO NOTHING;

-- Step 13: Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE sectors ENABLE ROW LEVEL SECURITY;
ALTER TABLE contents ENABLE ROW LEVEL SECURITY;

-- Step 14: Create RLS policies
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

-- Success message
SELECT 'Database setup completed successfully! You can now run: npm run setup-db' as message;