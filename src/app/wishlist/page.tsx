/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useQuery, useMutation } from "@apollo/client";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";
import { useEffect, useState, useMemo } from "react";

import { GET_WISHLISTS, GET_CART } from "../../graphql/queries";
import { REMOVE_WISHLIST_ITEM, ADD_TO_CART } from "../../graphql/mutations";

import { Wishlist as WishItem } from "../../types/type";
import { formatCurrency } from "../../lib/formatCurrency";
import { convertPrice } from "../../lib/currencyConverter";
import { useCurrency } from "../../providers/CurrencyContext";

import TopHeader from "../../components/TopHeader";
import MiddleHeader from "../../components/MiddleHeader";
import Footer from "../../components/Footer";
import { useCart } from "@/hooks/useCart"; // 🔹 NEW

export default function Wishlist() {
  const { data, loading, error } = useQuery(GET_WISHLISTS);
  const { currency } = useCurrency();

  const [wishproducts, setWishproducts] = useState<WishItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [allSelected, setAllSelected] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const [removeWishlistItem] = useMutation(REMOVE_WISHLIST_ITEM, {
    refetchQueries: [{ query: GET_WISHLISTS }],
  });

  // 🔹 ADD_TO_CART that also refreshes the shared cart query
  const [addToCart] = useMutation(ADD_TO_CART, {
    refetchQueries: [{ query: GET_CART }],
    awaitRefetchQueries: true,
  });

  // 🔹 Read cart so wishlist can know which items are already in cart
  const { items: cartItems } = useCart();

  // helper: is this wishlist item already in the cart?
  const isInCart = (wishItem: WishItem) =>
    cartItems.some((cartItem: any) => {
      const sameProduct = cartItem.product.id === wishItem.product.id;
      const sameVariation =
        (cartItem.variation?.id || null) === (wishItem.variation?.id || null);
      return sameProduct && sameVariation;
    });

  // Load wishlist items
  useEffect(() => {
    if (data?.getWishlist?.items) {
      const items = data.getWishlist.items.map((item: any, index: number) => ({
        ...item,
        key: item.id || `wishlist-item-${index}-${Date.now()}`,
      }));
      setWishproducts(items);
    }
  }, [data]);

  // Categories map
  const categoriesMap = useMemo(() => {
    const map: Record<string, { name: string; items: WishItem[] }> = {};
    wishproducts.forEach((item) => {
      const cat = item.product.category;
      if (cat) {
        if (!map[cat.id]) map[cat.id] = { name: cat.name, items: [] };
        map[cat.id].items.push(item);
      }
    });
    return map;
  }, [wishproducts]);

  const allCount = wishproducts.length;

  // Filtered products by selected category
  const displayedItems = useMemo(() => {
    if (selectedCategory === "all") return wishproducts;
    return categoriesMap[selectedCategory]?.items || [];
  }, [wishproducts, selectedCategory, categoriesMap]);

  // Select All toggle
  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedItems([]);
      setAllSelected(false);
    } else {
      setSelectedItems(displayedItems.map((item) => item.id));
      setAllSelected(true);
    }
  };

  // Select individual items
  const toggleSelectItem = (itemId: string) => {
    if (selectedItems.includes(itemId)) {
      setSelectedItems(selectedItems.filter((id) => id !== itemId));
      setAllSelected(false);
    } else {
      const newSelected = [...selectedItems, itemId];
      setSelectedItems(newSelected);
      if (newSelected.length === displayedItems.length) setAllSelected(true);
    }
  };

  // Remove one item
  const handleRemove = async (itemId: string) => {
    try {
      await removeWishlistItem({ variables: { itemId } });
      toast.success("Removed from wishlist");
      setSelectedItems(selectedItems.filter((id) => id !== itemId));
    } catch (err) {
      console.error(err);
      toast.error("Failed to remove from wishlist");
    }
  };

  // Add selected items to cart
  const handleAddToCart = async () => {
    if (selectedItems.length === 0) {
      toast.error("Please select at least one product");
      return;
    }

    try {
      for (const id of selectedItems) {
        const item = wishproducts.find((i) => i.id === id);
        if (!item) continue;

        await addToCart({
          variables: {
            productId: item.product.id,
            quantity: 1,
            variationId: item.variation?.id || null,
          },
        });
      }

      toast.custom(
        (t) => (
          <div
            className={`${
              t.visible ? "animate-enter" : "animate-leave"
            } fixed inset-0 z-50 flex items-center justify-center h-screen`}
          >
            <div className="absolute inset-0 bg-black bg-opacity-30"></div>
            <div className="relative bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 shadow-2xl rounded-xl p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 max-w-md w-full z-50">
              <span className="text-lg font-medium">
                Selected items added to cart!
              </span>
              <div className="flex gap-2 mt-4 sm:mt-0">
                <button
                  className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
                  onClick={() => {
                    window.location.href = "/cart";
                    toast.dismiss(t.id);
                  }}
                >
                  Go to Cart
                </button>
                <button
                  className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 transition"
                  onClick={() => toast.dismiss(t.id)}
                >
                  Stay
                </button>
              </div>
            </div>
          </div>
        ),
        { duration: 4000 }
      );
    } catch (err) {
      console.error(err);
      toast.error("Failed to add items to cart");
    }
  };

  // Subtotal
  const subtotal = useMemo(() => {
    if (selectedItems.length > 0) {
      return displayedItems
        .filter((item) => selectedItems.includes(item.id))
        .reduce((sum, item) => sum + item.product.price, 0);
    }
    return displayedItems.reduce((sum, item) => sum + item.product.price, 0);
  }, [displayedItems, selectedItems]);

  if (loading)
    return <div className="text-center py-12">Loading wishlist...</div>;
  if (error)
    return (
      <div className="text-center py-12 text-red-500">
        Failed to load wishlist.
      </div>
    );

  return (
    <>
      <TopHeader />
      <MiddleHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-8 pb-4 border-b">
          Saved Products
        </h1>

        {/* Category Filter Buttons */}
        {wishproducts.length > 0 && (
          <div className="flex gap-2 mb-4 flex-wrap">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-3 py-1 rounded-md border ${
                selectedCategory === "all"
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100"
              }`}
            >
              All ({allCount})
            </button>

            {Object.entries(categoriesMap).map(([id, cat]) => (
              <button
                key={id}
                onClick={() => setSelectedCategory(id)}
                className={`px-3 py-1 rounded-md border ${
                  selectedCategory === id
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-100"
                }`}
              >
                {cat.name} ({cat.items.length})
              </button>
            ))}
          </div>
        )}

        {/* EMPTY LIST */}
        {displayedItems.length === 0 ? (
          <div className="text-center py-16">
            <h3 className="text-xl font-semibold text-gray-800">
              You didn’t save any products yet
            </h3>
            <p className="mt-1 text-gray-500">
              Start adding some products to your wishlist.
            </p>

            <Link href="/products">
              <span className="mt-6 inline-block px-6 py-3 bg-indigo-600 text-white rounded-md shadow hover:bg-indigo-700 cursor-pointer">
                Continue Shopping
              </span>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto shadow-lg rounded-lg border">
            <table className="min-w-full divide-y divide-gray-200 bg-white">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <span>SELECT</span>
                      <input
                        type="checkbox"
                        checked={allSelected}
                        onChange={toggleSelectAll}
                        className="h-4 w-4 cursor-pointer"
                      />
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    #
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {displayedItems.map((item: WishItem, index: number) => (
                  <tr
                    key={item.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 pl-10">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(item.id)}
                        onChange={() => toggleSelectItem(item.id)}
                        className="h-4 w-4 cursor-pointer"
                      />
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-500 font-medium">
                      {index + 1}
                    </td>

                    <td className="px-6 py-4">
                      <Link
                        href={{
                          pathname: `/products/${item.product.slug}`,
                          query: { id: item.product.id },
                        }}
                      >
                        {item.product.images?.length ? (
                          <Image
                            src={item.product.images[0].url}
                            alt={item.product.name}
                            width={100}
                            height={100}
                            className="rounded-md object-cover border shadow-sm hover:scale-105 transition-transform"
                          />
                        ) : (
                          <div className="h-12 w-12 bg-gray-100 border rounded-md flex items-center justify-center text-gray-400 text-xs">
                            No Img
                          </div>
                        )}
                      </Link>
                    </td>

                    <td className="px-6 py-4">
                      <Link href={`/products/${item.product.slug}`}>
                        <span className="text-sm font-medium text-gray-800 hover:text-indigo-600 transition-colors cursor-pointer">
                          {item.product.name}
                        </span>
                      </Link>
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-800 font-semibold">
                      {formatCurrency(
                        convertPrice(item.product.price, currency),
                        currency
                      )}
                    </td>

                    <td className="px-6 py-4 space-x-3">
                      {isInCart(item) ? (
                        <span className="text-sm font-medium text-green-600">
                          Already in cart
                        </span>
                      ) : (
                        <span className="text-sm text-gray-500">
                          Not in cart
                        </span>
                      )}

                      <button
                        onClick={() => handleRemove(item.id)}
                        className="text-sm font-medium text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>

              <tfoot className="bg-gray-50">
                <tr>
                  <td className="px-6 py-4" colSpan={4}></td>

                  <td className="px-6 py-4 text-right font-bold text-gray-800 ">
                    Subtotal:{" "}
                    {formatCurrency(
                      convertPrice(subtotal, currency),
                      currency
                    )}
                  </td>

                  <td className="px-6 py-4 text-align-right">
                    <button
                      onClick={handleAddToCart}
                      className="px-5 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition text-sm font-medium"
                    >
                      Add Selected to Cart
                    </button>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>

      <Footer />
    </>
  );
}
