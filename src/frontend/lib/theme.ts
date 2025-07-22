export type Theme = "light" | "dark" | "system";

export function getTheme(): Theme {
  if (typeof window === "undefined") return "system";
  
  const stored = localStorage.getItem("theme") as Theme;
  return stored || "system";
}

export function setTheme(theme: Theme) {
  if (typeof window === "undefined") return;
  
  localStorage.setItem("theme", theme);
  applyTheme(theme);
}

export function applyTheme(theme: Theme) {
  if (typeof window === "undefined") return;
  
  const root = window.document.documentElement;
  
  // Remove existing theme classes
  root.classList.remove("light", "dark");
  
  if (theme === "system") {
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    root.classList.add(systemTheme);
  } else {
    root.classList.add(theme);
  }
}

export function getSystemTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

// Initialize theme on load
if (typeof window !== "undefined") {
  const theme = getTheme();
  applyTheme(theme);
  
  // Listen for system theme changes
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
    if (getTheme() === "system") {
      applyTheme("system");
    }
  });
} 