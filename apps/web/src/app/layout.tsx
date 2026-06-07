import type { Metadata } from "next";
import { DM_Sans, Instrument_Serif } from "next/font/google";
import "./globals.css";

// 1. Optimize all fonts through Next.js (removes the need for manual <link> tags and prevents layout shift)
const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

// 2. Establish a metadataBase for robust SEO and clean relative URLs
export const metadata: Metadata = {
  metadataBase: new URL("https://shiva09-art.github.io"),
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
    canonical: "/launch-pad/",
  },
  openGraph: {
    title: "Launch Pad | Turn Your Idea Into a Clear Startup Plan",
    description: "For students and first-time founders who have ideas but need clarity, structure, and next steps.",
    siteName: "Launch Pad",
    type: "website",
    url: "/launch-pad/",
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
  
  // 3. Extract JSON-LD into a JavaScript object for cleaner, error-free stringification
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "name": "Launch Pad",
    "description": "Startup guidance for students and first-time founders. Idea validation, startup roadmap, business documentation, and pitch preparation.",
    "url": "https://shiva09-art.github.io/launch-pad/",
    "areaServed": "Global",
    "serviceType": ["Idea Validation", "Startup Roadmap", "Business Documentation", "Pitch Preparation"],
    "priceRange": "Free early access"
  };

  return (
    <html lang="en" className={`${dmSans.variable} ${instrumentSerif.variable}`}>
      <head>
        {/* FontAwesome integration with added security attributes */}
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
          integrity="sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vegovlnee1c9QX4TctnWMn13TZye+giMm8e2LwA=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
        
        {/* Injected Schema.org Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
