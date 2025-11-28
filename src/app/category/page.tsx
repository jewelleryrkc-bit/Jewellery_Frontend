/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/category/[slug]/page.tsx
import { apolloClient } from "../../lib/apolloClient"; // ✅ match export
import { gql } from "@apollo/client";

const CATEGORY_BY_SLUG = gql`
  query CategoryBySlug($slug: String!) {
    categoryBySlug(slug: $slug) {
      id
      name
      slug
      products {
        name
        description
        slug
        averageRating
        reviewCount
        price
        material
        images {
          url
          key
        }
        reviews {
          rating
        } 
      }
    }
  }
`;



export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const { data } = await apolloClient.query({
    query: CATEGORY_BY_SLUG,
    variables: { slug: params.slug }, // ✅ This is fine in a server component
  });
  // console.log("LOADED PAGE(C:\Users\Dell\Documents\new\web2\my-app\src\app\category\page.tsx):", params?.slug);

  const category = data?.categoryBySlug;

  if (!category) {
    return <div>Category not found</div>;
  }


  return (
    <div>
      <h1>{category.name}</h1>
      <ul>
        {category.products.map((product: any) => (
          <li key={product.id}>
            {product.name} - {product.price}
          </li>
        ))}
      </ul>
    </div>
  );
}
