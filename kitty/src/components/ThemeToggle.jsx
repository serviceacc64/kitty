import React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { Button } from "./ui/Button";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="rounded-full w-10 h-10 transition-all duration-300 hover:rotate-12"
      title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
    >
      {theme === "light" ? (
        <Moon className="text-primary animate-in zoom-in duration-300" size={20} />
      ) : (
        <Sun className="text-yellow-400 animate-in zoom-in duration-300" size={20} />
      )}
    </Button>
  );
};

export { ThemeToggle };
