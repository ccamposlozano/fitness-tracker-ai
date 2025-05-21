import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Plus, Pencil, Trash2 } from 'lucide-react';
import { FoodItem, LoggedFood, getLoggedFoods, searchFoods, logFood, updateFoodLog, deleteFoodLog } from '../api';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { format, isToday as dateFnsIsToday } from 'date-fns';

// Helper function to check if a timestamp is from today
const isToday = (timestamp: string): boolean => {
  const date = new Date(timestamp);
  return dateFnsIsToday(date);
};

export const FoodLog = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<FoodItem[]>([]);
  const [loggedFoods, setLoggedFoods] = useState<LoggedFood[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [grams, setGrams] = useState(100);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [totals, setTotals] = useState({
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
  });

  // Custom food form state
  const [customFood, setCustomFood] = useState({
    food_name: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
    grams: '100',
  });

  useEffect(() => {
    fetchLoggedFoods();
  }, []);

  useEffect(() => {
    const todaysEntries = loggedFoods.filter(food => isToday(food.logged_at));
    const newTotals = todaysEntries.reduce(
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
    setSelectedFood(food);
    setGrams(100);
    setIsDialogOpen(true);
  };

  const handleSubmitLog = async () => {
    if (!selectedFood) return;
    
    setIsLoading(true);
    try {
      await logFood(selectedFood, grams);
      await fetchLoggedFoods();
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error logging food:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateFood = async (food: LoggedFood, newGrams: number) => {
    setIsLoading(true);
    try {
      const baseFood: FoodItem = {
        food_name: food.food_name,
        calories: (food.calories * 100) / food.grams,
        protein: (food.protein * 100) / food.grams,
        carbs: (food.carbs * 100) / food.grams,
        fat: (food.fat * 100) / food.grams,
      };
      await updateFoodLog(food.id, baseFood, newGrams);
      await fetchLoggedFoods();
    } catch (error) {
      console.error('Error updating food:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteFood = async (id: string) => {
    setIsLoading(true);
    try {
      await deleteFoodLog(id);
      await fetchLoggedFoods();
    } catch (error) {
      console.error('Error deleting food:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCustomFoodSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const foodItem: FoodItem = {
        food_name: customFood.food_name,
        calories: parseFloat(customFood.calories),
        protein: parseFloat(customFood.protein),
        carbs: parseFloat(customFood.carbs),
        fat: parseFloat(customFood.fat),
      };
      
      await logFood(foodItem, parseFloat(customFood.grams));
      await fetchLoggedFoods();
      
      // Reset form
      setCustomFood({
        food_name: '',
        calories: '',
        protein: '',
        carbs: '',
        fat: '',
        grams: '100',
      });
    } catch (error) {
      console.error('Error logging custom food:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCustomFoodChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCustomFood(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="space-y-8">

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
            <Button
              onClick={handleSearch}
              disabled={isSearching}
              variant="secondary"
            >
              {isSearching ? <Loader2 className="animate-spin" /> : 'Search'}
            </Button>
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
                      <Button
                        onClick={() => handleLogFood(food)}
                        disabled={isLoading}
                        variant="ghost"
                        size="icon"
                      >
                        <Plus className="h-5 w-5" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Custom Food Form */}
      <Card className="bg-gray-800 border-none">
        <CardHeader>
          <h2 className="text-xl font-semibold text-white">Add Custom Food</h2>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCustomFoodSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-white">Food Name</label>
                <Input
                  type="text"
                  name="food_name"
                  value={customFood.food_name}
                  onChange={handleCustomFoodChange}
                  placeholder="Enter food name"
                  required
                  className="bg-gray-700 border-0 text-white placeholder-gray-400"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-white">Grams (optional)</label>
                <Input
                  type="number"
                  name="grams"
                  value={customFood.grams}
                  onChange={handleCustomFoodChange}
                  placeholder="Enter grams"
                  min="1"
                  step="1"
                  className="bg-gray-700 border-0 text-white placeholder-gray-400"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-white">Calories</label>
                <Input
                  type="number"
                  name="calories"
                  value={customFood.calories}
                  onChange={handleCustomFoodChange}
                  placeholder="Enter calories"
                  required
                  min="0"
                  step="0.1"
                  className="bg-gray-700 border-0 text-white placeholder-gray-400"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-white">Protein (g)</label>
                <Input
                  type="number"
                  name="protein"
                  value={customFood.protein}
                  onChange={handleCustomFoodChange}
                  placeholder="Enter protein"
                  required
                  min="0"
                  step="0.1"
                  className="bg-gray-700 border-0 text-white placeholder-gray-400"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-white">Carbs (g)</label>
                <Input
                  type="number"
                  name="carbs"
                  value={customFood.carbs}
                  onChange={handleCustomFoodChange}
                  placeholder="Enter carbs"
                  required
                  min="0"
                  step="0.1"
                  className="bg-gray-700 border-0 text-white placeholder-gray-400"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-white">Fat (g)</label>
                <Input
                  type="number"
                  name="fat"
                  value={customFood.fat}
                  onChange={handleCustomFoodChange}
                  placeholder="Enter fat"
                  required
                  min="0"
                  step="0.1"
                  className="bg-gray-700 border-0 text-white placeholder-gray-400"
                />
              </div>
            </div>
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? <Loader2 className="animate-spin" /> : 'Add Custom Food'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Logged Foods Section */}
      <Card className="bg-gray-800 border-none">
        <CardHeader>
          <h2 className="text-xl font-semibold text-white">Today's Logged Foods</h2>
        </CardHeader>
        <CardContent>
          {loggedFoods.filter(food => isToday(food.logged_at)).length > 0 ? (
            <div className="space-y-4">
              {loggedFoods.filter(food => isToday(food.logged_at)).map((food) => (
                <Card key={food.id} className="bg-gray-700 border-none">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium text-white">{food.food_name}</h3>
                        <div className="text-sm text-gray-300">
                          {food.calories.toFixed(1)} kcal | P: {food.protein.toFixed(1)}g | C: {food.carbs.toFixed(1)}g | F: {food.fat.toFixed(1)}g
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          {format(new Date(food.logged_at), 'MMM d, yyyy \'at\' h:mm a')} • {food.grams}g
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem onClick={() => handleUpdateFood(food, food.grams * 0.5)}>
                            Half Portion
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleUpdateFood(food, food.grams * 1.5)}>
                            Increase by 50%
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDeleteFood(food.id)} className="text-red-500">
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* Totals */}
              <Card className="bg-gray-600 border-none mt-6">
                <CardContent className="p-4">
                  <h3 className="font-medium text-white mb-2">Daily Totals</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm text-gray-300">
                    <div>Calories: {totals.calories.toFixed(1)} kcal</div>
                    <div>Protein: {totals.protein.toFixed(1)}g</div>
                    <div>Carbs: {totals.carbs.toFixed(1)}g</div>
                    <div>Fat: {totals.fat.toFixed(1)}g</div>
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

      {/* Log Food Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Log Food</DialogTitle>
          </DialogHeader>
          {selectedFood && (
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">{selectedFood.food_name}</h3>
                <div className="text-sm text-gray-500">
                  {selectedFood.calories} kcal | P: {selectedFood.protein}g | C: {selectedFood.carbs}g | F: {selectedFood.fat}g
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Amount (grams)</label>
                <Input
                  type="number"
                  value={grams}
                  onChange={(e) => setGrams(Number(e.target.value))}
                  min="1"
                  step="1"
                />
              </div>
              <div className="text-sm text-gray-500">
                Adjusted values for {grams}g:
                <div className="mt-1">
                  {(selectedFood.calories * grams / 100).toFixed(1)} kcal | P: {(selectedFood.protein * grams / 100).toFixed(1)}g | C: {(selectedFood.carbs * grams / 100).toFixed(1)}g | F: {(selectedFood.fat * grams / 100).toFixed(1)}g
                </div>
              </div>
              <Button
                onClick={handleSubmitLog}
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? <Loader2 className="animate-spin" /> : 'Log Food'}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}; 