/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useMutation, useQuery } from "@apollo/client";
import { GET_TOP_RATED_PRODUCTS, GET_WISHLISTS } from "../../graphql/queries";
import { useCurrency } from "../../providers/CurrencyContext";
import { convertPrice } from "../../lib/currencyConverter";
import { formatCurrency } from "../../lib/formatCurrency";
import Link from "next/link";
import { StarIcon } from "@heroicons/react/24/solid";
import { HeartIcon } from "@heroicons/react/24/outline";
import { ADD_TO_WISHLIST } from "../../graphql/mutations";
import toast from "react-hot-toast";
import useSWR from "swr";
import Image from "next/image";

export default function TopRatedProducts() {
  const { data: wishlistData } = useSWR(GET_WISHLISTS);
  const wishlistItems = wishlistData?.getWishlist?.items || [];
  const { data, loading, error } = useQuery(GET_TOP_RATED_PRODUCTS, {
    variables: { limit: 4 },
  });
  const { currency } = useCurrency();
  const [addtoWishlist] = useMutation(ADD_TO_WISHLIST);

  const isInWishlist = (productId: string) => {
    return wishlistItems.some((item: any) => item.product.id === productId);
  };

  const wishlist = async (productId: string) => {
    try {
      await addtoWishlist({
        variables: {
          productId,
        },
      });
      toast.success("Added to wishlist");
    } catch (err) {
      toast.error("Failed to add to wishlist");
      console.log(err);
    }
  };

  if (loading) {
    return (
      <section className="mb-12 mt-10 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-light text-gray-800 mb-6 tracking-tight text-center">Our Top Rated Products</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-none overflow-hidden animate-pulse">
                <div className="aspect-square bg-gray-100"></div>
                <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
                  <div className="h-4 bg-gray-100 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-100 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }
  
  if (error) return (
    <div className="max-w-7xl mx-auto px-4">
      <p className="text-gray-500 font-light text-center">Error loading products</p>
    </div>
  );

  return (
    <section className="mb-12 sm:mb-16 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-lg sm:text-xl text-center font-light text-gray-800 mb-4 sm:mb-6 tracking-tight">Our Top Rated Products</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
          {data.topRatedProducts.map((product: any) => (
            <div
              key={product.id}
              className="group relative bg-white overflow-hidden hover:opacity-90 transition-opacity duration-300"
            >
              <button 
                  onClick={(e) => {
                    e.preventDefault();
                    wishlist(product.id);
                  }}
                  className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/90 hover:bg-white transition-all shadow-sm"
                  aria-label={isInWishlist(product.id) ? "Remove from wishlist" : "Add to wishlist"}
                >
                  <HeartIcon
                    className={`h-4 w-4 ${
                      isInWishlist(product.id)
                        ? 'text-red-500 fill-red-500 hover:text-red-600'
                        : 'text-gray-400 hover:text-red-500'
                    } transition-colors`}
                  />
                </button>
            
              <Link href={`/products/${product.slug}`} className="block">
                <div className="aspect-square bg-gray-50 relative overflow-hidden">
                  {/* Replace with actual Image component */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    {product.images && product.images.length > 0 ? (
                                         <Image
                                           src={product.images[0].url}
                                           alt={product.name}
                                           layout="fill"
                                           objectFit="cover"
                                         />
                                       ) : (
                                         <span className="text-gray-400 text-sm text-center px-2">
                                          {product.name}
                                         </span>
                                       )}
                  </div>
                  {new Date(product.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) && (
                    <span className="absolute top-1.5 left-1.5 sm:top-2 sm:left-2 bg-white text-gray-600 text-2xs sm:text-xs font-light px-1.5 sm:px-2 py-0.5">
                      New
                    </span>
                  )}
                </div>
              </Link>
            
              <div className="p-2 sm:p-3">
                <Link href={`/products/${product.slug}`} className="block">
                  <h3 className="text-sm sm:text-base font-normal text-gray-900 mb-1 hover:text-gray-600 transition line-clamp-2">
                    {product.name}
                  </h3>
                </Link>
            
                <div className="flex items-center mb-1 sm:mb-2">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <StarIcon
                        key={star}
                        className={`h-2.5 w-2.5 sm:h-3 sm:w-3 ${
                          star <= Math.floor(product.averageRating || 0)
                            ? "text-yellow-400"
                            : "text-gray-200"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-2xs sm:text-xs text-gray-400 font-light ml-0.5 sm:ml-1">
                    ({product.averageRating})
                  </span>
                </div>
            
                <div className="flex justify-between items-center">
                  {/* <p className="text-xs sm:text-sm font-light text-gray-900">
                    {formatCurrency(convertPrice(product.price, currency), currency)}
                  </p> */}
                  <p className="text-sm sm:text-sm font-light text-gray-900 flex flex-col">
                      {product.discountedPrice ? (
                        <>
                          <span className="text-red-500">
                            {formatCurrency(convertPrice(product.discountedPrice, currency), currency)}
                          </span>
                          <span className="text-xs sm:text-sm font-light text-gray-500 line-through">
                            {formatCurrency(convertPrice(product.price, currency), currency)}
                          </span>
                        </>
                      ) : (
                        <span>
                          {formatCurrency(convertPrice(product.price, currency), currency)}
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