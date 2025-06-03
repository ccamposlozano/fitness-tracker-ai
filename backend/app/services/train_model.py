import os
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from sklearn.ensemble import HistGradientBoostingRegressor
from sklearn.ensemble import HistGradientBoostingRegressor
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.multioutput import MultiOutputRegressor
from sklearn.metrics import mean_squared_error, r2_score
import joblib

# Paths
DATA_PATH = os.path.join(os.path.dirname(__file__), '../data/nhanes_cleaned.csv')
MODEL_PATH = os.path.join(os.path.dirname(__file__), '../model/macro_predictor.pkl')

# Load data
df = pd.read_csv(DATA_PATH)

# 👀 Optional: Visualize raw calorie distribution
plt.hist(df['DR1TKCAL'], bins=50)
plt.title("Distribution of Calories")
plt.xlabel("Calories")
plt.ylabel("Frequency")
plt.show()

# Features
X = df[['RIDAGEYR', 'RIAGENDR', 'BMXWT', 'BMXHT']]
y = df[['DR1TKCAL', 'DR1TPROT', 'DR1TCARB', 'DR1TTFAT']]

# Split
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.1, random_state=42
)

# Train model
print("🤖 Training HistGradientBoostingRegressor model...")
model = MultiOutputRegressor(HistGradientBoostingRegressor(random_state=42))
model.fit(X_train, y_train)

# Predict
y_pred = model.predict(X_test)

# Evaluate
mse = mean_squared_error(y_test, y_pred)
r2 = r2_score(y_test, y_pred)

print("✅ Evaluation on Test Set:")
print(f"  • Mean Squared Error: {mse:.2f}")
print(f"  • R² Score: {r2:.2f}")

cv_scores = cross_val_score(model, X, y, cv=5, scoring='r2')
print(f"  • Cross-Validated R²: {cv_scores.mean():.2f}")

# Save model
os.makedirs(os.path.dirname(MODEL_PATH), exist_ok=True)
joblib.dump(model, MODEL_PATH)
print(f"\n✅ Model trained and saved to: {MODEL_PATH}")
