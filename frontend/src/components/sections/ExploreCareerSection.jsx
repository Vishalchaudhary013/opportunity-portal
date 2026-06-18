// src/sections/ExploreCareersSection.jsx

import { FaLongArrowAltRight } from "react-icons/fa";
import { Link } from "react-router-dom";

const careers = [
  {
    title: "Data Analyst",
    description:
      "A Data Analyst collects, cleans, and interprets data, using tools.",
    salary: "₹305,009",
    jobs: "27,098",
    image:
      "https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=400",
    accent: "yellow",
  },
  {
    title: "Business Intelligence Analyst",
    description:
      "A Business Intelligence Analyst analyzes data to support business decisions.",
    salary: "₹966,925",
    jobs: "82,087",
    image:
      "https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=400",
    accent: "yellow",
  },
  {
    title: "Content Creator",
    description:
      "A Content Creator produces a variety of content formats for digital platforms.",
    image:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400",
    accent: "blue",
  },
  {
    title: "Data Scientist",
    description:
      "A Data Scientist analyzes datasets to uncover insights using statistics and ML.",
    salary: "₹489,219",
    jobs: "23,744",
    image:
      "https://images.unsplash.com/photo-1552058544-f2b08422138a?q=80&w=400",
    accent: "yellow",
  },
  {
    title: "Machine Learning Engineer",
    description:
      "A Machine Learning Engineer builds and optimizes algorithms that enable AI.",
    image:
      "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?q=80&w=400",
    accent: "yellow",
  },
];

const ExploreCareersSection = () => {
  return (
    <section className="pb-16">
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[24px] font-semibold text-gray-900">
            Explore careers
          </h2>
          <Link
                  to="/global-program"
                  className="font-medium flex gap-2 items-center text-slate-900 bg-red-600 text-white py-1 px-4 rounded-md"
                >
                  View All
                  <FaLongArrowAltRight />
                </Link>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
          {careers.map((career, index) => (
            <div
              key={index}
              className="group bg-white border border-gray-200 rounded-xl overflow-hidden
                         transition-all duration-300 cursor-pointer
                         hover:-translate-y-1 hover:shadow-xl hover:border-red-600"
            >
              {/* Image Area */}
              <div
                className={`relative h-[160px] flex items-center justify-center m-[7px] rounded-[7px]
                  ${
                    career.accent === "blue"
                      ? "bg-blue-50"
                      : "bg-yellow-50"
                  }`}
              >
                {/* Abstract Shape */}
                <div
                  className={`absolute w-[140px] h-[90px] rounded-lg -rotate-12 
                    ${
                      career.accent === "blue"
                        ? "bg-red-600"
                        : "bg-yellow-400"
                    }`}
                />

                {/* Person Image */}
                <img
                  src={career.image}
                  alt={career.title}
                  className="relative h-[120px] rounded-lg object-cover"
                />
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="text-[16px] font-semibold text-gray-900 mb-2">
                  {career.title}
                </h3>

                <p className="text-[12px] text-gray-600 leading-snug mb-3">
                  {career.description}
                </p>

                {career.salary && (
                  <div className="text-[13px] text-gray-900 space-y-1">
                    <div>
                      <span className="font-semibold">{career.salary}</span>{" "}
                     <span className="text-gray-600"> median salary</span>
                    </div>
                    <div>
                      <span className="font-semibold">{career.jobs}</span> jobs
                      <span className="text-gray-600">available</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExploreCareersSection;
