from pydantic import BaseModel, EmailStr
from enum import Enum

class ActivityLevel(str, Enum):
    SEDENTARY = "sedentary"
    LIGHT = "light"
    MODERATE = "moderate"
    VERY_ACTIVE = "very_active"
    EXTRA_ACTIVE = "extra_active"

class FitnessGoal(str, Enum):
    LOSE_WEIGHT = "lose_weight"
    MAINTAIN = "maintain"
    GAIN_MUSCLE = "gain_muscle"

class UserBase(BaseModel):
    username: str
    email: EmailStr
    age: int
    gender: str
    weight: float  # in kg
    height: float  # in cm
    activity_level: ActivityLevel
    fitness_goal: FitnessGoal

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: str | None = None 