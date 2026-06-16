import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ChemLab AI - Virtual Chemistry Laboratory",
  description: "AI-powered virtual chemistry laboratory for interactive learning",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="antialiased min-h-screen" style={{ background: '#0a0e1a', color: '#e2e8f0' }}>
        {children}
      </body>
    </html>
  );
}
