/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// pages/admin/sellers/[id].tsx
"use client";

import { useQuery, useMutation } from "@apollo/client";
import { GET_COMPANY_BY_ID, UPDATE_COMPANY_STATUS } from "../../../../graphql/queries";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeftIcon, CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";
import LoadingPage from "@/components/LoadingPage";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

export default function AdminSellerPage() {
  const router = useRouter();
  const params = useParams();
  const companyId = params?.id as string;
  const [statusNote, setStatusNote] = useState("");
  const [isMutating, setIsMutating] = useState(false);

  const { data, loading, error, refetch } = useQuery(GET_COMPANY_BY_ID, {
    variables: { getCompanyId: companyId },
    skip: !companyId,
    fetchPolicy: "network-only", // Always fetch fresh data
  });

  const [updateCompanyStatus] = useMutation(UPDATE_COMPANY_STATUS);

  const company = data?.getCompany;

  const handleStatusUpdate = async (status: "APPROVED" | "SUSPENDED") => {
    if (!companyId) return;
    
    setIsMutating(true);
    try {
      await updateCompanyStatus({
        variables: {
          id: companyId,
          status,
          statusNote: statusNote || undefined
        }
      });
      
      // Refetch the company data to get the latest status
      await refetch();
      toast.success(`Company status updated to ${status}`);
      setStatusNote("");
    } catch (err: any) {
      console.error("Error updating status:", err);
      toast.error(err.message || "Failed to update status");
    } finally {
      setIsMutating(false);
    }
  };

  useEffect(() => {
    if (error) {
      toast.error(error.message || "Failed to load seller data");
    }
  }, [error]);

  if (loading) return <LoadingPage />;

  if (error || !company) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 max-w-md w-full">
          <h3 className="font-medium text-gray-900 text-lg mb-2">
            {error ? "Error loading seller" : "Seller Not Found"}
          </h3>
          <p className="text-gray-600 mb-4">
            {error?.message || "The seller you're looking for doesn't exist or may have been removed."}
          </p>
          <button 
            onClick={() => router.back()}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-1" />
            Back to sellers
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <button 
          onClick={() => router.back()}
          className="mb-6 flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium"
          disabled={isMutating}
        >
          <ArrowLeftIcon className="h-4 w-4 mr-1" />
          Back to Sellers
        </button>

        {/* Company Status Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">{company.cname || company.username}</h1>
              <div className="flex flex-wrap items-center mt-2 gap-x-4 gap-y-2 text-sm text-gray-600">
                <span>Email: {company.email || "N/A"}</span>
                <span>Contact: {company.contact || "N/A"}</span>
                <span>Location: {company.location || "N/A"}</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                  company.status === "APPROVED" 
                    ? "bg-green-100 text-green-800" 
                    : company.status === "PENDING"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-red-100 text-red-800"
                }`}>
                  {company.status}
                </span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
              {/* <button 
                onClick={() => handleStatusUpdate("APPROVED")}
                disabled={isMutating || company.status === "APPROVED"}
                className={`px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md transition-colors flex items-center gap-1 ${
                  isMutating || company.status === "APPROVED" ? "opacity-50 cursor-not-allowed" : "hover:bg-green-700"
                }`}
              >
                {isMutating ? (
                  "Processing..."
                ) : (
                  <>
                    <CheckIcon className="h-4 w-4" />
                    Approve
                  </>
                )}
              </button> */}
              <button 
                onClick={() => handleStatusUpdate("SUSPENDED")}
                disabled={isMutating || company.status === "SUSPENDED"}
                className={`px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md transition-colors flex items-center gap-1 ${
                  isMutating || company.status === "SUSPENDED" ? "opacity-50 cursor-not-allowed" : "hover:bg-red-700"
                }`}
              >
                {isMutating ? (
                  "Processing..."
                ) : (
                  <>
                    <XMarkIcon className="h-4 w-4" />
                    Suspend
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="mt-4">
            <label htmlFor="statusNote" className="block text-sm font-medium text-gray-700 mb-1">
              Status Note
            </label>
            <textarea
              id="statusNote"
              value={statusNote}
              onChange={(e) => setStatusNote(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={2}
              placeholder="Reason for status change..."
              disabled={isMutating}
            />
          </div>
        </div>

        {/* Company Details Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Company Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Registration Date</h3>
              <p className="mt-1 text-sm text-gray-900">
                {company.createdAt ? new Date(Number(company.createdAt)).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                }) : "N/A"}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Email Verification</h3>
              <p className="mt-1 text-sm text-gray-900">
                {company.isEmailVerified ? "Verified" : "Not Verified"}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Last Updated</h3>
              <p className="mt-1 text-sm text-gray-900">
                {company.updatedAt ? new Date(Number(company.updatedAt)).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                }) : "N/A"}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Status History</h3>
              <p className="mt-1 text-sm text-gray-900">
                {company.statusHistory?.length > 0 
                  ? company.statusHistory.join(", ") 
                  : "No history available"}
              </p>
            </div>
          </div>
        </div>

        {/* Products Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Products ({company.products?.length || 0})
          </h2>
          
          {company.products?.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stock
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {company.products.map((product: any) => (
                    <tr key={product.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {product.name || "Unnamed Product"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {product.price ? `$${product.price.toFixed(2)}` : "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {product.stock ?? "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          product.status === "ACTIVE" 
                            ? "bg-green-100 text-green-800" 
                            : "bg-gray-100 text-gray-800"
                        }`}>
                          {product.status || "UNKNOWN"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded">
              <p className="text-gray-500">No products found for this seller</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}