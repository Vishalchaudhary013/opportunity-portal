import { useState } from "react";
import { IoIosArrowDown } from "react-icons/io";

const faqs = [
  {
    question: "What is EDECO and how does it work?",
    answer:
      "EDECO is a career-focused platform that connects students with internships, training programs, and placement opportunities. Students enroll in structured programs, gain hands-on experience through real projects, and receive career support to become job-ready.",
  },
  {
    question: "Are EDECO internships and programs industry-oriented?",
    answer:
      "Yes. All EDECO programs are designed with an industry-first approach, focusing on practical skills, real-world projects, and current market requirements to ensure students are job-ready.",
  },
  {
    question: "Does EDECO provide placement or job assistance?",
    answer:
      "EDECO offers placement assistance through hiring drives, company collaborations, resume building, interview preparation, and career guidance for eligible and shortlisted candidates.",
  },
  {
    question: "Who can apply for EDECO internships and training programs?",
    answer:
      "EDECO programs are open to students, freshers, and early professionals from technical and non-technical backgrounds. Eligibility criteria may vary depending on the specific internship or program.",
  },
  {
    question: "Are the programs suitable for beginners?",
    answer:
      "Yes. EDECO programs are structured from basics to advanced levels, making them suitable for beginners as well as students with prior knowledge.",
  },
  {
    question: "Is the EDECO certificate valid and verifiable?",
    answer:
      "Yes. Upon successful completion of a program, students receive a verifiable EDECO certificate that validates their training, skills, and project experience.",
  },
  {
    question: "Are EDECO programs online or offline?",
    answer:
      "Most EDECO programs are conducted in online or hybrid mode, allowing students from different locations to participate. Specific programs may also include offline or campus-based activities.",
  },
  {
    question: "How does EDECO collaborate with colleges and campuses?",
    answer:
      "EDECO partners with colleges and universities to conduct campus hiring drives, internships, and training programs, helping students gain industry exposure and placement opportunities.",
  },
];

const EdecoFaq = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  return (
    <section className="w-full max-w-[1350px] px-4 md:px-6 mx-auto pb-[70px]">
      <span className="text-[14.5px] inline-block mb-1">MORE QUESTIONS?</span>
      <h2 className="text-[25px]  font-semibold text-gray-900 mb-6">
        Frequently asked questions
      </h2>

      <div className=" ">
        {faqs.map((faq, index) => (
          <div key={index} className="border rounded-xl border-black/10 overflow-hidden px-5 py-2.5 mb-3">
            {/* Question */}
            <button
              onClick={() =>
                setActiveIndex(activeIndex === index ? null : index)
              }
              className="w-full flex items-center gap-[15px] py-[9px] text-left transition-colors duration-200"
            >
              {/* Question text */}
              <span className={`flex-1 text-[15px] transition-colors duration-200 ${activeIndex === index ? "text-red-600 font-bold" : "text-gray-800 font-semibold"}`}>
                {faq.question}
              </span>

              {/* Chevron Icon (replacing + icon) */}
              <span className={`text-red-600 text-xl font-light transition-transform duration-300 ${activeIndex === index ? "rotate-180" : "rotate-0"}`}>
                <IoIosArrowDown />
              </span>
            </button>

            {/* Answer */}
            <div
              className={`grid transition-all duration-300 ease-in-out ${
                activeIndex === index
                  ? "grid-rows-[1fr] opacity-100"
                  : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                <div className={`mt-2 pt-3 text-[14px] leading-relaxed text-gray-600 border-t transition-colors duration-300 ${activeIndex === index ? "border-gray-100" : "border-transparent"}`}>
                  {faq.answer}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default EdecoFaq;
