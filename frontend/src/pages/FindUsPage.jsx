import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Search,
  Filter,
  MapPin,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  Globe,
  Map,
  Building2,
  Navigation,
  ArrowDownUp
} from "lucide-react";
import BranchCard from "../components/find-us/BranchCard";
import BookingModal from "../components/find-us/BookingModal";
import VisitModal from "../components/find-us/VisitModal";
import { getStates, getDistricts } from 'india-location-kit';
import { City } from 'country-state-city';

// Expanded Mock data based on screenshots
const branches = [
  {
    id: "amd-cg-road",
    region: "West",
    city: "Ahmedabad",
    state: "Gujarat",
    name: "Ahmedabad CG Road",
    address:
      "102-104, 323 Corporate Park, Besides- Samudra Complex, Girish Cold Drink Cross Roads, Off C. G. Road, Navrangpura, Ahmedabad, Gujarat - 380009",
    phones: ["079 4014 1919", "+91 78740 03199"],
    email: "info.amd@edeco.in",
    whatsapp: "918278713791",
  },
  {
    id: "amd-iskcon",
    region: "West",
    city: "Ahmedabad",
    state: "Gujarat",
    name: "Ahmedabad Iskcon",
    address:
      "106, Palak Prime, Opp. Double Tree by Hilton, Iskcon-Ambli Road, Ahmedabad, Gujarat - 380058",
    phones: ["+91 84908 49007"],
    email: "amd.iskcon@edeco.in",
    whatsapp: "918490849007",
  },
  {
    id: "anand",
    region: "West",
    city: "Anand",
    state: "Gujarat",
    name: "Anand",
    address:
      "Cube - 0675, Ground floor, Opp Bakeland Bakery, Near Sardar Statue, V.V. Nagar, Anand, Gujarat - 388120",
    phones: ["+91 90238 58622"],
    email: "info.anand@edeco.in",
    whatsapp: "919023858622",
  },
  {
    id: "delhi-cp",
    region: "North",
    city: "New Delhi",
    state: "Delhi NCR",
    name: "New Delhi Connaught Place",
    address:
      "601 & 602, 6th Floor, Ashoka Estate Building, 24 Barakhamba Road, Connaught Place, New Delhi - 110001",
    phones: ["011 4015 1515", "+91 95998 08801"],
    email: "info.delhi@edeco.in",
    whatsapp: "919599808801",
  },
  {
    id: "noida",
    region: "North",
    city: "Noida",
    state: "Delhi NCR",
    name: "Noida Sector 18",
    address:
      "Office No. 302, 3rd Floor, Wave Silver Tower, Sector 18, Noida, Uttar Pradesh - 201301",
    phones: ["+91 95998 08802"],
    email: "info.noida@edeco.in",
    whatsapp: "919599808802",
  },
  {
    id: "blr-ashok",
    region: "South",
    city: "Bengaluru",
    state: "Karnataka",
    name: "Bengaluru Ashok Nagar",
    address:
      "Ground Floor, Unit No. 03, Richmond Plaza, Richmond Circle, Bangalore, Karnataka - 560025",
    phones: ["080 4641 4141", "+91 99000 88201"],
    email: "info.blr@edeco.in",
    whatsapp: "919900088201",
  },
  {
    id: "chd-sec17",
    region: "North",
    city: "Chandigarh",
    state: "Punjab & Chandigarh",
    name: "Chandigarh Sector 17",
    address: "SCO 147-148, 2nd Floor, Sector 17-C, Chandigarh, Punjab - 160017",
    phones: ["0172 402 0202", "+91 98888 77601"],
    email: "info.chd@edeco.in",
    whatsapp: "919888877601",
  },
  {
    id: "chennai-nung",
    region: "South",
    city: "Chennai",
    state: "Tamil Nadu",
    name: "Chennai Nungambakkam",
    address:
      "No. 12, 4th Floor, Apex Plaza, Nungambakkam High Road, Chennai, Tamil Nadu - 600034",
    phones: ["044 4292 9292", "+91 98400 88301"],
    email: "info.chennai@edeco.in",
    whatsapp: "919840088301",
  },
  {
    id: "hyd-banjara",
    region: "South",
    city: "Hyderabad",
    state: "Telangana",
    name: "Hyderabad Banjara Hills",
    address:
      "5th Floor, Shangrila Plaza, Opposite KBR Park, Road No. 2, Banjara Hills, Hyderabad, Telangana - 500034",
    phones: ["040 4455 5555", "+91 91000 88401"],
    email: "info.hyd@edeco.in",
    whatsapp: "919100088401",
  },
  {
    id: "kochi-ravi",
    region: "South",
    city: "Kochi",
    state: "Kerala",
    name: "Kochi Ravipuram",
    address:
      "Door No. 39/3547, 1st Floor, Ravipuram Road, Valanjambalam, Kochi, Kerala - 682016",
    phones: ["0484 411 1111", "+91 97450 88501"],
    email: "info.kochi@edeco.in",
    whatsapp: "919745088501",
  },
  {
    id: "mumbai-church",
    region: "West",
    city: "Mumbai",
    state: "Maharashtra",
    name: "Mumbai Churchgate",
    address:
      "Office No. 4, Ground Floor, Merchant Chambers, Opp. Churchgate Station, Mumbai, Maharashtra - 400020",
    phones: ["022 4343 4343", "+91 98200 88601"],
    email: "info.mumbai@edeco.in",
    whatsapp: "919820088601",
  },
  {
    id: "pune-fc",
    region: "West",
    city: "Pune",
    state: "Maharashtra",
    name: "Pune F.C. Road",
    address:
      "Office No. 101, 1st Floor, Pride House, F.C. Road, Shivajinagar, Pune, Maharashtra - 411005",
    phones: ["020 4911 1111", "+91 99230 88701"],
    email: "info.pune@edeco.in",
    whatsapp: "919923088701",
  },
  {
    id: "vijayawada",
    region: "South",
    city: "Vijayawada",
    state: "Andhra Pradesh",
    name: "Vijayawada Benz Circle",
    address:
      "Door No. 40-1-140, 3rd Floor, K.P. Towers, Benz Circle, Vijayawada, Andhra Pradesh - 520010",
    phones: ["0866 248 4848", "+91 88866 88501"],
    email: "info.vij@edeco.in",
    whatsapp: "918886688501",
  },
  {
    id: "gurugram-sec44",
    region: "North",
    city: "Gurugram",
    state: "Haryana",
    name: "Gurugram Sector 44",
    address: "100 Tech Park Avenue, Sector 44, Gurugram, Haryana - 122003",
    phones: ["+91 98765 43210"],
    email: "info.gurgaon@edeco.in",
    whatsapp: "919876543210",
  },
];

const STATE_REGION_MAP = {
  // North
  "DL": "North", "HR": "North", "PB": "North", "CH": "North", "HP": "North", "JK": "North", "LA": "North", "UP": "North", "UT": "North", "RJ": "North",
  // South
  "AP": "South", "KA": "South", "KL": "South", "TN": "South", "TG": "South", "AN": "South", "LD": "South", "PY": "South",
  // East 
  "BR": "East", "JH": "East", "OR": "East", "WB": "East", "AR": "East", "AS": "East", "MN": "East", "ML": "East", "MZ": "East", "NL": "East", "SK": "East", "TR": "East",
  // West
  "GJ": "West", "MH": "West", "GA": "West", "DN": "West", "DD": "West",
  // Central
  "MP": "Central", "CG": "Central"
};

const REGIONS = ["Regions", "North", "South", "East", "West", "Central"];
const SORT_OPTIONS = ["Newest", "Most Visited", "A-Z"];

export default function FindUsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  
  const [regionFilter, setRegionFilter] = useState("Regions");
  const [stateFilterCode, setStateFilterCode] = useState("");
  const [districtFilterCode, setDistrictFilterCode] = useState("");
  const [cityFilterCode, setCityFilterCode] = useState("");

  const [stateSearch, setStateSearch] = useState("");
  const [districtSearch, setDistrictSearch] = useState("");
  const [citySearch, setCitySearch] = useState("");
  
  const [sortBy, setSortBy] = useState("Newest");

  const [openDropdown, setOpenDropdown] = useState(null); // 'state', 'district', 'city', 'sort' or null
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const [bookingBranch, setBookingBranch] = useState(null);
  const [visitBranch, setVisitBranch] = useState(null);

  // Derived location lists
  const states = useMemo(() => getStates(), []);
  const districts = useMemo(() => stateFilterCode ? getDistricts(stateFilterCode) : [], [stateFilterCode]);
  const cities = useMemo(() => stateFilterCode ? City.getCitiesOfState('IN', stateFilterCode) : [], [stateFilterCode]);

  const filteredStates = states.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(stateSearch.toLowerCase());
    const matchesRegion = regionFilter === "Regions" || STATE_REGION_MAP[s.code] === regionFilter;
    return matchesSearch && matchesRegion;
  });
  const filteredDistricts = districts.filter(d => d.name.toLowerCase().includes(districtSearch.toLowerCase()));
  const filteredCities = cities.filter(c => c.name.toLowerCase().includes(citySearch.toLowerCase()));

  const selectedStateName = states.find(s => s.code === stateFilterCode)?.name || "States";
  const selectedDistrictName = districts.find(d => d.code === districtFilterCode)?.name || "Districts";
  const selectedCityName = cityFilterCode || "Cities";

  let filteredBranches = branches.filter((branch) => {
    const matchesSearch =
      branch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      branch.address.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRegion = regionFilter === "Regions" || branch.region === regionFilter;
    const matchesState = !stateFilterCode || branch.state.toLowerCase().includes(selectedStateName.toLowerCase()) || selectedStateName.toLowerCase().includes(branch.state.toLowerCase());
    const matchesCity = !cityFilterCode || branch.city.toLowerCase() === selectedCityName.toLowerCase();

    return matchesSearch && matchesRegion && matchesState && matchesCity;
  });

  if (sortBy === "A-Z") {
    filteredBranches.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortBy === "Most Visited") {
    // Mock sort, for example reverse alphabetical or just based on string length to simulate a different order
    filteredBranches.sort((a, b) => b.name.length - a.name.length);
  } else if (sortBy === "Newest") {
    // Default order
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-20 pb-24">
      {/* Header Section */}
      <div className="w-[1350px] mx-auto  text-center mb-16">
        <div className="mb-10">
          <span className="inline-block px-4 py-1.5 rounded-full bg-blue-700/10 text-blue-700 text-xs font-bold tracking-widest uppercase mb-6">
            Get in touch
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
            Find a branch, book a call, or chat with us.
          </h1>
          <p className="text-blue-700 font-medium text-sm md:text-base max-w-2xl mx-auto">
            Your goals, your schedule. Choose the easiest way to connect with
            our team.
          </p>
        </div>

        <div className="flex items-center justify-between  mx-auto  px-3 py-4" ref={dropdownRef}>
          {/* Filters */}
          <div
            className=" flex flex-wrap items-center px-3 gap-2 w-full mx-auto "
          >
            <div className="flex pr-2 items-center gap-1.5 text-slate-700 text-[14px] font-bold shrink-0">
              <Filter size={18} />
              Filters:
            </div>

            <div className="flex-1 flex flex-wrap items-center gap-3 relative z-10">
              {/* Region Dropdown */}
              <div className="relative">
                <button
                  onClick={() =>
                    setOpenDropdown(openDropdown === "region" ? null : "region")
                  }
                  className={`flex items-center whitespace-nowrap gap-1.5 px-3 py-2 rounded-full text-xs font-bold transition-all ${
                    regionFilter !== "Regions" || openDropdown === "region"
                      ? "bg-red-600 text-white shadow-md"
                      : "bg-white border border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <Globe size={16} className={regionFilter !== "Regions" || openDropdown === "region" ? "text-white" : "text-slate-600"} />
                  {regionFilter === "Regions"
                    ? "Regions"
                    : regionFilter}
                  <ChevronDown size={14} className="ml-0.5 opacity-70" />
                </button>
                {openDropdown === "region" && (
                  <div className="absolute left-0 top-full mt-2 w-48 bg-white border border-slate-100 rounded-xl shadow-xl z-50 py-1">
                    {REGIONS.map((r) => (
                      <button
                        key={r}
                        onClick={() => {
                          setRegionFilter(r);
                          setOpenDropdown(null);
                        }}
                        className={`w-full text-left px-4 py-2 text-xs font-bold hover:bg-slate-50 ${regionFilter === r ? "text-red-600 bg-red-50" : "text-slate-600"}`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* State Dropdown */}
              <div className="relative">
                <button
                  onClick={() =>
                    setOpenDropdown(openDropdown === "state" ? null : "state")
                  }
                  className={`flex items-center whitespace-nowrap gap-1.5 px-3 py-2 rounded-full text-xs font-bold transition-all ${
                    stateFilterCode !== "" || openDropdown === "state"
                      ? "bg-red-600 text-white shadow-md"
                      : "bg-white border border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <MapPin size={16} className={stateFilterCode !== "" || openDropdown === "state" ? "text-white" : "text-slate-600"} />
                  {stateFilterCode === "" ? "States" : selectedStateName}
                  <ChevronDown size={14} className="ml-0.5 opacity-70" />
                </button>
                {openDropdown === "state" && (
                  <div className="absolute left-0 top-full mt-2 w-56 max-h-72 overflow-y-auto bg-white border border-slate-100 rounded-xl shadow-xl z-50 py-1">
                    <div className="px-2 pb-2 sticky top-0 bg-white border-b border-gray-50 pt-1 z-10">
                      <div className="flex items-center px-2 py-1.5 bg-gray-50 rounded-lg border border-gray-100">
                        <Search size={14} className="text-gray-400 mr-2" />
                        <input 
                          type="text" 
                          placeholder="Search state..." 
                          value={stateSearch}
                          onChange={(e) => setStateSearch(e.target.value)}
                          className="bg-transparent text-xs outline-none w-full text-gray-700"
                        />
                      </div>
                    </div>
                    <button
                        onClick={() => {
                          setStateFilterCode("");
                          setDistrictFilterCode("");
                          setCityFilterCode("");
                          setOpenDropdown(null);
                        }}
                        className={`w-full text-left px-4 py-2 text-xs font-bold hover:bg-slate-50 ${stateFilterCode === "" ? "text-red-600 bg-red-50" : "text-slate-600"}`}
                      >
                        All States
                      </button>
                    {filteredStates.length > 0 ? filteredStates.map((s) => (
                      <button
                        key={s.code}
                        onClick={() => {
                          setStateFilterCode(s.code);
                          setDistrictFilterCode("");
                          setCityFilterCode("");
                          setOpenDropdown(null);
                        }}
                        className={`w-full text-left px-4 py-2 text-xs font-bold hover:bg-slate-50 ${stateFilterCode === s.code ? "text-red-600 bg-red-50" : "text-slate-600"}`}
                      >
                        {s.name}
                      </button>
                    )) : (
                      <div className="px-4 py-3 text-xs text-center text-gray-400">No states found</div>
                    )}
                  </div>
                )}
              </div>

              {/* District Dropdown */}
              <div className="relative">
                <button
                  onClick={() => {
                    if (stateFilterCode !== "") {
                      setOpenDropdown(openDropdown === "district" ? null : "district")
                    }
                  }}
                  disabled={stateFilterCode === ""}
                  className={`flex items-center whitespace-nowrap gap-1.5 px-3 py-2 rounded-full text-xs font-bold transition-all ${
                    districtFilterCode !== "" || openDropdown === "district"
                      ? "bg-red-600 text-white shadow-md"
                      : stateFilterCode === "" 
                        ? "bg-slate-50 border border-slate-200 text-slate-400 opacity-70 cursor-not-allowed" 
                        : "bg-white border border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <Map size={16} className={districtFilterCode !== "" || openDropdown === "district" ? "text-white" : stateFilterCode === "" ? "text-slate-400" : "text-slate-600"} />
                  {districtFilterCode === "" ? "Districts" : selectedDistrictName}
                  <ChevronDown size={14} className="ml-0.5 opacity-70" />
                </button>
                {openDropdown === "district" && stateFilterCode !== "" && (
                  <div className="absolute left-0 top-full mt-2 w-56 max-h-72 overflow-y-auto bg-white border border-slate-100 rounded-xl shadow-xl z-50 py-1">
                    <div className="px-2 pb-2 sticky top-0 bg-white border-b border-gray-50 pt-1 z-10">
                      <div className="flex items-center px-2 py-1.5 bg-gray-50 rounded-lg border border-gray-100">
                        <Search size={14} className="text-gray-400 mr-2" />
                        <input 
                          type="text" 
                          placeholder="Search district..." 
                          value={districtSearch}
                          onChange={(e) => setDistrictSearch(e.target.value)}
                          className="bg-transparent text-xs outline-none w-full text-gray-700"
                        />
                      </div>
                    </div>
                     <button
                        onClick={() => {
                          setDistrictFilterCode("");
                          setCityFilterCode("");
                          setOpenDropdown(null);
                        }}
                        className={`w-full text-left px-4 py-2 text-xs font-bold hover:bg-slate-50 ${districtFilterCode === "" ? "text-red-600 bg-red-50" : "text-slate-600"}`}
                      >
                        All Districts
                      </button>
                    {filteredDistricts.length > 0 ? filteredDistricts.map((d) => (
                      <button
                        key={d.code}
                        onClick={() => {
                          setDistrictFilterCode(d.code);
                          setCityFilterCode("");
                          setOpenDropdown(null);
                        }}
                        className={`w-full text-left px-4 py-2 text-xs font-bold hover:bg-slate-50 ${districtFilterCode === d.code ? "text-red-600 bg-red-50" : "text-slate-600"}`}
                      >
                        {d.name}
                      </button>
                    )) : (
                      <div className="px-4 py-3 text-xs text-center text-gray-400">No districts found</div>
                    )}
                  </div>
                )}
              </div>

              {/* City Dropdown */}
              <div className="relative">
                <button
                  onClick={() => {
                    if (stateFilterCode !== "") {
                      setOpenDropdown(openDropdown === "city" ? null : "city")
                    }
                  }}
                  disabled={stateFilterCode === ""}
                  className={`flex items-center whitespace-nowrap gap-1.5 px-3 py-2 rounded-full text-xs font-bold transition-all ${
                    cityFilterCode !== "" || openDropdown === "city"
                      ? "bg-red-600 text-white shadow-md"
                      : stateFilterCode === "" 
                        ? "bg-slate-50 border border-slate-200 text-slate-400 opacity-70 cursor-not-allowed" 
                        : "bg-white border border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <Building2 size={16} className={cityFilterCode !== "" || openDropdown === "city" ? "text-white" : stateFilterCode === "" ? "text-slate-400" : "text-slate-600"} />
                  {cityFilterCode === "" ? "Cities" : selectedCityName}
                  <ChevronDown size={14} className="ml-0.5 opacity-70" />
                </button>
                {openDropdown === "city" && stateFilterCode !== "" && (
                  <div className="absolute left-0 top-full mt-2 w-56 max-h-72 overflow-y-auto bg-white border border-slate-100 rounded-xl shadow-xl z-50 py-1">
                    <div className="px-2 pb-2 sticky top-0 bg-white border-b border-gray-50 pt-1 z-10">
                      <div className="flex items-center px-2 py-1.5 bg-gray-50 rounded-lg border border-gray-100">
                        <Search size={14} className="text-gray-400 mr-2" />
                        <input 
                          type="text" 
                          placeholder="Search city..." 
                          value={citySearch}
                          onChange={(e) => setCitySearch(e.target.value)}
                          className="bg-transparent text-xs outline-none w-full text-gray-700"
                        />
                      </div>
                    </div>
                     <button
                        onClick={() => {
                          setCityFilterCode("");
                          setOpenDropdown(null);
                        }}
                        className={`w-full text-left px-4 py-2 text-xs font-bold hover:bg-slate-50 ${cityFilterCode === "" ? "text-red-600 bg-red-50" : "text-slate-600"}`}
                      >
                        All Cities
                      </button>
                    {filteredCities.length > 0 ? filteredCities.map((c) => (
                      <button
                        key={c.name}
                        onClick={() => {
                          setCityFilterCode(c.name);
                          setOpenDropdown(null);
                        }}
                        className={`w-full text-left px-4 py-2 text-xs font-bold hover:bg-slate-50 ${cityFilterCode === c.name ? "text-red-600 bg-red-50" : "text-slate-600"}`}
                      >
                        {c.name}
                      </button>
                    )) : (
                      <div className="px-4 py-3 text-xs text-center text-gray-400">No cities found</div>
                    )}
                  </div>
                )}
              </div>

              {/* Sort Dropdown */}
             
            </div>
          </div>
          {/* Search Bar */}
          {/* <div className=" mx-auto">
            <div className="relative  border rounded-4xl border-black/5 shadow flex items-center">
              <Search className="text-slate-400 ml-3 shrink-0" size={20} />
              <input
                type="text"
                placeholder="Search branches, cities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-[250px] pl-3 pr-4 py-1.5 bg-transparent outline-none text-slate-700 placeholder-slate-400 "
              />
            </div>
          </div> */}

           <div className="relative">
                <button
                  onClick={() =>
                    setOpenDropdown(openDropdown === "sort" ? null : "sort")
                  }
                  className={`flex items-center whitespace-nowrap gap-1.5 px-3 py-2 rounded-full text-xs font-bold transition-all ${
                    openDropdown === "sort" || sortBy !== "Newest"
                      ? "bg-red-600 text-white shadow-md"
                      : "bg-white border border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <ArrowDownUp size={14} className={openDropdown === "sort" || sortBy !== "Newest" ? "text-white" : "text-slate-600"} />
                  Sort: {sortBy}
                  <ChevronDown size={14} className="ml-0.5 opacity-70" />
                </button>
                {openDropdown === "sort" && (
                  <div className="absolute left-0 top-full mt-2 w-48 bg-white border border-slate-100 rounded-xl shadow-xl z-50 py-1">
                    {SORT_OPTIONS.map((s) => (
                      <button
                        key={s}
                        onClick={() => {
                          setSortBy(s);
                          setOpenDropdown(null);
                        }}
                        className={`w-full text-left px-4 py-2 text-xs font-bold hover:bg-slate-50 ${sortBy === s ? "text-red-600 bg-red-50" : "text-slate-600"}`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>
        </div>
      </div>

      {/* Grid Section */}
      <div className="max-w-[1350px] mx-auto px-4 md:px-6">
        {filteredBranches.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredBranches.map((branch, idx) => (
              <BranchCard
                key={branch.id}
                branch={branch}
                index={idx}
                onBookClick={(b) => setBookingBranch(b)}
                onVisitClick={(b) => setVisitBranch(b)}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-2xl border border-slate-100 max-w-3xl mx-auto">
            <MapPin size={48} className="text-slate-200 mb-4" />
            <h3 className="text-xl font-bold text-slate-700">
              No branches found
            </h3>
            <p className="text-slate-500 mt-2">
              Try adjusting your search or region filter
            </p>
          </div>
        )}
      </div>

      {/* Modals */}
      {bookingBranch && (
        <BookingModal
          branch={bookingBranch}
          onClose={() => setBookingBranch(null)}
        />
      )}

      {visitBranch && (
        <VisitModal
          branch={visitBranch}
          onClose={() => setVisitBranch(null)}
          onBookClick={(b) => {
            setVisitBranch(null);
            setBookingBranch(b);
          }}
        />
      )}
    </div>
  );
}
