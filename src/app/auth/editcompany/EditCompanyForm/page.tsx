"use client";

import { UPDATE_COMPANY_FIELDS } from "../../../../graphql/mutations";
import { ME_QUERY } from "../../../../graphql/queries";
import { useMutation, useQuery } from "@apollo/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { User, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

type CompanyFormInputs = {
    username: string;
    email: string;
    contact: number;
};

type Props = {
    defaultValues: CompanyFormInputs;
    companyId: string;
}

export default function EditCompanyForm({ defaultValues, companyId }: Props) {
    const router = useRouter();
    const [updateCompany] = useMutation(UPDATE_COMPANY_FIELDS);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const { data: meData } = useQuery(ME_QUERY);
    const username = meData?.me?.username;

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting, isDirty },
    } = useForm<CompanyFormInputs>({ defaultValues });

    const onSubmit = async (data: CompanyFormInputs) => {
        try {
            await updateCompany({
                variables: {
                    companyid: companyId,
                    input: data, 
                }
            });
            setSuccessMessage("Profile updated successfully!");
            setTimeout(() => router.push(`/dashboard/profile/${username}`), 1500);
        } catch (error) {
            console.error(error);
            setErrorMessage("Failed to update profile");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                        <button 
                            onClick={() => router.back()}
                            className="p-1 rounded-md hover:bg-gray-100"
                        >
                            <ArrowLeft className="h-5 w-5 text-gray-500" />
                        </button>
                        <h1 className="text-xl font-bold text-gray-900">Edit Profile</h1>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Sidebar */}
                    <div className="w-full lg:w-1/4">
                        <div className="bg-white rounded-lg shadow overflow-hidden">
                            <div className="p-6 text-center border-b">
                                <div className="mx-auto h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center mb-4">
                                    <User className="h-12 w-12 text-gray-600" />
                                </div>
                                <h2 className="text-lg font-medium text-gray-900">Edit Profile</h2>
                                <p className="text-sm text-gray-500">Update your information</p>
                            </div>

                            <nav className="p-4">
                                <Link href="/dashboard/profile" className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900">
                                    <User className="h-5 w-5 mr-3 text-gray-400" />
                                    Back to Profile
                                </Link>
                            </nav>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="w-full lg:w-3/4">
                        <div className="bg-white shadow rounded-lg overflow-hidden">
                            <div className="px-6 py-5 border-b border-gray-200">
                                <h3 className="text-lg font-medium leading-6 text-gray-900">Edit Information</h3>
                            </div>

                            <div className="bg-white px-6 py-4">
                                {errorMessage && (
                                    <div className="mb-4 p-3 bg-red-100 border-l-4 border-red-500 text-red-700">
                                        <p>{errorMessage}</p>
                                    </div>
                                )}
                                
                                {successMessage && (
                                    <div className="mb-4 p-3 bg-green-100 border-l-4 border-green-500 text-green-700">
                                        <p>{successMessage}</p>
                                    </div>
                                )}

                                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                    <div className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                                        {/* Username */}
                                        <div>
                                            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                                                Username
                                            </label>
                                            <input
                                                id="username"
                                                type="text"
                                                {...register("username", { 
                                                    required: "Username is required",
                                                    minLength: {
                                                        value: 2,
                                                        message: "Username must be at least 2 characters"
                                                    }
                                                })}
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
                                            />
                                            {errors.username && (
                                                <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>
                                            )}
                                        </div>

                                        {/* Email */}
                                        <div>
                                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                                Email
                                            </label>
                                            <input
                                                id="email"
                                                type="email"
                                                {...register("email", { 
                                                    required: "Email is required",
                                                    pattern: {
                                                        value: /^\S+@\S+$/i,
                                                        message: "Please enter a valid email"
                                                    }
                                                })}
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
                                            />
                                            {errors.email && (
                                                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                                            )}
                                        </div>

                                        {/* Contact */}
                                        <div className="sm:col-span-2">
                                            <label htmlFor="contact" className="block text-sm font-medium text-gray-700">
                                                Contact Number
                                            </label>
                                            <input
                                                id="contact"
                                                type="tel"
                                                inputMode="numeric"
                                                {...register("contact", {
                                                    valueAsNumber: true,
                                                    required: "Contact is required",
                                                    validate: (value) => 
                                                        value.toString().length >= 10 || 
                                                        "Contact must be at least 10 digits"
                                                })}
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
                                            />
                                            {errors.contact && (
                                                <p className="mt-1 text-sm text-red-600">{errors.contact.message}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                                        <button
                                            type="button"
                                            onClick={() => router.push(`/dashboard/profile/${username}`)}
                                            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isSubmitting || !isDirty}
                                            className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${isSubmitting || !isDirty ? 'bg-gray-400' : 'bg-gray-800 hover:bg-gray-900'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500`}
                                        >
                                            {isSubmitting ? 'Saving...' : 'Save Changes'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}