import logo from "../../assets/images/university.png";
const facultyData = [
  {
    university: "University of Colorado Boulder",
    logo: "https://upload.wikimedia.org/wikipedia/en/4/4f/University_of_Colorado_Boulder_logo.svg",
    degree: "Master of Engineering in Engineering Management",
    facultyName: "Jessica Leeker",
    facultyRole: "Professor in Engineering Practice",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    university: "University of Pittsburgh",
    logo: "https://upload.wikimedia.org/wikipedia/en/5/5a/University_of_Pittsburgh_seal.svg",
    degree: "Master of Data Science",
    facultyName: "Dr. Morgan Frank",
    facultyRole:
      "Assistant Professor, Department of Informatics and Networked Systems",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    university: "University of Illinois",
    logo: "https://upload.wikimedia.org/wikipedia/commons/0/0c/University_of_Illinois_seal.svg",
    degree: "Master of Business Administration (iMBA)",
    facultyName: "Gary Hecht",
    facultyRole:
      "Associate Dean of Professional Education Pathways and Professor of Accountancy",
    avatar: "https://randomuser.me/api/portraits/men/45.jpg",
  },
  {
    university: "HEC Paris",
    logo: "https://upload.wikimedia.org/wikipedia/en/9/90/HEC_Paris_logo.svg",
    degree: "MSc in Innovation and Entrepreneurship",
    facultyName: "Laurence Lehmann-Ortega",
    facultyRole: "Affiliate Professor of Management",
    avatar: "https://randomuser.me/api/portraits/men/52.jpg",
  },
  {
    university: "Universidad de los Andes",
    logo: "https://upload.wikimedia.org/wikipedia/en/8/89/Universidad_de_los_Andes_logo.svg",
    degree: "Maestría en Ingeniería de Software",
    facultyName: "Rubby Casallas, PhD",
    facultyRole: "Profesora titular",
    avatar: "https://randomuser.me/api/portraits/women/65.jpg",
  },
  {
    university: "University of London",
    logo: "https://upload.wikimedia.org/wikipedia/en/6/69/University_of_London_coat_of_arms.svg",
    degree: "Master of Science in Cyber Security",
    facultyName: "Chris Mitchell",
    facultyRole: "Professor of Computer Science",
    avatar: "https://randomuser.me/api/portraits/men/61.jpg",
  },
];

const FacultyCard = ({ data }) => {
  return (
    <div className="bg-white border border-[#e6ebf2] rounded-xl p-5 hover:shadow-md transition">
      {/* University */}
      <div className="flex items-center gap-3 mb-3">
        <img
          src={logo}
          alt={data.university}
          className="h-8 w-8 object-contain"
        />
        <p className="text-sm text-gray-700 font-medium">
          {data.university}
        </p>
      </div>

      {/* Degree */}
      <h3 className="text-[15px] font-semibold text-[#1f1f1f] mb-4">
        {data.degree}
      </h3>

      {/* Faculty */}
      <div className="flex items-center gap-3">
        <img
          src={data.avatar}
          alt={data.facultyName}
          className="h-10 w-10 rounded-full object-cover"
        />
        <div>
          <p className="text-sm font-semibold text-[#1f1f1f]">
            {data.facultyName}
          </p>
          <p className="text-xs text-gray-600 leading-snug">
            {data.facultyRole}
          </p>
        </div>
      </div>
    </div>
  );
};

const LearnFromFaculty = () => {
  return (
    <section className="py-14">
      <div className="max-w-[1400px] mx-auto px-4">
        <h2 className="text-[26px] font-bold text-[#1f1f1f] mb-8">
          Learn from expert faculty
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {facultyData.map((item, index) => (
            <FacultyCard key={index} data={item} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default LearnFromFaculty;
