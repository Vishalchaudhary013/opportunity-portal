import { useState, useEffect, useRef } from "react";
import { degreesData } from "../../components/degree-program/degreesData";
import DegreeCard from "./DegreeCard";
import Pagination from "./Pagination";
import { 
  IoChevronDownOutline, 
  IoChevronUpOutline, 
  IoFilterOutline, 
  IoLayersOutline, 
  IoSchoolOutline, 
  IoStarOutline,
  IoMailOutline,
  IoSearchOutline,
  IoLaptopOutline
} from "react-icons/io5";
import { FiFilter } from "react-icons/fi";
/* ================= UI HELPERS ================= */

function FilterPill({
  icon: Icon,
  label,
  open,
  onClick,
  badge,
  children,
  width = "w-[260px]",
  scroll = false,
  isLabel = false,
}) {
  if (isLabel) {
    return (
      <div className="flex items-center gap-2 text-slate-800 font-medium text-[15px] mr-2">
        {Icon && <Icon className="text-xl" />}
        <span>{label}:</span>
        {badge > 0 && (
          <span className="bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
            {badge}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={onClick}
        className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl border text-[14px] transition-colors duration-200 ${
          open 
            ? "border-blue-600 bg-blue-50 text-blue-700 shadow-sm" 
            : "border-gray-200 bg-slate-50 text-slate-700 hover:bg-slate-100 hover:border-gray-300"
        }`}
      >
        {Icon && <Icon className={`text-[16px] ${open ? "text-blue-600" : "text-slate-500"}`} />}
        <span className="font-medium">{label}</span>
        {badge > 0 && (
          <span className="bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full ml-1 min-w-[20px] text-center">
            {badge}
          </span>
        )}
        {open ? (
          <IoChevronUpOutline className="text-sm ml-1 text-blue-600" />
        ) : (
          <IoChevronDownOutline className="text-sm ml-1 text-slate-500" />
        )}
      </button>

      {open && (
        <div
          className={`absolute top-[52px] left-0 ${width}
            bg-white border border-gray-200 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] p-4 z-50
            ${scroll ? "max-h-[360px] overflow-y-auto scrollbar-hide" : ""}`}
        >
          {children}
        </div>
      )}
    </div>
  );
}

function Radio({ label, checked, onChange }) {
  return (
    <label className="flex items-center gap-3 py-1.5 cursor-pointer">
      <input
        type="radio"
        checked={checked}
        onChange={onChange}
        className="w-4 h-4 accent-gray-800"
      />
      <span className="text-sm text-gray-700">{label}</span>
    </label>
  );
}

function Checkbox({ label, checked, onChange }) {
  return (
    <label
      className={`flex items-center gap-3 py-1.5 px-2 rounded-md cursor-pointer
      hover:bg-gray-50 ${checked ? "bg-gray-100" : ""}`}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="w-4 h-4 accent-gray-800"
      />
      <span className="text-sm text-gray-700">{label}</span>
    </label>
  );
}

/* ================= FILTER DATA ================= */

const ITEMS_PER_PAGE = 8;

const PROGRAM_LEVELS = [
  "Masters",
  "Doctoral (PhD)",
  "Post Graduate Diploma",
  "Integrated (UG+PG)",
  "Bachelor's - NEP (4 years)",
  "UG Degree (3 years)"
];

const DEGREE_MAP = {
  "Bachelor's Degree": [
    "B.Tech CSE",
    "B.Tech AI",
    "B.Tech ML",
    "B.Tech DS",
    "B.Sc CS",
    "BCA",
    "BBA",
    "B.Des UI/UX",
    "B.Arch",
  ],
  "Post Graduate Program": ["MBA", "MCA", "MSc", "PGDM"],
  Masters: ["MBA", "MCA", "MSc"],
  PGDM: ["PGDM"],
  "Integrated (UG + PG)": ["iMBA", "iM.Tech", "iMCA", "iMSc"],
  "Doctoral (PhD)": ["Integrated PhD", "PhD"],
};

const SPECIALISATIONS = [
  "Artificial Intelligence (AI) & Machine Learning (ML)",
  "Data Science & Analytics",
  "Cybersecurity & Ethical Hacking",
  "Cloud Computing & DevOps",
  "Business Analytics & Strategy",
  "Digital Marketing & Product Management",
  "Financial Services & Investment Banking",
  "UI/UX Design",
  "Human Resource & Organisational Behaviour",
  "MSc CS – Software Engineering with AI",
  "MCA – Full Stack with AI",
  "MBA – Marketing & Brand Management",
];

const LEARNING_MODES = [
  "On-Campus",
  "100% Online",
  "Hybrid",
  "Industry Integrated"
];

/* ================= MAIN COMPONENT ================= */

const DegreesFilterSection = ({ children, onLevelChange }) => {
  const ref = useRef(null);
  const [open, setOpen] = useState(null);

  /* APPLIED STATES */
  const [level, setLevel] = useState("");
  const [degree, setDegree] = useState("");
  const [mode, setMode] = useState("");
  const [specs, setSpecs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [page, setPage] = useState(1);

  useEffect(() => {
    const close = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(null);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const toggleSpec = (s, list, setList) => {
    setList(
      list.includes(s) ? list.filter((v) => v !== s) : [...list, s]
    );
    setPage(1); // Reset to first page when filtering
  };

  const filteredData = degreesData.filter((d) => {
    const l = !level || d.level === level;
    const deg = !degree || d.degree === degree;
    const md = !mode || d.learningMode === mode;
    const sp = specs.length === 0 || specs.includes(d.specialisation);
    const sq = !searchQuery || 
               d.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
               d.university.toLowerCase().includes(searchQuery.toLowerCase());
    return l && deg && md && sp && sq;
  });

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const currentItems = filteredData.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const filterCount =
    (level ? 1 : 0) + (degree ? 1 : 0) + (mode ? 1 : 0) + specs.length;

  // Only show the generic grid if we are filtering by something other than just 'level',
  // or if we have a search query. The 'level' alone is handled by showing the specific section.
  const isFiltering = (degree ? 1 : 0) + (mode ? 1 : 0) + specs.length > 0 || searchQuery.trim() !== "";

  return (
    <>
      <section className="bg-white py-10">
      <div className="w-full max-w-[1350px] px-4 md:px-6 mx-auto px-4">
        <h2 className="text-[14.5px] text-gray-500 font-semibold mb-4">
          Whether you are looking for the immersive energy of on-campus learning or the ultimate flexibility of a 100% online degree, discover the path that fits your life-not the other way around.
        </h2>

        {/* FILTER BAR CONTAINER */}
        <div 
          ref={ref} 
          className="bg-white border border-gray-200 rounded-2xl shadow-sm px-6 py-4 flex flex-wrap items-center gap-3  w-full"
        >
          {/* MASTER FILTER LABEL */}
          <FilterPill
            icon={FiFilter}
            label="Filters"
            badge={filterCount}
            isLabel={true}
          />

          {/* PROGRAM LEVEL */}
          <FilterPill
            icon={IoLayersOutline}
            label="Program Level"
            open={open === "level"}
            onClick={() => setOpen(open === "level" ? null : "level")}
          >
            {PROGRAM_LEVELS.map((l) => (
              <Radio
                key={l}
                label={l}
                checked={level === l}
                onChange={() => { 
                  setLevel(l); 
                  setDegree(""); 
                  setPage(1); 
                  if (onLevelChange) onLevelChange(l);
                }}
              />
            ))}
            {level && (
              <div className="pt-3 mt-3 border-t border-gray-200">
                <button 
                  onClick={() => { 
                    setLevel(""); 
                    setDegree(""); 
                    setPage(1); 
                    if (onLevelChange) onLevelChange("");
                  }} 
                  className="text-sm font-medium text-red-600 hover:text-red-700"
                >
                  Clear
                </button>
              </div>
            )}
          </FilterPill>

          {/* DEGREE */}
          <FilterPill
            icon={IoSchoolOutline}
            label="Degree"
            open={open === "degree"}
            onClick={() => setOpen(open === "degree" ? null : "degree")}
          >
            {(DEGREE_MAP[level] || []).map((d) => (
              <Radio
                key={d}
                label={d}
                checked={degree === d}
                onChange={() => { setDegree(d); setPage(1); }}
              />
            ))}
            {degree && (
              <div className="pt-3 mt-3 border-t border-gray-200">
                <button 
                  onClick={() => { setDegree(""); setPage(1); }} 
                  className="text-sm font-medium text-red-600 hover:text-red-700"
                >
                  Clear
                </button>
              </div>
            )}
          </FilterPill>

          {/* LEARNING MODE */}
          <FilterPill
            icon={IoLaptopOutline}
            label="Learning Mode"
            open={open === "mode"}
            onClick={() => setOpen(open === "mode" ? null : "mode")}
          >
            {LEARNING_MODES.map((m) => (
              <Radio
                key={m}
                label={m}
                checked={mode === m}
                onChange={() => { setMode(m); setPage(1); }}
              />
            ))}
            {mode && (
              <div className="pt-3 mt-3 border-t border-gray-200">
                <button 
                  onClick={() => { setMode(""); setPage(1); }} 
                  className="text-sm font-medium text-red-600 hover:text-red-700"
                >
                  Clear
                </button>
              </div>
            )}
          </FilterPill>

          {/* SPECIALISATIONS */}
          <FilterPill
            icon={IoStarOutline}
            label="Specialisations"
            width="w-[380px]"
            scroll
            open={open === "spec"}
            onClick={() => setOpen(open === "spec" ? null : "spec")}
          >
            {SPECIALISATIONS.map((s) => (
              <Checkbox
                key={s}
                label={s}
                checked={specs.includes(s)}
                onChange={() => toggleSpec(s, specs, setSpecs)}
              />
            ))}
            {specs.length > 0 && (
              <div className="pt-3 mt-3 border-t border-gray-200">
                <button 
                  onClick={() => { setSpecs([]); setPage(1); }} 
                  className="text-sm font-medium text-red-600 hover:text-red-700"
                >
                  Clear selections
                </button>
              </div>
            )}
          </FilterPill>

          {/* CLEAR ALL BUTTON */}
          {filterCount > 0 && (
            <button
              className="text-sm font-medium text-red-600 hover:text-red-700 px-2 transition-colors duration-200"
              onClick={() => {
                setLevel(""); setDegree(""); setMode(""); setSpecs([]);
                setPage(1); setOpen(null);
                if (onLevelChange) onLevelChange("");
              }}
            >
              Clear filters
            </button>
          )}

          {/* SEARCH BAR */}
          <div className="ml-auto relative w-full sm:w-auto">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <IoSearchOutline className="text-gray-400 text-[18px]" />
            </div>
            <input
              type="text"
              className="w-full sm:w-[250px] pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-slate-50 text-[14px] text-slate-700 placeholder-slate-400 outline-none  transition-colors"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
            />
          </div>
        </div>

        {isFiltering && (
          <div className="mt-8">
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 overflow-y-auto pb-4">
                {currentItems.length > 0 ? (
                  currentItems.map((d, idx) => (
                    <DegreeCard key={d.id} degree={d} index={idx} />
                  ))
                ) : (
                  <div className="col-span-full text-center py-10 text-gray-500 text-lg">
                    No degrees found matching your filters.
                  </div>
                )}
              </div>

              {totalPages > 1 && (
                <Pagination
                  currentPage={page}
                  totalPages={totalPages}
                  onPageChange={setPage}
                />
              )}
            </>
          </div>
        )}
      </div>
    </section>
    {!isFiltering && children}
    </>
  );
};

export default DegreesFilterSection;
