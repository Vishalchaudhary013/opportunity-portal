import { useState } from "react";

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
    <section className="w-[1400px] mx-auto pb-[70px]">
      <h2 className="text-[19px] font-extrabold text-gray-900 mb-[14px]">
        Frequently asked questions
      </h2>

      <div className="border-t border-gray-200">
        {faqs.map((faq, index) => (
          <div key={index} className="border-b border-gray-200">
            {/* Question */}
            <button
              onClick={() =>
                setActiveIndex(activeIndex === index ? null : index)
              }
              className="w-full flex items-center gap-[15px] py-[9px] text-left 
                         text-[14px] font-[600] text-gray-900 
                         hover:bg-blue-50 transition-colors duration-200"
            >
              {/* Bootstrap Chevron */}
              <i
                className={`bi bi-chevron-down text-gray-600 transition-transform duration-300 ${
                  activeIndex === index ? "rotate-180" : "rotate-0"
                }`}
                style={{ fontSize: "12px", WebkitTextStroke: "0.8px" }}
              />

              {/* Question text */}
              <span className="flex-1">{faq.question}</span>

              {/* Plus / Minus */}
              <span className="text-red-600 text-xl font-light">
                {activeIndex === index ? "−" : "+"}
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
                <p className="pb-[9px] ps-[12px] pr-10 text-[13px] leading-relaxed text-gray-600">
                  {faq.answer}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default EdecoFaq;
