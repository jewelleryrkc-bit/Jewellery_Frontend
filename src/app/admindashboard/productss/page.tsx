/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useQuery } from "@apollo/client";
import { useState } from "react";
import { GET_COMPANIES } from "@/graphql/queries";

const SellerDashboard = () => {
  const { data, loading, error } = useQuery(GET_COMPANIES);
  const [selectedSellerId, setSelectedSellerId] = useState<string | null>(null);

  if (loading) return <p>Loading sellers...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const sellers = data.getCompanies;
  const selectedSeller = sellers.find((s: any) => s.id === selectedSellerId);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Sellers</h1>

      <ul className="mb-6 space-y-2">
        {sellers.map((seller: any) => (
          <li
            key={seller.id}
            className={`cursor-pointer text-blue-600 hover:underline ${
              selectedSellerId === seller.id ? "font-bold" : ""
            }`}
            onClick={() => setSelectedSellerId(seller.id)}
          >
            {seller.username} ({seller.cname})
          </li>
        ))}
      </ul>

      {selectedSeller && (
        <div>
          <h2 className="text-xl font-semibold mb-2">
            Products by {selectedSeller.username}
          </h2>

          {selectedSeller.products.length === 0 ? (
            <p className="text-gray-500">No products available.</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {selectedSeller.products.map((product: any) => (
                <div key={product.id} className="border p-4 rounded shadow">
                  <h3 className="text-lg font-semibold">{product.name}</h3>
                  <p className="text-gray-600">Price: ₹{product.price}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SellerDashboard;
