import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ChemLab AI — Virtual Chemistry Laboratory",
  description: "An AI-powered virtual chemistry laboratory for interactive learning. Free exploration and curriculum-based experiments for students.",
  keywords: ["chemistry", "virtual lab", "education", "AI tutor", "experiments"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col lab-bg">{children}</body>
    </html>
  );
}
