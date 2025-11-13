/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useQuery } from "@apollo/client";
import { GET_EVERY_ORDER_BY_USER } from "../../graphql/queries";
import { formatCurrency } from "../../lib/formatCurrency";
import { useCurrency } from "../../providers/CurrencyContext";
import TopHeader from "../../components/TopHeader";
import MiddleHeader from "../../components/MiddleHeader";
import Footer from "../../components/Footer";
import Link from "next/link";
import { ChevronRight, Clock, CheckCircle, XCircle, Circle } from "lucide-react";
import LoadingPage from "@/components/LoadingPage";

const UserOrdersPage = () => {
  const { currency } = useCurrency();
  const { data, loading, error } = useQuery(GET_EVERY_ORDER_BY_USER);

  const getStatusBadge = (status: string) => {
    const statusLower = status.toLowerCase();
    let bgColor = 'bg-gray-100';
    let textColor = 'text-gray-600';
    let icon = <Circle className="h-4 w-4" />;

    if (statusLower === 'processing') {
      bgColor = 'bg-yellow-100';
      textColor = 'text-yellow-800';
      icon = <Clock className="h-4 w-4" />;
    } else if (statusLower === 'completed' || statusLower === 'shipped') {
      bgColor = 'bg-green-100';
      textColor = 'text-green-800';
      icon = <CheckCircle className="h-4 w-4" />;
    } else if (statusLower === 'cancelled') {
      bgColor = 'bg-red-100';
      textColor = 'text-red-800';
      icon = <XCircle className="h-4 w-4" />;
    }

    return (
      <span className={`text-xs px-2 py-1 rounded-full inline-flex items-center gap-1 ${bgColor} ${textColor}`}>
        {icon}
        {status}
      </span>
    );
  };

  if (loading) {
    return <LoadingPage />;
  }

  if (error) {
    return (
      <div className="text-center text-red-400 font-light mt-10 bg-gray-50 py-8">
        Failed to load orders. Please try again later.
      </div>
    );
  }

  const orders = data?.getOrders || [];
  const processingOrders = orders.filter((order: { status: string; }) => order.status.toLowerCase() === 'processing');
  const completedOrders = orders.filter((order: { status: string; }) => 
    ['completed', 'shipped'].includes(order.status.toLowerCase())
  );
  const otherOrders = orders.filter((order: { status: string; }) => 
    !['processing', 'completed', 'shipped'].includes(order.status.toLowerCase())
  );

  const renderOrder = (order: any) => (
    <div key={order.id} className="px-4 sm:px-6 py-5 hover:bg-gray-50 transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-light text-gray-900">
              Order #{order.id.slice(-8).toUpperCase()}
            </h2>
            {getStatusBadge(order.status)}
          </div>
          <p className="text-xs sm:text-sm text-gray-500 font-light mt-1">
            Placed on {new Date(Number(order.createdAt)).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </p>
        </div>
        <div className="text-right">
          <p className="text-base sm:text-lg font-bold text-gray-900">
            {formatCurrency(order.total, currency)}
          </p>
        </div>
      </div>

      <div className="mt-4">
        <ul className="divide-y divide-gray-200">
          {order.items.slice(0, 2).map((item: any) => (
            <li key={item.id} className="py-4 flex gap-4">
              <div className="flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-md overflow-hidden flex items-center justify-center">
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
              <div className="flex-1 flex flex-col">
                <div>
                  <h4 className="text-sm sm:text-base font-medium text-gray-900">
                    {item.product.name}
                  </h4>
                  {item.variation?.size && (
                    <p className="mt-1 text-xs text-gray-500 font-light">
                      Size: {item.variation.size}
                    </p>
                  )}
                </div>
                <div className="flex-1 flex items-end justify-between text-xs sm:text-sm">
                  <p className="text-gray-500 font-light">
                    Qty: {item.quantity}
                  </p>
                  <p className="font-bold text-gray-900">
                    {formatCurrency(item.price, currency)}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
        {order.items.length > 2 && (
          <div className="mt-2 text-xs text-gray-500 font-light">
            +{order.items.length - 2} more items
          </div>
        )}
      </div>

      <div className="mt-4 flex flex-col sm:flex-row sm:justify-between gap-3">
        <Link
          href={`/orders/${order.id}`}
          className="flex items-center text-xs sm:text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
        >
          View details <ChevronRight className="ml-1 h-4 w-4" />
        </Link>
        <Link
          href={`/orders/${order.id}/track`}
          className="flex items-center text-xs sm:text-sm font-light text-gray-700 hover:text-gray-900 transition-colors"
        >
          Track order <ChevronRight className="ml-1 h-4 w-4" />
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <TopHeader />
      <MiddleHeader />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
            <h1 className="text-xl sm:text-2xl font-medium text-gray-900 tracking-tight">My Orders</h1>
            <p className="mt-1 text-sm text-gray-500 font-light">
              View your order history and track current shipments
            </p>
          </div>

          {orders.length === 0 ? (
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
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              <h3 className="mt-3 text-lg font-light text-gray-900">
                No orders yet
              </h3>
              <p className="mt-1 text-sm text-gray-500 font-light">
                Get started by placing your first order.
              </p>
              <div className="mt-6">
                <Link
                  href="/products"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md text-sm font-light text-white bg-gray-800 hover:bg-gray-700 transition-colors"
                >
                  Browse Products
                </Link>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {processingOrders.length > 0 && (
                <>
                  <div className="px-4 sm:px-6 py-3 bg-gray-50">
                    <h3 className="text-sm font-medium text-gray-500">Processing Orders</h3>
                  </div>
                  {processingOrders.map(renderOrder)}
                </>
              )}

              {completedOrders.length > 0 && (
                <>
                  <div className="px-4 sm:px-6 py-3 bg-gray-50">
                    <h3 className="text-sm font-medium text-gray-500">Completed Orders</h3>
                  </div>
                  {completedOrders.map(renderOrder)}
                </>
              )}

              {otherOrders.length > 0 && (
                <>
                  <div className="px-4 sm:px-6 py-3 bg-gray-50">
                    <h3 className="text-sm font-medium text-gray-500">Other Orders</h3>
                  </div>
                  {otherOrders.map(renderOrder)}
                </>
              )}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default UserOrdersPage;