"use client";

import { useForm } from "react-hook-form";
import { useMutation } from "@apollo/client";
import { LOGIN_COMPANY } from "../../../graphql/mutations";
import { useState } from "react";
import Link from "next/link";

type SellLoginFormInputs = {
  cname: string;
  password: string;
  email: string;
};

export default function CompanyLogin() {
  const [login] = useMutation(LOGIN_COMPANY);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SellLoginFormInputs>();

  const onSubmit = async (data: SellLoginFormInputs) => {
    try {
      const response = await login({ variables: { options: data } });

      if (response.data?.loginCompany?.company) {
        window.location.href = "/dashboard";
      } else {
        setErrorMessage(
          response.data?.loginCompany?.errors?.[0]?.message || "Login failed"
        );
      }
    } catch (err) {
      console.error("Login error:", err);
      setErrorMessage("An error occurred");
    }
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left side - Minimal jewelry business visual (hidden on mobile) */}
      <div className="hidden md:flex w-1/2 items-center justify-center p-12 border-r border-gray-100">
        <div className="max-w-md text-center">
          <div className="mb-10">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14 mx-auto text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <div className="space-y-5">
            <div className="flex items-center justify-center">
              <div className="h-px w-10 bg-gray-300"></div>
              <span className="px-3 text-sm text-gray-500">BUSINESS PORTAL</span>
              <div className="h-px w-10 bg-gray-300"></div>
            </div>
            <h3 className="text-xl font-medium text-gray-900">Jewelry Business Dashboard</h3>
            <p className="text-base text-gray-500">Manage your jewelry business account</p>
          </div>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-medium text-gray-900">Business Login</h2>
            <p className="mt-2 text-base text-gray-500">Access your company account</p>
          </div>

          {errorMessage && (
            <div className="mb-6 p-3 bg-gray-50 text-red-600 rounded-md text-base text-center">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-base font-medium text-gray-700 mb-2">
                Company Name
              </label>
              <input
                type="text"
                placeholder="Enter company name"
                {...register("cname", { required: "Company name is required" })}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 transition text-base"
              />
              {errors.cname && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.cname.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-base font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                placeholder="your@company.com"
                {...register("email", { required: "Email is required" })}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 transition text-base"
              />
              {errors.email && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-base font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  {...register("password", { required: "Password is required" })} 
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 transition text-base pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(prev => !prev)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-600 focus:outline-none"
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-600 text-sm mt-1">{errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition disabled:opacity-50 text-base"
            >
              {isSubmitting ? "Logging in..." : "Login to Dashboard"}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-100">
            <div className="text-center text-sm text-gray-500">
              <p>Don&apos;t have a business account?{' '}
                <Link href="/auth/sellregister" className="font-medium text-gray-900 hover:text-gray-700">
                  Register your company
                </Link>
              </p>
              <p className="mt-2">
                <Link href="/auth/login" className="font-medium text-gray-900 hover:text-gray-700">
                  Personal account login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}