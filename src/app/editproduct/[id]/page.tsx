/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useQuery, useMutation } from "@apollo/client";
import {
  GET_CURRENTSELLER_PRODUCTS,
  GET_PRODUCT_BY_ID,
} from "../../../graphql/queries";
import {
  UPDATE_PRODUCT_DETAILS,
  UPDATE_PRODUCTVAR_DETAILS,
  DELETE_PRODUCT,
  UPDATE_PRODUCT_IMAGE,
  DELETE_PRODUCT_IMAGE,
  ADD_PRODUCT_IMAGES,
  SET_PRIMARY_PRODUCT_IMAGE,
  MOVE_PRODUCT_IMAGE,
} from "../../../graphql/mutations";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import AnotherHeader from "../../../components/anotherheader";
import Footer from "../../../components/Footer";
import LoadingPage from "../../../components/LoadingPage";
import React from "react";
import Image from "next/image";
import { useApolloClient } from "@apollo/client";

export default function EditProductPage({
  params,
}: {
  params: { id: string } | Promise<{ id: string }>;
}) {
  // ----- route param -----
  const resolvedParams = React.use(params as Promise<{ id: string }>);
  const { id } = resolvedParams as { id: string };

  const router = useRouter();

  const [activeTab, setActiveTab] = useState<
    "details" | "variations" | "images"
  >("details");

  const client = useApolloClient();

  // ----- base product state -----
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
  const [isSavingAll, setIsSavingAll] = useState(false);

  // ----- main products query -----
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

  // ----- images-specific query (optional, for fresh images) -----
  const {
    data: imageData,
    loading: imagesLoading,
    error: imagesError,
    refetch: refetchImages,
  } = useQuery(GET_PRODUCT_BY_ID, {
    variables: { productId: id },
    skip: !id,
    fetchPolicy: "network-only",
    nextFetchPolicy: "network-only",
  });

  
  // const productForImages = imageData?.product ?? product;
// Prefer fresh product from GET_PRODUCT_BY_ID, fallback to list query
const productFromList = product;
const productFromById = imageData?.product;
const productForImages = productFromById ?? productFromList;

 const sortedImages =
    productForImages?.images
      ? [...productForImages.images].sort(
          (a: any, b: any) => (a.position ?? 0) - (b.position ?? 0)
        )
      : [];

  //   console.log(
  //   "render images:",
  //   productForImages ? productForImages.images : "no productForImages yet"
  // );

  // ----- mutations -----
  const [
    updateVariation,
    { loading: variationUpdating, error: variationUpdateError },
  ] = useMutation(UPDATE_PRODUCTVAR_DETAILS, {
    refetchQueries: [{ query: GET_CURRENTSELLER_PRODUCTS }],
  });

  const [updateProduct, { loading: mutationLoading, error: mutationError }] =
    useMutation(UPDATE_PRODUCT_DETAILS, {
      onCompleted: () => router.push("/dashboard"),
    });

  const [deleteProduct] = useMutation(DELETE_PRODUCT, {
    onCompleted: () => router.push("/dashboard"),
  });

  const [updateProductImage, { loading: updating }] = useMutation(
    UPDATE_PRODUCT_IMAGE,
    {
      onError: (err) => {
        console.error("UPDATE_PRODUCT_IMAGE error:", err);
      },
    }
  );

  const [deleteProductImage, { loading: deleting }] = useMutation(
    DELETE_PRODUCT_IMAGE,
    {
      onError: (err) => {
        console.error("DELETE_PRODUCT_IMAGE error:", err);
      },
    }
  );

  const [addProductImages, { loading: adding }] = useMutation(
    ADD_PRODUCT_IMAGES,
    {
      onError: (err) => {
        console.error("ADD_PRODUCT_IMAGES error:", err);
      },
    }
  );

   const [setPrimaryImage, { loading: settingPrimary }] = useMutation(
    SET_PRIMARY_PRODUCT_IMAGE,
    {
      onCompleted: () => refetchImages({ productId: id }),
    }
  );

  const [moveImage, { loading: movingImage }] = useMutation(
    MOVE_PRODUCT_IMAGE,
    {
      onCompleted: () => refetchImages({ productId: id }),
    }
  );

  const busy = updating || deleting || adding;

  // ----- variations helpers -----
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

  // ----- details helpers -----
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

  // ----- images helpers -----
  const handleReplaceImage = async (imageId: number, file: File) => {
    const formData = new FormData();
    formData.append("images", file);

    const res = await fetch("http://localhost:4000/upload/images", {
      method: "POST",
      body: formData,
    });
    const body = await res.json();
    const uploaded = body.images?.[0];
    if (!uploaded?.url) return;

    await updateProductImage({
      variables: { imageId, newUrl: uploaded.url },
    });
    await refetchImages({ productId: id });
  };

  const handleDeleteImage = async (imageKey: string) => {
    if (!productForImages) return;

    await deleteProductImage({
      variables: { productId: productForImages.id, imageKey },
    });
    await refetchImages({ productId: id });
  };

  const handleAddImages = async (files: FileList) => {
    const arr = Array.from(files);
    if (!arr.length) return;

    const formData = new FormData();
    arr.forEach((f) => formData.append("images", f));

    const res = await fetch("http://localhost:4000/upload/images", {
      method: "POST",
      body: formData,
    });
    const body = await res.json();
    const urls: string[] = (body.images || []).map((x: any) => x.url);
    if (!urls.length || !productForImages) return;

    console.log("addProductImages vars before", {
      productId: productForImages.id,
      imageUrls: urls,
    });
    await addProductImages({
      variables: { productId: productForImages.id, imageUrls: urls },
    });

    console.log("addProductImages vars after", {
      productId: productForImages.id,
      imageUrls: urls,
    });

    try {
      await refetchImages({ productId: id });
    } catch (e) {
      console.error("refetchImages error:", e);
    }

    client.cache.evict({ fieldName: "getProductImages" });
    client.cache.gc();
    // client.clearStore(); // 👈 add this

    await refetchImages({ productId: id });
  };

  // ----- loading / error -----
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

        {/* Tabs */}
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

          <button
            className={`px-4 py-2 font-medium ${
              activeTab === "images"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("images")}
          >
            Images
          </button>
        </div>

        {/* Tab content */}
        {activeTab === "details" && (
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
                    await deleteProduct({
                      variables: { deleteProductId: id },
                    });
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
        )}

        {activeTab === "variations" && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Product Variations</h2>

            <form onSubmit={handleUpdateAllVariations}>
              {variations?.length > 0 ? (
                <div className="space-y-4">
                  {variations.map((variation: any, index: number) => (
                    <div
                      key={variation.id ?? index}
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

        {activeTab === "images" && (
          <div className="space-y-6">
            {imagesLoading && <p>Loading images...</p>}
            {imagesError && (
              <p className="text-red-600 text-sm">
                Failed to load product images: {imagesError.message}
              </p>
            )}
            {!imagesLoading && !imagesError && productForImages && (
              <>
                <h2 className="text-xl font-semibold mb-2">
                  Edit Images – {productForImages.name}
                </h2>
                <p className="text-sm text-gray-500 mb-4">
                  Replace, remove or add product images.
                </p>

                {/* Existing images */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
                  <h3 className="text-lg font-medium mb-3">Current images</h3>
                  <div className="flex flex-wrap gap-4">
                    {productForImages.images?.length ? (
                      productForImages.images.map((img: any) => (
                        <div
                          key={img.id}
                          className="flex flex-col items-center gap-2 w-28"
                        >
                          <div className="w-24 h-24 bg-gray-100 rounded-md overflow-hidden relative">
                           <Image
 src={`${img.url}`}
  alt={productForImages.name}
  fill
  sizes="96px"
  className="object-cover"
/>

                          </div>
                          <label className="text-xs text-blue-600 cursor-pointer">
                            Change
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                void handleReplaceImage(img.id, file);
                              }}
                            />
                          </label>
                          <button
                            type="button"
                            className="text-xs text-red-600"
                            onClick={() => void handleDeleteImage(img.key)}
                          >
                            Delete
                          </button>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500">
                        No images yet for this product.
                      </p>
                    )}
                  </div>
                </div>

                {/* Add new images */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                  <h3 className="text-lg font-medium mb-3">Add images</h3>
                  <label className="block border-2 border-dashed border-gray-300 rounded-md p-4 text-center text-sm text-gray-600 cursor-pointer">
                    <span>Select or drop images here</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                        e.target.files && handleAddImages(e.target.files)
                      }
                    />
                  </label>
                </div>

                {busy && (
                  <p className="mt-4 text-xs text-gray-500">
                    Saving image changes, please wait...
                  </p>
                )}
              </>
            )}
          </div>
        )}
      </div>

      <Footer />
    </>
  );
}
