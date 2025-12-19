/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useQuery, useMutation } from "@apollo/client";
import { useState } from "react";
import {
  CREATE_ORDER,
  UPDATE_CART_ITEM,
  REMOVE_FROM_CART,
  APPLY_COUPON,
  SET_CART_SHIPPING_ADDRESS,
  CREATE_CHECKOUT,    // ← ADD
  COMPLETE_CHECKOUT
} from "../../graphql/mutations";
import { GET_CART, MY_ADDRESSES } from "../../graphql/queries";
import { useCurrency } from "../../providers/CurrencyContext";
import { convertPrice } from "../../lib/currencyConverter";
import { formatCurrency } from "../../lib/formatCurrency";
import { Cart, CartItem } from "../products/types";
import TopHeader from "../../components/TopHeader";
import MiddleHeader from "../../components/MiddleHeader";
import Footer from "../../components/Footer";
import { useRouter } from "next/navigation";
import LoadingPage from "@/components/LoadingPage";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, ChevronDown, MapPin, X } from "lucide-react";
import { toast } from "react-hot-toast";

export default function CartPage() {
  const { currency } = useCurrency();
  const { data, loading, error } = useQuery(GET_CART);
  const [updateCartItem] = useMutation(UPDATE_CART_ITEM);
  const [applyCouponToCart] = useMutation(APPLY_COUPON);
  const [removeFromCart] = useMutation(REMOVE_FROM_CART);
  const [createOrder] = useMutation(CREATE_ORDER);
  const router = useRouter();

  const [couponInput, setCouponInput] = useState("");
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [isApplyingCode, setIsApplyingCode] = useState(false);
  const [couponcodeError, setCouponCodeError] = useState<string | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<"standard" | "paypal">(
    "standard"
  );
  const [showCouponList, setShowCouponList] = useState(false);
  const [showShippingForm, setShowShippingForm] = useState(false);

  const [isGiftModalOpen, setIsGiftModalOpen] = useState(false);
  const [selectedGiftItem, setSelectedGiftItem] = useState<CartItem | null>(
    null
  );

  const { data: addressData } = useQuery(MY_ADDRESSES);
  const [setCartShippingAddress] = useMutation(SET_CART_SHIPPING_ADDRESS);
  const addresses = addressData?.myAddresses ?? [];
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    null
  );

  // UPDATE QUANTITY
  const handleUpdateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      alert("Quantity cannot be 0. Use Remove to delete item.");
      return;
    }

    try {
      await updateCartItem({
        variables: { itemId, quantity: newQuantity },
        refetchQueries: [{ query: GET_CART }],
      });
    } catch (e) {
      console.error("Update quantity failed:", e);
      alert("Failed to update quantity. Please try again.");
    }
  };

  // REMOVE ITEM
  const handleRemoveItem = async (itemId: string) => {
    if (!confirm("Remove this item from cart?")) return;

    try {
      await removeFromCart({
        variables: { itemId },
        refetchQueries: [{ query: GET_CART }],
      });
    } catch (e) {
      console.error("Remove failed full error:", e);
      alert("Failed to remove item. Please try again.");
    }
  };

  // REVIEW PRODUCT
  const handleReviewProduct = (slug: string) => {
    router.push(`/products/${slug}`);
  };

  // OPEN GIFT MODAL
  const handleAddToGift = (item: CartItem) => {
    setSelectedGiftItem(item);
    setIsGiftModalOpen(true);
  };

  // SUBMIT GIFT FORM
  const handleGiftSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedGiftItem) return;

    const form = e.currentTarget;
    const formData = new FormData(form);

    const giftData = {
      itemId: selectedGiftItem.id,
      recipientName: (formData.get("recipientName") as string) ?? "",
      message: (formData.get("message") as string) ?? "",
    };

    console.log("Gift data saved:", giftData);
    setIsGiftModalOpen(false);
    setSelectedGiftItem(null);
  };

  // CHECKOUT
  const [createCheckout] = useMutation(CREATE_CHECKOUT);
const [completeCheckout] = useMutation(COMPLETE_CHECKOUT);

const handleCheckout = async () => {
  setIsCheckingOut(true);
  setCheckoutError(null);

  try {
    // 1. Create checkout session
    const { data } = await createCheckout();
    const { checkoutId, razorpayOrderId, amount } = data.createCheckout;

    // 2. MOCK Razorpay (Real popup when credentials ready)
    // Simulate payment success (2 second delay for realism)
    setTimeout(async () => {
      try {
        // Generate mock payment ID
        const mockPaymentId = `mock_payment_${Date.now()}`;
        
        // 3. Complete checkout
        const { data: orderData } = await completeCheckout({
          variables: { 
            checkoutId, 
            razorpayPaymentId: mockPaymentId
          }
        });
        
        router.push(`/orders/${orderData.completeCheckout.id}`);
        toast.success("✅ Order placed successfully! (Mock Payment)");
      } catch (e: any) {
        setCheckoutError(e.message);
        toast.error("Checkout failed");
      } finally {
        setIsCheckingOut(false);
      }
    }, 2000); // 2s "payment processing"

  } catch (e: any) {
    setCheckoutError(e.message);
    toast.error("Checkout failed");
  }
};


  // APPLY COUPON
  const handleApplyCouponCode = async () => {
    if (!couponInput.trim()) {
      setCouponCodeError("Please enter a coupon code");
      return;
    }

    setIsApplyingCode(true);
    setCouponCodeError(null);

    try {
      const couponCode = await applyCouponToCart({
        variables: { code: couponInput },
        refetchQueries: [{ query: GET_CART }],
      });

      if (couponCode.data?.applyCouponToCart?.id) {
        router.push(`/cart`);
      }
    } catch (e) {
      console.error("Error Applying Code:", e);
      setCouponCodeError(
        e instanceof Error ? e.message : "Error Applying Code"
      );
    } finally {
      setIsApplyingCode(false);
    }
  };

  if (loading) return <LoadingPage />;

  if (error) {
    return (
      <div className="text-center text-red-400 font-light mt-10 bg-gray-50 py-8">
        Failed to load cart. Please try again later.
      </div>
    );
  }

  const cart: Cart = data?.getCart;
  if (!cart) {
    return (
      <div className="text-center mt-10">
        Cart not found. Please add items again.
      </div>
    );
  }

  const coupons = (cart as any)?.availableCoupons ?? [];

  function createUserAddress(arg0: {
    variables: {
      data: {
        streetAddress: string;
        streetAddress2: string;
        city: string;
        state: string;
        country: string;
        zipcode: string;
      };
    };
  }) {
    throw new Error("Function not implemented.");
  }

  function refetchMyAddresses() {
    throw new Error("Function not implemented.");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <TopHeader />
      <MiddleHeader />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
            <h1 className="text-xl sm:text-2xl font-medium text-gray-900 tracking-tight">
              Your Cart
            </h1>
            <p className="mt-1 text-sm text-gray-500 font-light">
              Review and edit your items before checkout
            </p>
          </div>

          {!cart || cart.items.length === 0 ? (
            <div className="text-center py-12 px-4">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <h3 className="mt-3 text-lg font-light text-gray-900">
                Your cart is empty
              </h3>
              <p className="mt-1 text-sm text-gray-500 font-light">
                Start adding some products to your cart.
              </p>
              <div className="mt-6">
                <Link
                  href="/products"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md text-sm font-light text-white bg-gray-800 hover:bg-gray-700 transition-colors"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {/* CART ITEMS */}
              {cart.items.map((item: CartItem) => {
                const primaryImage =
                  item.product.images?.find((img: any) => img.isPrimary)?.url ??
                  item.product.images?.[0]?.url ??
                  null;
                // console.log("Row item id", item.id, "product", item.product.id);

                return (
                  <div
                    key={item.id}
                    className="px-4 sm:px-6 py-5 border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    {/* Row 1: image | (name+brand) | qty | price */}
                    <div className="flex items-center gap-4 sm:gap-6">
                      {/* Product Image */}
                      <div className="flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-md overflow-hidden border border-gray-200 flex items-center justify-center">
                        {primaryImage ? (
                          <Image
                            src={primaryImage}
                            alt={item.product.name}
                            width={80}
                            height={80}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          "🛍️"
                        )}
                      </div>

                      {/* Name + brand + controls */}
                      <div className="flex-1 flex items-center justify-between gap-4">
                        <div className="min-w-0 max-w-md">
                          <h2 className="text-sm sm:text-base font-medium text-gray-900 truncate">
                            {item.product.name}
                          </h2>
                          <p className="mt-1 text-xs sm:text-sm text-gray-500">
                            {item.product.brand || "Brand name"}
                            {item.variation?.size && (
                              <span className="ml-1">
                                • {item.variation.size}
                              </span>
                            )}
                          </p>
                        </div>

                        {/* Quantity */}
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <button
                            onClick={() => {
                              const newQty = item.quantity - 1;
                              if (newQty > 0) {
                                handleUpdateQuantity(item.id, newQty);
                              } else {
                                alert("Use Remove button to delete this item");
                              }
                            }}
                            disabled={item.quantity <= 1}
                            className="w-7 h-7 flex items-center justify-center rounded-full border border-gray-300 text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            −
                          </button>
                          <span className="w-8 text-center text-sm font-medium text-gray-900 min-w-[2rem]">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => {
                              const newQty = item.quantity + 1;
                              handleUpdateQuantity(item.id, newQty);
                            }}
                            className="w-7 h-7 flex items-center justify-center rounded-full border border-gray-300 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                          >
                            +
                          </button>
                        </div>

                        {/* Price */}
                        <p className="text-sm sm:text-base font-semibold text-gray-900 flex-shrink-0 text-right w-24">
                          {formatCurrency(
                            convertPrice(item.price, currency),
                            currency
                          )}
                        </p>
                      </div>
                    </div>

                    {/* Row 2: gift status + actions */}
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-xs sm:text-sm text-gray-500">
                        {item.giftMessage && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                            Gift note added
                          </span>
                        )}
                      </span>

                      <div className="flex items-center gap-4 text-xs sm:text-sm">
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-red-600 hover:text-red-700 font-light transition-colors"
                        >
                          Remove
                        </button>
                        <button
                          onClick={() => handleReviewProduct(item.product.slug)}
                          className="text-gray-700 hover:text-gray-900 font-light transition-colors"
                        >
                          Review
                        </button>
                        <button
                          onClick={() => handleAddToGift(item)}
                          className="text-indigo-600 hover:text-indigo-500 font-light transition-colors"
                        >
                          Add to gift
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* GIFT MODAL */}
              {isGiftModalOpen &&
                selectedGiftItem &&
                (() => {
                  const giftPrimaryImage =
                    selectedGiftItem.product.images?.find(
                      (img: any) => img.isPrimary
                    )?.url ??
                    selectedGiftItem.product.images?.[0]?.url ??
                    null;

                  // console.log(
                  //   "Gift item id",
                  //   selectedGiftItem.id,
                  //   "product",
                  //   selectedGiftItem.product.id
                  // );

                  return (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                      <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full max-height-[90vh] overflow-hidden">
                        {/* Header */}
                        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-purple-50">
                          <div className="flex items-center gap-4 mb-3">
                            <div className="w-14 h-14 bg-white rounded-lg overflow-hidden border flex-shrink-0">
                              {giftPrimaryImage ? (
                                <Image
                                  src={giftPrimaryImage}
                                  alt={selectedGiftItem.product.name}
                                  width={56}
                                  height={56}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                "🛍️"
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <h3 className="font-semibold text-gray-900 text-lg truncate">
                                {selectedGiftItem.product.name}
                              </h3>
                              <p className="text-sm text-gray-500">
                                {selectedGiftItem.product.brand || "Brand"}
                                {selectedGiftItem.variation?.size &&
                                  ` • ${selectedGiftItem.variation.size}`}
                              </p>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600">
                            Add a personal gift message
                          </p>
                        </div>

                        {/* Form */}
                        <form
                          onSubmit={handleGiftSubmit}
                          className="p-6 space-y-4"
                        >
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Recipient&apos;s name *
                            </label>
                            <input
                              name="recipientName"
                              type="text"
                              required
                              maxLength={50}
                              placeholder="Sarah Johnson"
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Gift message (optional)
                            </label>
                            <textarea
                              name="message"
                              rows={4}
                              maxLength={200}
                              placeholder="Write something special for your friend..."
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-vertical transition-all"
                            />
                          </div>

                          <div className="flex gap-3 pt-4">
                            <button
                              type="button"
                              onClick={() => {
                                setIsGiftModalOpen(false);
                                setSelectedGiftItem(null);
                              }}
                              className="flex-1 px-4 py-3 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              className="flex-1 px-4 py-3 text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-xl transition-all shadow-sm"
                            >
                              Save Gift Note
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  );
                })()}

              {/* ORDER SUMMARY */}
              <div className="px-4 sm:px-6 py-5">
                {/* Right: order summary */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">
                    Order Summary
                  </h2>

                  <div className="space-y-3">
                    {/* Subtotal */}
                    <div className="flex justify-between">
                      <p className="text-sm text-gray-600 font-light">
                        Subtotal
                      </p>
                      <p className="text-sm font-medium">
                        {formatCurrency(
                          convertPrice(
                            cart?.subtotal ?? cart?.total ?? 0,
                            currency
                          ),
                          currency
                        )}
                      </p>
                    </div>

                    {/* Shipping */}
                    <div className="flex justify-between">
                      <p className="text-sm text-gray-600 font-light">
                        Shipping
                      </p>
                      <p className="text-sm font-medium">
                        {cart?.sellerProvidesShipping && cart.shippingAmount > 0
                          ? formatCurrency(
                              convertPrice(cart.shippingAmount, currency),
                              currency
                            )
                          : "Free"}
                      </p>
                    </div>

                    {/* Coupon row */}

                    <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:items-start">
                      {/* Left: input + dropdown + message */}
                      <div className="flex-1">
                        <div className="relative flex items-center">
                          <input
                            type="text"
                            value={couponInput}
                            onChange={(e) => {
                              setCouponInput(e.target.value);
                              setShowCouponList(true);
                            }}
                            onFocus={() => setShowCouponList(true)}
                            placeholder="Enter or select coupon"
                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500 pr-8"
                          />
                          <button
                            type="button"
                            className="absolute right-2 inset-y-0 flex items-center justify-center text-gray-500"
                            onClick={() => setShowCouponList((prev) => !prev)}
                          >
                            <ChevronDown className="h-4 w-4" />
                          </button>

                          {showCouponList &&
                            Array.isArray(coupons) &&
                            coupons.length > 0 && (
                              <ul className="absolute left-0 right-0 z-10 mt-1 max-h-40 overflow-y-auto rounded-md border border-gray-200 bg-white text-sm shadow-lg">
                                {coupons.map((c: any) => (
                                  <li
                                    key={c.id}
                                    className="cursor-pointer px-3 py-1 hover:bg-gray-100"
                                    onClick={() => {
                                      setCouponInput(c.code);
                                      setShowCouponList(false);
                                    }}
                                  >
                                    {c.code} – {c.discountPercentage}% off
                                  </li>
                                ))}
                              </ul>
                            )}
                        </div>

                        {/* message directly under input */}
                        {Array.isArray(coupons) && coupons.length === 0 && (
                          <p className="mt-1 text-xs text-gray-500">
                            No coupons available
                          </p>
                        )}
                      </div>

                      {/* Right: buttons */}
                      <button
                        onClick={handleApplyCouponCode}
                        className={`mt-2 sm:mt-0 h-10 px-4 bg-gray-800 border border-transparent rounded-md text-sm font-light text-white hover:bg-gray-700 transition-colors ${
                          isApplyingCode ? "opacity-75 cursor-not-allowed" : ""
                        }`}
                        disabled={isApplyingCode}
                      >
                        {isApplyingCode ? "Applying..." : "Apply"}
                      </button>

                      <button
                        type="button"
                        onClick={() => setShowShippingForm(true)}
                        className="mt-2  sm:mt-0 text-xs text-indigo-600 hover:text-indigo-500 whitespace-nowrap"
                      >
                        Change shipment details
                      </button>
                    </div>

                    {couponcodeError && (
                      <div className="mt-2 text-red-600 text-sm font-light">
                        {couponcodeError}
                      </div>
                    )}

                    {/* Total */}
                    <div className="flex justify-between pt-3 border-t border-gray-200">
                      <p className="text-base font-medium">Total</p>
                      <p className="text-base font-bold text-green-600">
                        {formatCurrency(
                          convertPrice(cart?.total ?? 0, currency),
                          currency
                        )}
                      </p>
                    </div>
                  </div>

                  {checkoutError && (
                    <div className="mt-4 text-red-600 text-sm font-light">
                      {checkoutError}
                    </div>
                  )}

                  <div className="mt-6 space-y-4">
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h3 className="text-sm font-medium text-gray-900 mb-3">
                        Payment Method
                      </h3>
                      <div className="space-y-2">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="payment"
                            checked={selectedPayment === "standard"}
                            onChange={() => setSelectedPayment("standard")}
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                          />
                          <span className="ml-2 text-sm text-gray-700">
                            Standard Checkout
                          </span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="payment"
                            checked={selectedPayment === "paypal"}
                            onChange={() => setSelectedPayment("paypal")}
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                          />
                          <span className="ml-2 text-sm text-gray-700">
                            PayPal
                          </span>
                        </label>
                      </div>
                    </div>

                    <button
                      onClick={handleCheckout}
                      disabled={isCheckingOut}
                      className={`w-full ${
                        selectedPayment === "paypal"
                          ? "bg-blue-600 hover:bg-blue-700"
                          : "bg-gray-800 hover:bg-gray-700"
                      } border border-transparent rounded-md py-3 px-4 flex items-center justify-center text-base font-light text-white transition-colors ${
                        isCheckingOut ? "opacity-75 cursor-not-allowed" : ""
                      }`}
                    >
                      {isCheckingOut ? (
                        <>
                          <svg
                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          {selectedPayment === "paypal"
                            ? "Redirecting to PayPal..."
                            : "Processing..."}
                        </>
                      ) : selectedPayment === "paypal" ? (
                        "Pay with PayPal"
                      ) : (
                        "Checkout Securely"
                      )}
                    </button>
                  </div>

                  <div className="mt-4 text-center text-sm text-gray-500 font-light">
                    <p>
                      or{" "}
                      <Link
                        href="/products"
                        className="text-indigo-600 hover:text-indigo-500"
                      >
                        Continue Shopping{" "}
                        <ChevronRight className="inline h-4 w-4" />
                      </Link>
                    </p>
                  </div>
                </div>
              </div>

              {/* SHIPPING ADDRESS MODAL (place once, after Order Summary) */}
              {showShippingForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                  <div className="w-full max-w-lg bg-white rounded-xl shadow-xl">
                    {/* Header */}
                    <div className="flex items-center justify-between border-b px-6 py-4">
                      <h3 className="text-lg font-medium text-gray-900">
                        Shipping address
                      </h3>
                      <button
                        type="button"
                        onClick={() => setShowShippingForm(false)}
                        className="text-sm text-gray-500 hover:text-gray-700"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Body */}
                    <div className="px-6 py-4 space-y-4">
                      {addresses.length === 0 ? (
                        // NO ADDRESS: show full shipping form
                        <form
                          className="space-y-4"
                          onSubmit={async (e) => {
                            e.preventDefault();
                            const form = e.currentTarget;
                            const data = new FormData(form);

                            const input = {
                              streetAddress: String(
                                data.get("streetAddress") || ""
                              ),
                              streetAddress2: String(
                                data.get("streetAddress2") || ""
                              ),
                              city: String(data.get("city") || ""),
                              state: String(data.get("state") || ""),
                              country: String(data.get("country") || ""),
                              zipcode: String(data.get("zipcode") || ""),
                            };

                            await createUserAddress({
                              variables: { data: input },
                            });

                            await refetchMyAddresses();
                            setShowShippingForm(false);
                          }}
                        >
                          <h4 className="text-sm font-medium text-gray-900 mb-2">
                            Product shipping address
                          </h4>

                          {/* Country */}
                          <div>
                            <label className="flex items-center gap-1 text-xs font-medium text-gray-500 mb-1">
                              <MapPin className="h-3 w-3" />
                              Country or region
                            </label>
                            <select
                              name="country"
                              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                              defaultValue="United States"
                              required
                            >
                              <option value="United States">
                                United States
                              </option>
                              <option value="India">India</option>
                            </select>
                          </div>

                          {/* Street address */}
                          <div>
                            <label className="text-xs font-medium text-gray-500 mb-1 block">
                              Street address
                            </label>
                            <input
                              name="streetAddress"
                              type="text"
                              required
                              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                            />
                          </div>

                          {/* Street address 2 */}
                          <div>
                            <label className="text-xs font-medium text-gray-500 mb-1 block">
                              Street address 2 (optional)
                            </label>
                            <input
                              name="streetAddress2"
                              type="text"
                              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                            />
                          </div>

                          {/* City / State / ZIP */}
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div>
                              <label className="text-xs font-medium text-gray-500 mb-1 block">
                                City
                              </label>
                              <input
                                name="city"
                                type="text"
                                required
                                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                              />
                            </div>
                            <div>
                              <label className="text-xs font-medium text-gray-500 mb-1 block">
                                State / Province / Region
                              </label>
                              <input
                                name="state"
                                type="text"
                                required
                                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                              />
                            </div>
                            <div>
                              <label className="text-xs font-medium text-gray-500 mb-1 block">
                                ZIP code
                              </label>
                              <input
                                name="zipcode"
                                type="text"
                                required
                                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                              />
                            </div>
                          </div>

                          {/* Buttons */}
                          <div className="flex justify-end gap-2 mt-4">
                            <button
                              type="button"
                              onClick={() => setShowShippingForm(false)}
                              className="px-4 py-2 text-sm rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100"
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              className="px-5 py-2 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700"
                            >
                              Save shipping address
                            </button>
                          </div>
                        </form>
                      ) : (
                        // HAS ADDRESSES: select existing
                        <>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Choose a saved address
                          </label>
                          <select
                            value={selectedAddressId ?? addresses[0]?.id ?? ""}
                            onChange={(e) =>
                              setSelectedAddressId(e.target.value)
                            }
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                          >
                            {addresses.map((a: any) => (
                              <option key={a.id} value={a.id}>
                                {a.streetAddress}, {a.city}, {a.state},{" "}
                                {a.country}
                              </option>
                            ))}
                          </select>

                          <div className="flex justify-end gap-2 mt-4">
                            <button
                              type="button"
                              onClick={() => setShowShippingForm(false)}
                              className="px-4 py-2 text-sm rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100"
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              onClick={async () => {
                                const idToUse =
                                  selectedAddressId ?? addresses[0]?.id;
                                if (!idToUse) return;
                                await setCartShippingAddress({
                                  variables: { addressId: idToUse },
                                  refetchQueries: [{ query: GET_CART }],
                                });
                                setShowShippingForm(false);
                              }}
                              className="px-5 py-2 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700"
                            >
                              Use this address
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
