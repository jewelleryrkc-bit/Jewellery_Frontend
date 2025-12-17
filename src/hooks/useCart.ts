/* eslint-disable @typescript-eslint/no-explicit-any */
// src/hooks/useCart.ts
"use client";

import { useQuery } from "@apollo/client";
import { GET_CART } from "../graphql/queries";

export const useCart = () => {
  const { data, loading, error } = useQuery(GET_CART);
  const cart = data?.getCart;
  const items = cart?.items || [];

  // if you want total quantity (sum), use reduce instead of length
  const itemCount = items.reduce(
    (sum: number, item: any) => sum + (item.quantity ?? 1),
    0
  );

  return { cart, items, itemCount, loading, error };
};
