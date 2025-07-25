// src/app/layout.tsx
"use client";
import { ThemeProvider } from "next-themes";
import SideBar from "@/components/SideBar";
import "./globals.css";
import { store } from "@/redux/store";
import { Provider } from "react-redux";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Provider store={store}>
          <ThemeProvider attribute="data-theme" defaultTheme="light">
            <div className="flex">
              <SideBar />
              {children}
            </div>
          </ThemeProvider>
        </Provider>
      </body>
    </html>
  );
}
