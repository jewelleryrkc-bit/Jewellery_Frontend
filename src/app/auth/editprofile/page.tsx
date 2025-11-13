"use client";

import { useQuery } from "@apollo/client";
import { WE_QUERY } from "../../../graphql/queries";
import EditUserForm from "./EditUserForm/page";

export default function EditProfilePage() {
  const { data, loading, error } = useQuery(WE_QUERY);

  if (loading) return <p className="text-center mt-4">Loading...</p>;
  if (error) return <p className="text-center mt-4 text-red-500">Error loading user.</p>;

  const user = data?.we; // Assuming one address per user

  if (!user) return <p className="text-center mt-4">No user found.</p>;

  return (
    <EditUserForm
      defaultValues={{
        username: user.username,
        contact: user.contact,
        email: user.email,
      }}
      userId={user.id}
    />
  );
}
