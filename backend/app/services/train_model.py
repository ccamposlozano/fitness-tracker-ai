import os
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split, cross_val_score, GridSearchCV
from sklearn.multioutput import MultiOutputRegressor
from sklearn.metrics import mean_squared_error, r2_score
import joblib

# Paths
DATA_PATH = os.path.join(os.path.dirname(__file__), '../data/nhanes_cleaned.csv')
MODEL_PATH = os.path.join(os.path.dirname(__file__), '../model/macro_predictor.pkl')

# Load data
df = pd.read_csv(DATA_PATH)
X = df[['RIDAGEYR', 'RIAGENDR', 'BMXWT', 'BMXHT']]

# 🔁 Log-transform calories
y = df[['DR1TKCAL', 'DR1TPROT', 'DR1TCARB', 'DR1TTFAT']].copy()
y['DR1TKCAL'] = np.log(y['DR1TKCAL'])

# Split data
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.1, random_state=42
)

# Grid search (unchanged)
print("🔍 Running GridSearchCV to find best model...")
param_grid = {
    "estimator__n_estimators": [100, 200],
    "estimator__max_depth": [None, 10, 20]
}
grid_search = GridSearchCV(
    MultiOutputRegressor(RandomForestRegressor(random_state=42)),
    param_grid,
    cv=3,
    scoring="r2",
    n_jobs=-1
)
grid_search.fit(X_train, y_train)
model = grid_search.best_estimator_

# Predict
y_pred = model.predict(X_test)

# 🔁 Inverse log-transform on calorie prediction
y_pred[:, 0] = np.exp(y_pred[:, 0])
y_test_vals = y_test.copy()
y_test_vals['DR1TKCAL'] = np.exp(y_test_vals['DR1TKCAL'])

# Evaluate
mse = mean_squared_error(y_test_vals, y_pred)
r2 = r2_score(y_test_vals, y_pred)

print("✅ Evaluation on Test Set:")
print(f"  • Mean Squared Error: {mse:.2f}")
print(f"  • R² Score: {r2:.2f}")
print(f"  • Best Hyperparameters: {grid_search.best_params_}")

cv_scores = cross_val_score(model, X, y, cv=5, scoring='r2')
print(f"  • Cross-Validated R²: {cv_scores.mean():.2f}")

# Feature importances
print("\n📊 Feature Importances (avg over outputs):")
importances = np.mean([
    tree.feature_importances_ for tree in model.estimators_
], axis=0)
for name, score in zip(X.columns, importances):
    print(f"  • {name}: {score:.4f}")

# Save
os.makedirs(os.path.dirname(MODEL_PATH), exist_ok=True)
joblib.dump(model, MODEL_PATH)
print(f"\n✅ Model trained and saved to: {MODEL_PATH}")