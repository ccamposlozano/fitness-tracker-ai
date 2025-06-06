import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { MacroProgressChart } from '@/components/MacroProgressChart';
import { getLoggedFoods } from '../api';
import { isToday } from 'date-fns';

const MacroCard = ({ title, value, unit }: { title: string; value: number; unit: string }) => (
  <Card className="bg-gray-800 border-none">
    <CardContent className="p-6">
      <dt className="text-sm font-medium text-gray-400 truncate">
        {title}
      </dt>
      <dd className="mt-1 text-3xl font-semibold text-white">
        {value}{unit}
      </dd>
    </CardContent>
  </Card>
);

export const Dashboard = () => {
  const { user, macros } = useAuth();
  const [actualMacros, setActualMacros] = useState({
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
  });

  useEffect(() => {
    const fetchTodayMacros = async () => {
      try {
        const loggedFoods = await getLoggedFoods();
        const todaysEntries = loggedFoods.filter(food => isToday(new Date(food.logged_at)));
        const totals = todaysEntries.reduce(
          (acc, food) => ({
            calories: acc.calories + food.calories,
            protein: acc.protein + food.protein,
            carbs: acc.carbs + food.carbs,
            fat: acc.fat + food.fat,
          }),
          { calories: 0, protein: 0, carbs: 0, fat: 0 }
        );
        setActualMacros(totals);
      } catch (error) {
        console.error('Error fetching today\'s macros:', error);
      }
    };

    fetchTodayMacros();
  }, []);

  const macroChartData = [
    {
      name: 'Calories',
      actual: actualMacros.calories,
      target: macros?.total_calories || 0,
      color: '#3B82F6', // blue
      unit: 'kcal',
    },
    {
      name: 'Protein',
      actual: actualMacros.protein,
      target: macros?.protein || 0,
      color: '#EF4444', // red
      unit: 'g',
    },
    {
      name: 'Carbs',
      actual: actualMacros.carbs,
      target: macros?.carbs || 0,
      color: '#10B981', // green
      unit: 'g',
    },
    {
      name: 'Fat',
      actual: actualMacros.fat,
      target: macros?.fat || 0,
      color: '#F59E0B', // yellow
      unit: 'g',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Profile Section */}
      <Card className="bg-gray-800 border-none">
        <CardHeader>
          <h2 className="text-xl font-semibold text-white">Your Profile</h2>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm text-gray-300">
            <div>Age: {user?.age}</div>
            <div>Gender: {user?.gender}</div>
            <div>Weight: {user?.weight}kg</div>
            <div>Height: {user?.height}cm</div>
            <div>Activity: {user?.activity_level}</div>
            <div>Goal: {user?.fitness_goal}</div>
          </div>
        </CardContent>
      </Card>

      {/* Macros Section */}
      <section>
        <h2 className="text-xl font-semibold mb-4 text-white">Daily Macro Targets</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <MacroCard title="Total Calories" value={macros?.total_calories || 0} unit="kcal" />
          <MacroCard title="Protein" value={macros?.protein || 0} unit="g" />
          <MacroCard title="Carbs" value={macros?.carbs || 0} unit="g" />
          <MacroCard title="Fat" value={macros?.fat || 0} unit="g" />
        </div>
      </section>

      {/* Macro Progress Chart */}
      <Card className="bg-gray-800 border-none">
        <CardHeader>
          <h2 className="text-xl font-semibold text-white">Today's Progress</h2>
        </CardHeader>
        <CardContent>
          <MacroProgressChart data={macroChartData} />
        </CardContent>
      </Card>
    </div>
  );
};
