import { Link, useNavigate } from "react-router-dom";
import { HiOutlineAcademicCap, HiOutlineBriefcase } from "react-icons/hi2";

const ChooseSignup = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
        <div className="">
            <div className="w-full max-w-[1350px] px-4 md:px-6 mx-auto px-4 sm:px-6 py-5">
        <header>
          <Link to="/" className="text-[30px] text-[#0f2a4d] font-bold cursor-pointer select-none hover:opacity-90">
            edeco<span className="text-[#0f2a4d]">®</span>
          </Link>
        </header>
      </div>
        </div>
      

      <div className="flex-1 flex justify-center items-center px-4 pb-20">
        <div className="flex flex-col md:flex-row gap-8 max-w-5xl w-full justify-center">
          
          {/* Student Card */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 flex flex-col items-center text-center w-full max-w-[400px] hover:shadow-md transition-shadow">
            <div className="h-48 w-full bg-[#f8f9fc] rounded-2xl mb-8 flex items-center justify-center text-indigo-500">
              {/* Placeholder for Student Illustration */}
              <HiOutlineAcademicCap size={80} strokeWidth={1} />
            </div>
            <h2 className="text-[28px] font-bold text-slate-800 mb-4">Student</h2>
            <p className="text-slate-500 mb-8 px-2 flex-1 leading-relaxed">
              Create a student profile to discover Career Option, track applications, and build your career.
            </p>
            <button 
              onClick={() => navigate('/signup?type=student')}
              className="w-full bg-red-600 text-white py-4 rounded-xl font-semibold text-lg"
            >
              Signup as Student
            </button>
          </div>

          {/* Employer Card */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 flex flex-col items-center text-center w-full max-w-[400px] hover:shadow-md transition-shadow">
            <div className="h-48 w-full bg-[#f8f9fc] rounded-2xl mb-8 flex items-center justify-center text-emerald-500">
              {/* Placeholder for Employer Illustration */}
              <HiOutlineBriefcase size={80} strokeWidth={1} />
            </div>
            <h2 className="text-[28px] font-bold text-slate-800 mb-4">Employer</h2>
            <p className="text-slate-500 mb-8 px-2 flex-1 leading-relaxed">
              Create an employer profile to post opportunities, manage applications, and hire top talent.
            </p>
            <button 
              onClick={() => navigate('/signup?type=employer')}
              className="w-full bg-red-600 text-white py-4 rounded-xl font-semibold text-lg"
            >
              Signup as Employer
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ChooseSignup;
