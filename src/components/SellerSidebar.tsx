import { ME_QUERY } from "../graphql/queries";
import { useQuery } from "@apollo/client";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function SellerSidebar() {
  const { data: meData } = useQuery(ME_QUERY);
  const [isOpen, setIsOpen] = useState(true);
  const username = meData?.me?.username;

  return (
    <aside
      className={`${
        isOpen ? "w-64" : "w-16"
      } h-screen bg-gray-800 text-white p-4 flex flex-col transition-all duration-300 ease-in-out relative`}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="absolute top-3 right-4 text-white bg-gray-700 rounded-full p-1 hover:bg-gray-600"
        title={isOpen ? "Collapse" : "Expand"}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      <div className="mt-8">
        {isOpen && (
          <h2 className="text-2xl font-bold mb-6 tracking-wide">Dashboard</h2>
        )}

       <nav className="space-y-1">
          <Link
            href="/dashboard"
            className={`flex items-center p-3 rounded hover:bg-gray-700 transition-colors ${
              isOpen ? "px-4" : "justify-center opacity-0 hover:opacity-100"
            }`}
            title="Dashboard"
          >
            <span className={`${isOpen ? "" : "hidden"}`}>Dashboard</span>
          </Link>
          
          <Link
            href="/auth/addproduct"
            className={`flex items-center p-3 rounded hover:bg-gray-700 transition-colors ${
              isOpen ? "px-4" : "justify-center opacity-0 hover:opacity-100"
            }`}
            title="Add Products"
          >
            <span className={`${isOpen ? "" : "hidden"}`}>Add Products</span>
          </Link>
          
          <Link
            href="/dashboard/orders"
            className={`flex items-center p-3 rounded hover:bg-gray-700 transition-colors ${
              isOpen ? "px-4" : "justify-center opacity-0 hover:opacity-100"
            }`}
            title="Orders"
          >
            <span className={`${isOpen ? "" : "hidden"}`}>Orders</span>
          </Link>
          
          <Link
            href={`/dashboard/profile/${username}`}
            className={`flex items-center p-3 rounded hover:bg-gray-700 transition-colors ${
              isOpen ? "px-4" : "justify-center opacity-0 hover:opacity-100"
            }`}
            title="Profile"
          >
            <span className={`${isOpen ? "" : "hidden"}`}>Profile</span>
          </Link>
          
          <Link
            href="/dashboard/categories"
            className={`flex items-center p-3 rounded hover:bg-gray-700 transition-colors ${
              isOpen ? "px-4" : "justify-center opacity-0 hover:opacity-100"
            }`}
            title="Categories"
          >
            <span className={`${isOpen ? "" : "hidden"}`}>Categories</span>
          </Link>
          
          <Link
            href="/dashboard/settings"
            className={`flex items-center p-3 rounded hover:bg-gray-700 transition-colors ${
              isOpen ? "px-4" : "justify-center opacity-0 hover:opacity-100"
            }`}
            title="Settings"
          >
            <span className={`${isOpen ? "" : "hidden"}`}>Settings</span>
          </Link>
        </nav>
      </div>
    </aside>
  );
}
