SmartFit – AI-Powered Fitness Tracker 💪🧠

SmartFit is a full-stack fitness app designed to help users track food, calculate macros, and achieve their nutrition goals. Built with React and FastAPI, this solo project integrates AI to provide personalized macro recommendations based on user data.


 🧩 Features

- 🔐 User Authentication (Register/Login)
- 🍎 Food Logging with calorie, protein, carbs, and fat tracking
- 🤖 AI-Powered Macro Recommendation System**
- 📊 Dashboard with personalized nutrition breakdowns
- 🔎 Food Search using USDA FoodData Central API
- ⚙️ FastAPI Backend + SQLite Database
- 🧼 Clean UI with Tailwind CSS and React Context


🛠 Tech Stack

Frontend:
- React (TypeScript)
- Tailwind CSS
- Vite

Backend:
- FastAPI (Python)
- SQLite + SQLAlchemy
- Pydantic
- USDA API

AI/ML:
- Trained model for macro predictions (coming soon)

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

📦 Folder Structure
smartfit-app/
├── backend/
│   ├── app/
│   ├── models/
│   ├── routes/
│   ├── schemas/
│   └── main.py
├── frontend/
│   ├── src/
│   ├── components/
│   ├── pages/
│   └── App.tsx

📈 Future Improvements

🔍 Add image-based food recognition for automatic logging
📱 Mobile responsiveness
💬 AI chatbot for fitness tips
🌍 Deploy to Vercel and Render (or other platforms)
🙋‍♂️ About Me

This is a solo personal project built to deepen my skills in:

Full-stack development
Machine learning integration
API design and authentication
Feel free to connect or give feedback!

📜 License

MIT License – use it, fork it, build on it!





