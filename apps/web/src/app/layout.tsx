import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Launch Pad | Turn Your Idea Into a Clear Startup Plan",
  description: "Launch Pad helps students and first-time founders validate ideas, understand next steps, and prepare for pitch conversations.",
  keywords: [
    "startup idea validation",
    "student founder help",
    "first-time founder",
    "startup roadmap",
    "pitch preparation",
    "Launch Pad startup"
  ],
  alternates: {
    canonical: "https://shiva09-art.github.io/launch-pad/"
  },
  openGraph: {
    title: "Launch Pad | Turn Your Idea Into a Clear Startup Plan",
    description: "For students and first-time founders who have ideas but need clarity, structure, and next steps.",
    type: "website",
    url: "https://shiva09-art.github.io/launch-pad/",
  },
  twitter: {
    card: "summary_large_image",
  }
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
          href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,300&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
        />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: `
          {
            "@context": "https://schema.org",
            "@type": "ProfessionalService",
            "name": "Launch Pad",
            "description": "Startup guidance for students and first-time founders. Idea validation, startup roadmap, documentation support, and pitch preparation.",
            "url": "https://shiva09-art.github.io/launch-pad/",
            "areaServed": "Global",
            "serviceType": ["Idea Validation", "Startup Roadmap", "Business Documentation", "Pitch Preparation"],
            "priceRange": "Free early access"
          }
        `}} />
      </head>
      <body>{children}</body>
    </html>
  );
}
