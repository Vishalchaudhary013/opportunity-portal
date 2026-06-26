import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  Filter,
  MapPin,
  ChevronDown,
  ChevronUp,
  ChevronRight,
} from "lucide-react";
import BranchCard from "../components/find-us/BranchCard";
import BookingModal from "../components/find-us/BookingModal";
import VisitModal from "../components/find-us/VisitModal";

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

const REGIONS = ["All regions", "North", "South", "East", "West", "Central"];
const SORT_OPTIONS = ["Newest", "Most Visited", "A-Z"];

export default function FindUsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [regionFilter, setRegionFilter] = useState("All regions");
  const [cityFilter, setCityFilter] = useState("All cities");
  const [sortBy, setSortBy] = useState("Newest");

  const [openDropdown, setOpenDropdown] = useState(null); // 'region', 'city', 'sort' or null
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

  // Compute cities based on selected region
  const availableCities = [
    "All cities",
    ...new Set(
      branches
        .filter(
          (b) => regionFilter === "All regions" || b.region === regionFilter,
        )
        .map((b) => b.city),
    ),
  ];

  // Reset city if region changes and city is not in new region
  useEffect(() => {
    if (cityFilter !== "All cities" && !availableCities.includes(cityFilter)) {
      setCityFilter("All cities");
    }
  }, [regionFilter, availableCities, cityFilter]);

  let filteredBranches = branches.filter((branch) => {
    const matchesSearch =
      branch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      branch.address.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRegion =
      regionFilter === "All regions" || branch.region === regionFilter;
    const matchesCity =
      cityFilter === "All cities" || branch.city === cityFilter;

    return matchesSearch && matchesRegion && matchesCity;
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

        <div className="flex items-center justify-between w-[920px] mx-auto  px-3 py-4">
          {/* Filters */}
          <div
            className=" flex flex-wrap items-center px-3 gap-2 w-full mx-auto "
            ref={dropdownRef}
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
                  className={`flex items-center whitespace-nowrap gap-1 px-3 py-2 rounded-full text-xs font-bold transition-all ${
                    regionFilter !== "All regions" || openDropdown === "region"
                      ? "bg-red-600 text-white shadow-md"
                      : "bg-white border border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  {regionFilter === "All regions"
                    ? "All regions"
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

              {/* City Dropdown */}
              <div className="relative">
                <button
                  onClick={() =>
                    setOpenDropdown(openDropdown === "city" ? null : "city")
                  }
                  className={`flex items-center whitespace-nowrap gap-1 px-3 py-2 rounded-full text-xs font-bold transition-all ${
                    cityFilter !== "All cities" || openDropdown === "city"
                      ? "bg-red-600 text-white shadow-md"
                      : "bg-white border border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  {cityFilter === "All cities" ? "All cities" : cityFilter}
                  <ChevronDown size={14} className="ml-0.5 opacity-70" />
                </button>
                {openDropdown === "city" && (
                  <div className="absolute left-0 top-full mt-2 w-48 max-h-60 overflow-y-auto bg-white border border-slate-100 rounded-xl shadow-xl z-50 py-1">
                    {availableCities.map((c) => (
                      <button
                        key={c}
                        onClick={() => {
                          setCityFilter(c);
                          setOpenDropdown(null);
                        }}
                        className={`w-full text-left px-4 py-2 text-xs font-bold hover:bg-slate-50 ${cityFilter === c ? "text-red-600 bg-red-50" : "text-slate-600"}`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Sort Dropdown */}
              <div className="relative">
                <button
                  onClick={() =>
                    setOpenDropdown(openDropdown === "sort" ? null : "sort")
                  }
                  className={`flex items-center whitespace-nowrap gap-1 px-3 py-2 rounded-full text-xs font-bold transition-all ${
                    openDropdown === "sort" || sortBy !== "Newest"
                      ? "bg-red-600 text-white shadow-md"
                      : "bg-white border border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
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
          {/* Search Bar */}
          <div className=" mx-auto">
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
