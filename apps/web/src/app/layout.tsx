import type { Metadata } from "next";
import { Outfit, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Launch Pad | Anti-Gravity Operating System for Startups",
  description: "Accelerate your startup from Idea to Validation, Funding, and Growth with Launch Pad. The complete, AI-driven workspace for founders.",
  keywords: ["startup accelerator", "startup OS", "business model canvas", "pitch deck builder", "founder tool", "investor CRM", "AI startup validator"],
  openGraph: {
    title: "Launch Pad | Anti-Gravity OS for Entrepreneurship",
    description: "Remove obstacles between your idea and a successful company.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${jetbrainsMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-[#06060c] text-[#f4f4f7] selection:bg-violet-accent/30 selection:text-white">
        <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-accent/15 via-transparent to-transparent pointer-events-none -z-10" />
        <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-cyan-accent/5 via-transparent to-transparent pointer-events-none -z-10" />
        {children}
      </body>
    </html>
  );
}
