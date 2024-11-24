"use client";
import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({ children, ...props }) {
  const [mounted, setMounted] = React.useState(false);

  // Ensures the theme only applies after the component is mounted on the client
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Prevent rendering mismatched theme on server
    return null;
  }

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
