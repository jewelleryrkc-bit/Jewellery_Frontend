/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-html-link-for-pages */
"use client";

import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "@apollo/client";
import { LOGOUT_MUTATION } from "../../../../graphql/mutations";
import { WE_QUERY } from "../../../../graphql/queries";
import LoadingPage from "@/components/LoadingPage";

export default function ProfilePage() {
  const router = useRouter();
  const { data, loading, error } = useQuery(WE_QUERY);
  const [logout] = useMutation(LOGOUT_MUTATION);

  if (loading)
    return (
      <LoadingPage/>
    );

  if (error || !data?.we) {
    router.push("/auth/login");
    return null;
  }

  const handleLogout = async () => {
    await logout();
    router.push("/auth/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="md:hidden bg-white shadow-sm p-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
            <span className="text-indigo-600 font-semibold">
              {data.we.username.charAt(0).toUpperCase()}
            </span>
          </div>
          <h2 className="text-lg font-semibold text-gray-800">Dashboard</h2>
        </div>
        <button
          onClick={handleLogout}
          className="p-2 text-red-500 rounded-lg hover:bg-red-50"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </button>
      </div>

      <div className="flex flex-col md:flex-row">
        {/* Sidebar - Hidden on mobile */}
        <aside className="hidden md:block w-full md:w-64 bg-white shadow-md md:min-h-screen p-6">
          <div className="flex items-center space-x-3 mb-8">
            <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
              <span className="text-indigo-600 font-semibold">
                {data.we.username.charAt(0).toUpperCase()}
              </span>
            </div>
            <h2 className="text-xl font-semibold text-gray-800">Dashboard</h2>
          </div>

          <nav className="space-y-2">
            <a href="/" className="flex items-center space-x-3 p-3 rounded-lg text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span>Home</span>
            </a>

            <a href="/auth/userprofile" className="flex items-center space-x-3 p-3 rounded-lg bg-indigo-50 text-indigo-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>Profile</span>
            </a>

            <a href="/settings" className="flex items-center space-x-3 p-3 rounded-lg text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>Settings</span>
            </a>

            <a href={`/orders`} className="flex items-center space-x-3 p-3 rounded-lg text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span>Orders</span>
            </a>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6 lg:p-10">
          <div className="max-w-4xl mx-auto">
            {/* Profile Header */}
            <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6">
                <div className="flex-shrink-0 mb-4 sm:mb-0 mx-auto sm:mx-0">
                  <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-full bg-indigo-100 flex items-center justify-center text-3xl sm:text-4xl font-bold text-indigo-600">
                    {data.we.username.charAt(0).toUpperCase()}
                  </div>
                </div>

                <div className="flex-1 text-center sm:text-left">
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">{data.we.username}</h1>
                  <p className="text-gray-600 mt-1 text-sm sm:text-base">{data.we.email}</p>

                  <div className="mt-3 sm:mt-4 flex flex-wrap justify-center sm:justify-start gap-2">
                    <span className="px-2 py-1 sm:px-3 sm:py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs sm:text-sm font-medium">
                      Member
                    </span>
                    <span className="px-2 py-1 sm:px-3 sm:py-1 bg-green-50 text-green-600 rounded-full text-xs sm:text-sm font-medium">
                      Verified
                    </span>
                  </div>
                </div>

                <div className="mt-4 sm:mt-0 flex justify-center sm:block">
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 px-3 py-2 sm:px-4 sm:py-2 bg-white border border-red-500 text-red-500 font-medium rounded-lg hover:bg-red-50 transition-colors"
                  >
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span className="text-sm sm:text-base">Logout</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Profile Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {/* Account Information */}
              <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">Account Information</h2>
                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-500">Username</p>
                    <p className="font-medium text-sm sm:text-base">{data.we.username}</p>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-gray-500">Email</p>
                    <p className="font-medium text-sm sm:text-base">{data.we.email}</p>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-gray-500">Contact</p>
                    <p className="font-medium text-sm sm:text-base">{data.we.contact}</p>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-gray-500">Address</p>
                    {Array.isArray(data.we.addresses) && data.we.addresses.length > 0 ? (
                      data.we.addresses.map((address: any, index: number) => (
                        <div key={index} className="mb-2">
                          <p className="font-medium text-sm sm:text-base">
                            {address.streetAddress}
                            {address.streetAddress2 && `, ${address.streetAddress2}`}
                          </p>
                          <p className="font-medium text-sm sm:text-base">
                            {address.city}, {address.state}, {address.country} {address.zipcode}
                          </p>
                          <a 
                            href={`/address/updateaddress?id=${address.id}`} 
                            className="text-indigo-600 hover:underline text-xs sm:text-sm"
                          >
                            Edit address
                          </a>
                        </div>
                      ))
                    ) : (
                      <div>
                        <p className="font-medium text-gray-400 text-sm sm:text-base">No addresses found</p>
                        <a href="/address" className="text-blue-400 text-xs sm:text-sm">Add address</a>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Activity */}
              <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">Recent Activity</h2>
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      <div className="h-6 w-6 sm:h-8 sm:w-8 rounded-full bg-green-100 flex items-center justify-center">
                        <svg className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                    <div>
                      <p className="font-medium text-sm sm:text-base">Logged in today</p>
                      <p className="text-xs sm:text-sm text-gray-500">2 hours ago</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      <div className="h-6 w-6 sm:h-8 sm:w-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <svg className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    </div>
                    <div>
                      <p className="font-medium text-sm sm:text-base">Updated profile</p>
                      <p className="text-xs sm:text-sm text-gray-500">3 days ago</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Edit Profile Button */}
            <div className="mt-6 flex justify-center sm:justify-end">
              <a href="/auth/editprofile" className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors text-sm sm:text-base">
                Edit Profile
              </a>
            </div>
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200">
        <div className="flex justify-around items-center p-3">
          <a href="/" className="p-2 text-gray-700 rounded-lg hover:bg-indigo-50">
            <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="text-xs block text-center mt-1">Home</span>
          </a>
          <a href="/auth/userprofile" className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
            <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="text-xs block text-center mt-1">Profile</span>
          </a>
          <a href="/settings" className="p-2 text-gray-700 rounded-lg hover:bg-indigo-50">
            <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-xs block text-center mt-1">Settings</span>
          </a>
          <a href="/orders" className="p-2 text-gray-700 rounded-lg hover:bg-indigo-50">
            <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span className="text-xs block text-center mt-1">Orders</span>
          </a>
        </div>
      </div>
    </div>
  );
}