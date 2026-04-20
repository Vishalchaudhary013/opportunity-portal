import React, { useState } from "react";
import { MdKeyboardArrowRight } from "react-icons/md";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { LuRocket } from "react-icons/lu";
import { Link } from "react-router-dom";
import { FaArrowTrendUp } from "react-icons/fa6";
import { TbSwitch3 } from "react-icons/tb";
import { AiOutlineGlobal } from "react-icons/ai";

const Hero = () => {
  const images = [
    "https://edeco-master-page.vercel.app/assets/banner-C3sdVHtu.png",
    "https://edeco-master-page.vercel.app/assets/banner2-C4NiUsvV.png",
    "https://edeco-master-page.vercel.app/assets/banner2-C4NiUsvV.png",
    "https://edeco-master-page.vercel.app/assets/banner3-fGYyopAL.png",
  ];

  const [index, setIndex] = useState(0);

  const prevSlide = () => {
    setIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };
  return (
    <>
      <div className="w-full max-w-350 mx-auto px-4 sm:px-6 py-8 sm:py-10">
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-10 mb-8 sm:mb-10">
          <div className="w-full lg:w-1/2">
            <div className="relative">
              <img
                src={images[index]}
                className="h-60 sm:h-80 w-full rounded-2xl object-cover"
              />

              <div
                onClick={prevSlide}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-gray-300 rounded-full shadow-md flex justify-center items-center cursor-pointer"
              >
                <MdKeyboardArrowLeft size={20} />
              </div>

              <div
                onClick={nextSlide}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-gray-300 rounded-full shadow-md flex justify-center items-center cursor-pointer sm:hidden"
              >
                <MdKeyboardArrowRight size={20} />
              </div>
            </div>
          </div>

          <div className="hidden sm:block w-full lg:w-1/2">
            <div className="relative">
              <img
                src={images[(index + 2) % images.length]}
                className="h-60 sm:h-80 w-full rounded-2xl object-cover"
              />

              <div
                onClick={nextSlide}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-gray-300 rounded-full shadow-md flex justify-center items-center cursor-pointer"
              >
                <MdKeyboardArrowRight size={20} />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#F5F7FF] py-8 sm:py-10 px-4 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-10 mb-8">
            <div className="flex justify-between items-center p-4 bg-white rounded-lg border border-black/10">
              <h2 className="font-medium text-lg text-gray-800">
                Launch a new career
              </h2>
              <img
                src="data:image/png;base64,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"
                alt=""
                className="h-13 w-13"
              />
            </div>

            <div className="flex justify-between items-center p-4 bg-white rounded-lg border border-black/10">
              <h2 className="font-medium text-lg text-gray-800">
                Gain in-demand skills
              </h2>
              <img
                src="data:image/png;base64,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"
                alt=""
                className="h-13 w-13"
              />
            </div>

            <div className="flex justify-between items-center p-4 bg-white rounded-lg border border-black/10">
              <h2 className="font-medium text-lg text-gray-800">
                Earn a degree
              </h2>
              <img
                src="https://edeco-master-page.vercel.app/assets/degree-C9KQKM4V.png"
                alt=""
                className="h-13 w-13"
              />
            </div>
          </div>
          <div className="px-2 sm:px-4 lg:flex lg:items-center lg:gap-5">
            <h2 className="text-xl font-semibold text-gray-800 lg:w-60 lg:shrink-0">
              What are you looking for?
            </h2>
            <div className="mt-4 flex w-full flex-col gap-3 sm:flex-row sm:flex-wrap lg:flex-nowrap lg:mt-0">
              <Link
                to="/intership"
                className="flex w-full flex-1 items-center gap-2 rounded-lg border border-black/10 bg-white p-3 sm:w-[48%] lg:w-auto"
              >
                <LuRocket
                  size={25}
                  className="text-white bg-blue-600 w-10 h-10 p-2 rounded-lg flex justify-center items-center"
                />
                <ul className="leading-5 min-w-0">
                  <li className="font-medium">Start my career</li>
                  <li className="text-sm text-gray-500">
                    Student & fresh graduates
                  </li>
                </ul>
              </Link>
              <Link
                to="/bootcamps"
                className="flex w-full flex-1 items-center gap-2 rounded-lg border border-black/10 bg-white p-3 sm:w-[48%] lg:w-auto"
              >
                <FaArrowTrendUp
                  size={25}
                  className="text-white bg-blue-600 w-10 h-10 p-2 rounded-lg flex justify-center items-center"
                />
                <ul className="leading-5 min-w-0">
                  <li className="font-medium">Upskill myself</li>
                  <li className="text-sm text-gray-500">
                    Learn in-demand skills
                  </li>
                </ul>
              </Link>

              <Link
                to="/jobs"
                className="flex w-full flex-1 items-center gap-2 rounded-lg border border-black/10 bg-white p-3 sm:w-[48%] lg:w-auto"
              >
                <TbSwitch3
                  size={25}
                  className="text-white bg-blue-600 w-10 h-10 p-2 rounded-lg flex justify-center items-center"
                />
                <ul className="leading-5 min-w-0">
                  <li className="font-medium">Switch my career</li>
                  <li className="text-sm text-gray-500">
                    Move into a new domain
                  </li>
                </ul>
              </Link>

              <Link
                to="/global-program"
                className="flex w-full flex-1 items-center gap-2 rounded-lg border border-black/10 bg-white p-3 sm:w-[48%] lg:w-auto"
              >
                <AiOutlineGlobal
                  size={25}
                  className="text-white bg-blue-600 w-10 h-10 p-2 rounded-lg flex justify-center items-center"
                />
                <ul className="leading-5 min-w-0">
                  <li className="font-medium">Explore global opportunities</li>
                  <li className="text-sm text-gray-500">
                    International opportunities
                  </li>
                </ul>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Hero;
