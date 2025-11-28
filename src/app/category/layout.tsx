"use client";

import { ReactNode, useState, useEffect } from "react";
import Bheader from "@/components/Header";
import Slidebar from "@/components/Slidebar";
import Footer from "@/components/Footer";
import { useMediaQuery } from "react-responsive";

export default function CategoriesLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // ✅ NEW: prevent hydration mismatch
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  // This hook causes mismatch because SSR ≠ CSR
  const isMobile = useMediaQuery({ maxWidth: 768 });

  return (
    <div className="flex flex-col min-h-screen">
      <Bheader />
      <div className="flex flex-1">

        {/* Mobile sidebar toggle */}
        {/* 
          Before: {isMobile && (...)}
          Server rendered 'false', client rendered 'true'
          Hydration mismatch
          
          ✅ After: {mounted && isMobile && (...)}
          ✔ Server & client match during hydration
        */}
        {mounted && isMobile && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="fixed bottom-4 right-4 z-30 bg-gray-600 text-white p-3 rounded-full shadow-lg md:hidden"
            aria-label="Open filters"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
            </svg>
          </button>
        )}

        {/* Sidebar */}
        <div
          className={`${
            sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
          } fixed md:static inset-y-0 left-0 z-40 w-64 bg-gray-600 text-white transition-transform duration-300 ease-in-out`}
        >
          <Slidebar />
        </div>

        {/* Main content */}
        <main className="flex-1 px-4 sm:px-6 pb-20 pt-4 md:ml-full transition-all duration-300">
          {children}
        </main>
      </div>
      <Footer />
    </div>
  );
}
