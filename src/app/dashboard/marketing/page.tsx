/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import SearchBar from "@/components/SearchBar";
import SellerbottomHeader from "@/components/SellerBottomHeader";
import TopHeader from "@/components/TopHeader";
import Link  from "next/link";
import { useState } from "react";
import { ME_QUERY } from "@/graphql/mutations";
import { useQuery } from "@apollo/client";

export default function marketing() { 
    const { data: statsData } = useQuery(ME_QUERY);
    const [, setSearchTerm] = useState("");
    const stats = statsData?.sellerStats || {};
    return(
        <>
         <TopHeader />
         <SearchBar onSellerSearch={setSearchTerm} />
         <SellerbottomHeader />
         <div className="px-4 md:px-6 lg:px-8 pt-6">
         <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Marketing Summary</h1>
            <Link
                href="/dashboard/marketing/coupons"
                className="inline-block px-4 py-2 bg-blue-600 text-white rounded-4xl hover:bg-blue-700 active:bg-blue-800 transition-colors text-md font-medium shadow"
            >
                Create Coupon
            </Link>
            {/* <Link
                href="/dashboard/marketing/allcoupons"
                className="inline-block px-4 py-2 bg-blue-600 text-white rounded-4xl hover:bg-blue-700 active:bg-blue-800 transition-colors text-md font-medium shadow"
            >
                View all Coupons
            </Link> */}
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard 
                title="Active" 
                value={`$${stats.totalSales?.toFixed(2) || '0.00'}`} 
                change={stats.salesChange || 0}
                icon= ""
                // icon={<DollarSign className="h-6 w-6 text-blue-600" />}
                color="blue"
            />
            <StatCard 
                title="Scheduled" 
                value={stats.totalOrders || 0} 
                change={stats.ordersChange || 0}
                icon=""
                color="green"
            />
            <StatCard 
                title="Ending soon" 
                value={stats.totalProducts || 0} 
                change={stats.productsChange || 0}
                icon=""
                color="purple"
            />
            <StatCard 
                title="Recently added" 
                value={stats.totalVisitors || 0} 
                change={stats.visitorsChange || 0}
                icon=""
                color="orange"
            />
            </div>

            {/* Performance Chart */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Sales Performance</h2>
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

            {/* Top Products */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Top Performing Products</h2>
                <Link href="/dashboard/products" className="text-sm text-blue-600 hover:underline">
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
                    {stats.topProducts?.length > 0 ? (
                    stats.topProducts.map((product: any) => (
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
                                {product.category}
                                </div>
                            </div>
                            </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            ${product.price.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {product.sold}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            ${product.revenue.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {product.views}
                        </td>
                        </tr>
                    ))
                    ) : (
                    <tr>
                        <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                        No products found
                        </td>
                    </tr>
                    )}
                </tbody>
                </table>
            </div>
            </div>
        </div>
        </>
    )
}

export function StatCard({ title, value }: { title: string; value: string | number; change: number; icon: React.ReactNode; color: string }) {
  
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-2xl font-semibold mt-1">{value}</p>
          </div>
        </div>
      </div>
    );
  }