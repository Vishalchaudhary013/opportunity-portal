import React, { useState } from "react";
import { Landmark, ChevronLeft, ChevronRight } from "lucide-react";
import CollegeGalleryDetail from './CollegeGalleryDetail';
import { CiImageOn } from "react-icons/ci";
import { IoLocationOutline } from "react-icons/io5";

const data = [
  {
    img: [
      "https://picsum.photos/400/300?random=1",
      "https://picsum.photos/400/300?random=2",
      "https://picsum.photos/400/300?random=3",
      "https://picsum.photos/400/300?random=4",
    ],
    collegeName: "Indian Institute of Technology Bombay",
    location: "Mumbai, Maharashtra",
    photos: 42
  },
  {
    img: [
      "https://picsum.photos/400/300?random=5",
      "https://picsum.photos/400/300?random=6",
      "https://picsum.photos/400/300?random=7",
      "https://picsum.photos/400/300?random=8",
    ],
    collegeName: "Delhi University",
    location: "New Delhi, Delhi",
    photos: 36
  },
  {
    img: [
      "https://picsum.photos/400/300?random=9",
      "https://picsum.photos/400/300?random=10",
      "https://picsum.photos/400/300?random=11",
      "https://picsum.photos/400/300?random=12",
    ],
    collegeName: "Manipal Institute of Technology",
    location: "Manipal, Karnataka",
    photos: 28
  },
  {
    img: [
      "https://picsum.photos/400/300?random=13",
      "https://picsum.photos/400/300?random=14",
      "https://picsum.photos/400/300?random=15",
      "https://picsum.photos/400/300?random=16",
    ],
    collegeName: "Vellore Institute of Technology",
    location: "Vellore, Tamil Nadu",
    photos: 31
  },
  {
    img: [
      "https://picsum.photos/400/300?random=17",
      "https://picsum.photos/400/300?random=18",
      "https://picsum.photos/400/300?random=19",
      "https://picsum.photos/400/300?random=20",
    ],
    collegeName: "Jadavpur University",
    location: "Kolkata, West Bengal",
    photos: 24
  },
  {
    img: [
      "https://picsum.photos/400/300?random=21",
      "https://picsum.photos/400/300?random=22",
      "https://picsum.photos/400/300?random=23",
      "https://picsum.photos/400/300?random=24",
    ],
    collegeName: "Anna University",
    location: "Chennai, Tamil Nadu",
    photos: 30
  },
  {
    img: [
      "https://picsum.photos/400/300?random=25",
      "https://picsum.photos/400/300?random=26",
      "https://picsum.photos/400/300?random=27",
      "https://picsum.photos/400/300?random=28",
    ],
    collegeName: "Amity University",
    location: "Noida, Uttar Pradesh",
    photos: 26
  },
  {
    img: [
      "https://picsum.photos/400/300?random=29",
      "https://picsum.photos/400/300?random=30",
      "https://picsum.photos/400/300?random=31",
      "https://picsum.photos/400/300?random=32",
    ],
    collegeName: "Symbiosis International University",
    location: "Pune, Maharashtra",
    photos: 23
  },
  {
    img: [
      "https://picsum.photos/400/300?random=33",
      "https://picsum.photos/400/300?random=34",
      "https://picsum.photos/400/300?random=35",
      "https://picsum.photos/400/300?random=36",
    ],
    collegeName: "PSG College of Technology",
    location: "Coimbatore, Tamil Nadu",
    photos: 22
  },
  {
    img: [
      "https://picsum.photos/400/300?random=37",
      "https://picsum.photos/400/300?random=38",
      "https://picsum.photos/400/300?random=39",
      "https://picsum.photos/400/300?random=40",
    ],
    collegeName: "BITS Pilani",
    location: "Pilani, Rajasthan",
    photos: 35
  },
  {
    img: [
      "https://picsum.photos/400/300?random=41",
      "https://picsum.photos/400/300?random=42",
      "https://picsum.photos/400/300?random=43",
      "https://picsum.photos/400/300?random=44",
    ],
    collegeName: "Christ University",
    location: "Bengaluru, Karnataka",
    photos: 29
  },
];

const CollegeGallery = () => {
  const [selectedCollege, setSelectedCollege] = useState(null);

  if (selectedCollege) {
    return <CollegeGalleryDetail college={selectedCollege} onBack={() => setSelectedCollege(null)} />;
  }

  return (
    <div className="w-full bg-white min-h-screen py-10 mt-15">
      <div className="w-full max-w-[1350px] mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {data.map((item, index) => (
            <div
              key={index}
              onClick={() => setSelectedCollege(item)}
              className="border border-gray-100 shadow-sm rounded-xl overflow-hidden bg-white hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="grid grid-cols-2 gap-0.5 bg-white">
                {item.img.map((image, i) => (
                  <img
                    key={i}
                    src={image}
                    alt=""
                    className="w-full h-[110px] object-cover"
                  />
                ))}
              </div>

              <div className="px-5 py-4">
                <h3 className="text-[16px] font-bold text-gray-900 truncate">
                  {item.collegeName}
                </h3>

                <p className="text-gray-500 flex items-center gap-1.5 text-[13px] mt-1.5">
                  <IoLocationOutline size={16} />
                  {item.location}
                </p>

                <div className="mt-4">
                  <span className="inline-flex items-center gap-1.5 text-[13px] font-medium text-gray-700 border border-gray-200 rounded-md px-3 py-1.5">
                    <CiImageOn size={16} />
                    {item.photos} Photos
                  </span>
                </div>
              </div>
            </div>
          ))}

          
          <div className="border border-blue-50 shadow-sm rounded-xl overflow-hidden bg-[#f8fbff] flex flex-col items-center justify-center p-6 text-center">
            <Landmark size={40} className="text-blue-700 mb-2" strokeWidth={1.5} />
            <h3 className="text-[17px] font-bold text-gray-900 mt-2">+38 More Colleges</h3>
            <p className="text-gray-500 text-[14px] mt-1">Explore more campuses</p>
            <button className="mt-5 bg-red-600 text-white px-8 py-2.5 rounded-lg text-[14px] font-medium hover:bg-blue-700 transition-colors shadow-sm">
              View All
            </button>
          </div>
        </div>

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
