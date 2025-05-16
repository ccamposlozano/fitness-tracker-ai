export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'very_active' | 'extra_active';
export type FitnessGoal = 'lose_weight' | 'maintain' | 'gain_muscle';

export interface User {
  id: number;
  username: string;
  email: string;
  age: number;
  gender: string;
  weight: number;
  height: number;
  activity_level: ActivityLevel;
  fitness_goal: FitnessGoal;
}

export interface UserCreate extends Omit<User, 'id'> {
  password: string;
}

export interface Token {
  access_token: string;
  token_type: string;
}

export interface MacroResponse {
  total_calories: number;
  protein: number;
  carbs: number;
  fat: number;
} 