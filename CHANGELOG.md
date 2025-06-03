# 📘 CHANGELOG – SmartFit AI-Powered Fitness Tracker

## 2025-06-03
- Tried log-transforming calorie predictions — did not improve performance (R² dropped slightly)
- Documented results with scatterplot and model evaluation
- Enabled timestamped filenames for model prediction plots

## 2025-06-02
- Added outlier filtering (1000–4500 kcal)
- Improved MSE significantly
- Added model evaluation metrics (MSE, R²)
- Visualized predicted vs actual calories using matplotlib

## 2025-06-01
- Loaded real NHANES data using SAS `.XPT` files
- Merged demographic, body measures, and diet tables
- Trained initial RandomForestRegressor using 4 input features
