import EditAddressForm, { AddressFormInputs } from "@/components/EditAddressForm";

// This page has no typed props — just server-side data fetching
export default function Page() {
  // fetch or pass mock default values
  const defaultValues: AddressFormInputs = {
    streetAddress: "",
    streetAddress2: "",
    city: "",
    state: "",
    country: "",
    zipcode: "",
  };

  const addressId = "123"; // fetch from DB / params

  return <EditAddressForm defaultValues={defaultValues} addressId={addressId} />;
}
