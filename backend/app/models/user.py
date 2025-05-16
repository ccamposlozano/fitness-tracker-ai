from sqlalchemy import Column, Integer, String, Float
from sqlalchemy.orm import relationship
from ..database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    
    # Profile fields
    age = Column(Integer)
    gender = Column(String)
    weight = Column(Float)
    height = Column(Float)
    activity_level = Column(String)
    fitness_goal = Column(String)

    # Relationships
    macros = relationship("Macro", back_populates="user", uselist=False)
    food_logs = relationship("FoodLog", back_populates="user") 