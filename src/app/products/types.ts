import { ReactNode } from "react";

export interface CartImage {
  id: string;
  url: string;
  key?: string;
  isPrimary?: boolean;
  position?: number;
}

export interface CartItem {
  giftMessage?: {
    recipientName: string;
    message?: string;
  } | null;
  id: string;
  quantity: number;
  price: number;
  size: string | null;
  product: {
    id: string;
    name: string;
    slug: string;
    price: number | ReactNode;
    brand: string | null;  
    images?: CartImage[];  // <-- use array, not image: string
  };
  variation: {
    size: string;
    price: number;
  } | null;
}


export interface Cart {
  availableCoupons: boolean;
  availableCoupons: boolean;
  shippingAmount: number;
  sellerProvidesShipping: boolean;
  id: string;
  total: number;
  subtotal: number;
  discountAmount: number;
  discountCoupon: string;
  items: CartItem[];
}
