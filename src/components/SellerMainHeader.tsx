"use client";

import TopHeader from "./TopHeader";
import SearchBar from "./SearchBar";
import SellerBottomHeader from "./SellerBottomHeader";

interface HeaderProps {
  onSellerSearch?: (value: string) => void;
}

export default function Header({ onSellerSearch }: HeaderProps) {
  return (
    <header className="w-full shadow-sm">
      {/* Top navigation bar (account, currency, etc.) */}
      <TopHeader />

      {/* Search bar with brand */}
      <SearchBar onSellerSearch={onSellerSearch ?? (() => {})} />

      {/* Seller dashboard navigation */}
      <div>
        <SellerBottomHeader />
      </div>
    </header>
  );
}
