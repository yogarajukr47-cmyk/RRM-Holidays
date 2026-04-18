import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import AuthProvider from "@/components/AuthProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const SITE_URL = "https://rrmholidays.com";
const SITE_NAME = "RRM Holidays";
const SITE_DESCRIPTION =
  "Discover magical South India with RRM Holidays — curated tours across Karnataka, Kerala, Tamil Nadu, Andhra Pradesh, Telangana & Goa.";

export const metadata: Metadata = {
  title: "RRM Holidays | South India's Trusted Travel Partner",
  description: SITE_DESCRIPTION,
};

/* Schema */
const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    name: "RRM Holidays",
    url: SITE_URL,
    telephone: "+919108597154",
  },
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>

      <body className={`${inter.variable} antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        <ThemeProvider attribute="class" defaultTheme="dark">
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}