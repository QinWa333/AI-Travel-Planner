-- AI 旅行规划师数据库初始化脚本
-- 在 Supabase SQL Editor 中执行此脚本

-- 1. 创建 trips 表
CREATE TABLE IF NOT EXISTS trips (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    title TEXT NOT NULL,
    destination TEXT NOT NULL,
    city TEXT,  -- 主要城市，用于地图定位
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    budget DECIMAL(10, 2),
    travelers INTEGER,
    preferences TEXT,
    itinerary JSONB,  -- 行程详情 JSON
    budget_breakdown JSONB,  -- 预算明细 JSON
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. 创建 expenses 表
CREATE TABLE IF NOT EXISTS expenses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
    category TEXT NOT NULL,  -- 交通/住宿/餐饮/门票/购物/其他
    amount DECIMAL(10, 2) NOT NULL,
    description TEXT,
    expense_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. 创建索引
CREATE INDEX IF NOT EXISTS idx_trips_user_id ON trips(user_id);
CREATE INDEX IF NOT EXISTS idx_trips_created_at ON trips(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_expenses_trip_id ON expenses(trip_id);
CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(expense_date);

-- 4. 添加注释
COMMENT ON TABLE trips IS '旅行计划表';
COMMENT ON COLUMN trips.id IS '行程ID';
COMMENT ON COLUMN trips.user_id IS '用户ID（关联 auth.users）';
COMMENT ON COLUMN trips.title IS '行程标题';
COMMENT ON COLUMN trips.destination IS '目的地';
COMMENT ON COLUMN trips.city IS '主要城市（用于地图定位）';
COMMENT ON COLUMN trips.start_date IS '开始日期';
COMMENT ON COLUMN trips.end_date IS '结束日期';
COMMENT ON COLUMN trips.budget IS '预算';
COMMENT ON COLUMN trips.travelers IS '旅行人数';
COMMENT ON COLUMN trips.preferences IS '偏好标签';
COMMENT ON COLUMN trips.itinerary IS 'AI生成的行程详情（JSON格式）';
COMMENT ON COLUMN trips.budget_breakdown IS '预算明细（JSON格式）';

COMMENT ON TABLE expenses IS '费用记录表';
COMMENT ON COLUMN expenses.id IS '费用ID';
COMMENT ON COLUMN expenses.trip_id IS '关联的行程ID';
COMMENT ON COLUMN expenses.category IS '费用类别';
COMMENT ON COLUMN expenses.amount IS '金额';
COMMENT ON COLUMN expenses.description IS '描述';
COMMENT ON COLUMN expenses.expense_date IS '费用日期';

-- 5. 启用行级安全策略（RLS）
ALTER TABLE trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

-- 6. 创建 RLS 策略
-- trips 表策略：用户只能访问自己的行程
CREATE POLICY "Users can view their own trips"
    ON trips FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own trips"
    ON trips FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own trips"
    ON trips FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own trips"
    ON trips FOR DELETE
    USING (auth.uid() = user_id);

-- expenses 表策略：用户只能访问自己行程的费用
CREATE POLICY "Users can view expenses of their trips"
    ON expenses FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM trips
            WHERE trips.id = expenses.trip_id
            AND trips.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert expenses to their trips"
    ON expenses FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM trips
            WHERE trips.id = expenses.trip_id
            AND trips.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update expenses of their trips"
    ON expenses FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM trips
            WHERE trips.id = expenses.trip_id
            AND trips.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete expenses of their trips"
    ON expenses FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM trips
            WHERE trips.id = expenses.trip_id
            AND trips.user_id = auth.uid()
        )
    );

-- 7. 创建更新时间触发器
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_trips_updated_at
    BEFORE UPDATE ON trips
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 8. 完成提示
DO $$
BEGIN
    RAISE NOTICE '数据库初始化完成！';
    RAISE NOTICE '已创建表: trips, expenses';
    RAISE NOTICE '已创建索引和 RLS 策略';
    RAISE NOTICE '可以开始使用 AI 旅行规划师了！';
END $$;
