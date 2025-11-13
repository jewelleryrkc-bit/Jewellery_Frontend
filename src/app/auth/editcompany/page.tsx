"use client";

import { useQuery } from "@apollo/client";
import { ME_QUERY } from "../../../graphql/queries";
import EditCompanyForm from "./EditCompanyForm/page";

export default function EditProfilePage() {
  const { data, loading, error } = useQuery(ME_QUERY);

  if (loading) return <p className="text-center mt-4">Loading...</p>;
  if (error) return <p className="text-center mt-4 text-red-500">Error loading user.</p>;

  const company = data?.me; // Assuming one address per user

  if (!company) return <p className="text-center mt-4">No user found.</p>;

  return (
    <EditCompanyForm
      defaultValues={{
        username: company.username,
        contact: company.contact,
        email: company.email,
      }}
      companyId={company.id}
    />
  );
}
