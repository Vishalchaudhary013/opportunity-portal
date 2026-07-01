import { LocateIcon } from "lucide-react";
import React from "react";
import { CiImageOn } from "react-icons/ci";
import { IoLocationOutline } from "react-icons/io5";
const data = [
  {
    img: [
      "https://picsum.photos/800/600?random=1",
      "https://picsum.photos/800/600?random=2",
      "https://picsum.photos/800/600?random=3",
      "https://picsum.photos/800/600?random=4",
    ],
    collegeName: "HPU Shimla",
    location: "Shimla, Himachal Pradesh",
  },
  {
    img: [
      "https://picsum.photos/800/600?random=1",
      "https://picsum.photos/800/600?random=2",
      "https://picsum.photos/800/600?random=3",
      "https://picsum.photos/800/600?random=4",
    ],
    collegeName: "HPU Shimla",
    location: "Shimla, Himachal Pradesh",
  },
  {
    img: [
      "https://picsum.photos/800/600?random=1",
      "https://picsum.photos/800/600?random=2",
      "https://picsum.photos/800/600?random=3",
      "https://picsum.photos/800/600?random=4",
    ],
    collegeName: "HPU Shimla",
    location: "Shimla, Himachal Pradesh",
  },
  {
    img: [
      "https://picsum.photos/800/600?random=1",
      "https://picsum.photos/800/600?random=2",
      "https://picsum.photos/800/600?random=3",
      "https://picsum.photos/800/600?random=4",
    ],
    collegeName: "HPU Shimla",
    location: "Shimla, Himachal Pradesh",
  },
  {
    img: [
      "https://picsum.photos/800/600?random=1",
      "https://picsum.photos/800/600?random=2",
      "https://picsum.photos/800/600?random=3",
      "https://picsum.photos/800/600?random=4",
    ],
    collegeName: "HPU Shimla",
    location: "Shimla, Himachal Pradesh",
  },
  {
    img: [
      "https://picsum.photos/800/600?random=1",
      "https://picsum.photos/800/600?random=2",
      "https://picsum.photos/800/600?random=3",
      "https://picsum.photos/800/600?random=4",
    ],
    collegeName: "HPU Shimla",
    location: "Shimla, Himachal Pradesh",
  },
  {
    img: [
      "https://picsum.photos/800/600?random=1",
      "https://picsum.photos/800/600?random=2",
      "https://picsum.photos/800/600?random=3",
      "https://picsum.photos/800/600?random=4",
    ],
    collegeName: "HPU Shimla",
    location: "Shimla, Himachal Pradesh",
  },
  {
    img: [
      "https://picsum.photos/800/600?random=1",
      "https://picsum.photos/800/600?random=2",
      "https://picsum.photos/800/600?random=3",
      "https://picsum.photos/800/600?random=4",
    ],
    collegeName: "HPU Shimla",
    location: "Shimla, Himachal Pradesh",
  },
];
const CollegeGallery = () => {
  return (
    <>
      <div>
        <div className="w-[1350px] mx-auto py-10 mt-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {data.map((item, index) => (
              <div
                key={index}
                className="border border-black/5 shadow rounded-lg overflow-hidden"
              >
                <div className="grid grid-cols-2 gap-1">
                  {item.img.map((image, i) => (
                    <img
                      key={i}
                      src={image}
                      alt=""
                      className="w-full h-30 object-cover "
                    />
                  ))}
                </div>

                <div className="px-4 py-5">
                  <h3 className=" text-lg font-semibold">
                    {item.collegeName}
                  </h3>

                  <p className="text-gray-500 flex items-center gap-0.5 text-[15px]"> <IoLocationOutline size={17}/>{item.location}</p>

                  <span className="inline-flex items-center gap-1 text-[14px] font-medium text-gray-700 border border-black/20 rounded-md px-2 py-0.5 mt-2.5">
                    <CiImageOn size={18}/>
                    40 Photos
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default CollegeGallery;
