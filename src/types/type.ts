export type ProductImageInput = {
  url: string;
  key: string;
};

export interface ProductImage {
  id?: string;
  url: string;
  key: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  price: number;
  size: string;
  weight?: string;
  description: string;
  material?: string;
  averageRating?: string;
  reviewCount?: number;
  images?: ProductImage[]; 
  __typename?: string;
}

export interface Variation {
  id: string;
  price: number;
  size: string;
  color: string;
  __typename?: string;
}

export interface WishlistItem {
  id: string;
  price: number;
  createdAt?: string;
  updatedAt?: string;
  product: Product;
  variation: Variation | null;
  __typename?: string;
}


export interface Wishlist {
    variation: {
       id: string;
       price: number;
       size: string;
       color: string;
    };
    id: string;
    product: {
      slug: string;
      id: string;
      name: string;
      price: number;
      size: string;
      weight: string;
      description: string;
      material: string;
      averageRating: string;
      images?: ProductImage[];
    }
  }

  
  export enum ReportReason {
    COUNTERFEIT = 'COUNTERFEIT',
    INAPPROPRIATE = 'INAPPROPRIATE',
    WRONG_DESCRIPTION = "WRONG_DESCRIPTION",
    OTHER = 'OTHER',
    FAKE_PRODUCT = "FAKE_PRODUCT",
  }
  
  export enum ReportStatus {
    OPEN = 'OPEN',
    RESOLVED = 'RESOLVED',
    REJECTED = 'REJECTED',
  }
  
  export enum CompanyStatus {
    ACTIVE = 'ACTIVE',
    WARNED = 'WARNED',
    RESTRICTED = 'RESTRICTED',
    BANNED = 'BANNED',
  }