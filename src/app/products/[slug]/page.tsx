/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useQuery, useMutation } from "@apollo/client";
import { useParams } from "next/navigation";
import {
  GET_PARENT_CATEGORIES,
  GET_COMPANIES,
  GET_PRODUCT_BY_SLUG,
  GET_SIMILAR_PRODUCTS,
  PRODUCT_REVIEWS_QUERY,
  GET_USER_RATING,
  GET_WISHLISTS,
} from "../../../graphql/queries";
import { ADD_TO_CART, ADD_TO_WISHLIST, CREATE_REVIEW } from "../../../graphql/mutations";
import Head from "next/head";
import Link from "next/link";
import { useCurrency } from "../../../providers/CurrencyContext";
import { convertPrice } from "../../../lib/currencyConverter";
import { formatCurrency } from "../../../lib/formatCurrency";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { StarIcon } from "@heroicons/react/24/solid";
import {
  HeartIcon,
  ArrowPathIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";
import LoadingPage from "@/components/LoadingPage";
import ReportProductForm from '../../reports/ReportProducrForm/page';
import useSWR from "swr";
import SEO from "@/components/SEO";

export default function ProductPage() {
  const { currency } = useCurrency();
  const params = useParams();
  const [selectedVariation, setSelectedVariation] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const { data: wishlistData } = useQuery(GET_WISHLISTS);
  const wishlistItems = wishlistData?.getWishlist?.items || [];
  const [addtoWishlist] = useMutation(ADD_TO_WISHLIST);
  const [showReportForm, setShowReportForm] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const MAX_LENGTH = 200;
  const toggleReadMore = () => setExpanded(!expanded);

  const slug =
    typeof params?.slug === "string"
      ? params.slug
      : Array.isArray(params?.slug)
      ? params?.slug[0]
      : undefined;

  const { data, loading, error } = useQuery(GET_PRODUCT_BY_SLUG, {
    variables: { slug },
    skip: !slug,
  });

  const { data: reviewData, loading: reviewLoading, error: reviewError } = useQuery(PRODUCT_REVIEWS_QUERY, {
    variables: {
      slug,
      limit: 5,
      offset: 0,
    },
  });

  const isInWishlist = (productId: string) => {
    return wishlistItems.some((item: any) => item.product.id === productId);
  };

  const {
      data: companyData
    } = useQuery(GET_COMPANIES);
  
    const companies = companyData?.getCompanies;

  const wishlist = async (productId: string) => {
    try {
      await addtoWishlist({
        variables: {
          productId,
        },
      });
      toast.success("Added to wishlist");
    } catch (err) {
      toast.error("Failed to add to wishlist");
      console.log(err);
    }
  };

  const [addToCart] = useMutation(ADD_TO_CART);
  const { data: getCategories } = useSWR(GET_PARENT_CATEGORIES);
  const [createReview] = useMutation(CREATE_REVIEW, {
    refetchQueries: [{ query: GET_PRODUCT_BY_SLUG, variables: { slug } }],
  });

  // const catslug = getCategories?.parentCategories; 
  const categories = getCategories?.parentCategories || [];
// Find the category that matches the product's category
 const productCategory = categories.find((cat: { id: any; }) => cat.id === product?.category?.id);


  const [reviewInput, setReviewInput] = useState({
    rating: 5,
    comment: "",
    sentiment: "POSITIVE",
  });

  const product = data?.productBySlug;
  const categorySlug = productCategory?.slug || product?.category?.name?.toLowerCase().replace(/\s+/g, '-');
  
  const shouldTruncate = product?.description?.length > MAX_LENGTH;
  const proddes = expanded
    ? product?.description
    : product?.description?.slice(0, MAX_LENGTH);

  const { data: similarData, loading: similarLoading, error: similarError } =
    useQuery(GET_SIMILAR_PRODUCTS, {
      variables: { category: product?.category?.name, productId: product?.id },
      skip: !product?.category?.name || !product?.id,
      fetchPolicy: "network-only",
    });

  const { data: userreviewdata } = useSWR(GET_USER_RATING);
  const userRating = userreviewdata?.userReviews.rating;  

  if (loading)
    return (
      <LoadingPage/>
    );

  if (error)
    return (
      <div className="bg-red-100 text-red-800 p-4 rounded-md">
      <h2 className="font-bold text-lg">Error loading products</h2>
      {error.graphQLErrors?.map((err, i) => (
        <p key={i}>GraphQL: {err.message}</p>
      ))}
      {error.networkError && <p>Network: {error.networkError.message}</p>}
    </div>
    );

  if (!product)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-gray-50 border border-gray-200 text-gray-700 px-6 py-4 rounded-lg max-w-md text-center">
          <h3 className="font-bold text-lg mb-2">Product Not Found</h3>
          <p>
            The product you're looking for doesn't exist or may have been
            removed.
          </p>
          <Link
            href="/"
            className="mt-4 inline-block text-blue-600 hover:text-blue-800"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );

  const handleAddToCart = async () => {
    try {
      toast.dismiss();
      await addToCart({
        variables: {
          productId: product.id,
          variationId: selectedVariation?.id || null,
          quantity,
        },
      });

      const toastMessage = selectedVariation
        ? `${selectedVariation.size} ${selectedVariation.color} added to cart!`
        : `Default product added to cart!`;

      toast.success(toastMessage);
    } catch (err) {
      toast.error("Failed to add item to cart.");
    }
  };

  const handleCreateReview = async () => {
    try {
      await createReview({
        variables: {
          input: {
            productId: product.id,
            rating: reviewInput.rating,
            comment: reviewInput.comment,
            sentiment: reviewInput.sentiment,
          },
        },
      });
      toast.success("Review submitted!");
      setReviewInput({ rating: 5, comment: "", sentiment: "POSITIVE" });
    } catch (err) {
      toast.error("Failed to submit review");
      console.error(err);
    }
  };

  const handleQuantityChange = (action: "increase" | "decrease") => {
    const maxQuantity = selectedVariation?.stock ?? product.stock;
    setQuantity((prevQuantity) => {
      if (action === "increase") {
        if (prevQuantity >= maxQuantity) {
          toast.error(`Only ${maxQuantity} items available in stock`);
          return prevQuantity;
        }
        return prevQuantity + 1;
      } else {
        return prevQuantity > 1 ? prevQuantity - 1 : prevQuantity;
      }
    });
  };

  const displayedPrice = selectedVariation?.price ?? product.price;

  const productImages = [
    { id: 1, src: "https://via.placeholder.com/800x800?text=Product+Main" },
    { id: 2, src: "https://via.placeholder.com/800x800?text=Product+Angle" },
    { id: 3, src: "https://via.placeholder.com/800x800?text=Product+Detail" },
    { id: 4, src: "https://via.placeholder.com/800x800?text=Product+In+Use" },
  ];

  return (
    <>
      <SEO 
      product={{
        id: product.id,
        name: product.name,
        slug: product.slug,
        description: product.description,
        imageUrl: productImages[0]?.src,
        price: displayedPrice,
        averageRating: product.averageRating,
        reviewCount: product.reviewCount,
        material: product.material,
        category: product.category,
        company: product.company,
        stock: product.stock
      }}
      url={`/products/${params.slug}`}
    />
      <Head>
        <title>{product.name} | Your Store</title>
        <meta name="description" content={product.description} />
      </Head>

      <Toaster position="top-center" />

      <main className="bg-gray-50 min-h-screen">
        {/* Breadcrumb */}
        <nav className="bg-white py-3 border-b">
          <div className="container mx-auto px-4">
            <ol className="flex items-center space-x-2 text-sm">
              <li>
                <Link href="/" className="text-blue-600 hover:underline">Home</Link>
              </li>
              <li>
                <span className="text-gray-400">/</span>
              </li>
              <li>
                <Link href={`/category/${categorySlug}`} className="text-blue-600 hover:underline">
                  {product.category?.name || "Category"}
                </Link>
              </li>
              <li>
                <span className="text-gray-400">/</span>
              </li>
              <li className="text-gray-600 font-medium truncate max-w-xs">{product.name}</li>
            </ol>
          </div>
        </nav>

        {/* Product Section */}
        <section className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
              {/* Product Images */}
              <div className="space-y-4">
                <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
                  <img 
                    src={productImages[selectedImage].src} 
                    alt={product.name}
                    className="w-full h-full object-contain"
                  />
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      wishlist(product.id);
                    }}
                    className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/90 hover:bg-white transition-all shadow-sm"
                    aria-label={isInWishlist(product.id) ? "Remove from wishlist" : "Add to wishlist"}
                  >
                    <HeartIcon
                      className={`h-4 w-4 ${
                        isInWishlist(product.id)
                          ? 'text-red-500 fill-red-500 hover:text-red-600'
                          : 'text-gray-400 hover:text-red-500'
                      } transition-colors`}
                    />
                  </button>
                </div>
                <div className="grid grid-cols-4 gap-3">
                  {productImages.map((image, index) => (
                    <button
                      key={image.id}
                      onClick={() => setSelectedImage(index)}
                      className={`aspect-square bg-gray-100 rounded-md overflow-hidden border-2 ${selectedImage === index ? 'border-blue-500' : 'border-transparent'}`}
                    >
                      <img 
                        src={image.src} 
                        alt={`Product view ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Product Info */}
              <div className="py-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h1 className="text-xl md:text-2xl font-medium text-gray-900">{product.name}</h1>
                      <>
                        <Link 
                          href={`/seller/${product.company.id}`} 
                          className="text-md md:text-md font-medium text-gray-600"
                        >
                          by {product.company.cname.charAt(0).toUpperCase() + product.company.cname.slice(1)}
                        </Link>
                      </>  
                    <div className="flex items-center mt-2">
                    <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                                  <StarIcon
                                    key={star}
                                    className={`h-5 w-5 ${star <= Math.round(product.averageRating || 0) ? 'text-yellow-400' : 'text-gray-300'}`}
                                  />
                                ))}
                        </div>
                      <span className="ml-2 text-sm text-gray-500">
                        {product.averageRating} rating
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-green-600 mt-1">{product.stock + " left in stock" || "out of stock"}</p>
                  </div>
                </div>

                <div className="mt-6">
                  <p className="text-2xl font-medium text-gray-900">
                      {formatCurrency(
                        convertPrice(
                          product.discountedPrice ?? product.price,
                          currency
                        ), 
                        currency
                      )}
                      {product.discountedPrice && product.discountedPrice !== product.price && (
                        <span className="ml-2 text-lg text-gray-500 line-through">
                          {formatCurrency(convertPrice(product.price, currency), currency)}
                        </span>
                      )}
                    </p>
                  {product.originalPrice && (
                    <span className="inline-block bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded-md mt-1">
                      Save {Math.round((1 - displayedPrice / product.originalPrice) * 100)}%
                    </span>
                  )}
                </div>

                {/* Only show variations section if product has variations */}
                  {product.variations && product.variations.length > 0 && (
                    <div className="mt-6">
                      <h3 className="text-sm font-medium text-gray-900">Options</h3>
                      <div className="mt-4 space-y-4">
                        {product.variations.map((variation: any) => (
                          <div
                            key={variation.id}
                            onClick={() => {
                              if (selectedVariation?.id === variation.id) {
                                setSelectedVariation(null);
                              } else {
                                setSelectedVariation(variation);
                              }
                            }}
                            className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                              selectedVariation?.id === variation.id
                                ? "border-blue-500 bg-blue-50"
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                          >
                            <div className="flex justify-between">
                              <div>
                                <p className="font-medium">
                                  {variation.color}  {variation.size}
                                </p>
                                <p className="text-sm text-gray-500 mt-1">
                                  {formatCurrency(convertPrice(variation.price, currency), currency)}
                                </p>
                              </div>
                              {selectedVariation?.id === variation.id && (
                                <div className="h-5 w-5 rounded-full bg-blue-500 flex items-center justify-center">
                                  <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                <div className="mt-8">
                  <div className="flex items-center">
                    <p className="text-sm font-medium text-gray-900 mr-4">Quantity:</p>
                    <div className="flex items-center border border-gray-300 rounded-md">
                      <button
                        onClick={() => handleQuantityChange("decrease")}
                        className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                      >
                        -
                      </button>
                      <span className="px-4 py-1 border-x border-gray-300">{quantity}</span>
                      <button
                        onClick={() => handleQuantityChange("increase")}
                        className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  {/* Improved Action Buttons for Mobile */}
                  <div className="mt-8 flex flex-col sm:flex-row gap-4">
                    {/* Add to Cart Button */}
                    <button
                      onClick={handleAddToCart}
                      className="flex items-center justify-center bg-rose-500 text-white px-6 py-4 rounded-full hover:bg-rose-600 transition-all duration-300 shadow-md hover:shadow-lg font-medium w-full sm:w-auto"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                      </svg>
                      Add to Cart
                    </button>

                    {/* Wishlist Button */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        if (isInWishlist(product.id)) {
                          toast.error("This product is already in your wishlist");
                        } else {
                          wishlist(product.id);
                        }
                      }}
                      className={`flex items-center justify-center px-6 py-4 rounded-full transition-all duration-300 shadow-md font-medium w-full sm:w-auto
                        ${isInWishlist(product.id) 
                          ? 'bg-gray-400 text-white cursor-not-allowed' 
                          : 'bg-amber-600 text-white hover:bg-amber-700 hover:shadow-lg'}`}
                      disabled={isInWishlist(product.id)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                      </svg>
                      {isInWishlist(product.id) ? 'In Wishlist' : 'Save to Wishlist'}
                    </button>
                  </div>
                </div>

                <div className="mt-8 border-t border-gray-200 pt-6">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <ArrowPathIcon className="h-6 w-6 text-gray-400 mx-auto" />
                      <p className="mt-2 text-xs text-gray-500">30-Day Returns</p>
                    </div>
                    <div className="text-center">
                      <ShieldCheckIcon className="h-6 w-6 text-gray-400 mx-auto" />
                      <p className="mt-2 text-xs text-gray-500">2-Year Warranty</p>
                    </div>
                    <div className="text-center">
                      <svg className="h-6 w-6 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                      <p className="mt-2 text-xs text-gray-500">Secure Payment</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
            
          <div className="mt-8 bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6">
            <h3 className="text-xl font-bold text-gray-900">Description</h3>
            <div className="mt-2 text-md leading-relaxed text-gray-800">
              <p className="whitespace-pre-line">
                {proddes}
                {shouldTruncate && !expanded && "..."}
              </p>
              {shouldTruncate && (
                <button
                  onClick={toggleReadMore}
                  className="mt-1 text-blue-600 hover:underline focus:outline-none font-medium"
                >
                  {expanded ? "Read less" : "Read more"}
                </button>
              )}
            </div>
          </div>
          </div>

          {/* Product Details Section - Improved Responsiveness */}
          <div className="mt-8 bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 md:p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Product Specifications</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                {/* Left Column */}
                <div className="space-y-6">
                  {/* Basic Info */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-3 pb-2 border-b">Basic Information</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Brand</p>
                        <p className="text-sm font-medium text-gray-900">{product.brand || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Material</p>
                        <p className="text-sm font-medium text-gray-900">{product.material}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Size</p>
                        <p className="text-sm font-medium text-gray-900">{product.size}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Weight</p>
                        <p className="text-sm font-medium text-gray-900">{product.weight}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Color</p>
                        <p className="text-sm font-medium text-gray-900">{product.color || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">UPC</p>
                        <p className="text-sm font-medium text-gray-900">{product.upc || 'N/A'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Jewelry Specifics */}
                  {product.metal && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 mb-3 pb-2 border-b">Jewelry Details</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {product.metal && (
                          <div>
                            <p className="text-sm text-gray-500">Metal</p>
                            <p className="text-sm font-medium text-gray-900">{product.metal}</p>
                          </div>
                        )}
                        {product.mainStoneColor && (
                          <div>
                            <p className="text-sm text-gray-500">Main Stone Color</p>
                            <p className="text-sm font-medium text-gray-900">{product.mainStoneColor}</p>
                          </div>
                        )}
                        {product.mainStoneShape && (
                          <div>
                            <p className="text-sm text-gray-500">Stone Shape</p>
                            <p className="text-sm font-medium text-gray-900">{product.mainStoneShape}</p>
                          </div>
                        )}
                        {product.settingStyle && (
                          <div>
                            <p className="text-sm text-gray-500">Setting Style</p>
                            <p className="text-sm font-medium text-gray-900">{product.settingStyle}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  {/* Additional Details */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-3 pb-2 border-b">Additional Details</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {product.itemLength && (
                        <div>
                          <p className="text-sm text-gray-500">Item Length</p>
                          <p className="text-sm font-medium text-gray-900">{product.itemLength}</p>
                        </div>
                      )}
                      {product.totalCaratWeight && (
                        <div>
                          <p className="text-sm text-gray-500">Total Carat Weight</p>
                          <p className="text-sm font-medium text-gray-900">{product.totalCaratWeight}</p>
                        </div>
                      )}
                      {product.numberOfDiamonds && (
                        <div>
                          <p className="text-sm text-gray-500">Number of Diamonds</p>
                          <p className="text-sm font-medium text-gray-900">{product.numberOfDiamonds}</p>
                        </div>
                      )}
                      {product.theme && (
                        <div>
                          <p className="text-sm text-gray-500">Theme</p>
                          <p className="text-sm font-medium text-gray-900">{product.theme}</p>
                        </div>
                      )}
                      {product.chainType && (
                        <div>
                          <p className="text-sm text-gray-500">Chain Type</p>
                          <p className="text-sm font-medium text-gray-900">{product.chainType}</p>
                        </div>
                      )}
                      {product.closure && (
                        <div>
                          <p className="text-sm text-gray-500">Closure</p>
                          <p className="text-sm font-medium text-gray-900">{product.closure}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Product Features */}
                  {product.features && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 mb-3 pb-2 border-b">Features</h3>
                      <ul className="space-y-2">
                        {product.features.split(',').map((feature: string, index: number) => (
                          <li key={index} className="flex items-start">
                            <svg className="h-5 w-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            <span className="text-sm text-gray-700">{feature.trim()}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Product Status */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-3 pb-2 border-b">Product Status</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {product.personalized && (
                        <div>
                          <p className="text-sm text-gray-500">Personalized</p>
                          <p className="text-sm font-medium text-gray-900">
                            {product.personalized === 'yes' ? 'Yes' : 'No'}
                          </p>
                        </div>
                      )}
                      {product.signed && (
                        <div>
                          <p className="text-sm text-gray-500">Signed</p>
                          <p className="text-sm font-medium text-gray-900">
                            {product.signed === 'yes' ? 'Yes' : 'No'}
                          </p>
                        </div>
                      )}
                      {product.vintage && (
                        <div>
                          <p className="text-sm text-gray-500">Vintage</p>
                          <p className="text-sm font-medium text-gray-900">
                            {product.vintage === 'yes' ? 'Yes' : 'No'}
                          </p>
                        </div>
                      )}
                      {product.wholesale && (
                        <div>
                          <p className="text-sm text-gray-500">Wholesale</p>
                          <p className="text-sm font-medium text-gray-900">
                            {product.wholesale === 'yes' ? 'Yes' : 'No'}
                          </p>
                        </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Country of Origin - Full width at bottom */}
                    {product.country && (
                      <div className="mt-6 pt-6 border-t">
                        <p className="text-sm text-gray-500">Country of Origin</p>
                        <p className="text-sm font-medium text-gray-900">{product.country}</p>
                      </div>
                      )}
                    </div>
                 </div>

         {/* Reviews Section - Improved Responsiveness */}
            <div className="mt-8 bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-4 md:p-6">
                <div className="mt-8">
                  <h3 className="text-lg font-medium text-gray-900">Write a Review</h3>
                  <div className="mt-4 space-y-4">
                    {/* Rating Selector */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Rating</label>
                      <div className="flex items-center mt-2">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => {
                                const newRating = star;
                                let newSentiment = "POSITIVE";
                                if (newRating <= 2) newSentiment = "NEGATIVE";
                                else if (newRating === 3) newSentiment = "NEUTRAL";
                                
                                setReviewInput({
                                  ...reviewInput,
                                  rating: newRating,
                                  sentiment: newSentiment
                                });
                              }}
                              className="focus:outline-none"
                            >
                              <StarIcon
                                className={`h-8 w-8 ${star <= reviewInput.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                              />
                            </button>
                          ))}
                        </div>
                        <span className="ml-2 text-sm font-medium text-gray-700">
                          {reviewInput.rating} out of 5
                        </span>
                      </div>
                    </div>

                    {/* Sentiment Selector */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Overall Feeling</label>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {[
                          { value: "POSITIVE", label: "Positive", color: "bg-green-100 text-green-800" },
                          { value: "NEUTRAL", label: "Neutral", color: "bg-yellow-100 text-yellow-800" },
                          { value: "NEGATIVE", label: "Negative", color: "bg-red-100 text-red-800" }
                        ].map((option) => (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => setReviewInput({...reviewInput, sentiment: option.value})}
                            className={`px-3 py-2 rounded-md text-sm font-medium ${option.color} ${
                              reviewInput.sentiment === option.value 
                                ? 'ring-2 ring-offset-2 ring-blue-500' 
                                : 'hover:opacity-90'
                            }`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Comment Textarea */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Review</label>
                      <textarea
                        rows={4}
                        value={reviewInput.comment}
                        onChange={(e) => setReviewInput({...reviewInput, comment: e.target.value})}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        placeholder="Share your experience with this product..."
                      />
                    </div>

                    <button
                      onClick={handleCreateReview}
                      className="w-full sm:w-auto inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Submit Review
                    </button>
                  </div>
                </div>

                {/* Customer Reviews Section */}
                <h2 className="text-xl pt-10 font-bold text-gray-900">Customer Reviews</h2>
                
                {/* Overall Rating Summary */}
                {product.reviews?.length > 0 && (
                  <div className="mt-4 flex flex-col sm:flex-row sm:items-center">
                    <div className="flex items-center">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <StarIcon
                            key={star}
                            className={`h-5 w-5 ${star <= Math.round(product.averageRating || 0) ? 'text-yellow-400' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                      <span className="ml-2 text-lg font-semibold text-gray-900">
                        {product.averageRating?.toFixed(1)} out of 5
                      </span>
                    </div>
                    <span className="mt-2 sm:mt-0 sm:ml-2 text-sm text-gray-500">
                      ({product.reviewCount} {product.reviewCount === 1 ? 'review' : 'reviews'})
                    </span>
                  </div>
                )}

                {/* Individual Reviews */}
                  {reviewLoading ? (
                    <div className="mt-6 space-y-6">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="border-b border-gray-200 pb-6">
                          <div className="h-4 bg-gray-200 rounded w-1/3 mb-2 animate-pulse"></div>
                          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4 animate-pulse"></div>
                          <div className="h-3 bg-gray-200 rounded w-full animate-pulse"></div>
                          <div className="h-3 bg-gray-200 rounded w-4/5 mt-2 animate-pulse"></div>
                        </div>
                      ))}
                    </div>
                  ) : reviewError ? (
                    <div className="mt-4 text-red-500">
                      Error loading reviews: {reviewError.message}
                    </div>
                  ) : product?.reviews?.length > 0 ? (
                    <div className="mt-6 space-y-6">
                      {product.reviews.map((review: any) => (
                        <div key={review.id} className="border-b border-gray-200 pb-6">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                            <div className="flex items-center">
                              <div className="flex">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <StarIcon
                                    key={star}
                                    className={`h-5 w-5 ${star <= Math.round(review.rating || 0) ? 'text-yellow-400' : 'text-gray-300'}`}
                                  />
                                ))}
                              </div>
                              <span className="ml-2 text-sm font-medium text-gray-700">
                                {review.rating} out of 5
                              </span>
                            </div>
                            {review.sentiment && (
                              <span className={`mt-2 sm:mt-0 px-2 py-1 text-xs font-medium rounded-full ${
                                review.sentiment === "POSITIVE" ? "bg-green-100 text-green-800" :
                                review.sentiment === "NEUTRAL" ? "bg-yellow-100 text-yellow-800" :
                                "bg-red-100 text-red-800"
                              }`}>
                                {review.sentiment.toLowerCase()}
                              </span>
                            )}
                          </div>
                          <div className="mt-1 text-sm text-gray-500">
                            by {review.user?.username || 'Anonymous'} • {new Date(review.createdAt).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </div>
                          <p className="mt-2 text-gray-600">{review.comment}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-4 text-gray-500">No reviews yet. Be the first to review!</p>
                  )}
               <div>
                 {/* More Reviews Link - Bottom Right */}
                    <div className="flex justify-end">
                      <Link 
                        href={`/products/${slug}/reviews`} 
                        className="text-sm text-blue-500 hover:text-blue-700 hover:underline mt-5"
                      >
                        more reviews 
                      </Link>
                    </div>
               </div>
            </div>
          </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <button 
                onClick={() => setShowReportForm(!showReportForm)}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                Report this product
              </button>
              {showReportForm && (
                <div className="mt-4">
                  <ReportProductForm productId={product.id} />
                </div>
              )}
            </div>

          {/* Similar Products Section */}
          <section className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">You May Also Like</h2>
            {similarLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="bg-gray-100 rounded-lg h-64 animate-pulse"></div>
                ))}
              </div>
            ) : similarError ? (
              <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
                <p>Error loading similar products: {similarError.message}</p>
              </div>
            ) : similarData?.getSimilarProducts?.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {similarData.getSimilarProducts.map((similarProduct: any) => (
                  <Link key={similarProduct.id} href={`/products/${similarProduct.slug}`}>
                   <div className="group relative bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
                    <div className="aspect-square bg-gray-100 relative">
                      <div className="aspect-square bg-gray-50 relative overflow-hidden">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-gray-300 text-sm">Product Image</span>
                        </div>
                        {new Date(similarProduct.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) && (
                          <span className="absolute top-2 left-2 bg-white text-gray-600 text-xs font-light px-2 py-0.5">
                            New
                          </span>
                        )}
                      </div>
                        <button 
                          onClick={(e) => {
                            e.preventDefault();
                            wishlist(similarProduct.id);
                          }}
                          className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/90 hover:bg-white transition-all shadow-sm"
                          aria-label={isInWishlist(similarProduct.id) ? "Remove from wishlist" : "Add to wishlist"}
                        >
                          <HeartIcon
                            className={`h-4 w-4 ${
                              isInWishlist(similarProduct.id)
                                ? 'text-red-500 fill-red-500 hover:text-red-600'
                                : 'text-gray-400 hover:text-red-500'
                            } transition-colors`}
                          />
                        </button>
                    </div>
                    <div className="p-4">
                    <div className="flex justify-between items-start">
                          <h3 className="text-sm sm:text-base font-light text-gray-900 mb-1 hover:text-gray-600 transition line-clamp-2">
                            {similarProduct.name}
                          </h3>
                      </div>
                      <div className="flex items-center mb-2">
                        <div className="flex">
                          {[0, 1, 2, 3, 4].map((averageRating) => (
                            <StarIcon
                              key={averageRating}
                              className={`h-4 w-4 ${averageRating < 4 ? 'text-yellow-400' : 'text-gray-300'}`}
                            />
                          ))}
                        </div>
                        <span className="ml-1 text-xs text-gray-500">({similarProduct.averageRating})</span>
                      </div>
            
                      <div className="flex justify-between items-center">
                          <p className="text-sm sm:text-sm font-light text-gray-900 flex flex-col">
                            {similarProduct.discountedPrice ? (
                              <>
                                <span className="text-red-500">
                                  {formatCurrency(convertPrice(similarProduct.discountedPrice, currency), currency)}
                                </span>
                                <span className="text-xs sm:text-sm font-light text-gray-500 line-through">
                                  {formatCurrency(convertPrice(similarProduct.price, currency), currency)}
                                </span>
                              </>
                            ) : (
                              <span>
                                {formatCurrency(convertPrice(similarProduct.price, currency), currency)}
                              </span>
                            )}
                          </p>
                          {similarProduct.material && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs sm:text-sm font-medium bg-blue-100 text-gray-800 whitespace-nowrap">
                            {similarProduct.material}
                          </span>
                          )}
                        </div>
                    </div>
                  </div>
                </Link>               
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 border border-gray-200 text-gray-700 px-6 py-4 rounded-lg text-center">
                <p>No similar products found.</p>
              </div>
            )}
          </section>
        </section>
      </main>
    </>
  );
}