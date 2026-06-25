import React, { useState } from 'react';
import { Search, Filter, MapPin, ChevronDown, ChevronUp, ChevronRight } from 'lucide-react';
import BranchCard from '../components/find-us/BranchCard';
import BookingModal from '../components/find-us/BookingModal';
import VisitModal from '../components/find-us/VisitModal';

// Expanded Mock data based on screenshots
const branches = [
  {
    id: "amd-cg-road",
    state: "Gujarat",
    name: "Ahmedabad CG Road",
    address: "102-104, 323 Corporate Park, Besides- Samudra Complex, Girish Cold Drink Cross Roads, Off C. G. Road, Navrangpura, Ahmedabad, Gujarat - 380009",
    phones: ["079 4014 1919", "+91 78740 03199"],
    email: "info.amd@edeco.in",
    whatsapp: "918278713791"
  },
  {
    id: "amd-iskcon",
    state: "Gujarat",
    name: "Ahmedabad Iskcon",
    address: "106, Palak Prime, Opp. Double Tree by Hilton, Iskcon-Ambli Road, Ahmedabad, Gujarat - 380058",
    phones: ["+91 84908 49007"],
    email: "amd.iskcon@edeco.in",
    whatsapp: "918490849007"
  },
  {
    id: "anand",
    state: "Gujarat",
    name: "Anand",
    address: "Cube - 0675, Ground floor, Opp Bakeland Bakery, Near Sardar Statue, V.V. Nagar, Anand, Gujarat - 388120",
    phones: ["+91 90238 58622"],
    email: "info.anand@edeco.in",
    whatsapp: "919023858622"
  },
  {
    id: "delhi-cp",
    state: "Delhi NCR",
    name: "New Delhi Connaught Place",
    address: "601 & 602, 6th Floor, Ashoka Estate Building, 24 Barakhamba Road, Connaught Place, New Delhi - 110001",
    phones: ["011 4015 1515", "+91 95998 08801"],
    email: "info.delhi@edeco.in",
    whatsapp: "919599808801"
  },
  {
    id: "noida",
    state: "Delhi NCR",
    name: "Noida Sector 18",
    address: "Office No. 302, 3rd Floor, Wave Silver Tower, Sector 18, Noida, Uttar Pradesh - 201301",
    phones: ["+91 95998 08802"],
    email: "info.noida@edeco.in",
    whatsapp: "919599808802"
  },
  {
    id: "blr-ashok",
    state: "Karnataka",
    name: "Bengaluru Ashok Nagar",
    address: "Ground Floor, Unit No. 03, Richmond Plaza, Richmond Circle, Bangalore, Karnataka - 560025",
    phones: ["080 4641 4141", "+91 99000 88201"],
    email: "info.blr@edeco.in",
    whatsapp: "919900088201"
  },
  {
    id: "chd-sec17",
    state: "Punjab & Chandigarh",
    name: "Chandigarh Sector 17",
    address: "SCO 147-148, 2nd Floor, Sector 17-C, Chandigarh, Punjab - 160017",
    phones: ["0172 402 0202", "+91 98888 77601"],
    email: "info.chd@edeco.in",
    whatsapp: "919888877601"
  },
  {
    id: "chennai-nung",
    state: "Tamil Nadu",
    name: "Chennai Nungambakkam",
    address: "No. 12, 4th Floor, Apex Plaza, Nungambakkam High Road, Chennai, Tamil Nadu - 600034",
    phones: ["044 4292 9292", "+91 98400 88301"],
    email: "info.chennai@edeco.in",
    whatsapp: "919840088301"
  },
  {
    id: "hyd-banjara",
    state: "Telangana",
    name: "Hyderabad Banjara Hills",
    address: "5th Floor, Shangrila Plaza, Opposite KBR Park, Road No. 2, Banjara Hills, Hyderabad, Telangana - 500034",
    phones: ["040 4455 5555", "+91 91000 88401"],
    email: "info.hyd@edeco.in",
    whatsapp: "919100088401"
  },
  {
    id: "kochi-ravi",
    state: "Kerala",
    name: "Kochi Ravipuram",
    address: "Door No. 39/3547, 1st Floor, Ravipuram Road, Valanjambalam, Kochi, Kerala - 682016",
    phones: ["0484 411 1111", "+91 97450 88501"],
    email: "info.kochi@edeco.in",
    whatsapp: "919745088501"
  },
  {
    id: "mumbai-church",
    state: "Maharashtra",
    name: "Mumbai Churchgate",
    address: "Office No. 4, Ground Floor, Merchant Chambers, Opp. Churchgate Station, Mumbai, Maharashtra - 400020",
    phones: ["022 4343 4343", "+91 98200 88601"],
    email: "info.mumbai@edeco.in",
    whatsapp: "919820088601"
  },
  {
    id: "pune-fc",
    state: "Maharashtra",
    name: "Pune F.C. Road",
    address: "Office No. 101, 1st Floor, Pride House, F.C. Road, Shivajinagar, Pune, Maharashtra - 411005",
    phones: ["020 4911 1111", "+91 99230 88701"],
    email: "info.pune@edeco.in",
    whatsapp: "919923088701"
  },
  {
    id: "vijayawada",
    state: "Andhra Pradesh",
    name: "Vijayawada Benz Circle",
    address: "Door No. 40-1-140, 3rd Floor, K.P. Towers, Benz Circle, Vijayawada, Andhra Pradesh - 520010",
    phones: ["0866 248 4848", "+91 88866 88501"],
    email: "info.vij@edeco.in",
    whatsapp: "918886688501"
  },
  {
    id: "gurugram-sec44",
    state: "Haryana",
    name: "Gurugram Sector 44",
    address: "100 Tech Park Avenue, Sector 44, Gurugram, Haryana - 122003",
    phones: ["+91 98765 43210"],
    email: "info.gurgaon@edeco.in",
    whatsapp: "919876543210"
  }
];

const mainRegions = [
  "All regions",
  "Punjab & Chandigarh",
  "Delhi NCR",
  "Haryana",
  "Gujarat",
   
];

const moreRegions = [
  
  "Karnataka",
  "Tamil Nadu",
  "Telangana",
  "Kerala",
  "Maharashtra",
  " Andhra Pradesh"
  
];

export default function FindUsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeRegions, setActiveRegions] = useState(["All regions"]);
  const [showMoreDropdown, setShowMoreDropdown] = useState(false);
  const [bookingBranch, setBookingBranch] = useState(null);
  const [visitBranch, setVisitBranch] = useState(null);

  const activeStates = activeRegions.map(region => {
    const branch = branches.find(b => b.name === region);
    return branch ? branch.state : region;
  });

  const toggleRegion = (region) => {
    if (region === "All regions") {
      setActiveRegions(["All regions"]);
      return;
    }

    setActiveRegions(prev => {
      let newSelection = prev.filter(r => r !== "All regions");
      
      if (newSelection.includes(region)) {
        newSelection = newSelection.filter(r => r !== region);
      } else {
        newSelection = [...newSelection, region];
      }

      return newSelection.length === 0 ? ["All regions"] : newSelection;
    });
  };

  const filteredBranches = branches.filter(branch => {
    const matchesSearch = branch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      branch.address.toLowerCase().includes(searchTerm.toLowerCase());

    let matchesRegion = true;
    if (!activeRegions.includes("All regions")) {
      matchesRegion = activeRegions.some(region => {
        if (mainRegions.includes(region) || moreRegions.includes(region)) {
          return branch.state === region;
        } else {
          return branch.name === region;
        }
      });
    }

    return matchesSearch && matchesRegion;
  });

  return (
    <div className="min-h-screen bg-slate-50 pt-20 pb-24">
      {/* Header Section */}
      <div className="w-[1350px] mx-auto  text-center mb-16">
        <div>
          <span className="inline-block px-4 py-1.5 rounded-full bg-blue-700/10 text-blue-700 text-xs font-bold tracking-widest uppercase mb-6">
            Get in touch
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
            Find a branch, book a call, or chat with us.
          </h1>
          <p className="text-blue-700 font-medium text-sm md:text-base max-w-2xl mx-auto">
            Your goals, your schedule. Choose the easiest way to connect with our team.
          </p>
        </div>

        {/* Search Bar */}
        <div className="mt-10 max-w-[902px] mx-auto">
          <div className="relative bg-white rounded-xl shadow-sm border border-slate-100 p-2 flex items-center">
            <Search className="text-slate-400 ml-3 shrink-0" size={20} />
            <input
              type="text"
              placeholder="Search branches, cities or landmarks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-3 pr-4 py-3 bg-transparent outline-none text-slate-700 placeholder-slate-400"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="mt-6 flex flex-wrap items-center px-3 gap-2 w-full max-w-[902px] mx-auto py-2.5 bg-white rounded-xl shadow-sm border border-slate-100">
          <div className="flex pr-2 items-center gap-1.5 text-slate-700 text-[14px] font-bold shrink-0">
            <Filter size={18} />
            Filters:
          </div>

          <div className=" flex-1 flex flex-wrap items-center  justify-between gap- relative z-10">
            {mainRegions.map((region, idx) => {
              const regionBranches = branches.filter(b => b.state === region);
              const hasDropdown = ['Delhi NCR', 'Maharashtra'].includes(region);
              const isActive = region === "All regions" 
                ? activeRegions.includes("All regions")
                : activeStates.includes(region) && !activeRegions.includes("All regions");

              if (hasDropdown) {
                return (
                  <div key={idx} className="relative group/filter">
                    <button
                      onClick={() => toggleRegion(region)}
                      className={`flex items-center whitespace-nowrap shrink gap-1 px-3 py-2 rounded-full text-xs font-bold transition-all ${isActive
                          ? 'bg-red-600 text-white shadow-md'
                          : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                    >
                      <MapPin size={12} className={isActive ? 'text-white' : 'text-slate-400'} />
                      {region}
                      <ChevronDown size={14} className="ml-0.5 opacity-70" />
                    </button>

                    <div className="absolute left-0 top-full mt-2 w-56 bg-white border border-slate-100 rounded-xl shadow-xl z-50 opacity-0 invisible group-hover/filter:opacity-100 group-hover/filter:visible transition-all py-1 before:absolute before:-top-2 before:left-0 before:w-full before:h-2">
                      {regionBranches.length > 0 ? regionBranches.map(branch => (
                        <button
                          key={branch.id}
                          onClick={() => toggleRegion(branch.name)}
                          className={`w-full text-left px-4 py-3 text-xs font-semibold hover:bg-slate-50 transition-colors ${activeRegions.includes(branch.name) ? 'text-red-600 bg-red-50' : 'text-slate-600 hover:text-blue-700'
                            }`}
                        >
                          {branch.name}
                        </button>
                      )) : (
                        <div className="px-4 py-3 text-xs text-slate-400 font-medium">No branches available</div>
                      )}
                    </div>
                  </div>
                );
              }

              return (
                <button
                  key={idx}
                  onClick={() => toggleRegion(region)}
                  className={`flex items-center whitespace-nowrap shrink gap-1 px-3 py-2 rounded-full text-xs font-bold transition-all ${isActive
                      ? 'bg-red-600 text-white shadow-md'
                      : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                >
                  {region !== 'All regions' && <MapPin size={12} className={isActive ? 'text-white' : 'text-slate-400'} />}
                  {region}
                </button>
              );
            })}

            {/* MORE DROPDOWN */}
            <div className="relative group/more">
              {(() => {
                const selectedMoreRegions = activeStates.filter(s => moreRegions.includes(s));
                const isMoreActive = selectedMoreRegions.length > 0 && !activeRegions.includes("All regions");
                let moreText = 'More';
                if (isMoreActive && selectedMoreRegions.length === 1) {
                  moreText = selectedMoreRegions[0];
                } else if (isMoreActive && selectedMoreRegions.length > 1) {
                  // To avoid duplicates if both a branch and state are selected in activeRegions
                  const uniqueStates = [...new Set(selectedMoreRegions)];
                  if (uniqueStates.length === 1) {
                    moreText = uniqueStates[0];
                  } else {
                    moreText = `${uniqueStates.length} Selected`;
                  }
                }

                return (
                  <>
                    <button
                      className={`flex items-center whitespace-nowrap shrink gap-1 px-3 py-2 rounded-full text-xs font-bold transition-all ${isMoreActive
                          ? 'bg-red-600 text-white shadow-md'
                          : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                    >
                      {isMoreActive && <MapPin size={12} className="text-white" />}
                      {moreText}
                      <ChevronDown size={14} className="ml-0.5 opacity-70" />
                    </button>

                    <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-slate-100 rounded-xl shadow-xl z-50 opacity-0 invisible group-hover/more:opacity-100 group-hover/more:visible transition-all py-1 before:absolute before:-top-2 before:right-0 before:w-full before:h-2">
                      {moreRegions.map((region, idx) => {
                        const regionBranches = branches.filter(b => b.state === region);
                        const hasBranches = regionBranches.length > 1;
                        const isActiveRegion = activeStates.includes(region) && !activeRegions.includes("All regions");

                        return (
                          <div key={idx} className="relative group/state">
                            <button
                              onClick={() => toggleRegion(region)}
                              className={`w-full flex items-center justify-between px-4 py-3 text-xs font-bold hover:bg-slate-50 transition-colors ${isActiveRegion ? 'text-red-600 bg-red-50' : 'text-slate-600'
                                }`}
                            >
                              {region}
                              {hasBranches && <ChevronRight size={14} className="text-slate-400" />}
                            </button>

                            {hasBranches && (
                              <div className="absolute right-full top-0 mr-1 w-56 bg-white border border-slate-100 rounded-xl shadow-xl z-50 opacity-0 invisible group-hover/state:opacity-100 group-hover/state:visible transition-all py-1 before:absolute before:-right-3 before:top-0 before:w-3 before:h-full">
                                {regionBranches.map(branch => (
                                  <button
                                    key={branch.id}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      toggleRegion(branch.name);
                                    }}
                                    className={`w-full text-left px-4 py-3 text-xs font-semibold hover:bg-slate-50 transition-colors ${activeRegions.includes(branch.name) ? 'text-red-600 bg-red-50' : 'text-slate-600 hover:text-blue-700'
                                      }`}
                                  >
                                    {branch.name}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </>
                );
              })()}
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
            <h3 className="text-xl font-bold text-slate-700">No branches found</h3>
            <p className="text-slate-500 mt-2">Try adjusting your search or region filter</p>
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
