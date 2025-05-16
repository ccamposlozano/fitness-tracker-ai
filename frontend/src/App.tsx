import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Register } from './pages/Register';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { FoodLog } from './pages/FoodLog';
import { AuthenticatedLayout } from './components/AuthenticatedLayout';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <AuthenticatedLayout>
                <Dashboard />
              </AuthenticatedLayout>
            }
          />
          <Route
            path="/food-log"
            element={
              <AuthenticatedLayout>
                <FoodLog />
              </AuthenticatedLayout>
            }
          />
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
