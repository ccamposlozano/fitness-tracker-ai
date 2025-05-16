from fastapi import APIRouter, HTTPException
from typing import List
from ..schemas.food import FoodItem
from ..utils.usda import search_foods

router = APIRouter()

@router.get("/search-foods", response_model=List[FoodItem])
async def search_food_items(query: str):
    """
    Search for foods using the USDA FoodData Central API.
    
    Args:
        query (str): The search query (e.g., "apple")
        
    Returns:
        List[FoodItem]: List of food items with nutritional information
    """
    try:
        foods = search_foods(query)
        return foods
    except ValueError as e:
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error searching foods: {str(e)}") 