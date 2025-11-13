/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import Footer from "@/components/Footer";
import SearchBar from "@/components/SearchBar";
import SellerbottomHeader from "@/components/SellerBottomHeader";
import TopHeader from "@/components/TopHeader";
import { GET_COMPANY_FOLLOWERS, GET_SELLER_COUPONS } from "@/graphql/queries";
import { SEND_COUPON } from "@/graphql/mutations";
import { useQuery, useMutation } from "@apollo/client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import SellerMainHeader from "@/components/SellerMainHeader";

interface Coupon {
  id: string;
  isPublic: boolean;
  code: string;
  startDate: string;
  endDate: string;
  currentUsage: number;
  updatedAt: string;
  discountPercentage: number;
  discountAmount?: number;
  maxDiscount?: number;
  company: {
    id: string;
    cname: string;
  };
}

export default function SDiscount() {
  const { data: couponsData, loading, error, refetch } = useQuery(GET_SELLER_COUPONS);
  const [sendSellerCoupon] = useMutation(SEND_COUPON);
  const params = useParams();
  const companyId = params.id as string;
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const [message, setMessage] = useState("We appreciate your support. As a thank you for being a customer, here's a store coupon just for you.");
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });
  const [sentCoupons, setSentCoupons] = useState<Set<string>>(new Set());
  const [showSendConfirmation, setShowSendConfirmation] = useState(false);
  const [couponView, setCouponView] = useState<'grid' | 'table'>('table');
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const pathname = usePathname();
  const { data: cFollowdata } = useQuery(GET_COMPANY_FOLLOWERS, {
    variables: {companyId}
  });
  const allFollowers = cFollowdata?.companyFollowers || [];

  // Load sent coupons from localStorage on component mount
  useEffect(() => {
    const savedSentCoupons = localStorage.getItem('sentCoupons');
    if (savedSentCoupons) {
      setSentCoupons(new Set(JSON.parse(savedSentCoupons)));
    }
  }, []);

  // Save sent coupons to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('sentCoupons', JSON.stringify(Array.from(sentCoupons)));
  }, [sentCoupons]);

  const handleSendCoupon = async () => {
    if (!selectedCoupon) return;
    
    try {
      const { data } = await sendSellerCoupon({
        variables: {
          subject: `Discount coupon from ${selectedCoupon.company.cname}`,
          couponcode: selectedCoupon.code
        }
      });
      
      if (data.sendCoupon) {
        // Add to sent coupons set and persist to localStorage
        setSentCoupons(prev => {
          const newSet = new Set(prev);
          newSet.add(selectedCoupon.id);
          return newSet;
        });
        
        setNotification({ show: true, message: "Coupon sent successfully to your followers!", type: "success" });
        setShowSendConfirmation(false);
        setTimeout(() => setNotification({ show: false, message: "", type: "" }), 3000);
      }
    } catch (err) {
      console.error("Error sending coupon:", err);
      setNotification({ show: true, message: "Failed to send coupon. Please try again.", type: "error" });
      setShowSendConfirmation(false);
      setTimeout(() => setNotification({ show: false, message: "", type: "" }), 3000);
    }
  };

  const openSendConfirmation = () => {
    if (selectedCoupon) {
      setShowSendConfirmation(true);
    }
  };

  const formatDiscount = (coupon: Coupon) => {
    if (coupon.discountPercentage) {
      return `${coupon.discountPercentage}% off${coupon.maxDiscount ? `, up to $${coupon.maxDiscount}` : ''}`;
    } else if (coupon.discountAmount) {
      return `$${coupon.discountAmount} off`;
    }
    return 'No discount';
  };

  if (loading) return <div className="min-h-screen flex justify-center items-center">Loading coupons...</div>;
  if (error) return <div className="min-h-screen flex justify-center items-center">Error loading coupons: {error.message}</div>;

  const coupons = couponsData?.getCompanyCoupons || [];

  return (
    <>
      {/* <TopHeader/>
      <SearchBar onSellerSearch={function (value: string): void {
        throw new Error("Function not implemented.")
      }} />
      <SellerbottomHeader/> */}
      <SellerMainHeader/>
      
      {/* Mobile Sidebar Toggle Button */}
      {/* <button 
        onClick={() => setShowMobileSidebar(!showMobileSidebar)}
        className="md:hidden fixed top-24 left-4 z-50 bg-black text-white p-2 rounded-md"
      >
        {showMobileSidebar ? 'Hide Menu' : 'Show Menu'}
      </button> */}

      <div className="min-h-screen bg-gray-50 flex pt-4">
        {/* Sidebar */}
        <div className={`fixed md:static inset-y-0 left-0 transform ${showMobileSidebar ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 ease-in-out z-40 md:z-auto w-64 bg-white border-r border-gray-200 p-4 overflow-y-auto`}>
          <h2 className="text-lg font-bold mb-6 text-gray-800">Seller Hub</h2>
          
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Manage Listings</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/seller/products" className={`block py-2 px-3 rounded ${pathname === '/seller/products' ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700 hover:bg-gray-100'}`}>
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/seller/add-product" className={`block py-2 px-3 rounded ${pathname === '/seller/add-product' ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700 hover:bg-gray-100'}`}>
                  Add Product
                </Link>
              </li>
              <li>
                <Link href="/seller/inventory" className={`block py-2 px-3 rounded ${pathname === '/seller/inventory' ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700 hover:bg-gray-100'}`}>
                  Inventory
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Marketing</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/seller/discounts" className={`block py-2 px-3 rounded ${pathname === '/seller/discounts' ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700 hover:bg-gray-100'}`}>
                  Buyer Groups
                </Link>
              </li>
              <li>
                <Link href="/seller/coupons" className={`block py-2 px-3 rounded ${pathname === '/seller/coupons' ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700 hover:bg-gray-100'}`}>
                  Coupons
                </Link>
              </li>
              <li>
                <Link href="/seller/promotions" className={`block py-2 px-3 rounded ${pathname === '/seller/promotions' ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700 hover:bg-gray-100'}`}>
                  Promotions
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Overlay for mobile when sidebar is open */}
        {showMobileSidebar && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
            onClick={() => setShowMobileSidebar(false)}
          ></div>
        )}
        
        {/* Main content */}
        <div className="flex-1 p-4 md:p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h1 className="text-xl md:text-2xl font-bold text-gray-800">Coupon Management</h1>
            <Link href={`/dashboard/marketing/coupons`} className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md text-sm md:text-base w-full sm:w-auto text-center">
              Create New Coupon
            </Link>
          </div>
          
          {notification.show && (
            <div className={`mb-4 md:mb-6 p-3 md:p-4 rounded-md text-sm md:text-base ${notification.type === "success" ? "bg-green-100 text-green-800 border border-green-200" : "bg-red-100 text-red-800 border border-red-200"}`}>
              {notification.message}
            </div>
          )}
          
          <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
            <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-4">Send Coupon to Followers</h2>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 md:p-4 mb-4 md:mb-6">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 极 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-xs md:text-sm text-blue-700">
                    This coupon will be sent to all your followers. You currently have <span className="font-medium">{allFollowers.length} followers</span>.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mb-4 md:mb-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
                <label className="block text-sm font-medium text-gray-700">Select a coupon</label>
                <div className="flex space-x-2">
                  <button 
                    className={`px-2 py-1 text-xs md:text-sm rounded ${couponView === 'grid' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}
                    onClick={() => setCouponView('grid')}
                  >
                    Grid
                  </button>
                  <button 
                    className={`px-2 py-1 text-xs md:text-sm rounded ${couponView === 'table' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}
                    onClick={() => setCouponView('table')}
                  >
                    Table
                  </button>
                </div>
              </div>
              
              {couponView === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 mb-4">
                  {coupons.slice(0, 4).map((coupon: Coupon) => (
                    <div 
                      key={coupon.id}
                      className={`border rounded-lg p-3 cursor-pointer ${selectedCoupon?.id === coupon.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'} ${sentCoupons.has(coupon.id) ? 'opacity-70' : ''}`}
                      onClick={() => !sentCoupons.has(coupon.id) && setSelectedCoupon(coupon)}
                    >
                      <div className="flex items-center mb-2">
                        <div className={`h-4 w-4 rounded-full border flex items-center justify-center mr-2 ${selectedCoupon?.id === coupon.id ? 'border-blue-500 bg-blue-500' : 'border-gray-300'}`}>
                          {selectedCoupon?.id === coupon.id && (
                            <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                        <span className="font-medium text-sm md:text-base">{coupon.code}</span>
                        {sentCoupons.has(coupon.id) && (
                          <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full">Sent</span>
                        )}
                      </div>
                      <p className="text-xs md:text-sm text-gray-600">
                        {formatDiscount(coupon)}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Valid: {new Date(coupon.startDate).toLocaleDateString()} - {new Date(coupon.endDate).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="overflow-x-auto mb-4">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-2 md:px-4 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Select</th>
                        <th scope="col" className="px-2 md:px-4 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                        <th scope="col" className="px-2 md:px-4 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Discount</th>
                        <th scope="col" className="px-2 md:px-4 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Validity</th>
                        <th scope="col" className="px-2 md:px-4 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {coupons.map((coupon: Coupon) => (
                        <tr 
                          key={coupon.id} 
                          className={`cursor-pointer ${selectedCoupon?.id === coupon.id ? 'bg-blue-50' : 'hover:bg-gray-50'} ${sentCoupons.has(coupon.id) ? 'opacity-70' : ''}`}
                          onClick={() => !sentCoupons.has(coupon.id) && setSelectedCoupon(coupon)}
                        >
                          <td className="px-2 md:px-4 py-2 md:py-3 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className={`h-4 w-4 rounded-full border flex items-center justify-center ${selectedCoupon?.id === coupon.id ? 'border-blue-500 bg-blue-500' : 'border-gray-300'}`}>
                                {selectedCoupon?.id === coupon.id && (
                                  <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-2 md:px-4 py-2 md:py-3 whitespace-nowrap text-xs md:text-sm font-medium text-gray-900">
                            {coupon.code}
                          </td>
                          <td className="px-2 md:px-4 py-2 md:py-3 whitespace-nowrap text-xs md:text-sm text-gray-600 hidden sm:table-cell">
                            {formatDiscount(coupon)}
                          </td>
                          <td className="px-2 md:px-4 py-2 md:py-3 whitespace-nowrap text-xs md:text-sm text-gray-600 hidden md:table-cell">
                            {new Date(coupon.startDate).toLocaleDateString()} - {new Date(coupon.endDate).toLocaleDateString()}
                          </td>
                          <td className="px-2 md:px-4 py-2 md:py-3 whitespace-nowrap text-xs md:text-sm text-gray-600">
                            {sentCoupons.has(coupon.id) ? (
                              <span className="px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full">Sent</span>
                            ) : (
                              <span className="px-2 py-0.5 bg-gray-100 text-gray-800 text-xs rounded-full">Available</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              
              <p className="text-xs md:text-sm text-gray-500 mt-3">
                Don&apos;t see a coupon you like? <button className="text-blue-600 hover:text-blue-800">Create coupon</button>
              </p>
              
              {selectedCoupon && (
                <div className="bg-gray-50 rounded-lg p-3 md:p-4 mb-4 mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 text-xs md:text-sm">
                    <div>
                      <span className="text-gray-600">Offer valid:</span>
                      <p>{new Date(selectedCoupon.startDate).toLocaleDateString()} - {new Date(selectedCoupon.endDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Private coupon</span>
                      <p>Maximum savings of ${selectedCoupon.maxDiscount || 100}.00 per coupon.</p>
                      <p>Unlimited number of uses per buyer</p>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="mb-4 md:mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Message to Followers</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm md:text-base"
                  rows={3}
                  maxLength={255}
                  placeholder="Add a personalized message for your followers..."
                />
                <p className="text-xs text-gray-500 mt-1 text-right">{message.length} / 255</p>
                <p className="text-xs text-gray-500 mt-1">This message will be included with the coupon</p>
              </div>
              
              <button
                onClick={openSendConfirmation}
                disabled={!selectedCoupon || sentCoupons.has(selectedCoupon.id)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 md:py-3 px-4 rounded-md disabled:bg-gray-300 disabled:cursor-not-allowed text-sm md:text-base"
              >
                {sentCoupons.has(selectedCoupon?.id || '') ? 'Coupon Already Sent' : 'Send coupon to followers'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Send Confirmation Modal */}
      {showSendConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-4 md:p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Confirm Send Coupon</h3>
            <p className="text-gray-600 mb-2 text-sm md:text-base">
              Are you sure you want to send the coupon <strong>{selectedCoupon?.code}</strong> to all your followers?
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
              <p className="text-xs md:text-sm text-blue-700">
                This will be sent to <span className="font-medium">{allFollowers.length} followers</span>.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3">
              <button
                onClick={() => setShowSendConfirmation(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 text-sm md:text-base"
              >
                Cancel
              </button>
              <button
                onClick={handleSendCoupon}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm md:text-base"
              >
                Confirm Send
              </button>
            </div>
          </div>
        </div>
      )}
      
      <Footer/>
    </>
  );
}