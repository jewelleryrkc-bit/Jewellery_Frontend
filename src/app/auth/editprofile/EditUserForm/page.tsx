"use client";

import { UPDATE_USER_FIELDS } from "../../../../graphql/mutations";
import { useMutation } from "@apollo/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

type UserFormInputs = {
  username: string;
  email: string;
  contact: number;
};

type Props = {
  defaultValues: UserFormInputs;
  userId: string;
};

export default function EditUserForm({ defaultValues, userId }: Props) {
  const router = useRouter();
  const [updateUser] = useMutation(UPDATE_USER_FIELDS);
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UserFormInputs>({ defaultValues });

  const onSubmit = async (data: UserFormInputs) => {
    try {
      await updateUser({
        variables: {
          userid: userId,
          input: data,
        },
      });
      router.push("/auth/userprofile");
    } catch (error) {
      console.error(error);
      setErrorMessage("Failed to update user fields.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[60vh] bg-gray-100 px-4">
      <div className="w-full max-w-2xl bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
        <h2 className="text-xl font-semibold text-center mb-4 text-gray-800">Update User</h2>
        {errorMessage && <p className="mb-4 text-sm text-red-600 text-center">{errorMessage}</p>}
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* fields here (unchanged) */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              placeholder="Enter your username"
              {...register("username", { required: "Username is required" })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.username && (
              <p className="text-red-500 text-sm mt-1">
                {errors.username.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              {...register("email", { required: "Email is required" })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Contact */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Contact
            </label>
            <input
              type="tel"
              inputMode="numeric"
              placeholder="Enter your contact"
              {...register("contact", {
                valueAsNumber: true,
                required: "Contact is required",
                // pattern: {
                //   value: /^[0-9]+$/,
                //   message: "Contact must contain only numbers",
                // },
              })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.contact && (
              <p className="text-red-500 text-sm mt-1">
                {errors.contact.message}
              </p>
            )}
          </div>

          <div className="col-span-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition duration-200 disabled:bg-gray-400"
            >
              {isSubmitting ? "Updating..." : "Update Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
