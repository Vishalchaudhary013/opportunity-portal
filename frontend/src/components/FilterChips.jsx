import React, { useState } from 'react';

const FilterChips = ({ categories, selectedCategory: propSelectedCategory, onSelectCategory }) => {
  const [internalCategory, setInternalCategory] = useState(null);

  const selectedCategory = propSelectedCategory !== undefined ? propSelectedCategory : internalCategory;
  const setSelectedCategory = onSelectCategory || setInternalCategory;

  if (!categories || categories.length === 0) return null;

  const colorSchemes = [
    { base: "bg-[#EBF5FF] text-[#0084FF] hover:bg-[#D6EBFF]", active: "bg-[#0084FF] text-white shadow-md" },
    { base: "bg-[#FFF0E5] text-[#FF8A00] hover:bg-[#FFE0CC]", active: "bg-[#FF8A00] text-white shadow-md" },
    { base: "bg-[#E8F7F0] text-[#00C26D] hover:bg-[#D1F0E1]", active: "bg-[#00C26D] text-white shadow-md" },
    { base: "bg-[#FFEFEF] text-[#FF5A5F] hover:bg-[#FFDFDF]", active: "bg-[#FF5A5F] text-white shadow-md" },
    { base: "bg-[#F3E8FF] text-[#8B5CF6] hover:bg-[#E9D5FF]", active: "bg-[#8B5CF6] text-white shadow-md" },
    { base: "bg-[#E0F7FA] text-[#00ACC1] hover:bg-[#B2EBF2]", active: "bg-[#00ACC1] text-white shadow-md" },
    { base: "bg-[#FCE4EC] text-[#D81B60] hover:bg-[#F8BBD0]", active: "bg-[#D81B60] text-white shadow-md" }, 
  ];

  return (
    <div className="flex overflow-x-auto scrollbar-hide gap-3 mb-6 md:mb-[40px] pb-2 md:pb-0 md:flex-wrap w-full">
      {categories.map((cat, index) => {
        const colors = colorSchemes[index % colorSchemes.length];
        const isActive = selectedCategory === cat.name;

        return (
          <button
            type="button"
            key={index}
            onClick={() => setSelectedCategory(isActive ? null : cat.name)}
            className={`whitespace-nowrap flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl text-[13.5px] font-semibold transition-all duration-300 ${
              isActive
                ? `${colors.active} transform scale-105`
                : `${colors.base}`
            }`}
          >
            {cat.icon}
            {cat.name}
          </button>
        );
      })}
    </div>
  );
};

export default FilterChips;
