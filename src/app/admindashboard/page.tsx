/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { GET_USERS, GET_COMPANIES, ALL_PRODUCTS_QUERY_FOR_ADMIN, GET_ADMIN } from "../../graphql/queries";
import { TOGGLE_PRODUCT_STATUS } from "../../graphql/mutations";
import Adheader from "@/components/Adheader/page";
import Link from "next/link";
import LoadingPage from "@/components/LoadingPage";
import { 
  FiHome, 
  FiUsers, 
  FiShoppingBag, 
  FiSettings, 
  FiFilter,
  FiChevronDown,
  FiChevronUp,
  FiSearch
} from "react-icons/fi";
import { FaUserShield } from "react-icons/fa";

enum ReviewSentiment {
  POSITIVE = "POSITIVE",
  NEUTRAL = "NEUTRAL",
  NEGATIVE = "NEGATIVE"
}

export default function AdminDashboard() {
  const { data: adminData, loading: adminLoading } = useQuery(GET_ADMIN);
  const { data: usersData, loading: usersLoading } = useQuery(GET_USERS);
  const { data: companiesData, loading: companiesLoading } = useQuery(GET_COMPANIES);
  const { data: productsData, loading: productsLoading } = useQuery(ALL_PRODUCTS_QUERY_FOR_ADMIN);
  const [toggleProductStatus] = useMutation(TOGGLE_PRODUCT_STATUS, {
    refetchQueries: [{ query: ALL_PRODUCTS_QUERY_FOR_ADMIN }],
  });

  // State management
  const [selectedSentiment, setSelectedSentiment] = useState<ReviewSentiment | null>(null);
  const [minRating, setMinRating] = useState<number | null>(null);
  const [maxRating, setMaxRating] = useState<number | null>(null);
  const [showUserFilters, setShowUserFilters] = useState(false);
  const [productSearchTerm, setProductSearchTerm] = useState("");
  const [userSortOrder, setUserSortOrder] = useState<"newest" | "oldest">("newest");
  const [emailFilter, setEmailFilter] = useState<"all" | "verified" | "unverified">("all");
  const [productSortOrder, setProductSortOrder] = useState<"asc" | "desc">("desc");
  const [productSortKey, setProductSortKey] = useState<"createdAt" | "name" | "price">("createdAt");
  const [sellerSearchTerm, setSellerSearchTerm] = useState("");
  const [sellerSortKey, setSellerSortKey] = useState<"createdAt" | "name" | "email">("createdAt");
  const [sellerSortOrder, setSellerSortOrder] = useState<"asc" | "desc">("desc");
  const [expandedSections, setExpandedSections] = useState({
    sellers: true,
    products: true,
    users: true
  });
  
  const formatTimestamp = (timestamp: number | string) => {
    const date = new Date(Number(timestamp));
    return isNaN(date.getTime()) ? "Invalid Date" : date.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleToggleStatus = async (productId: string, currentStatus: string) => {
    const newStatus = currentStatus === "ACTIVE" ? "DISABLED" : "ACTIVE";
    try {
      await toggleProductStatus({
        variables: {
          productId,
          status: newStatus,
        },
      });
    } catch (error) {
      console.error("Error toggling product status:", error);
    }
  };

  if (usersLoading || companiesLoading || productsLoading || adminLoading) {
    return <LoadingPage />;
  }

  // Filter and sort functions
  const filteredAndSortedUsers = [...(usersData?.users || [])]
    .filter((user: any) => {
      if (emailFilter === "verified") return user.isEmailVerified;
      if (emailFilter === "unverified") return !user.isEmailVerified;
      return true;
    })
    .sort((a: any, b: any) => {
      const dateA = Number(a.createdAt);
      const dateB = Number(b.createdAt);
      return userSortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });

  const filteredSellers = [...(companiesData?.getCompanies || [])]
    .filter((company: any) =>
      company.cname.toLowerCase().includes(sellerSearchTerm.toLowerCase()) ||
      company.username.toLowerCase().includes(sellerSearchTerm.toLowerCase()) ||
      company.email.toLowerCase().includes(sellerSearchTerm.toLowerCase())
    )
    .sort((a: any, b: any) => {
      let valueA = a[sellerSortKey];
      let valueB = b[sellerSortKey];

      if (sellerSortKey === "createdAt") {
        valueA = Number(valueA);
        valueB = Number(valueB);
        return sellerSortOrder === "asc" ? valueA - valueB : valueB - valueA;
      }

      if (typeof valueA === "string") valueA = valueA.toLowerCase();
      if (typeof valueB === "string") valueB = valueB.toLowerCase();

      if (valueA < valueB) return sellerSortOrder === "asc" ? -1 : 1;
      if (valueA > valueB) return sellerSortOrder === "asc" ? 1 : -1;
      return 0;
    });

  const filteredProducts = [...(productsData?.allProductsforadmin || [])]
    .filter((product: any) => {
      // Search filter
      const matchesSearch = 
        product.name.toLowerCase().includes(productSearchTerm.toLowerCase()) ||
        product.material?.toLowerCase().includes(productSearchTerm.toLowerCase()) ||
        product.category?.name?.toLowerCase().includes(productSearchTerm.toLowerCase());
      
      // Sentiment filter
      const matchesSentiment = !selectedSentiment || 
        (product.reviews && product.reviews.some((review: any) => review.sentiment === selectedSentiment));
      
      // Rating filter
      const matchesRating = 
        (minRating === null || (product.averageRating !== null && product.averageRating >= minRating)) &&
        (maxRating === null || (product.averageRating !== null && product.averageRating <= maxRating));

      return matchesSearch && matchesSentiment && matchesRating;
    })
    .sort((a: any, b: any) => {
      let valueA = a[productSortKey];
      let valueB = b[productSortKey];

      if (productSortKey === "name") {
        valueA = valueA.toLowerCase();
        valueB = valueB.toLowerCase();
        if (valueA < valueB) return productSortOrder === "asc" ? -1 : 1;
        if (valueA > valueB) return productSortOrder === "asc" ? 1 : -1;
        return 0;
      }

      const numA = Number(valueA);
      const numB = Number(valueB);
      return productSortOrder === "asc" ? numA - numB : numB - numA;
    });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const clearFilters = () => {
    setSelectedSentiment(null);
    setMinRating(null);
    setMaxRating(null);
    setProductSearchTerm("");
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      {/* Header */}
      <Adheader />

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="sticky top-0 hidden h-screen w-64 border-r bg-white shadow-sm md:block">
          <div className="p-4">
            <div className="mb-6 mt-2 flex items-center space-x-2">
              <FaUserShield className="h-6 w-6 text-blue-500" />
              <h2 className="text-xl font-semibold text-gray-800">Admin Panel</h2>
            </div>
            <nav className="space-y-1">
              <Link
                href="/"
                className="flex items-center space-x-3 rounded-lg px-4 py-3 text-gray-700 hover:bg-gray-100"
              >
                <FiHome className="h-5 w-5" />
                <span>Dashboard</span>
              </Link>
              <Link
                href="#sellers"
                className="flex items-center space-x-3 rounded-lg px-4 py-3 text-gray-700 hover:bg-gray-100"
              >
                <FiUsers className="h-5 w-5" />
                <span>Sellers</span>
              </Link>
              <Link
                href="/admindashboard/products"
                className="flex items-center space-x-3 rounded-lg px-4 py-3 text-gray-700 hover:bg-gray-100"
              >
                <FiShoppingBag className="h-5 w-5" />
                <span>Products</span>
              </Link>
              <Link
                href="#users"
                className="flex items-center space-x-3 rounded-lg px-4 py-3 text-gray-700 hover:bg-gray-100"
              >
                <FiUsers className="h-5 w-5" />
                <span>Users</span>
              </Link>
              <Link
                href="#settings"
                className="flex items-center space-x-3 rounded-lg px-4 py-3 text-gray-700 hover:bg-gray-100"
              >
                <FiSettings className="h-5 w-5" />
                <span>Settings</span>
              </Link>
              <Link
                href="#reports"
                className="flex items-center space-x-3 rounded-lg px-4 py-3 text-gray-700 hover:bg-gray-100"
              >
                <FiSettings className="h-5 w-5" />
                <span>Reports</span>
              </Link>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6">
          {/* Stats Cards - Optional */}
          <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-lg bg-white p-4 shadow">
              <h3 className="text-sm font-medium text-gray-500">Total Sellers</h3>
              <p className="mt-1 text-2xl font-semibold">{companiesData?.getCompanies?.length || 0}</p>
            </div>
            <div className="rounded-lg bg-white p-4 shadow">
              <h3 className="text-sm font-medium text-gray-500">Total Products</h3>
              <p className="mt-1 text-2xl font-semibold">{productsData?.allProductsforadmin?.length || 0}</p>
            </div>
            <div className="rounded-lg bg-white p-4 shadow">
              <h3 className="text-sm font-medium text-gray-500">Total Users</h3>
              <p className="mt-1 text-2xl font-semibold">{usersData?.users?.length || 0}</p>
            </div>
          </div>

          {/* Sellers Section */}
          <section id="sellers" className="mb-8">
            <div 
              className="flex cursor-pointer items-center justify-between rounded-t-lg bg-white p-4 shadow"
              onClick={() => toggleSection("sellers")}
            >
              <h2 className="text-xl font-semibold text-gray-800">Sellers Management</h2>
              {expandedSections.sellers ? <FiChevronUp /> : <FiChevronDown />}
            </div>
            
            {expandedSections.sellers && (
              <>
                <div className="rounded-b-lg bg-white p-4 shadow">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">Sort by</label>
                      <select
                        className="w-full rounded-md border border-gray-300 p-2 text-sm"
                        value={sellerSortKey}
                        onChange={(e) => setSellerSortKey(e.target.value as any)}
                      >
                        <option value="createdAt">Created Date</option>
                        <option value="name">Name</option>
                        <option value="email">Email</option>
                      </select>
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">Order</label>
                      <select
                        className="w-full rounded-md border border-gray-300 p-2 text-sm"
                        value={sellerSortOrder}
                        onChange={(e) => setSellerSortOrder(e.target.value as any)}
                      >
                        <option value="desc">Descending</option>
                        <option value="asc">Ascending</option>
                      </select>
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">Search</label>
                      <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                          <FiSearch className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          placeholder="Search sellers..."
                          className="block w-full rounded-md border border-gray-300 py-2 pl-10 pr-3 text-sm"
                          value={sellerSearchTerm}
                          onChange={(e) => setSellerSearchTerm(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 overflow-hidden rounded-lg shadow">
                  <table className="min-w-full bg-white">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                          Company
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                          Contact
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                          Location
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                          Created
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredSellers.map((company: any) => (
                        <tr key={company.id} className="hover:bg-gray-50">
                          <td className="whitespace-nowrap px-6 py-4">
                            <Link
                              href={`/admindashboard/companies/${company.id}`}
                              className="text-blue-600 hover:text-blue-800 hover:underline"
                            >
                              {company.cname}
                            </Link>
                          </td>
                          <td className="whitespace-nowrap px-6 py-4">{company.contact}</td>
                          <td className="whitespace-nowrap px-6 py-4">{company.email}</td>
                          <td className="whitespace-nowrap px-6 py-4">{company.location}</td>
                          <td className="whitespace-nowrap px-6 py-4">
                            {formatTimestamp(company.createdAt)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </section>

          {/* Products Section */}
          <section id="products" className="mb-8">
            <div 
              className="flex cursor-pointer items-center justify-between rounded-t-lg bg-white p-4 shadow"
              onClick={() => toggleSection("products")}
            >
              <h2 className="text-xl font-semibold text-gray-800">Products Management</h2>
              {expandedSections.products ? <FiChevronUp /> : <FiChevronDown />}
            </div>
            
            {expandedSections.products && (
              <>
                <div className="rounded-b-lg bg-white p-4 shadow">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                    {/* Existing filters */}
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">Sort by</label>
                      <select
                        className="w-full rounded-md border border-gray-300 p-2 text-sm"
                        value={productSortKey}
                        onChange={(e) => setProductSortKey(e.target.value as any)}
                      >
                        <option value="createdAt">Created Date</option>
                        <option value="name">Name</option>
                        <option value="price">Price</option>
                      </select>
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">Order</label>
                      <select
                        className="w-full rounded-md border border-gray-300 p-2 text-sm"
                        value={productSortOrder}
                        onChange={(e) => setProductSortOrder(e.target.value as any)}
                      >
                        <option value="desc">Descending</option>
                        <option value="asc">Ascending</option>
                      </select>
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">Search</label>
                      <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                          <FiSearch className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          placeholder="Search products..."
                          className="block w-full rounded-md border border-gray-300 py-2 pl-10 pr-3 text-sm"
                          value={productSearchTerm}
                          onChange={(e) => setProductSearchTerm(e.target.value)}
                        />
                      </div>
                    </div>

                    {/* New filters */}
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">Sentiment</label>
                      <select
                        className="w-full rounded-md border border-gray-300 p-2 text-sm"
                        value={selectedSentiment || ''}
                        onChange={(e) => setSelectedSentiment(e.target.value as ReviewSentiment || null)}
                      >
                        <option value="">All Sentiments</option>
                        <option value={ReviewSentiment.POSITIVE}>Positive</option>
                        <option value={ReviewSentiment.NEUTRAL}>Neutral</option>
                        <option value={ReviewSentiment.NEGATIVE}>Negative</option>
                      </select>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">Min Rating</label>
                      <input
                        type="number"
                        min="0"
                        max="5"
                        step="0.1"
                        className="w-full rounded-md border border-gray-300 p-2 text-sm"
                        value={minRating || ''}
                        onChange={(e) => setMinRating(e.target.value ? parseFloat(e.target.value) : null)}
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">Max Rating</label>
                      <input
                        type="number"
                        min="0"
                        max="5"
                        step="0.1"
                        className="w-full rounded-md border border-gray-300 p-2 text-sm"
                        value={maxRating || ''}
                        onChange={(e) => setMaxRating(e.target.value ? parseFloat(e.target.value) : null)}
                        placeholder="5"
                      />
                    </div>
                    <div className="flex items-end">
                      <button
                        onClick={clearFilters}
                        className="rounded bg-gray-200 px-4 py-2 text-sm text-gray-700 hover:bg-gray-300"
                      >
                        Clear Filters
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-4 overflow-hidden rounded-lg shadow">
                  <table className="min-w-full bg-white">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                          Product
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                          Material
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                          Category
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                          Price
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                          Avg Rating
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                          Review Count
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                          Created
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredProducts.map((product: any) => (
                        <tr key={product.id} className="hover:bg-gray-50">
                          <td className="whitespace-nowrap px-6 py-4 font-medium">
                            {product.name}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4">{product.material || '-'}</td>
                          <td className="whitespace-nowrap px-6 py-4">{product.category?.name || '-'}</td>
                          <td className="whitespace-nowrap px-6 py-4">₹{product.price}</td>
                          <td className="whitespace-nowrap px-6 py-4 text-center">
                            {product.averageRating?.toFixed(1) || '-'}
                          </td>
                          <td className="whitespace-nowrap text-center px-6 py-4">
                            {product.reviewCount || '-'}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4">
                            <button
                              onClick={() => handleToggleStatus(product.id, product.status)}
                              className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                                product.status === "ACTIVE"
                                  ? "bg-green-100 text-green-800 hover:bg-green-200"
                                  : "bg-red-100 text-red-800 hover:bg-red-200"
                              }`}
                            >
                              {product.status === "ACTIVE" ? "Active" : "Disabled"}
                            </button>
                          </td>
                          <td className="whitespace-nowrap px-6 py-4">
                            {formatTimestamp(product.createdAt)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </section>

          {/* Users Section */}
          <section id="users" className="mb-8">
            <div 
              className="flex cursor-pointer items-center justify-between rounded-t-lg bg-white p-4 shadow"
              onClick={() => toggleSection("users")}
            >
              <h2 className="text-xl font-semibold text-gray-800">Users Management</h2>
              {expandedSections.users ? <FiChevronUp /> : <FiChevronDown />}
            </div>
            
            {expandedSections.users && (
              <>
                <div className="rounded-b-lg bg-white p-4 shadow">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">Sort by</label>
                      <select
                        className="w-full rounded-md border border-gray-300 p-2 text-sm"
                        value={userSortOrder}
                        onChange={(e) => setUserSortOrder(e.target.value as any)}
                      >
                        <option value="newest">Newest First</option>
                        <option value="oldest">Oldest First</option>
                      </select>
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">Email Status</label>
                      <select
                        className="w-full rounded-md border border-gray-300 p-2 text-sm"
                        value={emailFilter}
                        onChange={(e) => setEmailFilter(e.target.value as any)}
                      >
                        <option value="all">All Users</option>
                        <option value="verified">Verified Only</option>
                        <option value="unverified">Unverified Only</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="mt-4 overflow-hidden rounded-lg shadow">
                  <table className="min-w-full bg-white">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                          Username
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                          Contact
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                          Verified
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                          Created
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredAndSortedUsers.map((user: any) => (
                        <tr key={user.id} className="hover:bg-gray-50">
                          <td className="whitespace-nowrap px-6 py-4 font-medium">
                            {user.username}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4">{user.email}</td>
                          <td className="whitespace-nowrap px-6 py-4">{user.contact || '-'}</td>
                          <td className="whitespace-nowrap px-6 py-4">
                            <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                              user.isEmailVerified 
                                ? "bg-green-100 text-green-800" 
                                : "bg-red-100 text-red-800"
                            }`}>
                              {user.isEmailVerified ? "Yes" : "No"}
                            </span>
                          </td>
                          <td className="whitespace-nowrap px-6 py-4">
                            {formatTimestamp(user.createdAt)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}