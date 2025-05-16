from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import engine, Base
from app.routes import auth, macro, food, food_log

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Fitness App API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, tags=["authentication"])
app.include_router(macro.router, tags=["macros"])
app.include_router(food.router, prefix="/api", tags=["food"])
app.include_router(food_log.router, prefix="/api", tags=["food_log"])

@app.get("/")
async def root():
    return {"message": "Welcome to the Fitness App API"} 