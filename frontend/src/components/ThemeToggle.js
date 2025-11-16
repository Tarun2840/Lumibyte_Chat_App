import React from "react";
import { useTheme } from "../theme/ThemeContext";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="text-sm px-3 py-2 rounded bg-gray-200 dark:bg-gray-800"
      title="Toggle theme"
    >
      {theme === "dark" ? "Light" : "Dark"} Mode
    </button>
  );
}
