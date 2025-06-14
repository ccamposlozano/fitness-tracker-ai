import axios from 'axios';
import { UserCreate, Token, User, MacroResponse } from '../types';

const API_URL = 'https://smartfit-backend.onrender.com';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const register = async (userData: UserCreate): Promise<Token> => {
  const response = await api.post<Token>('/register', userData);
  return response.data;
};

export const login = async (email: string, password: string): Promise<Token> => {
  const params = new URLSearchParams();
  params.append('username', email); 
  params.append('password', password);

  const response = await axios.post<Token>(`${API_URL}/token`, params, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });

  return response.data;
};


export const getProfile = async (): Promise<User> => {
  const response = await api.get<User>('/me');
  return response.data;
};

export const getMacros = async (): Promise<MacroResponse> => {
  const response = await api.post<MacroResponse>('/macro');
  return response.data;
};

export interface FoodItem {
  food_name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface RawFoodItem {
  name: string;
  calories: number | string;
  protein: number | string;
  carbs: number | string;
  fat: number | string;
}

export interface LoggedFood extends FoodItem {
  id: string;
  logged_at: string;
  grams: number;
}

export const getLoggedFoods = async (): Promise<LoggedFood[]> => {
  const response = await api.get<LoggedFood[]>('/api/food-log');
  return response.data;
};

export const searchFoods = async (query: string): Promise<FoodItem[]> => {
  const response = await api.get<RawFoodItem[]>(`/api/search-foods?query=${encodeURIComponent(query)}`);
  return response.data.map((item) => ({
    food_name: item.name,
    calories: parseFloat(String(item.calories)) || 0,
    protein: parseFloat(String(item.protein)) || 0,
    carbs: parseFloat(String(item.carbs)) || 0,
    fat: parseFloat(String(item.fat)) || 0,
  }));
};

export const logFood = async (food: FoodItem, grams: number = 100): Promise<void> => {
  const cleaned = {
    food_name: food.food_name,
    calories: (parseFloat(String(food.calories)) * grams) / 100,
    protein: (parseFloat(String(food.protein)) * grams) / 100,
    carbs: (parseFloat(String(food.carbs)) * grams) / 100,
    fat: (parseFloat(String(food.fat)) * grams) / 100,
    grams: grams,
  };

  await api.post('/api/food-log', cleaned);
};

export const updateFoodLog = async (id: string, food: FoodItem, grams: number): Promise<void> => {
  const cleaned = {
    food_name: food.food_name,
    calories: (parseFloat(String(food.calories)) * grams) / 100,
    protein: (parseFloat(String(food.protein)) * grams) / 100,
    carbs: (parseFloat(String(food.carbs)) * grams) / 100,
    fat: (parseFloat(String(food.fat)) * grams) / 100,
    grams: grams,
  };

  await api.put(`/api/food-log/${id}`, cleaned);
};

export const deleteFoodLog = async (id: string): Promise<void> => {
  await api.delete(`/api/food-log/${id}`);
}; 