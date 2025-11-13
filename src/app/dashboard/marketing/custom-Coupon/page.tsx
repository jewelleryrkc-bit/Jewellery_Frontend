/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useEffect } from 'react';
import { useMutation } from '@apollo/client';
import Footer from "@/components/Footer";
import { CREATE_CUSTOM_COUPON } from '@/graphql/mutations';
import SellerbottomHeader from '@/components/SellerBottomHeader';
import TopHeader from '@/components/TopHeader';
import SearchBar from '@/components/SearchBar';
import { FiHome, FiDollarSign, FiTag, FiUsers, FiSettings, FiPieChart, FiMessageSquare, FiHelpCircle, FiLogOut } from 'react-icons/fi';

export default function CustomCoupons() {
  const [formData, setFormData] = useState({
    code: "",
    discountPercentage: 10,
    usageLimit: 50,
    currentUsage: 0,
    isPublic: false, // Default to private
  });

  const [createCoupon, { loading, data }] = useMutation(CREATE_CUSTOM_COUPON);
  const [isMounted, setIsMounted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'number' ? parseFloat(value) : value
    }));
  };

  const togglePublic = () => {
    setFormData(prev => ({
      ...prev,
      isPublic: !prev.isPublic
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.code.trim()) return;

    try {
      const result = await createCoupon({
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
      
      console.log('Mutation result:', result);
    } catch (err) {
      console.error("Error creating custom coupon:", err);
    }
  };

  return (
    <>
      <div className={`transition-all duration-500 ${isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-5'}`}>
        <TopHeader/>
        <SearchBar onSellerSearch={function (value: string): void {
            throw new Error('Function not implemented.');
          } } />
        <SellerbottomHeader />
        
        <div className="flex min-h-screen">
          {/* Sidebar */}
          <div className={`bg-gray-100 text-gray-800 ${sidebarOpen ? 'w-55' : 'w-20'} transition-all duration-300 border-r border-gray-200`}>
            <div className="p-4 flex flex-col h-full">
              <button 
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-full hover:bg-gray-200 self-end mb-2"
              >
                {sidebarOpen ? '<-' : '->'}
              </button>
              
              <nav className="flex-1">
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="flex items-center p-3 rounded-lg hover:bg-gray-200">
                      {sidebarOpen && <span className="ml-6 text-sm">Coupons</span>}
                    </a>
                  </li>
                  <li>
                    <a href="#" className="flex items-center p-3 rounded-lg hover:bg-gray-200">
                      {sidebarOpen && <span className="ml-6 text-sm">Discounts</span>}
                    </a>
                  </li>
                  <li>
                    <a href="#" className="flex items-center p-3 rounded-lg hover:bg-gray-200 bg-gray-200 font-medium">
                      {sidebarOpen && <span className="ml-6 text-sm">Analytics</span>}
                    </a>
                  </li>
                  <li>
                    <a href="#" className="flex items-center p-3 rounded-lg hover:bg-gray-200">
                      {sidebarOpen && <span className="ml-6 text-sm">Groups</span>}
                    </a>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="flex-1 px-4 sm:px-8 py-12">
            <div className="max-w-3xl mx-auto">
              <h1 className="text-3xl font-bold border-b border-gray-800 pb-6 mb-12">Create Custom Coupon</h1>

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Manual Code */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <label className="w-48 text-sm font-medium">Custom Code</label>
                  <input
                    type="text"
                    name="code"
                    value={formData.code}
                    onChange={handleChange}
                    className="flex-1 w-full border-2 border-gray-800 rounded-xl px-5 py-3 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all duration-200"
                    placeholder="E.g. NEW-YEAR#2025"
                    required
                  />
                </div>

                {/* Other Fields */}
                <div className="space-y-6">
                  {[
                    { label: "Discount Percentage", name: "discountPercentage", type: "number", min: 1, max: 100 },
                    { label: "Usage Limit", name: "usageLimit", type: "number", min: 1 },
                    { label: "Current Usage", name: "currentUsage", type: "number", min: 0 }
                  ].map(field => (
                    <div key={field.name} className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                      <label className="w-48 text-sm font-medium">{field.label}</label>
                      <input
                        type={field.type}
                        name={field.name}
                        value={(formData as any)[field.name]}
                        onChange={handleChange}
                        min={field.min}
                        max={field.max}
                        className="flex-1 w-full border-2 border-gray-800 rounded-xl px-5 py-3 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all duration-200"
                        required={field.name !== 'currentUsage'}
                      />
                    </div>
                  ))}
                </div>

                {/* Visibility Toggle */}
                <div className="flex items-center gap-4">
                  <label className="w-48 text-sm font-medium">
                    Coupon Visibility
                  </label>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isPublic"
                      name="isPublic"
                      checked={formData.isPublic}
                      onChange={togglePublic}
                      className="hidden"
                    />
                    <label
                      htmlFor="isPublic"
                      className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${formData.isPublic ? 'bg-green-500' : 'bg-gray-600'}`}
                    >
                      <span
                        className={`inline-block w-4 h-4 bg-gray-700 transform transition-transform rounded-full ${formData.isPublic ? 'translate-x-6' : 'translate-x-1'}`}
                      />
                    </label>
                    <span className="ml-3 text-sm font-medium">
                      {formData.isPublic ? 'Public' : 'Private'}
                    </span>
                  </div>
                </div>

                {/* Submit */}
                <div className="pt-6">
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-8 py-3 bg-gray-500 rounded-xl text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Creating...
                      </span>
                    ) : "Create Custom Coupon"}
                  </button>
                </div>
              </form>

              {/* Created confirmation */}
              {data && (
                <div className="mt-12 border-t border-gray-800 pt-8 animate-fadeIn">
                  <h2 className="text-xl font-bold mb-3 text-transparent bg-clip-text">
                    {data.createCustomCoupon.isPublic ? 'Public' : 'Private'} Coupon Created!
                  </h2>
                  <div className="p-6 rounded-xl border border-gray-800">
                    <p className= "font-mono text-xl font-bold">{data.createCustomCoupon.code}</p>
                    <p className="mt-2">
                      {data.createCustomCoupon.isPublic 
                        ? 'This public coupon is now active!' 
                        : 'This private coupon is now active!'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </> 
  );
}