"use client";

import { useForm } from "react-hook-form";
import { useMutation } from "@apollo/client";
import { VERIFY_EMAIL_MUTATION } from "../../../graphql/mutations";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type VerifyFormInputs = {
  email: string;
  code: string;
};

export default function Verify() {
  const [verifyCode] = useMutation(VERIFY_EMAIL_MUTATION);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<VerifyFormInputs>();

  const onSubmit = async (data: VerifyFormInputs) => {
    try {
      const { data: response } = await verifyCode({
        variables: {
          email: data.email,
          code: data.code,
        },
      });

      if (response?.verifyCode?.user) {
        router.push("/auth/login");
      } else {
        setErrorMessage(response?.verifyCode?.errors?.[0]?.message || "Invalid verification code");
      }
    } catch (error) {
      console.error("Verification error:", error);
      setErrorMessage("An error occurred during verification");
    }
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left side - Verification visual (hidden on mobile) */}
      <div className="hidden md:flex w-1/2 items-center justify-center p-12 border-r border-gray-100">
        <div className="max-w-md text-center">
          <div className="mb-10">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14 mx-auto text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <div className="space-y-5">
            <div className="flex items-center justify-center">
              <div className="h-px w-10 bg-gray-300"></div>
              <span className="px-3 text-sm text-gray-500">EMAIL VERIFICATION</span>
              <div className="h-px w-10 bg-gray-300"></div>
            </div>
            <h3 className="text-xl font-medium text-gray-900">Verify Your Account</h3>
            <p className="text-base text-gray-500">Enter the code sent to your email</p>
          </div>
        </div>
      </div>

      {/* Right side - Verification Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-medium text-gray-900">Verify Email</h2>
            <p className="mt-2 text-base text-gray-500">Enter your verification code</p>
          </div>

          {errorMessage && (
            <div className="mb-6 p-3 bg-gray-50 text-red-600 rounded-md text-base text-center">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-base font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                placeholder="your@email.com"
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
                Verification Code
              </label>
              <input
                type="text"
                placeholder="6-digit code"
                {...register("code", { 
                  required: "Verification code is required",
                  minLength: { 
                    value: 6, 
                    message: "Code must be 6 digits" 
                  },
                  maxLength: {
                    value: 6,
                    message: "Code must be 6 digits"
                  }
                })}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 transition text-base text-center tracking-widest"
              />
              {errors.code && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.code.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition disabled:opacity-50 text-base"
            >
              {isSubmitting ? "Verifying..." : "Verify Email"}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-100">
            <div className="text-center text-sm text-gray-500">
              <p>Didn&apos;t receive a code?{' '}
                <button className="font-medium text-gray-900 hover:text-gray-700">
                  Resend code
                </button>
              </p>
              <p className="mt-2">
                <Link href="/auth/login" className="font-medium text-gray-900 hover:text-gray-700">
                  Back to login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}