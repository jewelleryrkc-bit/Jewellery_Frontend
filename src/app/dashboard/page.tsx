/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useQuery } from "@apollo/client";
import TopHeader from "../../components/TopHeader";
import Footer from "../../components/Footer";
import SellerPanelHeader from "../../components/SellerPanelHeader";
import SearchBar from "../../components/SearchBar";
import SellerbottomHeader from "@/components/SellerBottomHeader";
import {
  ME_QUERY,
  GET_SELLER_ORDERS,
  GET_CURRENTSELLER_PRODUCTS,
  GET_SELLER_STATS,
} from "@/graphql/queries";
import {
  DollarSign,
  ShoppingCart,
  Package,
  PlusSquare,
  CreditCard,
  User,
  TrendingUp,
} from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { MessageSquare, Eye } from "lucide-react";

export default function Dashboard() {
  const { data: meData, loading: meLoading } = useQuery(ME_QUERY);
  const { data: orderData, loading: orderLoading } =
    useQuery(GET_SELLER_ORDERS);
  const { data: productsData, loading: productsLoading } = useQuery(
    GET_CURRENTSELLER_PRODUCTS
  );
  const { data: statsData, loading: statsLoading } = useQuery(GET_SELLER_STATS, {
    variables: { days: 90 },
  });

  const [, setSearchTerm] = useState("");
  const username = meData?.me?.username;
  const sellerProduct = productsData?.myProducts?.length || 0;

  const cname = meData?.me?.cname;
  const averageRating = meData?.me?.averageRating;
  const location = meData?.me?.location;

  // header stats (from backend)
  const listingViews = statsData?.sellerStats?.listingViews ?? 0;
  const totalSales = statsData?.sellerStats?.salesAmount ?? 0;
  const orders90d = statsData?.sellerStats?.ordersCount ?? 0;

  // cards: reuse header stats so everything is real
  const sellerOrder = orders90d;
  const profileViews = listingViews;

  // Process orders data
  const recentOrders =
    orderData?.getSellerOrders
      ?.slice(0, 3)
      .map((order: any) => ({
        id: order.id,
        orderNumber: `ORD-${order.id.slice(-4).toUpperCase()}`,
        total: order.total,
        status: "Completed",
        date: order.createdAt,
        itemCount: order.items.reduce(
          (sum: number, item: any) => sum + item.quantity,
          0
        ),
      })) || [];

  useEffect(() => {
    if (!meLoading && (!meData || !meData.me)) {
      redirect("/");
    }
  }, [meData, meLoading]);

  if (meLoading || orderLoading || productsLoading || statsLoading) {
    return (
      <>
        <TopHeader />
        <SearchBar onSellerSearch={setSearchTerm} />
        <SellerPanelHeader
          profileViews={listingViews}
          totalSales={totalSales}
          orders90d={orders90d}
          cname={cname}
          username={username}
          averageRating={averageRating}
          location={location}
        />
        <SellerbottomHeader />
        <div className="px-4 md:px-6 lg:px-8 pt-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
                >
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <TopHeader />
      <SearchBar onSellerSearch={setSearchTerm} />
      <SellerPanelHeader
        profileViews={listingViews}
        totalSales={totalSales}
        orders90d={orders90d}
        cname={cname}
        username={username}
        averageRating={averageRating}
        location={location}
      />
      <SellerbottomHeader />

      <div className="px-4 md:px-6 lg:px-8 pt-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Dashboard Overview
        </h1>

        {/* Stats Cards – now all real data */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Sales (90d)"
            value={`$${totalSales.toFixed(2)}`}
            change={0}
            icon={<DollarSign className="h-6 w-6 text-blue-600" />}
            color="blue"
          />
          <StatCard
            title="Orders (90d)"
            value={sellerOrder}
            change={0}
            icon={<ShoppingCart className="h-6 w-6 text-green-600" />}
            color="green"
          />
          <StatCard
            title="Products"
            value={sellerProduct}
            change={0}
            icon={<Package className="h-6 w-6 text-purple-600" />}
            color="purple"
          />
          <StatCard
            title="Listing Views (90d)"
            value={profileViews}
            change={0}
            icon={<Eye className="h-6 w-6 text-orange-600" />}
            color="orange"
          />
        </div>

        {/* Recent Activity & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Recent Orders */}
          <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Recent Orders
              </h2>
              <Link
                href="/dashboard/orders"
                className="text-sm text-blue-600 hover:underline"
              >
                View All
              </Link>
            </div>
            <div className="space-y-4">
              {recentOrders.length > 0 ? (
                recentOrders.map((order: any) => (
                  <OrderItem key={order.id} order={order} />
                ))
              ) : (
                <p className="text-gray-500 py-4">No recent orders</p>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Quick Actions
            </h2>
            <div className="space-y-3">
              <Link
                href="/dashboard/products/addproduct"
                className="flex items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <PlusSquare className="h-5 w-5 text-green-600 mr-3" />
                <span>List New Item</span>
              </Link>
              <Link
                href="/dashboard/messages"
                className="flex items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors bg-orange-50"
              >
                <MessageSquare className="h-5 w-5 text-orange-600 mr-3" />
                <span className="font-medium">Customer Messages</span>
              </Link>
              <Link
                href="/dashboard/products"
                className="flex items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <Package className="h-5 w-5 text-blue-600 mr-3" />
                <span>Manage Inventory</span>
              </Link>
              <Link
                href="/dashboard/profile/settings"
                className="flex items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <CreditCard className="h-5 w-5 text-purple-600 mr-3" />
                <span>Payment Methods</span>
              </Link>
              <Link
                href={`/dashboard/profile/${username}`}
                className="flex items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <User className="h-5 w-5 text-orange-600 mr-3" />
                <span>Profile Settings</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Performance Chart (placeholder) */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Sales Performance
            </h2>
            <div className="flex space-x-2">
              <button className="px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded-md">
                7 Days
              </button>
              <button className="px-3 py-1 text-sm hover:bg-gray-100 rounded-md">
                30 Days
              </button>
              <button className="px-3 py-1 text-sm hover:bg-gray-100 rounded-md">
                90 Days
              </button>
            </div>
          </div>
          <div className="h-64 bg-gray-50 rounded-md flex items-center justify-center text-gray-400">
            Sales Chart Visualization
          </div>
        </div>

        {/* Top Products using real myProducts */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Top Performing Products
            </h2>
            <Link
              href="/dashboard/products"
              className="text-sm text-blue-600 hover:underline"
            >
              View All Products
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sold
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Revenue
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Views
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {productsData?.myProducts &&
                productsData.myProducts.length > 0 ? (
                  productsData.myProducts
                    .slice()
                    .sort(
                      (a: any, b: any) =>
                        (b.soldCount || 0) - (a.soldCount || 0)
                    )
                    .slice(0, 5)
                    .map((product: any) => (
                      <tr key={product.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-md flex items-center justify-center text-xs text-gray-400">
                              Image
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {product.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {product.category?.name || "—"}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          ${product.price.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {product.soldCount ?? 0}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          $
                          {(
                            product.price * (product.soldCount ?? 0)
                          ).toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          —
                        </td>
                      </tr>
                    ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      No products found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

function StatCard({
  title,
  value,
  // change,
  icon,
  color,
}: {
  title: string;
  value: string | number;
  change: number;
  icon: React.ReactNode;
  color: string;
}) {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    purple: "bg-purple-50 text-purple-600",
    orange: "bg-orange-50 text-orange-600",
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-semibold mt-1">{value}</p>
        </div>
        <div
          className={`p-3 rounded-full ${
            colorClasses[color as keyof typeof colorClasses]
          }`}
        >
          {icon}
        </div>
      </div>
      <div className="mt-4 flex items-center text-sm text-gray-400">
        <TrendingUp className="h-4 w-4" />
        <span className="ml-1">Compared to previous period</span>
      </div>
    </div>
  );
}

function OrderItem({ order }: { order: any }) {
  return (
    <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
      <div className="flex items-center">
        <div className="bg-gray-100 rounded-md p-2 mr-3">
          <Package className="h-5 w-5 text-gray-500" />
        </div>
        <div>
          <p className="font-medium">Order #{order.orderNumber}</p>
          <p className="text-sm text-gray-500">
            {order.itemCount} items • ${order.total.toFixed(2)}
          </p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-sm font-medium">{order.status}</p>
        <p className="text-xs text-gray-500">
          {new Date(order.createdAt).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}
