"use client";

import { useForm } from "react-hook-form";
import { useMutation } from "@apollo/client";
import { CREATE_USER_ADDRESS } from "../../graphql/mutations";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FiHome, FiMapPin, FiGlobe, FiMail, FiSave } from "react-icons/fi";

type AddressFormInputs = {
  streetAddress: string;
  streetAddress2?: string;
  city: string;
  state: string;
  country: string;
  zipcode: string;
};

export default function AddressForm() {
  const [createAddress] = useMutation(CREATE_USER_ADDRESS);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm<AddressFormInputs>({
    mode: "onChange",
  });

  const onSubmit = async (data: AddressFormInputs) => {
    setErrorMessage("");
    setSuccessMessage("");
    
    try {
      const variables = { input: data };
      const response = await createAddress({ variables });

      if (response?.data?.createUserAddress) {
        setSuccessMessage("Address saved successfully!");
        setTimeout(() => {
          router.push("/auth/userprofile");
        }, 1500);
      } else {
        setErrorMessage("Failed to save address. Please try again.");
      }
    } catch (error) {
      console.error("Address Error:", error);
      setErrorMessage(
        error instanceof Error 
          ? error.message 
          : "Something went wrong. Please try again."
      );
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] bg-gradient-to-br from-blue-50 to-gray-50 px-4 py-8">
      <div className="w-full max-w-2xl bg-white p-8 rounded-xl shadow-md border border-gray-100">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Shipping Address</h2>
          <p className="text-gray-600 mt-2">
            Please provide your complete address for delivery
          </p>
        </div>

        {errorMessage && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg text-sm">
            {errorMessage}
          </div>
        )}

        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-lg text-sm">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">

             {/* Street Address 2 */}
             <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <FiHome className="mr-2 opacity-50" />
                Apartment, Suite, etc *
              </label>
              <input
                type="text"
                required
                {...register("streetAddress2")}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Apt 4B"
              />
            </div>


            {/* Street Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <FiHome className="mr-2" />
                Street Address *
              </label>
              <input
                type="text"
                {...register("streetAddress", {
                  required: "Street address is required",
                  minLength: {
                    value: 5,
                    message: "Address is too short",
                  },
                })}
                className={`w-full p-3 border ${
                  errors.streetAddress ? "border-red-300" : "border-gray-300"
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                placeholder="123 Main St"
              />
              {errors.streetAddress && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.streetAddress.message}
                </p>
              )}
            </div>

            {/* City and State */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <FiMapPin className="mr-2" />
                  City *
                </label>
                <input
                  type="text"
                  {...register("city", {
                    required: "City is required",
                    pattern: {
                      value: /^[a-zA-Z\s]*$/,
                      message: "Invalid city name",
                    },
                  })}
                  className={`w-full p-3 border ${
                    errors.city ? "border-red-300" : "border-gray-300"
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  placeholder="Mumbai"
                />
                {errors.city && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.city.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <FiMapPin className="mr-2" />
                  State/Province *
                </label>
                <input
                  type="text"
                  {...register("state", {
                    required: "State is required",
                  })}
                  className={`w-full p-3 border ${
                    errors.city ? "border-red-300" : "border-gray-300"
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  placeholder="Maharashtra"
                />
                {errors.state && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.state.message}
                  </p>
                )}
              </div>
            </div>

            {/* Country and Zipcode */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <FiGlobe className="mr-2" />
                  Country *
                </label>
                <input
                  type="text"
                  {...register("country", {
                    required: "Country is required",
                    pattern: {
                      value: /^[a-zA-Z\s]*$/,
                      message: "Invalid country name",
                    },
                  })}
                  className={`w-full p-3 border ${
                    errors.city ? "border-red-300" : "border-gray-300"
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  placeholder="India"
                />
                {errors.country && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.country.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <FiMail className="mr-2" />
                  ZIP/Postal Code *
                </label>
                <input
                  type="text"
                  {...register("zipcode", {
                    required: "ZIP code is required",
                  })}
                  className={`w-full p-3 border ${
                    errors.zipcode ? "border-red-300" : "border-gray-300"
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  placeholder="10001"
                />
                {errors.zipcode && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.zipcode.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting || !isValid}
              className={`w-full py-3 px-4 flex items-center justify-center ${
                isSubmitting || !isValid
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              } text-white rounded-lg font-medium transition duration-200 shadow-md`}
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Saving...
                </>
              ) : (
                <>
                  <FiSave className="mr-2" />
                  Save Address
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}