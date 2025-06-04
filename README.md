# SmartFit – AI-Powered Fitness Tracker 💪🧠

SmartFit is a full-stack fitness tracker that helps users log meals, calculate daily macros, and monitor their nutritional progress. Built with React, FastAPI, and a trained machine learning model, SmartFit offers personalized macro recommendations based on user data such as age, gender, weight, height, and activity level.

---

## 🧩 Features

- 🔐 Secure user authentication (register/login)
- 🍽️ Food logging with calories, protein, carbs, and fat
- 🤖 AI-powered macro recommendation engine (ML model)
- 📊 Dashboard with personalized macro targets and progress chart
- 🔎 Food search via USDA FoodData Central API
- 🧼 Clean, responsive UI built with Tailwind CSS and React Context
- 📦 Fully functional FastAPI backend with SQLite and SQLAlchemy

---

## ⚙️ Tech Stack

**Frontend**:
- React (TypeScript)
- Tailwind CSS
- Vite

**Backend**:
- FastAPI
- SQLite + SQLAlchemy
- Pydantic
- JWT Authentication

**Machine Learning**:
- Python (Pandas, scikit-learn, joblib)
- MultiOutputRegressor with RandomForestRegressor or HistGradientBoostingRegressor
- Trained on real NHANES dietary data

---

## 🧠 Machine Learning Overview

SmartFit includes a fully integrated machine learning pipeline:

- 🔄 Data cleaning and preprocessing from NHANES datasets (SAS `.XPT` files)
- 🧼 Outlier filtering (1000–4500 kcal/day)
- 🧪 Trained multiple models with cross-validation and GridSearch
- 🔁 Tried log-transformation and added physical activity as input features
- 🧪 Final model: RandomForestRegressor with 4 input features (age, gender, height, weight)
- 📉 R² ~ 0.07 on test set (limited by real-world data noise)

Despite modest performance, the model demonstrates end-to-end deployment of a real ML predictor into a working product.

---

 🚀 Getting Started

 1. Clone the repository

bash
git clone https://github.com/ccamposlozano/fitness-tracker-ai.git
cd smartfit-app

2. Setup the backend
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload

3. Setup frontend
cd frontend
npm install
npm run dev

<pre> ``` 📦 Folder Structure
smartfit-app/
├── backend/
│   ├── app/
│   │   ├── data/
│   │   ├── model/
│   │   ├── routes/
│   │   ├── schemas/
│   │   ├── services/
│   │   ├── utils/
│   │   └── main.py
│   ├── scripts/
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   └── api/
│   └── App.tsx ``` </pre>


📈 Future Improvements

🔍 Add image-based food recognition for automatic logging
🧠 Improve ML accuracy with more features (e.g. dietary recall, mealtimes)
💬 Add an AI chatbot for coaching and questions
☁️ Deploy backend to Render and frontend to Vercel
📱 Add full mobile responsiveness

This is a solo project built to sharpen my skills in:

Full-stack web development (React + FastAPI)
Machine learning integration and deployment
API design, authentication, and data engineering
Real-world product thinking and user experience
Feel free to connect or share feedback — I’d love to hear from you!

📜 License

MIT License – use it, fork it, build on it!