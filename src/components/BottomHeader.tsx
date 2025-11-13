/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { CATEGORY_BY_SLUG, GET_PARENT_CATEGORIES } from "@/graphql/queries";
import { useQuery } from "@apollo/client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function BottomHeader() {
  const searchParams = useSearchParams();
  const categorySlug = searchParams.get("category");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  // Query for all categories or a specific one
  const { data, loading, error } = useQuery(
    categorySlug ? CATEGORY_BY_SLUG : GET_PARENT_CATEGORIES,
    {
      variables: categorySlug ? { slug: categorySlug } : undefined,
      fetchPolicy: "cache-first",
    }
  );

  useEffect(() => {
    if (categorySlug && data?.categoryBySlug) {
      setActiveCategory(data.categoryBySlug.slug);
    } else {
      setActiveCategory(null);
    }
  }, [categorySlug, data]);

  // Function to check scroll position & update arrows
  const checkScroll = () => {
    if (navRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = navRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  useEffect(() => {
    const el = navRef.current;
    if (el) {
      el.addEventListener("scroll", checkScroll);
      checkScroll(); // run once initially
    }

    window.addEventListener("resize", checkScroll);

    return () => {
      if (el) el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [data]);

  const handleScroll = (direction: "left" | "right") => {
    if (navRef.current) {
      const scrollAmount = navRef.current.clientWidth * 0.7;
      const currentScroll = navRef.current.scrollLeft;
      const newPosition =
        direction === "right" ? currentScroll + scrollAmount : currentScroll - scrollAmount;

      navRef.current.scrollTo({
        left: newPosition,
        behavior: "smooth",
      });
    }
  };

  const scrollToActiveCategory = () => {
    if (!navRef.current || !activeCategory) return;

    const activeElement = navRef.current.querySelector(
      `a[href="/category/${activeCategory}"]`
    );

    if (activeElement) {
      const containerWidth = navRef.current.clientWidth;
      const elementPosition = (activeElement as HTMLElement).offsetLeft;
      const elementWidth = (activeElement as HTMLElement).offsetWidth;

      navRef.current.scrollTo({
        left: elementPosition - containerWidth / 2 + elementWidth / 2,
        behavior: "smooth",
      });

      // re-check arrows after scroll finishes
      setTimeout(checkScroll, 400);
    }
  };

  useEffect(() => {
    scrollToActiveCategory();
  }, [activeCategory]);

  if (loading) return <div className="h-12 bg-white"></div>;
  if (error) {
    console.error("Error fetching categories:", error);
    return <div className="h-12 bg-white text-red-500">Error loading categories</div>;
  }

  const categoriesToDisplay = categorySlug && data?.categoryBySlug
    ? [data.categoryBySlug]
    : data?.parentCategories || [];

  return (
    <div className="hidden md:block relative bg-white">
      {/* Left scroll button */}
      {showLeftArrow && (
        <button
          onClick={() => handleScroll("left")}
          className="absolute left-0 top-0 h-full w-8 flex items-center justify-center bg-gradient-to-r from-white via-white to-transparent z-10 hover:bg-gray-50 transition-opacity"
          aria-label="Scroll left"
        >
          <ChevronLeft className="h-5 w-5 text-gray-600" />
        </button>
      )}

      {/* Categories */}
      <div
        ref={navRef}
        className="flex items-center pb-3 gap-x-6 lg:gap-x-8 px-10 py-2 overflow-x-auto whitespace-nowrap scrollbar-none"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          scrollSnapType: "x mandatory",
          scrollPadding: "0 50px",
        }}
      >
        <div className="scroll-snap-align-center shrink-0">
          <Link
            href="/products"
            className={`hover:text-gray-500 px-3 py-1 rounded-md transition-colors ${!activeCategory ? "text-gray-900 font-medium" : "text-gray-800"}`}
          >
            All Products
          </Link>
        </div>

        {categoriesToDisplay.map((cat: { id: string; slug: string; name: string }) => (
          <div
            key={cat.id}
            className="relative group scroll-snap-align-center shrink-0"
          >
            <Link
              href={`/category/${cat.slug}`}
              className={`hover:text-gray-500 px-3 py-1 rounded-md transition-colors ${activeCategory === cat.slug ? "text-blue-600 font-medium" : "text-gray-800"}`}
            >
              {cat.name}
            </Link>
          </div>
        ))}
      </div>

      {/* Right scroll button */}
      {showRightArrow && (
        <button
          onClick={() => handleScroll("right")}
          className="absolute right-0 top-0 h-full w-8 flex items-center justify-center bg-gradient-to-l from-white via-white to-transparent z-10 hover:bg-gray-50 transition-opacity"
          aria-label="Scroll right"
        >
          <ChevronRight className="h-5 w-5 text-gray-600" />
        </button>
      )}

      {/* Global styles to hide scrollbar */}
      <style jsx global>{`
        .scrollbar-none::-webkit-scrollbar {
          display: none;
        }
        .scroll-snap-align-center {
          scroll-snap-align: center;
        }
      `}</style>
    </div>
  );
}
