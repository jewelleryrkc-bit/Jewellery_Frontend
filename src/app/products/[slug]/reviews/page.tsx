"use client";

import { PRODUCT_REVIEWS_QUERY } from "../../../../graphql/queries";
import { useQuery } from "@apollo/client";
import { useState } from "react";
import { StarIcon } from "@heroicons/react/24/outline";
import { StarIcon as StarIconSolid } from "@heroicons/react/24/solid";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import Link from "next/link";

interface Review {
  id: string;
  comment: string;
  rating: number;
  sentiment?: "POSITIVE" | "NEUTRAL" | "NEGATIVE";
  createdAt: string;
  user?: {
    id: string;
    username: string;
  };
}

enum ReviewSentiment {
  POSITIVE = "POSITIVE",
  NEUTRAL = "NEUTRAL",
  NEGATIVE = "NEGATIVE",
}

export default function ReviewsPage({ params }: { params: { slug: string } }) {
  const [offset, setOffset] = useState(0);
  const limit = 5;
  const { slug } = params;

  const [sentimentFilter, setSentimentFilter] = useState<"ALL" | ReviewSentiment>("ALL");

  const { data, loading, error, fetchMore } = useQuery(PRODUCT_REVIEWS_QUERY, {
    variables: {
      slug,
      limit,
      offset,
      sentiment: sentimentFilter === "ALL" ? null : sentimentFilter
    },
    fetchPolicy: "cache-and-network",
  });
  const paginatedData = data?.productReviews;
  const reviews: Review[] = paginatedData?.items || [];
  const totalCount = paginatedData?.total || 0;
  const hasMore = paginatedData?.hasMore || false;

  const handlePrevious = () => {
    const newOffset = Math.max(0, offset - limit);
    setOffset(newOffset);
    fetchMore({
      variables: {
        slug,
        limit,
        offset: newOffset,
      },
    });
  };

  const handleSentimentFilterChange = (sentiment: "ALL" | ReviewSentiment) => {
    setSentimentFilter(sentiment);
    setOffset(0); // Reset to first page when changing filters
  };
  

  const handleNext = () => {
    const newOffset = offset + limit;
    setOffset(newOffset);
    fetchMore({
      variables: {
        slug,
        limit,
        offset: newOffset,
      },
    });
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center p-6 bg-red-50 rounded-lg max-w-md border border-red-100">
          <h2 className="text-xl font-bold text-red-600 mb-3">Error Loading Reviews</h2>
          <p className="text-red-500 mb-4">{error.message}</p>
           <button
            onClick={() => window.location.reload()}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
           >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          
          <div className="p-6 sm:p-8">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Customer Reviews</h1>
              <Link
                href={`/products/${slug}`}
                className="text-sm text-blue-600 hover:text-blue-800 hover:underline flex items-center"
              >
                ← Back to product
              </Link>
            </div>

            {/* Sentiment Filters */}
            <div className="flex flex-wrap gap-2 mb-4">
              <button
                onClick={() => handleSentimentFilterChange("ALL")}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  sentimentFilter === "ALL"
                    ? "bg-gray-800 text-white"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                }`}
              >
                All Sentiments
              </button>
              <button
                onClick={() => setSentimentFilter(ReviewSentiment.POSITIVE)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  sentimentFilter === ReviewSentiment.POSITIVE
                    ? "bg-green-600 text-white"
                    : "bg-green-100 hover:bg-green-200 text-green-800"
                }`}
              >
                Positive
              </button>
              <button
                onClick={() => setSentimentFilter(ReviewSentiment.NEUTRAL)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  sentimentFilter === ReviewSentiment.NEUTRAL
                    ? "bg-yellow-500 text-white"
                    : "bg-yellow-100 hover:bg-yellow-200 text-yellow-800"
                }`}
              >
                Neutral
              </button>
              <button
                onClick={() => setSentimentFilter(ReviewSentiment.NEGATIVE)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  sentimentFilter === ReviewSentiment.NEGATIVE
                    ? "bg-red-600 text-white"
                    : "bg-red-100 hover:bg-red-200 text-red-800"
                }`}
              >
                Negative
              </button>
            </div>

            {loading && offset === 0 ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <>
                <div className="divide-y divide-gray-200">
                  {reviews
                    .filter((review) => sentimentFilter === "ALL" || review.sentiment === sentimentFilter)
                    .map((review) => (
                      <div key={review.id} className="py-4">
                        <div className="flex justify-between">
                          <div>
                            <p className="font-medium text-gray-900">{review.user?.username}</p>
                            <div className="flex items-center mt-1">
                              <div className="flex">
                                {[1, 2, 3, 4, 5].map((star) =>
                                  star <= review.rating ? (
                                    <StarIconSolid key={star} className="h-4 w-4 text-yellow-400" />
                                  ) : (
                                    <StarIcon key={star} className="h-4 w-4 text-yellow-400" />
                                  )
                                )}
                              </div>
                              {review.sentiment && (
                                <span
                                  className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium ${
                                    review.sentiment === ReviewSentiment.POSITIVE
                                      ? "bg-green-100 text-green-800"
                                      : review.sentiment === ReviewSentiment.NEUTRAL
                                      ? "bg-yellow-100 text-yellow-800"
                                      : "bg-red-100 text-red-800"
                                  }`}
                                >
                                  {review.sentiment}
                                </span>
                              )}
                              <span className="ml-2 text-gray-500 text-xs">
                                {new Date(review.createdAt).toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                })}
                              </span>
                            </div>
                          </div>
                        </div>
                        <p className="mt-2 text-gray-700">{review.comment}</p>
                      </div>
                    ))}
                </div>

                {reviews.length === 0 && !loading && (
                  <div className="text-center py-10">
                    <p className="text-gray-500">No reviews found for this product.</p>
                  </div>
                )}

                {totalCount > 0 && (
                  <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-100 pt-6">
                    <div className="text-sm text-gray-500">
                      Showing {Math.min(offset + 1, totalCount)}-
                      {Math.min(offset + limit, totalCount)} of {totalCount} reviews
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={handlePrevious}
                        disabled={offset === 0 || loading}
                        className={`px-4 py-2 border border-gray-300 rounded-md flex items-center text-sm font-medium ${
                          offset === 0 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-50 transition-colors"
                        }`}
                      >
                        <FiChevronLeft className="mr-1" /> Previous
                      </button>
                      <button
                        onClick={handleNext}
                        disabled={!hasMore || loading}
                        className={`px-4 py-2 border border-gray-300 rounded-md flex items-center text-sm font-medium ${
                          !hasMore ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-50 transition-colors"
                        }`}
                      >
                        Next <FiChevronRight className="ml-1" />
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}

            {loading && offset > 0 && (
              <div className="mt-6 flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
