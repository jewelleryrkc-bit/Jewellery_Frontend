"use client";

import Link from "next/link";

export default function AnotherHeader() {
  return (
    <div className="flex justify-between items-center px-6 py-4 bg-white relative">
      <div className="w-1/3" />
      <div className="w-1/3 flex justify-center">
        <Link href="/" className="text-4xl font-bold text-gray-800">
          Jewelry Store
        </Link>
      </div>
      <div className="w-1/3" />
    </div>
  );
}
