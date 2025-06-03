# 📘 CHANGELOG – SmartFit AI-Powered Fitness Tracker

## 2025-06-03

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
