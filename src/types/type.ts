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