/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState } from "react";
import Footer from "@/components/Footer";
import SearchBar from "@/components/SearchBar";
import SellerbottomHeader from "@/components/SellerBottomHeader";
import TopHeader from "@/components/TopHeader";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import SellerMainHeader from "@/components/SellerMainHeader";

// Define types for our data structures
type SidebarItem = string;

type PriceData = {
  date: string;
  price: number;
};

type Listing = {
  id: number;
  title: string;
  price: string;
  type: string;
  shipping: string;
  freeShipping: string;
  sold: number;
  revenue: string;
  lastSold: string;
};

type StatItem = {
  label: string;
  value: string;
};

// Sidebar navigation items
const SIDEBAR_ITEMS: SidebarItem[] = [
  "Edit store",
  "Store categories",
  "Store traffic",
  "Store newsletter",
  "Promote your store",
  "Social",
  "Manage subscription",
  "Research products"
];

// Sample price trend data for the chart
const PRICE_DATA: PriceData[] = [
  { date: "Aug 11", price: 700.00 },
  { date: "Aug 12", price: 600.00 },
  { date: "Aug 13", price: 600.00 },
  { date: "Aug 14", price: 400.00 },
  { date: "Aug 15", price: 300.00 },
  { date: "Aug 16", price: 200.00 },
  { date: "Aug 17", price: 100.00 },
  { date: "Aug 18", price: 58.34 }
];

// Sample product listings data
const PRODUCT_LISTINGS: Listing[] = [
  {
    id: 1,
    title: "3.5CI Art Deco Style Asscher Cut Lab Created Diamond",
    price: "$58.34",
    type: "Fixed price",
    shipping: "$10.00",
    freeShipping: "8.6% Free",
    sold: 7,
    revenue: "$408.40",
    lastSold: "Aug 17, 2025"
  },
  {
    id: 2,
    title: "Premium Q Diamond Engagement Ring",
    price: "$337.44",
    type: "Auction",
    shipping: "$5.99",
    freeShipping: "100% Free",
    sold: 12,
    revenue: "$4,049.28",
    lastSold: "Aug 16, 2025"
  }
];

// Define component prop types
interface SidebarProps {
  items: SidebarItem[];
  activeItem: string;
  onItemClick: (item: string) => void;
  showMobileSidebar: boolean;
  setShowMobileSidebar: (show: boolean) => void;
}

interface PageHeaderProps {
  title: string;
  description: string;
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

interface StatsGridProps {
  stats: StatItem[];
}

interface ChartSectionProps {
  data: PriceData[];
}

interface ListingsTableProps {
  listings: Listing[];
}

interface TableHeaderProps {
  children: React.ReactNode;
}

interface TableRowProps {
  item: Listing;
}

export default function ResearchProducts() {
  const [activeNavItem, setActiveNavItem] = useState<string>("Research products");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showMobileSidebar, setShowMobileSidebar] = useState<boolean>(false);

  const filteredListings = PRODUCT_LISTINGS.filter(listing =>
    listing.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats: StatItem[] = [
    { label: "Avg sold price", value: "$337.44" },
    { label: "Sold price range", value: "$0.01 - $21,691.00" },
    { label: "Avg shipping", value: "$10.96" },
    { label: "Free shipping", value: "75%" },
    { label: "Sell-through", value: "0.13%" },
    { label: "Total sellers", value: "905" }
  ];

  return (
    <>
      {/* <TopHeader />
      <SearchBar onSellerSearch={function (value: string): void {
      } }/>
      <SellerbottomHeader /> */}
      <SellerMainHeader/>
      
      {/* Mobile Sidebar Toggle Button */}
      {/* <button 
        onClick={() => setShowMobileSidebar(!showMobileSidebar)}
        className="md:hidden fixed top-24 left-4 z-50 bg-black text-white p-2 rounded-md"
      >
        {showMobileSidebar ? 'Hide Menu' : 'Show Menu'}
      </button> */}
      
      <div className="flex min-h-screen mt-8">
        <Sidebar 
          items={SIDEBAR_ITEMS} 
          activeItem={activeNavItem} 
          onItemClick={setActiveNavItem}
          showMobileSidebar={showMobileSidebar}
          setShowMobileSidebar={setShowMobileSidebar}
        />

        {/* Overlay for mobile when sidebar is open */}
        {showMobileSidebar && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
            onClick={() => setShowMobileSidebar(false)}
          ></div>
        )}

        <main className="flex-1 p-4 md:p-10">
          <PageHeader 
            title="Research Products" 
            description="Analyze market trends for diamond engagement rings"
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />

          <StatsGrid stats={stats} />

          <ChartSection data={PRICE_DATA} />

          <ListingsTable listings={filteredListings} />
        </main>
      </div>

      <Footer />
    </>
  );
}

// Component implementations with proper typing
function Sidebar({ items, activeItem, onItemClick, showMobileSidebar, setShowMobileSidebar }: SidebarProps) {
  return (
    <aside className={`w-64 bg-gray-50 p-6 fixed md:static inset-y-0 left-0 transform ${showMobileSidebar ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 ease-in-out z-40 md:z-auto overflow-y-auto`}>
      <ul className="space-y-4">
        {items.map((item) => (
          <li
            key={item}
            onClick={() => {
              onItemClick(item);
              setShowMobileSidebar(false);
            }}
            className={`cursor-pointer rounded-lg px-4 py-3 text-sm font-medium transition hover:bg-gray-200 ${
              activeItem === item ? "bg-black text-white" : "text-gray-700"
            }`}
          >
            {item}
          </li>
        ))}
      </ul>
    </aside>
  );
}

function PageHeader({ title, description, searchQuery, onSearchChange }: PageHeaderProps) {
  return (
    <div className="mb-6 md:mb-10">
      <h1 className="text-2xl md:text-3xl font-bold mb-2">{title}</h1>
      <p className="text-gray-600 mb-4 text-sm md:text-base">{description}</p>
      <div className="w-full md:w-1/2">
        <input
          type="text"
          placeholder="Search listings..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-black focus:border-black text-sm md:text-base"
        />
      </div>
    </div>
  );
}

function StatsGrid({ stats }: StatsGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white p-3 md:p-4 border border-gray-200 rounded-lg">
          <p className="text-gray-500 text-xs md:text-sm">{stat.label}</p>
          <p className="text-xl md:text-2xl font-bold">{stat.value}</p>
        </div>
      ))}
    </div>
  );
}

function ChartSection({ data }: ChartSectionProps) {
  return (
    <div className="bg-white p-4 md:p-6 border border-gray-200 rounded-lg mb-6 md:mb-8">
      <h2 className="text-lg md:text-xl font-bold mb-4">Average Sold Price Trend</h2>
      <div className="h-48 md:h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="date" fontSize={12} />
            <YAxis fontSize={12} />
            <Tooltip formatter={(value) => [`$${value}`, 'Price']} />
            <Bar dataKey="price" fill="#333" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function ListingsTable({ listings }: ListingsTableProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <TableHeader>Listing</TableHeader>
              <TableHeader>Actions</TableHeader>
              <TableHeader>Avg sold price</TableHeader>
              <TableHeader className="hidden sm:table-cell">Avg shipping</TableHeader>
              <TableHeader className="hidden md:table-cell">Total sold</TableHeader>
              <TableHeader className="hidden lg:table-cell">Item sales</TableHeader>
              <TableHeader className="hidden xl:table-cell">Date last sold</TableHeader>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {listings.length > 0 ? (
              listings.map((item) => (
                <TableRow key={item.id} item={item} />
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-4 md:px-6 py-4 text-center text-gray-500 text-sm md:text-base">
                  No listings found matching your search
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TableHeader({ children, className = "" }: TableHeaderProps & { className?: string }) {
  return (
    <th className={`px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${className}`}>
      {children}
    </th>
  );
}

function TableRow({ item }: TableRowProps) {
  return (
    <tr className="hover:bg-gray-50">
      <td className="px-4 md:px-6 py-4">
        <div className="text-sm font-medium text-gray-900">{item.title}</div>
        <div className="text-xs md:text-sm text-gray-500">{item.type}</div>
      </td>
      <td className="px-4 md:px-6 py-4 whitespace-nowrap">
        <button className="text-blue-600 hover:text-blue-900 text-xs md:text-sm">Edit</button>
      </td>
      <td className="px-4 md:px-6 py-4 whitespace-nowrap text-xs md:text-sm text-gray-900">
        {item.price}
      </td>
      <td className="px-4 md:px-6 py-4 whitespace-nowrap text-xs md:text-sm text-gray-900 hidden sm:table-cell">
        {item.shipping} <span className="text-gray-500">({item.freeShipping})</span>
      </td>
      <td className="px-4 md:px-6 py-4 whitespace-nowrap text-xs md:text-sm text-gray-900 hidden md:table-cell">
        {item.sold}
      </td>
      <td className="px-4 md:px-6 py-4 whitespace-nowrap text-xs md:text-sm text-gray-900 hidden lg:table-cell">
        {item.revenue}
      </td>
      <td className="px-4 md:px-6 py-4 whitespace-nowrap text-xs md:text-sm text-gray-500 hidden xl:table-cell">
        {item.lastSold}
      </td>
    </tr>
  );
}