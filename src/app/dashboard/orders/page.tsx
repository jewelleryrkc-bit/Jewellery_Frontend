/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useMutation, useQuery } from "@apollo/client";
import { GET_SELLER_ORDERS } from "../../../graphql/queries";
import { formatCurrency } from "../../../lib/formatCurrency";
import { useCurrency } from "../../../providers/CurrencyContext";
import TopHeader from "../../../components/TopHeader";
import SearchBar from "../../../components/SearchBar";
import Footer from "../../../components/Footer";
import {
  Loader2,
  AlertCircle,
  ChevronDown,
  Download,
  Printer,
  Filter,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Tag,
  Info,
  FileText,
} from "lucide-react";
import SellerbottomHeader from "@/components/SellerBottomHeader";
import { useState, useRef, useEffect } from "react";
import { InvoiceGenerator } from "@/lib/invoiceGenerator";
import { getInvoiceForOrder } from "@/lib/invoiceStorage";
import {
  GENERATE_INVOICE_BY_ORDER,
  RECORD_INVOICE_DOWNLOAD,
} from "../../../graphql/mutations";

export default function SellerOrdersPage() {
  const { currency } = useCurrency();
  const [active, setActive] = useState("P");
  const { data, loading, error } = useQuery(GET_SELLER_ORDERS);
  const [selectedStatus, setSelectedStatus] = useState("awaiting_shipment");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showDateFilter, setShowDateFilter] = useState(false);
  const [generateInvoice] = useMutation(GENERATE_INVOICE_BY_ORDER);
  const [recordDownload] = useMutation(RECORD_INVOICE_DOWNLOAD);
  const [dateFilter, setDateFilter] = useState({
    startDate: "",
    endDate: "",
  });
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const dateFilterRef = useRef<HTMLDivElement>(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [maxScroll, setMaxScroll] = useState(0);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  const sidebarItems = [
    "Edit store",
    "Store categories",
    "Store traffic",
    "Store newsletter",
    "Promote your store",
    "Social",
    "Manage subscription",
  ];

  useEffect(() => {
    if (tableContainerRef.current) {
      const updateMaxScroll = () => {
        if (tableContainerRef.current) {
          setMaxScroll(
            tableContainerRef.current.scrollWidth -
              tableContainerRef.current.clientWidth
          );
        }
      };

      updateMaxScroll();
      window.addEventListener("resize", updateMaxScroll);
      return () => window.removeEventListener("resize", updateMaxScroll);
    }
  }, [data]);

  // Close date filter when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dateFilterRef.current &&
        !dateFilterRef.current.contains(event.target as Node)
      ) {
        setShowDateFilter(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleScroll = (direction: "left" | "right") => {
    if (tableContainerRef.current) {
      const scrollAmount = 300;
      const newPosition =
        direction === "right"
          ? Math.min(scrollPosition + scrollAmount, maxScroll)
          : Math.max(scrollPosition - scrollAmount, 0);

      tableContainerRef.current.scrollTo({
        left: newPosition,
        behavior: "smooth",
      });
      setScrollPosition(newPosition);
    }
  };

  const handleGenerateInvoice = (orderId: string) => {
    const order = orders.find((o: any) => o.id === orderId);
    if (order) {
      const invoiceNumber = InvoiceGenerator.downloadInvoice(order, currency);
      // Optional: Refresh the UI if needed
      // You would need a state setter for orders if you want to update the UI
    }
  };

  const toggleOrderExpansion = (orderId: string) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <TopHeader />
        <SearchBar onSellerSearch={() => {}} />
        <main className="flex-grow flex items-center justify-center">
          <Loader2 className="h-10 w-10 text-gray-600 animate-spin" />
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <TopHeader />
        <SearchBar onSellerSearch={() => {}} />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="h-10 w-10 text-red-600 mx-auto mb-2" />
            <p className="text-gray-700">Failed to load orders. Please try again.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const orders = data?.getSellerOrders || [];

  // Filter and sort orders
  let filteredOrders = orders.filter((order: any) => {
    if (selectedStatus === "all") return true;
    return selectedStatus === "awaiting_shipment";
  });

  // Apply date filter
  if (dateFilter.startDate || dateFilter.endDate) {
    filteredOrders = filteredOrders.filter((order: any) => {
      const orderDate = new Date(Number(order.createdAt));
      const startDate = dateFilter.startDate ? new Date(dateFilter.startDate) : null;
      const endDate = dateFilter.endDate ? new Date(dateFilter.endDate) : null;

      if (startDate && orderDate < startDate) return false;
      if (endDate && orderDate > endDate) return false;

      return true;
    });
  }

  // Apply sorting
  filteredOrders = [...filteredOrders].sort((a: any, b: any) => {
    const dateA = new Date(Number(a.createdAt)).getTime();
    const dateB = new Date(Number(b.createdAt)).getTime();

    return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
  });

  // Pagination
  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const clearDateFilter = () => {
    setDateFilter({ startDate: "", endDate: "" });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <TopHeader />
      <SearchBar onSellerSearch={() => {}} />
      <SellerbottomHeader />

      {/* Mobile Sidebar Toggle */}
      <div className="md:hidden bg-white border-b border-gray-200 p-4">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="flex items-center text-gray-700 font-medium"
        >
          <Filter className="h-4 w-4 mr-2" />
          Menu
        </button>
      </div>

      {/* Main container with proper spacing */}
      <div className="flex flex-1 mt-0 md:mt-8">
        {/* Sidebar - Mobile overlay */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`fixed md:static top-0 left-0 h-full w-64 bg-gray-50 p-6 z-50 transform transition-transform duration-300 ease-in-out ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0 md:block`}
        >
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="absolute top-4 right-4 md:hidden text-gray-500 hover:text-gray-700"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <ul className="space-y-2 mt-8 md:mt-0">
            {sidebarItems.map((item) => (
              <li
                key={item}
                onClick={() => {
                  setActive(item);
                  setIsSidebarOpen(false);
                }}
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
        <main className="flex-1 bg-white rounded-lg border border-gray-300 md:ml-4 mx-2 md:mx-0 mb-4 md:mb-0">
          <div className="p-4 md:p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
              <h1 className="text-xl font-semibold text-gray-900 mb-2 md:mb-0">
                Orders awaiting shipment
              </h1>
              <div className="flex items-center gap-2">
                <div className="relative" ref={dateFilterRef}>
                  <button
                    onClick={() => setShowDateFilter(!showDateFilter)}
                    className="flex items-center text-sm text-gray-700 bg-white border border-gray-300 rounded-md px-3 py-2 hover:bg-gray-50"
                  >
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>Date filter</span>
                    <ChevronDown className="h-4 w-4 ml-1" />
                  </button>

                  {showDateFilter && (
                    <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-300 rounded-md shadow-lg z-50 p-4">
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="font-medium">Filter by date</h3>
                        <button
                          onClick={() => setShowDateFilter(false)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          &times;
                        </button>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            From
                          </label>
                          <input
                            type="date"
                            value={dateFilter.startDate}
                            onChange={(e) =>
                              setDateFilter({ ...dateFilter, startDate: e.target.value })
                            }
                            className="w-full p-2 border border-gray-300 rounded-md"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            To
                          </label>
                          <input
                            type="date"
                            value={dateFilter.endDate}
                            onChange={(e) =>
                              setDateFilter({ ...dateFilter, endDate: e.target.value })
                            }
                            className="w-full p-2 border border-gray-300 rounded-md"
                          />
                        </div>

                        <div className="flex items-center space-x-2">
                          <label className="text-sm font-medium text-gray-700">
                            Sort by:
                          </label>
                          <select
                            value={sortOrder}
                            onChange={(e) =>
                              setSortOrder(e.target.value as "newest" | "oldest")
                            }
                            className="p-2 border border-gray-300 rounded-md text-sm"
                          >
                            <option value="newest">Newest first</option>
                            <option value="oldest">Oldest first</option>
                          </select>
                        </div>

                        <div className="flex justify-between pt-2">
                          <button
                            onClick={clearDateFilter}
                            className="text-sm text-gray-600 hover:text-gray-800"
                          >
                            Clear filters
                          </button>
                          <button
                            onClick={() => setShowDateFilter(false)}
                            className="px-3 py-1.5 bg-gray-800 text-white text-sm rounded-md hover:bg-gray-900"
                          >
                            Apply
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <button className="flex items-center text-sm text-gray-700 bg-white border border-gray-300 rounded-md px-3 py-2 hover:bg-gray-50">
                  <span className="hidden sm:inline">Saved filters</span>
                  <ChevronDown className="h-4 w-4 ml-1" />
                </button>
              </div>
            </div>

            {/* Stats and Actions Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 p-4 bg-gray-50 rounded-md border border-gray-300">
              <div className="flex items-center flex-wrap gap-2">
                <span className="text-sm text-gray-700">
                  <span className="font-medium">{filteredOrders.length}</span> orders
                </span>
                <span className="text-gray-400 hidden sm:inline">•</span>
                <span className="text-sm text-gray-700">
                  Total Revenue:{" "}
                  <span className="font-medium">
                    {formatCurrency(
                      filteredOrders.reduce((acc: number, o: any) => acc + o.total, 0),
                      currency
                    )}
                  </span>
                </span>
                <span className="text-gray-400 hidden sm:inline">•</span>
                <span className="text-sm text-gray-700">
                  Total Discounts:{" "}
                  <span className="font-medium">
                    {formatCurrency(
                      filteredOrders.reduce((acc: number, o: any) => acc + (o.discount || 0), 0),
                      currency
                    )}
                  </span>
                </span>

                {(dateFilter.startDate || dateFilter.endDate) && (
                  <>
                    <span className="text-gray-400 hidden sm:inline">•</span>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                      Filtered by date
                      <button
                        onClick={clearDateFilter}
                        className="ml-1 text-blue-600 hover:text-blue-800"
                      >
                        &times;
                      </button>
                    </span>
                  </>
                )}
              </div>

              <div className="flex items-center space-x-3 mt-2 sm:mt-0">
                <button className="flex items-center text-sm text-gray-700 hover:text-gray-900">
                  <Printer className="h-4 w-4 mr-1" />
                  <span className="hidden sm:inline">Print</span>
                </button>
                <button className="flex items-center text-sm text-gray-700 hover:text-gray-900">
                  <Download className="h-4 w-4 mr-1" />
                  <span className="hidden sm:inline">Download</span>
                </button>
              </div>
            </div>

            {/* Table Navigation for Mobile */}
            <div className="flex items-center justify-between mb-4 md:hidden">
              <button
                onClick={() => handleScroll("left")}
                disabled={scrollPosition === 0}
                className="p-2 rounded-full bg-gray-100 disabled:opacity-50"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="text-sm text-gray-600">Swipe to see more</span>
              <button
                onClick={() => handleScroll("right")}
                disabled={scrollPosition >= maxScroll}
                className="p-2 rounded-full bg-gray-100 disabled:opacity-50"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            {/* Orders Table Container with Horizontal Scrolling */}
            <div className="border border-gray-300 rounded-lg overflow-hidden">
              <div 
                ref={tableContainerRef}
                className="overflow-x-auto"
                style={{ width: '100%' }}
              >
                <table className="min-w-full">
                  <thead className="bg-gray-50 border-b border-gray-300">
                    <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <th className="p-3 w-8">
                        <input
                          type="checkbox"
                          className="rounded text-gray-600 focus:ring-gray-500"
                        />
                      </th>
                      <th className="p-3 min-w-[160px]">Order Details</th>
                      <th className="p-3 min-w-[80px]">Items</th>
                      <th className="p-3 min-w-[100px]">Subtotal</th>
                      <th className="p-3 min-w-[100px]">Discount</th>
                      <th className="p-3 min-w-[100px]">Total</th>
                      <th className="p-3 min-w-[120px]">Status</th>
                      <th className="p-3 min-w-[120px]">Sold date</th>
                      <th className="p-3 min-w-[120px]">Action</th>
                      <th className="p-3 min-w-[100px]">Invoice</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-300">
                    {paginatedOrders.length > 0 ? (
                      paginatedOrders.map((order: any) => (
                        <>
                          <tr
                            key={order.id}
                            className="hover:bg-gray-50 cursor-pointer"
                            onClick={() => toggleOrderExpansion(order.id)}
                          >
                            <td className="p-3">
                              <input
                                type="checkbox"
                                className="rounded text-gray-600 focus:ring-gray-500"
                              />
                            </td>
                            <td className="p-3">
                              <div className="flex items-center gap-3 min-w-[160px]">
                                <div className="min-w-0 flex-1">
                                  <p className="font-medium text-gray-900 text-sm">
                                    Order #{order.id.slice(-6).toUpperCase()}
                                  </p>
                                  <p className="text-xs text-gray-500 mt-1">
                                    Buyer: {order.user?.username || "Unknown"}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="p-3 text-sm text-gray-700">
                              {order.items.length} items
                            </td>
                            <td className="p-3 text-sm text-gray-700">
                              {formatCurrency(
                                order.subtotal ||
                                  order.items.reduce(
                                    (sum: number, item: any) => sum + item.price * item.quantity,
                                    0
                                  ),
                                currency
                              )}
                            </td>
                            <td className="p-3 text-sm text-green-600">
                              {order.discount > 0 ? (
                                <div className="flex items-center">
                                  <Tag className="h-3 w-3 mr-1" />
                                  -{formatCurrency(order.discount, currency)}
                                </div>
                              ) : (
                                formatCurrency(0, currency)
                              )}
                            </td>
                            <td className="p-3 font-semibold text-sm text-gray-900">
                              {formatCurrency(order.total, currency)}
                            </td>
                            <td className="p-3">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                {order.status}
                              </span>
                            </td>
                            <td className="p-3 text-sm text-gray-700">
                              {new Date(Number(order.createdAt)).toLocaleDateString()}
                            </td>
                            <td className="p-3">
                              <div className="flex items-center">
                                <button className="text-xs bg-gray-800 hover:bg-gray-900 text-white px-3 py-1.5 rounded whitespace-nowrap">
                                  Ship now
                                </button>
                                <button className="ml-2 text-gray-500 hover:text-gray-700">
                                  <MoreHorizontal className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                            <td className="p-3">
                              <div className="flex items-center">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleGenerateInvoice(order.id);
                                  }}
                                  className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded flex items-center"
                                >
                                  <FileText className="h-3 w-3 mr-1" />
                                  Invoice
                                </button>
                              </div>
                            </td>
                          </tr>

                          {/* Expanded order details */}
                          {expandedOrder === order.id && (
                            <tr key={`expanded-${order.id}`} className="bg-gray-50">
                              <td colSpan={10} className="p-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  {/* Order Items */}
                                  <div>
                                    <h4 className="text-sm font-medium text-gray-900 mb-3">
                                      Order Items
                                    </h4>
                                    <div className="space-y-3">
                                      {order.items.map((item: any) => (
                                        <div
                                          key={item.id}
                                          className="flex items-center justify-between p-2 bg-white rounded border"
                                        >
                                          <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
                                              {item.product?.images?.[0] ? (
                                                <img
                                                  src={item.product.images[0]}
                                                  alt={item.product.name}
                                                  className="w-full h-full object-cover"
                                                />
                                              ) : (
                                                <div className="text-xs text-gray-400">No Image</div>
                                              )}
                                            </div>
                                            <div>
                                              <p className="text-sm font-medium">
                                                {item.product?.name}
                                              </p>
                                              {item.variation?.size && (
                                                <p className="text-xs text-gray-500">
                                                  Size: {item.variation.size}
                                                </p>
                                              )}
                                              <p className="text-xs text-gray-500">
                                                Qty: {item.quantity}
                                              </p>
                                            </div>
                                          </div>
                                          <div className="text-right">
                                            <p className="text-sm">
                                              {formatCurrency(item.price, currency)} each
                                            </p>
                                            <p className="text-sm font-medium">
                                              {formatCurrency(item.price * item.quantity, currency)}
                                            </p>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>

                                  {/* Price Breakdown */}
                                  <div>
                                    <h4 className="text-sm font-medium text-gray-900 mb-3">
                                      Price Breakdown
                                    </h4>
                                    <div className="bg-white p-4 rounded border space-y-2">
                                      <div className="flex justify-between text-sm">
                                        <span>Items Subtotal:</span>
                                        <span>
                                          {formatCurrency(
                                            order.subtotal ||
                                              order.items.reduce(
                                                (sum: number, item: any) =>
                                                  sum + item.price * item.quantity,
                                                0
                                              ),
                                            currency
                                          )}
                                        </span>
                                      </div>

                                      {order.discount > 0 && (
                                        <div className="flex justify-between text-sm text-green-600">
                                          <span>Discounts Applied:</span>
                                          <span>-{formatCurrency(order.discount, currency)}</span>
                                        </div>
                                      )}

                                      <div className="border-t pt-2 mt-2">
                                        <div className="flex justify-between font-medium">
                                          <span>Order Total:</span>
                                          <span>{formatCurrency(order.total, currency)}</span>
                                        </div>
                                      </div>

                                      {order.discountBreakdown && (
                                        <div className="mt-3 pt-3 border-t">
                                          <h5 className="text-xs font-medium text-gray-700 mb-2">
                                            Discount Details:
                                          </h5>
                                          <div className="text-xs text-gray-600 space-y-1">
                                            {JSON.parse(order.discountBreakdown).map(
                                              (discount: any, index: number) => (
                                                <div key={index} className="flex justify-between">
                                                  <span>
                                                    {discount.name || discount.description}:
                                                  </span>
                                                  <span>-{formatCurrency(discount.amount, currency)}</span>
                                                </div>
                                              )
                                            )}
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={10} className="p-8 text-center text-gray-500">
                          No orders found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row items-center justify-between mt-4 px-2 py-3 gap-3">
              <div className="text-sm text-gray-700">
                Showing{" "}
                <span className="font-medium">
                  {(currentPage - 1) * itemsPerPage + 1}
                </span>{" "}
                to{" "}
                <span className="font-medium">
                  {Math.min(currentPage * itemsPerPage, filteredOrders.length)}
                </span>{" "}
                of <span className="font-medium">{filteredOrders.length}</span> results
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}