import os
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from sklearn.ensemble import HistGradientBoostingRegressor
from sklearn.model_selection import train_test_split, cross_val_score, GridSearchCV
from sklearn.multioutput import MultiOutputRegressor
from sklearn.metrics import mean_squared_error, r2_score
import joblib

# Paths
DATA_PATH = os.path.join(os.path.dirname(__file__), '../data/nhanes_cleaned.csv')
MODEL_PATH = os.path.join(os.path.dirname(__file__), '../model/macro_predictor.pkl')

# Load data
df = pd.read_csv(DATA_PATH)


# Feature set (including activity level)
X = df[['RIDAGEYR', 'RIAGENDR', 'BMXWT', 'BMXHT',
        'PAD615', 'PAD645', 'PAD680']]
y = df[['DR1TKCAL', 'DR1TPROT', 'DR1TCARB', 'DR1TTFAT']]

# Split data
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.1, random_state=42
)

# 🔍 Grid search for best model
print("🔍 Running GridSearchCV to tune model...")

param_grid = {
    'estimator__max_iter': [100, 200],
    'estimator__max_depth': [3, 5, 10],
    'estimator__learning_rate': [0.01, 0.1]
}

base_model = MultiOutputRegressor(HistGradientBoostingRegressor(random_state=42))
grid_search = GridSearchCV(
    base_model,
    param_grid,
    cv=3,
    scoring='r2',
    n_jobs=-1,
    verbose=1
)
grid_search.fit(X_train, y_train)
model = grid_search.best_estimator_

# Predict
y_pred = model.predict(X_test)

# Evaluate
mse = mean_squared_error(y_test, y_pred)
r2 = r2_score(y_test, y_pred)

print("✅ Evaluation on Test Set:")
print(f"  • Mean Squared Error: {mse:.2f}")
print(f"  • R² Score: {r2:.2f}")
print(f"  • Best Hyperparameters: {grid_search.best_params_}")

cv_scores = cross_val_score(model, X, y, cv=5, scoring='r2')
print(f"  • Cross-Validated R²: {cv_scores.mean():.2f}")

# Save model
os.makedirs(os.path.dirname(MODEL_PATH), exist_ok=True)
joblib.dump(model, MODEL_PATH)
print(f"\n✅ Model trained and saved to: {MODEL_PATH}")
