from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from ..database import get_db
from ..models.food_log import FoodLog
from ..schemas.food_log import FoodLogCreate, FoodLogResponse
from ..utils.auth import get_current_user
from ..models.user import User

router = APIRouter()

@router.post("/food-log", response_model=FoodLogResponse)
async def create_food_log(
    food_log: FoodLogCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_food_log = FoodLog(
        user_id=current_user.id,
        **food_log.model_dump()
    )
    db.add(db_food_log)
    db.commit()
    db.refresh(db_food_log)
    return db_food_log

@router.get("/food-log", response_model=List[FoodLogResponse])
async def get_food_logs(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    food_logs = db.query(FoodLog).filter(FoodLog.user_id == current_user.id).all()
    return food_logs 