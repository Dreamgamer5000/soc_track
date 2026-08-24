import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

export const metadata: Metadata = {
  title: "Society Maintenance Tracker | Greenview Heights",
  description:
    "Apartment Society Maintenance Platform: Track complaints, view community notice board, and stay updated in real time.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#FAF8F5",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full bg-warm-bg" suppressHydrationWarning>
      <body className="h-full flex flex-col antialiased text-warm-dark bg-warm-bg selection:bg-warm-primary selection:text-white">
        <ThemeProvider>
          <main className="flex-1 w-full max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 py-4 sm:py-6">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
