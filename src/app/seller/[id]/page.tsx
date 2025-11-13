/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @next/next/no-img-element */
'use client';

import { useRouter } from 'next/navigation';
import { useMutation, useQuery } from '@apollo/client';
import { GET_COMPANY_BY_ID, PAGINATED_COMPANY_REVIEWS, GET_COMPANY_FOLLOWERS, WE_QUERY, GET_USER_COMPANIES } from '../../../graphql/queries';
import { CREATE_REVIEW_COMPANY, FOLLOW_COMPANY, UNFOLLOW_COMPANY, TRACK_COMPANY_VIEW } from '../../../graphql/mutations';
import { User, Box, Star, Mail, Phone, MapPin, StarIcon } from 'lucide-react';
import { useParams } from 'next/navigation';
import ProductCard from '../../../components/ProductCard';
import MiddleHeader from '@/components/MiddleHeader';
import Footer from '@/components/Footer';
import TopHeader from '@/components/TopHeader';
import LoadingPage from '@/components/LoadingPage';
import toast from 'react-hot-toast';
import { useEffect, useState } from 'react';

const PRODUCTS_PER_PAGE = 2;

export default function SellerProfileViewPage() {
  const router = useRouter();
  const params = useParams();
  const companyId = params.id as string;
  const [activeTab, setActiveTab] = useState('products');
  const [currentPage, setCurrentPage] = useState(1);
  const [followLoading, setFollowLoading] = useState(false);
  const [unfollowLoading, setUnfollowLoading] = useState(false);
   const [trackView] = useMutation(TRACK_COMPANY_VIEW);

  // Current user data
  const { data: userData } = useQuery(WE_QUERY);
  const currentUser = userData?.we;

  // Company data
  const { data: companyData, loading: companyLoading, error: companyError } = useQuery(GET_COMPANY_BY_ID, {
    variables: { getCompanyId: companyId },
  });
  const company = companyData?.getCompany;

  // Followers data
  const { data: cFollowdata } = useQuery(GET_COMPANY_FOLLOWERS, {
    variables: { companyId },
  });

  // Check if current user is following
  const { data: userCompaniesData } = useQuery(GET_USER_COMPANIES, {
    skip: !currentUser?.id,
  });
  const isFollowing = userCompaniesData?.followedCompanies?.some(
    (company: any) => company.id === companyId
  );

  // Follow mutations
  const [followCompany] = useMutation(FOLLOW_COMPANY, {
    refetchQueries: [
      { query: GET_COMPANY_FOLLOWERS, variables: { companyId } },
      { query: GET_USER_COMPANIES },
      { query: WE_QUERY }
    ],
  });

   useEffect(() => {
    const trackViewEvent = async () => {
      try {
        await trackView({
          variables: { companyId },
          // Optional: Add context to avoid showing loading states
          context: {
            fetchOptions: {
              headers: {
                'x-low-priority': 'true' // Mark as non-critical request
              }
            }
          }
        });
      } catch (error) {
        console.error('Failed to track view:', error);
        // Don't show error to user - this is background tracking
      }
    };

    if (companyId) {
      trackViewEvent();
    }
  }, [companyId, trackView]);

  
  const [unfollowCompany] = useMutation(UNFOLLOW_COMPANY, {
    refetchQueries: [
      { query: GET_COMPANY_FOLLOWERS, variables: { companyId } },
      { query: GET_USER_COMPANIES },
      { query: WE_QUERY }
    ],
  });

  // Review data
  const [reviewInput, setReviewInput] = useState({
    rating: 5,
    comment: ""
  });

  const { data: reviewsData, fetchMore } = useQuery(PAGINATED_COMPANY_REVIEWS, {
    variables: { id: companyId, limit: 5, offset: 0},
    skip: activeTab !== 'reviews',
    notifyOnNetworkStatusChange: true,
  });

  // Products data
  const allProducts = company?.products || [];
  const allFollowers = cFollowdata?.companyFollowers || [];
  const paginatedReviews = reviewsData?.companyReviews?.items || [];
  const hasMoreReviews = reviewsData?.companyReviews?.hasMore;

  // Pagination calculations
  const totalProducts = allProducts.length;
  const totalPages = Math.ceil(totalProducts / PRODUCTS_PER_PAGE);
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const paginatedProducts = allProducts.slice(startIndex, startIndex + PRODUCTS_PER_PAGE);

  // Handlers
  const handleLoadMoreReviews = () => {
    const lastReview = paginatedReviews[paginatedReviews.length - 1];
    fetchMore({
      variables: {
        cursor: lastReview?.createdAt,
        companyId,
        limit: 5,
        offset: paginatedReviews.length
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if(!fetchMoreResult) return prev;
        return {
          companyReviews: {
            ...fetchMoreResult.companyReviews,
            items: [...prev.companyReviews.items, ...fetchMoreResult.companyReviews.items],
          },
        };
      },
    });
  };

  const [createReview] = useMutation(CREATE_REVIEW_COMPANY, {
    refetchQueries: [{ query: GET_COMPANY_BY_ID, variables: { getCompanyId: companyId } }]
  });

  const handleCreateReviewCompany = async () => {
    try {
      await createReview({
        variables: {
          input: {
            companyId: companyId,
            rating: reviewInput.rating,
            comment: reviewInput.comment,
          },
        },
      });
      toast.success("Review submitted successfully");
      setReviewInput({ rating: 5, comment: "" });
    } catch (err) {
      toast.error("Failed to submit review");
      console.error(err);
    };
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFollow = async () => {
    setFollowLoading(true);
    try {
      await followCompany({ variables: { companyId } });
      toast.success('You are now following this company');
    } catch (err) {
      toast.error('Failed to follow company');
      console.error(err);
    } finally {
      setFollowLoading(false);
    }
  };

  const handleUnfollow = async () => {
    setUnfollowLoading(true);
    try {
      await unfollowCompany({ variables: { companyId } });
      toast.success('You have unfollowed this company');
    } catch (err) {
      toast.error('Failed to unfollow company');
      console.error(err);
    } finally {
      setUnfollowLoading(false);
    }
  };

  if (companyLoading) return <LoadingPage />;

  if (companyError || !company) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
        <div className="text-center max-w-md p-6 bg-white rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Seller not found</h2>
          <p className="text-gray-600 mb-4">The seller you're looking for doesn't exist or may have been removed.</p>
          <button
            onClick={() => router.push('/')}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <TopHeader />
      <MiddleHeader />

      <div className="min-h-screen bg-white">
        <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
          {/* Profile Header */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8 mb-8 sm:mb-12">
            {/* Profile Picture */}
            <div className="w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 flex-shrink-0 rounded-full border-2 border-white shadow-md overflow-hidden">
              {company.image ? (
                <img
                  src={company.image}
                  alt={company.cname}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                  <User className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
                </div>
              )}
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center sm:text-left">
              <div className="flex justify-between items-start mb-3 sm:mb-4">
                <div>
                  <h1 className="text-lg sm:text-xl md:text-2xl font-semibold">{company.cname || company.username}</h1>
                  {/* Contact Info */}
                  <div className="flex flex-col sm:flex-row sm:flex-wrap justify-center sm:justify-start gap-2 mt-2">
                    {company.email && (
                      <div className="flex items-center text-xs sm:text-sm text-gray-600">
                        <Mail className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                        <span className="truncate max-w-[180px] sm:max-w-none">{company.email}</span>
                      </div>
                    )}
                    {company.contact && (
                      <div className="flex items-center text-xs sm:text-sm text-gray-600">
                        <Phone className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                        <span>{company.contact}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Follow Button */}
                {currentUser?.id && currentUser.id !== company.id && (
                  <button
                    onClick={isFollowing ? handleUnfollow : handleFollow}
                    disabled={isFollowing ? unfollowLoading : followLoading}
                    className={`px-4 py-2 rounded-md text-sm font-medium ${
                      isFollowing 
                        ? 'bg-gray-200 text-gray-800 hover:bg-gray-300' 
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    } transition-colors ${(isFollowing ? unfollowLoading : followLoading) ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    {(isFollowing ? unfollowLoading : followLoading) ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {isFollowing ? 'Unfollowing...' : 'Following...'}
                      </span>
                    ) : isFollowing ? (
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Following
                      </span>
                    ) : (
                      'Follow'
                    )}
                  </button>
                )}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-3 sm:mb-4 max-w-xs mx-auto sm:mx-0">
                <div className="bg-gray-50 p-2 rounded-lg">
                  <div className="font-bold text-sm sm:text-base">{allProducts.length}</div>
                  <div className="text-xs text-gray-500">Products</div>
                </div>
                <div className="bg-gray-50 p-2 rounded-lg">
                  <div className="font-bold text-sm sm:text-base">{allFollowers.length}</div>
                  <div className="text-xs text-gray-500">Followers</div>
                </div>
                <div className="bg-gray-50 p-2 rounded-lg">
                  <div className="font-bold text-sm sm:text-base">{company.reviewCount || 0}</div>
                  <div className="text-xs text-gray-500">Reviews</div>
                </div>
                <div className="bg-blue-50 p-2 rounded-lg shadow-sm border border-blue-200">
                  <div className="font-bold text-sm sm:text-base text-blue-700">{""}</div>
                  <div className="text-xs text-blue-600">Messages</div>
                </div>
                <div className="bg-gray-50 p-2 rounded-lg">
                  <div className="flex items-left">
                    <Star className="h-3 w-3 sm:h-4 sm:w-4 text-amber-400 fill-amber-400 mt-1 mr-1" />
                    <span className="font-bold text-sm sm:text-base">{company.averageRating?.toFixed(1) || '0.0'}</span>
                  </div>
                  <div className="text-xs text-gray-500">Rating</div>
                </div>
              </div>

              {/* Bio */}
              <p className="text-xs sm:text-sm text-gray-700 mb-2 sm:mb-3">
                {company.bio || 'No bio available'}
              </p>

              {/* Location */}
              {company.location && (
                <div className="flex items-center justify-center sm:justify-start text-xs sm:text-sm text-gray-600">
                  <MapPin className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                  <span>{company.location}</span>
                </div>
              )}
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b mb-6">
            <button
              className={`px-4 py-2 font-medium ${activeTab === 'products' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
              onClick={() => {
                setActiveTab('products');
                setCurrentPage(1);
              }}
            >
              Products
            </button>
            <button
              className={`px-4 py-2 font-medium ${activeTab === 'reviews' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
              onClick={() => setActiveTab('reviews')}
            >
              Reviews {company.reviewCount > 0 && `(${company.reviewCount})`}
            </button>
          </div>

          {/* Products Tab */}
          {activeTab === 'products' && (
            <section className="mb-8 sm:mb-12">
              {allProducts.length > 0 ? (
                <>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
                    {paginatedProducts.map((product: any) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                      />
                    ))}
                  </div>

                  {/* Pagination Controls */}
                  {totalPages > 1 && (
                    <div className="flex justify-center mt-8">
                      <nav className="flex items-center gap-1">
                        <button
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                          className="px-3 py-1 rounded border border-gray-300 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                        >
                          Prev
                        </button>

                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                          <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`px-3 py-1 rounded border ${currentPage === page 
                              ? 'bg-blue-500 text-white border-blue-500' 
                              : 'border-gray-300 text-gray-700 hover:bg-gray-100'}`}
                          >
                            {page}
                          </button>
                        ))}

                        <button
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          className="px-3 py-1 rounded border border-gray-300 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                        >
                          Next
                        </button>
                      </nav>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-8 sm:py-12 bg-gray-50 rounded-lg">
                  <Box className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-gray-400" />
                  <h3 className="mt-3 text-base sm:text-lg font-medium">No products available</h3>
                  <p className="mt-1 text-xs sm:text-sm text-gray-500">This seller hasn't listed any products yet.</p>
                </div>
              )}
            </section>
          )}

          {/* Reviews Tab */}
          {activeTab === 'reviews' && (
            <section className="mx-auto w-full">
              {/* Rating Summary */}
              <div className="bg-white rounded-lg p-6 mb-8 border border-gray-200 shadow-sm">
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="flex flex-col items-center md:items-start">
                    <div className="text-4xl font-bold text-gray-900 mb-1">
                      {company.averageRating?.toFixed(1) || '0.0'}
                      <span className="text-xl text-gray-500">/5</span>
                    </div>
                    <div className="flex mb-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <StarIcon
                          key={star}
                          className={`h-5 w-5 ${star <= Math.floor(company.averageRating || 0) 
                            ? 'text-amber-400 fill-amber-400' 
                            : 'text-gray-300'}`}
                        />
                      ))}
                    </div>
                    <p className="text-sm text-gray-500">
                      Based on {company.reviewCount} review{company.reviewCount !== 1 ? 's' : ''}
                    </p>
                  </div>

                  <div className="flex-1">
                    <div className="space-y-2">
                      {[5, 4, 3, 2, 1].map((stars) => {
                        const count = company.reviews?.filter((r: any) => Math.floor(r.rating) === stars).length || 0;
                        const percentage = (count / Math.max(1, company.reviewCount || 0)) * 100;
                        
                        return (
                          <div key={stars} className="flex items-center">
                            <div className="w-10 flex items-center">
                              <span className="text-sm font-medium text-gray-700">{stars}</span>
                              <StarIcon className="h-4 w-4 text-amber-400 ml-1" />
                            </div>
                            <div className="flex-1 mx-3">
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-amber-400 h-2 rounded-full" 
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                            </div>
                            <div className="w-10 text-right">
                              <span className="text-sm text-gray-600">{count}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Write Review */}
              {currentUser?.id && currentUser.id !== company.id && (
                <div className="bg-white rounded-lg p-6 mb-8 border border-gray-200 shadow-sm">
                  <h3 className="text-lg font-medium text-center mb-4">Share Your Experience</h3>
                  <div className="space-y-4">
                    <div className="flex justify-center">
                      <div className="inline-flex rounded-md shadow-sm" role="group">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setReviewInput({ ...reviewInput, rating: star })}
                            className={`px-3 py-2 text-sm font-medium ${
                              star <= reviewInput.rating 
                                ? 'text-amber-500 bg-amber-50' 
                                : 'text-gray-400 hover:text-amber-500'
                            } border border-gray-200 hover:bg-amber-50 transition-colors`}
                          >
                            <StarIcon className="h-5 w-5" />
                          </button>
                        ))}
                      </div>
                    </div>

                    <textarea
                      rows={3}
                      className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm sm:text-base"
                      placeholder="What was your experience with this seller?"
                      value={reviewInput.comment}
                      onChange={(e) => setReviewInput({ ...reviewInput, comment: e.target.value })}
                    />

                    <div className="flex justify-center">
                      <button
                        onClick={handleCreateReviewCompany}
                        disabled={!reviewInput.comment.trim()}
                        className={`px-6 py-2 rounded-lg text-base font-medium transition-colors ${
                          reviewInput.comment.trim()
                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                            : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        Submit Review
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Reviews List */}
              {paginatedReviews.length > 0 ? (
                <div className="space-y-4">
                  {paginatedReviews.map((review: any) => (
                    <div key={review.id} className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                      <div className="flex items-start">
                        <div className="mr-4">
                          <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                            <User className="h-5 w-5 text-gray-400" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="text-base font-medium text-gray-900">{review.user.username}</h4>
                            <div className="flex items-center text-amber-500">
                              <StarIcon className="h-4 w-4 fill-current mr-1" />
                              <span className="text-sm font-medium">{review.rating}.0</span>
                            </div>
                          </div>
                          <p className="text-sm text-gray-700 mt-2">{review.comment}</p>
                          <div className="text-xs text-gray-500 mt-3">
                            {new Date(review.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {hasMoreReviews && (
                    <div className="flex justify-center mt-6">
                      <button
                        onClick={handleLoadMoreReviews}
                        className="px-4 py-2 text-sm text-blue-600 hover:text-blue-800 font-medium hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        Load More Reviews
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
                  <StarIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-3 text-lg font-medium text-gray-900">No reviews yet</h3>
                  <p className="mt-1 text-sm text-gray-500">Be the first to review this seller</p>
                </div>
              )}
            </section>
          )}
        </main>
        <Footer />
      </div>
    </>
  );
}