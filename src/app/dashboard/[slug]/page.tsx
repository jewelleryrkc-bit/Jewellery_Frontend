/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import LoadingPage from "@/components/LoadingPage";
import { GET_PRODUCT_BY_SLUG, PRODUCT_REVIEWS_QUERY } from "../../../graphql/queries";
import { useQuery } from "@apollo/client";
import { useParams, useRouter } from "next/navigation";
import { StarIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import { StarIcon as StarIconSolid } from "@heroicons/react/24/solid";
import { UPDATE_PRODUCT_IMAGE } from "../../../graphql/mutations";
import TopHeader from "@/components/TopHeader";
import SearchBar from "@/components/SearchBar";
import Footer from "@/components/Footer";
import { useState } from "react";

enum ReviewSentiment {
  POSITIVE = 'POSITIVE',
  NEUTRAL = 'NEUTRAL',
  NEGATIVE = 'NEGATIVE'
}


export default function SellerProductPage() {
  const router = useRouter();
  const params = useParams();
  const slug = 
    typeof params?.slug === "string"
    ? params.slug
    : Array.isArray(params?.slug)
    ? params?.slug[0]
    : undefined;

  // Only fetch basic product data without reviews
  const { data, loading, error } = useQuery(GET_PRODUCT_BY_SLUG, {
    variables: { slug },
    skip: !slug,
  });

  // const productDate = data?.productBySlug.createdAt;


  const [offset, setOffset] = useState(0);
  const limit = 5;
  
  // Fetch reviews separately
  const { data: reviewData, loading: reviewsLoading } = useQuery(PRODUCT_REVIEWS_QUERY, {
    variables: {
      slug,
      limit,
      offset
    },
    skip: !slug,
  });

  const [sentimentFilter, setSentimentFilter] = useState<'ALL' | ReviewSentiment>('ALL');

  const product = data?.productBySlug;
  console.log("Product from query via dashboard", product);

  const reviews = reviewData?.productReviews?.items || [];
  const totalReviews = reviewData?.productReviews?.total || 0;
  const hasMoreReviews = reviewData?.productReviews?.hasMore || false;

  if (loading) return <LoadingPage />;

  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 max-w-md w-full">
        <h3 className="font-medium text-gray-900 text-lg mb-2">Error loading product</h3>
        <p className="text-gray-600">{error.message}</p>
        <button 
          onClick={() => router.back()}
          className="mt-4 text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          ← Go back
        </button>
      </div>
    </div>
  );    

  if (!product) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 max-w-md w-full text-center">
        <h3 className="font-medium text-gray-900 text-lg mb-2">Product Not Found</h3>
        <p className="text-gray-600 mb-4">
          The product you&apos;re looking for doesn&apos;t exist or may have been removed.
        </p>
        <button 
          onClick={() => router.back()}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          ← Back to products
        </button>
      </div>
    </div>
  );

  // Calculate rating distribution from the reviews we fetched
  const ratingDistribution = [0, 0, 0, 0, 0];
  reviews.forEach((review: { rating: number }) => {
    ratingDistribution[5 - review.rating]++;
  });

  // Filter reviews by sentiment
  const filteredReviews = sentimentFilter === 'ALL' 
    ? reviews 
    : reviews.filter((review: { sentiment: ReviewSentiment }) => 
        review.sentiment === sentimentFilter
      );

  const handlePagination = (direction: 'prev' | 'next') => {
    const newOffset = direction === 'next' ? offset + limit : Math.max(0, offset - limit);
    setOffset(newOffset);
  };

  return (
    <>
      <TopHeader/>
      <SearchBar onSellerSearch={() => {}} />
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8"> 
          <button 
            onClick={() => router.back()}
            className="mb-6 flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-1" />
            Back to Products
          </button>
          
          {/* Product Header */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">{product.name}</h1>
                <div className="flex flex-wrap items-center mt-2 gap-x-4 gap-y-2 text-sm text-gray-600">
                  <span>Price: ${product.price.toFixed(2)}</span>
                  <span>Stock: {product.stock} units</span>
                  {/* <span>Listed: {new Date(
                      typeof product.createdAt === 'number' 
                        ? product.createdAt 
                        : (product.createdAt) || Number(product.createdAt)
                    ).toLocaleDateString()}
                  </span> */}
                  <span>
                    Listed: {new Date(Number(product.createdAt)).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                  </span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors">
                  Edit Product
                </button>
                <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-md transition-colors">
                  Add Stock
                </button>
                <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-md transition-colors">
                  Unlist
                </button>
              </div>
            </div>

            {/* Rating Summary */}
            <div className="mt-6">
              <div className="flex items-center">
                <div className="flex items-center">
                  <StarIconSolid className="h-5 w-5 text-yellow-400" />
                  <span className="ml-1 text-xl font-medium text-gray-900">
                    {product.averageRating?.toFixed(1) || '0.0'}
                  </span>
                </div>
                <span className="ml-2 text-gray-500 text-sm">
                  ({totalReviews} reviews)
                </span>
              </div>
              
              {/* Rating Distribution Bars */}
              <div className="mt-4 space-y-2">
                {[5, 4, 3, 2, 1].map((stars) => (
                  <div key={stars} className="flex items-center">
                    <span className="w-8 text-sm text-gray-600">{stars}★</span>
                    <div className="flex-1 mx-2 bg-gray-100 rounded-full h-2.5">
                      <div 
                        className="bg-yellow-400 h-2.5 rounded-full" 
                        style={{ 
                          width: `${(ratingDistribution[5 - stars] / Math.max(1, totalReviews)) * 100}%` 
                        }}
                      />
                    </div>
                    <span className="text-xs text-gray-500 w-8 text-right">
                      {ratingDistribution[5 - stars]}
                    </span>
                  </div>
                ))}
              </div>
              
              {/* Rating Filters */}
              <div className="flex flex-wrap gap-2 mt-4">
                <button className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-medium rounded-full transition-colors">
                  All Ratings
                </button>
                {[5, 4, 3, 2, 1].map((stars) => (
                  <button 
                    key={stars}
                    className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-medium rounded-full transition-colors flex items-center"
                  >
                    {stars}★
                  </button>
                ))}
              </div>

              {/* Sentiment Filters */}
              <div className="flex flex-wrap gap-2 mt-4">
                <button 
                  onClick={() => setSentimentFilter('ALL')}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    sentimentFilter === 'ALL' 
                      ? 'bg-gray-800 text-white' 
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                  }`}
                >
                  All Sentiments
                </button>
                <button 
                  onClick={() => setSentimentFilter(ReviewSentiment.POSITIVE)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    sentimentFilter === ReviewSentiment.POSITIVE
                      ? 'bg-green-600 text-white'
                      : 'bg-green-100 hover:bg-green-200 text-green-800'
                  }`}
                >
                  Positive
                </button>
                <button 
                  onClick={() => setSentimentFilter(ReviewSentiment.NEUTRAL)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    sentimentFilter === ReviewSentiment.NEUTRAL
                      ? 'bg-yellow-500 text-white'
                      : 'bg-yellow-100 hover:bg-yellow-200 text-yellow-800'
                  }`}
                >
                  Neutral
                </button>
                <button 
                  onClick={() => setSentimentFilter(ReviewSentiment.NEGATIVE)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    sentimentFilter === ReviewSentiment.NEGATIVE
                      ? 'bg-red-600 text-white'
                      : 'bg-red-100 hover:bg-red-200 text-red-800'
                  }`}
                >
                  Negative
                </button>
              </div>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-2xl font-semibold text-blue-800">1,240</p>
                <p className="text-sm text-blue-600">Views</p>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <p className="text-2xl font-semibold text-green-800">3.2%</p>
                <p className="text-sm text-green-600">Conversion Rate</p>
              </div>
              <div className="bg-red-50 rounded-lg p-4">
                <p className="text-2xl font-semibold text-red-800">4 (1.8%)</p>
                <p className="text-sm text-red-600">Returns</p>
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Customer Reviews</h2>
              <span className="text-sm text-gray-500">
                Showing {filteredReviews.length} of {totalReviews} reviews
                {sentimentFilter !== 'ALL' && ` (filtered by ${sentimentFilter.toLowerCase()})`}
              </span>
            </div>
            
            {reviewsLoading ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Loading reviews...</p>
              </div>
            ) : filteredReviews.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No {sentimentFilter.toLowerCase()} reviews found</p>
                {sentimentFilter !== 'ALL' && (
                  <button 
                    onClick={() => setSentimentFilter('ALL')}
                    className="mt-2 text-blue-600 hover:text-blue-800 text-sm"
                  >
                    Show all reviews
                  </button>
                )}
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {filteredReviews.map((review: any) => (
                  <div key={review.id} className="py-4">
                    <div className="flex justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{review.user?.username || 'Anonymous'}</p>
                        <div className="flex items-center mt-1">
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              star <= review.rating ? (
                                <StarIconSolid key={star} className="h-4 w-4 text-yellow-400" />
                              ) : (
                                <StarIcon key={star} className="h-4 w-4 text-yellow-400" />
                              )
                            ))}
                          </div>
                          <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium ${
                            review.sentiment === ReviewSentiment.POSITIVE
                              ? 'bg-green-100 text-green-800'
                              : review.sentiment === ReviewSentiment.NEUTRAL
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {review.sentiment}
                          </span>
                          <span className="ml-2 text-gray-500 text-xs">
                            {new Date(review.createdAt).toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: 'short', 
                              day: 'numeric' 
                            })}
                          </span>
                        </div>
                      </div>
                      <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                        Reply
                      </button>
                    </div>
                    <p className="mt-2 text-gray-700">&quot;{review.comment}&quot;</p>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            <div className="flex justify-center mt-6">
              <button 
                onClick={() => handlePagination('prev')}
                disabled={offset === 0}
                className={`px-4 py-2 mx-1 ${offset === 0 ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'} text-sm font-medium rounded-md transition-colors`}
              >
                Previous
              </button>
              <span className="px-4 py-2 mx-1 text-sm font-medium">
                Page {Math.floor(offset / limit) + 1}
              </span>
              <button 
                onClick={() => handlePagination('next')}
                disabled={!hasMoreReviews}
                className={`px-4 py-2 mx-1 ${!hasMoreReviews ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'} text-sm font-medium rounded-md transition-colors`}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer/>
    </>
  );
}