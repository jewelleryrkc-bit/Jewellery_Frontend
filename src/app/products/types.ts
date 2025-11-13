import { ReactNode } from "react";

export interface CartItem {
    id: string;
    quantity: number;
    price: number;
    size: string | null;
    product: {
      price: ReactNode;
      name: string;
    };
    variation: {
      size: string;
      price: number;
    } | null;
  }
  
  export interface Cart {
    id: string;
    total: number;
    subtotal: number;
    discountAmount: number;
    discountCoupon: string;
    items: CartItem[];
  }