from fastapi import APIRouter, Depends, HTTPException
from typing import List
from app.models import ExpenseCreate, ExpenseResponse
from app.database import supabase
from app.auth import get_current_user
from datetime import datetime

router = APIRouter(prefix="/api/expenses", tags=["Expenses"])

@router.post("/", response_model=dict)
async def create_expense(
    expense: ExpenseCreate,
    current_user = Depends(get_current_user)
):
    """创建费用记录"""
    try:
        expense_data = {
            "trip_id": expense.trip_id,
            "user_id": current_user.id,
            "category": expense.category,
            "amount": expense.amount,
            "description": expense.description,
            "expense_date": expense.expense_date.isoformat(),
            "created_at": datetime.utcnow().isoformat()
        }
        
        response = supabase.table("expenses").insert(expense_data).execute()
        
        return {
            "success": True,
            "data": response.data[0] if response.data else None
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"创建失败: {str(e)}")

@router.get("/trip/{trip_id}", response_model=dict)
async def get_trip_expenses(
    trip_id: str,
    current_user = Depends(get_current_user)
):
    """获取某个行程的所有费用记录"""
    try:
        response = supabase.table("expenses")\
            .select("*")\
            .eq("trip_id", trip_id)\
            .eq("user_id", current_user.id)\
            .order("expense_date", desc=True)\
            .execute()
        
        return {
            "success": True,
            "data": response.data
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"获取失败: {str(e)}")

@router.get("/trip/{trip_id}/summary", response_model=dict)
async def get_expense_summary(
    trip_id: str,
    current_user = Depends(get_current_user)
):
    """获取费用汇总统计"""
    try:
        response = supabase.table("expenses")\
            .select("*")\
            .eq("trip_id", trip_id)\
            .eq("user_id", current_user.id)\
            .execute()
        
        expenses = response.data
        
        # 按类别统计
        summary = {
            "total": 0,
            "by_category": {}
        }
        
        for expense in expenses:
            category = expense["category"]
            amount = expense["amount"]
            summary["total"] += amount
            summary["by_category"][category] = summary["by_category"].get(category, 0) + amount
        
        return {
            "success": True,
            "data": summary
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"统计失败: {str(e)}")

@router.delete("/{expense_id}", response_model=dict)
async def delete_expense(
    expense_id: str,
    current_user = Depends(get_current_user)
):
    """删除费用记录"""
    try:
        response = supabase.table("expenses")\
            .delete()\
            .eq("id", expense_id)\
            .eq("user_id", current_user.id)\
            .execute()
        
        return {
            "success": True,
            "message": "删除成功"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"删除失败: {str(e)}")
