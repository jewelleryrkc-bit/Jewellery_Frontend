/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useState, useEffect } from "react";
import { ChevronDown, Menu, Search, User } from "lucide-react";
import Link from "next/link";
import { useQuery } from "@apollo/client";
import { ME_QUERY } from "../graphql/queries";

interface SearchBarProps {
  onSellerSearch: (value: string) => void;
}

export default function SearchBar({ onSellerSearch }: SearchBarProps) {
  const { data: meData } = useQuery(ME_QUERY);
  const [term, setTerm] = useState("");
  const username = meData?.me?.username;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [placeholderText, setPlaceholderText] = useState("");

  const placeholders = [
    "Search your products...",
    "Find orders by ID...",
    "Search by customer name...",
    "Look up products by category..."
  ];

  const toggleSubmenu = (menu: string) => {
    setOpenSubmenu(openSubmenu === menu ? null : menu);
  };

  const navItems = [
    { href: "/dashboard", label: "Overview" },
    { href: "/dashboard/products/addproduct", label: "Add Product" },
    { 
      label: "Listings", 
      submenu: [
        { href: "/dashboard/products", label: "Your Products" }
      ] 
    },
    { 
      label: "Marketing", 
      submenu: [
        { href: "/dashboard/marketing/coupons", label: "Coupons" },
        { href: "/dashboard/marketing/discount", label: "Discounts" },
        { href: "/dashboard/marketing/analytics", label: "Analytics" },
        { href: "", label: "Groups" }
      ] 
    },
    { 
      label: "Store", 
      submenu: [
        { href: "/dashboard/store/editstore", label: "Edit store" },
        { href: "/dashboard/store/storeCategories", label: "Store categories" },
        { href: "/dashboard/store/store-traffic", label: "Store traffic" },
        { href: "/dashboard/store/newsletter", label: "Store newsletter" },
        { href: "/dashboard/store/socials", label: "Social" },
        { href: "/dashboard/store/subscriber-discount", label: "Subscriber discounts" },
        { href: "/dashboard/store/subscription", label: "Manage subscription" },
        { href: "/dashboard/store/timeaway", label: "Time away" }
      ] 
    },
    { href: "/dashboard/orders", label: "Orders" },
    { href: "/dashboard/categories", label: "Performance" },
    { href: "/dashboard/categories", label: "Payments" },
    { 
      label: "Account", 
      submenu: [
        { href: `/dashboard/profile/${username}`, label: "Your Profile" }
      ] 
    },
    { 
      label: "Research", 
      submenu: [
        { href: "/dashboard/research/product-research", label: "Product research" },
        { href: "/dashboard/research/sourcing-insights", label: "Sourcing Insights" }
      ] 
    },
    { href: "/dashboard/settings", label: "More" },
  ];

  // Auto-changing placeholder effect
  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Typewriter effect for placeholder
  useEffect(() => {
    let currentText = "";
    let i = 0;
    const targetText = placeholders[placeholderIndex];
    
    const typeWriter = () => {
      if (i < targetText.length) {
        currentText += targetText.charAt(i);
        setPlaceholderText(currentText);
        i++;
        setTimeout(typeWriter, 50);
      }
    };
    
    typeWriter();
  }, [placeholderIndex]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTerm(value);
    onSellerSearch(value);
  };

  const handleSearch = () => {
    onSellerSearch(term);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="bg-white shadow py-4 md:py-6 px-4 relative">
      <div className="max-w-8xl mx-auto">
        {/* Mobile layout (stacked) */}
        <div className="md:hidden">
          <div className="relative flex items-center justify-center mb-3">
            <div className="absolute left-0">
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                <Menu className="w-6 h-6" />
              </button>
            </div>
            <div className="text-2xl font-light text-gray-900 tracking-tight">Jewelry Store</div>
            {/* Mobile User Icon */}
            <div className="absolute right-0">
              <Link href={`/dashboard/profile/${username}`}>
                <User className="w-6 h-6 text-gray-700 hover:text-gray-900" />
              </Link>
            </div>
          </div>
          <div className="flex items-center mt-5">
            <input
              type="text"
              placeholder={placeholderText}
              value={term}
              onChange={handleChange}
              onKeyPress={handleKeyPress}
              className="flex-grow px-4 py-3 text-sm border border-gray-300 rounded-4xl focus:outline-none focus:ring-1 focus:ring-gray-400 h-12" // Increased height to h-11
            />
            <div className="w-2"></div> {/* Spacer between input and button */}
            <button 
              onClick={handleSearch}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-3 rounded-4xl flex items-center justify-center h-11 w-11" // Increased height to h-11 and set fixed width
            >
              <Search className="w-5 h-5" /> {/* Slightly larger icon */}
            </button>
          </div>
          <div className="flex items-center mt-4">
            <div className="text-lg font-bold text-gray-900 tracking-tight">Seller&apos;s Hub</div>
          </div>
        </div>

        {/* Desktop layout (inline) */}
        <div className="hidden md:flex items-center justify-between">
          <div className="flex items-center">
            <div className="text-4xl font-bold text-gray-800">Jewelry Store</div>
          </div>
          
          <div className="flex items-center w-full max-w-2xl ml-8">
            <input
              type="text"
              placeholder={placeholderText}
              value={term}
              onChange={handleChange}
              onKeyPress={handleKeyPress}
              className="flex-grow px-6 py-3 text-md border border-gray-300 rounded-3xl focus:outline-none focus:ring-1 focus:ring-gray-400"
            />
            <div className="w-3"></div> {/* Spacer between input and button */}
            <button 
              onClick={handleSearch}
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3.5 rounded-3xl flex items-center justify-center"
            >
              <Search className="w-7 h-6" />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
        <div className="md:hidden bg-white shadow-lg border-b border-gray-200 z-50">
          <nav className="flex flex-col py-2">
            {navItems.map((item, index) => (
              item.submenu ? (
                <div key={index} className="border-b border-gray-100">
                  <button 
                    onClick={() => toggleSubmenu(item.label)}
                    className="flex justify-between items-center w-full p-4 text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <span>{item.label}</span>
                    <ChevronDown 
                      size={16} 
                      className={`transform transition-transform ${openSubmenu === item.label ? 'rotate-180' : ''}`}
                    />
                  </button>
                  
                  {openSubmenu === item.label && (
                    <div className="pl-6 bg-gray-50">
                      {item.submenu.map((subItem, subIndex) => (
                        <Link
                          key={subIndex}
                          href={subItem.href}
                          className="block p-3 text-sm text-gray-700 border-b border-gray-100 hover:bg-gray-100 transition-colors"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {subItem.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={index}
                  href={item.href}
                  className="p-4 text-gray-700 border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              )
            ))}
          </nav>
        </div>
      )}
      </div>
    </div>
  );
}