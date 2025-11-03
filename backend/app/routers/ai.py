from fastapi import APIRouter, Depends, HTTPException
from openai import OpenAI
from app.models import AIGenerateRequest, TripCreate
from app.config import get_settings
from app.auth import get_current_user
import json
from datetime import datetime

router = APIRouter(prefix="/api/ai", tags=["AI"])
settings = get_settings()

def get_ai_client():
    """获取 AI 客户端（支持 OpenAI 和阿里云通义千问）"""
    # 如果配置了阿里云 API Key，使用通义千问
    if hasattr(settings, 'dashscope_api_key') and settings.dashscope_api_key and settings.dashscope_api_key != 'your-dashscope-api-key':
        # 使用阿里云通义千问（兼容 OpenAI SDK）
        return OpenAI(
            api_key=settings.dashscope_api_key,
            base_url="https://dashscope.aliyuncs.com/compatible-mode/v1"
        )
    else:
        # 使用 OpenAI
        return OpenAI(api_key=settings.openai_api_key)

def get_model_name():
    """获取模型名称"""
    if hasattr(settings, 'dashscope_api_key') and settings.dashscope_api_key and settings.dashscope_api_key != 'your-dashscope-api-key':
        return "qwen-plus"  # 或 "qwen-turbo", "qwen-max"
    else:
        return "gpt-4-turbo-preview"

@router.post("/generate-trip")
async def generate_trip(
    request: AIGenerateRequest,
    current_user = Depends(get_current_user)
):
    """使用 AI 生成旅行计划"""
    try:
        client = get_ai_client()
        model = get_model_name()
        
        # 获取明天的日期
        from datetime import timedelta
        tomorrow = (datetime.now() + timedelta(days=1)).strftime('%Y-%m-%d')
        
        system_prompt = """你是一位专业的旅行规划师。根据用户需求生成详细的旅行计划。

重要规则：
1. 你必须只返回纯 JSON 格式，不要有任何其他文字、解释或markdown标记
2. 行程开始日期必须从明天（""" + tomorrow + """）或之后开始，不要使用今天或过去的日期
3. 如果用户没有指定具体日期，默认从明天开始

请以 JSON 格式返回，包含以下字段：
{
  "title": "行程标题",
  "destination": "目的地",
  "city": "主要城市名称（如：北京、上海、西安、杭州等，用于地图定位）",
  "start_date": "YYYY-MM-DD",
  "end_date": "YYYY-MM-DD",
  "budget": 预算金额(数字),
  "travelers": 人数(数字),
  "preferences": "偏好标签",
  "itinerary": {
    "days": [
      {
        "day": 1,
        "date": "YYYY-MM-DD",
        "activities": [
          {
            "time": "09:00",
            "title": "活动名称",
            "location": "地点",
            "description": "详细描述",
            "estimated_cost": 预估费用,
            "duration": "持续时间",
            "type": "景点/餐厅/交通/住宿"
          }
        ]
      }
    ]
  },
  "budget_breakdown": {
    "transportation": 交通费用,
    "accommodation": 住宿费用,
    "food": 餐饮费用,
    "attractions": 门票费用,
    "shopping": 购物预算,
    "other": 其他费用
  }
}

确保：
1. 日期格式正确
2. 费用合理且符合预算
3. 行程安排紧凑但不过度
4. 考虑用户偏好和同行人员
5. 包含具体的地点名称（便于地图标注）
"""
        
        # 构建请求参数
        request_params = {
            "model": model,
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": request.prompt}
            ],
            "temperature": 0.7
        }
        
        # OpenAI 支持 response_format，通义千问不支持，需要在 prompt 中强调
        if "gpt" in model:
            request_params["response_format"] = {"type": "json_object"}
        
        response = client.chat.completions.create(**request_params)
        
        ai_response = response.choices[0].message.content
        
        # 调试：打印 AI 返回的内容
        print("=" * 50)
        print("AI 返回内容：")
        print(ai_response)
        print("=" * 50)
        
        # 检查是否为空
        if not ai_response or ai_response.strip() == "":
            raise ValueError("AI 返回内容为空")
        
        trip_data = json.loads(ai_response)
        
        return {
            "success": True,
            "data": trip_data,
            "raw_response": ai_response
        }
        
    except Exception as e:
        import traceback
        error_detail = f"AI 生成失败: {str(e)}\n{traceback.format_exc()}"
        print(error_detail)  # 打印到控制台
        raise HTTPException(status_code=500, detail=f"AI 生成失败: {str(e)}")

@router.post("/parse-expense")
async def parse_expense(
    request: AIGenerateRequest,
    current_user = Depends(get_current_user)
):
    """使用 AI 解析费用记录（语音输入）"""
    try:
        client = get_ai_client()
        model = get_model_name()
        
        system_prompt = """你是费用记录助手。从用户输入中提取费用信息。
        
返回 JSON 格式：
{
  "category": "交通/住宿/餐饮/门票/购物/其他",
  "amount": 金额(数字),
  "description": "描述",
  "date": "YYYY-MM-DD" (如果用户说"今天"则用当前日期)
}

示例：
输入："今天午餐花了150元"
输出：{"category": "餐饮", "amount": 150, "description": "午餐", "date": "2025-10-31"}
"""
        
        # 构建请求参数
        request_params = {
            "model": model,
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": f"当前日期：{datetime.now().strftime('%Y-%m-%d')}\n用户输入：{request.prompt}"}
            ],
            "temperature": 0.3
        }
        
        # OpenAI 支持 response_format，通义千问不支持
        if "gpt" in model:
            request_params["response_format"] = {"type": "json_object"}
        
        response = client.chat.completions.create(**request_params)
        
        expense_data = json.loads(response.choices[0].message.content)
        
        return {
            "success": True,
            "data": expense_data
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"解析失败: {str(e)}")
