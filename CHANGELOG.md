# 📘 CHANGELOG – SmartFit AI-Powered Fitness Tracker

## 2025-06-04

### 🧠 Model Refinement – Log-Transform Reinstated + Random Forest Regression

- Reverted to log-transforming `DR1TKCAL` to stabilize calorie distribution after histogram analysis
- Restored RandomForestRegressor due to more consistent performance over HistGradientBoostingRegressor
- GridSearchCV performed over `n_estimators` and `max_depth`
- Final evaluation (using only demographic/body measures):
  - R² Score: 0.07
  - Cross-Validated R²: 0.08
  - MSE: 146,309
  - Best Params: `{'estimator__max_depth': 10, 'estimator__n_estimators': 200}`
- Logged scatterplot of predicted vs actual calories (post log-transform correction)

### ⚙️ Prediction Logic Enhancements (API)

- Updated `/macro` route logic to include:
  - **Inverse log-transform of predicted calories**
  - **Activity level multipliers** based on PAL standards (e.g. 1.55 for “moderate”)
  - **Goal-based calorie/protein adjustments**:
    - `gain_muscle`: +10% kcal, +20% protein
    - `lose_fat`: −15% kcal
- Improved alignment of predicted targets with fitness goals and lifestyle

### 🖥️ Frontend Integration

- Dashboard now displays model-informed macro targets (calories, protein, carbs, fat) based on:
  - Age, gender, weight, height
  - Activity level
  - Selected fitness goal
- Example:
  - User: 29 y/o male, 170 cm, 84 kg, moderate activity, goal = lose weight
  - Predicted: ~3564 kcal (prior to future tuning or capping logic)


## 2025-06-03

### 🔬 Model Experimentation – Physical Activity Features

- Added physical activity variables (`PAD615`, `PAD645`, `PAD680`) from `PAQ_J.XPT` to the cleaned NHANES dataset
- Updated `clean_nhanes.py` to merge and filter these activity features
- Modified `train_model.py` to include these features in the input matrix
- Tuned `HistGradientBoostingRegressor` with GridSearchCV over `learning_rate`, `max_iter`, and `max_depth`
- Result:
  - R² Score: -0.03
  - Cross-Validated R²: -0.01
  - MSE: 175,726
  - Best Params: `{'learning_rate': 0.01, 'max_depth': 3, 'max_iter': 100}`
- Conclusion: Activity features degraded performance in current configuration, likely due to noise or weak correlation with dietary intake

### 🧠 Backend (ML)
- Replaced `RandomForestRegressor` with `HistGradientBoostingRegressor` to simplify pipeline and reduce overfitting risk
- Removed log-transform from calorie target after visualizing mild skew in distribution
- Used default parameters and 4 demographic/body measurement features (age, gender, height, weight)
- Evaluation:
  - R² Score: 0.06
  - Cross-Validated R²: 0.06
  - MSE: 145,209
- Visualized predicted vs actual calories as scatter plot


### 🧠 Backend (ML)
- Tried log-transforming calorie predictions — did not improve performance (R² dropped slightly)
- Documented results with scatterplot and model evaluation
- Enabled timestamped filenames for model prediction plots

## 2025-06-02

### 🧠 Backend (ML)
- Added outlier filtering (1000–4500 kcal)
- Improved MSE significantly
- Added model evaluation metrics (MSE, R²)
- Visualized predicted vs actual calories using matplotlib

## 2025-06-01

### 🧠 Backend (ML)
- Loaded real NHANES data using SAS `.XPT` files
- Merged demographic, body measures, and diet tables
- Trained initial RandomForestRegressor using 4 input features
- Added data cleaning script

## 2025-04-15 → 2025-05-31 — Initial Setup (Backend + Frontend)

### Backend (FastAPI + Auth)
- Implemented user authentication (register, login, token-based auth)
- Set up SQLite database and SQLAlchemy models for users and macros
- Created protected routes with user context for macro predictions
- Connected backend to ML prediction pipeline for calorie/macro output

### Frontend (React + Tailwind)
- Initialized frontend with Vite, React, and TailwindCSS
- Built login/register UI with form validation
- Designed basic dashboard for showing predicted macros
- Connected to backend APIs with Axios
- Set up USDA food logging interface and added fallback for custom entries
