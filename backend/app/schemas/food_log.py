from pydantic import BaseModel

class FoodLogBase(BaseModel):
    food_name: str
    calories: float
    protein: float
    carbs: float
    fat: float

class FoodLogCreate(FoodLogBase):
    pass

class FoodLogResponse(FoodLogBase):
    id: int
    user_id: int

    class Config:
        from_attributes = True 