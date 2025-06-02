import pandas as pd
import os

# Set paths
base_dir = os.path.dirname(os.path.abspath(__file__))
raw_dir = os.path.join(base_dir, '../backend/app/data/nhanes_raw')
save_path = os.path.join(base_dir, '../backend/app/data/nhanes_cleaned.csv')

# Load raw NHANES files
demo = pd.read_sas(os.path.join(raw_dir, 'DEMO_J.XPT'))
bmx = pd.read_sas(os.path.join(raw_dir, 'BMX_J.XPT'))
diet = pd.read_sas(os.path.join(raw_dir, 'DR1TOT_J.XPT'))

# Merge by SEQN (participant ID)
df = demo.merge(bmx, on='SEQN').merge(diet, on='SEQN')

# Select relevant features
df_clean = df[['RIDAGEYR', 'RIAGENDR', 'BMXWT', 'BMXHT',
               'DR1TKCAL', 'DR1TPROT', 'DR1TCARB', 'DR1TTFAT']]

# Drop rows with missing values
df_clean = df_clean.dropna()

# Save final clean dataset
df_clean.to_csv(save_path, index=False)

print(f"✅ Cleaned data saved to: {save_path}")
