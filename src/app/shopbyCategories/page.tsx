"use client";

import { GET_PARENT_CATEGORIES } from "../../graphql/queries";
import { useQuery } from "@apollo/client";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { Skeleton } from "@/components/skeleton";

const categoryDetails = {
  rings: {
    image: "/images/categories/rings.jpg",
    description: "Timeless symbols of love and commitment, crafted to perfection."
  },
  necklaces: {
    image: "/images/categories/necklaces.jpg",
    description: "Elegant pieces that gracefully accentuate your neckline."
  },
  earrings: {
    image: "/images/categories/earrings.jpg",
    description: "Delicate adornments to frame your face with subtle brilliance."
  },
  bracelets: {
    image: "/images/categories/bracelets.jpg",
    description: "Wristwear that makes a quiet yet powerful statement."
  },
  default: {
    image: "/images/categories/jewelry-default.jpg",
    description: "Exquisitely crafted pieces for every occasion."
  }
};

export default function ShopByCategories() {
  const { data, loading, error } = useQuery(GET_PARENT_CATEGORIES, {
    fetchPolicy: "cache-first",
  });

  if (error) {
    return (
      <div className="container mx-auto py-12 text-center text-gray-500 font-light">
        Error loading categories. Please refresh the page.
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Minimal Hero */}
      <div className="border-b border-gray-100 py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-light text-gray-900 mb-3 tracking-tight">
            Our Collections
          </h1>
          <p className="text-gray-500 font-light max-w-2xl mx-auto">
            Carefully curated jewelry for every moment
          </p>
        </div>
      </div>

      {/* Alternating Category Sections */}
      <div className="container mx-auto px-4 py-12 max-w-6xl space-y-24">
        {loading ? (
          <div className="space-y-24">
            {[...Array(4)].map((_, i) => (
              <div key={i} className={`flex flex-col ${i % 2 ? 'md:flex-row-reverse' : 'md:flex-row'} gap-8 md:gap-16`}>
                <Skeleton className="h-96 w-full md:w-1/2 rounded-none" />
                <div className="w-full md:w-1/2 flex items-center">
                  <Skeleton className="h-48 w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* All Products Section */}
            {/* <div className="flex flex-col md:flex-row gap-8 md:gap-16">
              <div className="w-full md:w-1/2">
                <div className="relative h-96">
                  <Image
                    src="/images/categories/all-products.jpg"
                    alt="All Jewelry"
                    fill
                    className="object-cover"
                    style={{ objectPosition: 'center 30%' }}
                  />
                </div>
              </div>
              <div className="w-full md:w-1/2 flex items-center">
                <div>
                  <h2 className="text-2xl font-light text-gray-900 mb-4 tracking-tight">
                    Complete Collection
                  </h2>
                  <p className="text-gray-500 font-light mb-6">
                    Explore our full range of handcrafted jewelry pieces, each telling its own unique story.
                  </p>
                  <Link
                    href="/products"
                    className="text-xs text-gray-500 font-light hover:text-gray-900 transition-colors flex items-center"
                  >
                    View all pieces
                    <ChevronRight className="ml-1 h-3 w-3" />
                  </Link>
                </div>
              </div>
            </div> */}

            {/* Category Sections */}
            {data?.parentCategories?.map((category: { slug: string; name: string }, index: number) => {
              const details = categoryDetails[category.slug as keyof typeof categoryDetails] || categoryDetails.default;
              return (
                <div 
                  key={category.slug} 
                  className={`flex flex-col ${index % 2 ? 'md:flex-row-reverse' : 'md:flex-row'} gap-8 md:gap-16`}
                >
                  <div className="w-full md:w-1/2">
                    <div className="relative h-96">
                      <Image
                        src={details.image}
                        alt={category.name}
                        fill
                        className="object-cover"
                        style={{ objectPosition: 'center 30%' }}
                      />
                    </div>
                  </div>
                  <div className="w-full md:w-1/2 flex items-center">
                    <div className={index % 2 ? 'md:pr-8' : 'md:pl-8'}>
                      <h2 className="text-2xl font-light text-gray-900 mb-4 tracking-tight">
                        {category.name}
                      </h2>
                      <p className="text-gray-500 font-light mb-6">
                        {details.description}
                      </p>
                      <Link
                        href={`/category/${category.slug}`}
                        className="text-xs text-gray-500 font-light hover:text-gray-900 transition-colors flex items-center"
                      >
                        Discover the collection
                        <ChevronRight className="ml-1 h-3 w-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
}