"use client";

import {
  Eye,
  DollarSign,
  ShoppingCart,
  ShoppingBag,
  Star,
  MapPin,
} from "lucide-react";

type SellerPanelHeaderProps = {
  profileViews: number;          // listingViews(90d) from sellerStats
  totalSales: number;            // salesAmount(90d) from sellerStats
  orders90d: number;             // ordersCount(90d) from sellerStats
  cname?: string | null;
  username?: string | null;
  averageRating?: number | null;
  location?: string | null;
};

export default function SellerPanelHeader({
  profileViews,
  totalSales,
  orders90d,
  cname,
  username,
  averageRating,
  location,
}: SellerPanelHeaderProps) {
  const rating = averageRating ?? 0;
  const storeName = cname || username || "My Store";

  return (
    <div className="px-4 md:px-6 lg:px-8 mt-4">
      <div className="bg-white border border-gray-200 rounded-xl px-6 py-5 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* LEFT: title + seller name + rating/location */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">Seller Panel</h1>
            <span className="px-3 py-1 text-xs font-semibold rounded-full bg-indigo-100 text-indigo-700">
              {storeName}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600">
            {/* Rating */}
            <div className="flex items-center gap-1">
              <div className="flex">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.round(rating)
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }`}
                    fill="currentColor"
                  />
                ))}
              </div>
              <span className="font-semibold">{rating.toFixed(1)}</span>
              <span>rating</span>
            </div>

            {/* Location */}
            {location && (
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4 text-gray-500" />
                <span>{location}</span>
              </div>
            )}
          </div>
        </div>

        {/* MIDDLE: 3 compact stats like your screenshot */}
        <div className="flex flex-col sm:flex-row border-y sm:border-y-0 sm:border-x border-gray-200 py-3 sm:py-0 sm:px-6 divide-y sm:divide-y-0 sm:divide-x divide-gray-200 text-sm">
          {/* Listing views (90d) */}
          <div className="flex items-center gap-2 px-4 py-2">
            <Eye className="h-4 w-4 text-gray-700" />
            <div className="leading-tight">
              <div className="font-semibold text-gray-900">
                {profileViews.toLocaleString()}
              </div>
              <div className="text-[11px] text-gray-500">
                Listing views (90d)
              </div>
            </div>
          </div>

          {/* Sales (90d) */}
          <div className="flex items-center gap-2 px-4 py-2">
            <DollarSign className="h-4 w-4 text-gray-700" />
            <div className="leading-tight">
              <div className="font-semibold text-gray-900">
                USD {totalSales.toFixed(2)}
              </div>
              <div className="text-[11px] text-gray-500">
                Sales (90d)
              </div>
            </div>
          </div>

          {/* Orders (90d) */}
          <div className="flex items-center gap-2 px-4 py-2">
            <ShoppingCart className="h-4 w-4 text-gray-700" />
            <div className="leading-tight">
              <div className="font-semibold text-gray-900">
                {orders90d}
              </div>
              <div className="text-[11px] text-gray-500">
                Orders (90d)
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: Store pill */}
        <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl border border-gray-200">
          <ShoppingBag className="h-7 w-7 text-indigo-600" />
          <div className="text-right">
            <p className="text-xs text-gray-500">Store</p>
            <p className="text-sm font-semibold text-gray-800 truncate max-w-[140px]">
              {storeName}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
