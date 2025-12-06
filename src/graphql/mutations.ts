import { gql } from "@apollo/client";

export const LOGIN_MUTATION = gql`
  mutation Login($options: LoginInput!) {
    login(options: $options) {
      errors {
        field
        message
      }
      user {
        id
        username
        email
        contact
        isEmailVerified
      }
    }
  }
`;

export const REGISTER_MUTATION = gql`
  mutation Register($options: RegisterInput!) {
    register(options: $options) {
      errors {
        field
        message
      }
      user {
        id
        username
        email
        contact
        isEmailVerified
      }
    }
  }
`;

export const VERIFY_EMAIL_MUTATION = gql`
  mutation VerifyEmail($email: String!, $code: String!) {
    verifyCode(input: { email: $email, code: $code }) {
      errors {
        field
        message
      }
      user {
        id
        username
        email
        isEmailVerified
      }
    }
  }
`;

export const ME_QUERY = gql`
  query {
    me {
      id
      username
      email
      isEmailVerified
      products {
        id
        name
        price
        category {
          name
        }
        variations {
          price
          size
          color
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
      isEmailVerified
      addresses {
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

export const UPDATE_USER_FIELDS = gql`
 mutation($input: UpdateRegisterInput!, $userid: String!) {
  updateUserFields(input: $input, userid: $userid) {
    username
    email
    contact
  }
}
`;

export const UPDATE_COMPANY_FIELDS = gql`
 mutation($input: UpdateCompanyInput!, $companyid: String!) {
  updateCompanyfields(input: $input, companyid: $companyid) {
    username
    contact
    email
  }
}
`;


export const CREATE_REVIEW_COMPANY = gql`
 mutation($input: CompanyReviewInput!) {
  createCompanyReview(input: $input) {
    id
    comment
    rating
    createdAt
    company {
      cname
      averageRating
    }
    user {
      id
      username
    }
  }
}
`;

export const CREATE_PRODUCT_REPORT = gql `
 mutation($input: ProductReportInput!){
  createProductReport(input: $input) {
    id
    details
    createdAt
    reason
    status
    company {
      id
      cname
      email
    }
    product {
      id
      name
      price
      slug
    }
    reportedBy {
      id
      email
      contact
      username
    }
  }
}
`;

export const UPDATE_PRODUCT_DETAILS = gql`
 mutation($input: UpdateProductFields!, $updateProductsId: String!) {
  updateProducts(input: $input, id: $updateProductsId) {
    id
    name
    description
    price
    stock
    size
    weight
    material
  }
}
`;

export const UPDATE_PRODUCTVAR_DETAILS = gql`
 mutation($input: UpdateProductVariations!, $updateProductVarId: String!) {
  updateProductVar(input: $input, id: $updateProductVarId) {
    size
    stock
    color
    price
  }
}
`;

export const DELETE_PRODUCT = gql `
 mutation($deleteProductId: String!) {
  deleteProduct(id: $deleteProductId) {
    id
    name
  }
}
`;

export const LOGOUT_MUTATION = gql`
  mutation Logout {
    logout
  }
`;

export const DELETE_REVIEW = gql `
 mutation($reviewId: String!) {
  deleteReview(reviewId: $reviewId)
}
`;

export const ADMIN_LOGIN = gql `
 mutation($options: AdminLoginInput!) {
  adminLogin(options: $options) {
    errors {
      field
      message
    }   
  }
}
`;

export const ADMIN_LOGOUT = gql `
  mutation {
  adminLogout
}
`;

export const REGISTER_COMPANY = gql`
  mutation RegisterCompany($options: RegisterCompanyInput!) {
    registerCompany(options: $options) {
      errors {
        field
        message
      }
       company {
        id
        cname
        username
        email
        contact
        location
        isEmailVerified
     }
    }
  }
`;

export const LOGIN_COMPANY = gql`
  mutation LoginCompany($options: LoginCompanyInput!) {
    loginCompany(options: $options) {
      errors {
        field
        message
      }
      company {
        id
        cname
        email
      }
    }
  }
`;

export const VERIFY_COMPANY = gql`
  mutation VerifyCompany($email: String!, $code: String!) {
    verifyCompany(input: {email: $email,code: $code}) {
      errors {
        field
        message
      }
      company {
        id
        cname
        email
        isEmailVerified
      }
    }
  }
`;

export const CREATE_COUPON = gql `
 mutation CreateCoupon($usageLimit: Float!, $validityDays: Float!, $isPublic: Boolean!, $discountPercentage: Float!) {
  createCoupon(usageLimit: $usageLimit, validityDays: $validityDays, isPublic: $isPublic, discountPercentage: $discountPercentage) {
    id
    code
    createdAt
    updatedAt
    discountPercentage
    isPublic
    startDate
    endDate
    usageLimit
    company {
      id
      cname
    }
    usages {
      id
      orderId
      usedAt
      userId
      coupon {
        code
      }
    }
  }
}
`;

export const CREATE_CUSTOM_COUPON = gql `
 mutation createCustomCoupon($input: ManualCodeInput!) {
  createCustomCoupon(input: $input) {
    id
    code
    createdAt
    updatedAt
    discountPercentage
    isPublic
    startDate
    endDate
    usageLimit
    company {
      id
      cname
    }
    usages {
      id
      orderId
      usedAt
      userId
      coupon {
        code
      }
    }
  }
}
`;

export const APPLY_COUPON = gql`
  mutation ApplyCouponToCart($code: String!) {
    applyCouponToCart(code: $code) {
      id
      subtotal
      total
      discountAmount
      discountCoupon {
        code
        discountPercentage
      }
      items {
        id
        price
        quantity
      }
    }
  }
`;

export const CREATE_PRODUCT = gql`
  mutation($input: ProductInput!) {
    createProduct(input: $input) {
      id
      name
      description
      material
      weight
      size
      stock
      price
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
      category {
        id
        name
      }
      variations {
        color
        stock
        price
        size
      }
    }
  }
`;

export const LOGIN_ADMIN = gql `
  mutation($options: AdminLoginInput!) {
    adminLogin(options: $options) {
      admin {
        email
        username
      }
    }
  }
`;

export const ADD_TO_WISHLIST = gql`
  mutation ($productId: String!) {
    addtoWishlist(productId: $productId) {
      id
      price
      createdAt
      updatedAt
      product {
        id
        name
        description
        price
        averageRating
        size
        slug
        reviewCount
        images {
          id
          url
          key
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
`;


export const TOGGLE_WISHLIST = gql`
  mutation ToggleWishlist($productId: String!, $variationId: String) {
    toggleWishlist(productId: $productId, variationId: $variationId) {
      id
      price
      createdAt
      updatedAt
      product {
        id
        name
        slug
        price
        averageRating
        reviewCount
        images {
          id
          url
          key
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
`;



export const REMOVE_WISHLIST_ITEM = gql`
  mutation RemoveWishlistItem($itemId: String!) {
    removeWishlistItem(itemId: $itemId)
  }
`;

export const UPDATE_ORDER_STATUS = gql`
  mutation UpdateOrderStatus($orderId: String!, $status: OrderStatus!) {
    updateOrderStatus(orderId: $orderId, status: $status) {
      id
      status
    }
  }
`;

export const TOGGLE_PRODUCT_STATUS = gql`
 mutation ToggleProductStatus($status: ProductStatus!, $productId: String!) {
  toggleProductStatus(status: $status, productId: $productId)
}
`;

export const CREATE_USER_ADDRESS = gql`
  mutation CreateUserAddress($input: UserAddressInput!) {
    createUserAddress(input: $input) {
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

export const REGISTER_ADMIN = gql `
  mutation($options: AdminregInput!) {
    adminregister(options: $options) {
      admin {
        id
        username
        email
        isEmailVerified
      }
      errors {
        field
        message
      }
    }
  }
`;

export const CREATE_PRODUCT_VARIATION = gql `
 mutation($productId: String!, $price: Float!, $color: String!, $size: String!) {
  createProductVariation(productId: $productId, price: $price, color: $color, size: $size) {
    price
    size
    color
  }
}
`;

export const CREATE_ORDER = gql`
  mutation {
    createOrder {
      id
      total
      status
      createdAt
      estimatedDeliveryDate
      updatedAt
      user {
        id
        username
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
          price
        }
        variation {
          id
          name
          size
          price
        }
      }
    }
  }
`;

export const VERIFY_ADMINCODE = gql `
  mutation {
    adminCode(options: $options) {
      errors {
        field
        message
      }
      admin {
        id
        username
        email
        isEmailVerified
      }
    }
  }
`;

export const REMOVE_FROM_CART = gql`
  mutation RemoveFromCart($itemId: ID!) {
    removeFromCart(itemId: $itemId)
  }
`;

export const UPDATE_CART_ITEM = gql`
  mutation UpdateCartItem($itemId: String!, $quantity: Int!) {
    updateCartItem(itemId: $itemId, quantity: $quantity) {
      id
      quantity
      price
    }
  }
`;

export const CLEAR_CART = gql`
  mutation ClearCart {
    clearCart
  }
`;

export const ADD_TO_CART = gql`
  mutation AddToCart($productId: String!, $quantity: Float!, $variationId: String) {
    addToCart(productId: $productId, quantity: $quantity, variationId: $variationId) {
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
`;

// export const ADD_TO_CART = gql`
//   mutation AddToCart($productId: String!, $variationId: String, $quantity: Float!) {
//     addToCart(productId: $productId, variationId: $variationId, quantity: $quantity) {
//       id
//       quantity
//       product {
//         id
//         name
//         slug
//         price
//       }
//       variation {
//         id
//         size
//         color
//         price
//       }
//     }
//   }
// `;

// export const ADD_TO_CART = gql`
//   mutation AddToCart($productId: ID!, $variationId: ID, $quantity: Float!) {
//     addToCart(productId: $productId, variationId: $variationId, quantity: $quantity) {
//       id
//       product {
//         id
//         name
//       }
//       variation {
//         id
//         size
//         color
//         price
//       }
//       quantity
//     }
//   }
// `;

export const UPDATE_ADDRESS = gql`
 mutation($input: UpdateUserAddressInput!, $updateUserAddressId: String!) {
  updateUserAddress(input: $input, id: $updateUserAddressId) {
    country
    state
    city
    streetAddress
    streetAddress2
    zipcode
    user {
      id
      username
    }
  }
}
`;

export const CREATE_REVIEW = gql `
 mutation($input: ReviewInput!) {
    createReview(input: $input) {
      id
      comment
      rating
      createdAt
      sentiment
      user {
        id
        username
      }
      product {
        id
        name
        averageRating
        reviewCount
      }
    }
  }
`;

export const CREATE_DISCOUNT = gql `
  mutation CreateDiscount($input: DiscountInput!) {
    createDiscount(input: $input) {
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

export const UPDATE_DISCOUNT = gql `
 mutation UpdateDiscount($id: ID!, $input: DiscountInput!) {
  updateDiscount(id: $id, input: $input) {
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
  }
}
`;

export const DELETE_DISCOUNT = gql `
 mutation DeleteDiscount($id: String!) {
  deleteDiscount(id: $id)
}
`;

export const ACTIVE_DISCOUNT = gql `
  mutation ActivateDiscount($id: ID!) {
  activateDiscount(id: $id) {
    id
    isActive
    status
  }
}
`;

export const DEACTIVATE_DISCOUNT = gql `
 mutation DeactivateDiscount($id: String!) {
  deactivateDiscount(id: $id) {
    id
    isActive
    status
  }
}
`;

export const CREATE_DISCOUNT_PT2 = gql `
 mutation($input: DiscountInput!) {
  createDiscountpt2(input: $input) {
    id
    isActive
    startDate
    endDate
    status
    bogoBuy
    bogoDiscount
    bogoGet
    category {
      id
      name
    }
    company {
      id
      cname
      cname
    }
    product {
      id
      name
      price
    }
    thresholdAmount
    thresholdQuantity
  }
}
`;

export const CREATE_SELLER_CATEGORY = gql `
 mutation($input: SellerCatInput!) {
  createSellerCategory(input: $input) {
    sellercategories {
      id
      name
      slug
      createdAt
      company {
        id
        cname
      }
    }
  }
}
`;

export const APPLY_DISCOUNT_TO_CATEGORY_PRODUCTS = gql `
 mutation($categoryId: String!, $discountId: String!) {
  applyDiscountonCategory(categoryId: $categoryId, discountId: $discountId) {
    id
    category {
      id
      name
    }
    subcategory {
      id
      name
    }
  }
}
`;

export const FOLLOW_COMPANY = gql `
 mutation($companyId: String!) {
  followCompany(companyId: $companyId)
}
`;

export const UNFOLLOW_COMPANY = gql `
 mutation($companyId: String!) {
  unfollowCompany(companyId: $companyId)
}
`;

export const CREATE_CAMPAIGN = gql `
 mutation CreateCampaign($schedule: String!, $content: String!, $subject: String!, $type: String!, $name: String!) {
  createCampaign(schedule: $schedule, content: $content, subject: $subject, type: $type, name: $name) {
    id
    name
    company {
      id
      cname
      email
    }
    content
    lastSent
    recipients
    schedule
    status
    subject
    type
    updatedAt
  }
}
`;

export const SEND_CAMPAIGN = gql `
 mutation SendCampaign($campaignId: String!) {
  sendCampaign(campaignId: $campaignId)
}
`;

export const SEND_COUPON = gql `
 mutation($subject: String!, $couponcode: String!) {
  sendCoupon(subject: $subject, couponcode: $couponcode)
}
`;

export const SEND_MESSAGE = gql `
 mutation($input: SendMessageInput!) {
  sendMessage(input: $input) {
    id
    message
    senderType
    receiverType
    createdAt
  }
}
`;

export const MARK_MESSAGES_AS_READ = gql `
 mutation MarkMessagesAsRead($conversationId: String!, $readerType: SenderType!) {
  markMessagesAsRead(conversationId: $conversationId, readerType: $readerType)
}
`;

export const DELETE_SELLER_MESSAGES = gql `
 mutation($conversationId: String!) {
  deleteConversation(conversationId: $conversationId) {
    id
  }
}
`; 

export const CREATE_POSTS_WITH_IMAGE = gql`
  mutation CreatePostWithImage($title: String!, $fileBase64: String!) {
    createPostWithBase64(title: $title, fileBase64: $fileBase64) {
      id
      title
      imageUrl
    }
  }
`;

export const GENERATE_UPLOAD_URL = gql`
  mutation GenerateUploadUrl($filename: String!, $contentType: String!) {
    generateUploadUrl(filename: $filename, contentType: $contentType)
  }
`;

export const TRACK_COMPANY_VIEW = gql`
  mutation TrackCompanyView($companyId: String!) {
    trackCompanyView(companyId: $companyId)
  }
`;

export const GENERATE_INVOICE_BY_ORDER = gql `
 mutation($orderId: String!) {
  createInvoice(orderId: $orderId) {
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

export const GENERATE_INVOICE_BY_DATE = gql `
 mutation($endDate: DateTimeISO!, $startDate: DateTimeISO!, $sellerId: String!) {
  generateInvoicesByDate(endDate: $endDate, startDate: $startDate, sellerId: $sellerId)
}
`;

export const UPDATE_INVOICE_STATUS = gql `
 mutation($status: String!, $invoiceId: String!) {
  updateInvoiceStatus(status: $status, invoiceId: $invoiceId) {
    id
    status
    invoiceNumber
  }
}
`;

export const RECORD_INVOICE_DOWNLOAD = gql `
 mutation($invoiceId: String!) {
  recordInvoiceDownload(invoiceId: $invoiceId)
}
`;

export const CREATE_PAYPAL_CHECKOUT = gql ` 
 mutation($orderId: String!, $amount: Float!) {
  createPayPalCheckout(orderId: $orderId, amount: $amount)
}
`;

export const CAPTURE_PAYPAL_PAYMENT = gql `
 mutation($paypalOrderId: String!) {
  capturePayPalPayment(paypalOrderId: $paypalOrderId)
}
`;

export const COMPLETE_PAYPAL_PAYMENT = gql `
 mutation($orderId: String!) {
  completePayPalPayment(orderId: $orderId) {
    id
    status
    subtotal
    total
    discount
    discountBreakdown
    estimatedDileveryDate
    createdAt
    updatedAt
    items{
      id
      quantity
      size
      price
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

export const CREATE_CHECKOUT_WITH_PAYPAL = gql `
 mutation {
  checkoutWithPayPal
}
`;

export const CREATE_ORDERR = gql`
  mutation {
    createOrderr {
      id
      total
      subtotal
      status
      createdAt
      estimatedDeliveryDate
      updatedAt
      user {
        id
        username
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
          price
        }
        variation {
          id
          name
          size
          price
        }
      }
    }
  }
`;