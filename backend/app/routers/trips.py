from fastapi import APIRouter, Depends, HTTPException
from typing import List
from app.models import TripCreate, TripUpdate, TripResponse
from app.database import supabase
from app.auth import get_current_user
from datetime import datetime

router = APIRouter(prefix="/api/trips", tags=["Trips"])

@router.post("/", response_model=dict)
async def create_trip(
    trip: TripCreate,
    current_user = Depends(get_current_user)
):
    """创建新的旅行计划"""
    try:
        print(f"收到保存请求，用户ID: {current_user.id}")
        print(f"行程标题: {trip.title}")
        
        trip_data = {
            "user_id": current_user.id,
            "title": trip.title,
            "destination": trip.destination,
            "start_date": trip.start_date.isoformat(),
            "end_date": trip.end_date.isoformat(),
            "budget": trip.budget,
            "travelers": trip.travelers,
            "preferences": trip.preferences,
            "itinerary": trip.itinerary,
            "budget_breakdown": trip.budget_breakdown,
            "created_at": datetime.utcnow().isoformat(),
            "updated_at": datetime.utcnow().isoformat()
        }
        
        response = supabase.table("trips").insert(trip_data).execute()
        
        return {
            "success": True,
            "data": response.data[0] if response.data else None
        }
    except Exception as e:
        import traceback
        print(f"保存失败: {str(e)}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"创建失败: {str(e)}")

@router.get("/", response_model=dict)
async def get_trips(
    current_user = Depends(get_current_user)
):
    """获取用户的所有旅行计划"""
    try:
        response = supabase.table("trips")\
            .select("*")\
            .eq("user_id", current_user.id)\
            .order("created_at", desc=True)\
            .execute()
        
        return {
            "success": True,
            "data": response.data
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"获取失败: {str(e)}")

@router.get("/{trip_id}", response_model=dict)
async def get_trip(
    trip_id: str,
    current_user = Depends(get_current_user)
):
    """获取单个旅行计划详情"""
    try:
        response = supabase.table("trips")\
            .select("*")\
            .eq("id", trip_id)\
            .eq("user_id", current_user.id)\
            .execute()
        
        if not response.data:
            raise HTTPException(status_code=404, detail="行程不存在")
        
        return {
            "success": True,
            "data": response.data[0]
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"获取失败: {str(e)}")

@router.put("/{trip_id}", response_model=dict)
async def update_trip(
    trip_id: str,
    trip_update: TripUpdate,
    current_user = Depends(get_current_user)
):
    """更新旅行计划"""
    try:
        update_data = {
            "updated_at": datetime.utcnow().isoformat()
        }
        
        if trip_update.title:
            update_data["title"] = trip_update.title
        if trip_update.itinerary:
            update_data["itinerary"] = trip_update.itinerary
        if trip_update.budget_breakdown:
            update_data["budget_breakdown"] = trip_update.budget_breakdown
        
        response = supabase.table("trips")\
            .update(update_data)\
            .eq("id", trip_id)\
            .eq("user_id", current_user.id)\
            .execute()
        
        if not response.data:
            raise HTTPException(status_code=404, detail="行程不存在")
        
        return {
            "success": True,
            "data": response.data[0]
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"更新失败: {str(e)}")

@router.delete("/{trip_id}", response_model=dict)
async def delete_trip(
    trip_id: str,
    current_user = Depends(get_current_user)
):
    """删除旅行计划"""
    try:
        response = supabase.table("trips")\
            .delete()\
            .eq("id", trip_id)\
            .eq("user_id", current_user.id)\
            .execute()
        
        return {
            "success": True,
            "message": "删除成功"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"删除失败: {str(e)}")
