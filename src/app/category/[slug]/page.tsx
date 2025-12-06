/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useQuery } from "@apollo/client";
import { CATEGORY_BY_SLUG } from "../../../graphql/queries";
import Link from "next/link";
import Image from "next/image";
import { HeartIcon, StarIcon } from "lucide-react";
import { formatCurrency } from "../../../lib/formatCurrency";
import { convertPrice } from "../../../lib/currencyConverter";
import { useCurrency } from "../../../providers/CurrencyContext";
import LoadingPage from "@/components/LoadingPage";
import { useWishlist } from "../../../hooks/useWishlist";
import React from "react";

export default function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const unwrappedParams = React.use(params);
  const { slug } = unwrappedParams;
  const { currency } = useCurrency();
  const {toggleWishlist, isInWishlist } = useWishlist();

  // Wishlist data
  // const { data: wishlistData } = useQuery(GET_WISHLISTS);
  // const wishlistItems = wishlistData?.getWishlist?.items || [];

  // // Toggle wishlist mutation
  // const [toggleWishlist] = useMutation(TOGGLE_WISHLIST, {
  //   refetchQueries: [{ query: GET_WISHLISTS }],
  // });

  // const handleWishlistToggle = async (productId: string, variationId?: string) => {
  //   try {
  //     const { data } = await toggleWishlist({
  //       variables: { productId, variationId: variationId || null },
  //     });

  //     if (data.toggleWishlist) {
  //       toast.success("Added to wishlist");
  //     } else {
  //       toast.success("Removed from wishlist");
  //     }
  //   } catch (err) {
  //     console.error(err);
  //     toast.error("Failed to update wishlist");
  //   }
  // };

  // Category data
  const {
    data: categoryData,
    loading: categoryLoading,
    error: categoryError,
  } = useQuery(CATEGORY_BY_SLUG, { variables: { slug } });
  const category = categoryData?.categoryBySlug;

  // const isInWishlist = (productId: string) =>
  //   wishlistItems.some((item: any) => item.product.id === productId);

  if (categoryLoading) return <LoadingPage />;
  if (categoryError) return <div>Error loading category</div>;
  if (!category) return <div>Category not found</div>;

  const products = category.products || [];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-xl font-light text-gray-800 mb-6 tracking-tight text-center">
        {category.name}
      </h1>

      {/* Subcategories */}
      {category.subcategories?.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Subcategories</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {category.subcategories.map((subcategory: any) => (
              <div key={subcategory.id} className="border p-4 rounded-lg">
                <Link
                  href={`/category/${subcategory.slug}`}
                  className="text-blue-600 hover:underline"
                >
                  {subcategory.name}
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Products */}
      {products.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {products.map((product: any) => (
            <div
              key={product.id || product.slug}
              className="group relative bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
            >
              <Link href={`/products/${product.slug}`} className="block">
                <div className="aspect-square bg-gray-50 relative overflow-hidden">
                  {product.images?.length > 0 ? (
                    <Image
                      src={product.images[0].url}
                      alt={product.name}
                      fill
                      style={{ objectFit: "cover" }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                      sizes="(max-width: 768px) 50vw,
         (max-width: 1200px) 33vw,
         25vw"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-gray-400 text-xs">
                      No Image
                    </div>
                  )}
                  {new Date(product.createdAt) >
                    new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) && (
                    <span className="absolute top-2 left-2 bg-white text-gray-600 text-xs font-light px-2 py-0.5">
                      New
                    </span>
                  )}
                </div>
              </Link>

              {/* Toggle wishlist */}
              {/* <button
                onClick={(e) => {
                  e.preventDefault();
                  handleWishlistToggle(product.id);
                }}
                className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/90 hover:bg-white transition-all shadow-sm"
                aria-label={
                  isInWishlist(product.id)
                    ? "Remove from wishlist"
                    : "Add to wishlist"
                }
              > */}
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

              <div className="p-4">
                <div className="flex justify-between items-start">
                  <Link href={`/products/${product.slug}`} className="block">
                    <h3 className="text-sm sm:text-base font-light text-gray-900 mb-1 hover:text-gray-600 transition line-clamp-2">
                      {product.name}
                    </h3>
                  </Link>
                </div>

                <div className="flex items-center mb-1 sm:mb-2">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => {
                      const isFilled =
                        star <= Math.floor(product.averageRating || 0);
                      const isPartiallyFilled =
                        !isFilled && star - 1 < (product.averageRating || 0);
                      return (
                        <div key={star} className="relative">
                          <StarIcon className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-gray-200" />
                          {isFilled && (
                            <StarIcon className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-yellow-400 absolute top-0 left-0 fill-yellow-400" />
                          )}
                          {isPartiallyFilled && (
                            <div
                              className="absolute top-0 left-0 overflow-hidden"
                              style={{
                                width: `${
                                  ((product.averageRating || 0) - (star - 1)) *
                                  100
                                }%`,
                              }}
                            >
                              <StarIcon className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-yellow-400 fill-yellow-400" />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  <span className="text-2xs sm:text-xs text-gray-400 font-light ml-0.5 sm:ml-1">
                    ({product.reviewCount || 0})
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <p className="text-xs sm:text-sm font-light text-gray-900">
                    {formatCurrency(
                      convertPrice(product.price, currency),
                      currency
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
      ) : (
        <div>No products found.</div>
      )}
    </div>
  );
}
