/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useQuery } from "@apollo/client";
import { GET_USER_ORDERS, WE_QUERY } from "../../../graphql/queries";
import { useCurrency } from "../../../providers/CurrencyContext";
import { formatCurrency } from "../../../lib/formatCurrency";
import TopHeader from "../../../components/TopHeader";
import MiddleHeader from "../../../components/MiddleHeader";
import Footer from "../../../components/Footer";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronLeft, Tag, Info } from "lucide-react";
import LoadingPage from "@/components/LoadingPage";
import BottomHeader from "@/components/BottomHeader";

export default function UserOrdersIdPage() {
  const { currency } = useCurrency();
  const [deliveryDate, setDeliveryDate] = useState<string>("");
  const orderId = useParams()?.id ?? null;
  const { data, loading, error } = useQuery(GET_USER_ORDERS, {
    variables: { id: orderId },
    skip: !orderId
  });
  const { data: addressData } = useQuery(WE_QUERY);
  const order = data?.getOrder;
  const addresses = addressData?.we?.addresses || [];

  useEffect(() => {
    const date = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000);
    setDeliveryDate(date.toLocaleDateString());
  }, []);

  // Parse discount breakdown if available
  const discountBreakdown = order?.discountBreakdown 
    ? JSON.parse(order.discountBreakdown) 
    : [];

  if (loading) {
    return (
      <LoadingPage/>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-400 font-light mt-10 bg-gray-50 py-8">
        Failed to load order: {error.message}
      </div>
    );
  }

  // Determine if order is completed
  const isOrderCompleted = order?.status?.toLowerCase() === "completed";

  return (
    <div className="min-h-screen bg-gray-50">
      <TopHeader />
      <MiddleHeader />
      <BottomHeader/>
      <main className="max-w-4xl mt-15 mx-auto px-4 sm:px-6 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <header className="px-4 sm:px-6 py-4 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-xl sm:text-2xl font-medium text-gray-900 tracking-tight">Order Details</h1>
                <p className="mt-1 text-sm text-gray-500 font-light">
                  View your order information and tracking status
                </p>
              </div>
              <Link
                href="/orders"
                className="flex items-center text-sm font-light text-gray-700 hover:text-gray-900 transition-colors"
              >
                <ChevronLeft className="h-4 w-4 mr-1" /> Back to orders
              </Link>
            </div>
          </header>

          {!order ? (
            <section className="text-center py-12 px-4">
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
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              <h3 className="mt-3 text-lg font-light text-gray-900">Order not found</h3>
              <p className="mt-1 text-sm text-gray-500 font-light">
                We couldn&apos;t find order: {orderId}
              </p>
              <div className="mt-6">
                <Link
                  href="/products"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md text-sm font-light text-white bg-gray-800 hover:bg-gray-700 transition-colors"
                >
                  Browse Products
                </Link>
              </div>
            </section>
          ) : (
            <section className="px-4 sm:px-6 py-5">
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Order Info */}
                <div className="flex-1">
                  <section className="bg-gray-50 rounded-lg p-4 mb-6">
                    <h3 className="text-sm font-light text-gray-900 mb-3">Order Summary</h3>
                    <ul className="divide-y divide-gray-200">
                      {order.items.map((item: any) => (
                        <li key={item.id} className="py-3 flex items-start gap-4">
                          <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-md flex items-center justify-center">
                            {item.product.image ? (
                              <img 
                                src={item.product.image} 
                                alt={item.product.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span className="text-xs text-gray-400">No image</span>
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-light text-gray-900">
                              {item.product.name}
                            </p>
                            {item.variation?.size && (
                              <p className="text-xs text-gray-500 mt-1 font-light">Size: {item.variation.size}</p>
                            )}
                            <p className="text-xs text-gray-500 mt-1 font-light">Qty: {item.quantity}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-light text-gray-900">
                              {formatCurrency(item.price, currency)}
                            </p>
                          </div>
                        </li>
                      ))}
                    </ul>
                    
                    {/* Price Breakdown */}
                    <div className="mt-4 border-t border-gray-200 pt-4 space-y-2">
                      <div className="flex justify-between text-sm text-gray-700">
                        <p>Subtotal</p>
                        <p>{formatCurrency(order.subtotal, currency)}</p>
                      </div>
                      
                      {/* Discounts/Coupons Applied */}
                      {order.discount > 0 && (
                        <div className="flex justify-between text-sm text-green-600">
                          <div className="flex items-center">
                            <Tag className="h-3 w-3 mr-1" />
                            <span>Discounts & Coupons</span>
                            {discountBreakdown.length > 0 && (
                              <div className="group relative ml-1">
                                <Info className="h-3 w-3 text-gray-400 cursor-help" />
                                <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-48 bg-gray-800 text-white text-xs p-2 rounded shadow-lg z-10">
                                  {discountBreakdown.map((discount: any, index: number) => (
                                    <div key={index} className="mb-1 last:mb-0">
                                      {discount.name || discount.description}: -{formatCurrency(discount.amount, currency)}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                          <p>-{formatCurrency(order.discount, currency)}</p>
                        </div>
                      )}
                      
                      {/* Shipping Cost (if applicable) */}
                      {order.shippingCost > 0 && (
                        <div className="flex justify-between text-sm text-gray-700">
                          <p>Shipping</p>
                          <p>{formatCurrency(order.shippingCost, currency)}</p>
                        </div>
                      )}
                      
                      {/* Tax (if applicable) */}
                      {order.tax > 0 && (
                        <div className="flex justify-between text-sm text-gray-700">
                          <p>Tax</p>
                          <p>{formatCurrency(order.tax, currency)}</p>
                        </div>
                      )}
                      
                      {/* Total */}
                      <div className="flex justify-between text-base font-medium text-gray-900 pt-2 border-t border-gray-200">
                        <p>Total</p>
                        <p>{formatCurrency(order.total, currency)}</p>
                      </div>
                      
                      {/* Savings information */}
                      {order.discount > 0 && (
                        <div className="text-xs text-green-600 text-right mt-1">
                          You saved {formatCurrency(order.discount, currency)}!
                        </div>
                      )}
                    </div>
                  </section>

                  <section className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-gray-900 mb-3">Shipping Information</h3>
                    {addresses.length > 0 ? (
                      addresses.map((addr: any, index: number) => (
                        <div key={index} className="mb-4 last:mb-0">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="text-sm font-normal text-gray-900">
                                {addr.streetAddress}
                                {addr.streetAddress2 && `, ${addr.streetAddress2}`},<br/>
                                {addr.city}, {addr.state}, {addr.country} {addr.zipcode}
                              </p>
                            </div>
                            <Link
                              href={`/address/updateaddress?id=${addr.id}`}
                              className="text-xs font-light text-gray-700 hover:text-gray-900 transition-colors"
                            >
                              Edit
                            </Link>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4">
                        <p className="text-sm text-gray-500 font-light">No shipping address found</p>
                        <Link
                          href="/address"
                          className="mt-2 text-xs font-light text-gray-700 hover:text-gray-900 transition-colors"
                        >
                          Add shipping address
                        </Link>
                      </div>
                    )}
                  </section>
                </div>

                {/* Order Timeline & Support */}
                <aside className="lg:w-64 xl:w-80 space-y-4">
                  <section className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-sm font-light text-gray-900 mb-3">Order Status: {order.status}</h3>
                    <ul className="-mb-8">
                      {[
                        { label: "Order placed", description: new Date(order.createdAt).toLocaleDateString(), done: true },
                        { label: "Processing", description: "Your order is being prepared", done: isOrderCompleted },
                        { label: "Shipped", description: "Your order is on the way", done: isOrderCompleted },
                        { label: "Delivered", description: isOrderCompleted ? `Delivered on ${deliveryDate}` : `Expected by ${deliveryDate}`, done: isOrderCompleted },
                      ].map((step, idx) => (
                        <li key={idx} className="relative pb-8">
                          <div className="relative flex space-x-3">
                            <div>
                              <span
                                className={`h-6 w-6 rounded-full flex items-center justify-center ${
                                  step.done ? "bg-gray-800 text-white" : "bg-gray-200 text-gray-500"
                                }`}
                              >
                                {step.done ? (
                                  <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                ) : (
                                  <span className="text-xs">{idx + 1}</span>
                                )}
                              </span>
                            </div>
                            <div className="min-w-0 flex-1 pt-0.5">
                              <p className="text-sm font-light text-gray-900">
                                {step.label}
                              </p>
                              <p className="text-xs text-gray-500 font-light">{step.description}</p>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </section>

                  <section className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-sm font-light text-gray-900 mb-3">Need Help?</h3>
                    <p className="text-xs text-gray-500 mb-3 font-light">
                      If you have any questions about your order, please contact our customer service.
                    </p>
                    <Link
                      href="/contact"
                      className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-xs font-light text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      Contact Support
                    </Link>
                  </section>
                </aside>
              </div>
            </section>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}