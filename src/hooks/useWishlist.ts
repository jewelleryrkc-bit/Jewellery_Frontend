"use client";

import { useQuery, useMutation, gql, ApolloCache } from "@apollo/client";
import toast from "react-hot-toast";
import { GET_WISHLISTS } from "../graphql/queries";
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

  const wishlistItems = data?.getWishlist?.items || [];

  const isInWishlist = (productId: string) =>
    wishlistItems.some((item) => item.product.id === productId);

  const toggleWishlist = async (productId: string, productName: string) => {
    try {
      const alreadyInWishlist = isInWishlist(productId);

      const productFromCache = client.readFragment<Product>({
        id: `Product:${productId}`,
        fragment: PRODUCT_FRAGMENT,
      });

      if (!productFromCache) {
        toast.error("Product data not found in cache");
        return;
      }

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
        variation: null,
      };

      await toggleWishlistMutation({
        variables: { productId },

        optimisticResponse: {
          __typename: "Mutation",
          toggleWishlist: optimisticItem,
        },

        update: (cache: ApolloCache<GetWishlistData>) => {
          const existing = cache.readQuery<GetWishlistData>({
            query: GET_WISHLISTS,
          });
          if (!existing) return;

          let updatedItems: WishlistItem[];

          if (alreadyInWishlist) {
            updatedItems = existing.getWishlist.items.filter(
              (i) => i.product.id !== productId
            );
          } else {
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

      // NOW toast will work
      //   toast.success(
      //     alreadyInWishlist
      //       ? `${productName} removed from wishlist`
      //       : `${productName} added to wishlist`
      //   );
      //   console.log("check");
      const result = toast.success(
        alreadyInWishlist
          ? `${productName} removed from wishlist`
          : `${productName} added to wishlist`
      );

      console.log("Toast result:", result);
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
