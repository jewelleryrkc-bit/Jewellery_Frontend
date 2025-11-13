"use client";

import Link from "next/link";

export default function OffersPage() {
  return (
    <div className="bg-white min-h-screen text-gray-900 font-[Gidole,sans-serif]">
      {/* Hero Banner */}
      <section className="w-full h-[65vh] flex items-center justify-center bg-[url('/banner-placeholder.jpg')] bg-cover bg-center relative">
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl sm:text-5xl font-light text-white tracking-wide">
            Timeless Elegance
          </h1>
          <p className="mt-4 text-lg text-white/80">
            Exclusive deals on our handcrafted jewelry collections
          </p>
          <Link
            href="/products"
            className="inline-block mt-6 px-8 py-3 bg-white text-gray-900 rounded-full text-sm font-medium hover:bg-gray-100 transition"
          >
            Explore Collections
          </Link>
        </div>
      </section>

      {/* Offer Cards */}
      <section className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition"
            >
              <div className="bg-gray-100 h-64 w-full" />
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-1">Elegant Ring Set</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Up to 30% off on select luxury items
                </p>
                <Link
                  href="#"
                  className="text-sm font-medium text-red-400 hover:underline"
                >
                  View Offer →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-gray-50 py-20 text-center px-6 mb-10">
        <h2 className="text-3xl font-light text-gray-800">Crafted to Shine</h2>
        <p className="text-gray-500 mt-3 text-sm sm:text-base">
          Discover timeless pieces that make every moment sparkle
        </p>
        <Link
          href="/products"
          className="mt-6 inline-block px-6 py-3 bg-gray-900 text-white rounded-full text-sm hover:bg-gray-800 transition"
        >
          Shop All Jewelry
        </Link>
      </section>
    </div>
  );
}
