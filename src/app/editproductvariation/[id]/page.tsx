/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/seller/products/edit/[id]/page.tsx
'use client';

import { useQuery, useMutation } from "@apollo/client";
import { GET_CURRENTSELLER_PRODUCTS } from "../../../graphql/queries";
import { UPDATE_PRODUCT_DETAILS } from "../../../graphql/mutations";
import { useRouter } from "next/navigation";
import { FormEvent, useState, use } from "react";
import AnotherHeader from "../../../components/anotherheader";
import Footer from "../../../components/Footer";
import LoadingPage from "../../../components/LoadingPage";

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id }  = use(params);
  const router = useRouter();
  const [formState, setFormState] = useState({
    name: "",
    description: "",
    price: 0,
    size: "",
    weight: "",
    material: "",
  });

  // Fetch product data
  const { loading: queryLoading, error: queryError } = useQuery(GET_CURRENTSELLER_PRODUCTS, {
    onCompleted: (data) => {
      const product = data?.myProducts?.find((p: any) => p.id === id);
      if (product) {
        setFormState({
          name: product.name,
          description: product.description || "",
          price: product.price || "",
          size: product.size || "",
          weight: product.weight || "",
          material: product.material || "",
        });
      }
    },
  });
  

  // Update product mutation
  const [updateProduct, { loading: mutationLoading, error: mutationError }] = 
    useMutation(UPDATE_PRODUCT_DETAILS, {
      onCompleted: () => {
        router.push("/dashboard");
        // Optional: Add toast notification here
      },
    });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    await updateProduct({
      variables: {
        updateProductsId: id,
        input: {
          name: formState.name,
          description: formState.description,
          price: formState.price,
          size: formState.size,
          weight: formState.weight,
          material: formState.material,
        },
      },
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({
      ...prev,
      [name]: name === "price" ? parseFloat(value) || 0 : value,
    }));
  };

  if (queryLoading) return <LoadingPage/>
  if (queryError) return <div className="p-4 text-red-500">Error loading product: {queryError.message}</div>;

  return (
    <>
    <AnotherHeader/>
    <div className="h-px w-5/6 mx-auto bg-gray-400 my-6"/>
    <div className="max-w-4xl mx-auto mt-5 p-8 bg-white rounded-lg">
      <h1 className="text-3xl font-bold mb-8">Edit Product</h1>
      
      {mutationError && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          Error updating product: {mutationError.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label className="block font-semibold mb-1">Product Name</label>
            <input
              type="text"
              name="name"
              value={formState.name}
              onChange={handleChange}
              className="w-full p-3 border border-gray-400 rounded-2xl focus:border-gray-600 hover:border-gray-800 outline-none transition-colors"
              required
            />
          </div>
         
         <div>
          <h2 className="text-xl font-semibold mb-2">Item specifics</h2>
              <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 font-medium">Price ($)</label>
                <input
                  type="number"
                  name="price"
                  value={formState.price}
                  onChange={handleChange}
                  step="0.01"
                  className="w-full p-3 border border-gray-400 rounded-2xl focus:border-gray-600 hover:border-gray-800 outline-none transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">Size</label>
                <input
                  type="text"
                  name="size"
                  value={formState.size}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-400 rounded-2xl focus:border-gray-600 hover:border-gray-800 outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">Weight</label>
                <input
                  type="text"
                  name="weight"
                  value={formState.weight}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-400 rounded-2xl focus:border-gray-600 hover:border-gray-800 outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">Material</label>
                <input
                  type="text"
                  name="material"
                  value={formState.material}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-400 rounded-2xl focus:border-gray-600 hover:border-gray-800 outline-none transition-colors"
                />
              </div>
          </div>
          </div>

          <div className="md:col-span-2">
            <label className="text-xl font-semibold mb-2">Description</label>
            <textarea
              name="description"
              value={formState.description}
              onChange={handleChange}
              rows={4}
              className="w-full p-3 border border-gray-400 rounded-2xl focus:border-gray-600 hover:border-gray-800 outline-none transition-colors"
            />
          </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={() => router.push("/dashboard")}
            className="mt-2 bg-blue-400 text-white px-4 py-2 rounded-xl font-semibold transition disabled:bg-gray-400"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={mutationLoading}
            className="mt-2 bg-green-600 text-white px-4 py-2 rounded-xl font-semibold hover:bg-green-700 transition disabled:bg-gray-400"
          >
            {mutationLoading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
    <Footer/>
  </>
  );
}