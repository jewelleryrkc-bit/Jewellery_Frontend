/* eslint-disable @typescript-eslint/no-explicit-any */
import { convertPrice } from "../lib/currencyConverter";
import Link from "next/link";
import { Star } from "lucide-react";
import Image from "next/image";
import { useCurrency } from "../providers/CurrencyContext";
import { formatCurrency } from "../lib/formatCurrency";

export default function ProductCard({ product }: { product: any; }) {
  const { currency } = useCurrency();
  return (
    <div className="group relative bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-all duration-300 hover:border-gray-300">
      <Link href={`/products/${product.slug}`} className="block">
        {/* Product Image */}
        <div className="aspect-square bg-gray-100 relative overflow-hidden">
          {product.images?.[0] ? (
            <Image
              src={product.images[0].url}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              priority={false}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              No Image
            </div>
          )}
          {/* Sale Badge */}
          {product.onSale && (
            <div className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full">
              SALE
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-4">
          <h3 className="text-sm font-medium text-gray-900 mb-1 line-clamp-2 h-10">
            {product.name}
          </h3>
          
          {/* Rating */}
          <div className="flex items-center mb-2">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-3 h-3 ${
                    star <= Math.floor(product.averageRating)
                      ? 'fill-amber-400 text-amber-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-gray-500 ml-1">
              ({product.reviewCount || 0})
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-2">
            <p className="text-base font-semibold text-gray-900">
              {formatCurrency(convertPrice(product.price, currency), currency)}
            </p>
            {product.originalPrice && (
              <p className="text-xs text-gray-500 line-through">
                {formatCurrency(convertPrice(product.price, currency), currency)}
              </p>
            )}
          </div>

          {/* Additional Info */}
          <div className="mt-2 flex flex-wrap gap-1">
            {product.material && (
              <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                {product.material}
              </span>
            )}
            {product.category && (
              <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                {product.category}
              </span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}