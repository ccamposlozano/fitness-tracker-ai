import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register, getProfile, getMacros } from '../api';
import { useAuth } from '../context/AuthContext';
import { ActivityLevel, FitnessGoal } from '../types';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

const activityOptions = [
  { value: 'sedentary', label: 'Sedentary (little or no exercise)' },
  { value: 'light', label: 'Light (exercise 1-3 times/week)' },
  { value: 'moderate', label: 'Moderate (exercise 3-5 times/week)' },
  { value: 'very_active', label: 'Very Active (exercise 6-7 times/week)' },
  { value: 'extra_active', label: 'Extra Active (very intense exercise daily)' },
];

const goalOptions = [
  { value: 'lose_weight', label: 'Lose Weight' },
  { value: 'maintain', label: 'Maintain Weight' },
  { value: 'gain_muscle', label: 'Gain Muscle' },
];

export const Register = () => {
  const navigate = useNavigate();
  const { setUser, setMacros } = useAuth();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const userData = {
      username: formData.get('username') as string,
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      age: parseInt(formData.get('age') as string),
      gender: formData.get('gender') as string,
      weight: parseFloat(formData.get('weight') as string),
      height: parseFloat(formData.get('height') as string),
      activity_level: formData.get('activity_level') as ActivityLevel,
      fitness_goal: formData.get('fitness_goal') as FitnessGoal,
    };

    try {
      const { access_token } = await register(userData);
      localStorage.setItem('token', access_token);
      
      const profile = await getProfile();
      setUser(profile);
      const macros = await getMacros();
      setMacros(macros);
      
      navigate('/dashboard');
    } catch (err) {
      setError('Registration failed. Please try again.');
      console.error('Registration error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-2xl space-y-8">
        <Card className="bg-gray-800 border-none rounded-2xl shadow-xl">
          <CardHeader className="text-center pb-0">
            <h2 className="text-2xl font-bold text-white">Create Account</h2>
            <div className="text-gray-400 text-sm mt-2">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-400 hover:text-blue-300 font-medium">
                Log In
              </Link>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Personal Information */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="username" className="text-white">Username</Label>
                    <Input
                      id="username"
                      name="username"
                      placeholder="Choose a username"
                      autoComplete="username"
                      required
                      className="bg-gray-700 border-0 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-white">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                      autoComplete="email"
                      required
                      className="bg-gray-700 border-0 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-white">Password</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="••••••••"
                      autoComplete="new-password"
                      required
                      className="bg-gray-700 border-0 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gender" className="text-white">Gender</Label>
                    <select
                      id="gender"
                      name="gender"
                      required
                      className="bg-gray-700 border-0 text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>
                </div>
              </div>
              {/* Physical Information */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">
                  Physical Information
                </h3>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="age" className="text-white">Age</Label>
                    <Input
                      id="age"
                      name="age"
                      type="number"
                      placeholder="Your age"
                      min={16}
                      max={100}
                      required
                      className="bg-gray-700 border-0 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="weight" className="text-white">Weight (kg)</Label>
                    <Input
                      id="weight"
                      name="weight"
                      type="number"
                      step="0.1"
                      placeholder="Your weight in kg"
                      min={30}
                      max={300}
                      required
                      className="bg-gray-700 border-0 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="height" className="text-white">Height (cm)</Label>
                    <Input
                      id="height"
                      name="height"
                      type="number"
                      step="0.1"
                      placeholder="Your height in cm"
                      min={100}
                      max={250}
                      required
                      className="bg-gray-700 border-0 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
              {/* Fitness Information */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">
                  Fitness Information
                </h3>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="activity_level" className="text-white">Activity Level</Label>
                    <select
                      id="activity_level"
                      name="activity_level"
                      required
                      className="bg-gray-700 border-0 text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select activity level</option>
                      {activityOptions.map((option) => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fitness_goal" className="text-white">Fitness Goal</Label>
                    <select
                      id="fitness_goal"
                      name="fitness_goal"
                      required
                      className="bg-gray-700 border-0 text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select fitness goal</option>
                      {goalOptions.map((option) => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              {error && (
                <Alert variant="destructive" className="bg-red-900/50 border-red-800 text-red-300">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 text-sm font-medium rounded-lg mt-2"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating account...
                  </span>
                ) : (
                  'Create Account'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
        {/* Terms */}
        <div className="text-center text-xs text-gray-500">
          By creating an account, you agree to our{' '}
          <a href="#" className="text-gray-400 hover:text-gray-300">Terms of Service</a>
          {' '}and{' '}
          <a href="#" className="text-gray-400 hover:text-gray-300">Privacy Policy</a>
        </div>
      </div>
    </div>
  );
}; 