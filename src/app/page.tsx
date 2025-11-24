/* eslint-disable @next/next/no-page-custom-font */
"use client";


import Header from "@/components/Header";
import Carousel from "@/components/Carousel";
import Head from "next/head";
import Footer from "@/components/Footer";
import OffersPage from "./offers/page";


import ShopByCategories from "./shopbyCategories/page";
import TopRatedProducts from "./products/topratedprod";

export default function Home() {
  return (
    <>
      <Head>
        {/* Primary Meta Tags */}
        <title>Your Store Name | Premium Products Collection</title>
        <meta name="title" content="Your Store Name | Premium Products Collection" />
        <meta name="description" content="Discover our curated collection of premium products at competitive prices. Free shipping on all orders." />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://yourstore.com/" />
        <meta property="og:title" content="Your Store Name | Premium Products Collection" />
        <meta property="og:description" content="Discover our curated collection of premium products at competitive prices." />
        <meta property="og:image" content="https://yourstore.com/default-og-image.jpg" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://yourstore.com/" />
        <meta property="twitter:title" content="Your Store Name | Premium Products Collection" />
        <meta property="twitter:description" content="Discover our curated collection of premium products at competitive prices." />
        <meta property="twitter:image" content="https://yourstore.com/default-og-image.jpg" />

        {/* Font Preloading */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Gidole&display=swap" 
          rel="stylesheet"
        />
      </Head>

      <header>
        <Header />
      </header>
      
      <main>
        <Carousel />
        <ShopByCategories />
        <OffersPage />
        <TopRatedProducts />
      </main>
      
      <Footer />
    </>
  );
}