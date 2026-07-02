import React, { useState } from "react";
import { ChevronLeft, ChevronRight, X, Grid, List, Image as ImageIcon, ArrowDown } from "lucide-react";

const CollegeGalleryDetail = ({ college, onBack, }) => {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const detailImages = Array.from({ length: 39 }).map((_, i) => `https://picsum.photos/800/600?random=${college.photos + i + 100}`);

  return (
    <div className="w-full bg-white min-h-screen py-6 mt-15">
      <div className="w-full max-w-[1350px] mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <button onClick={onBack} className="flex items-center gap-1.5 text-gray-700 hover:text-gray-900 font-medium text-[15px]">
            <ChevronLeft size={20} /> Back
          </button>

          <div className="text-center">
            <h2 className="text-2xl font-bold text-[#1a202c]">{college.collegeName}</h2>
            <p className="text-gray-500 text-[15px] mt-1">{college.location}</p>
            {/* <p className="text-gray-500 text-[15px] mt-1">Gallery</p> */}
          </div>

          <div className="flex items-center gap-4">
            {/* <button className="flex items-center gap-2 border border-gray-200 bg-white rounded-lg px-4 py-2 text-[14px] font-medium text-gray-700 hover:bg-gray-50 shadow-sm">
              <ImageIcon size={18} /> All Photos ({college.photos})
            </button>
            <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden shadow-sm">
              <button className="p-2 bg-[#1a202c] text-white">
                <Grid size={18} />
              </button>
              <button className="p-2 bg-white text-gray-500 hover:bg-gray-50">
                <List size={18} />
              </button>
            </div> */}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 auto-rows-[240px] gap-4 grid-flow-dense">
          {detailImages.map((img, i) => {
            let spanClass = "col-span-1 row-span-1";
            if (i === 0 || i === 5 || i === 6 || i===13 || i===18) spanClass = "col-span-1 row-span-2";
            else if (i === 4 || i === 8 || i===11 || i===25) spanClass = "col-span-2 row-span-1";
            
            return (
              <div 
                key={i} 
                onClick={() => setSelectedIndex(i)}
                className={`rounded-lg overflow-hidden shadow-sm group relative cursor-pointer ${spanClass}`}
              >
                <img src={img} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
              </div>
            );
          })}
        </div>

        {/* Load More */}
        <div className="flex justify-center mt-12 mb-8">
          <button className="flex items-center gap-2 border border-gray-200 bg-white rounded-full px-6 py-2.5 text-[14px] font-medium text-gray-700 hover:bg-gray-50 shadow-sm">
            Load More <ArrowDown size={16} />
          </button>
        </div>

        
        {selectedIndex !== null && (
          <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center">
           
            <button 
              onClick={() => setSelectedIndex(null)}
              className="absolute top-6 right-6 text-white/70 hover:text-white p-2 transition-colors cursor-pointer"
            >
              <X size={36} />
            </button>

           
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setSelectedIndex((prev) => (prev > 0 ? prev - 1 : detailImages.length - 1));
              }}
              className="absolute left-4 md:left-10 text-white/50 hover:text-white p-2 transition-colors cursor-pointer"
            >
              <ChevronLeft size={48} strokeWidth={1.5} />
            </button>

            <img 
              src={detailImages[selectedIndex]} 
              alt="Fullscreen" 
              className="max-w-[90vw] max-h-[85vh] object-contain select-none"
            />

           
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setSelectedIndex((prev) => (prev < detailImages.length - 1 ? prev + 1 : 0));
              }}
              className="absolute right-4 md:right-10 text-white/50 hover:text-white p-2 transition-colors cursor-pointer"
            >
              <ChevronRight size={48} strokeWidth={1.5} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CollegeGalleryDetail;
