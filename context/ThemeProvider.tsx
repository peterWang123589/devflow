"use client";
import React, { createContext, useContext, useState, useEffect, useLayoutEffect } from "react";
type ThemeProps = {
  mode: string;
  setMode: (mode: string) => void;
};
const ThemeContext = createContext<ThemeProps | undefined>(undefined);
const preferDark = () => {
  return window && window.matchMedia("(prefers-color-scheme: dark)").matches;
};
const getMode = () => {
  return window && window.localStorage.getItem("theme");
};

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [mode, setMode] = useState("light");

    useLayoutEffect(() => {
    const theme = getMode();
    if (theme) {
      setMode(theme);
    }else{
      setMode("system");
    }
  },[])

  // const handleThemeChange = () => {
  //   if (mode === "dark") {
  //     setMode("light");
  //     document.documentElement.classList.add("light");
  //   } else {
  //     setMode("dark");

  //     document.documentElement.classList.add("dark");
  //   }
  // };
  const handleThemeChange = () => {
    if (
      localStorage.theme === "dark" ||
      (!("theme" in localStorage) &&
       preferDark())
    ) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  useEffect(() => {
    handleThemeChange();
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
