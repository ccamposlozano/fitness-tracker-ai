import os
import joblib
import pandas as pd
import numpy as np
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

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

    # Input: [age, gender, weight, height]
    X = pd.DataFrame([{
        'RIDAGEYR': current_user.age,
        'RIAGENDR': gender_num,
        'BMXWT': current_user.weight,
        'BMXHT': current_user.height
    }])

    # Predict
    y_pred = model.predict(X)[0]
    y_pred[0] = np.exp(y_pred[0])  # Inverse log-transform calories

    # Apply activity level multiplier (PAL-based)
    activity_multipliers = {
        "sedentary": 1.2,
        "light": 1.375,
        "moderate": 1.55,
        "very active": 1.725,
        "extra active": 1.9
    }
    activity_key = current_user.activity_level.strip().lower()
    activity_multiplier = activity_multipliers.get(activity_key, 1.2)
    y_pred[0] *= activity_multiplier  # Adjust calories

    # Apply fitness goal adjustment
    goal = current_user.fitness_goal.strip().lower()
    if goal == "gain_muscle":
        y_pred[0] *= 1.10  # +10% calories
        y_pred[1] *= 1.20  # +20% protein
    elif goal == "lose_fat":
        y_pred[0] *= 0.85  # -15% calories
        y_pred[1] *= 1.05

    # Convert to integers
    total_calories, protein, carbs, fat = map(int, y_pred)

    return MacroResponse(
        total_calories=total_calories,
        protein=protein,
        carbs=carbs,
        fat=fat
    )
