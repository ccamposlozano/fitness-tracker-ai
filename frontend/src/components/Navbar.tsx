import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from './ui/button';
import { cn } from '../lib/utils';

export function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/food-log', label: 'Food Log' },
  ];

  return (
    <nav className="border-b bg-background">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'text-sm font-medium transition-colors hover:text-primary',
                  location.pathname === item.path
                    ? 'text-primary'
                    : 'text-muted-foreground'
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-muted-foreground">
              {user?.email}
            </span>
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="text-sm font-medium"
            >
              Logout
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
} 