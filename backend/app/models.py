from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime, date

# 用户相关模型
class UserCreate(BaseModel):
    email: str
    password: str
    full_name: Optional[str] = None

class UserLogin(BaseModel):
    email: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    user: dict

# 行程规划请求模型
class TripRequest(BaseModel):
    destination: str
    start_date: date
    end_date: date
    budget: float
    travelers: int = 1
    preferences: Optional[str] = None  # 例如："美食,动漫,亲子"
    
class TripCreate(BaseModel):
    title: str
    destination: str
    start_date: date
    end_date: date
    budget: float
    travelers: int
    preferences: Optional[str] = None
    itinerary: dict  # AI 生成的行程 JSON
    budget_breakdown: dict  # 预算明细

class TripUpdate(BaseModel):
    title: Optional[str] = None
    itinerary: Optional[dict] = None
    budget_breakdown: Optional[dict] = None

class TripResponse(BaseModel):
    id: str
    user_id: str
    title: str
    destination: str
    start_date: date
    end_date: date
    budget: float
    travelers: int
    preferences: Optional[str]
    itinerary: dict
    budget_breakdown: dict
    created_at: datetime
    updated_at: datetime

# 费用记录模型
class ExpenseCreate(BaseModel):
    trip_id: str
    category: str  # 交通/住宿/餐饮/门票/其他
    amount: float
    description: Optional[str] = None
    expense_date: date

class ExpenseResponse(BaseModel):
    id: str
    trip_id: str
    user_id: str
    category: str
    amount: float
    description: Optional[str]
    expense_date: date
    created_at: datetime

# AI 生成相关模型
class AIGenerateRequest(BaseModel):
    prompt: str  # 用户的语音或文字输入
    
class AIGenerateResponse(BaseModel):
    trip_data: TripCreate
    raw_response: str
