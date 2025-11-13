/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import SearchBar from "@/components/SearchBar";
import SellerbottomHeader from "@/components/SellerBottomHeader";
import TopHeader from "@/components/TopHeader";
import Footer from "@/components/Footer";
import { useState, useMemo } from "react";
import { useQuery } from "@apollo/client";
import { GET_COMPANY_DISCOUNTS, GET_SELLER_COUPONS } from "@/graphql/queries";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function CouponAnalytics() {
  const [active, setActive] = useState("Promote your store");
  const [timeRange, setTimeRange] = useState("30d");
  const [filterType, setFilterType] = useState("all"); // all, coupon, discount
  const [statusFilter, setStatusFilter] = useState("all"); // all, active, expired
  const [searchQuery, setSearchQuery] = useState("");

  const sidebarItems = [
    "Edit store",
    "Store categories",
    "Store traffic",
    "Store newsletter",
    "Promote your store",
    "Social",
    "Manage subscription",
  ];

  // Fetch data
  const { data: discountsData } = useQuery(GET_COMPANY_DISCOUNTS);
  const { data: couponsData } = useQuery(GET_SELLER_COUPONS);

  // Process data
  const discounts = discountsData?.getSellerDiscounts || [];
  const coupons = couponsData?.getCompanyCoupons || [];

  // Revenue data - replace with your actual data
  const revenueData = [
    { month: "Jan", coupons: 4000, discounts: 2400 },
    { month: "Feb", coupons: 3000, discounts: 1398 },
    { month: "Mar", coupons: 2000, discounts: 9800 },
    { month: "Apr", coupons: 2780, discounts: 3908 },
    { month: "May", coupons: 1890, discounts: 4800 },
    { month: "Jun", coupons: 2390, discounts: 3800 },
  ];

  // Format data for display
  const formatDiscountData = (discount: any) => {
    const isActive = discount.isActive && discount.endDate && new Date(discount.endDate) > new Date();
    return {
      id: discount.id,
      type: 'DISCOUNT',
      code: '-',
      name: discount.product?.name || discount.category?.name || "General Discount",
      value: discount.value || '-',
      discountValue: discount.value || '-',
      thresholdAmount: discount.thresholdAmount || '-',
      thresholdQuantity: discount.thresholdQuantity || '-',
      bogoGet: discount.bogoGet || '-',
      bogoBuy: discount.bogoBuy || '-',
      bogoDiscount: discount.bogoDiscount || '-',
      discountType: discount.type || '-',
      status: isActive ? 'Active' : 'Expired',
      isActive: discount.isActive ? 'Yes' : 'No',
      category: discount.category?.name || '-',
      product: discount.product?.name || '-',
      revenue: Math.floor(Math.random() * 10000),
      startDate: discount.startDate || '-',
      endDate: discount.endDate || '-',
      currentUsage: '-',
      discountPercentage: '-'
    };
  };

  // Format coupon data for display
  const formatCouponData = (coupon: any) => {
    const isActive = coupon.endDate && new Date(coupon.endDate) > new Date();
    return {
      id: coupon.id,
      type: 'COUPON',
      code: coupon.code || '-',
      name: "Coupon",
      value: coupon.discountPercentage || '-',
      discountValue: coupon.discountPercentage || '-',
      thresholdAmount: '-',
      thresholdQuantity: '-',
      bogoGet: '-',
      bogoBuy: '-',
      bogoDiscount: '-',
      discountType: 'Percentage',
      status: isActive ? 'Active' : 'Expired',
      isActive: coupon.isPublic ? 'Yes' : 'No',
      category: '-',
      product: '-',
      revenue: Math.floor(Math.random() * 10000),
      startDate: coupon.startDate || '-',
      endDate: coupon.endDate || '-',
      currentUsage: coupon.currentUsage || 0,
      discountPercentage: coupon.discountPercentage || '-'
    };
  };

  // Combine and sort data
  const allPerformers = [
    ...coupons.map(formatCouponData),
    ...discounts.map(formatDiscountData)
  ];

  // Filter data based on selected filters and search query
  const filteredPerformers = useMemo(() => {
    return allPerformers
      .filter(item => {
        // Filter by type
        if (filterType !== 'all' && item.type.toLowerCase() !== filterType) {
          return false;
        }
        
        // Filter by status
        if (statusFilter !== 'all' && item.status.toLowerCase() !== statusFilter) {
          return false;
        }
        
        // Filter by search query
        if (searchQuery && 
            !item.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
            !item.code.toLowerCase().includes(searchQuery.toLowerCase()) &&
            !item.product.toLowerCase().includes(searchQuery.toLowerCase()) &&
            !item.category.toLowerCase().includes(searchQuery.toLowerCase())) {
          return false;
        }
        
        return true;
      })
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 8);
  }, [allPerformers, filterType, statusFilter, searchQuery]);

  const formatDate = (dateString: string) => {
    if (!dateString || dateString === '-') return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <>
      <TopHeader />
      <SearchBar onSellerSearch={() => {}} />
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
        <main className="flex-1 p-4 md:p-10 overflow-hidden">
          {/* Header */}
          <div className="mb-6 md:mb-10">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">Promotional Performance</h1>
            <p className="text-gray-600 text-sm md:text-base">
              Revenue analytics from coupons and discounts
            </p>
          </div>

          {/* Time Range Selector */}
          <div className="flex justify-end mb-6">
            <div className="inline-flex rounded-md shadow-sm">
              {["30d", "90d", "1y"].map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm font-medium ${
                    range === "30d" ? "rounded-l-lg" : 
                    range === "1y" ? "rounded-r-lg" : ""
                  } ${
                    timeRange === range ? "bg-black text-white" : "bg-white text-gray-700"
                  }`}
                >
                  {range === "30d" ? "30 Days" : range === "90d" ? "90 Days" : "1 Year"}
                </button>
              ))}
            </div>
          </div>

          {/* Revenue Chart - Made smaller to fit screen */}
          <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm mb-6 md:mb-10 border border-gray-200">
            <h2 className="text-lg md:text-xl font-bold mb-4 md:mb-6">Monthly Revenue</h2>
            <div className="h-60">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                  <XAxis 
                    dataKey="month" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#666', fontSize: 12 }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#666', fontSize: 12 }}
                  />
                  <Tooltip />
                  <Legend />
                  <Bar 
                    dataKey="coupons" 
                    fill="#333" 
                    radius={[4, 4, 0, 0]} 
                    name="Coupons" 
                  />
                  <Bar 
                    dataKey="discounts" 
                    fill="#666" 
                    radius={[4, 4, 0, 0]} 
                    name="Discounts" 
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top Performers Table - Only this section is scrollable */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 md:p-6 border-b border-gray-200 flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-lg md:text-xl font-bold">Top Performing Offers</h2>
                <p className="text-gray-600 mt-1 text-sm md:text-base">Sorted by revenue generated</p>
              </div>
              
              {/* Filters and Search */}
              <div className="mt-4 md:mt-0 flex flex-col md:flex-row gap-3">
                {/* Type Filter */}
                <select 
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="all">All Types</option>
                  <option value="coupon">Coupons</option>
                  <option value="discount">Discounts</option>
                </select>
                
                {/* Status Filter */}
                <select 
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="expired">Expired</option>
                </select>
                
                {/* Search Input */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search by name, code..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 pr-3 py-2 border border-gray-300 rounded-md text-sm w-full md:w-48"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Scrollable container for the table */}
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1000px]">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                    <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                    <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Threshold Amount</th>
                    <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Threshold Qty</th>
                    <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">BOGO Buy</th>
                    <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">BOGO Get</th>
                    <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">BOGO Discount</th>
                    <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Discount Type</th>
                    <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                    <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                    <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dates</th>
                    <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Active</th>
                    <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usage</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredPerformers.length > 0 ? (
                    filteredPerformers.map((offer, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 capitalize">
                          {offer.type.toLowerCase()}
                        </td>
                        <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {offer.code}
                        </td>
                        <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {offer.name}
                        </td>
                        <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {offer.value}%
                        </td>
                        <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {offer.thresholdAmount}
                        </td>
                        <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {offer.thresholdQuantity}
                        </td>
                        <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {offer.bogoBuy}
                        </td>
                        <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {offer.bogoGet}
                        </td>
                        <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {offer.bogoDiscount}
                        </td>
                        <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {offer.discountType}
                        </td>
                        <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {offer.category}
                        </td>
                        <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {offer.product}
                        </td>
                        <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          ${offer.revenue.toLocaleString()}
                        </td>
                        <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(offer.startDate)} - {formatDate(offer.endDate)}
                        </td>
                        <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            offer.status === 'Active' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {offer.status}
                          </span>
                        </td>
                        <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {offer.isActive}
                        </td>
                        <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {offer.currentUsage}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={17} className="px-4 md:px-6 py-4 text-center text-sm text-gray-500">
                        No offers match your filters. Try adjusting your search criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
}