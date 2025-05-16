import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.multioutput import MultiOutputRegressor
import joblib
import os

# Paths
DATA_PATH = os.path.join(os.path.dirname(__file__), '../data/nhanes_cleaned.csv')
MODEL_PATH = os.path.join(os.path.dirname(__file__), '../model/macro_predictor.pkl')

# Load data
# Columns: RIDAGEYR, RIAGENDR, BMXWT, BMXHT, DR1TKCAL, DR1TPROT, DR1TCARB, DR1TTFAT
df = pd.read_csv(DATA_PATH)

# Features and targets
X = df[['RIDAGEYR', 'RIAGENDR', 'BMXWT', 'BMXHT']]
y = df[['DR1TKCAL', 'DR1TPROT', 'DR1TCARB', 'DR1TTFAT']]

# Train/test split (not strictly needed for saving model, but good practice)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.1, random_state=42)

# Train model
model = MultiOutputRegressor(RandomForestRegressor(n_estimators=100, random_state=42))
model.fit(X_train, y_train)

# Save model
os.makedirs(os.path.dirname(MODEL_PATH), exist_ok=True)
joblib.dump(model, MODEL_PATH)

print(f"Model trained and saved to {MODEL_PATH}") 