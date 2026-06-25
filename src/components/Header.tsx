"use client";

import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { Home as HomeIcon, ListTodo as TasksIcon, LogOut } from "lucide-react";

export const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <header className="w-full bg-red-600 text-white py-3 px-4 flex items-center justify-between border-b-4 border-red-800 shadow-[4px_4px_0px_0px_rgba(211,18,18,1)]">
      <div className="flex items-center gap-4">
        <Link to="/" className="flex items-center gap-2">
          <HomeIcon className="h-5 w-5" />
          <span className="font-bold">Home</span>
        </Link>
        <Link to="/tasks" className="flex items-center gap-2">
          <TasksIcon className="h-5 w-5" />
          <span className="font-bold">Tarefas</span>
        </Link>
      </div>
      <div className="flex items-center gap-3">
        {user && (
          <span className="text-sm font-medium">
            {user.email}
          </span>
        )}
        <Button
          variant="outline"
          size="sm"
          onClick={handleLogout}
          className="border-2 border-white text-white hover:bg-white hover:text-red-600"
        >
          <LogOut className="h-4 w-4 mr-1" />
          Sair
        </Button>
      </div>
    </header>
  );
};