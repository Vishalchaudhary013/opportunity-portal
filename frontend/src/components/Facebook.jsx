// CompanyGallery.jsx
import { Search } from "lucide-react";
import React from "react";
import { FaFacebook } from "react-icons/fa";

const images = [
  "https://www.bookingkoala.com/wp-content/uploads/2022/11/bookingkoala-feedback-9.jpg",
  "https://www.bookingkoala.com/wp-content/uploads/2022/11/booking-feedback-5-1.jpg",
  "https://www.bookingkoala.com/wp-content/uploads/2022/11/test-2.jpg",
  "https://www.bookingkoala.com/wp-content/uploads/2022/11/bookingkoala-reviews-3-1.jpg",
  "https://www.bookingkoala.com/wp-content/uploads/2022/11/bookingkoala-reviews-10.jpg",
  "https://www.bookingkoala.com/wp-content/uploads/2022/11/bookingkoala-feedback-1.jpg",
  "https://www.bookingkoala.com/wp-content/uploads/2022/11/booking-feedback-10.jpg",
  "https://www.bookingkoala.com/wp-content/uploads/2022/01/f15.jpg",
  "https://www.bookingkoala.com/wp-content/uploads/2022/11/booking-feedback-14.jpg",
  "https://www.bookingkoala.com/wp-content/uploads/2022/11/booking-feedback-3.jpg",
  "https://www.bookingkoala.com/wp-content/uploads/2022/11/booking-feedback-7.jpg",
  "https://www.bookingkoala.com/wp-content/uploads/2022/11/bookingkoala-reviews-14.jpg",
  "https://www.bookingkoala.com/wp-content/uploads/2022/11/booking-feedback-13.jpg",
];

const Facebook = () => {
  return (
    <section>
      <div className="bg-[#ffffff] py-20">
        <div className="w-[1350px] mx-auto">
          {/* <h3 className="text-center font-semibold text-[50px] mb-5">
            You’ll Be In Good Company
          </h3>

          <p className="text-center font-light text-[18px] mb-30">
            20,000+ people from all industries, sizes and countries trust
            BookingKoala.
          </p> */}

          <div className="flex justify-center">
            <a href="https://www.facebook.com/facebook-page-name"
              target="_blank"
              rel="noopener noreferrer" className="relative w-[90%] max-w-4xl">
              <div className="absolute left-1/2 -translate-x-1/2 -top-12 z-10">
                <div className="w-20 h-20 rounded-full border-3 border-blue-500 bg-white flex items-center justify-center shadow-lg">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center">
                    <FaFacebook className="text-blue-600 text-[98px]" />
                  </div>
                </div>
              </div>

              <div className="flex justify-center mb-20">
                <h3
                  className="relative isolate z-0 bg-[#1E40AF] p-10 text-white text-[40px]
                  font-semibold rounded-2xl shadow-2xl
                  "
                >
                  Join Our Facebook Community
                </h3>
              </div>
            </a>
          </div>
        </div>

        <ul className="columns-4 gap-6 space-y-3">
          {images.map((image, index) => (
            <li
              key={index}
              className="relative overflow-hidden rounded-xl shadow group"
            >
              <img src={image} alt="" />

              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                <button>
                  <span className="w-15 h-15 flex items-center justify-center rounded-full bg-white/30 ">
                    <Search className="text-white" />
                  </span>
                </button>
              </div>
            </li>
          ))}
        </ul>

      </div>
    </section>
  );
};

export default Facebook;