/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Footer from "@/components/Footer";
import { GET_PARENT_CATEGORIES } from "@/graphql/queries";
import { useMutation, useQuery } from "@apollo/client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { CREATE_DISCOUNT } from "../../../../graphql/mutations";
import { useRouter } from 'next/navigation';
import SellerMainHeader from "@/components/SellerMainHeader";

// UPDATE: Add all discount types
type DiscountType = 'PERCENTAGE' | 'FIXED_AMOUNT' | 'SPEND_THRESHOLD' | 'QUANTITY_THRESHOLD' | 'BOGO';

interface DiscountInput {
  type: DiscountType;
  value: number;
  startDate: string;
  endDate?: string;
  thresholdAmount?: number;
  thresholdQuantity?: number;
  bogoBuy?: number;
  bogoGet?: number;
  bogoDiscount?: number;
  productId?: string;
  categoryId?: string;
}

type DiscountStatus = 'draft' | 'active' | 'expired' | 'archived';

interface CreateDiscountResponse {
  createDiscount: {
    id: string;
    type: DiscountType;
    value: number;
    thresholdAmount?: number;
  thresholdQuantity?: number;
    bogoBuy?: number;
    bogoGet?: number;
    bogoDiscount?: number;
    status: DiscountStatus;
    startDate: string;
    endDate?: string;
  };
}

type AddProductFormInputs = {
  category: string;
  product?: string;
};

// NEW: Store selected values from dropdowns
interface DiscountFormValues {
  spendPercent?: number;
  spendThreshold?: number;
  quantityPercent?: number;
  quantityThreshold?: number;
  bogoBuy?: number;
  bogoGet?: number;
  bogoDiscountPercent?: number;
  fixedAmount?: number;
  fixedThreshold?: number;
  saveAmount?: number;
  saveThreshold?: number;
}

export default function Discounts() {
  const [active, setActive] = useState("Promote your store");
  const [selectedDiscount, setSelectedDiscount] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: categoriesData, loading: categoriesLoading } = useQuery(GET_PARENT_CATEGORIES);
  const [createDiscount] = useMutation<CreateDiscountResponse>(CREATE_DISCOUNT);
  const router = useRouter();
  
  // NEW: Store dropdown values
  const [formValues, setFormValues] = useState<DiscountFormValues>({});

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<AddProductFormInputs>();

  const sidebarItems = [
    "Edit store",
    "Store categories",
    "Store traffic",
    "Store newsletter",
    "Promote your store",
    "Social",
    "Manage subscription",
  ];

  const onSubmit = async (data: AddProductFormInputs) => {
    if (!selectedDiscount) return;

    setIsSubmitting(true);
    
    try {
      const input: DiscountInput = {
        type: 'PERCENTAGE',
        value: 0,
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      };

      // NEW: Handle all discount types
      switch (selectedDiscount) {
        case "spend-percent":
          input.type = 'SPEND_THRESHOLD';
          input.value = formValues.spendPercent || 5;
          input.thresholdAmount = formValues.spendThreshold || 100;
          break;
        
        case "spend-fixed":
          input.type = 'SPEND_THRESHOLD';
          input.value = formValues.fixedAmount || 5;
          input.thresholdAmount = formValues.fixedThreshold || 20;
          break;
        
        case "quantity-percent":
          input.type = 'QUANTITY_THRESHOLD';
          input.value = formValues.quantityPercent || 5;
          input.thresholdQuantity = formValues.quantityThreshold || 2;
          break;
        
        case "quantity-fixed":
          input.type = 'QUANTITY_THRESHOLD';
          input.value = formValues.saveAmount || 5;
          input.thresholdQuantity = formValues.saveThreshold || 2;
          break;
        
        case "bogo-free":
          input.type = 'BOGO';
          input.bogoBuy = formValues.bogoBuy || 1;
          input.bogoGet = formValues.bogoGet || 1;
          input.bogoDiscount = 100;
          break;
        
        case "bogo-discount":
          input.type = 'BOGO';
          input.bogoBuy = formValues.bogoBuy || 1;
          input.bogoGet = formValues.bogoGet || 1;
          input.bogoDiscount = formValues.bogoDiscountPercent || 5;
          break;
        
        case "no-min-10":
          input.type = 'PERCENTAGE';
          input.value = 10;
          break;
        
        case "no-min-20":
          input.type = 'PERCENTAGE';
          input.value = 20;
          break;
        
        case "no-min-fixed":
          input.type = 'FIXED_AMOUNT';
          input.value = 10;
          break;
      }

      // Add category/product if selected
      if (data.category) {
        input.categoryId = data.category;
      }

      const result = await createDiscount({ variables: { input } });

      if (result.errors) {
        throw new Error(result.errors[0].message);
      }

      console.log("Discount created:", result.data?.createDiscount);
      router.push('/dashboard/marketing/selectItems');
    } catch (error) {
      console.error("Error creating discount:", error);
      alert(`Failed to create discount: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // NEW: Handle discount selection (only one at a time)
  const handleDiscountSelection = (discountType: string) => {
    setSelectedDiscount(discountType);
  };

  // NEW: Handle dropdown changes
  const handleDropdownChange = (field: keyof DiscountFormValues, value: number) => {
    setFormValues(prev => ({ ...prev, [field]: value }));
  };

  return (
    <>
      <SellerMainHeader/>
      <div className="flex min-h-screen mt-8">
        {/* Sidebar - Desktop Only */}
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
        <div className="flex-1 overflow-auto">
          <main className="max-w-[1400px] mx-auto py-8 px-4 md:px-10 w-full">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="rounded-lg p-4 md:p-8 space-y-6 md:space-y-10 bg-white shadow-sm border border-gray-200">
                <h3 className="text-lg md:text-xl font-semibold border-b border-gray-200 pb-3 md:pb-4">Select offer type</h3>

                {/* Category Section */}
                <div className="bg-gray-50 p-4 md:p-6 rounded-lg mb-6 md:mb-8">
                  <div className="flex flex-col space-y-3 md:space-y-4">
                    <label className="block text-base font-medium text-gray-700">
                      Choose a category (optional)
                    </label>
                    <div className="w-full md:w-1/2">
                      <select
                        {...register("category")}
                        className="w-full border border-gray-300 rounded px-3 md:px-4 py-2 md:py-3 text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                      >
                        <option value="">All Categories</option>
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
                    </div>
                  </div>
                </div>

                {/* Discount Options Section */}
                <div className="bg-gray-50 p-4 md:p-6 rounded-lg space-y-6 md:space-y-8">
                  
                  {/* Spend Section */}
                  <div className="flex flex-col md:flex-row md:space-x-8 space-y-4 md:space-y-0">
                    <h4 className="block text-base font-medium md:w-1/4 text-gray-700 pt-0 md:pt-2">Spend</h4>
                    <div className="w-full md:w-3/4 space-y-4">
                      <label className="flex items-center space-x-3">
                        <input
                          type="radio"
                          name="discount-type"
                          checked={selectedDiscount === "spend-percent"}
                          onChange={() => handleDiscountSelection("spend-percent")}
                          className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <span className="text-base flex flex-wrap items-center gap-1">
                          Extra <NumberDropdown options={[5, 10, 15, 20, 25, 30, 40, 50]} value={formValues.spendPercent} onChange={(val) => handleDropdownChange('spendPercent', val)} />% off $
                          <NumberDropdown options={[100, 200, 300, 400, 500, 600, 700, 800, 900, 1000]} value={formValues.spendThreshold} onChange={(val) => handleDropdownChange('spendThreshold', val)} /> or more
                        </span>
                      </label>

                      <label className="flex items-center space-x-3">
                        <input
                          type="radio"
                          name="discount-type"
                          checked={selectedDiscount === "spend-fixed"}
                          onChange={() => handleDiscountSelection("spend-fixed")}
                          className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <span className="text-base flex flex-wrap items-center gap-1">
                          Save $<NumberDropdown options={[5, 10, 15, 20, 25, 30]} value={formValues.fixedAmount} onChange={(val) => handleDropdownChange('fixedAmount', val)} /> for every $
                          <NumberDropdown options={[20, 30, 40, 50, 75, 100]} value={formValues.fixedThreshold} onChange={(val) => handleDropdownChange('fixedThreshold', val)} />
                        </span>
                      </label>
                    </div>
                  </div>

                  {/* Quantity Section */}
                  <div className="flex flex-col md:flex-row md:space-x-8 space-y-4 md:space-y-0 pt-4 md:pt-6">
                    <h4 className="block text-base font-medium md:w-1/4 text-gray-700 pt-0 md:pt-2">Quantity</h4>
                    <div className="w-full md:w-3/4 space-y-4">
                      <label className="flex items-center space-x-3">
                        <input
                          type="radio"
                          name="discount-type"
                          checked={selectedDiscount === "quantity-percent"}
                          onChange={() => handleDiscountSelection("quantity-percent")}
                          className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <span className="text-base flex flex-wrap items-center gap-1">
                          Extra <NumberDropdown options={[5, 10, 15, 20, 25, 30, 40, 50]} value={formValues.quantityPercent} onChange={(val) => handleDropdownChange('quantityPercent', val)} />% off
                          <NumberDropdown options={[2, 3, 4, 5, 10]} value={formValues.quantityThreshold} onChange={(val) => handleDropdownChange('quantityThreshold', val)} /> or more items
                        </span>
                      </label>

                      <label className="flex items-center space-x-3">
                        <input
                          type="radio"
                          name="discount-type"
                          checked={selectedDiscount === "quantity-fixed"}
                          onChange={() => handleDiscountSelection("quantity-fixed")}
                          className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <span className="text-base flex flex-wrap items-center gap-1">
                          Save $<NumberDropdown options={[5, 10, 15, 20]} value={formValues.saveAmount} onChange={(val) => handleDropdownChange('saveAmount', val)} /> for every
                          <NumberDropdown options={[2, 3, 4, 5]} value={formValues.saveThreshold} onChange={(val) => handleDropdownChange('saveThreshold', val)} /> items
                        </span>
                      </label>
                    </div>
                  </div>

                  {/* Buy 1 Get 1 Section */}
                  <div className="flex flex-col md:flex-row md:space-x-8 space-y-4 md:space-y-0 pt-4 md:pt-6">
                    <h4 className="block text-base font-medium md:w-1/4 text-gray-700 pt-0 md:pt-2">Buy one, get one</h4>
                    <div className="w-full md:w-3/4 space-y-4">
                      <label className="flex items-center space-x-3">
                        <input
                          type="radio"
                          name="discount-type"
                          checked={selectedDiscount === "bogo-free"}
                          onChange={() => handleDiscountSelection("bogo-free")}
                          className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <span className="text-base flex flex-wrap items-center gap-1">
                          Buy <NumberDropdown options={[1, 2, 3]} value={formValues.bogoBuy} onChange={(val) => handleDropdownChange('bogoBuy', val)} />, get <NumberDropdown options={[1, 2, 3]} value={formValues.bogoGet} onChange={(val) => handleDropdownChange('bogoGet', val)} /> free
                        </span>
                      </label>

                      <label className="flex items-center space-x-3">
                        <input
                          type="radio"
                          name="discount-type"
                          checked={selectedDiscount === "bogo-discount"}
                          onChange={() => handleDiscountSelection("bogo-discount")}
                          className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <span className="text-base flex flex-wrap items-center gap-1">
                          Buy <NumberDropdown options={[1, 2, 3]} value={formValues.bogoBuy} onChange={(val) => handleDropdownChange('bogoBuy', val)} />, get <NumberDropdown options={[1, 2, 3]} value={formValues.bogoGet} onChange={(val) => handleDropdownChange('bogoGet', val)} /> at 
                          <NumberDropdown options={[5, 10, 15, 20, 25, 30]} value={formValues.bogoDiscountPercent} onChange={(val) => handleDropdownChange('bogoDiscountPercent', val)} />% off
                        </span>
                      </label>
                    </div>
                  </div>

                  {/* No Minimum Purchase Section */}
                  <div className="flex flex-col md:flex-row md:space-x-8 space-y-4 md:space-y-0 pt-4 md:pt-6">
                    <h4 className="block text-base font-medium md:w-1/4 text-gray-700 pt-0 md:pt-2">No minimum purchase</h4>
                    <div className="w-full md:w-3/4 space-y-4">
                      <label className="flex items-center space-x-3">
                        <input
                          type="radio"
                          name="discount-type"
                          checked={selectedDiscount === "no-min-10"}
                          onChange={() => handleDiscountSelection("no-min-10")}
                          className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <span className="text-base">Extra 10% off</span>
                      </label>

                      <label className="flex items-center space-x-3">
                        <input
                          type="radio"
                          name="discount-type"
                          checked={selectedDiscount === "no-min-20"}
                          onChange={() => handleDiscountSelection("no-min-20")}
                          className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <span className="text-base">Extra 20% off</span>
                      </label>

                      <label className="flex items-center space-x-3">
                        <input
                          type="radio"
                          name="discount-type"
                          checked={selectedDiscount === "no-min-fixed"}
                          onChange={() => handleDiscountSelection("no-min-fixed")}
                          className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <span className="text-base">Extra $10 off each item</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col-reverse sm:flex-row justify-between pt-6 md:pt-8 border-t border-gray-200 mt-6 md:mt-8 space-y-4 sm:space-y-0 sm:space-x-4">
                  <button
                    type="button"
                    className="text-gray-600 font-medium px-6 py-2 md:px-8 md:py-3 rounded hover:bg-gray-50 transition text-base w-full sm:w-auto"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className={`font-medium px-6 py-2 md:px-8 md:py-3 rounded-4xl transition text-base w-full sm:w-auto ${
                      selectedDiscount && !isSubmitting
                        ? "bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                    disabled={!selectedDiscount || isSubmitting}
                  >
                    {isSubmitting ? 'Creating...' : 'Create Discount'}
                  </button>
                </div>
              </div>
            </form>
          </main>
        </div>
      </div>
      <Footer/> 
    </>
  );
}

// Updated NumberDropdown component
interface NumberDropdownProps {
  options: number[];
  value?: number;
  onChange: (value: number) => void;
  prefix?: string;
}

export function NumberDropdown({ options, value, onChange, prefix = "" }: NumberDropdownProps) {
  return (
    <select 
      className="border rounded px-2 md:px-3 py-1 md:py-1.5 text-sm md:text-base focus:ring-1 focus:ring-blue-500 outline-none transition w-16 md:w-18 mx-1"
      value={value || options[0]}
      onChange={(e) => onChange(Number(e.target.value))}
    >
      {options.map((num) => (
        <option key={num} value={num}> 
          {prefix}{num}
        </option>
      ))}
    </select> 
  );
}