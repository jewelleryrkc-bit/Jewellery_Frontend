/* eslint-disable @next/next/no-html-link-for-pages */
"use client";
import { useQuery, useMutation } from '@apollo/client';
import { useState } from 'react';
import { CREATE_ORDER, UPDATE_CART_ITEM, REMOVE_FROM_CART,APPLY_COUPON } from '../../graphql/mutations';
import { GET_CART } from '../../graphql/queries';
import { useCurrency } from "../../providers/CurrencyContext";
import { convertPrice } from "../../lib/currencyConverter";
import { formatCurrency } from "../../lib/formatCurrency";
import { Cart, CartItem } from '../products/types';
import TopHeader from "../../components/TopHeader";
import MiddleHeader from "../../components/MiddleHeader";
import Footer from '../../components/Footer';
import { useRouter } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import LoadingPage from '@/components/LoadingPage';

export default function CartPage() {
  const { currency } = useCurrency();
  const { data, loading, error } = useQuery(GET_CART);
  const [updateCartItem] = useMutation(UPDATE_CART_ITEM);
  const [applyCouponToCart] = useMutation(APPLY_COUPON);
  const [removeFromCart] = useMutation(REMOVE_FROM_CART);
  const [createOrder] = useMutation(CREATE_ORDER);
  const router = useRouter();
  const [couponInput, setCouponInput] = useState(""); 
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [tempQuantity, setTempQuantity] = useState<number>(1);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [isApplyingCode, setIsApplyingCode] = useState(false);
  const [couponcodeError, setCouponCodeError] = useState<string | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<'standard' | 'paypal'>('standard');

  const handleUpdateQuantity = (itemId: string) => {
    if (tempQuantity <= 0) return;
    updateCartItem({
      variables: { itemId, quantity: tempQuantity },
      refetchQueries: [{ query: GET_CART }],
    });
    setEditingItemId(null);
  };

  const handleRemoveItem = (itemId: string) => {
    removeFromCart({
      variables: { itemId },
      refetchQueries: [{ query: GET_CART }],
    });
  };

  const handleCheckout = async () => {
    setIsCheckingOut(true);
    setCheckoutError(null);
  
    try {
      const order = await createOrder();
  
      if (order.data?.createOrder?.id) {
        router.push(`/orders/${order.data.createOrder.id}`);
      }
    } catch (error) {
      console.error('Checkout error:', error);
      setCheckoutError(
        error instanceof Error ? error.message : 'Checkout failed. Please try again.'
      );
    } finally {
      setIsCheckingOut(false);
    }
  };
  
  const handleApplyCouponCode = async () => {
    if (!couponInput.trim()) {
      setCouponCodeError("Please enter a coupon code");
      return;
    }

    setIsApplyingCode(true);
    setCouponCodeError(null);

    try {
      const couponCode = await applyCouponToCart({
        variables: { code: couponInput }
      });

      if (couponCode.data?.applyCouponToCart?.id) {
        router.push(`/cart`);
      }
    } catch (error) {
      console.log('Error Applying Code:', error);
      setCouponCodeError(
        error instanceof Error ? error.message : 'Error Applying Code'
      );
    } finally {
      setIsApplyingCode(false);
    }
  };

  if (loading) {
    return (
      <LoadingPage/>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-400 font-light mt-10 bg-gray-50 py-8">
        Failed to load cart. Please try again later.
      </div>
    );
  }

  const cart: Cart = data?.getCart;

  return (
    <div className="min-h-screen bg-gray-50">
      <TopHeader />
      <MiddleHeader />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
            <h1 className="text-xl sm:text-2xl font-medium text-gray-900 tracking-tight">Your Cart</h1>
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
                <a
                  href="/products"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md text-sm font-light text-white bg-gray-800 hover:bg-gray-700 transition-colors"
                >
                  Continue Shopping
                </a>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {cart.items.map((item: CartItem) => (
                <div key={item.id} className="px-4 sm:px-6 py-5 hover:bg-gray-50 transition-colors">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-md overflow-hidden flex items-center justify-center">
                      <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div>
                          <h2 className="text-base sm:text-lg font-light text-gray-900">
                            {item.product.name}
                          </h2>
                          {item.variation && (
                            <p className="text-xs sm:text-sm text-gray-500 font-light mt-1">
                              Size: {item.variation.size}
                            </p>
                          )}
                        </div>
                        <p className="text-base sm:text-lg font-bold text-gray-900">
                          {formatCurrency(convertPrice(item.price, currency), currency)}
                        </p>
                      </div>

                      <div className="mt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div>
                          {editingItemId === item.id ? (
                            <div className="flex items-center gap-2">
                              <input
                                type="number"
                                value={tempQuantity}
                                min="1"
                                onChange={(e) => setTempQuantity(Number(e.target.value))}
                                className="w-16 px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                              />
                              <button
                                onClick={() => handleUpdateQuantity(item.id)}
                                className="text-indigo-600 hover:underline text-sm"
                              >
                                Save
                              </button>
                              <button
                                onClick={() => setEditingItemId(null)}
                                className="text-gray-500 hover:underline text-sm"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-3">
                              <p className="text-sm text-gray-700 font-light">
                                Qty: {item.quantity}
                              </p>
                              <button
                                onClick={() => {
                                  setEditingItemId(item.id);
                                  setTempQuantity(item.quantity);
                                }}
                                className="text-indigo-600 hover:underline text-sm"
                              >
                                Edit
                              </button>
                            </div>
                          )}
                        </div>

                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-red-600 hover:text-red-800 text-sm font-light"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Order Summary */}
              <div className="px-4 sm:px-6 py-5">
                <div className="border-t border-gray-200 pt-4">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <p className="text-sm text-gray-600 font-light">Subtotal</p>
                      <p className="text-sm font-medium">
                        {formatCurrency(convertPrice(cart?.total, currency), currency)}
                      </p>
                    </div>
                    
                    <div className="flex justify-between">
                      <p className="text-sm text-gray-600 font-light">Shipping</p>
                      <p className="text-sm font-medium">Free</p>
                    </div>

                    {couponcodeError && (
                    <div className="mt-4 text-red-600 text-sm font-light">{checkoutError}</div>
                  )}

                    <div className="mt-6 flex gap-2">
                        <input
                          type="text"
                          value={couponInput}
                          onChange={(e) => setCouponInput(e.target.value)}
                          placeholder="Enter coupon code"
                          className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        <button
                          onClick={handleApplyCouponCode}
                          className={`bg-gray-800 border border-transparent rounded-md px-4 py-2 text-sm font-light text-white hover:bg-gray-700 transition-colors ${
                            isApplyingCode ? 'opacity-75 cursor-not-allowed' : ''
                          }`}
                          disabled={isApplyingCode}
                        >
                          {isApplyingCode ? 'Applying...' : 'Apply'}
                        </button>
                      </div>

                      {couponcodeError && (
                        <div className="mt-2 text-red-600 text-sm font-light">{couponcodeError}</div>
                      )}

                    
                    <div className="flex justify-between pt-3 border-t border-gray-200">
                      <p className="text-base font-medium">Total</p>
                      <p className="text-base font-bold text-green-600">
                        {formatCurrency(convertPrice(cart?.total, currency), currency)}
                      </p>
                    </div>
                  </div>

                  {checkoutError && (
                    <div className="mt-4 text-red-600 text-sm font-light">{checkoutError}</div>
                  )}

                  <div className="mt-6 space-y-4">
            {/* Payment Method Selection */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Payment Method</h3>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="payment"
                    checked={selectedPayment === 'standard'}
                    onChange={() => setSelectedPayment('standard')}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Standard Checkout</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="payment"
                    checked={selectedPayment === 'paypal'}
                    onChange={() => setSelectedPayment('paypal')}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">PayPal</span>
                </label>
              </div>
            </div>

            {/* Single Checkout Button */}
            <button
              onClick={selectedPayment === 'paypal' ? handleCheckout : handleCheckout}
              disabled={isCheckingOut || isCheckingOut}
              className={`w-full ${
                selectedPayment === 'paypal' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-800 hover:bg-gray-700'
              } border border-transparent rounded-md py-3 px-4 flex items-center justify-center text-base font-light text-white transition-colors ${
                (isCheckingOut || isCheckingOut) ? 'opacity-75 cursor-not-allowed' : ''
              }`}
            >
              {isCheckingOut || isCheckingOut ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {selectedPayment === 'paypal' ? 'Redirecting to PayPal...' : 'Processing...'}
                </>
              ) : (
                selectedPayment === 'paypal' ? 'Pay with PayPal' : 'Checkout Securely'
              )}
            </button>
          </div>

                  <div className="mt-4 text-center text-sm text-gray-500 font-light">
                    <p>
                      or{' '}
                      <a href="/products" className="text-indigo-600 hover:text-indigo-500">
                        Continue Shopping <ChevronRight className="inline h-4 w-4" />
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};