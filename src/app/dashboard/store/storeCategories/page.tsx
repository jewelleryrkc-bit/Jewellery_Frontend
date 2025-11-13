/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import Footer from "@/components/Footer";
import SearchBar from "@/components/SearchBar";
import SellerbottomHeader from "@/components/SellerBottomHeader";
import TopHeader from "@/components/TopHeader";
import { CREATE_SELLER_CATEGORY } from "@/graphql/mutations";
import { GET_SELLER_CATEGORIES } from "@/graphql/queries";
import { useMutation, useQuery } from "@apollo/client";
import { useState } from "react";

export default function CreateSellerCategories() {
  const [active, setActive] = useState("Store categories");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

  const sidebarItems = [
    "Edit store",
    "Store categories",
    "Store traffic",
    "Store newsletter",
    "Promote your store",
    "Social",
    "Manage subscription",
  ];

  // Fetch existing categories
  const { data, loading: queryLoading, refetch } = useQuery(GET_SELLER_CATEGORIES);
  const categories = data?.getsellerCategories || [];

  const [createSellerCategory] = useMutation(CREATE_SELLER_CATEGORY, {
    refetchQueries: [{ query: GET_SELLER_CATEGORIES }],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Category name cannot be empty");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const { data } = await createSellerCategory({
        variables: {
          input: {
            name,
          },
        },
      });

      if (data?.createSellerCategory) {
        setSuccess("Category created successfully!");
        setName("");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create category");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <TopHeader />
      <SearchBar 
        onSellerSearch={() => {}} 
      />
      <SellerbottomHeader />
      
      <div className="flex min-h-screen mt-8">
        {/* Mobile Sidebar Toggle Button */}

        {/* Sidebar */}
        <aside className={`w-64 bg-gray-50 p-6 fixed md:static inset-y-0 left-0 transform ${showMobileSidebar ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 ease-in-out z-40 md:z-auto overflow-y-auto`}>
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

        {/* Overlay for mobile when sidebar is open */}
        {showMobileSidebar && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
            onClick={() => setShowMobileSidebar(false)}
          ></div>
        )}

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-10">
          {/* Added heading and description */}
          <div className="mb-6 md:mb-10">
            <h1 className="text-2xl md:text-3xl font-bold mb-4">Store Categories Management</h1>
            <p className="text-gray-600 text-sm md:text-base">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris. 
              Vivamus hendrerit arcu sed erat molestie vehicula. Sed auctor neque eu tellus 
              rhoncus ut eleifend nibh porttitor. Ut in nulla enim. Phasellus molestie magna 
              non est bibendum non venenatis nisl tempor.
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-6 md:gap-8">
            {/* Create Category Form */}
            <div className="w-full md:w-1/3">
              <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
                <h2 className="text-lg md:text-xl font-bold mb-4 md:mb-6">Create New Category</h2>
                
                {error && (
                  <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
                    {error}
                  </div>
                )}

                {success && (
                  <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md text-sm">
                    {success}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., Onepiece Special"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-md transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
                  >
                    {loading ? "Creating..." : "Create Category"}
                  </button>
                </form>
              </div>
            </div>

            {/* Existing Categories List */}
            <div className="w-full md:w-2/3">
              <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-4 md:mb-6">
                  <h2 className="text-lg md:text-xl font-bold">Your Categories</h2>
                  <span className="text-sm text-gray-500">
                    {categories.length} categories
                  </span>
                </div>

                {queryLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                  </div>
                ) : categories.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No categories found. Create your first one!
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Name
                          </th>
                          <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                            Company
                          </th>
                          <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                            Created
                          </th>
                          <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                            Products
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {categories.map((category: any) => (
                          <tr key={category.id}>
                            <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                              <div className="font-medium text-gray-900">
                                {category.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {category.slug}
                              </div>
                            </td>
                            <td className="px-4 md:px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                              <div className="text-sm text-gray-900">
                                {category.company?.cname || "-"}
                              </div>
                            </td>
                            <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">
                              {new Date(Number(category.createdAt)).toLocaleDateString()}
                            </td>
                            <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden lg:table-cell">
                              {/* Product count would go here */}
                              -
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </>
  );
}