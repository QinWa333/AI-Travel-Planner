from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.config import get_settings
from app.database import supabase
from app.models import UserCreate, UserLogin, Token
from app.routers import ai, trips, expenses
from datetime import timedelta
from app.auth import create_access_token

settings = get_settings()

app = FastAPI(
    title="AI Travel Planner API",
    description="AI 旅行规划师后端 API",
    version="1.0.0"
)

# CORS 配置
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_url, "http://localhost:5173", "http://localhost:3000", "http://localhost"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 注册路由
app.include_router(ai.router)
app.include_router(trips.router)
app.include_router(expenses.router)

@app.get("/")
async def root():
    return {
        "message": "AI Travel Planner API",
        "version": "1.0.0",
        "docs": "/docs"
    }

@app.get("/api/health")
async def health_check():
    return {"status": "healthy"}

# 认证相关端点
@app.post("/api/auth/register", response_model=Token)
async def register(user: UserCreate):
    """用户注册"""
    try:
        # 使用 Supabase Auth 注册
        response = supabase.auth.sign_up({
            "email": user.email,
            "password": user.password,
            "options": {
                "data": {
                    "full_name": user.full_name
                }
            }
        })
        
        if not response.user:
            raise HTTPException(status_code=400, detail="注册失败")
        
        # 创建 JWT token
        access_token = create_access_token(
            data={"sub": response.user.id},
            expires_delta=timedelta(minutes=settings.access_token_expire_minutes)
        )
        
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": {
                "id": response.user.id,
                "email": response.user.email,
                "full_name": user.full_name
            }
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/auth/login", response_model=Token)
async def login(user: UserLogin):
    """用户登录"""
    try:
        # 使用 Supabase Auth 登录
        response = supabase.auth.sign_in_with_password({
            "email": user.email,
            "password": user.password
        })
        
        if not response.user:
            raise HTTPException(status_code=401, detail="邮箱或密码错误")
        
        # 创建 JWT token
        access_token = create_access_token(
            data={"sub": response.user.id},
            expires_delta=timedelta(minutes=settings.access_token_expire_minutes)
        )
        
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": {
                "id": response.user.id,
                "email": response.user.email,
                "full_name": response.user.user_metadata.get("full_name")
            }
        }
    except Exception as e:
        raise HTTPException(status_code=401, detail="登录失败")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
