"use client";

import { useForm } from "react-hook-form";
import { useMutation } from "@apollo/client";
import { VERIFY_COMPANY } from "../../graphql/mutations";
import { useState } from "react";
import { useRouter } from "next/navigation";

type VerifyFormInputs = {
  email: string;
  code: string;
};

export default function VerifyCompany() {
  const [verifyCompany] = useMutation(VERIFY_COMPANY);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const { register, handleSubmit, formState: { errors } } = useForm<VerifyFormInputs>();

  const onSubmit = async (data: VerifyFormInputs) => {
    try {
      const { data: response } = await verifyCompany({
        variables: {
          email: data.email,
          code: data.code,
        },
      });

      if (response?.verifyCompany?.company) {
        router.push("/auth/selllogin"); // Redirect to login after verification
      } else {
        setErrorMessage(response?.verifyCompany?.errors?.[0]?.message || "Invalid code");
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setErrorMessage("An error occurred");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-bold mb-4">Verify Your Company Email</h2>
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input 
          type="email" 
          placeholder="Company Email" 
          {...register("email", { required: "Email is required" })} 
          className="w-full p-2 border rounded"
        />
        {errors.email && <p className="text-red-500">{errors.email.message}</p>}

        <input 
          type="text" 
          placeholder="Verification Code" 
          {...register("code", { required: "Code is required", minLength: { value: 6, message: "Code must be 6 digits" } })} 
          className="w-full p-2 border rounded"
        />
        {errors.code && <p className="text-red-500">{errors.code.message}</p>}

        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded">
          Verify
        </button>
      </form>
    </div>
  );
}
