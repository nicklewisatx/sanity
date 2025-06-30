"use client";

import type * as React from "react";

import { ThemeProvider } from "./theme-provider";
import { ErrorLogger } from "./error-logger";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <ErrorLogger />
      {children}
    </ThemeProvider>
  );
}
