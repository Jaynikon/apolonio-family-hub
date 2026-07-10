"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type ThemeName = "dark" | "light" | "cyan" | "custom";

type ThemeContextValue = {
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
  customColor: string;
  setCustomColor: (color: string) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeName>("dark");
  const [customColor, setCustomColorState] = useState("#00e5ff");

  useEffect(() => {
    const savedTheme = localStorage.getItem("family-hub-theme") as ThemeName | null;
    const savedCustomColor = localStorage.getItem("family-hub-custom-color");

    if (savedTheme) setThemeState(savedTheme);
    if (savedCustomColor) setCustomColorState(savedCustomColor);
  }, []);

  function setTheme(nextTheme: ThemeName) {
    setThemeState(nextTheme);
    localStorage.setItem("family-hub-theme", nextTheme);
  }

  function setCustomColor(color: string) {
    setCustomColorState(color);
    localStorage.setItem("family-hub-custom-color", color);
  }

  return (
    <ThemeContext.Provider
      value={{ theme, setTheme, customColor, setCustomColor }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used inside ThemeProvider");
  }

  return context;
}