from pydantic import BaseModel

class MacroBase(BaseModel):
    total_calories: int
    protein: float
    carbs: float
    fat: float

class MacroCreate(MacroBase):
    pass

class MacroResponse(MacroBase):
    class Config:
        from_attributes = True