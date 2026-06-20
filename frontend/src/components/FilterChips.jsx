import React, { useState } from 'react';

const FilterChips = ({ categories, selectedCategory: propSelectedCategory, onSelectCategory }) => {
  const [internalCategory, setInternalCategory] = useState(null);

  const selectedCategory = propSelectedCategory !== undefined ? propSelectedCategory : internalCategory;
  const setSelectedCategory = onSelectCategory || setInternalCategory;

  if (!categories || categories.length === 0) return null;

  return (
    <div className="flex overflow-x-auto scrollbar-hide gap-3 mb-6 md:mb-[40px] pb-2 md:pb-0 md:flex-wrap w-full">
      {categories.map((cat, index) => (
        <button
          type="button"
          key={index}
          onClick={() => setSelectedCategory(selectedCategory === cat.name ? null : cat.name)}
          className={`whitespace-nowrap flex-shrink-0 flex items-center gap-2 px-[15px] py-[6px] border rounded-full text-[12px] transition-all duration-200 ${
            selectedCategory === cat.name
              ? "bg-red-600 text-white border-red-600 shadow-md transform scale-105"
              : "bg-[#F0F6FF] text-slate-700 border-[#D6E2FC] hover:bg-blue-50"
          }`}
        >
          {cat.icon}
          {cat.name}
        </button>
      ))}
    </div>
  );
};

export default FilterChips;
