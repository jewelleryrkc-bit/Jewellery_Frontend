"use client";

import Link from "next/link";
import { useQuery } from "@apollo/client";
import { GET_ADMIN } from "../../graphql/queries";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface HeaderProps {
  admin?: { username: string };
}

export default function Adheader({}: HeaderProps) {
  const { data, loading } = useQuery(GET_ADMIN);
  const [search, setSearch] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/products?query=${encodeURIComponent(search)}`);
    }
  };

  return (
    <header className="flex justify-between items-center bg-gray-900 text-white p-4 shadow-lg">
      <Link href="/" className="text-2xl font-bold">
        RKC Jewelry
      </Link>
      
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="flex items-center">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-3 py-1 rounded-l-md text-black bg-white"
        />
        <button type="submit" className="bg-blue-600 px-6 py-1 rounded-r-md hover:bg-blue-700">
          Search
        </button>
      </form>
      
      {/* Login/Signup or User Info */}
      <div>
        {loading ? (
          <span>Loading...</span>
        ) : data?.getadmin ? (
          <span className="text-lg">Welcome, {data.getadmin.username}!</span>
        ) : (
          <div className="space-x-4">
            <Link href="/auth/adminlogin" className="hover:text-gray-400">
              Login
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
