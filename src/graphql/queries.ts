import { gql } from "@apollo/client";

export const ME_QUERY = gql`
  query {
    me {
      id
      username
      cname
      email
      contact
      location
      profileViews
      recentViewerIds
      averageRating
      isEmailVerified
      products {
        id
        name
        soldCount
        description
        material
        slug
        createdAt
        reviewCount
        averageRating
        price
        variations {
          price
          size
          color
        }
        images {
          id
          url
          key
          isPrimary
          position
        }
      }
    }
  }
`;

export const WE_QUERY = gql`
  query Me {
    we {
      id
      username
      email
      contact
      isEmailVerified
      addresses {
        id
        streetAddress
        streetAddress2
        country
        state
        city
        zipcode
      }
    }
  }
`;

export const MY_ADDRESSES = gql`
  query MyAddresses {
    myAddresses {
      id
      streetAddress
      streetAddress2
      city
      state
      country
      zipcode
    }
  }
`;

export const GET_WISHLISTS = gql`
  query {
    getWishlist {
      id
      createdAt
      updatedAt
      items {
        id
        price
        createdAt
        updatedAt
        product {
          id
          name
          description
          size
          price
          slug
          averageRating
          wishlistCount
          reviewCount
          images {
            id
            url
            key
            isPrimary
            position
          }
          category {
            id
            name
          }
        }
        variation {
          id
          size
          color
          price
        }
      }
    }
  }
`;

export const GET_MY_ADDRESSES = gql`
  query MyAddresses {
    myAddresses {
      id
      streetAddress
      streetAddress2
      city
      state
      country
      zipcode
    }
  }
`;

export const GET_CATEGORIES = gql`
  query GetCategories {
    categories {
      id
      name
      slug
    }
  }
`;

export const CATEGORY_BY_SLUG = gql`
  query ($slug: String!) {
    categoryBySlug(slug: $slug) {
      id
      name
      slug
      products {
        id
        name
        slug
        price
        reviewCount
        averageRating
        soldCount
        material
        wishlistCount
        images {
          id
          url
          key
          isPrimary
          position
        }
        category {
          name
        }
      }
      subcategories {
        id
        name
        slug
      }
    }
  }
`;
export const GET_PARENT_CATEGORIES = gql`
  query {
    parentCategories {
      id
      name
      slug
    }
  }
`;

export const GET_SUBCATEGORIES = gql`
  query GetSubcategories($parentCategoryId: String!) {
    subcategories(parentCategoryId: $parentCategoryId) {
      id
      name
    }
  }
`;

export const ALL_PRODUCTS_QUERY = gql`
  query {
    allProducts {
      id
      name
      description
      material
      soldCount
      price
      discountedPrice
      createdAt
      reviewCount
      wishlistCount
      slug
      status
      averageRating
      category {
        name
      }
      variations {
        color
        price
        size
      }
      images {
        id
        url
        key
        isPrimary
        position
      }
    }
  }
`;

export const ALL_PRODUCTS_QUERY_FOR_ADMIN = gql`
  query {
    allProductsforadmin {
      id
      name
      description
      material
      price
      soldCount
      createdAt
      reviewCount
      slug
      status
      wishlistCount
      averageRating
      category {
        name
      }
      reviews {
        sentiment
        rating
      }
      variations {
        color
        price
        size
      }
      images {
        id
        url
        key
        isPrimary
        position
      }
    }
  }
`;

export const GET_COMPANY_BY_ID = gql`
  query ($getCompanyId: String!) {
    getCompany(id: $getCompanyId) {
      id
      email
      contact
      username
      cname
      averageRating
      createdAt
      updatedAt
      location
      isEmailVerified
      reviewCount
      products {
        id
        name
        price
        soldCount
        slug
        status
        reviewCount
        averageRating
      }
      reviews {
        id
        rating
        comment
        createdAt
        user {
          id
          username
        }
      }
    }
  }
`;

export const PAGINATED_COMPANY_REVIEWS = gql`
  query CompanyReviews($id: String!, $limit: Int!, $offset: Int!) {
    companyReviews(id: $id, limit: $limit, offset: $offset) {
      items {
        id
        comment
        rating
        createdAt
        user {
          id
          username
          email
        }
      }
      total
      hasMore
    }
  }
`;

export const UPDATE_COMPANY_STATUS = gql`
  mutation UpdateCompanyStatus(
    $id: ID!
    $status: CompanyStatus!
    $statusNote: String
  ) {
    updateCompanyStatus(id: $id, status: $status, statusNote: $statusNote) {
      id
      status
      statusHistory
    }
  }
`;

export const GET_PRODUCT_BY_ID = gql`
  query ($productId: String!) {
    product(id: $productId) {
      id
      name
      soldCount
      description
      price
      size
      material
      slug
      createdAt
      category {
        id
        name
      }
      variations {
        name
        price
        size
      }
      averageRating
      reviewCount
      reviews {
        comment
        rating
        sentiment
      }
      company {
        cname
      }
      images {
        id
        url
        key
        isPrimary
        position
      }
    }
  }
`;

export const GET_PRODUCT_BY_SLUG = gql`
  query ProductBySlug($slug: String!) {
    productBySlug(slug: $slug) {
      id
      name
      description
      soldCount
      slug
      price
      discountedPrice
      size
      stock
      createdAt
      weight
      averageRating
      reviewCount
      material
      brand
      style
      type
      upc
      color
      mainStoneColor
      metal
      diamondColorGrade
      mainStoneShape
      mainStoneTreatment
      settingStyle
      itemLength
      mainStoneCreation
      totalCaratWeight
      baseMetal
      numberOfDiamonds
      shape
      theme
      chainType
      closure
      country
      charmType
      features
      personalized
      personalizeInstruction
      mpn
      signed
      vintage
      wholesale
      wishlistCount
      images {
        id
        url
        key
        isPrimary
        position
      }
      reviews {
        id
        comment
        rating
        ratingDistribution
        sentiment
        createdAt
        authorName
        user {
          id
        }
      }
      variations {
        id
        size
        color
        price
        slug
      }
      category {
        id
        name
      }
      company {
        id
        cname
      }
    }
  }
`;

export const FILTERED_PRODUCTS_QUERY = gql`
  query FilteredProducts(
    $search: String
    $category: [String!]
    $material: String
    $minPrice: Float
    $maxPrice: Float
  ) {
    filteredProducts(
      search: $search
      category: $category
      material: $material
      minPrice: $minPrice
      maxPrice: $maxPrice
    ) {
      id
      name
      description
      material
      price
      discountedPrice
      createdAt
      reviewCount
      slug
      averageRating
      wishlistCount 
      category {
        id
        name
      }
      variations {
        color
        price
        size
      }
      images {
        id
        url
        key
        isPrimary
        position
      }
    }
  }
`;

export const GET_MATERIALS = gql`
  query {
    getMaterials {
      material
    }
  }
`;

export const GET_UNIQUE_SIZES = gql`
  query {
    getUniqueSizes
  }
`;

export const GET_SELLER_ORDERS = gql`
  query {
    getSellerOrders {
      id
      createdAt
      status
      discount
      discountBreakdown
      total
      items {
        id
        createdAt
        price
        quantity
        product {
          name
          price
          company {
            id
            cname
            email
            location
            contact
          }
        }
      }
      user {
        username
        email
        contact
        addresses {
          country
          state
          city
          streetAddress
          streetAddress2
          zipcode
        }
      }
    }
  }
`;

export const PRODUCT_REVIEWS_QUERY = gql`
  query ProductReviews(
    $slug: String!
    $limit: Int!
    $offset: Int!
    $sentiment: String
  ) {
    productReviews(
      slug: $slug
      limit: $limit
      offset: $offset
      sentiment: $sentiment
    ) {
      items {
        id
        comment
        rating
        sentiment
        createdAt
        user {
          id
          username
        }
      }
      total
      hasMore
    }
  }
`;

export const GET_USER_ORDERS = gql`
  query GetOrder($id: String!) {
    getOrder(id: $id) {
      id
      status
      total
      subtotal
      createdAt
      items {
        id
        quantity
        price
        product {
          name
        }
        variation {
          size
        }
      }
    }
  }
`;

export const GET_EVERY_ORDER_BY_USER = gql`
  query GetOrders {
    getOrders {
      id
      status
      total
      createdAt
      items {
        id
        quantity
        price
        product {
          name
        }
        variation {
          size
        }
      }
    }
  }
`;

export const GET_SIMILAR_PRODUCTS = gql`
  query GetSimilarProducts($productId: String!, $category: String!) {
    getSimilarProducts(productId: $productId, category: $category) {
      category {
        name
      }
      id
      name
      slug
      soldCount
      price
      discountedPrice
      averageRating
      reviewCount
      description
      material
      images {
        id
        url
        key
        isPrimary
        position
      }
    }
  }
`;

export const GET_USERS = gql`
  query {
    users {
      id
      username
      email
      contact
      isEmailVerified
      createdAt
      updatedAt
    }
  }
`;

export const GET_USER_RATING = gql`
  query {
    userReviews {
      product {
        name
      }
      rating
    }
  }
`;

export const GET_COMPANY_USER_RATING = gql`
  query {
    userReviewCompany {
      id
      rating
      comment
      company {
        cname
      }
      createdAt
    }
  }
`;

export const GET_COMPANIES = gql`
  query {
    getCompanies {
      id
      cname
      username
      contact
      email
      location
      createdAt
      products {
        id
        name
        price
        description
        material
        size
        averageRating
        reviewCount
      }
    }
  }
`;

export const GET_CURRENTSELLER_PRODUCTS = gql`
  query {
    myProducts {
      id
      name
      description
      price
      size
      stock
      weight
      material
      slug
      variations {
        id
        color
        stock
        size
        price
      }
      createdAt
      reviewCount
      averageRating
      reviews {
        comment
        sentiment
        rating
      }
      company {
        cname
      }
      images {
        id
        url
        key
        isPrimary
        position
      }
    }
  }
`;

export const GET_ADMIN = gql`
  query {
    getadmin {
      id
      username
      email
      isEmailVerified
    }
  }
`;

export const GET_PAGINATION = gql`
  query PaginatedProducts($limit: Int!, $cursor: String) {
    paginatedProducts(limit: $limit, cursor: $cursor) {
      products {
        id
        name
        createdAt
        description
        material
        soldCount
        averageRating
        reviewCount
        reviews {
          comment
        }
        size
        price
      }
      hasMore
      nextCursor
    }
  }
`;

export const SELLER_PRODUCT_PAGINATION = gql`
  query PaginatedMyProducts($limit: Int!, $offset: Int!) {
    paginatedMyProducts(limit: $limit, offset: $offset) {
      products {
        id
        name
        createdAt
        description
        size
        stock
        slug
        price
        reviewCount
        soldCount
        averageRating
        reviews {
          comment
        }
        category {
          id
          name
        }
        images {
          id
          url
          key
          isPrimary
          position
        }
      }
      total
      hasMore
    }
  }
`;

export const GET_CART_ITEMS = gql`
  query GetCartItems {
    getCartItems {
      id
      quantity
      product {
        id
        name
        price
        description
        material
        images {
          id
          url
          key
          isPrimary
          position
        }
      }
      variation {
        id
        size
        color
        price
      }
      image {
        id
        key
        url
      }
    }
  }
`;

export const GET_CART_ITEMS_BY_USERS = gql`
  query {
    getCartItemsbyusers {
      id
      quantity
    }
  }
`;

export const GET_CART = gql`
  query GetCart {
    getCart {
      id
      createdAt
      updatedAt
      total
      user {
        id
        username
        email
        addresses {
          country
          state
          city
          streetAddress
          streetAddress2
          zipcode
        }
      }
      items {
        id
        quantity
        price
        size
        product {
          id
          name
          slug
        }
        variation {
          id
          size
          price
        }
      }
    }
  }
`;

export const GET_PRODUCT_REVIEWS = gql`
  query ProductReviews($productId: String!, $limit: Int!, $offset: Int!) {
    productReviews(productId: $productId, limit: $limit, offset: $offset) {
      items {
        id
        rating
        comment
        sentiment
        createdAt
        user {
          username
        }
      }
      total
      hasMore
    }
  }
`;

export const GET_SELLER_COUPONS = gql`
  query {
    getCompanyCoupons {
      id
      isPublic
      code
      startDate
      endDate
      currentUsage
      updatedAt
      discountPercentage
      usages {
        id
        orderId
        usedAt
        userId
      }
      company {
        id
        cname
      }
    }
  }
`;

export const GET_SELLER_CATEGORIES = gql`
  query {
    getsellerCategories {
      id
      name
      slug
      company {
        id
        cname
      }
      createdAt
    }
  }
`;

export const GET_PRODUCTS_BY_CATEGORY = gql`
  query ($name: String!) {
    productsByCategory(name: $name) {
      id
      name
      description
      slug
      soldCount
      averageRating
      reviewCount
      price
      material
      images {
        id
        url
        key
        isPrimary
        position
      }
      reviews {
        rating
      }
    }
  }
`;

export const GET_TOP_RATED_PRODUCTS = gql`
  query TopRatedProducts($limit: Int) {
    topRatedProducts(limit: $limit) {
      id
      name
      slug
      description
      material
      averageRating
      soldCount
      reviewCount
      price
      discountedPrice
      wishlistCount
      category {
        name
        slug
      }
      variations {
        id
        price
        size
        color
        slug
      }
      reviews {
        rating
      }
      images {
        id
        url
        key
        isPrimary
        position
      }
    }
  }
`;

export const GET_ALL_DISCOUNTS = gql`
  query {
    getAllDiscount {
      id
      isActive
      startDate
      endDate
      type
      value
      product {
        id
        name
      }
    }
  }
`;

export const GET_DISCOUNT_BY_ID = gql`
  query GetDiscount($id: String!) {
    discount(id: $id) {
      id
      type
      value
      thresholdAmount
      thresholdQuantity
      bogoBuy
      bogoGet
      bogoDiscount
      status
      isActive
      startDate
      endDate
      product {
        id
        name
      }
      category {
        id
        name
      }
    }
  }
`;

export const GET_COMPANY_DISCOUNTS = gql`
  query {
    getSellerDiscounts {
      id
      startDate
      endDate
      value
      thresholdAmount
      thresholdQuantity
      bogoGet
      bogoBuy
      bogoDiscount
      type
      status
      isActive
      category {
        id
        name
      }
      company {
        id
        cname
      }
      product {
        id
        name
        price
      }
    }
  }
`;

export const DISCOUNTS_BY_COMPANY = gql`
  query ($companyId: String!) {
    discountsByCompany(companyId: $companyId) {
      id
      type
      value
      thresholdAmount
      thresholdQuantity
      bogoGet
      bogoBuy
      bogoDiscount
      startDate
      endDate
      status
      isActive
    }
  }
`;

export const GET_COMPANY_FOLLOWERS = gql`
  query ($companyId: String!) {
    companyFollowers(companyId: $companyId) {
      id
      username
      country
      createdAt
    }
  }
`;

export const GET_USER_COMPANIES = gql`
  query {
    followedCompanies {
      id
      cname
    }
  }
`;

export const GET_CAMPAIGNS = gql`
  query GetCampaigns {
    getCampaigns {
      id
      name
      type
      subject
      status
      recipients
      createdAt
      lastSent
      schedule
      content
      updatedAt
    }
  }
`;

export const GET_CONVERSATION = gql`
  query ($conversationId: String!) {
    getConversation(conversationId: $conversationId) {
      id
      createdAt
      messages {
        id
        message
        createdAt
        senderType
        receiverType
      }
      company {
        id
        cname
      }
      user {
        id
        username
      }
    }
  }
`;

export const GET_SELLER_CONVO = gql`
  query ($companyId: String!) {
    getAllConversationsForSeller(companyId: $companyId) {
      id
      createdAt
      messages {
        id
        message
        createdAt
        receiverType
        senderType
      }
      user {
        id
        username
      }
      company {
        id
        cname
      }
    }
  }
`;

export const GET_USER_CONVO = gql`
  query ($userId: String!) {
    getAllConversationsForUser(userId: $userId) {
      id
      createdAt
      messages {
        id
        message
        createdAt
        senderType
        receiverType
      }
      user {
        id
        username
      }
      company {
        id
        cname
      }
    }
  }
`;

export const GET_COMPANY_VIEWS = gql`
  query GetCompanyViews($companyId: String!) {
    getCompanyProfileViews(companyId: $companyId)
  }
`;

export const GET_RECENT_VIEWERS = gql`
  query GetRecentViewers($companyId: String!) {
    getRecentCompanyViewers(companyId: $companyId) {
      id
      username
      email
    }
  }
`;

export const GET_INVOICE = gql`
  query ($invoiceId: String!) {
    getInvoice(invoiceId: $invoiceId) {
      id
      items
      metadata
      newField
      order {
        id
      }
      paidAt
      seller {
        id
        cname
        contact
        email
      }
      sentAt
      sequentialNumber
      status
      totalAmount
      updatedAt
      createdAt
      currency
      downloadCount
      invoiceNumber
      issuedAt
    }
  }
`;

export const GET_COMPANY_INVOICES = gql`
  query {
    getCompanyInvoices {
      page
      total
      totalPages
      invoices {
        id
        createdAt
        currency
        downloadCount
        invoiceNumber
        issuedAt
        items
        metadata
        newField
        order {
          id
        }
        paidAt
        seller {
          id
          cname
          contact
          email
        }
        sentAt
        sequentialNumber
        status
        totalAmount
        updatedAt
      }
    }
  }
`;

export const GET_PAYPAL_ORDER_STATUS = gql`
  query ($paypalOrderId: String!) {
    getPayPalOrderStatus(paypalOrderId: $paypalOrderId)
  }
`;
