-- 添加 city 列到 trips 表
ALTER TABLE trips ADD COLUMN IF NOT EXISTS city TEXT;

-- 添加注释
COMMENT ON COLUMN trips.city IS '主要城市名称，用于地图定位';
