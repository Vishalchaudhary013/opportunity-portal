import { useState } from "react";

const StudentTestimonialSection = () => {
  const [showVideo, setShowVideo] = useState(false);

  return (
    <section className="bg-[#0a2d5f] py-16">
      <div className="w-full max-w-[1350px] px-4 md:px-6 mx-auto px-4">
        {/* Heading */}
        <h2 className="text-white text-[28px] font-bold mb-8">
          Hear why students enjoy learning on Coursera
        </h2>

        {/* Card */}
        <div className="bg-white rounded-xl overflow-hidden grid grid-cols-1 lg:grid-cols-2">

          {/* VIDEO SIDE */}
          <div className="relative bg-black">
            <img
              src="https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg"
              alt="Student testimonial video"
              className="w-full h-full object-cover"
            />

            {/* Play Button */}
            <button
              onClick={() => setShowVideo(true)}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="h-16 w-16 bg-white/90 rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition">
                <svg
                  className="h-7 w-7 text-[#0a2d5f] ml-1"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </button>
          </div>

          {/* CONTENT SIDE */}
          <div className="p-8 flex flex-col justify-center">
            <div className="text-[42px] text-gray-300 leading-none mb-4">
              “
            </div>

            <p className="text-[16px] text-gray-800 leading-relaxed mb-6">
              Live sessions, office hours, discussion boards—you can participate
              from wherever you are. Getting my MBA makes me feel empowered.
              I don't need to stop working, I don't need to stop being a mother,
              I don't need to stop having my life.
            </p>

            <p className="font-semibold text-gray-900">
              Patricia Ribiero Peña
            </p>
            <p className="text-sm text-gray-600">
              Master of Business Administration (iMBA)
            </p>
            <p className="text-sm text-gray-600">
              University of Illinois
            </p>
          </div>
        </div>
      </div>

      {/* VIDEO MODAL */}
      {showVideo && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center px-4">
          <div className="relative w-full max-w-4xl aspect-video bg-black rounded-lg overflow-hidden">
            <iframe
              src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
              title="Student Testimonial"
              className="w-full h-full"
              allow="autoplay; encrypted-media"
              allowFullScreen
            />
            <button
              onClick={() => setShowVideo(false)}
              className="absolute -top-10 right-0 text-white text-3xl"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default StudentTestimonialSection;
