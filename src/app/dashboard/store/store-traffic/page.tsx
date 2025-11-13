"use client";

import Footer from "@/components/Footer";
import SearchBar from "@/components/SearchBar";
import SellerbottomHeader from "@/components/SellerBottomHeader";
import TopHeader from "@/components/TopHeader";
import { useState } from "react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function StoreTraffic() {
  const [active, setActive] = useState("Store traffic");
  const [timeRange, setTimeRange] = useState("7d"); // 7d, 30d, 90d

  const sidebarItems = [
    "Edit store",
    "Store categories",
    "Store traffic",
    "Store newsletter",
    "Promote your store",
    "Social",
    "Manage subscription",
  ];

  // Sample traffic data - in a real app this would come from your API
  const trafficData = [
    { date: 'Jan 1', visitors: 400, pageViews: 600, orders: 12 },
    { date: 'Jan 2', visitors: 300, pageViews: 500, orders: 8 },
    { date: 'Jan 3', visitors: 600, pageViews: 900, orders: 25 },
    { date: 'Jan 4', visitors: 800, pageViews: 1200, orders: 30 },
    { date: 'Jan 5', visitors: 500, pageViews: 800, orders: 18 },
    { date: 'Jan 6', visitors: 900, pageViews: 1400, orders: 42 },
    { date: 'Jan 7', visitors: 1000, pageViews: 1600, orders: 50 },
  ];

  const referrerData = [
    { name: 'Direct', value: 35 },
    { name: 'Social', value: 25 },
    { name: 'Search', value: 30 },
    { name: 'Email', value: 10 },
  ];

  const summaryStats = [
    { name: 'Total Visitors', value: '4,892', change: '+12.5%', trend: 'up' },
    { name: 'Avg. Session Duration', value: '2m 45s', change: '+3.2%', trend: 'up' },
    { name: 'Bounce Rate', value: '42%', change: '-5.8%', trend: 'down' },
    { name: 'Conversion Rate', value: '3.2%', change: '+0.7%', trend: 'up' },
  ];

  return (
    <>
      <TopHeader />
      <SearchBar 
        onSellerSearch={() => {}} 
      />
      <SellerbottomHeader />
      
      <div className="flex min-h-screen mt-8">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-50 p-6 hidden md:block">
          <ul className="space-y-4">
            {sidebarItems.map((item) => (
              <li
                key={item}
                onClick={() => setActive(item)}
                className={`cursor-pointer rounded-lg px-4 py-3 text-sm font-medium transition hover:bg-gray-200 ${
                  active === item ? "bg-black text-white" : "text-gray-700"
                }`}
              >
                {item}
              </li>
            ))}
          </ul>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-10">
          {/* Heading and Description */}
          <div className="mb-10">
            <h1 className="text-3xl font-bold mb-4">Store Traffic Analytics</h1>
            <p className="text-gray-600">
              Track your store&apos;s performance with detailed traffic analytics. Monitor visitors, 
              page views, and conversion rates to optimize your store.
            </p>
          </div>

          {/* Time Range Selector */}
          <div className="flex justify-end mb-6">
            <div className="inline-flex rounded-md shadow-sm">
              <button
                onClick={() => setTimeRange("7d")}
                className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
                  timeRange === "7d" ? "bg-black text-white" : "bg-white text-gray-700"
                }`}
              >
                7 Days
              </button>
              <button
                onClick={() => setTimeRange("30d")}
                className={`px-4 py-2 text-sm font-medium ${
                  timeRange === "30d" ? "bg-black text-white" : "bg-white text-gray-700"
                }`}
              >
                30 Days
              </button>
              <button
                onClick={() => setTimeRange("90d")}
                className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
                  timeRange === "90d" ? "bg-black text-white" : "bg-white text-gray-700"
                }`}
              >
                90 Days
              </button>
            </div>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
            {summaryStats.map((stat) => (
              <div key={stat.name} className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-sm font-medium text-gray-500 mb-1">{stat.name}</h3>
                <div className="flex items-baseline">
                  <p className="text-2xl font-bold mr-2">{stat.value}</p>
                  <span className={`text-sm ${
                    stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.change}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Traffic Chart */}
          <div className="bg-white p-6 rounded-lg shadow-sm mb-10">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Traffic Overview</h2>
              <div className="flex space-x-4">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                  <span className="text-sm">Visitors</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-sm">Page Views</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
                  <span className="text-sm">Orders</span>
                </div>
              </div>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trafficData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="visitors" 
                    stroke="#3B82F6" 
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="pageViews" 
                    stroke="#10B981" 
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="orders" 
                    stroke="#8B5CF6" 
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Traffic Sources */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-bold mb-6">Traffic Sources</h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={referrerData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#8884d8" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Top Pages */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-bold mb-6">Top Pages</h2>
              <div className="space-y-4">
                {[
                  { page: '/products/blue-t-shirt', visits: 1243, conversion: '3.2%' },
                  { page: '/', visits: 987, conversion: '2.1%' },
                  { page: '/products/black-jeans', visits: 765, conversion: '4.5%' },
                  { page: '/about', visits: 543, conversion: '1.2%' },
                  { page: '/contact', visits: 321, conversion: '0.8%' },
                ].map((item, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <div className="truncate w-2/3">
                      <p className="text-sm font-medium truncate">{item.page}</p>
                    </div>
                    <div className="flex space-x-4">
                      <span className="text-sm text-gray-600">{item.visits.toLocaleString()}</span>
                      <span className="text-sm font-medium">{item.conversion}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </>
  );
}