/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useQuery } from "@apollo/client";
import { GET_PARENT_CATEGORIES, ME_QUERY } from "../../../../graphql/queries";
import LoadingPage from "@/components/LoadingPage";
import TopHeader from "@/components/TopHeader";
import SearchBar from "@/components/SearchBar";
import SellerbottomHeader from "@/components/SellerBottomHeader";
import Link from "next/link";
import Footer from "@/components/Footer";

export default function SellerCategories() {
  const { data: categoriesData, loading: categoriesLoading } = useQuery(GET_PARENT_CATEGORIES);
  const { data: userData, loading: userLoading } = useQuery(ME_QUERY);

  if (categoriesLoading || userLoading) {
    return <LoadingPage />;
  }

  const categories = categoriesData?.parentCategories || [];
  const userProducts = userData?.me?.products || [];

  // Count products per category for the current user
  const categoryCounts = categories.map((category: any) => {
    const productCount = userProducts.filter(
      (product: any) => product.category?.name === category.name
    ).length;
    return {
      ...category,
      productCount
    };
  });

  // Get motivational messages based on product count
  const getMotivationalMessage = (count: number) => {
    if (count === 0) return "Great opportunity to sell!";
    if (count === 1) return "Great start! Expand your offerings";
    if (count <= 3) return "Growing strong! Keep adding more";
    return "Excellent selection! Consider expanding";
  };

  return (
    <>
      <TopHeader />
      <SearchBar onSellerSearch={function (): void {
        throw new Error("Function not implemented.");
      }} />
      <SellerbottomHeader />
      
      <div className="flex min-h-screen mt-8">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-50 p-6 hidden md:block">
          <ul className="space-y-4">
            {[
              "Edit store",
              "Store categories",
              "Store traffic",
              "Store newsletter",
              "Promote your store",
              "Social",
              "Manage subscription",
              "Your Products"
            ].map((item) => (
              <li
                key={item}
                className={`cursor-pointer rounded-lg px-4 py-3 text-sm font-medium transition hover:bg-gray-200 ${
                  item === "Store categories" ? "bg-black text-white" : "text-gray-700"
                }`}
              >
                {item}
              </li>
            ))}
          </ul>
        </aside>

        <main className="flex-1 p-6 bg-white">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Store Categories
            </h1>
            <p className="text-gray-600 text-sm">
              Manage your products by category. Click on a category to view and manage products in that category.
            </p>
          </div>

          {/* Summary Card */}
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-800 mb-3">Category Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {categories.length}
                </div>
                <div className="text-sm text-blue-800">Total Categories</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {categoryCounts.filter((c: any) => c.productCount > 0).length}
                </div>
                <div className="text-sm text-green-800">Active Categories</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-600">
                  {userProducts.length}
                </div>
                <div className="text-sm text-gray-800">Total Jewelry Items</div>
              </div>
            </div>
          </div>

          {categoryCounts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {categoryCounts.map((category: any) => (
                <div
                  key={category.id}
                  className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow min-h-[180px] flex flex-col justify-between"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-1">
                        {category.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {category.productCount > 0 
                          ? "Your jewelry collection in this category" 
                          : "No jewelry items yet in this category"}
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      category.productCount > 0 
                        ? "bg-blue-100 text-blue-800" 
                        : "bg-amber-100 text-amber-800"
                    }`}>
                      {getMotivationalMessage(category.productCount)}
                    </span>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-gray-600">
                        <span className={`font-medium ${
                          category.productCount > 0 ? "text-green-600" : "text-gray-500"
                        }`}>
                          {category.productCount} item{category.productCount !== 1 ? 's' : ''}
                        </span>
                        {' '}in jewelry collection
                      </div>
                      
                      <div className="flex gap-2">
                        <Link
                          href={`/seller/products?category=${category.name}`}
                          className="px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 text-sm font-medium"
                        >
                          View Collection
                        </Link>
                        
                        {category.productCount === 0 && (
                          <button className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium">
                            Add Jewelry
                          </button>
                        )}
                      </div>
                    </div>
                    
                    {/* Progress bar for visual representation */}
                    <div className="mt-3">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${Math.min((category.productCount / 10) * 100, 100)}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Collection strength: {Math.min(category.productCount, 10)}/10 items
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
              <div className="bg-gray-200 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No categories found</h3>
              <p className="text-gray-500 mb-4">
                There are no product categories available at the moment.
              </p>
            </div>
          )}
        </main>
      </div>
     <Footer/> 
    </>
  );
}