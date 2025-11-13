/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useQuery } from "@apollo/client";
import Link from "next/link";
import { GET_WISHLISTS } from "../../graphql/queries";
import { Wishlist as WishItem } from "../../types/type";
import { formatCurrency } from "../../lib/formatCurrency";
import { useCurrency } from "../../providers/CurrencyContext";
import { convertPrice } from "../../lib/currencyConverter";
import Footer from "../../components/Footer";
import TopHeader from "../../components/TopHeader";
import MiddleHeader from "../../components/MiddleHeader";
import { useEffect, useState } from "react";

export default function Wishlist() {
  const { data, loading, error } = useQuery(GET_WISHLISTS);
  const { currency } = useCurrency();
  const [wishproducts, setWishproducts] = useState<WishItem[]>([]);

  useEffect(() => {
    if (data?.getWishlist?.items) {
      // Ensure we have a proper array with unique IDs
      const items = data.getWishlist.items.map((item: any, index: number) => ({
        ...item,
        // Create a unique key if id is missing
        key: item.id || `wishlist-item-${index}-${Date.now()}`,
      }));
      setWishproducts(items);
    }
  }, [data]);

  if (loading) return <div className="text-center py-12">Loading wishlist...</div>;
  if (error) return <div className="text-center py-12 text-red-500">Failed to load wishlist.</div>;

  return (
    <>
      <TopHeader/>
      <MiddleHeader/>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-8 border-b pb-4">Saved Products</h1>

        {wishproducts.length === 0 ? (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">You didn&apos;t saved any product yet</h3>
            <p className="mt-1 text-gray-500">Start adding some products to your saved product lists.</p>
            <div className="mt-6">
              <Link href="/products">
                <span className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
                  Continue Shopping
                </span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg overflow-hidden">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {wishproducts.map((item: WishItem, index: number) => (
                  <tr key={item.id || `wishlist-item-${index}`} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link href={`/products/${item.product.slug}/${item.product.id}`}>
                        <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-md flex items-center justify-center text-gray-400 text-xs">
                          Image
                        </div>
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link href={`/products/${item.product.slug}`}>
                        <div className="text-sm font-medium text-gray-900 hover:text-indigo-600">
                          {item.product.name}
                        </div>
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatCurrency(convertPrice(item.product.price, currency), currency)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => console.log("TODO: Remove from wishlist", item.id)}
                        className="text-red-600 hover:text-red-900 flex items-center gap-1"
                      >
                        <span>Remove</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <Footer/>
    </> 
  );
}