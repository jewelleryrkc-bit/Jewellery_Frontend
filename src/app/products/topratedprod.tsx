/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useQuery } from "@apollo/client";
import { GET_TOP_RATED_PRODUCTS } from "../../graphql/queries";
import Link from "next/link";
import Image from "next/image";
import { StarIcon, HeartIcon } from "lucide-react";
import { useWishlist } from "../../hooks/useWishlist";
import { useCurrency } from "../../providers/CurrencyContext";
import { convertPrice } from "../../lib/currencyConverter";
import { formatCurrency } from "../../lib/formatCurrency";
import LoadingPage from "@/components/LoadingPage";

export default function TopRatedProducts() {
  const { currency } = useCurrency();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const { data, loading, error } = useQuery(GET_TOP_RATED_PRODUCTS, {
    variables: { limit: 4 },
  });

  if (loading) return <LoadingPage />;
  if (error) return <p className="text-center text-gray-500">Failed to load products.</p>;

  return (
    <section className="mb-12 sm:mb-16 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-lg sm:text-xl text-center font-light text-gray-800 mb-4 sm:mb-6 tracking-tight">
          Our Top Rated Products
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
          {data?.topRatedProducts?.map((product: any) => (
            <div
              key={product.id}
              className="group relative bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
            >
              {/* Wishlist Button (same logic as category page) */}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  toggleWishlist(product.id, product.name);
                }}
                className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/90 hover:bg-white transition-all shadow-sm"
                aria-label={
                  isInWishlist(product.id)
                    ? "Remove from wishlist"
                    : "Add to wishlist"
                }
              >
                <HeartIcon
                  className={`h-4 w-4 ${
                    isInWishlist(product.id)
                      ? "text-red-500 fill-red-500 hover:text-red-600"
                      : "text-gray-400 hover:text-red-500"
                  } transition-colors`}
                />
              </button>

              {/* Product Image */}
              <Link href={`/products/${product.slug}`} className="block">
                <div className="aspect-square bg-gray-50 relative overflow-hidden">
                  {product.images?.length > 0 ? (
                    <Image
                      src={product.images[0].url}
                      alt={product.name}
                      fill
                      sizes="(max-width: 768px) 50vw,
                             (max-width: 1200px) 33vw,
                             25vw"
                      className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-gray-400 text-xs">
                      No Image
                    </div>
                  )}

                  {/* New Badge */}
                  {new Date(product.createdAt) >
                    new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) && (
                    <span className="absolute top-2 left-2 bg-white text-gray-600 text-xs font-light px-2 py-0.5">
                      New
                    </span>
                  )}
                </div>
              </Link>

              {/* Product Details */}
              <div className="p-4">
                <Link href={`/products/${product.slug}`}>
                  <h3 className="text-sm sm:text-base font-light text-gray-900 mb-1 hover:text-gray-600 transition line-clamp-2">
                    {product.name}
                  </h3>
                </Link>

                {/* Rating */}
                <div className="flex items-center mb-2">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <StarIcon
                        key={star}
                        className={`h-3 w-3 ${
                          star <= Math.floor(product.averageRating || 0)
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-200"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-gray-400 font-light ml-1">
                    ({product.averageRating || 0})
                  </span>
                </div>

                {/* Price + material */}
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-900">
                    {product.discountedPrice ? (
                      <>
                        <span className="text-red-500">
                          {formatCurrency(
                            convertPrice(product.discountedPrice, currency),
                            currency
                          )}
                        </span>
                        <span className="text-xs text-gray-500 line-through ml-1">
                          {formatCurrency(
                            convertPrice(product.price, currency),
                            currency
                          )}
                        </span>
                      </>
                    ) : (
                      <span>
                        {formatCurrency(
                          convertPrice(product.price, currency),
                          currency
                        )}
                      </span>
                    )}
                  </p>

                  {product.material && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-300 text-gray-800">
                      {product.material}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
