/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";


import LoadingPage from "@/components/LoadingPage";
import { SELLER_PRODUCT_PAGINATION, GET_PARENT_CATEGORIES } from "../../../graphql/queries";
import { useQuery } from "@apollo/client";
import { Edit3Icon, Filter, X, Search, ChevronDown, ChevronUp, AlertTriangle } from "lucide-react";
import { useState } from "react";
import SellerMainHeader from "@/components/SellerMainHeader";
import Footer from "@/components/Footer";

export default function SellerProducts() {
    const [offset, setOffset] = useState(0);
    const [active, setActive] = useState("Your Products");
    const [showFilters, setShowFilters] = useState(false);
    const [showMobileSidebar, setShowMobileSidebar] = useState(false);
    const limit = 10;
  
    const [sortOrder, setSortOrder] = useState<"asc" | "desc" | null>(null);
    const [sortDate, setSortDate] = useState<"asc" | "desc" | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
    
    // Filter states
    const [categoryFilter, setCategoryFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [priceRange, setPriceRange] = useState({ min: "", max: "" });
    const [stockFilter, setStockFilter] = useState("all");

    const sidebarItems = [
        "Edit store",
        "Store categories",
        "Store traffic",
        "Store newsletter",
        "Promote your store",
        "Social",
        "Manage subscription",
        "Your Products"
    ];
  
    const { data, loading } = useQuery(SELLER_PRODUCT_PAGINATION, {
        variables: { limit, offset },
        fetchPolicy: "cache-and-network",
    });

    const { data: categoriesData } = useQuery(GET_PARENT_CATEGORIES);
    const categories = categoriesData?.parentCategories || [];
  
    const paginatedData = data?.paginatedMyProducts;
    const products = paginatedData?.products || [];
    const totalCount = paginatedData?.total || 0;
  
    // Apply all filters
    const filteredProducts = products.filter((p: any) => {
        // Search term filter
        const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             p.description?.toLowerCase().includes(searchTerm.toLowerCase());
        
        // Category filter
        const matchesCategory = !categoryFilter || p.category?.id === categoryFilter;
        
        // Status filter
        const matchesStatus = statusFilter === "all" || 
                             (statusFilter === "active" && p.isActive) ||
                             (statusFilter === "inactive" && !p.isActive);
        
        // Price range filter
        const price = parseFloat(p.price);
        const minPrice = priceRange.min ? parseFloat(priceRange.min) : 0;
        const maxPrice = priceRange.max ? parseFloat(priceRange.max) : Number.MAX_SAFE_INTEGER;
        const matchesPrice = price >= minPrice && price <= maxPrice;
        
        // Stock filter
        const matchesStock = stockFilter === "all" ||
                            (stockFilter === "inStock" && p.stock > 0) ||
                            (stockFilter === "outOfStock" && p.stock <= 0);
        
        return matchesSearch && matchesCategory && matchesStatus && matchesPrice && matchesStock;
    });
  
    if (loading) {
        return <LoadingPage />;
    }
  
    const handleCheckboxChange = (id: string) => {
        setSelectedProducts((prev) =>
            prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
        );
    };
  
    const handleBulkDelete = () => {
        console.log("Deleting selected products:", selectedProducts);
        setSelectedProducts([]);
    };

    const clearAllFilters = () => {
        setCategoryFilter("");
        setStatusFilter("all");
        setPriceRange({ min: "", max: "" });
        setStockFilter("all");
        setSearchTerm("");
    };
  
    // Sort logic
    const sortedProducts = [...filteredProducts];
    if (sortOrder) {
        sortedProducts.sort((a: any, b: any) =>
            sortOrder === "asc" ? a.price - b.price : b.price - a.price
        );
    } else if (sortDate) {
        sortedProducts.sort((a: any, b: any) =>
            sortDate === "asc"
            ? Number(a.createdAt) - Number(b.createdAt)
            : Number(b.createdAt) - Number(a.createdAt)
        );
    }
  
    const togglePriceSort = () => {
        setSortOrder((prev) =>
            prev === "asc" ? "desc" : prev === "desc" ? null : "asc"
        );
        setSortDate(null);
    };
  
    const toggleDateSort = () => {
        setSortDate((prev) =>
            prev === "asc" ? "desc" : prev === "desc" ? null : "asc"
        );
        setSortOrder(null);
    };
  
    const renderSortIcon = (field: "price" | "date") => {
        const direction = field === "price" ? sortOrder : sortDate;
        if (direction === "asc") return <ChevronUp className="inline h-4 w-4" />;
        if (direction === "desc") return <ChevronDown className="inline h-4 w-4" />;
        return "⇅";
    };
  
    const allSelected =
        sortedProducts.length > 0 &&
        sortedProducts.every((product: any) => selectedProducts.includes(product.id));
  
    const handleSelectAll = () => {
        if (allSelected) {
            setSelectedProducts([]);
        } else {
            const allIds = sortedProducts.map((product: any) => product.id);
            setSelectedProducts(allIds);
        }
    };

    // Check if product is low in stock (less than or equal to 5 items)
    const isLowStock = (stock: number) => stock > 0 && stock <= 5;

    // Count active filters for badge
    const activeFilterCount = [
        categoryFilter !== "",
        statusFilter !== "all",
        priceRange.min !== "" || priceRange.max !== "",
        stockFilter !== "all",
        searchTerm !== ""
    ].filter(Boolean).length;
    
    return(
        <>
            <SellerMainHeader/>
            
            <div className="flex min-h-screen mt-8">
                {/* Mobile sidebar toggle */}
                {/* <button 
                    onClick={() => setShowMobileSidebar(!showMobileSidebar)}
                    className="md:hidden fixed top-24 left-4 z-50 bg-black text-white p-2 rounded-lg shadow-lg"
                >
                    <Menu className="h-5 w-5" />
                </button> */}

                {/* Sidebar */}
                <aside className={`w-64 bg-gray-50 p-6 fixed md:static inset-y-0 left-0 z-40 transform ${showMobileSidebar ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 ease-in-out`}>
                    <div className="flex justify-between items-center mb-6 md:hidden">
                        <h2 className="text-lg font-semibold">Menu</h2>
                        <button onClick={() => setShowMobileSidebar(false)}>
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                    <ul className="space-y-4">
                        {sidebarItems.map((item) => (
                            <li
                                key={item}
                                onClick={() => {
                                    setActive(item);
                                    setShowMobileSidebar(false);
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

                {/* Overlay for mobile sidebar */}
            

                <main className="flex-1 p-4 md:p-6 bg-white overflow-x-auto">
                    <div className="flex flex-col md:flex-row justify-between items-start mb-6 md:mb-8 gap-4">
                        <div>
                            <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">
                                Your Products
                            </h1>
                            <p className="text-gray-600 text-sm hidden md:block">
                                Manage your product listings, inventory, and pricing all in one place. 
                                Keep your store updated to maximize sales.
                            </p>
                        </div>
                        
                        <button 
                            onClick={() => setShowFilters(!showFilters)}
                            className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors w-full md:w-auto justify-center"
                        >
                            <Filter className="h-4 w-4" />
                            Filters
                            {activeFilterCount > 0 && (
                                <span className="bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                    {activeFilterCount}
                                </span>
                            )}
                        </button>
                    </div>

                    {/* Filters Panel */}
                    {showFilters && (
                        <div className="bg-gray-50 p-4 md:p-5 rounded-lg mb-5 md:mb-7 border border-gray-200">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-medium text-gray-800">Filter Products</h3>
                                <div className="flex items-center gap-2">
                                    {activeFilterCount > 0 && (
                                        <button 
                                            onClick={clearAllFilters}
                                            className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                                        >
                                            <X className="h-4 w-4 mr-1" />
                                            Clear all
                                        </button>
                                    )}
                                    <button 
                                        onClick={() => setShowFilters(false)}
                                        className="p-1 hover:bg-gray-200 rounded"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
                                {/* Category Filter */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                                    <select
                                        value={categoryFilter}
                                        onChange={(e) => setCategoryFilter(e.target.value)}
                                        className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
                                    >
                                        <option value="">All Categories</option>
                                        {categories.map((category: any) => (
                                            <option key={category.id} value={category.id}>
                                                {category.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                
                                {/* Status Filter */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                                    <select
                                        value={statusFilter}
                                        onChange={(e) => setStatusFilter(e.target.value)}
                                        className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
                                    >
                                        <option value="all">All Status</option>
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                    </select>
                                </div>
                                
                                {/* Stock Filter */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Stock Status</label>
                                    <select
                                        value={stockFilter}
                                        onChange={(e) => setStockFilter(e.target.value)}
                                        className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
                                    >
                                        <option value="all">All Stock</option>
                                        <option value="inStock">In Stock</option>
                                        <option value="outOfStock">Out of Stock</option>
                                        <option value="lowStock">Low Stock (≤5)</option>
                                    </select>
                                </div>
                                
                                {/* Price Range Filter */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="number"
                                            placeholder="Min"
                                            value={priceRange.min}
                                            onChange={(e) => setPriceRange({...priceRange, min: e.target.value})}
                                            className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
                                        />
                                        <input
                                            type="number"
                                            placeholder="Max"
                                            value={priceRange.max}
                                            onChange={(e) => setPriceRange({...priceRange, max: e.target.value})}
                                            className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {selectedProducts.length > 0 && (
                        <div className="mb-4 md:mb-5 flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-red-50 rounded-lg border border-red-100 gap-3">
                            <span className="text-red-800 text-sm">
                                {selectedProducts.length} product{selectedProducts.length !== 1 ? 's' : ''} selected
                            </span>
                            <button
                                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition text-sm w-full sm:w-auto"
                                onClick={handleBulkDelete}
                            >
                                Delete Selected
                            </button>
                        </div>
                    )}

                    {sortedProducts.length > 0 ? (
                        <div className="overflow-auto max-h-[70vh] border border-gray-200 rounded-lg">
                            <table className="min-w-full bg-white text-sm">
                                <thead className="bg-gray-100 text-gray-600 font-semibold sticky top-0 z-10 text-left">
                                    <tr>
                                        <th className="p-3 md:p-4">
                                            <input
                                                type="checkbox"
                                                checked={allSelected}
                                                onChange={handleSelectAll}
                                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                            />
                                        </th>
                                        <th className="p-3 md:p-4 hidden sm:table-cell">Sr No</th>
                                        <th className="p-3 md:p-4">Image</th>
                                        <th className="p-3 md:p-4">Name</th>
                                        <th className="p-3 md:p-4 hidden md:table-cell cursor-pointer" onClick={toggleDateSort}>
                                            Created At {renderSortIcon("date")}
                                        </th>
                                        <th className="p-3 md:p-4 cursor-pointer" onClick={togglePriceSort}>
                                            Price ($) {renderSortIcon("price")}
                                        </th>
                                        <th className="p-3 md:p-4 hidden lg:table-cell">Category</th>
                                        <th className="p-3 md:p-4 hidden sm:table-cell">Stock</th>
                                        <th className="p-3 md:p-4 hidden md:table-cell">Status</th>
                                        <th className="p-3 md:p-4">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="text-gray-700 divide-y divide-gray-200">
                                    {sortedProducts.map((product: any, idx: number) => {
                                        const lowStock = isLowStock(product.stock);
                                        
                                        return (
                                            <tr 
                                                key={product.id} 
                                                className={`hover:bg-gray-50 transition ${lowStock ? 'bg-yellow-50 hover:bg-yellow-100' : ''}`}
                                            >
                                                <td className="p-3 md:p-4">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedProducts.includes(product.id)}
                                                        onChange={() => handleCheckboxChange(product.id)}
                                                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                    />
                                                </td>
                                                <td className="p-3 md:p-4 hidden sm:table-cell">{offset + idx + 1}</td>
                                                <td className="p-3 md:p-4">
                                                    <div className="w-12 h-12 md:w-16 md:h-16 bg-gray-100 flex items-center justify-center rounded-md overflow-hidden relative">
                                                        {product.images && product.images.length > 0 ? (
                                                            <img 
                                                                src={product.images[0].url} 
                                                                alt={product.name}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        ) : (
                                                            <span className="text-xs text-gray-400">No Image</span>
                                                        )}
                                                        {lowStock && (
                                                            <div className="absolute -top-1 -right-1 bg-yellow-500 rounded-full p-0.5">
                                                                <AlertTriangle className="h-3 w-3 text-white" />
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="p-3 md:p-4 font-medium max-w-[120px] md:max-w-none truncate">
                                                    <a href={`/dashboard/${product.slug}`} className="hover:text-blue-600 transition-colors flex items-center gap-1">
                                                        {product.name}
                                                        {lowStock && (
                                                            <div title="Low stock">
                                                              <AlertTriangle className="h-4 w-4 text-yellow-600" />  
                                                            </div>
                                                        )}
                                                    </a>
                                                    <div className="md:hidden text-xs text-gray-500 mt-1">
                                                        {product.category?.name || "-"}
                                                    </div>
                                                    <div className="sm:hidden text-xs mt-1">
                                                        <span className={`px-2 py-1 rounded-full font-medium ${
                                                            product.stock > 0 
                                                                ? lowStock 
                                                                    ? "bg-yellow-100 text-yellow-800" 
                                                                    : "bg-green-100 text-green-800" 
                                                                : "bg-red-100 text-red-800"
                                                        }`}>
                                                            {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
                                                        </span>
                                                    </div>
                                                    <div className="md:hidden text-xs mt-1">
                                                        <span className={`px-2 py-1 rounded-full font-medium ${
                                                            product.isActive 
                                                                ? "bg-green-100 text-green-800" 
                                                                : "bg-gray-100 text-gray-800"
                                                        }`}>
                                                            {product.isActive ? "Active" : "Inactive"}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="p-3 md:p-4 hidden md:table-cell">
                                                    {new Date(Number(product.createdAt)).toLocaleDateString()}
                                                </td>
                                                <td className="p-3 md:p-4 font-semibold">${product.price}</td>
                                                <td className="p-3 md:p-4 hidden lg:table-cell">{product.category?.name || "-"}</td>
                                                <td className="p-3 md:p-4 hidden sm:table-cell">
                                                    <span className={`px-2.5 py-1.5 rounded-full text-xs font-medium ${
                                                        product.stock > 0 
                                                            ? lowStock 
                                                                ? "bg-yellow-100 text-yellow-800" 
                                                                : "bg-green-100 text-green-800" 
                                                            : "bg-red-100 text-red-800"
                                                    }`}>
                                                        {product.stock > 0 
                                                            ? lowStock 
                                                                ? `Low stock (${product.stock})` 
                                                                : `${product.stock} in stock` 
                                                            : "Out of stock"}
                                                    </span>
                                                </td>
                                                <td className="p-3 md:p-4 hidden md:table-cell">
                                                    <span className={`px-2.5 py-1.5 rounded-full text-xs font-medium ${
                                                        product.isActive 
                                                            ? "bg-green-100 text-green-800" 
                                                            : "bg-gray-100 text-gray-800"
                                                    }`}>
                                                        {product.isActive ? "Active" : "Inactive"}
                                                    </span>
                                                </td>
                                                <td className="p-3 md:p-4">
                                                    <a
                                                        href={`/editproduct/${product.id}`}
                                                        className="flex items-center justify-center md:justify-start gap-1 md:gap-2 px-2 md:px-3 py-1.5 md:py-2 bg-blue-50 text-blue-600 rounded-lg border border-blue-200 hover:bg-blue-100 transition-all duration-200 group text-sm"
                                                        title="Edit"
                                                    >
                                                        <Edit3Icon className="w-3.5 h-3.5 md:w-4 md:h-4 group-hover:scale-110 transition-transform" />
                                                        <span className="hidden md:inline font-medium">Edit</span>
                                                    </a>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center py-12 md:py-16 bg-gray-50 rounded-lg border border-gray-200">
                            <Search className="h-10 w-10 md:h-12 md:w-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-base md:text-lg font-medium text-gray-900 mb-2">No products found</h3>
                            <p className="text-gray-500 mb-4 text-sm md:text-base px-2">
                                Try adjusting your search or filter criteria to find what you&apos;re looking for.
                            </p>
                            {activeFilterCount > 0 && (
                                <button 
                                    onClick={clearAllFilters}
                                    className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
                                >
                                    Clear all filters
                                </button>
                            )}
                        </div>
                    )}

                    {/* Pagination Controls */}
                    {sortedProducts.length > 0 && (
                        <div className="flex flex-col sm:flex-row justify-between items-center mt-6 md:mt-8 pt-4 md:pt-5 border-t border-gray-200 gap-4">
                            <button
                                disabled={offset === 0}
                                onClick={() => setOffset(Math.max(offset - limit, 0))}
                                className="px-4 py-2.5 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 transition-colors text-sm w-full sm:w-auto order-2 sm:order-1"
                            >
                                Previous
                            </button>
                            <span className="text-gray-600 text-sm order-1 sm:order-2 text-center">
                                Showing {offset + 1} - {Math.min(offset + limit, totalCount)} of {totalCount} products
                            </span>
                            <button
                                disabled={offset + limit >= totalCount}
                                onClick={() => setOffset(offset + limit)}
                                className="px-4 py-2.5 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 transition-colors text-sm w-full sm:w-auto order-3"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </main>
            </div>
         <Footer/>   
        </>
    );
}