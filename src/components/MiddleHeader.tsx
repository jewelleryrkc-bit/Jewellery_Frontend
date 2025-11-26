/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  JSXElementConstructor,
  Key,
  ReactElement,
  ReactNode,
  ReactPortal,
  useState,
  useEffect,
} from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Search,
  ShoppingCart,
  Heart,
  Menu,
  X,
  MessageCircle,
  User,
} from "lucide-react";
import { useQuery } from "@apollo/client";
import {
  WE_QUERY,
  GET_PARENT_CATEGORIES,
  GET_COMPANIES,
} from "../graphql/queries";
import { motion, AnimatePresence } from "framer-motion";
import { UrlObject } from "url";

export default function MiddleHeader() {
  const [search, setSearch] = useState("");
  const { data: meData } = useQuery(WE_QUERY);
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeNav, setActiveNav] = useState<string | null>(null);
  const username = meData?.we?.username;
  const isLoggedIn = !!username;

  // Auto-changing placeholder state
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [placeholderText, setPlaceholderText] = useState("");

  // Fetch categories and companies
  const { data: categoriesData } = useQuery(GET_PARENT_CATEGORIES);
  const { data: companiesData } = useQuery(GET_COMPANIES);

  // Placeholder options
  const placeholders = [
    "Search our collection...",
    "Find engagement rings...",
    "Search by designer...",
    "Look for necklaces...",
    "Find wedding bands...",
    "Search earrings...",
    "Browse bracelets...",
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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/products?query=${encodeURIComponent(search)}`);
    }
  };

  const navItems = [
    {
      name: "Jewelry",
      items:
        categoriesData?.parentCategories?.map((cat: any) => ({
          name: cat.name,
          href: `/category/${
            cat.slug || cat.name.toLowerCase().replace(/\s+/g, "-")
          }`,
        })) || [],
    },
    {
      name: "Top sellers",
      items:
        companiesData?.getCompanies?.map((company: any) => ({
          name: company.cname,
          href: `/designer/${
            company.username || company.cname.toLowerCase().replace(/\s+/g, "-")
          }`,
        })) || [],
    },
    {
      name: "Services",
      items: [
        { name: "Custom Design", href: "/services/custom-design" },
        { name: "Engraving", href: "/services/engraving" },
        { name: "Jewelry Repair", href: "/services/repair" },
        { name: "Ring Sizing", href: "/services/ring-sizing" },
      ],
    },
    {
      name: "About Us",
      items: [
        { name: "Our Story", href: "/about" },
        { name: "Sustainability", href: "/sustainability" },
        { name: "Contact", href: "/contact" },
      ],
    },
  ];

  return (
    // <div className="fixed-top px-4 md:px-6 py-3 bg-white shadow-sm">
    <div className="px-4 md:px-6 py-3 bg-white shadow-sm">
      {/* Mobile Header */}
      <div className="md:hidden">
        {/* Top Bar - Improved centering */}
        <div className="flex justify-between items-center mb-3">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="p-1.5 text-gray-800 hover:text-gray-600 flex-shrink-0"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Centered logo with proper spacing */}
          <div className="flex-1 flex justify-center px-2">
            <Link
              href="/"
              className="text-xl font-serif text-gray-900 tracking-tight text-center"
            >
              JewelryWorld
            </Link>
          </div>

          {/* Right side icons with equal spacing */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <Link
              href="/wishlist"
              className="p-1.5 text-gray-800 hover:text-gray-600"
            >
              <Heart className="w-5 h-5" />
            </Link>
            <Link
              href="/cart"
              className="p-1.5 text-gray-800 hover:text-gray-600"
            >
              <ShoppingCart className="w-5 h-5" />
            </Link>
          </div>
        </div>

        {/* Mobile Search - Improved layout */}
        <form onSubmit={handleSearch} className="flex items-center gap-2 mb-3">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder={placeholderText}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-2.5 rounded-full border border-gray-300 focus:outline-none focus:ring-1 focus:ring-primary-500 text-sm text-left pr-12"
            />
            <button
              type="submit"
              className="absolute right-0 top-0 h-full bg-primary-600 text-white px-4 rounded-r-full hover:bg-primary-700 flex items-center justify-center"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>

      {/* Desktop Header */}
      <div className="hidden md:block">
        <div className="flex items-center justify-between">
          {/* Logo - Left aligned */}
          <Link
            href="/"
            className="text-2xl font-serif text-gray-900 mr-8 flex-shrink-0"
          >
            JewelryWorld
          </Link>

          {/* Navigation Links - Centered with adjusted spacing */}
          <div className="flex items-center gap-5 mx-auto flex-shrink-0">
            {navItems.map((navItem) => (
              <div
                key={navItem.name}
                className="relative"
                onMouseEnter={() => setActiveNav(navItem.name)}
                onMouseLeave={() => setActiveNav(null)}
              >
                <button className="text-gray-700 hover:text-primary-600 font-medium text-sm uppercase tracking-wider transition-colors duration-200 py-1">
                  {navItem.name}
                </button>

                <AnimatePresence>
                  {activeNav === navItem.name && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="absolute left-1/2 transform -translate-x-1/2 mt-1 z-50 min-w-[200px]"
                    >
                      <div className="bg-white shadow-lg rounded-lg p-2 border border-gray-100 max-h-[350px] overflow-y-auto">
                        {navItem.items.map(
                          (item: {
                            name:
                              | string
                              | number
                              | bigint
                              | boolean
                              | ReactElement<
                                  unknown,
                                  string | JSXElementConstructor<any>
                                >
                              | Iterable<ReactNode>
                              | ReactPortal
                              | Promise<
                                  | string
                                  | number
                                  | bigint
                                  | boolean
                                  | ReactPortal
                                  | ReactElement<
                                      unknown,
                                      string | JSXElementConstructor<any>
                                    >
                                  | Iterable<ReactNode>
                                  | null
                                  | undefined
                                >
                              | null
                              | undefined;
                            href: string | UrlObject;
                          }) => (
                            <Link
                              key={item.name?.toString()}
                              href={item.href}
                              className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors duration-150"
                            >
                              {item.name}
                            </Link>
                          )
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          {/* Right Side Elements with adjusted spacing */}
          <div className="flex items-center gap-4 ml-6 flex-shrink-0">
            {/* Search Bar with increased width and proper alignment */}
            <form onSubmit={handleSearch} className="relative w-[500px]">
              <div className="relative flex items-center">
                <span className="absolute left-4 text-gray-400 z-10">
                  <Search className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={placeholderText}
                  className="pl-11 pr-4 py-3 w-full border border-gray-300 rounded-full bg-white text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 text-left"
                />
              </div>
            </form>

            {/* Icons with consistent spacing */}
            <div className="flex items-center gap-1">
              <Link
                href="/wishlist"
                className="p-1.5 text-gray-700 hover:text-primary-600"
              >
                <Heart className="w-5 h-5" />
              </Link>
              <Link
                href="/cart"
                className="p-1.5 text-gray-700 hover:text-primary-600"
              >
                <ShoppingCart className="w-5 h-5" />
              </Link>
              <Link
                href="/messages"
                className="p-1.5 text-gray-700 hover:text-primary-600"
              >
                <MessageCircle className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
              onClick={() => setMobileMenuOpen(false)}
            />

            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween" }}
              className="fixed top-0 left-0 h-full w-4/5 max-w-sm bg-white z-50 shadow-xl"
            >
              <div className="p-4 border-b flex justify-between items-center">
                <Link
                  href="/"
                  className="text-xl font-serif text-gray-900"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  JewelryWorld
                </Link>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>

              <div className="h-[calc(100%-60px)] overflow-y-auto pb-20">
                {navItems.map((section) => (
                  <div key={section.name} className="border-b">
                    <div className="px-4 py-3 font-medium text-gray-700">
                      {section.name}
                    </div>
                    <div className="pb-2">
                      {section.items.map(
                        (item: {
                          name:
                            | boolean
                            | Key
                            | ReactElement<
                                unknown,
                                string | JSXElementConstructor<any>
                              >
                            | Iterable<ReactNode>
                            | Promise<
                                | string
                                | number
                                | bigint
                                | boolean
                                | ReactPortal
                                | ReactElement<
                                    unknown,
                                    string | JSXElementConstructor<any>
                                  >
                                | Iterable<ReactNode>
                                | null
                                | undefined
                              >;
                          href: string | UrlObject;
                        }) => (
                          <Link
                            key={item.name?.toString()}
                            href={item.href}
                            className="block px-5 py-2 text-gray-600 hover:bg-gray-50"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            {item.name}
                          </Link>
                        )
                      )}
                    </div>
                  </div>
                ))}

                {/* Profile/Auth Section - Aligned to the left */}
                <div className="border-b">
                  <div className="px-4 py-3 font-medium text-gray-700">
                    Account
                  </div>
                  <div className="pb-2">
                    {isLoggedIn ? (
                      <Link
                        href={`/auth/userprofile/${username}`}
                        className="flex items-center px-5 py-2 text-gray-600 hover:bg-gray-50"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <User className="w-5 h-5 mr-3" />
                        <span className="truncate">{username}</span>
                      </Link>
                    ) : (
                      <>
                        <Link
                          href="/auth/login"
                          className="block px-5 py-2 text-gray-600 hover:bg-gray-50"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Sign In
                        </Link>
                        <Link
                          href="/auth/register"
                          className="block px-5 py-2 text-gray-600 hover:bg-gray-50"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Create Account
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
