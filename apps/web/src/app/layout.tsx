import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Launch Pad | Expert-Driven Startup Idea Review",
  description:
    "Get your startup idea reviewed in a structured process by domain experts from legal, finance, marketing, and engineering.",
  keywords: [
    "startup idea assessment",
    "expert review",
    "technical feasibility",
    "financial modeling",
    "legal compliance startup",
    "pitch preparation",
  ],
  openGraph: {
    title: "Launch Pad | Expert-Driven Startup Idea Review",
    description:
      "We simulate a real startup review meeting. Your idea is analyzed by professionals from legal, finance, marketing, and tech.",
    type: "website",
    url: "https://shiva09-art.github.io/launch-pad/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={dmSans.variable}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
