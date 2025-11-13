import Head from 'next/head';

interface Product {
  id: string;
  slug: string;
  name: string;
  description?: string;
  imageUrl?: string;
  price?: number;
  averageRating?: number;
  reviewCount?: number;
  material?: string;
  category?: {
    name: string;
    slug?: string;
  };
  company?: {
    cname: string;
    id?: string;
  };
  stock?: number;
}

interface SEOProps {
  title?: string;
  description?: string;
  url?: string;
  product?: Product;
  isReviewsPage?: boolean;
  isProductList?: boolean;
  products?: Product[];
  searchQuery?: string;
  noIndex?: boolean;
}

export default function SEO({
  title,
  description,
  url = '',
  product,
  isReviewsPage = false,
  isProductList = false,
  products = [],
  searchQuery,
  noIndex = false
}: SEOProps) {
  const siteName = "Jewelry World";
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://yourstore.com";
  const fullUrl = `${baseUrl}${url}`;
  const defaultImage = `${baseUrl}/default-og.jpg`;

  // Dynamic metadata generation with proper null checks
  const seoTitle = title || 
    (isReviewsPage && product ? `${product.name} Reviews | ${siteName}` :
    product ? `${product.name} | ${siteName}` :
    searchQuery ? `Search: "${searchQuery}" | ${siteName}` :
    siteName);

  const seoDescription = description ||
    (isReviewsPage && product ? `Customer reviews for ${product.name}. Average rating: ${product.averageRating?.toFixed(1)}/5` :
    product ? product.description || `Premium ${product.material} jewelry by ${product.company?.cname || siteName}` :
    searchQuery ? `Search results for "${searchQuery}" in our jewelry collection` :
    "Discover our premium jewelry collection");

  const seoImage = product?.imageUrl || defaultImage;

  // Generate structured data with proper null checks
  const structuredData = {
    "@context": "https://schema.org",
    ...(product ? {
      "@type": "Product",
      name: product.name,
      image: seoImage,
      description: seoDescription,
      brand: {
        "@type": "Brand",
        name: product.company?.cname || siteName
      },
      offers: {
        "@type": "Offer",
        price: product.price,
        priceCurrency: "USD",
        availability: product.stock ? "InStock" : "OutOfStock",
        url: fullUrl
      },
      ...(product.averageRating && {
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: product.averageRating,
          reviewCount: product.reviewCount || 0,
          bestRating: "5",
          worstRating: "1"
        }
      })
    } : isProductList ? {
      "@type": "ItemList",
      itemListElement: products.map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "Product",
          url: `${baseUrl}/products/${p.slug}`,
          name: p.name,
          image: p.imageUrl || defaultImage
        }
      }))
    } : {
      "@type": "WebSite",
      name: siteName,
      url: baseUrl
    })
  };

  return (
    <Head>
      {/* Core */}
      <title>{seoTitle}</title>
      <meta name="description" content={seoDescription} />
      {noIndex && <meta name="robots" content="noindex,nofollow" />}
      <link rel="canonical" href={fullUrl} />

      {/* Open Graph */}
      <meta property="og:title" content={seoTitle} />
      <meta property="og:description" content={seoDescription} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:type" content={product ? "product" : "website"} />
      <meta property="og:image" content={seoImage} />
      <meta property="og:site_name" content={siteName} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={seoTitle} />
      <meta name="twitter:description" content={seoDescription} />
      <meta name="twitter:image" content={seoImage} />

      {/* Schema.org */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Head>
  );
}