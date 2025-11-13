/* eslint-disable @typescript-eslint/no-explicit-any */
// components/EbayCategorySelector.tsx
"use client";

import { useState, useEffect, useRef } from 'react';
import { FiSearch, FiChevronRight, FiX } from 'react-icons/fi';

export default function EbayCategorySelector({
  categories,
  subcategories,
  onSelect,
  onClose
}: {
  categories: any[];
  subcategories: any[];
  onSelect: (categoryId: string, subcategoryId: string) => void;
  onClose: () => void;
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [filteredCategories, setFilteredCategories] = useState<any[]>([]);
  const popupRef = useRef<HTMLDivElement>(null);

  // Filter categories based on search
  useEffect(() => {
    if (searchTerm) {
      const filtered = categories.filter(cat => 
        cat.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCategories(filtered);
    } else {
      setFilteredCategories(categories);
    }
  }, [searchTerm, categories]);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        onClose();
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div 
        ref={popupRef}
        className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[80vh] flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="border-b p-4 flex justify-between items-center">
          <h3 className="text-lg font-bold">Select a category</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FiX size={20} />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search for categories..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Categories Column */}
          <div className={`w-1/3 border-r overflow-y-auto ${selectedCategory ? '' : 'bg-gray-50'}`}>
            {filteredCategories.map((category) => (
              <div
                key={category.id}
                className={`p-4 cursor-pointer hover:bg-blue-50 flex justify-between items-center ${selectedCategory?.id === category.id ? 'bg-blue-50 font-medium' : ''}`}
                onClick={() => setSelectedCategory(category)}
              >
                <span>{category.name}</span>
                <FiChevronRight className="text-gray-400" />
              </div>
            ))}
          </div>

          {/* Subcategories Column */}
          {selectedCategory && (
            <div className="w-2/3 overflow-y-auto">
              <div 
                className="p-4 cursor-pointer hover:bg-blue-50 font-medium"
                onClick={() => {
                  onSelect(selectedCategory.id, '');
                  onClose();
                }}
              >
                All {selectedCategory.name}
              </div>
              
              {subcategories
                .filter(sub => sub.parentCategoryId === selectedCategory.id)
                .map(subcategory => (
                  <div
                    key={subcategory.id}
                    className="p-4 cursor-pointer hover:bg-blue-50 border-t"
                    onClick={() => {
                      onSelect(selectedCategory.id, subcategory.id);
                      onClose();
                    }}
                  >
                    {subcategory.name}
                  </div>
                ))}
            </div>
          )}

          {/* Empty State */}
          {!selectedCategory && (
            <div className="w-2/3 flex items-center justify-center text-gray-500">
              <div className="text-center p-8">
                <FiChevronRight size={48} className="mx-auto text-gray-300 mb-4" />
                <p>Select a category to see subcategories</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}