/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useQuery, useMutation } from "@apollo/client";
import { GET_CURRENTSELLER_PRODUCTS } from "../../../graphql/queries";
import {
  UPDATE_PRODUCT_DETAILS,
  UPDATE_PRODUCTVAR_DETAILS,
  DELETE_PRODUCT,
} from "../../../graphql/mutations";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import AnotherHeader from "../../../components/anotherheader";
import Footer from "../../../components/Footer";
import LoadingPage from "../../../components/LoadingPage";
import React from "react";

export default function EditProductPage({
  params,
}: {
  params: { id: string } | Promise<{ id: string }>;
}) {
  const resolvedParams = React.use(params as Promise<{ id: string }>);
   const { id } = resolvedParams as { id: string };
  const [activeTab, setActiveTab] = useState("details");
  const router = useRouter();

  const [updatingVariationId, setUpdatingVariationId] = useState<string | null>(
    null
  );
  const [isSavingAll, setIsSavingAll] = useState(false);

  const [formState, setFormState] = useState({
    name: "",
    description: "",
    price: 0,
    stock: 0,
    size: "",
    weight: "",
    material: "",
  });

  const [variations, setVariations] = useState<any[]>([]);

  const {
    data,
    loading: queryLoading,
    error: queryError,
  } = useQuery(GET_CURRENTSELLER_PRODUCTS);

  const product = data?.myProducts?.find((p: any) => p.id === id);

  useEffect(() => {
    if (product) {
      setFormState({
        name: product.name,
        description: product.description || "",
        price: product.price || 0,
        size: product.size || "",
        weight: product.weight || "",
        material: product.material || "",
        stock: product.stock || 0,
      });

      if (product.variations) {
        setVariations([...product.variations]);
      }
    }
  }, [product]);

  const [
    updateVariation,
    { loading: variationUpdating, error: variationUpdateError },
  ] = useMutation(UPDATE_PRODUCTVAR_DETAILS, {
    refetchQueries: [{ query: GET_CURRENTSELLER_PRODUCTS }],
  });

  const addVariation = () => {
    setVariations([...variations, { size: "", color: "", price: 0, stock: 0 }]);
  };

  const removeVariation = (index: number) => {
    setVariations(variations.filter((_, i) => i !== index));
  };

  const handleUpdateAllVariations = async (e: FormEvent) => {
    e.preventDefault();
    setIsSavingAll(true);

    try {
      const updatePromises = variations.map((variation, index) => {
        const form = e.currentTarget as HTMLFormElement;
        const size =
          (form.elements.namedItem(`size-${index}`) as HTMLInputElement)
            ?.value || "";
        const color =
          (form.elements.namedItem(`color-${index}`) as HTMLInputElement)
            ?.value || "";
        const price =
          parseFloat(
            (form.elements.namedItem(`price-${index}`) as HTMLInputElement)
              ?.value || "0"
          ) || 0;
        const stock =
          parseFloat(
            (form.elements.namedItem(`stock-${index}`) as HTMLInputElement)
              ?.value || "0"
          ) || 0;

        return updateVariation({
          variables: {
            updateProductVarId: variation.id,
            input: {
              size,
              color,
              price,
              stock,
            },
          },
        });
      });

      await Promise.all(updatePromises);
    } catch (error) {
      console.error("Error updating variations:", error);
    } finally {
      setIsSavingAll(false);
    }
  };

  const [updateProduct, { loading: mutationLoading, error: mutationError }] =
    useMutation(UPDATE_PRODUCT_DETAILS, {
      onCompleted: () => router.push("/dashboard"),
    });

  const [deleteProduct] = useMutation(DELETE_PRODUCT, {
    onCompleted: () => router.push("/dashboard"),
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
          stock: formState.stock,
          size: formState.size,
          weight: formState.weight,
          material: formState.material,
        },
      },
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormState((prev) => ({
      ...prev,
      [name]:
        name === "price" || name === "stock" ? parseFloat(value) || 0 : value,
    }));
  };

  if (queryLoading) return <LoadingPage />;
  if (queryError)
    return (
      <div className="p-4 text-red-500">
        Error loading product: {queryError.message}
      </div>
    );

  return (
    <>
      <AnotherHeader />
      <div className="h-px w-5/6 mx-auto bg-gray-400 my-6" />

      <div className="max-w-4xl mx-auto mt-5 p-8 bg-white rounded-lg">
        <h1 className="text-3xl font-bold mb-8">Edit Product</h1>

        <div className="flex border-b mb-6">
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === "details"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("details")}
          >
            Product Details
          </button>
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === "variations"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("variations")}
          >
            Variations {variations?.length > 0 && `(${variations.length})`}
          </button>
        </div>

        {activeTab === "details" ? (
          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <label className="block font-semibold mb-1">Product Name</label>
              <input
                type="text"
                name="name"
                value={formState.name}
                onChange={handleChange}
                className="w-full p-3 border border-gray-400 rounded-2xl"
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
                    className="w-full p-3 border border-gray-400 rounded-2xl"
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
                    className="w-full p-3 border border-gray-400 rounded-2xl"
                  />
                </div>

                <div>
                  <label className="block mb-1 font-medium">Weight</label>
                  <input
                    type="text"
                    name="weight"
                    value={formState.weight}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-400 rounded-2xl"
                  />
                </div>

                <div>
                  <label className="block mb-1 font-medium">Material</label>
                  <input
                    type="text"
                    name="material"
                    value={formState.material}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-400 rounded-2xl"
                  />
                </div>

                <div>
                  <label className="block mb-1 font-medium">Stock</label>
                  <input
                    type="number"
                    name="stock"
                    value={formState.stock}
                    onChange={handleChange}
                    step="1"
                    className="w-full p-3 border border-gray-400 rounded-2xl"
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="text-xl font-semibold mb-2">Description</label>
              <textarea
                name="description"
                value={formState.description}
                onChange={handleChange}
                rows={4}
                className="w-full p-3 border border-gray-400 rounded-2xl"
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => router.push("/dashboard")}
                className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={mutationLoading}
                className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700"
              >
                {mutationLoading ? "Saving..." : "Save Changes"}
              </button>
              <button
                type="button"
                onClick={async () => {
                  try {
                    await deleteProduct({ variables: { deleteProductId: id } });
                  } catch (err) {
                    console.error("Delete failed:", err);
                  }
                }}
                className="bg-red-600 text-white px-4 py-2 rounded-xl hover:bg-red-700"
              >
                Delete Product
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Product Variations</h2>

            <form onSubmit={handleUpdateAllVariations}>
              {variations?.length > 0 ? (
                <div className="space-y-4">
                  {variations.map((variation: any, index: number) => (
                    <div
                      key={variation.id}
                      className="p-4 border rounded-lg grid grid-cols-3 gap-4"
                    >
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Size
                        </label>
                        <input
                          type="text"
                          name={`size-${index}`}
                          defaultValue={variation.size || ""}
                          className="w-full p-3 border border-gray-400 rounded-2xl"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Color
                        </label>
                        <input
                          type="text"
                          name={`color-${index}`}
                          defaultValue={variation.color || ""}
                          className="w-full p-3 border border-gray-400 rounded-2xl"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Price
                        </label>
                        <input
                          type="number"
                          name={`price-${index}`}
                          defaultValue={variation.price || 0}
                          className="w-full p-3 border border-gray-400 rounded-2xl"
                          step="0.01"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Stock
                        </label>
                        <input
                          type="number"
                          name={`stock-${index}`}
                          defaultValue={variation.stock || 0}
                          className="w-full p-3 border border-gray-400 rounded-2xl"
                          step="1"
                        />
                      </div>
                      <div className="col-span-3">
                        <button
                          type="button"
                          onClick={() => removeVariation(index)}
                          className="text-red-500 font-bold"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addVariation}
                    className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-xl hover:bg-blue-600"
                  >
                    Add Variation
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <p className="text-gray-500 mb-4">No variations available.</p>
                  <button
                    type="button"
                    onClick={addVariation}
                    className="bg-blue-500 text-white px-4 py-2 rounded-xl hover:bg-blue-600"
                  >
                    Add First Variation
                  </button>
                </div>
              )}

              {variations?.length > 0 && (
                <div className="flex justify-end mt-6">
                  <button
                    type="submit"
                    disabled={isSavingAll}
                    className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700"
                  >
                    {isSavingAll ? "Saving All Changes..." : "Save All Changes"}
                  </button>
                </div>
              )}
            </form>

            {variationUpdateError && (
              <div className="text-red-500 text-sm mt-2">
                Error updating variations: {variationUpdateError.message}
              </div>
            )}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
