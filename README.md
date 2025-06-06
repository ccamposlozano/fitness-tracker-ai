# SmartFit – AI-Powered Fitness Tracker 💪🧠

**SmartFit** is a full-stack fitness tracker that helps users log meals, monitor progress, and receive personalized daily macro recommendations. Built with **React**, **FastAPI**, and a trained **machine learning model**, SmartFit offers tailored nutrition goals based on each user's age, gender, height, weight, and activity level.

---

## 🔍 Features

- 🔐 Secure user authentication (register/login)
- 🍽️ Food logging with calorie and macronutrient breakdowns
- 🤖 AI-powered macro recommendation engine (ML model)
- 📊 Dashboard with real-time progress vs. daily targets
- 🔎 Food search via USDA FoodData Central API
- 🧼 Clean, responsive UI with Tailwind CSS and React Context
- ⚙️ FastAPI backend with SQLite and SQLAlchemy

---

## ⚙️ Tech Stack

**Frontend**:
- React (TypeScript)
- Tailwind CSS
- Vite

**Backend**:
- FastAPI
- SQLite + SQLAlchemy
- JWT Authentication
- Pydantic

**Machine Learning**:
- Python (Pandas, scikit-learn, joblib)
- `MultiOutputRegressor` with `RandomForestRegressor` and `HistGradientBoostingRegressor`
- Trained on real dietary data from the **NHANES** dataset

---

## 🧠 Machine Learning Overview

SmartFit integrates a complete ML pipeline into the product experience:

- 🔄 Cleaned and preprocessed NHANES `.XPT` files (dietary survey data)
- 📉 Removed calorie outliers (1000–4500 kcal/day) to reduce noise
- 🧪 Performed model selection, cross-validation, and hyperparameter tuning
- 🔁 Experimented with log-transformation and activity level features
- ✅ Final model: RandomForestRegressor using 4 input features (age, gender, weight, height)
- 📊 R² ≈ 0.07 on test set (modest due to real-world variability)

Although performance is limited by noisy input data, the project demonstrates **end-to-end ML deployment**, from preprocessing to API integration and real-time use in a full-stack app.

---

## 🚀 Getting Started

1. **Clone the repository**

git clone https://github.com/ccamposlozano/fitness-tracker-ai.git
cd fitness-tracker-ai


2. **Setup the backend**
<pre> ```bash cd backend python -m venv venv source venv/bin/activate ``` </pre>
- source venv/bin/activate  # On Windows: venv\Scripts\activate
- pip install -r requirements.txt
- uvicorn app.main:app --reload

3. **Setup frontend**
- cd frontend
- npm install
- npm run dev

## 📁 Project Structure
<pre>  
SmartFit/
├── backend/
│ ├── app/
│ │ ├── data/ # NHANES dataset and cleaning scripts
│ │ ├── model/ # Trained ML model (.pkl)
│ │ ├── routes/ # API endpoints
│ │ ├── schemas/ # Pydantic models
│ │ ├── services/ # Macro calculations and logic
│ │ ├── utils/ # Helper utilities
│ │ └── main.py # FastAPI entry point
│ └── requirements.txt
│
├── frontend/
│ ├── src/
│ │ ├── api/ # API functions (frontend-backend connection)
│ │ ├── components/ # UI components
│ │ ├── context/ # Global auth and app context
│ │ ├── pages/ # Dashboard, Food Log, Auth pages
│ │ └── main.tsx
│ └── tailwind.config.js
│
├── scripts/ # ML preprocessing and analysis
│ ├── clean_nhanes.py
│ ├── visualize_predictions.py
│ └── outputs/ # Prediction visualizations
│
├── README.md
├── CHANGELOG.md
└── structure.txt
</pre>


## 📈 Future Improvements

- 🔍 Add image-based food recognition for automatic logging
- 🧠 Improve ML accuracy with more features (e.g. dietary recall, mealtimes)
- 💬 Add an AI chatbot for coaching and questions
- ☁️ Deploy backend to Render and frontend to Vercel
- 📱 Add full mobile responsiveness
- Add weight tracking feature and historical progress chart
- Create demo user with pre-filled log data

---

This is a solo project built to sharpen my skills in:

- Full-stack web development (React + FastAPI)
- Machine learning integration and deployment
- API design, authentication, and data engineering
- Real-world product thinking and user experience

Feel free to connect or share feedback — I’d love to hear from you!

---

## 📜 License

MIT License – use it, fork it, build on it!