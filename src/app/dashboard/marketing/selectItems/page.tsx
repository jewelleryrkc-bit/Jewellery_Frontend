/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Footer from "@/components/Footer";
import MiddleHeader from "@/components/MiddleHeader";
import SellerbottomHeader from "@/components/SellerBottomHeader";
import TopHeader from "@/components/TopHeader";
import { useMutation, useQuery } from "@apollo/client";
import { GET_PARENT_CATEGORIES, DISCOUNTS_BY_COMPANY, ME_QUERY } from "@/graphql/queries";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { APPLY_DISCOUNT_TO_CATEGORY_PRODUCTS } from "@/graphql/mutations";

type DiscountType = 'PERCENTAGE' | 'FIXED_AMOUNT' | 'MIN_PURCHASE' | 'BOGO' | 'THRESHOLD';

interface Discount {
  id: string;
  type: DiscountType;
  value: number;
  thresholdAmount?: number;
  thresholdQuantity?: number;
  bogoGet?: number;
  bogoBuy?: number;
  bogoDiscount?: number;
  status: string;
  isActive: boolean;
  startDate: string;
  endDate?: string;
}


type AddProductFormInputs = {
  category: string;
  discountValue?: number;
  discountType?: DiscountType;
};

export default function Discounts() {
  const [selectedDiscount, setSelectedDiscount] = useState<Discount | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Fetch current user data to get companyId
  const { data: userData, loading: userLoading } = useQuery(ME_QUERY);
  const companyId = userData?.me?.id || "";

  const { data: categoriesData, loading: categoriesLoading } = useQuery(GET_PARENT_CATEGORIES);
  const { data: discountsData, loading: discountsLoading, refetch: refetchDiscounts } = useQuery(DISCOUNTS_BY_COMPANY, {
    variables: {
      companyId: companyId
    },
    skip: !companyId
  });
  
  const [applyDiscountToCategory] = useMutation(APPLY_DISCOUNT_TO_CATEGORY_PRODUCTS);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<AddProductFormInputs>();

  const watchCategory = watch("category");

  const onSubmit = async (data: AddProductFormInputs) => {
    if (!selectedDiscount || !data.category) return;

    setIsSubmitting(true);
    
    try {
      const { data: applyData } = await applyDiscountToCategory({
        variables: {
          discountId: selectedDiscount.id,
          categoryId: data.category
        }
      });

      if (applyData?.applyDiscountonCategory) {
        alert(`Discount applied to ${applyData.applyDiscountonCategory.length} products in this category!`);
        refetchDiscounts();
      }
    } catch (error) {
      console.error("Error applying discount:", error);
      alert(`Failed to apply discount: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDiscountSelection = (discount: Discount) => {
    setSelectedDiscount(discount);
    setValue('discountValue', discount.value);
    setValue('discountType', discount.type);
  };

  // Function to render discount details based on type
  const renderDiscountDetails = (discount: Discount) => {
    switch (discount.type) {
      case 'PERCENTAGE':
        return `${discount.value}% Off`;
      
      case 'FIXED_AMOUNT':
        return `$${discount.value} Off`;
      
      case 'MIN_PURCHASE':
        return `Min Purchase: $${discount.thresholdAmount} → $${discount.value} Off`;
      
      case 'THRESHOLD':
        if (discount.thresholdAmount) {
          return `Spend $${discount.thresholdAmount}+ → ${discount.value}% Off`;
        } else if (discount.thresholdQuantity) {
          return `Buy ${discount.thresholdQuantity}+ → ${discount.value}% Off`;
        }
        return `${discount.value}% Off`;
      
      case 'BOGO':
        return `Buy ${discount.bogoBuy}, Get ${discount.bogoGet} ${discount.bogoDiscount ? `with ${discount.bogoDiscount}% Off` : 'Free'}`;
      
      default:
        return `${discount.value} Off`;
    }
  };

  // Function to get status badge color
  const getStatusColor = (status: string, isActive: boolean) => {
    if (!isActive) return 'bg-gray-100 text-gray-800';
    if (status === 'ACTIVE') return 'bg-green-100 text-green-800';
    if (status === 'EXPIRED') return 'bg-red-100 text-red-800';
    if (status === 'SCHEDULED') return 'bg-blue-100 text-blue-800';
    return 'bg-gray-100 text-gray-800';
  };

  if (userLoading) {
    return (
      <>
        <TopHeader/>
        <MiddleHeader/>
        <SellerbottomHeader/>
        <div className="flex justify-center items-center min-h-screen">
          <p>Loading...</p>
        </div>
        <Footer/>
      </>
    );
  }

  if (!companyId) {
    return (
      <>
        <TopHeader/>
        <MiddleHeader/>
        <SellerbottomHeader/>
        <div className="flex justify-center items-center min-h-screen">
          <p className="text-red-500">Error: Company ID not found. Please contact support.</p>
        </div>
        <Footer/>
      </>
    );
  }

  return (
    <>
      <TopHeader/>
      <MiddleHeader/>
      <SellerbottomHeader/>
      <div className="bg-white min-h-screen text-black w-full flex">
        {/* Sidebar */}
        <div className="w-64 bg-gray-50 border-r border-gray-200 flex-shrink-0">
          <div className="p-4 flex flex-col h-full">
            <h2 className="text-lg font-semibold mb-6">Marketing</h2>
            
            <nav className="flex-1">
              <ul className="space-y-1">
                <li>
                  <a href="#" className="flex items-center p-3 rounded-lg hover:bg-gray-200 text-sm">
                    <span className="ml-2">Coupons</span>
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center p-3 rounded-lg bg-gray-200 font-medium text-sm">
                    <span className="ml-2">Discounts</span>
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center p-3 rounded-lg hover:bg-gray-200 text-sm">
                    <span className="ml-2">Analytics</span>
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center p-3 rounded-lg hover:bg-gray-200 text-sm">
                    <span className="ml-2">Customer Groups</span>
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <main className="max-w-[1400px] mx-auto py-8 px-10 w-full">
            <div className="rounded-lg p-8 space-y-10 bg-white shadow-sm border border-gray-200">
              {/* Existing Discounts Section */}
              <section>
                <h3 className="text-xl font-semibold border-b border-gray-200 pb-4">Your Existing Discounts</h3>

                {discountsLoading ? (
                  <p>Loading discounts...</p>
                ) : discountsData?.discountsByCompany?.length > 0 ? (
                  <div className="overflow-x-auto mt-4">
                    <table className="min-w-full divide-y divide-gray-200 border border-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Select</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Discount Details</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Date</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {discountsData.discountsByCompany.map((discount: Discount) => (
                          <tr
                            key={discount.id}
                            onClick={() => handleDiscountSelection(discount)}
                            className={`cursor-pointer hover:bg-gray-50 ${
                              selectedDiscount?.id === discount.id ? "bg-blue-50" : ""
                            }`}
                          >
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <input
                                type="radio"
                                name="selectedDiscount"
                                checked={selectedDiscount?.id === discount.id}
                                readOnly
                              />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                              {discount.type.replace('_', ' ').toLowerCase()}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900">
                              {renderDiscountDetails(discount)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(discount.status, discount.isActive)}`}>
                                {discount.isActive ? discount.status : 'INACTIVE'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(discount.startDate).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {discount.endDate
                                ? new Date(discount.endDate).toLocaleDateString()
                                : "—"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-gray-500 mt-4">You haven&apos;t created any discounts yet</p>
                )}
              </section>

              {/* Apply Discount Form */}
              {selectedDiscount && (
                <form onSubmit={handleSubmit(onSubmit)}>
                  <h3 className="text-xl font-semibold border-b border-gray-200 pb-4 mt-8">
                    Apply Discount to Category
                  </h3>

                  <div className="bg-gray-50 p-6 rounded-lg mt-4">
                    <div className="mb-4">
                      <h4 className="font-medium text-gray-700 mb-2">Selected Discount:</h4>
                      <div className="flex items-center gap-2">
                        <div className="px-3 py-1.5 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                          {renderDiscountDetails(selectedDiscount)}
                        </div>
                        <span className="text-sm text-gray-600">
                          ({selectedDiscount.type.replace('_', ' ').toLowerCase()}, created on {new Date(selectedDiscount.startDate).toLocaleDateString()})
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col space-y-4">
                      <label className="block text-base font-medium text-gray-700">
                        Choose a category to apply this discount
                      </label>
                      <div className="w-full md:w-1/2">
                        <select
                          {...register("category", { required: "Category is required" })}
                          className="w-full border border-gray-300 rounded px-4 py-3 text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                        >
                          <option value="">Select a Category</option>
                          {categoriesLoading ? (
                            <option disabled>Loading categories...</option>
                          ) : (
                            categoriesData?.parentCategories?.map((cat: any) => (
                              <option key={cat.id} value={cat.id}>
                                {cat.name}
                              </option>
                            ))
                          )}
                        </select>
                        {errors.category && (
                          <p className="text-red-500 text-sm mt-2">{errors.category.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-gray-200">
                      <button
                        type="submit"
                        disabled={!watchCategory || isSubmitting}
                        className={`font-medium px-6 py-3 rounded transition text-base ${
                          watchCategory && !isSubmitting
                            ? "bg-blue-600 text-white hover:bg-blue-700"
                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }`}
                      >
                        {isSubmitting ? 'Applying...' : 'Apply to Selected Category'}
                      </button>
                    </div>
                  </div>
                </form>
              )}

              {/* Action Buttons */}
              <div className="flex justify-between pt-8 border-t border-gray-200 mt-8">
                <button
                  type="button"
                  className="text-gray-600 font-medium px-8 py-3 rounded hover:bg-gray-50 transition text-base"
                >
                  Back
                </button>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedDiscount(null)}
                    className="border border-gray-600 text-gray-600 px-8 py-3 rounded hover:bg-gray-50 transition text-base"
                  >
                    Clear Selection
                  </button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
      <Footer/> 
    </>
  );
}
