/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Range } from "react-range";
import { useCurrency } from "../providers/CurrencyContext";
import { convertPrice } from "../lib/currencyConverter";
import { SlidersHorizontal } from "lucide-react";
import { useQuery } from "@apollo/client";
import { GET_COMPANIES, GET_PARENT_CATEGORIES } from "../graphql/queries";
import Link from "next/link";

const MAX_PRICE = 10000;

const priceRanges = [
  { label: "Under 100", min: 0, max: 100 },
  { label: "100 - 500", min: 100, max: 500 },
  { label: "500 - 1000", min: 500, max: 1000 },
  { label: "1000 - 5000", min: 1000, max: 5000 },
  { label: "Over 5000", min: 5000, max: MAX_PRICE },
];

export default function Slidebar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { currency } = useCurrency();
  const [isMobile, setIsMobile] = useState(false);
  const [isOpen, setIsOpen] = useState(!isMobile);

  // Fetch categories
  const { 
    data: categoriesData, 
    loading: categoriesLoading, 
    error: categoriesError 
  } = useQuery(GET_PARENT_CATEGORIES);
  const categories = categoriesData?.parentCategories || [];

  const {
    data: companyData
  } = useQuery(GET_COMPANIES);

  const companies = companyData?.getCompanies || [];

  // Initialize state from URL params
  const initialMinPrice = searchParams.get("minPrice") 
    ? parseInt(searchParams.get("minPrice")!, 10) 
    : 0;
  const initialMaxPrice = searchParams.get("maxPrice") 
    ? parseInt(searchParams.get("maxPrice")!, 10) 
    : MAX_PRICE;
  const initialCategories = searchParams.get("category") 
    ? searchParams.get("category")!.split(',') 
    : [];

  // State management
  const [priceRange, setPriceRange] = useState([initialMinPrice, initialMaxPrice]);
  const [selectedRanges, setSelectedRanges] = useState<number[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(initialCategories);

  // Responsive behavior
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      setIsOpen(window.innerWidth >= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    
    params.set("minPrice", priceRange[0].toString());
    params.set("maxPrice", priceRange[1].toString());
    
    if (selectedCategories.length > 0) {
      params.set("category", selectedCategories.join(','));
    } else {
      params.delete("category");
    }
    
    router.push(`?${params.toString()}`);
  }, [priceRange, selectedCategories, router, searchParams]);

  // Update price range when predefined ranges are selected
  useEffect(() => {
    if (selectedRanges.length > 0) {
      const min = Math.min(...selectedRanges.map(i => priceRanges[i].min));
      const max = Math.max(...selectedRanges.map(i => priceRanges[i].max));
      setPriceRange([min, max]);
    }
  }, [selectedRanges]);

  // Handler functions
  const handleCheckboxChange = (index: number) => {
    setSelectedRanges(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index) 
        : [...prev, index]
    );
  };

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const resetFilters = () => {
    setPriceRange([0, MAX_PRICE]);
    setSelectedRanges([]);
    setSelectedCategories([]);
  };

  return (
    <>
      {isMobile && isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" />
      )}

      <aside
        className={`
          ${isOpen ? 'w-72' : 'w-16'} 
          ${isMobile ? 'fixed' : 'relative'}
          bg-gray-200 text-black p-5 flex flex-col 
          transition-all duration-300 ease-in-out z-50
          ${isMobile && !isOpen ? '-translate-x-full md:translate-x-0' : ''}
          overflow-y-auto
        `}
        style={isMobile && isOpen ? { height: '100vh' } : { height: 'auto', minHeight: '100%' }}
      >
        <nav className="space-y-6">
          {isOpen && (
            <div className="mt-3 px-3 space-y-6">
              {/* Categories Section */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="text-md font-semibold">Categories</h3>
                </div>
                
                {categoriesLoading ? (
                  <div className="text-sm">Loading categories...</div>
                ) : categoriesError ? (
                  <div className="text-sm text-red-300">Error loading categories</div>
                ) : (
                  <div className="space-y-4 max-h-60 overflow-y-auto">
                    {categories.map((category: any) => (
                      <label key={category.id} className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(category.id)}
                          onChange={() => handleCategoryChange(category.id)}
                          className="w-4 h-4 rounded text-blue-500 focus:ring-blue-400"
                        />
                        <span className="text-sm">
                          {category.name}
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Price Filter Section */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <h3 className="text-md font-semibold">Price Categories</h3>
                </div>
                
                <div className="space-y-3">
                  {priceRanges.map((range, index) => (
                    <label key={index} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedRanges.includes(index)}
                        onChange={() => handleCheckboxChange(index)}
                        className="w-4 h-4 rounded text-blue-500 focus:ring-blue-400"
                      />
                      <span className="text-sm">
                        {currency} {range.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
              
              {/* Range Slider */}
              <div className="space-y-2">
                <h3 className="text-md font-semibold">Price Range</h3>
                
                <div className="text-left text-sm mb-2">
                  {currency} {convertPrice(priceRange[0], currency).toFixed(2)} -{" "}
                  {currency} {convertPrice(priceRange[1], currency).toFixed(2)}
                </div>
                
                <>
                <Range
                  step={100}
                  min={0}
                  max={MAX_PRICE}
                  values={priceRange}
                  onChange={(values) => {
                    setPriceRange(values);
                    setSelectedRanges([]);
                  }}
                  renderTrack={({ props, children }) => (
                    <div
                      {...props}
                      className="h-2 mt-3 bg-gray-400 rounded-full relative"
                    >
                      {children}
                    </div>
                  )}
                  
                  renderThumb={({ props }) => {
                    const { key, ...restProps } = props;
                    return (
                      <div
                        key={key}
                        {...restProps}
                        className="w-5 h-5 bg-blue-500 rounded-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-300"
                      />
                    );
                  }}
                  
                />
                </>
                
                <button 
                  onClick={resetFilters}
                  className="text-xs mt-3 text-blue-600 hover:text-blue-400"
                >
                  Reset All Filters
                </button>
              </div>
              <div className="space-y-3">
                <div>
                 <h3 className="text-md font-semibold">Top Brands</h3>
                </div>
                {categoriesLoading ? (
                  <div className="text-sm">Loading brands...</div>
                ) : categoriesError ? (
                  <div className="text-sm text-red-300">Error loading brands</div>
                ) : (
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {companies.map((company: any) => (
                      <label key={company.id} className="flex items-center space-x-2 cursor-pointer">
                        <Link 
                          href={`/seller/${company.id}`} 
                          className="text-sm hover:text-blue-600"
                        >
                          {company.cname.charAt(0).toUpperCase() + company.cname.slice(1)}
                        </Link>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </nav>
      </aside>

      {/* Mobile toggle button */}
      {isMobile && !isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 left-6 z-40 bg-gray-600 text-white p-3.5 rounded-full shadow-lg md:hidden"
          aria-label="Open filters"
        >
          <SlidersHorizontal className="h-7 w-7" />
        </button>
      )}
    </>
  );
}