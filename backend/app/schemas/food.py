from pydantic import BaseModel

class FoodItem(BaseModel):
    name: str
    calories: float
    protein: float
    carbs: float
    fat: float 