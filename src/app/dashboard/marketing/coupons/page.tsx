"use client";
import { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import Footer from "@/components/Footer";
import { CREATE_CUSTOM_COUPON } from '@/graphql/mutations';
import SellerbottomHeader from '@/components/SellerBottomHeader';
import TopHeader from '@/components/TopHeader';
import SearchBar from '@/components/SearchBar';
import { ME_QUERY } from "@/graphql/queries"
import Link from 'next/link';

function generateCodeSuggestions(cname: string): string[] {
  const clean = cname.toUpperCase().replace(/[^A-Z0-9]/g, '').substring(0, 4) || "SELL";
  return [
    `${clean}${Math.floor(1000 + Math.random() * 9000)}`,
    `${clean}-SALE-${Math.floor(10 + Math.random() * 90)}`,
    `DISC-${clean}-${Math.floor(100 + Math.random() * 900)}`
  ];
}

export default function Coupons() {
  const [active, setActive] = useState("Promote your store");
  const [formData, setFormData] = useState({
    code: "",
    discountPercentage: 10,
    usageLimit: 50,
    currentUsage: 0,
    isPublic: true,
  });
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const sidebarItems = [
    "Edit store",
    "Store categories",
    "Store traffic",
    "Store newsletter",
    "Promote your store",
    "Social",
    "Manage subscription",
  ];

  const { data: meData, loading: loadingMe } = useQuery(ME_QUERY);
  const [createCoupon, { loading: creating, data: created }] = useMutation(CREATE_CUSTOM_COUPON);

  useEffect(() => {
    if (meData?.me?.cname) {
      const codes = generateCodeSuggestions(meData.me.cname);
      setSuggestions(codes);
      setFormData(prev => ({ ...prev, code: codes[0] }));
    }
  }, [meData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'number' ? parseFloat(value) : value
    }));
  };

  const handleSelectCode = (code: string) => {
    setFormData(prev => ({ ...prev, code }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createCoupon({
        variables: {
          input: {
            code: formData.code.trim(),
            discountPercentage: formData.discountPercentage,
            usageLimit: formData.usageLimit,
            currentUsage: formData.currentUsage,
            isPublic: formData.isPublic
          }
        }
      });
    } catch (err) {
      console.error("Error creating coupon:", err);
    }
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
        <main className="flex-1 p-10">
          {/* Heading and Description */}
          <div className="mb-10">
            <h1 className="text-xl font-semibold border-b border-gray-200 pb-4">Create Discount Coupon</h1>
            <p className="text-gray-600 text-sm">
              Boost your sales by creating special discount coupons for your customers.
              Share these codes to attract more buyers to your store.
            </p>
          </div>

          {/* Coupon Form */}
          <div className="bg-white rounded-lg shadow-md p-8 max-w-3xl">
            {loadingMe ? (
              <div className="flex justify-center py-12">
                <div className="animate-pulse text-gray-400">Loading seller info...</div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Coupon Code */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Coupon Code / Enter Custom Code
                  </label>
                  <input
                    type="text"
                    name="code"
                    value={formData.code}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., SUMMER20"
                    required
                  />
                </div>

                {/* Suggested Codes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Suggested Codes
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {suggestions.map((suggestion) => (
                      <button
                        key={suggestion}
                        type="button"
                        onClick={() => handleSelectCode(suggestion)}
                        className={`px-4 py-2 border rounded-md text-sm font-medium transition-all ${
                          formData.code === suggestion
                            ? 'bg-blue-100 border-blue-500 text-blue-700'
                            : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                  <p className="mt-1 text-sm text-gray-500">
                    Click to select a suggested code or create your own
                  </p>
                </div>

                {/* Discount Percentage */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Discount Percentage
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      name="discountPercentage"
                      min="1"
                      max="100"
                      value={formData.discountPercentage}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                    <span className="absolute right-3 top-3 text-gray-500">%</span>
                  </div>
                </div>

                {/* Usage Limit */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Usage Limit
                  </label>
                  <input
                    type="number"
                    name="usageLimit"
                    min="1"
                    value={formData.usageLimit}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Maximum number of times this coupon can be used
                  </p>
                </div>

                {/* Public/Private Toggle */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="isPublic"
                    checked={formData.isPublic}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-700">
                    Make this coupon public
                  </label>
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={creating}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-md transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
                  >
                    {creating ? "Creating..." : "Create Coupon"}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Success Message */}
          {created && (
            <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-6 max-w-3xl">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-green-800">
                    Coupon created successfully!
                  </h3>
                  <div className="mt-2 text-sm text-green-700">
                    <p>
                      Your coupon code: <span className="font-bold">{created.createCustomCoupon.code}</span>
                    </p>
                    <p className="mt-1">
                      {created.createCustomCoupon.isPublic ? (
                          "This coupon is public and can be shared with anyone."
                        ) : (
                          <>
                            This is a private coupon.{" "}
                            <Link
                              href="dashboard/store/subscriber-discount"
                              className="text-blue-500 font-bold underline"
                            >
                              Share it
                            </Link>{" "}
                            only with specific customers.
                          </>
                        )}
                      </p>
                   </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
      <Footer />
    </>
  );
}