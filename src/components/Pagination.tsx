/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useQuery } from "@apollo/client";
import { GET_PAGINATION } from "../graphql/queries";
import { useState } from "react";

const PRODUCTS_PER_PAGE = 8;

export default function ProductsPage() {
  const [page, setPage] = useState(1);
  const offset = (page - 1) * PRODUCTS_PER_PAGE;

  const { data, loading, error } = useQuery(GET_PAGINATION, {
    variables: { limit: PRODUCTS_PER_PAGE, offset },
    fetchPolicy: "cache-and-network",
  });

  const products = data?.allProducts?.products || [];
  const total = data?.allProducts?.total || 0;
  const totalPages = Math.ceil(total / PRODUCTS_PER_PAGE);

  if (loading && !data) return <p>Loading products...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">All Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-6">
        {products.map((product: any) => (
          <div key={product.id} className="border p-4 rounded-lg shadow hover:shadow-lg transition">
            <p className="font-semibold">{product.name}</p>
            <p className="text-gray-600">₹{product.price}</p>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center items-center gap-4">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Prev
        </button>
        <span className="font-semibold">Page {page} of {totalPages}</span>
        <button
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
