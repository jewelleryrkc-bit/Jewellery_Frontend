"use client";

import { ReactNode, useState } from "react";
import Bheader from "@/components/Header";
import Slidebar from "@/components/Slidebar";
import Footer from "@/components/Footer";
import { useMediaQuery } from "react-responsive";

export default function ProductsLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useMediaQuery({ maxWidth: 768 });

  return (
    <div className="flex flex-col min-h-screen">
      <Bheader />
      <div className="flex flex-1">
        {/* Mobile sidebar toggle */}

        {/* Sidebar - Only show on desktop in normal flow */}
        <div className="hidden md:block md:w-72 flex-shrink-0">
          <Slidebar />
        </div>

        {/* Mobile sidebar overlay */}
        {isMobile && sidebarOpen && (
          <>
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 z-20"
              onClick={() => setSidebarOpen(false)}
            />
            <div className="fixed inset-y-0 left-0 w-64 z-30 bg-white overflow-y-auto">
              <Slidebar />
            </div>
          </>
        )}

        {/* Main content */}
        <div className="flex-1 min-w-0">
          <main className="px-4 sm:px-6 py-4">
            {children}
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
}