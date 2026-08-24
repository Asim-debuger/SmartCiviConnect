import { createContext, useContext, useEffect, useMemo, useState } from "react";

const ThemeContext = createContext({
  dark: false,
  toggleTheme: () => {},
});

function readInitialTheme() {
  if (typeof window === "undefined") return false;
  const stored = localStorage.getItem("smartcivi-theme");
  if (stored === "dark" || stored === "light") return stored === "dark";
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export function ThemeProvider({ children }) {
  const [dark, setDark] = useState(() => {
    const initial = readInitialTheme();
    if (typeof document !== "undefined") {
      document.documentElement.classList.toggle("dark", initial);
    }
    return initial;
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("smartcivi-theme", dark ? "dark" : "light");
  }, [dark]);

  const value = useMemo(
    () => ({
      dark,
      toggleTheme: () => setDark((current) => !current),
    }),
    [dark],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext);
}
