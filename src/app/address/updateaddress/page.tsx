"use client";

import { useQuery } from "@apollo/client";
import { MY_ADDRESSES } from "../../../graphql/queries";
import EditAddressForm from "../editaddress/page";

export default function EditAddressPage() {
  const { data, loading, error } = useQuery(MY_ADDRESSES);

  if (loading) return <p className="text-center mt-4">Loading...</p>;
  if (error) return <p className="text-center mt-4 text-red-500">Error loading address</p>;

  const address = data?.myAddresses?.[0]; // Assuming one address per user

  if (!address) return <p className="text-center mt-4">No address found for your account.</p>;

  return (
    <EditAddressForm
      defaultValues={{
        streetAddress: address.streetAddress,
        streetAddress2: address.streetAddress2,
        city: address.city,
        state: address.state,
        country: address.country,
        zipcode: address.zipcode,
      }}
      addressId={address.id}
    />
  );
}
