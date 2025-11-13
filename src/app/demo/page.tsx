// /* eslint-disable @typescript-eslint/no-unused-vars */
// /* eslint-disable @next/next/no-img-element */
// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import { useQuery } from "@apollo/client";
// import { GET_SELLER_ORDERS } from "../../../graphql/queries";
// import { formatCurrency } from "../../../lib/formatCurrency";
// import { useCurrency } from "../../../providers/CurrencyContext";
// import TopHeader from "../../../components/TopHeader";
// import SearchBar from "../../../components/SearchBar";
// import Footer from "../../../components/Footer";
// import { Loader2, AlertCircle, ChevronDown, Download, Printer, Filter, MoreHorizontal, ChevronLeft, ChevronRight, Calendar } from "lucide-react";
// import SellerbottomHeader from "@/components/SellerBottomHeader";
// import { useState, useRef, useEffect } from "react";

// export default function SellerOrdersPage() {
//   const { currency } = useCurrency();
//   const [active, setActive] = useState("P");
//   const { data, loading, error } = useQuery(GET_SELLER_ORDERS);
//   const [selectedStatus, setSelectedStatus] = useState("awaiting_shipment");
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [showDateFilter, setShowDateFilter] = useState(false);
//   const [dateFilter, setDateFilter] = useState({
//     startDate: "",
//     endDate: ""
//   });
//   const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
//   const tableContainerRef = useRef<HTMLDivElement>(null);
//   const dateFilterRef = useRef<HTMLDivElement>(null);
//   const [scrollPosition, setScrollPosition] = useState(0);
//   const [maxScroll, setMaxScroll] = useState(0);

//   const sidebarItems = [
//     "Edit store",
//     "Store categories",
//     "Store traffic",
//     "Store newsletter",
//     "Promote your store",
//     "Social",
//     "Manage subscription",
//   ];

//   useEffect(() => {
//     if (tableContainerRef.current) {
//       const updateMaxScroll = () => {
//         if (tableContainerRef.current) {
//           setMaxScroll(tableContainerRef.current.scrollWidth - tableContainerRef.current.clientWidth);
//         }
//       };

//       updateMaxScroll();
//       window.addEventListener('resize', updateMaxScroll);
//       return () => window.removeEventListener('resize', updateMaxScroll);
//     }
//   }, [data]);

//   // Close date filter when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (dateFilterRef.current && !dateFilterRef.current.contains(event.target as Node)) {
//         setShowDateFilter(false);
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, []);

//   const handleScroll = (direction: 'left' | 'right') => {
//     if (tableContainerRef.current) {
//       const scrollAmount = 300;
//       const newPosition = direction === 'right' 
//         ? Math.min(scrollPosition + scrollAmount, maxScroll)
//         : Math.max(scrollPosition - scrollAmount, 0);
      
//       tableContainerRef.current.scrollTo({
//         left: newPosition,
//         behavior: 'smooth'
//       });
//       setScrollPosition(newPosition);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen flex flex-col bg-gray-50">
//         <TopHeader />
//         <SearchBar onSellerSearch={() => {}} />
//         <main className="flex-grow flex items-center justify-center">
//           <Loader2 className="h-10 w-10 text-gray-600 animate-spin" />
//         </main>
//         <Footer />
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen flex flex-col bg-gray-50">
//         <TopHeader />
//         <SearchBar onSellerSearch={() => {}} />
//         <main className="flex-grow flex items-center justify-center">
//           <div className="text-center">
//             <AlertCircle className="h-10 w-10 text-red-600 mx-auto mb-2" />
//             <p className="text-gray-700">Failed to load orders. Please try again.</p>
//           </div>
//         </main>
//         <Footer />
//       </div>
//     );
//   }

//   const orders = data?.getSellerOrders || [];
  
//   // Filter and sort orders
//   let filteredOrders = orders.filter((order: any) => {
//     if (selectedStatus === "all") return true;
//     return selectedStatus === "awaiting_shipment";
//   });

//   // Apply date filter
//   if (dateFilter.startDate || dateFilter.endDate) {
//     filteredOrders = filteredOrders.filter((order: any) => {
//       const orderDate = new Date(Number(order.createdAt));
//       const startDate = dateFilter.startDate ? new Date(dateFilter.startDate) : null;
//       const endDate = dateFilter.endDate ? new Date(dateFilter.endDate) : null;
      
//       if (startDate && orderDate < startDate) return false;
//       if (endDate && orderDate > endDate) return false;
      
//       return true;
//     });
//   }

//   // Apply sorting
//   filteredOrders = [...filteredOrders].sort((a: any, b: any) => {
//     const dateA = new Date(Number(a.createdAt)).getTime();
//     const dateB = new Date(Number(b.createdAt)).getTime();
    
//     return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
//   });

//   // Pagination
//   const itemsPerPage = 10;
//   const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
//   const paginatedOrders = filteredOrders.slice(
//     (currentPage - 1) * itemsPerPage,
//     currentPage * itemsPerPage
//   );

//   const clearDateFilter = () => {
//     setDateFilter({ startDate: "", endDate: "" });
//   };

//   return (
//     <div className="">
//       <TopHeader />
//       <SearchBar onSellerSearch={() => {}} />
//       <SellerbottomHeader/>  

//       {/* Mobile Sidebar Toggle */}
//       <div className="md:hidden bg-white border-b border-gray-200 p-4">
//         <button
//           onClick={() => setIsSidebarOpen(!isSidebarOpen)}
//           className="flex items-center text-gray-700 font-medium"
//         >
//           <Filter className="h-4 w-4 mr-2" />
//           Menu
//         </button>
//       </div>

//       {/* Main container with proper spacing */}
//       <div className="flex mt-0 md:mt-8">
//         {/* Sidebar - Mobile overlay */}
//         {isSidebarOpen && (
//           <div 
//             className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
//             onClick={() => setIsSidebarOpen(false)}
//           />
//         )}
        
//         {/* Sidebar */}
//         <aside className={`fixed md:static top-0 left-0 h-full w-64 bg-gray-50 p-6 z-50 transform transition-transform duration-300 ease-in-out ${
//           isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
//         } md:translate-x-0 md:block`}>
//           <button
//             onClick={() => setIsSidebarOpen(false)}
//             className="absolute top-4 right-4 md:hidden text-gray-500 hover:text-gray-700"
//           >
//             <ChevronLeft className="h-6 w-6" />
//           </button>
//           <ul className="space-y-2 mt-8 md:mt-0">
//             {sidebarItems.map((item) => (
//               <li
//                 key={item}
//                 onClick={() => {
//                   setActive(item);
//                   setIsSidebarOpen(false);
//                 }}
//                 className={`cursor-pointer rounded-lg px-4 py-3 text-sm font-medium transition hover:bg-gray-200 ${
//                   active === item ? "bg-black text-white" : "text-gray-700"
//                 }`}
//               >
//                 {item}
//               </li>
//             ))}
//           </ul>
//         </aside>

//         {/* Main Content */}
//         <main className="flex-1 bg-white rounded-lg border border-gray-300 md:ml-4 mx-2 md:mx-0 mb-4 md:mb-0">
//           <div className="p-4 md:p-6">
//             <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
//               <h1 className="text-xl font-semibold text-gray-900 mb-2 md:mb-0">Orders awaiting shipment</h1>
//               <div className="flex items-center gap-2">
//                 <div className="relative" ref={dateFilterRef}>
//                   <button 
//                     onClick={() => setShowDateFilter(!showDateFilter)}
//                     className="flex items-center text-sm text-gray-700 bg-white border border-gray-300 rounded-md px-3 py-2 hover:bg-gray-50"
//                   >
//                     <Calendar className="h-4 w-4 mr-1" />
//                     <span>Date filter</span>
//                     <ChevronDown className="h-4 w-4 ml-1" />
//                   </button>
                  
//                   {showDateFilter && (
//                     <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-300 rounded-md shadow-lg z-50 p-4">
//                       <div className="flex justify-between items-center mb-3">
//                         <h3 className="font-medium">Filter by date</h3>
//                         <button 
//                           onClick={() => setShowDateFilter(false)}
//                           className="text-gray-500 hover:text-gray-700"
//                         >
//                           &times;
//                         </button>
//                       </div>
                      
//                       <div className="space-y-3">
//                         <div>
//                           <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
//                           <input
//                             type="date"
//                             value={dateFilter.startDate}
//                             onChange={(e) => setDateFilter({...dateFilter, startDate: e.target.value})}
//                             className="w-full p-2 border border-gray-300 rounded-md"
//                           />
//                         </div>
                        
//                         <div>
//                           <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
//                           <input
//                             type="date"
//                             value={dateFilter.endDate}
//                             onChange={(e) => setDateFilter({...dateFilter, endDate: e.target.value})}
//                             className="w-full p-2 border border-gray-300 rounded-md"
//                           />
//                         </div>
                        
//                         <div className="flex items-center space-x-2">
//                           <label className="text-sm font-medium text-gray-700">Sort by:</label>
//                           <select
//                             value={sortOrder}
//                             onChange={(e) => setSortOrder(e.target.value as "newest" | "oldest")}
//                             className="p-2 border border-gray-300 rounded-md text-sm"
//                           >
//                             <option value="newest">Newest first</option>
//                             <option value="oldest">Oldest first</option>
//                           </select>
//                         </div>
                        
//                         <div className="flex justify-between pt-2">
//                           <button
//                             onClick={clearDateFilter}
//                             className="text-sm text-gray-600 hover:text-gray-800"
//                           >
//                             Clear filters
//                           </button>
//                           <button
//                             onClick={() => setShowDateFilter(false)}
//                             className="px-3 py-1.5 bg-gray-800 text-white text-sm rounded-md hover:bg-gray-900"
//                           >
//                             Apply
//                           </button>
//                         </div>
//                       </div>
//                     </div>
//                   )}
//                 </div>
                
//                 <button className="flex items-center text-sm text-gray-700 bg-white border border-gray-300 rounded-md px-3 py-2 hover:bg-gray-50">
//                   <span className="hidden sm:inline">Saved filters</span>
//                   <ChevronDown className="h-4 w-4 ml-1" />
//                 </button>
//               </div>
//             </div>

//             {/* Stats and Actions Bar */}
//             <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 p-4 bg-gray-50 rounded-md border border-gray-300">
//               <div className="flex items-center flex-wrap gap-2">
//                 <span className="text-sm text-gray-700">
//                   <span className="font-medium">{filteredOrders.length}</span> orders
//                 </span>
//                 <span className="text-gray-400 hidden sm:inline">•</span>
//                 <span className="text-sm text-gray-700">
//                   Total: <span className="font-medium">{formatCurrency(
//                     filteredOrders.reduce((acc: number, o: any) => acc + o.total, 0),
//                     currency
//                   )}</span>
//                 </span>
                
//                 {(dateFilter.startDate || dateFilter.endDate) && (
//                   <>
//                     <span className="text-gray-400 hidden sm:inline">•</span>
//                     <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
//                       Filtered by date
//                       <button 
//                         onClick={clearDateFilter}
//                         className="ml-1 text-blue-600 hover:text-blue-800"
//                       >
//                         &times;
//                       </button>
//                     </span>
//                   </>
//                 )}
//               </div>
              
//               <div className="flex items-center space-x-3 mt-2 sm:mt-0">
//                 <button className="flex items-center text-sm text-gray-700 hover:text-gray-900">
//                   <Printer className="h-4 w-4 mr-1" />
//                   <span className="hidden sm:inline">Print</span>
//                 </button>
//                 <button className="flex items-center text-sm text-gray-700 hover:text-gray-900">
//                   <Download className="h-4 w-4 mr-1" />
//                   <span className="hidden sm:inline">Download</span>
//                 </button>
//               </div>
//             </div>

//             {/* Table Navigation for Mobile */}
//             <div className="flex items-center justify-between mb-4 md:hidden">
//               <button
//                 onClick={() => handleScroll('left')}
//                 disabled={scrollPosition === 0}
//                 className="p-2 rounded-full bg-gray-100 disabled:opacity-50"
//               >
//                 <ChevronLeft className="h-4 w-4" />
//               </button>
//               <span className="text-sm text-gray-600">Swipe to see more</span>
//               <button
//                 onClick={() => handleScroll('right')}
//                 disabled={scrollPosition >= maxScroll}
//                 className="p-2 rounded-full bg-gray-100 disabled:opacity-50"
//               >
//                 <ChevronRight className="h-4 w-4" />
//               </button>
//             </div>

//             {/* Orders Table Container */}
//             <div 
//               ref={tableContainerRef}
//               className="border border-gray-300 rounded-lg overflow-hidden overflow-x-auto"
//               onScroll={(e) => setScrollPosition(e.currentTarget.scrollLeft)}
//             >
//               <table className="min-w-full">
//                 <thead className="bg-gray-50 border-b border-gray-300">
//                   <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     <th className="p-3 w-8 sticky left-0 bg-gray-50 z-10">
//                       <input type="checkbox" className="rounded text-gray-600 focus:ring-gray-500" />
//                     </th>
//                     <th className="p-3 min-w-[200px]">Item</th>
//                     <th className="p-3 min-w-[80px]">Quantity</th>
//                     <th className="p-3 min-w-[100px]">Item price</th>
//                     <th className="p-3 min-w-[100px]">Total price</th>
//                     <th className="p-3 min-w-[120px]">Status</th>
//                     <th className="p-3 min-w-[120px]">Sold date</th>
//                     <th className="p-3 min-w-[120px] sticky right-0 bg-gray-50 z-10">Action</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-300">
//                   {paginatedOrders.length > 0 ? (
//                     paginatedOrders.map((order: any) =>
//                       order.items.map((item: any) => (
//                         <tr key={item.id} className="hover:bg-gray-50">
//                           <td className="p-3 sticky left-0 bg-white z-10">
//                             <input type="checkbox" className="rounded text-gray-600 focus:ring-gray-500" />
//                           </td>
//                           <td className="p-3">
//                             <div className="flex items-center gap-3 min-w-[200px]">
//                               <div className="h-14 w-14 flex-shrink-0 bg-gray-100 rounded border border-gray-300 overflow-hidden">
//                                 {item.product?.images?.[0] ? (
//                                   <img
//                                     src={item.product.images[0]}
//                                     alt={item.product.name}
//                                     className="h-full w-full object-cover"
//                                   />
//                                 ) : (
//                                   <div className="h-full w-full flex items-center justify-center text-gray-400 text-xs">No Image</div>
//                                 )}
//                               </div>
//                               <div className="min-w-0 flex-1">
//                                 <p className="font-medium text-gray-900 text-sm truncate">{item.product?.name}</p>
//                                 <p className="text-xs text-gray-500">Order #{order.id.slice(-6).toUpperCase()}</p>
//                                 <p className="text-xs text-gray-500 mt-1 truncate">Buyer: {order.buyer?.username || "Unknown"}</p>
//                               </div>
//                             </div>
//                           </td>
//                           <td className="p-3 text-sm text-gray-700">{item.quantity}</td>
//                           <td className="p-3 text-sm text-gray-700">{formatCurrency(item.price, currency)}</td>
//                           <td className="p-3 font-semibold text-sm text-gray-900">{formatCurrency(item.price * item.quantity, currency)}</td>
//                           <td className="p-3">
//                             <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
//                               {order.status}
//                             </span>
//                           </td>
//                           <td className="p-3 text-sm text-gray-700">{new Date(Number(order.createdAt)).toLocaleDateString()}</td>
//                           <td className="p-3 sticky right-0 bg-white z-10">
//                             <div className="flex items-center">
//                               <button className="text-xs bg-gray-800 hover:bg-gray-900 text-white px-3 py-1.5 rounded whitespace-nowrap">
//                                 Ship now
//                               </button>
//                               <button className="ml-2 text-gray-500 hover:text-gray-700">
//                                 <MoreHorizontal className="h-4 w-4" />
//                               </button>
//                             </div>
//                           </td>
//                         </tr>
//                       ))
//                     )
//                   ) : (
//                     <tr>
//                       <td colSpan={8} className="p-8 text-center text-gray-500">
//                         No orders found
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>

//             {/* Pagination */}
//             <div className="flex flex-col sm:flex-row items-center justify-between mt-4 px-2 py-3 gap-3">
//               <div className="text-sm text-gray-700">
//                 Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
//                 <span className="font-medium">{Math.min(currentPage * itemsPerPage, filteredOrders.length)}</span> of{' '}
//                 <span className="font-medium">{filteredOrders.length}</span> results
//               </div>
//               <div className="flex space-x-2">
//                 <button 
//                   onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
//                   disabled={currentPage === 1}
//                   className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   Previous
//                 </button>
//                 <button 
//                   onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
//                   disabled={currentPage === totalPages}
//                   className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   Next
//                 </button>
//               </div>
//             </div>
//           </div>
//         </main> 
//       </div>

//       <Footer />
//     </div>
//   );
// }