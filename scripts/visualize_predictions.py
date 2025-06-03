import os
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import joblib
from sklearn.model_selection import train_test_split
from datetime import datetime

# Paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = os.path.join(BASE_DIR, '../backend/app/data/nhanes_cleaned.csv')
MODEL_PATH = os.path.join(BASE_DIR, '../backend/app/model/macro_predictor.pkl')

# Get current date for versioned output

timestamp_str = datetime.now().strftime('%Y-%m-%d_%H-%M-%S')  # Example: 2025-06-03_14-22-35
OUTPUT_DIR = os.path.join(BASE_DIR, 'outputs')
OUTPUT_FILENAME = f'predicted_vs_actual_calories_{timestamp_str}.png'
OUTPUT_PATH = os.path.join(OUTPUT_DIR, OUTPUT_FILENAME)

# Load data
df = pd.read_csv(DATA_PATH)

# Features and target
X = df[['RIDAGEYR', 'RIAGENDR', 'BMXWT', 'BMXHT']]
y = df[['DR1TKCAL']]

# Train/test split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.1, random_state=42)

# Load trained model
model = joblib.load(MODEL_PATH)

# Predict
y_pred = model.predict(X_test)
y_true = y_test.values.flatten()
y_pred_cal = y_pred[:, 0] if y_pred.ndim > 1 else y_pred

# Create scatterplot
plt.figure(figsize=(8, 6))
plt.scatter(y_true, y_pred_cal, alpha=0.5, color='teal')
plt.plot([y_true.min(), y_true.max()], [y_true.min(), y_true.max()], 'r--', label='Perfect prediction')
plt.xlabel("Actual Calories")
plt.ylabel("Predicted Calories")
plt.title("Predicted vs Actual Calories")
plt.grid(True)
plt.legend()
plt.tight_layout()

# Save the plot
os.makedirs(OUTPUT_DIR, exist_ok=True)
plt.savefig(OUTPUT_PATH)
print(f"✅ Plot saved to {OUTPUT_PATH}")
