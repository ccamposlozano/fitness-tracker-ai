from pydantic import BaseModel
from datetime import datetime

# ✅ Enforce that responses always return a real timestamp
class FoodLogBase(BaseModel):
    food_name: str
    calories: float
    protein: float
    carbs: float
    fat: float
    grams: float = 100.0

class FoodLogCreate(FoodLogBase):
    # Optional: Let users provide a date if they’re back-logging food
    logged_at: datetime | None = None

class FoodLogResponse(FoodLogBase):
    id: int
    user_id: int
    logged_at: datetime  # ✅ Require a real datetime in responses

    class Config:
        from_attributes = True
