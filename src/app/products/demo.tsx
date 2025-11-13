// /* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable @typescript-eslint/no-unused-vars */
// "use client";

// import { useRouter, useSearchParams } from "next/navigation";
// import { useState, useEffect } from "react";
// import { Range } from "react-range";
// import { useCurrency } from "../providers/CurrencyContext";
// import { convertPrice } from "../lib/currencyConverter";
// import { SlidersHorizontal } from "lucide-react";
// import { useQuery } from "@apollo/client";
// import { GET_PARENT_CATEGORIES } from "../graphql/queries";

// const MAX_PRICE = 10000;
// const MAX_RATING = 5;

// const priceRanges = [
//   { label: " Under 100", min: 0, max: 100 },
//   { label: " 100 - 500", min: 100, max: 500 },
//   { label: " 500 - 1000", min: 500, max: 1000 },
//   { label: " 1000 - 5000", min: 1000, max: 5000 },
//   { label: " Over 5000", min: 5000, max: MAX_PRICE },
// ];

// export default function Slidebar() {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const [isMobile, setIsMobile] = useState(false);

//   const { data: categoriesData, loading: categoriesLoading, error: categoriesError } = useQuery(GET_PARENT_CATEGORIES);
//   const categories = categoriesData?.parentCategories || [];

//   useEffect(() => {
//     const checkMobile = () => {
//       setIsMobile(window.innerWidth < 768);
//     };
//     checkMobile();
//     window.addEventListener('resize', checkMobile);
//     return () => window.removeEventListener('resize', checkMobile);
//   }, []);

//   // Initialize state from URL params
//   const initialMinPrice = searchParams.get("minPrice")
//     ? parseInt(searchParams.get("minPrice")!, 10)
//     : 0;
//   const initialMaxPrice = searchParams.get("maxPrice")
//     ? parseInt(searchParams.get("maxPrice")!, 10)
//     : MAX_PRICE;
//   const initialMinRating = searchParams.get("minRating")
//     ? parseFloat(searchParams.get("minRating")!)
//     : 0;
//   const initialMaxRating = searchParams.get("maxRating")
//     ? parseFloat(searchParams.get("maxRating")!)
//     : MAX_RATING;
//   const initialCategories = searchParams.get("category") 
//     ? searchParams.get("category")!.split(',') 
//     : [];

//   const [priceRange, setPriceRange] = useState([initialMinPrice, initialMaxPrice]);
//   const [ratingRange, setRatingRange] = useState([initialMinRating, initialMaxRating]);
//   const [selectedRanges, setSelectedRanges] = useState<number[]>([]);
//   const [selectedCategories, setSelectedCategories] = useState<string[]>(initialCategories);
//   const [isOpen, setIsOpen] = useState(!isMobile);

//   const { currency } = useCurrency();

//   useEffect(() => {
//     const params = new URLSearchParams(searchParams.toString());
    
//     // Price filters
//     params.set("minPrice", priceRange[0].toString());
//     params.set("maxPrice", priceRange[1].toString());
    
//     // Rating filters
//     params.set("minRating", ratingRange[0].toString());
//     params.set("maxRating", ratingRange[1].toString());
    
//     // Category filters
//     if (selectedCategories.length > 0) {
//       params.set("category", selectedCategories.join(','));
//     } else {
//       params.delete("category");
//     }
    
//     router.push(`?${params.toString()}`);
//   }, [priceRange, ratingRange, selectedCategories, router, searchParams]);

//   useEffect(() => {
//     if (selectedRanges.length > 0) {
//       const min = Math.min(...selectedRanges.map(i => priceRanges[i].min));
//       const max = Math.max(...selectedRanges.map(i => priceRanges[i].max));
//       setPriceRange([min, max]);
//     }
//   }, [selectedRanges]);

//   const handleCheckboxChange = (index: number) => {
//     setSelectedRanges(prev => {
//       if (prev.includes(index)) {
//         return prev.filter(i => i !== index);
//       } else {
//         return [...prev, index];
//       }
//     });
//   };

//   const handleCategoryChange = (categoryId: string) => {
//     setSelectedCategories(prev => 
//       prev.includes(categoryId) 
//         ? prev.filter(id => id !== categoryId)
//         : [...prev, categoryId]
//     );
//   };

//   const resetFilters = () => {
//     setPriceRange([0, MAX_PRICE]);
//     setRatingRange([0, MAX_RATING]);
//     setSelectedRanges([]);
//     setSelectedCategories([]);
//   };

//   return (
//     <>
//       {isMobile && isOpen && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" />
//       )}

//       <aside
//         className={`
//           ${isOpen ? 'w-64' : 'w-16'} 
//           ${isMobile ? 'fixed' : 'relative'}
//           h-screen bg-gray-600 text-white p-4 flex flex-col transition-all duration-300 ease-in-out z-50
//           ${isMobile && !isOpen ? '-translate-x-full md:translate-x-0' : ''}
//         `}
//       >
//         <nav className="space-y-4">
//           {isOpen && (
//             <div className="mt-2 px-2 space-y-4">
//               {/* Categories Section */}
//               <div>
//                 <div className="flex justify-between items-center mb-2">
//                   <h3 className="text-md font-medium">Categories</h3>
//                 </div>
//                 {categoriesLoading ? (
//                   <div className="text-sm">Loading categories...</div>
//                 ) : categoriesError ? (
//                   <div className="text-sm text-red-300">Error loading categories</div>
//                 ) : (
//                   <div className="mt-4 space-y-2 max-h-60 overflow-y-auto">
//                     {categories.map((category: any) => (
//                       <label key={category.id} className="flex items-center space-x-2 cursor-pointer">
//                         <input
//                           type="checkbox"
//                           checked={selectedCategories.includes(category.id)}
//                           onChange={() => handleCategoryChange(category.id)}
//                           className="rounded text-blue-500 focus:ring-blue-400"
//                         />
//                         <span className="text-sm">
//                           {category.name}
//                         </span>
//                       </label>
//                     ))}
//                   </div>
//                 )}
//               </div>

//               {/* Price Filter Section */}
//               <div>
//                 <div className="flex justify-between items-center mb-2">
//                   <h3 className="text-md font-medium">Price Range</h3>
//                 </div>
//                 <div className="mt-4 text-left text-sm">
//                   {currency} {convertPrice(priceRange[0], currency).toFixed(2)} - {currency}{" "}
//                   {convertPrice(priceRange[1], currency).toFixed(2)}
//                 </div>
//                 <Range
//                   step={100}
//                   min={0}
//                   max={MAX_PRICE}
//                   values={priceRange}
//                   onChange={(values) => {
//                     setPriceRange(values);
//                     setSelectedRanges([]);
//                   }}
//                   renderTrack={({ props, children }) => (
//                     <div {...props} className="h-2 mt-3 bg-gray-400 rounded-full relative">
//                       {children}
//                     </div>
//                   )}
//                   renderThumb={({ props, index }) => {
//                     const { key, ...restProps } = props;
//                     return (
//                       <div
//                         key={index}
//                         {...restProps}
//                         className="w-5 h-5 bg-blue-500 rounded-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-300"
//                       />
//                     );
//                   }}
//                 />
//               </div>

//               {/* Price Categories */}
//               <div>
//                 <div className="flex justify-between items-center mb-2">
//                   <h3 className="text-md font-medium">Price Categories</h3>
//                 </div>
//                 <div className="mt-4 space-y-2">
//                   {priceRanges.map((range, index) => (
//                     <label key={index} className="flex items-center space-x-2 cursor-pointer">
//                       <input
//                         type="checkbox"
//                         checked={selectedRanges.includes(index)}
//                         onChange={() => handleCheckboxChange(index)}
//                         className="rounded text-blue-500 focus:ring-blue-400"
//                       />
//                       <span className="text-sm">
//                         {range.label.replace('',currency)}
//                       </span>
//                     </label>
//                   ))}
//                 </div>
//               </div>

//               {/* Rating Filter Section */}
//               <div>
//                 <div className="flex justify-between items-center mb-2">
//                   <h3 className="text-md font-medium">Customer Rating</h3>
//                 </div>
//                 <div className="mt-4 text-left text-sm">
//                   {ratingRange[0].toFixed(1)} - {ratingRange[1].toFixed(1)} stars
//                 </div>
//                 <Range
//                   step={0.1}
//                   min={0}
//                   max={MAX_RATING}
//                   values={ratingRange}
//                   onChange={(values) => setRatingRange(values)}
//                   renderTrack={({ props, children }) => (
//                     <div {...props} className="h-2 mt-3 bg-gray-400 rounded-full relative">
//                       {children}
//                     </div>
//                   )}
//                   renderThumb={({ props, index }) => {
//                     const { key, ...restProps } = props;
//                     return (
//                       <div
//                         key={index}
//                         {...restProps}
//                         className="w-5 h-5 bg-yellow-500 rounded-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-yellow-300"
//                       />
//                     );
//                   }}
//                 />
//               </div>

//               {/* Reset Button */}
//               <button 
//                 onClick={resetFilters}
//                 className="w-full mt-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm"
//               >
//                 Reset All Filters
//               </button>
//             </div>
//           )}
//         </nav>
//       </aside>

//       {/* Mobile toggle button when sidebar is closed */}
//       {isMobile && !isOpen && (
//         <button
//           onClick={() => setIsOpen(true)}
//           className="fixed bottom-4 left-4 z-40 bg-gray-600 text-white p-3 rounded-full shadow-lg md:hidden"
//           aria-label="Open filters"
//         >
//           <SlidersHorizontal className="h-6 w-6" />
//         </button>
//       )}
//     </>
//   );
// }

//   <nav class="fixed left-0 right-0 top-0 bg-gray border-b border-gray-200 flex justify-around items-center py-3 z-50">
//     <a href="/dashboard" class="group flex flex-col items-center p-2 text-black-500 hover:text-blue-600 transition-colors">
//   <span class="text-sm relative after:content-[''] after:block after:w-0 after:h-[2px] after:bg-blue-600 after:transition-all after:duration-300 group-hover:after:w-full">
//     Overview
//   </span>
// </a>

//     <a href="/dashboard" class="group flex flex-col items-center p-2 text-black-500 hover:text-blue-600 transition-colors">
//   <span class="text-sm relative after:content-[''] after:block after:w-0 after:h-[2px] after:bg-blue-600 after:transition-all after:duration-300 group-hover:after:w-full">
//     Add Products
//   </span>
// </a>
//     <a href="/dashboard" class="group flex flex-col items-center p-2 text-black-500 hover:text-blue-600 transition-colors">
//   <span class="text-sm relative after:content-[''] after:block after:w-0 after:h-[2px] after:bg-blue-600 after:transition-all after:duration-300 group-hover:after:w-full">
//     Listings
//   </span>
// </a>
//    <a href="/dashboard" class="group flex flex-col items-center p-2 text-black-500 hover:text-blue-600 transition-colors">
//   <span class="text-sm relative after:content-[''] after:block after:w-0 after:h-[2px] after:bg-blue-600 after:transition-all after:duration-300 group-hover:after:w-full">
//     Marketing
//   </span>
// </a>
//     <a href="/dashboard" class="group flex flex-col items-center p-2 text-black-500 hover:text-blue-600 transition-colors">
//   <span class="text-sm relative after:content-[''] after:block after:w-0 after:h-[2px] after:bg-blue-600 after:transition-all after:duration-300 group-hover:after:w-full">
//     Orders
//   </span>
// </a>
//     <a href="/dashboard" class="group flex flex-col items-center p-2 text-black-500 hover:text-blue-600 transition-colors">
//   <span class="text-sm relative after:content-[''] after:block after:w-0 after:h-[2px] after:bg-blue-600 after:transition-all after:duration-300 group-hover:after:w-full">
//     Performance
//   </span>
// </a>
//     <a href="/dashboard" class="group flex flex-col items-center p-2 text-black-500 hover:text-blue-600 transition-colors">
//   <span class="text-sm relative after:content-[''] after:block after:w-0 after:h-[2px] after:bg-blue-600 after:transition-all after:duration-300 group-hover:after:w-full">
//     Payment
//   </span>
// </a>
//     <a href="/dashboard" class="group flex flex-col items-center p-2 text-black-500 hover:text-blue-600 transition-colors">
//   <span class="text-sm relative after:content-[''] after:block after:w-0 after:h-[2px] after:bg-blue-600 after:transition-all after:duration-300 group-hover:after:w-full">
//     Account
//   </span>
// </a>
//     <a href="/dashboard" class="group flex flex-col items-center p-2 text-black-500 hover:text-blue-600 transition-colors">
//   <span class="text-sm relative after:content-[''] after:block after:w-0 after:h-[2px] after:bg-blue-600 after:transition-all after:duration-300 group-hover:after:w-full">
//     Categories
//   </span>
// </a>
//    <a href="/dashboard" class="group flex flex-col items-center p-2 text-black-500 hover:text-blue-600 transition-colors">
//   <span class="text-sm relative after:content-[''] after:block after:w-0 after:h-[2px] after:bg-blue-600 after:transition-all after:duration-300 group-hover:after:w-full">
//     More
//   </span>
// </a>
//   </nav>
