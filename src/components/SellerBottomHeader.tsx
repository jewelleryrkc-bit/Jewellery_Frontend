"use client";
import { ME_QUERY } from "../graphql/queries";
import { useQuery } from "@apollo/client";
import Link from "next/link";

export default function SellerbottomHeader() {
  const { data: meData } = useQuery(ME_QUERY);
  const username = meData?.me?.username;

  return (
    <nav className="hidden md:flex left-0 right-0 border-gray-200 justify-around items-center py-2 z-50 bg-white shadow-sm relative">
      <NavItem href="/dashboard" label="Overview" />
      <NavItem href="/dashboard/products/addproduct" label="Add Product" />

      {/* Listings dropdown */}
      <div className="relative group">
        <div className="flex flex-col items-center p-2 text-gray-700 hover:text-blue-600 transition-colors cursor-pointer">
          <span className="text-sm">Listings</span>
        </div>
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-48 bg-white shadow-lg rounded-md border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
          <DropdownItem href="/dashboard/products" label="Your Products" />
        </div>
      </div>

      {/* Marketing dropdown */}
      <div className="relative group">
        <div className="flex flex-col items-center p-2 text-gray-700 hover:text-blue-600 transition-colors cursor-pointer">
          <span className="text-sm">Marketing</span>
        </div>
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-48 bg-white shadow-lg rounded-md border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
          <DropdownItem href="/dashboard/marketing/coupons" label="Coupons" />
          <DropdownItem href="/dashboard/marketing/discount" label="Discounts" />
          <DropdownItem href="/dashboard/marketing/analytics" label="Analytics" />
          <DropdownItem href="" label="Groups" />
        </div>
      </div>

      {/* Store dropdown */}
      <div className="relative group">
        <div className="flex flex-col items-center p-2 text-gray-700 hover:text-blue-600 transition-colors cursor-pointer">
          <span className="text-sm">Store</span>
        </div>
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-48 bg-white shadow-lg rounded-md border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
          <DropdownItem href="/dashboard/store/editstore" label="Edit store" />
          <DropdownItem href="/dashboard/store/storeCategories" label="Store categories" />
          <DropdownItem href="/dashboard/store/store-traffic" label="Store traffic" />
          <DropdownItem href="/dashboard/store/newsletter" label="Store newsletter" />
          <DropdownItem href="/dashboard/store/socials" label="Social" />
          <DropdownItem href="/dashboard/store/subscriber-discount" label="Subscriber discounts" />
          <DropdownItem href="/dashboard/store/subscription" label="Manage subscription" />
          <DropdownItem href="/dashboard/store/timeaway" label="Time away" />
        </div>
      </div>

      <NavItem href="/dashboard/orders" label="Orders" />
      <NavItem href="/dashboard/categories" label="Performance" />
      <NavItem href="/dashboard/categories" label="Payments" />

      {/* Account dropdown */}
      <div className="relative group">
        <div className="flex flex-col items-center p-2 text-gray-700 hover:text-blue-600 transition-colors cursor-pointer">
          <span className="text-sm">Account</span>
        </div>
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-48 bg-white shadow-lg rounded-md border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
          <DropdownItem href={`/dashboard/profile/${username}`} label="Your Profile" />
        </div>
      </div>

      {/* Research dropdown */}
      <div className="relative group">
        <div className="flex flex-col items-center p-2 text-gray-700 hover:text-blue-600 transition-colors cursor-pointer">
          <span className="text-sm">Research</span>
        </div>
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-48 bg-white shadow-lg rounded-md border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
          <DropdownItem href="/dashboard/research/product-research" label="Product research" />
          <DropdownItem href="/dashboard/research/sourcing-insights" label="Sourcing Insights" />
        </div>
      </div>

      <NavItem href="/dashboard/settings" label="More" />
    </nav>
  );
}

function NavItem({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="flex flex-col items-center p-2 text-gray-700 hover:text-blue-600 transition-colors"
    >
      <span className="text-sm">{label}</span>
    </Link>
  );
}

function DropdownItem({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
    >
      {label}
    </Link>
  );
}
