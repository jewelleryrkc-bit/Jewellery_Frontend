import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ApolloProviderWrapper from "../providers/ApolloProvider";
import ClientSessionProvider from "../providers/ClientSessionProvider";
import { CurrencyProvider } from "@/providers/CurrencyContext";
// import RegisterServiceWorker from "@/components/RegisterServiceWorker";

// Optimized font loading with next/font
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: {
    default: "Jewelry World",
    template: "%s | Jewelry World"
  },
  description: "Premium fine jewelry collection",
  metadataBase: new URL("https://yourstore.com"),
  openGraph: {
    title: "Jewelry World",
    description: "Premium fine jewelry collection",
    url: "https://yourstore.com",
    siteName: "Jewelry World",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Jewelry World",
    description: "Premium fine jewelry collection",
    images: ["/twitter-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        {/* <RegisterServiceWorker /> */}
        <ClientSessionProvider>
          <ApolloProviderWrapper>
            <CurrencyProvider>
              {children}
            </CurrencyProvider>
          </ApolloProviderWrapper>
        </ClientSessionProvider>
      </body>
    </html>
  );
}