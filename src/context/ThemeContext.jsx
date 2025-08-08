import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // "user" = user manually chose; "system" = follow OS preference
  const [source, setSource] = useState(() => localStorage.getItem("themeSource") || "system");

  // Initial theme: if user picked, use it; otherwise mirror OS
  const getInitialTheme = () => {
    const saved = localStorage.getItem("theme"); // "light" | "dark"
    if (saved === "light" || saved === "dark") return saved;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  };

  const [theme, setTheme] = useState(getInitialTheme);

  // Smooth transition helper (adds a short-lived class)
  const transitionTimer = useRef(null);
  const withSmoothTransition = (fn) => {
    const root = document.documentElement;
    root.classList.add("theme-transition");
    window.clearTimeout(transitionTimer.current);
    transitionTimer.current = window.setTimeout(() => {
      root.classList.remove("theme-transition");
    }, 300);
    fn();
  };

  // Apply theme to <html> + persist
  useEffect(() => {
    const root = document.documentElement;
    withSmoothTransition(() => {
      if (theme === "dark") root.classList.add("dark");
      else root.classList.remove("dark");
    });
    localStorage.setItem("theme", theme);
    localStorage.setItem("themeSource", source);
    return () => window.clearTimeout(transitionTimer.current);
  }, [theme, source]);

  // Follow OS theme *only* when source === "system"
  useEffect(() => {
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = (e) => {
      if (source === "system") setTheme(e.matches ? "dark" : "light");
    };
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [source]);

  // Public actions
  const toggleTheme = () => {
    setSource("user"); // user overrides system from now on
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const useSystem = () => {
    setSource("system");
    setTheme(window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  };

  const value = useMemo(
    () => ({ theme, source, toggleTheme, useSystem }),
    [theme, source]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => useContext(ThemeContext);
