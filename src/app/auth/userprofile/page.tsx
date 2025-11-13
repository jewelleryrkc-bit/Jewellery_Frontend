/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-html-link-for-pages */
"use client";

import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "@apollo/client";
import { LOGOUT_MUTATION } from "../../../graphql/mutations";
import { WE_QUERY } from "../../../graphql/queries";

export default function ProfilePage() {
  const router = useRouter();
  const { data, loading, error } = useQuery(WE_QUERY);
  const [logout] = useMutation(LOGOUT_MUTATION);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
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
      <div className="flex flex-col md:flex-row">
        {/* Sidebar */}
        <aside className="w-full md:w-64 bg-white shadow-md md:min-h-screen p-6">
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
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 md:p-10">
          <div className="max-w-4xl mx-auto">
            {/* Profile Header */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <div className="flex flex-col md:flex-row md:items-center md:space-x-6">
                <div className="flex-shrink-0 mb-4 md:mb-0">
                  <div className="h-24 w-24 rounded-full bg-indigo-100 flex items-center justify-center text-4xl font-bold text-indigo-600">
                    {data.we.username.charAt(0).toUpperCase()}
                  </div>
                </div>

                <div className="flex-1">
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-800">{data.we.username}</h1>
                  <p className="text-gray-600 mt-1">{data.we.email}</p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-sm font-medium">
                      Member
                    </span>
                    <span className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-sm font-medium">
                      Verified
                    </span>
                  </div>
                </div>

                <div className="mt-4 md:mt-0">
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 px-4 py-2 bg-white border border-red-500 text-red-500 font-medium rounded-lg hover:bg-red-50 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Profile Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Account Information */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Account Information</h2>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Username</p>
                    <p className="font-medium">{data.we.username}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{data.we.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Contact</p>
                    <p className="font-medium">{data.we.contact}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Address</p>
                    {Array.isArray(data.we.addresses) && data.we.addresses.length > 0 ? (
                      data.we.addresses.map((address: any, index: number) => (
                        <div key={index} className="mb-2">
                          <p className="font-medium">
                            {address.streetAddress}
                            {address.streetAddress2 && `, ${address.streetAddress2}`}
                          </p>
                          <p className="font-medium">
                            {address.city}, {address.state}, {address.country} {address.zipcode}
                          </p>
                          {/* <a href="/address/updateaddress">Edit address</a> */}
                          <a 
                            href={`/address/updateaddress?id=${address.id}`} 
                            className="text-indigo-600 hover:underline text-sm"
                          >
                            Edit address
                          </a>

                        </div>
                      ))
                    ) : (
                      <p className="font-medium text-gray-400">No addresses found</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Activity */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h2>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                        <svg className="h-4 w-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                    <div>
                      <p className="font-medium">Logged in today</p>
                      <p className="text-sm text-gray-500">2 hours ago</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <svg className="h-4 w-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    </div>
                    <div>
                      <p className="font-medium">Updated profile</p>
                      <p className="text-sm text-gray-500">3 days ago</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Edit Profile Button */}
            <div className="mt-6 flex justify-end">
              <a href="/auth/editprofile" className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors">
                Edit Profile
              </a>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
