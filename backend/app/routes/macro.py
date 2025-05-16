import os
import joblib
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from ..database import get_db
from ..models.user import User
from ..models.macro import Macro
from ..schemas.macro import MacroCreate, MacroResponse
from ..utils.auth import get_current_user

router = APIRouter()

# Load model once at startup
dir_path = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
model_path = os.path.join(dir_path, 'model/macro_predictor.pkl')
model = joblib.load(model_path)

@router.post("/macro", response_model=MacroResponse)
async def calculate_macros(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Convert gender to numeric (1=male, 2=female)
    gender_num = 1 if current_user.gender.lower() == "male" else 2
    
    # Prepare input in the order: age, gender, weight, height
    X = [[current_user.age, gender_num, current_user.weight, current_user.height]]
    
    # Predict
    y_pred = model.predict(X)[0]
    total_calories, protein, carbs, fat = map(int, y_pred)
    
    return MacroResponse(
        total_calories=total_calories,
        protein=protein,
        carbs=carbs,
        fat=fat
    ) 