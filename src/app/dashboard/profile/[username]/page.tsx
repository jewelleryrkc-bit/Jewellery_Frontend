/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unescaped-entities */
'use client';

import { useRouter } from 'next/navigation';
import { useQuery, useMutation } from '@apollo/client';
import { LOGOUT_MUTATION } from '../../../../graphql/mutations';
import { ME_QUERY, GET_COMPANY_FOLLOWERS } from '../../../../graphql/queries';
import { User, ShoppingBag, CreditCard, Box, Settings, Shield, Users, Star, TrendingUp, Eye, Package, MessageSquare, ChevronRight, Edit3 } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import Footer from '@/components/Footer';
import SellerMainHeader from '@/components/SellerMainHeader';

export default function SellerProfilePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const { data: userData, loading: userLoading, error: userError } = useQuery(ME_QUERY);
  
  // Get company followers data
  const { data: followersData } = useQuery(GET_COMPANY_FOLLOWERS, {
    variables: { companyId: userData?.me?.id },
    skip: !userData?.me?.id,
  });

  const [logout] = useMutation(LOGOUT_MUTATION);
  
  if (userLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 bg-gray-200 rounded-full mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-48 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-32"></div>
        </div>
      </div>
    );
  }

  if (userError || !userData?.me) {
    router.push('/auth/login');
    return null;
  }

  const cviews = userData?.me?.profileViews || 0;
  const followersCount = followersData?.companyFollowers?.length || 0;
  const productts = userData?.me?.products?.length || 0;
  const avgRating = userData?.me?.averageRating || 0;
  const soldProducts = userData?.me?.products?.reduce(
    (total: any, product: { soldCount: any; }) => total + (product.soldCount || 0), 
    0
  ) || 0;

  // Mock data for stats cards
  const stats = [
    { label: 'Total Products', value: productts, icon: Package, change: '+3 this month' },
    { label: 'Followers', value: followersCount, icon: User, change: `${followersCount} buyers follow you` },
    { label: 'Store Views', value: cviews, icon: Eye, change: '+12% from last month' },
    { label: 'Items Sold', value: soldProducts, icon: ShoppingBag, change: '+8% from last month' },
    { label: 'Customer Rating', value: avgRating.toFixed(1), icon: Star, change: 'From 23 reviews' },
  ];

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        {/* <TopHeader/>
        <SearchBar onSellerSearch={function (value: string): void {
              throw new Error('Function not implemented.');
            } }/> 
        <SellerbottomHeader/>     */}
        <SellerMainHeader/>

        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Sidebar - Made more compact */}
            <div className="w-full lg:w-64 flex-shrink-0">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
                <div className="p-4 text-center border-b border-gray-100">
                  <div className="mx-auto h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mb-3 border-2 border-white shadow-sm">
                    <User className="h-7 w-7 text-gray-600" />
                  </div>
                  <h2 className="text-sm font-semibold text-gray-900 truncate">{userData.me.username}</h2>
                  <p className="text-xs text-gray-500 mt-1 truncate w-full">{userData.me.email}</p>
                  <div className="mt-2">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      <Shield className="h-3 w-3 mr-1" /> Verified Seller
                    </span>
                  </div>
                </div>

                <nav className="p-2 space-y-1">
                  <Link 
                    href="/dashboard" 
                    className="flex items-center px-3 py-2 text-sm font-medium rounded-md bg-gray-100 text-gray-900"
                  >
                    <User className="h-4 w-4 mr-2" />
                    Dashboard
                  </Link>
                  <Link 
                    href="/seller/products" 
                    className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  >
                    <Box className="h-4 w-4 mr-2" />
                    Products
                  </Link>
                  <Link 
                    href="/dashboard/orders" 
                    className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  >
                    <ShoppingBag className="h-4 w-4 mr-2" />
                    Orders
                    <span className="ml-auto bg-gray-200 text-gray-800 text-xs font-medium px-1.5 py-0.5 rounded-full">5 new</span>
                  </Link>
                  <Link 
                    href="/seller/payments" 
                    className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    Payments
                  </Link>
                  <Link 
                    href="/seller/settings" 
                    className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </Link>
                </nav>
              </div>

              {/* Quick Stats */}
              <div className="bg-white rounded-lg shadow-sm mt-4 p-4 border border-gray-200">
                <h3 className="font-medium text-gray-900 text-sm mb-3">Store Performance</h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-gray-500">Visits this month</span>
                      <span className="text-xs font-medium text-green-600 flex items-center">
                        <TrendingUp className="h-3 w-3 mr-1" /> 12.5%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div className="bg-gray-600 h-1.5 rounded-full" style={{ width: '65%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-gray-500">Conversion rate</span>
                      <span className="text-xs font-medium text-green-600 flex items-center">
                        <TrendingUp className="h-3 w-3 mr-1" /> 3.2%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div className="bg-gray-600 h-1.5 rounded-full" style={{ width: '42%' }}></div>
                    </div>
                  </div>
                </div>
                <button className="mt-3 w-full text-center text-xs font-medium text-gray-600 hover:text-gray-800 py-1 flex items-center justify-center">
                  View analytics <ChevronRight className="h-3 w-3 inline ml-1" />
                </button>
              </div>
            </div>

            {/* Main Content - Expanded to fill space */}
            <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
              {/* Welcome Header */}
                <div className="bg-gradient-to-r from-gray-800 to-gray-700 rounded-lg shadow-sm p-5 text-white mb-5">
                <h1 className="text-xl font-bold mb-2">Welcome back, {userData.me.username}!</h1>
                <p className="opacity-90 text-sm">Here's what's happening with your store today. You have 5 new orders and 12 new followers this week.</p>
                <div className="flex mt-4 space-x-3">
                  <button className="bg-white text-gray-800 px-3 py-1.5 rounded-md text-xs font-medium hover:bg-gray-100">
                    View Orders
                  </button>
                  <button className="bg-gray-700 text-white px-3 py-1.5 rounded-md text-xs font-medium hover:bg-gray-600">
                    Add New Product
                  </button>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-5">
                {stats.map((stat, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-xs font-medium text-gray-500">{stat.label}</p>
                        <p className="text-lg font-bold text-gray-900 mt-1">{stat.value}</p>
                        <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
                      </div>
                      <div className="bg-gray-100 p-1.5 rounded-md">
                        <stat.icon className="h-4 w-4 text-gray-600" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Tab Navigation */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
                <div className="border-b border-gray-200">
                  <nav className="flex -mb-px">
                    <button
                      onClick={() => setActiveTab('overview')}
                      className={`py-3 px-5 text-sm font-medium border-b-2 ${activeTab === 'overview' ? 'border-gray-700 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                    >
                      Overview
                    </button>
                    <button
                      onClick={() => setActiveTab('profile')}
                      className={`py-3 px-5 text-sm font-medium border-b-2 ${activeTab === 'profile' ? 'border-gray-700 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                    >
                      Profile
                    </button>
                    <button
                      onClick={() => setActiveTab('activity')}
                      className={`py-3 px-5 text-sm font-medium border-b-2 ${activeTab === 'activity' ? 'border-gray-700 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                    >
                      Activity
                    </button>
                  </nav>
                </div>

                {/* Tab Content */}
                <div className="p-5">
                  {activeTab === 'overview' && (
                    <div>
                      <h3 className="text-md font-medium text-gray-900 mb-4">Store Overview</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                          <h4 className="font-medium text-gray-700 text-sm mb-3">Quick Actions</h4>
                          <div className="grid grid-cols-2 gap-2">
                            <button className="bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-md p-2 text-xs font-medium text-gray-700">
                              <div className="bg-gray-100 inline-flex p-1 rounded-md mb-1">
                                <Box className="h-4 w-4 text-gray-600" />
                              </div>
                              <p>Add Product</p>
                            </button>
                            <button className="bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-md p-2 text-xs font-medium text-gray-700">
                              <div className="bg-gray-100 inline-flex p-1 rounded-md mb-1">
                                <ShoppingBag className="h-4 w-4 text-gray-600" />
                              </div>
                              <p>View Orders</p>
                            </button>
                            <button className="bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-md p-2 text-xs font-medium text-gray-700">
                              <div className="bg-gray-100 inline-flex p-1 rounded-md mb-1">
                                <CreditCard className="h-4 w-4 text-gray-600" />
                              </div>
                              <p>Payment</p>
                            </button>
                            <button className="bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-md p-2 text-xs font-medium text-gray-700">
                              <div className="bg-gray-100 inline-flex p-1 rounded-md mb-1">
                                <MessageSquare className="h-4 w-4 text-gray-600" />
                              </div>
                              <p>Messages</p>
                            </button>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-700 text-sm mb-3">Recent Reviews</h4>
                          <div className="space-y-3">
                            <div className="flex items-start">
                              <div className="flex-shrink-0">
                                <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                                  <User className="h-4 w-4 text-gray-600" />
                                </div>
                              </div>
                              <div className="ml-2">
                                <div className="flex items-center">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <Star key={star} className="h-3 w-3 text-yellow-400 fill-current" />
                                  ))}
                                </div>
                                <p className="text-xs font-medium text-gray-900 mt-1">Excellent product quality</p>
                                <p className="text-xs text-gray-500">By John D. • 2 days ago</p>
                              </div>
                            </div>
                            <div className="flex items-start">
                              <div className="flex-shrink-0">
                                <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                                  <User className="h-4 w-4 text-gray-600" />
                                </div>
                              </div>
                              <div className="ml-2">
                                <div className="flex items-center">
                                  {[1, 2, 3, 4].map((star) => (
                                    <Star key={star} className="h-3 w-3 text-yellow-400 fill-current" />
                                  ))}
                                  <Star key={5} className="h-3 w-3 text-gray-300" />
                                </div>
                                <p className="text-xs font-medium text-gray-900 mt-1">Fast shipping, would buy again</p>
                                <p className="text-xs text-gray-500">By Sarah M. • 5 days ago</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'profile' && (
                    <div>
                      <div className="flex justify-between items-center mb-5">
                        <h3 className="text-md font-medium text-gray-900">Profile Information</h3>
                        <Link
                          href="/auth/editcompany"
                          className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 rounded-md shadow-sm text-xs font-medium text-gray-700 bg-white hover:bg-gray-50"
                        >
                          <Edit3 className="h-3 w-3 mr-1" /> Edit
                        </Link>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-500">Username</label>
                            <div className="mt-1 text-sm font-medium text-gray-900">{userData.me.username}</div>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-500">Email address</label>
                            <div className="mt-1 text-sm font-medium text-gray-900">{userData.me.email}</div>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-500">Store Name</label>
                            <div className="mt-1 text-sm font-medium text-gray-900">{userData.me.cname || 'Not set'}</div>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-500">Phone Number</label>
                            <div className="mt-1 text-sm font-medium text-gray-900">{userData.me.contact || 'Not provided'}</div>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-500">Followers</label>
                            <div className="mt-1 text-sm font-medium text-gray-900 flex items-center">
                              <Users className="h-3.5 w-3.5 mr-1 text-gray-500" />
                              {followersCount} follower{followersCount !== 1 ? 's' : ''}
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-500">Address</label>
                            <div className="mt-1 text-sm font-medium text-gray-900">
                              {userData.me.location || 'No location provided'}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="mt-5">
                        <label className="block text-xs font-medium text-gray-500">About</label>
                        <div className="mt-1 text-sm text-gray-900 bg-gray-50 p-3 rounded-md">
                          {userData.me.bio || 'No description provided.'}
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'activity' && (
                    <div>
                      <h3 className="text-md font-medium text-gray-900 mb-4">Recent Activity</h3>
                      <ul className="divide-y divide-gray-200">
                        <li className="py-3">
                          <div className="flex space-x-3">
                            <div className="flex-shrink-0 bg-gray-100 rounded-full p-1.5">
                              <ShoppingBag className="h-4 w-4 text-gray-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900">New order received</p>
                              <p className="text-xs text-gray-500">Order #12345 - 2 items</p>
                              <p className="text-xs text-gray-400">2 hours ago</p>
                            </div>
                            <div className="inline-flex items-center text-sm">
                              <button className="text-gray-600 hover:text-gray-800 text-xs font-medium">View</button>
                            </div>
                          </div>
                        </li>
                        <li className="py-3">
                          <div className="flex space-x-3">
                            <div className="flex-shrink-0 bg-gray-100 rounded-full p-1.5">
                              <CreditCard className="h-4 w-4 text-gray-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900">Payment received</p>
                              <p className="text-xs text-gray-500">$245.00 for Order #12344</p>
                              <p className="text-xs text-gray-400">1 day ago</p>
                            </div>
                          </div>
                        </li>
                        <li className="py-3">
                          <div className="flex space-x-3">
                            <div className="flex-shrink-0 bg-gray-100 rounded-full p-1.5">
                              <Box className="h-4 w-4 text-gray-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900">Product review</p>
                              <p className="text-xs text-gray-500">"Great product!" for "Premium Widget"</p>
                              <p className="text-xs text-gray-400">3 days ago</p>
                            </div>
                            <div className="inline-flex items-center text-sm">
                              <button className="text-gray-600 hover:text-gray-800 text-xs font-medium">Respond</button>
                            </div>
                          </div>
                        </li>
                      </ul>
                      <div className="mt-4 text-center">
                        <button className="text-sm font-medium text-gray-600 hover:text-gray-800">
                          View all activity
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer/>
    </> 
  );
}