"use client";

import { useQuery, useMutation, gql, ApolloCache } from "@apollo/client";
import toast from "react-hot-toast";
import { GET_WISHLISTS } from "../graphql/queries";
import { TOGGLE_WISHLIST } from "../graphql/mutations";
import { WishlistItem, Product, Variation } from "../types/type";

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
    images {
      id
      url
      key
    }
  }
`;

export const useWishlist = () => {
  const { data, loading, error, client } =
    useQuery<GetWishlistData>(GET_WISHLISTS);

  const [toggleWishlistMutation] = useMutation(TOGGLE_WISHLIST);

  const wishlistItems = data?.getWishlist.items || [];

  const isInWishlist = (productId: string) =>
    wishlistItems.some((item) => item.product.id === productId);

  const toggleWishlist = async (productId: string, productName: string) => {
    try {
      const alreadyInWishlist = isInWishlist(productId);

      // Read product from Apollo cache
      const productFromCache = client.readFragment<Product>({
        id: `Product:${productId}`,
        fragment: PRODUCT_FRAGMENT,
      });

      if (!productFromCache) {
        toast.error("Product data not found in cache");
        return;
      }

      // Construct full WishlistItem for optimistic update
      const optimisticItem: WishlistItem = {
        __typename: "WishlistItem",
        id: `temp-${productId}`,
        price: productFromCache.price,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        product: {
          ...productFromCache,
          __typename: "Product",
        },
        variation: null, // replace if user selects a variation
      };

      await toggleWishlistMutation({
        variables: { productId },

        optimisticResponse: {
          toggleWishlist: optimisticItem,
        },

        update: (cache: ApolloCache<GetWishlistData>) => {
          const existing = cache.readQuery<GetWishlistData>({
            query: GET_WISHLISTS,
          });
          if (!existing) return;

          let updatedItems: WishlistItem[];

          if (alreadyInWishlist) {
            // REMOVE ITEM
            updatedItems = existing.getWishlist.items.filter(
              (item) => item.product.id !== productId
            );
          } else {
            // ADD ITEM
            updatedItems = [...existing.getWishlist.items, optimisticItem];
          }

          cache.writeQuery({
            query: GET_WISHLISTS,
            data: {
              getWishlist: {
                ...existing.getWishlist,
                items: updatedItems,
              },
            },
          });
        },
      });

      toast.success(
        alreadyInWishlist
          ? `${productName} removed from wishlist`
          : `${productName} added to wishlist`
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
