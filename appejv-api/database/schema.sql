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
INSERT INTO products (name, description, price, sector_id) VALUES
    -- Thức ăn gia súc
    ('HH cho lợn sữa (7 ngày tuổi - 10kg)', 'Mã SP: A1 - Đạm 20% - Bao 20kg', 27100, 1),
    ('HH cho lợn con tập ăn (10 ngày tuổi - 20kg)', 'Mã SP: A2 - Đạm 19% - Bao 25kg', 18090, 1),
    ('HH cho lợn con tập ăn (10 ngày tuổi - 25kg)', 'Mã SP: A2GP - Đạm 19% - Bao 25kg', 14640, 1),
    ('HH cho lợn siêu nạc (10 - 25kg)', 'Mã SP: A3 - Đạm 18.5% - Bao 25kg', 12830, 1),
    ('Đậm đặc cao cấp cho lợn tập ăn - xuất chuồng', 'Mã SP: A999 - Đạm 46% - Bao 25kg', 18770, 1),
    ('HH cho bò thịt', 'Mã SP: A618 - Đạm 16% - Bao 25kg', 10640, 1),
    
    -- Thức ăn gia cầm
    ('HH cho gà công nghiệp 01 - 12 ngày tuổi', 'Mã SP: A2010 - Đạm 21% - Bao 25kg', 13480, 2),
    ('HH cho gà công nghiệp 13 - 24 ngày tuổi', 'Mã SP: A2011 - Đạm 20% - Bao 25kg', 13180, 2),
    ('HH cho gà công nghiệp 25 - 39 ngày tuổi', 'Mã SP: A2012 - Đạm 18% - Bao 25kg', 12980, 2),
    ('HH gà trắng siêu thịt từ 1-14 ngày tuổi', 'Mã SP: L310-S - Đạm 21% - Bao 25kg', 13500, 2),
    ('HH cho vịt, ngan con (từ 01 - 21 ngày tuổi)', 'Mã SP: L810 - Đạm 20% - Bao 25kg', 12360, 2),
    ('Đậm đặc cho gà thịt 01 ngày tuổi - xuất chuồng', 'Mã SP: A308 - Đạm 43% - Bao 25kg', 18450, 2)
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