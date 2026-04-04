import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import AuthProvider from "@/components/AuthProvider";
import ClientComponents from "@/components/ClientComponents";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const SITE_URL = "https://rrmholidays.com";
const SITE_NAME = "RRM Holidays";
const SITE_DESCRIPTION =
  "Discover magical South India with RRM Holidays — curated tours across Karnataka, Kerala, Tamil Nadu, Andhra Pradesh, Telangana & Goa. Trusted by 500+ travellers, based in Mysuru. Book your dream trip today!";
const SITE_KEYWORDS = [
  "RRM Holidays",
  "South India Travel",
  "Mysuru Tours",
  "Karnataka Tourism",
  "Kerala Tours",
  "Tamil Nadu Travel",
  "Goa Trip",
  "Andhra Pradesh Tourism",
  "Telangana Tourism",
  "South India Packages",
  "Mysore Palace Tour",
  "Kerala Backwaters",
  "Ooty Trip",
  "Coorg Tourism",
  "Hampi Heritage Tour",
  "South India Taxi",
  "Tempo Traveller Mysore",
  "Innova Rental Mysore",
  "South India Road Trip",
  "Heritage Tours South India",
  "Beach Holidays Goa",
  "Wildlife Safari Karnataka",
  "Pilgrimage Tours South India",
  "Hill Station Tours",
  "South India Travel Agency",
];

export const metadata: Metadata = {
  title: "RRM Holidays | South India's Trusted Travel Partner",
  description: SITE_DESCRIPTION,
  keywords: SITE_KEYWORDS,
  authors: [{ name: "RRM Holidays", url: SITE_URL }],
  creator: "RRM Holidays",
  publisher: "RRM Holidays",
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "RRM Holidays | South India's Trusted Travel Partner",
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: `${SITE_URL}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "RRM Holidays - South India Travel",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "RRM Holidays | South India's Trusted Travel Partner",
    description: SITE_DESCRIPTION,
    images: [`${SITE_URL}/og-image.jpg`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

/* Schema.org JSON-LD structured data */
const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    name: "RRM Holidays",
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    image: `${SITE_URL}/og-image.jpg`,
    description: SITE_DESCRIPTION,
    telephone: "+919108597154",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Mysuru",
      addressRegion: "Karnataka",
      addressCountry: "IN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: "12.2958",
      longitude: "76.6394",
    },
    areaServed: [
      { "@type": "State", name: "Karnataka" },
      { "@type": "State", name: "Kerala" },
      { "@type": "State", name: "Tamil Nadu" },
      { "@type": "State", name: "Goa" },
      { "@type": "State", name: "Andhra Pradesh" },
      { "@type": "State", name: "Telangana" },
    ],
    priceRange: "$$",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      bestRating: "5",
      worstRating: "1",
      ratingCount: "500",
      reviewCount: "500",
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: "00:00",
      closes: "23:59",
    },
    sameAs: [
      "https://www.instagram.com/__yogaraju__",
      "https://wa.me/919108597154",
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    description: SITE_DESCRIPTION,
    telephone: "+919108597154",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Mysuru",
      addressRegion: "Karnataka",
      addressCountry: "IN",
    },
    sameAs: [
      "https://www.instagram.com/__yogaraju__",
      "https://wa.me/919108597154",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+919108597154",
      contactType: "customer service",
      availableLanguage: ["English", "Hindi", "Kannada", "Tamil", "Malayalam"],
    },
  },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/logo.svg" type="image/svg+xml" />
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="preconnect" href="https://videos.pexels.com" />
      </head>
      <body className={`${inter.variable} antialiased`} suppressHydrationWarning>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={true} disableTransitionOnChange={true}>
          <AuthProvider>
            {children}
            <ClientComponents />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
