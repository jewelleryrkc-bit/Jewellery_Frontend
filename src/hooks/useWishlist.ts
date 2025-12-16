/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useQuery, useMutation, gql, ApolloCache } from "@apollo/client";
import toast from "react-hot-toast";
import { GET_WISHLISTS,ALL_PRODUCTS_QUERY,FILTERED_PRODUCTS_QUERY } from "../graphql/queries";
import { TOGGLE_WISHLIST } from "../graphql/mutations";
import { WishlistItem, Product } from "../types/type";

interface GetWishlistData {
  getWishlist: {
    id: string;
    items: WishlistItem[];
  };
}

export const PRODUCT_FRAGMENT = gql`
  fragment ProductFragment on Product {
    id
    name
    slug
    price
    size
    description
    averageRating
    reviewCount
    wishlistCount
    images {
      id
      url
      key
      isPrimary
      position
    }
  }
`;

export const useWishlist = () => {
  const { data, loading, error, client } =
    useQuery<GetWishlistData>(GET_WISHLISTS);

  const [toggleWishlistMutation] = useMutation(TOGGLE_WISHLIST);

  const wishlistItems = data?.getWishlist?.items || [];

  const isInWishlist = (productId: string) =>
    wishlistItems.some((item) => item.product.id === productId);

 const toggleWishlist = async (product: Product) => {
  try {
    await toggleWishlistMutation({
      variables: { productId: product.id, variationId: null },
      refetchQueries: [
       { query: GET_WISHLISTS },
    { query: ALL_PRODUCTS_QUERY }, 
     { query: FILTERED_PRODUCTS_QUERY }, 
      ],
    });
    
    toast.success(
      isInWishlist(product.id)
        ? `${product.name} removed from wishlist`
        : `${product.name} added to wishlist`
    );
  } catch (err) {
    console.error(err);
    toast.error("Failed to update wishlist");
  }
};


  return {
    wishlistItems,
    toggleWishlist,
    isInWishlist,
    loading,
    error,
  };
};
