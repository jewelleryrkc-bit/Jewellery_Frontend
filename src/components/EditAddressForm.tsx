"use client";

import { UPDATE_ADDRESS } from "@/graphql/mutations";
import { useMutation } from "@apollo/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

export type AddressFormInputs = {
  streetAddress: string;
  streetAddress2: string;
  city: string;
  state: string;
  country: string;
  zipcode: string;
};

type Props = {
  defaultValues: AddressFormInputs;
  addressId: string;
};

export default function EditAddressForm({ defaultValues, addressId }: Props) {
  const router = useRouter();
  const [updateAddress] = useMutation(UPDATE_ADDRESS);
  const [errorMessage, setErrorMessage] = useState("");

  const {
    handleSubmit,
  } = useForm<AddressFormInputs>({ defaultValues });

  const onSubmit = async (data: AddressFormInputs) => {
    try {
      await updateAddress({
        variables: {
          updateUserAddressId: addressId,
          input: data,
        },
      });
      router.push("/auth/userprofile");
    } catch (error) {
      console.error(error);
      setErrorMessage("Failed to update address.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[60vh] bg-gray-100 pt-30 px-4">
      <div className="w-full max-w-2xl bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
        <h2 className="text-xl font-semibold text-center mb-4 text-gray-800">Update Address</h2>
        {errorMessage && <p className="mb-4 text-sm text-red-600 text-center">{errorMessage}</p>}
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* input fields unchanged */}
        </form>
      </div>
    </div>
  );
}
