"use client";

import { useForm } from "react-hook-form";
import { useMutation } from "@apollo/client";
import { ADMIN_LOGIN } from "../../../graphql/mutations";
import { useState } from "react";

type AdminLoginInputs = {
  username: string;
  email: string;
  password: string;
};

export default function AdminLogin() {
  const [adminLogin] = useMutation(ADMIN_LOGIN);
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AdminLoginInputs>();

  const onSubmit = async (data: AdminLoginInputs) => {
    try {
      const response = await adminLogin({ variables: { options: data } });

      console.log("adminLogin response:", response.data);

      // Fix this condition based on your actual response structure
      const success =
        response.data?.adminLogin?.admin || // if admin object exists
        response.data?.adminLogin?.success || // if success is returned
        response.data?.adminLogin; // fallback if something truthy is returned

      if (success) {
        window.location.href = "/admindashboard";
      } else {
        const error =
          response.data?.adminLogin?.errors?.[0]?.message || "Login failed";
        setErrorMessage(error);
      }
    } catch (err) {
      console.error("Login error:", err);
      setErrorMessage("An error occurred");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-bold mb-4 text-center">Admin Login</h2>
      {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input
          type="text"
          placeholder="Enter username"
          {...register("username", { required: "Username is required" })}
          className="w-full p-2 border rounded"
        />
        {errors.username && (
          <p className="text-red-500">{errors.username.message}</p>
        )}

        <input
          type="email"
          placeholder="Admin Email"
          {...register("email", { required: "Email is required" })}
          className="w-full p-2 border rounded"
        />
        {errors.email && (
          <p className="text-red-500">{errors.email.message}</p>
        )}

        <input
          type="password"
          placeholder="Password"
          {...register("password", { required: "Password is required" })}
          className="w-full p-2 border rounded"
        />
        {errors.password && (
          <p className="text-red-500">{errors.password.message}</p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white py-3 rounded font-semibold hover:bg-blue-700 transition disabled:bg-gray-400"
        >
          {isSubmitting ? "Logging In..." : "Login"}
        </button>
      </form>
    </div>
  );
}
