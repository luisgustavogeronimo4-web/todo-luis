"use client";

import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { useAuth } from "@/context/AuthContext";
import { Home as HomeIcon, ListTodo as TasksIcon, LogOut, Sun, Moon, Star } from "lucide-react";

export const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { setTheme, theme } = useTheme();

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <header className="relative w-full bg-red-600 text-white py-4 px-6 -rotate-1">
      {/* Star accents */}
      <div className="absolute top-2 left-2 opacity-20">
        <Star className="h-5 w-5 text-yellow-400" />
      </div>
      <div className="absolute top-2 right-2 opacity-20">
        <Star className="h-5 w-5 text-yellow-400" />
      </div>

      <div className="relative rotate-1 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2">
            <HomeIcon className="h-5 w-5" />
            <span className="text-2xl font-black tracking-wider">Home</span>
          </Link>
          <Link to="/tasks" className="flex items-center gap-2">
            <TasksIcon className="h-5 w-5" />
            <span className="text-2xl font-black tracking-wider">Tarefas</span>
          </Link>
        </div>
        <div className="flex items-center gap-3">
          {user && (
            <span className="text-lg font-light">
              {user.email}
            </span>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="border-2 border-white text-white hover:bg-white hover:text-red-600 rotate-1"
          >
            <LogOut className="h-4 w-4 mr-1" />
            Sair
          </Button>
          {/* Theme toggle button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="border-2 border-white text-white hover:bg-white hover:text-red-600 rotate-1"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </header>
  );
};