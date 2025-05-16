from sqlalchemy import Column, Integer, Float, ForeignKey
from sqlalchemy.orm import relationship

from ..database import Base

class Macro(Base):
    __tablename__ = "macros"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    total_calories = Column(Integer)
    protein = Column(Float)
    carbs = Column(Float)
    fat = Column(Float)

    # Relationship with User
    user = relationship("User", back_populates="macros") 