import { useState, useEffect, useRef } from "react";
import { degreesData } from "../../components/degree-program/degreesData";
import DegreeCard from "./DegreeCard";
import Pagination from "./Pagination";

/* ================= UI HELPERS ================= */

function FilterPill({
  label,
  open,
  onClick,
  badge,
  children,
  width = "w-[260px]",
  scroll = false,
}) {
  return (
    <div className="relative">
      <button
        onClick={onClick}
        className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-300 bg-white text-sm text-gray-700"
      >
        {label}
        {badge > 0 && (
          <span className="ml-1 bg-gray-700 text-white text-xs px-2 rounded-full">
            {badge}
          </span>
        )}
        <i className={`bi bi-chevron-${open ? "up" : "down"} text-xs`} />
      </button>

      {open && (
        <div
          className={`absolute top-[46px] left-0 ${width}
            bg-white border border-gray-300 rounded-xl shadow-lg p-4 z-50
            ${scroll ? "max-h-[360px] overflow-y-auto" : ""}`}
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

function ApplyClear({ onApply, onClear }) {
  return (
    <div className="flex justify-between items-center pt-4 mt-3 border-t border-gray-200">
      <button onClick={onClear} className="text-sm text-gray-500">
        Clear all
      </button>
      <button
        onClick={onApply}
        className="bg-gray-800 text-white px-4 py-1.5 rounded-md text-sm"
      >
        Apply
      </button>
    </div>
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

/* ================= MAIN COMPONENT ================= */

const DegreesFilterSection = () => {
  const ref = useRef(null);
  const [open, setOpen] = useState(null);

  /* TEMP STATES */
  const [tLevel, setTLevel] = useState("");
  const [tDegree, setTDegree] = useState("");
  const [tSpecs, setTSpecs] = useState([]);

  /* APPLIED STATES */
  const [level, setLevel] = useState("");
  const [degree, setDegree] = useState("");
  const [specs, setSpecs] = useState([]);

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
  };

  const filteredData = degreesData.filter((d) => {
    const l = !level || d.level === level;
    const deg = !degree || d.degree === degree;
    const sp = specs.length === 0 || specs.includes(d.specialisation);
    return l && deg && sp;
  });

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const currentItems = filteredData.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const filterCount =
    (level ? 1 : 0) + (degree ? 1 : 0) + specs.length;

  return (
    <section className="bg-white py-10">
      <div className="w-full max-w-[1350px] px-4 md:px-6 mx-auto px-4">
        <h2 className="text-[24px] font-semibold mb-6">
          Find the right degree for you
        </h2>

        {/* FILTER BAR */}
        <div ref={ref} className="flex flex-wrap items-center gap-3 mb-8">
          {/* MASTER FILTER */}
          <FilterPill
            label="Filters"
            badge={filterCount}
            open={open === "all"}
            onClick={() => setOpen(open === "all" ? null : "all")}
          >
            {filterCount === 0 ? (
              <p className="text-sm text-gray-500">No filters applied</p>
            ) : (
              <>
                {level && <p className="text-sm">• {level}</p>}
                {degree && <p className="text-sm">• {degree}</p>}
                {specs.map((s) => (
                  <p key={s} className="text-sm">• {s}</p>
                ))}
                <button
                  className="mt-4 text-sm text-red-600"
                  onClick={() => {
                    setTLevel(""); setTDegree(""); setTSpecs([]);
                    setLevel(""); setDegree(""); setSpecs([]);
                    setPage(1); setOpen(null);
                  }}
                >
                  Clear all filters
                </button>
              </>
            )}
          </FilterPill>

          {/* PROGRAM LEVEL */}
          <FilterPill
            label="Program Level"
            open={open === "level"}
            onClick={() => setOpen(open === "level" ? null : "level")}
          >
            {PROGRAM_LEVELS.map((l) => (
              <Radio
                key={l}
                label={l}
                checked={tLevel === l}
                onChange={() => { setTLevel(l); setTDegree(""); }}
              />
            ))}
            <ApplyClear
              onApply={() => { setLevel(tLevel); setDegree(""); setPage(1); setOpen(null); }}
              onClear={() => { setTLevel(""); setLevel(""); setTDegree(""); setDegree(""); }}
            />
          </FilterPill>

          {/* DEGREE */}
          <FilterPill
            label="Degree"
            open={open === "degree"}
            onClick={() => setOpen(open === "degree" ? null : "degree")}
          >
            {(DEGREE_MAP[tLevel || level] || []).map((d) => (
              <Radio
                key={d}
                label={d}
                checked={tDegree === d}
                onChange={() => setTDegree(d)}
              />
            ))}
            <ApplyClear
              onApply={() => { setDegree(tDegree); setPage(1); setOpen(null); }}
              onClear={() => { setTDegree(""); setDegree(""); }}
            />
          </FilterPill>

          {/* SPECIALISATIONS */}
          <FilterPill
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
                checked={tSpecs.includes(s)}
                onChange={() => toggleSpec(s, tSpecs, setTSpecs)}
              />
            ))}
            <ApplyClear
              onApply={() => { setSpecs(tSpecs); setPage(1); setOpen(null); }}
              onClear={() => { setTSpecs([]); setSpecs([]); }}
            />
          </FilterPill>

          <button className="ml-auto border border-gray-800 text-gray-800 px-4 py-2 rounded-lg text-sm font-medium">
            Email me info
          </button>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 h-[718px]">
          {currentItems.map((d) => (
            <DegreeCard key={d.id} degree={d} />
          ))}
        </div>

        {totalPages > 1 && (
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        )}
      </div>
    </section>
  );
};

export default DegreesFilterSection;
