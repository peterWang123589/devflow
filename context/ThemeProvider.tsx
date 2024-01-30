"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
type ThemeProps = {
  mode: string;
  setMode: (mode: string) => void;
};
const ThemeContext = createContext<ThemeProps | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [mode, setMode] = useState("");

  // const handleThemeChange = () => {
  //   if (mode === "dark") {
  //     setMode("light");
  //     document.documentElement.classList.add("light");
  //   } else {
  //     setMode("dark");

  //     document.documentElement.classList.add("dark");
  //   }
  // };

  useEffect(() => {
    document.documentElement.classList.toggle("light", mode === "light");
    document.documentElement.classList.toggle("dark", mode === "dark");
  }, [mode]);
  return (
    <ThemeContext.Provider value={{ mode, setMode }}>
      {children}
    </ThemeContext.Provider>
  );
};
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be within a ThemeProvider");
  return context;
};
