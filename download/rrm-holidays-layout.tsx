import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "RRM Holidays | South India's Trusted Travel Partner",
  description:
    "Discover magical South India with RRM Holidays — curated tours across Karnataka, Kerala, Tamil Nadu, Andhra Pradesh, Telangana & Goa. Based in Mysuru.",
  keywords: [
    "RRM Holidays",
    "South India Travel",
    "Mysuru Tours",
    "Karnataka Tourism",
    "Kerala Tours",
    "South India Packages",
  ],
  authors: [{ name: "RRM Holidays" }],
  openGraph: {
    title: "RRM Holidays | South India's Trusted Travel Partner",
    description:
      "Discover magical South India with RRM Holidays — curated tours across Karnataka, Kerala, Tamil Nadu, Andhra Pradesh, Telangana & Goa. Based in Mysuru.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${inter.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
