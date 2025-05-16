import os
import requests
from typing import List, Dict, Any
from dotenv import load_dotenv

load_dotenv()

USDA_API_KEY = os.getenv('USDA_API_KEY')
USDA_API_URL = 'https://api.nal.usda.gov/fdc/v1/foods/search'

def search_foods(query: str) -> List[Dict[str, Any]]:
    """
    Search for foods using the USDA FoodData Central API.
    
    Args:
        query (str): The search query (e.g., "apple")
        
    Returns:
        List[Dict[str, Any]]: List of simplified food items with nutritional information
    """
    if not USDA_API_KEY:
        raise ValueError("USDA_API_KEY environment variable is not set")

    params = {
        'api_key': USDA_API_KEY,
        'query': query,
        'pageSize': 10,
        'dataType': ['Survey (FNDDS)'],
        'sortBy': 'dataType.keyword',
        'sortOrder': 'asc'
    }

    try:
        response = requests.get(USDA_API_URL, params=params)
        response.raise_for_status()
        data = response.json()

        foods = []
        for food in data.get('foods', []):
            # Extract nutrients
            nutrients = {item['nutrientName']: item['value'] for item in food.get('foodNutrients', [])}
            
            # Create simplified food item
            food_item = {
                'name': food.get('description', ''),
                'calories': nutrients.get('Energy', 0),
                'protein': nutrients.get('Protein', 0),
                'carbs': nutrients.get('Carbohydrate, by difference', 0),
                'fat': nutrients.get('Total lipid (fat)', 0)
            }
            foods.append(food_item)

        return foods

    except requests.exceptions.RequestException as e:
        raise Exception(f"Error fetching data from USDA API: {str(e)}") 