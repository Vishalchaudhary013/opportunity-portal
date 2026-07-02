import React, { useState, useEffect } from "react";
import { Landmark, ChevronLeft, ChevronRight } from "lucide-react";
import CollegeGalleryDetail from './CollegeGalleryDetail';
import { CiImageOn } from "react-icons/ci";
import { IoLocationOutline } from "react-icons/io5";
import { getGallery } from "../../api/galleryAPI";
import { resolveAssetUrl } from "../../api/apiClient";

const CollegeGallery = () => {
  const [selectedCollege, setSelectedCollege] = useState(null);
  const [galleries, setGalleries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGalleries = async () => {
      try {
        setLoading(true);
        const json = await getGallery();
        if (json.success) {
          setGalleries(json.data);
        }
      } catch (error) {
        console.error("Error fetching galleries:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchGalleries();
  }, []);

  const getImageUrl = (img) => {
    if (!img) return "";
    if (img.imageType === "upload") return resolveAssetUrl(img.url);
    return img.url;
  };

  if (selectedCollege) {
    return <CollegeGalleryDetail college={selectedCollege} onBack={() => setSelectedCollege(null)} />;
  }

  return (
    <div className="w-full bg-white min-h-screen py-10 mt-15">
      <div className="w-full max-w-[1350px] mx-auto px-4 md:px-6">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : galleries.length === 0 ? (
          <div className="text-center py-20 text-gray-500">No galleries found.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {galleries.slice(0, 11).map((item, index) => (
              <div
                key={index}
                onClick={() => setSelectedCollege(item)}
                className="border border-gray-100 shadow-sm rounded-xl overflow-hidden bg-white hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="grid grid-cols-2 gap-0.5 bg-white">
                  {[...Array(4)].map((_, i) => {
                    const imgObj = item.images[i];
                    return (
                      <div key={i} className="w-full h-[110px] bg-gray-100 flex items-center justify-center">
                        {imgObj ? (
                          <img
                            src={getImageUrl(imgObj)}
                            alt=""
                            className="w-full h-[110px] object-cover"
                          />
                        ) : (
                          <CiImageOn size={24} className="text-gray-300" />
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="px-5 py-4">
                  <h3 className="text-[16px] font-bold text-gray-900 truncate">
                    {item.title}
                  </h3>

                  <p className="text-gray-500 flex items-center gap-1.5 text-[13px] mt-1.5">
                    <IoLocationOutline size={16} />
                    {item.location}
                  </p>

                  <div className="mt-4">
                    <span className="inline-flex items-center gap-1.5 text-[13px] font-medium text-gray-700 border border-gray-200 rounded-md px-3 py-1.5">
                      <CiImageOn size={16} />
                      {item.images?.length || 0} Photos
                    </span>
                  </div>
                </div>
              </div>
            ))}

          {galleries.length > 11 && (
            <div className="border border-blue-50 shadow-sm rounded-xl overflow-hidden bg-[#f8fbff] flex flex-col items-center justify-center p-6 text-center">
              <Landmark size={40} className="text-blue-700 mb-2" strokeWidth={1.5} />
              <h3 className="text-[17px] font-bold text-gray-900 mt-2">+{galleries.length - 11} More Colleges</h3>
              <p className="text-gray-500 text-[14px] mt-1">Explore more campuses</p>
              <button className="mt-5 bg-red-600 text-white px-8 py-2.5 rounded-lg text-[14px] font-medium hover:bg-blue-700 transition-colors shadow-sm">
                View All
              </button>
            </div>
          )}
        </div>
        )}

        {/* Pagination */}
        <div className="flex justify-center mt-14 mb-6">
          <div className="flex items-center border border-gray-200 rounded-lg shadow-sm bg-white overflow-hidden">
            <button className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 text-gray-500 border-r border-gray-200">
              <ChevronLeft size={18} />
            </button>
            <button className="w-10 h-10 flex items-center justify-center bg-blue-700 text-white text-[14px] font-medium">1</button>
            <button className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 text-gray-700 text-[14px] font-medium border-l border-gray-200">2</button>
            <button className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 text-gray-700 text-[14px] font-medium border-l border-gray-200">3</button>
            {/* <button className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 text-gray-700 text-[14px] font-medium border-l border-gray-200">4</button>
            <button className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 text-gray-700 text-[14px] font-medium border-l border-gray-200">5</button> */}
            <span className="w-10 h-10 flex items-center justify-center text-gray-400 text-[14px] border-l border-gray-200">...</span>
            <button className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 text-gray-700 text-[14px] font-medium border-l border-gray-200">20</button>
            <button className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 text-gray-500 border-l border-gray-200">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollegeGallery;
