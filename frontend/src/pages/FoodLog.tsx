import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import { FoodItem, LoggedFood, getLoggedFoods, searchFoods, logFood } from '../api';

export const FoodLog = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<FoodItem[]>([]);
  const [loggedFoods, setLoggedFoods] = useState<LoggedFood[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [totals, setTotals] = useState({
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
  });

  useEffect(() => {
    fetchLoggedFoods();
  }, []);

  useEffect(() => {
    // Calculate totals whenever loggedFoods changes
    const newTotals = loggedFoods.reduce(
      (acc, food) => ({
        calories: acc.calories + food.calories,
        protein: acc.protein + food.protein,
        carbs: acc.carbs + food.carbs,
        fat: acc.fat + food.fat,
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );
    setTotals(newTotals);
  }, [loggedFoods]);

  const fetchLoggedFoods = async () => {
    try {
      const data = await getLoggedFoods();
      setLoggedFoods(data);
    } catch (error) {
      console.error('Error fetching logged foods:', error);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    try {
      const data = await searchFoods(searchQuery);
      setSearchResults(data);
    } catch (error) {
      console.error('Error searching foods:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleLogFood = async (food: FoodItem) => {
    setIsLoading(true);
    try {
      await logFood(food);
      // Refresh logged foods
      await fetchLoggedFoods();
    } catch (error) {
      console.error('Error logging food:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-white">Food Log</h1>

      {/* Search Section */}
      <Card className="bg-gray-800 border-none">
        <CardHeader>
          <h2 className="text-xl font-semibold text-white">Search Foods</h2>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Input
              type="text"
              placeholder="Search for foods..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-gray-700 border-0 text-white placeholder-gray-400"
            />
            <button
              onClick={handleSearch}
              disabled={isSearching}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {isSearching ? <Loader2 className="animate-spin" /> : 'Search'}
            </button>
          </div>

          {searchResults.length > 0 && (
            <div className="mt-4 space-y-2">
              {searchResults.map((food, index) => (
                <Card key={index} className="bg-gray-700 border-none">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium text-white">{food.food_name}</h3>
                        <div className="text-sm text-gray-300">
                          {food.calories} kcal | P: {food.protein}g | C: {food.carbs}g | F: {food.fat}g
                        </div>
                      </div>
                      <button
                        onClick={() => handleLogFood(food)}
                        disabled={isLoading}
                        className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                      >
                        {isLoading ? <Loader2 className="animate-spin" /> : 'Log'}
                      </button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Logged Foods Section */}
      <Card className="bg-gray-800 border-none">
        <CardHeader>
          <h2 className="text-xl font-semibold text-white">Logged Foods</h2>
        </CardHeader>
        <CardContent>
          {loggedFoods.length > 0 ? (
            <div className="space-y-4">
              {loggedFoods.map((food) => (
                <Card key={food.id} className="bg-gray-700 border-none">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium text-white">{food.food_name}</h3>
                        <div className="text-sm text-gray-300">
                          {food.calories} kcal | P: {food.protein}g | C: {food.carbs}g | F: {food.fat}g
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          {new Date(food.logged_at).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* Totals */}
              <Card className="bg-gray-600 border-none mt-6">
                <CardContent className="p-4">
                  <h3 className="font-medium text-white mb-2">Daily Totals</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm text-gray-300">
                    <div>Calories: {totals.calories} kcal</div>
                    <div>Protein: {totals.protein}g</div>
                    <div>Carbs: {totals.carbs}g</div>
                    <div>Fat: {totals.fat}g</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="text-gray-400 text-center py-8">
              No foods logged yet. Search and log some foods to get started!
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}; 