import React from "react";
import { FiFileText, FiTrash2, FiEdit2, FiCheck, FiX, FiCheckCircle, FiEye, FiEyeOff, FiExternalLink, FiKey, FiGlobe } from "react-icons/fi";
import { useAdminContext } from "./AdminContext";
import { API_BASE_URL } from "../../api/apiClient";
import { useNavigate } from "react-router-dom";
import TextEditor from "./TextEditor";

const CheckboxDropdown = ({ label, options, selected, onChange, required }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef(null);

 

  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex flex-col gap-2 text-sm font-semibold text-slate-700 relative" ref={dropdownRef}>
      <span>{label} {required && <span className="text-rose-600">*</span>}</span>
      <div 
        className="border border-[#D6E2FC] rounded-xl px-4 py-3 bg-slate-50 cursor-pointer flex justify-between items-center transition-all hover:bg-white"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-normal text-slate-600 truncate">
          {selected?.length > 0 ? selected.join(', ') : "Select options..."}
        </span>
        <svg className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
      </div>
      
      {isOpen && (
        <div className="absolute top-[100%] left-0 w-full mt-2 bg-white border border-[#D6E2FC] rounded-xl shadow-lg z-10 max-h-60 overflow-y-auto p-2">
          {options.map(option => (
            <label key={option} className="flex items-center gap-3 px-3 py-2 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors">
              <input 
                type="checkbox" 
                className="accent-red-600 w-4 h-4 rounded"
                checked={selected?.includes(option)} 
                onChange={(e) => onChange(e, option)}
              />
              <span className="font-normal text-slate-700">{option}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

const CreatableCheckboxDropdown = ({ label, defaultOptions, selected, onChange, required, className = "" }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [options, setOptions] = React.useState(defaultOptions);
  const [inputValue, setInputValue] = React.useState("");
  const dropdownRef = React.useRef(null);

  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Update options if selected items contain something not in default options
  React.useEffect(() => {
    if (selected && selected.length > 0) {
      const newOptions = selected.filter(s => !options.includes(s));
      if (newOptions.length > 0) {
        setOptions(prev => [...prev, ...newOptions]);
      }
    }
  }, [selected, options]);

  const handleAddOption = (e) => {
    e.preventDefault();
    const newOption = inputValue.trim();
    if (newOption && !options.includes(newOption)) {
      setOptions([...options, newOption]);
      // Also automatically select the new option
      onChange({ target: { checked: true } }, newOption);
    }
    setInputValue("");
  };

  return (
    <div className="flex flex-col gap-2 text-sm font-semibold text-slate-700 relative" ref={dropdownRef}>
      <span>{label} {required && <span className="text-rose-600">*</span>}</span>
      <div 
        className={`border border-[#D6E2FC] rounded-xl px-4 py-3 bg-slate-50 cursor-pointer flex justify-between transition-all hover:bg-white flex-1 ${className || 'items-center'}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-normal text-slate-600 truncate">
          {selected?.length > 0 ? selected.join(', ') : "Select options..."}
        </span>
        <svg className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
      </div>
      
      {isOpen && (
        <div className="absolute top-[100%] left-0 w-full mt-2 bg-white border border-[#D6E2FC] rounded-xl shadow-lg z-10 max-h-72 flex flex-col">
          <div className="p-2 border-b border-slate-100 flex gap-2">
            <input 
              type="text" 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddOption(e); } }}
              placeholder="Create new perk..." 
              className="flex-1 border border-[#D6E2FC] rounded-lg px-3 py-2 text-sm font-normal outline-none focus:ring-1 focus:ring-blue-500"
            />
            <button 
              type="button" 
              onClick={handleAddOption}
              className="bg-slate-800 text-white px-3 py-2 rounded-lg text-xs font-bold hover:bg-slate-700"
            >
              Add
            </button>
          </div>
          <div className="overflow-y-auto p-2 max-h-48">
            {options.map(option => (
              <label key={option} className="flex items-center gap-3 px-3 py-2 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors">
                <input 
                  type="checkbox" 
                  className="accent-red-600 w-4 h-4 rounded"
                  checked={selected?.includes(option)} 
                  onChange={(e) => onChange(e, option)}
                />
                <span className="font-normal text-slate-700">{option}</span>
              </label>
            ))}
            {options.length === 0 && <div className="p-3 text-slate-500 text-sm text-center">No options available</div>}
          </div>
        </div>
      )}
    </div>
  );
};

const OpportunityForm = () => {
  const {
    isSuperDashboard,
    user, isAdmin, isSuperAdmin, isBootstrapping, isImpersonating,
    form, editingId, showOpportunityForm, requiredSkillInputs, benefitInputs,
    currentStep, setCurrentStep, showPreviewModal, showSuccessMessage,
    activeSection,
    busy,
    handleChange, handleLogoChange, handleRequiredSkillChange, addRequiredSkillInput, removeRequiredSkillInput,
    handleBenefitChange, addBenefitInput, resetForm,
    handleSubmit, handleConfirmSubmit, setForm,
  } = useAdminContext();
  const navigate = useNavigate();

  const handleArrayChange = (e, field) => {
    const value = e.target.value;
    const array = value.split(',').map(item => item.trim());
    setForm(prev => ({ ...prev, [field]: array }));
  };

  const handleMultiSelectChange = (e, field) => {
    const options = Array.from(e.target.selectedOptions, option => option.value);
    setForm(prev => ({ ...prev, [field]: options }));
  };

  const handleCheckboxChange = (e, field, value) => {
    const isChecked = e.target.checked;
    setForm(prev => {
      const array = prev[field] || [];
      if (isChecked) {
        return { ...prev, [field]: [...array, value] };
      } else {
        return { ...prev, [field]: array.filter(item => item !== value) };
      }
    });
  };

  const handleSocialProofChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, socialProofLinks: { ...prev.socialProofLinks, [name]: value } }));
  };

  const isSectionFilled = (sectionId) => {
    switch (sectionId) {
      case "section-program-specifics":
        return !!form.title && !!form.departmentCategory && (form.workMode === 'Remote' || !!form.cityState) && !!form.duration && !!form.workMode && !!form.workingHours && !!form.experienceLevel && (form.hasOpenings === false || !!form.openings);
      case "section-program-timeline":
        return !!form.deadline && !!form.startDate;
      case "section-financials":
        return !!form.stipendType && (form.stipendType === "Unpaid" || !!form.stipend);
      case "section-requirements":
        return form.targetEducation?.length > 0 && form.batchEligibility?.length > 0 && !!form.requiredSkills;
      case "section-qualifications":
        return !!form.minimumRequirements || !!form.preferredQualifications;
      case "section-job-description":
        return !!form.description;
      case "section-selection-process":
        return (form.selectionRounds && form.selectionRounds.length > 0) || !!form.assignmentLink || !!form.customScreeningQuestion;
      case "section-about-company":
        return !!form.company;
      default:
        return false;
    }
  };

  const [activeSubStep, setActiveSubStep] = React.useState("section-program-specifics");

  React.useEffect(() => {
    if (!showOpportunityForm || currentStep !== 1) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        let mostVisible = null;
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (!mostVisible || entry.intersectionRatio > mostVisible.intersectionRatio) {
              mostVisible = entry;
            }
          }
        });
        if (mostVisible) {
          setActiveSubStep(mostVisible.target.id);
        }
      },
      { root: document.getElementById('opportunity-form-container'), rootMargin: "-10% 0px -70% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] }
    );
    const ids = [
      "section-program-specifics", "section-program-timeline", "section-financials",
      "section-requirements", "section-qualifications", "section-job-description",
      "section-selection-process", "section-about-company"
    ];
    // small delay to ensure DOM is ready
    setTimeout(() => {
      ids.forEach((id) => {
        const el = document.getElementById(id);
        if (el) observer.observe(el);
      });
    }, 100);
    return () => observer.disconnect();
  }, [showOpportunityForm, currentStep]);

  const today = new Date();
  today.setMinutes(today.getMinutes() - today.getTimezoneOffset());

  const minDate = today.toISOString().split("T")[0];

  return (
    <>
      {showOpportunityForm && (
        <div className="bg-white rounded-xl border border-[#DCE5FA] overflow-hidden flex flex-col xl:flex-row min-h-[600px] shadow-sm">
          {/* LEFT STEPPER SIDEBAR */}
          <div className="w-full xl:w-[300px] bg-white border-r border-[#E2EAFC] p-8 flex flex-col">
            <h2 className="text-xl font-bold text-slate-800 mb-6">
              {editingId ? "Edit" : "Create"} {form.type}
            </h2>

            <div className="w-full bg-[#E2EAFC] h-1.5 rounded-full mb-10 overflow-hidden">
              <div
                className="bg-[#00A9E0] h-full transition-all duration-300"
                style={{ width: currentStep === 1 ? "40%" : "100%" }}
              ></div>
            </div>

            <div className="space-y-7 relative">
              <div className="absolute left-[15px] top-4 bottom-4 w-0.5 bg-[#E2EAFC]"></div>
              <div className="flex flex-col gap-4 w-full">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className={`flex items-center gap-4 relative z-10 w-full text-left group ${editingId ? "cursor-pointer" : "cursor-default"}`}
                  disabled={!editingId && currentStep !== 1}
                >
                  <div className={`w-7 h-7 shrink-0 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${currentStep === 1 ? "bg-[#00A9E0] text-white" : "bg-blue-100 text-[#00A9E0] group-hover:bg-blue-200"}`}>1</div>
                  <span className={`font-semibold text-sm transition-colors ${currentStep === 1 ? "text-[#00A9E0]" : "text-slate-400 group-hover:text-slate-600"}`}>Program Details</span>
                </button>
                {currentStep === 1 && (
                  <div className="flex flex-col gap-5 pl-8 relative z-10 mt-3 mb-2">
                    {/* Inner vertical line for sub-steps */}
                    <div className="absolute left-[48px] top-4 bottom-4 w-0.5 bg-[#E2EAFC] -z-10"></div>
                    {[
                      { id: "section-program-specifics", label: "Program Specifics" },
                      { id: "section-program-timeline", label: "Program Timeline" },
                      { id: "section-financials", label: "Financials & Incentives" },
                      { id: "section-requirements", label: "Requirements" },
                      { id: "section-qualifications", label: "Qualifications" },
                      { id: "section-job-description", label: "Job Description" },
                      { id: "section-selection-process", label: "Selection Process" },
                      { id: "section-about-company", label: "About the Company" },
                    ].map((subStep, i) => {
                      const isFilled = isSectionFilled(subStep.id);
                      const isActive = activeSubStep === subStep.id;
                      
                      return (
                        <button 
                          key={subStep.id}
                          type="button"
                          onClick={() => {
                            const el = document.getElementById(subStep.id);
                            const container = document.getElementById('opportunity-form-container');
                            if (el && container) {
                              const top = el.offsetTop - 24; 
                              container.scrollTo({ top, behavior: 'smooth' });
                            }
                          }}
                          className="flex items-start gap-4 relative z-10 w-full text-left group"
                        >
                          <div className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                            isFilled && !isActive ? 'bg-[#E8F8F2] text-[#21B573]' : 
                            isActive ? 'bg-[#00A9E0] text-white shadow-md' : 
                            'bg-white border-2 border-slate-300 text-slate-500'
                          }`}>
                            {isFilled && !isActive ? <FiCheck className="w-5 h-5" /> : (i + 1)}
                          </div>
                          <div className="flex flex-col mt-[5px]">
                            <span className={`font-bold text-[13px] leading-tight transition-colors ${
                              isActive ? 'text-[#00A9E0]' : 
                              isFilled ? 'text-slate-700' : 
                              'text-slate-500 group-hover:text-slate-700'
                            }`}>
                              {subStep.label}
                            </span>
                            {isFilled && !isActive && (
                              <span className="text-[11px] font-bold text-red-600/80 mt-0.5">Complete</span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={() => {
                  if (editingId) {
                    const path = isSuperDashboard ? `/super-admin-dashboard/build-form/${editingId}` : `/admin-dashboard/build-form/${editingId}`;
                    navigate(path);
                  } else {
                    alert("Please save the opportunity details first before building the form.");
                  }
                }}
                className={`flex items-center gap-4 relative z-10 w-full text-left group ${editingId ? "cursor-pointer" : "cursor-default"}`}
                disabled={!editingId}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${currentStep === 2 ? "bg-[#00A9E0] text-white" : "bg-slate-100 text-slate-400 group-hover:bg-slate-200"}`}>2</div>
                <span className={`font-semibold text-sm transition-colors ${currentStep === 2 ? "text-[#00A9E0]" : "text-slate-400 group-hover:text-slate-600"}`}>Application Form</span>
              </button>
            </div>

            <div className="mt-auto pt-10">
              <button onClick={resetForm} className="w-full py-3 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-all">
                Discard
              </button>
            </div>
          </div>

          {/* RIGHT FORM CONTENT */}
          <div id="opportunity-form-container" className="flex-1 p-8 pb-6 bg-[#F8FBFF]/50 overflow-y-auto custom-scrollbar max-h-[94vh]">
            <form id="opportunity-form" onSubmit={handleSubmit} className="space-y-8">
              
              {/* SECTION 1: PROGRAM SPECIFICS */}
              <div id="section-program-specifics" className="bg-white p-6 rounded-2xl border border-[#E2EAFC] shadow-sm">
                <h4 className="text-md font-bold text-slate-800 mb-6 uppercase tracking-wider text-xs">Program Specifics</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <label className="flex flex-col gap-2 text-sm font-semibold text-slate-700">
                    <span>Internship Title <span className="text-rose-600">*</span></span>
                    <input name="title" value={form.title} onChange={handleChange} placeholder="e.g. Software Engineer Intern" className="border border-[#D6E2FC] rounded-xl px-4 py-3 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all outline-none" required />
                  </label>
                  <label className="flex flex-col gap-2 text-sm font-semibold text-slate-700">
                    <span>Department/Category <span className="text-rose-600">*</span></span>
                    <select name="departmentCategory" value={form.departmentCategory} onChange={handleChange} className="border border-[#D6E2FC] rounded-xl px-4 py-3 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all outline-none" required>
                      <option value="">Select Department</option>
                      {/* <option value="Marketing">Marketing</option>
                      <option value="IT">IT</option>
                      <option value="Operations">Operations</option>
                      <option value="HR">HR</option>
                      <option value="Finance">Finance</option> */}
                      <option value="Corporate">Corporate</option>
                      <option value="Teaching">Teaching </option>
                      <option value="NGO / Social Work">NGO / Social Work</option>
                      <option value="Government">Government</option>
                      <option value="Research">Research</option>
                      <option value="Assessment ">Assessment</option>
                      <option value="Summer / Winter Break">Summer / Winter Break</option>
                    </select>
                  </label>

                  <label className="flex flex-col gap-2 text-sm font-semibold text-slate-700">
                    <span> Job Location (City/State) {form.workMode !== 'Remote' && <span className="text-rose-600">*</span>}</span>
                    <input name="cityState" value={form.cityState} onChange={handleChange} placeholder="e.g. Bangalore, Karnataka" className="border border-[#D6E2FC] rounded-xl px-4 py-3 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all outline-none" required={form.workMode !== 'Remote'} />
                  </label>

                  <label className="flex flex-col gap-2 text-sm font-semibold text-slate-700 ">
                    <span>Company Location Link</span>
                    <input type="url" name="googleLocationLink" value={form.googleLocationLink} onChange={handleChange} placeholder="https://maps.google.com/..." className="border border-[#D6E2FC] rounded-xl px-4 py-3 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all outline-none" />
                  </label>
                 
                  

                  <div className="flex flex-col gap-2 text-sm font-semibold text-slate-700">
                    <div className="flex items-center justify-between">
                      <span>Number of Openings {form.hasOpenings !== false && <span className="text-rose-600">*</span>}</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer" 
                          checked={form.hasOpenings !== false} 
                          onChange={(e) => setForm(prev => ({...prev, hasOpenings: e.target.checked, openings: e.target.checked ? prev.openings : ""} ))} 
                        />
                        <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-red-600"></div>
                      </label>
                    </div>
                    {form.hasOpenings !== false && (
                      <input type="number" name="openings" value={form.openings} onChange={handleChange} placeholder="e.g. 5" className="border border-[#D6E2FC] rounded-xl px-4 py-3 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all outline-none" required />
                    )}
                  </div>

                  <label className="flex flex-col gap-2 text-sm font-semibold text-slate-700">
                    <span>Duration <span className="text-rose-600">*</span></span>
                      <div className="flex gap-2">
                    <input type="number" name="duration" value={form.duration} onChange={handleChange} className="flex-1 border border-[#D6E2FC] rounded-xl px-4 py-3 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all outline-none" required />
                    
                      {/* <select name="duration" value={form.duration} onChange={handleChange} className="flex-1 border border-[#D6E2FC] rounded-xl px-4 py-3 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all outline-none" required>
                        <option value="">Select Duration</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="6">6</option>
                      </select> */}
                      <select name="durationUnit" value={form.durationUnit} onChange={handleChange} className="w-[120px] border border-[#D6E2FC] rounded-xl px-4 py-3 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all outline-none">
                        
                        <option value="day">Days</option><option value="Months">Months</option>
                        <option value="Year">Year</option>
                      </select>
                    </div>
                  </label>

                  
                  
                  {/* Radios / Selects */}
                  <div className="flex flex-col gap-2 text-sm font-semibold text-slate-700">
                    <span>Work Mode <span className="text-rose-600">*</span></span>
                    <div className="flex gap-4 mt-2">
                      {["On-site", "Remote", "Hybrid"].map(mode => (
                        <label key={mode} className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" name="workMode" value={mode} checked={form.workMode === mode} onChange={handleChange} className="accent-red-600" />
                          <span>{mode}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  
                  <div className="flex flex-col gap-2 text-sm font-semibold text-slate-700">
                    <span>Internship Type</span>
                    <div className="flex gap-4 mt-2">
                      {["Summer", "Winter", "Full-year"].map(type => (
                        <label key={type} className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" name="internshipType" value={type} checked={form.internshipType === type} onChange={handleChange} className="accent-red-600" />
                          <span>{type}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 text-sm font-semibold text-slate-700">
                    <span>Working Hours <span className="text-rose-600">*</span></span>
                    <div className="flex gap-4 mt-2">
                      {["Full-time", "Part-time"].map(hours => (
                        <label key={hours} className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" name="workingHours" value={hours} checked={form.workingHours === hours} onChange={handleChange} className="accent-red-600" required />
                          <span>{hours}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 text-sm font-semibold text-slate-700">
                    <span>Experience Level</span>
                    <div className="flex gap-2">
                      <input type="text" name="experienceLevel" value={form.experienceLevel || ''} onChange={handleChange} placeholder="e.g. 0-6 or 1" className="flex-1 border border-[#D6E2FC] rounded-xl px-4 py-3 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all outline-none" />
                      <select name="experienceUnit" value={form.experienceUnit || 'Years'} onChange={handleChange} className="w-[120px] border border-[#D6E2FC] rounded-xl px-4 py-3 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all outline-none">
                        <option value="Months">Months</option>
                        <option value="Years">Years</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 2: PROGRAM TIMELINE */}
              <div id="section-program-timeline" className="bg-white p-6 rounded-2xl border border-[#E2EAFC] shadow-sm">
                <h4 className="text-md font-bold text-slate-800 mb-6 uppercase tracking-wider text-xs">Program Timeline</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <label className="flex flex-col gap-2 text-sm font-semibold text-slate-700">
                    <span>Applications Open</span>
                    <input type="date" name="applicationsOpenDate" value={form.applicationsOpenDate} onChange={handleChange} min={minDate} className="border border-[#D6E2FC] rounded-xl px-4 py-3 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all outline-none" />
                  </label>
                  <label className="flex flex-col gap-2 text-sm font-semibold text-slate-700">
                    <span>Application Deadline <span className="text-rose-600">*</span></span>
                    <input type="date" name="deadline" value={form.deadline} onChange={handleChange} min={minDate} className="border border-[#D6E2FC] rounded-xl px-4 py-3 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all outline-none" required />
                  </label>
                  <label className="flex flex-col gap-2 text-sm font-semibold text-slate-700">
                    <span>Selection Announcement</span>
                    <input type="date" name="selectionAnnouncementDate" value={form.selectionAnnouncementDate} min={minDate} onChange={handleChange} className="border border-[#D6E2FC] rounded-xl px-4 py-3 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all outline-none" />
                  </label>
                  <label className="flex flex-col gap-2 text-sm font-semibold text-slate-700">
                    <span>Program Start Date <span className="text-rose-600">*</span></span>
                    <input type="date" name="startDate" value={form.startDate} onChange={handleChange} min={minDate} className="border border-[#D6E2FC] rounded-xl px-4 py-3 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all outline-none" required />
                  </label>
                </div>
              </div>

              {/* SECTION 3: FINANCIALS & INCENTIVES */}
              <div id="section-financials" className="bg-white p-6 rounded-2xl border border-[#E2EAFC] shadow-sm">
                <h4 className="text-md font-bold text-slate-800 mb-6 uppercase tracking-wider text-xs">Financials & Incentives</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2 text-sm font-semibold text-slate-700 ">
                    <span>Stipend Type <span className="text-rose-600">*</span></span>
                    <div className="flex gap-4 mt-2">
                      {["Fixed", "Performance-based", "Unpaid"].map(type => (
                        <label key={type} className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" name="stipendType" value={type} checked={form.stipendType === type} onChange={(e) => { handleChange(e); setForm(prev => ({...prev, isUnpaid: type === "Unpaid", stipend: type === "Unpaid" ? "" : prev.stipend})) }} className="accent-red-600" required />
                          <span>{type}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  {!form.isUnpaid && (
                    <label className="flex flex-col gap-2 text-sm font-semibold text-slate-700">
                      <span>Amount (per month)</span>
                      <div className="flex gap-2">
                        <select name="stipendCurrency" value={form.stipendCurrency} onChange={handleChange} className="w-[100px] border border-[#D6E2FC] rounded-xl px-4 py-3 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all outline-none">
                          <option value="INR">INR</option>
                          <option value="USD">USD</option>
                        </select>
                        <input name="stipend" value={form.stipend} onChange={handleChange} placeholder="e.g. 10000" className="flex-1 border border-[#D6E2FC] rounded-xl px-4 py-3 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all outline-none" />
                      </div>
                    </label>
                  )}

                  <label className="flex flex-col gap-2 text-sm font-semibold text-slate-700">
                    <span>Incentives/Bonuses</span>
                    <textarea name="incentivesBonuses" value={form.incentivesBonuses || ''} onChange={handleChange} placeholder="e.g., Success fee per candidate" className="flex-1 border border-[#D6E2FC] rounded-xl px-4 py-3 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all outline-none resize-y min-h-[48px]" rows="1" />
                  </label>

                  <CreatableCheckboxDropdown
                    label="Perks"
                    defaultOptions={["Certificate", "LOR", "PPO", "Flexible Hours"]}
                    selected={form.perks || []}
                    onChange={(e, value) => handleCheckboxChange(e, 'perks', value)}
                  />
                </div>
              </div>

              {/* SECTION 4: CANDIDATE REQUIREMENTS */}
              <div id="section-requirements" className="bg-white p-6 rounded-2xl border border-[#E2EAFC] shadow-sm">
                <h4 className="text-md font-bold text-slate-800 mb-6 uppercase tracking-wider text-xs">Candidate Requirements</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <CheckboxDropdown
                    label="Target Education"
                    options={["B.Tech", "MBA", "MCA", "BBA", "B.Com"]}
                    selected={form.targetEducation || []}
                    onChange={(e, value) => handleCheckboxChange(e, 'targetEducation', value)}
                    required
                  />
                  
                  <CheckboxDropdown
                    label="Batch Eligibility"
                    options={["2024", "2025", "2026", "2027"]}
                    selected={form.batchEligibility || []}
                    onChange={(e, value) => handleCheckboxChange(e, 'batchEligibility', value)}
                    required
                  />

                  <label className="flex flex-col gap-2 text-sm font-semibold text-slate-700">
                    <span>Minimum CGPA/Percentage</span>
                    <input type="number" step="0.1" name="minimumCGPA" value={form.minimumCGPA} onChange={handleChange} placeholder="0.0 - 10.0" className="border border-[#D6E2FC] rounded-xl px-4 py-3 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all outline-none" />
                  </label>

                  <label className="flex flex-col gap-2 text-sm font-semibold text-slate-700">
                    <span>Required Skills <span className="text-rose-600">*</span></span>
                    <input name="requiredSkills" value={form.requiredSkills} onChange={handleChange} placeholder="e.g. React, Node.js, Python" className="border border-[#D6E2FC] rounded-xl px-4 py-3 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all outline-none" required />
                  </label>

                </div>
              </div>

              {/* SECTION 5: QUALIFICATIONS */}
              <div id="section-qualifications" className="bg-white p-6 rounded-2xl border border-[#E2EAFC] shadow-sm">
                <h4 className="text-md font-bold text-slate-800 mb-6 uppercase tracking-wider text-xs">Qualifications</h4>
                <div className="grid grid-cols-1 gap-6">
                  <label className="flex flex-col gap-2 text-sm font-semibold text-slate-700">
                    <span>Minimum Requirements (Eligibility Criteria - In Bullet Points)</span>
                    <textarea name="minimumRequirements" value={form.minimumRequirements} onChange={handleChange} className="border border-[#D6E2FC] rounded-xl px-4 py-3 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all outline-none min-h-[100px]" placeholder="- Must have experience with...&#10;- Knowledge of..." />
                  </label>
                  <label className="flex flex-col gap-2 text-sm font-semibold text-slate-700">
                    <span>Preferred Qualifications (Key Skills - In Bullet Points)</span>
                    <textarea name="preferredQualifications" value={form.preferredQualifications} onChange={handleChange} className="border border-[#D6E2FC] rounded-xl px-4 py-3 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all outline-none min-h-[100px]" placeholder="- Prior internship in...&#10;- Familiarity with..." />
                  </label>
                </div>
              </div>

              {/* SECTION 6: JOB DESCRIPTION */}
              <div id="section-job-description" className="bg-white p-6 rounded-2xl border border-[#E2EAFC] shadow-sm">
                <h4 className="text-md font-bold text-slate-800 mb-6 uppercase tracking-wider text-xs">Job Description</h4>
                <div className="grid grid-cols-1 gap-6">
                  <div className="flex flex-col gap-2">
                    
                    <TextEditor 
                      label="About the Program"
                      value={form.aboutProgram}
                      onChange={(html) => setForm(prev => ({ ...prev, aboutProgram: html }))}
                      placeholder=""
                    />
                  </div>
                  <label className="flex flex-col gap-2 text-sm font-semibold text-slate-700">
                    <span>Key Responsibilities <span className="text-rose-600">*</span></span>
                    <textarea name="description" value={form.description} onChange={handleChange} className="border border-[#D6E2FC] rounded-xl px-4 py-3 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all outline-none min-h-[100px]" placeholder="Bulleted list of daily tasks and ownership areas." required />
                  </label>
                  <label className="flex flex-col gap-2 text-sm font-semibold text-slate-700">
                    <span>What You Will Learn</span>
                    <textarea name="whatYouWillLearn" value={form.whatYouWillLearn} onChange={handleChange} className="border border-[#D6E2FC] rounded-xl px-4 py-3 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all outline-none min-h-[100px]" placeholder="Focus on the experiential learning aspect..." />
                  </label>
                </div>
              </div>

              {/* SECTION 7: SELECTION PROCESS */}
              <div id="section-selection-process" className="bg-white p-6 rounded-2xl border border-[#E2EAFC] shadow-sm">
                <h4 className="text-md font-bold text-slate-800 mb-6 uppercase tracking-wider text-xs">Selection Process</h4>
                <div className="grid grid-cols-1 gap-6">
                  <div className="flex flex-col gap-2 text-sm font-semibold text-slate-700">
                    <span>Selection Rounds</span>
                    <div className="flex flex-wrap gap-4 mt-2">
                      {["Resume Shortlist", "Assignment", "Interview"].map(round => (
                        <label key={round} className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" checked={form.selectionRounds?.includes(round)} onChange={(e) => handleCheckboxChange(e, 'selectionRounds', round)} className="accent-red-600 w-4 h-4 rounded" />
                          <span>{round}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <label className="flex flex-col gap-2 text-sm font-semibold text-slate-700">
                    <span>Assignment Link (Optional)</span>
                    <input type="url" name="assignmentLink" value={form.assignmentLink} onChange={handleChange} placeholder="https://..." className="border border-[#D6E2FC] rounded-xl px-4 py-3 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all outline-none" />
                  </label>
                  <label className="flex flex-col gap-2 text-sm font-semibold text-slate-700">
                    <span>Custom Screening Question</span>
                    <textarea name="customScreeningQuestion" value={form.customScreeningQuestion} onChange={handleChange} className="border border-[#D6E2FC] rounded-xl px-4 py-3 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all outline-none min-h-[80px]" placeholder='e.g., "Why are you interested in this role?"' />
                  </label>
                </div>
              </div>

              {/* SECTION 8: ABOUT THE COMPANY */}
              <div id="section-about-company" className="bg-white p-6 rounded-2xl border border-[#E2EAFC] shadow-sm">
                <h4 className="text-md font-bold text-slate-800 mb-6 uppercase tracking-wider text-xs">About the Company</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <label className="flex flex-col gap-2 text-sm font-semibold text-slate-700">
                    <span>Company Name <span className="text-rose-600">*</span></span>
                    <input name="company" value={form.company} onChange={handleChange} className="border border-[#D6E2FC] rounded-xl px-4 py-3 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all outline-none" required />
                  </label>
                  <label className="flex flex-col gap-2 text-sm font-semibold text-slate-700">
                    <span>Website Link</span>
                    <input type="url" name="website" value={form.website} onChange={handleChange} className="border border-[#D6E2FC] rounded-xl px-4 py-3 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all outline-none" />
                  </label>
                  <label className="flex flex-col gap-2 text-sm font-semibold text-slate-700">
                    <span>Industry Vertical</span>
                    <select name="industry" value={form.industry} onChange={handleChange} className="border border-[#D6E2FC] rounded-xl px-4 py-3 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all outline-none">
                      <option value="">Select Industry</option>
                      <option value="IT Services">IT Services</option>
                      <option value="EdTech">EdTech</option>
                      <option value="Higher Education">Higher Education</option>
                      <option value="Fintech">Fintech</option>
                    </select>
                  </label>
                  <label className="flex flex-col gap-2 text-sm font-semibold text-slate-700">
                    <span>Headquarters</span>
                    <input name="headquarters" value={form.headquarters} onChange={handleChange} placeholder="City, State, Country" className="border border-[#D6E2FC] rounded-xl px-4 py-3 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all outline-none" />
                  </label>
                  <label className="flex flex-col gap-2 text-sm font-semibold text-slate-700">
                    <span>Founded Year</span>
                    <input name="foundedYear" value={form.foundedYear} onChange={handleChange} className="border border-[#D6E2FC] rounded-xl px-4 py-3 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all outline-none" />
                  </label>
                  <label className="flex flex-col gap-2 text-sm font-semibold text-slate-700">
                    <span>Number of Employees</span>
                    <select name="companySize" value={form.companySize} onChange={handleChange} className="border border-[#D6E2FC] rounded-xl px-4 py-3 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all outline-none">
                      <option value="">Select</option>
                      <option value="Startup 0-5">Startup 0-5</option>
                      <option value="SME 2-20">SME 2-20</option>
                      <option value="MSME 21-50">MSME 21-50</option>
                      <option value="51-200">51-200</option>
                      <option value="201-500">201-500</option>
                    </select>
                  </label>
                  <label className="flex flex-col gap-2 text-sm font-semibold text-slate-700">
                    <span>Company Size</span>
                    <select name="companyClassification" value={form.companyClassification} onChange={handleChange} className="border border-[#D6E2FC] rounded-xl px-4 py-3 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all outline-none">
                      <option value="">Select</option>
                      <option value="Boutique Firm">Boutique Firm</option>
                      <option value="Mid-market">Mid-market</option>
                      <option value="Enterprise">Enterprise</option>
                    </select>
                  </label>

                  {/* Visibility section */}
                  <div className="flex flex-col gap-4 mt-4 md:col-span-2 p-4 bg-slate-50 rounded-xl">
                   
                    <div className="flex flex-col gap-2 mt-2">
                      <span className="text-sm font-semibold text-slate-700">Upload Organization Logo</span>
                      <label className="w-full h-40 rounded-xl bg-white border-2 border-dashed border-blue-200 flex items-center justify-center overflow-hidden cursor-pointer hover:bg-blue-50 transition-colors group relative">
                        {form.logo ? (
                          <img src={form.logo} alt="Preview" className="w-full h-full object-contain p-4 group-hover:opacity-75 transition-opacity" />
                        ) : (
                          <div className="flex flex-col items-center gap-2">
                            <FiGlobe className="text-slate-300 group-hover:text-blue-500 transition-colors" size={40} />
                            <span className="text-xs text-slate-500 font-medium">Click to browse files</span>
                          </div>
                        )}
                        <input type="file" accept="image/*" onChange={handleLogoChange} className="hidden" />
                      </label>
                    </div>
                    
                    {/* <label className="flex items-center gap-3 text-sm font-semibold text-slate-700 mt-2 cursor-pointer">
                      <input type="checkbox" name="featuredListing" checked={form.featuredListing} onChange={handleChange} className="w-4 h-4 accent-red-600" />
                      <span>Featured Listing (Push to top of the board)</span>
                    </label> */}

                    <label className="flex flex-col gap-2 text-sm font-semibold text-slate-700">
                      <span>Hiring Manager/POC LinkedIn</span>
                      <input type="url" name="hiringManager" value={form.hiringManager} onChange={handleChange} placeholder="LinkedIn URL" className="border border-[#D6E2FC] rounded-xl px-4 py-3 bg-white focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all outline-none" />
                    </label>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                      <label className="flex flex-col gap-2 text-sm font-semibold text-slate-700">
                        <span>LinkedIn</span>
                        <input name="linkedin" value={form.socialProofLinks?.linkedin || ""} onChange={handleSocialProofChange} className="border border-[#D6E2FC] rounded-xl px-4 py-3 bg-white focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all outline-none" />
                      </label>
                      <label className="flex flex-col gap-2 text-sm font-semibold text-slate-700">
                        <span>Twitter</span>
                        <input name="twitter" value={form.socialProofLinks?.twitter || ""} onChange={handleSocialProofChange} className="border border-[#D6E2FC] rounded-xl px-4 py-3 bg-white focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all outline-none" />
                      </label>
                      <label className="flex flex-col gap-2 text-sm font-semibold text-slate-700">
                        <span>Instagram</span>
                        <input name="instagram" value={form.socialProofLinks?.instagram || ""} onChange={handleSocialProofChange} className="border border-[#D6E2FC] rounded-xl px-4 py-3 bg-white focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all outline-none" />
                      </label>
                    </div>

                    <label className="flex flex-col gap-2 text-sm font-semibold text-slate-700">
                      <span>Virtual Tour (Office URL)</span>
                      <input type="url" name="virtualTour" value={form.virtualTour} onChange={handleChange} placeholder="Link to 360 view or video" className="border border-[#D6E2FC] rounded-xl px-4 py-3 bg-white focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all outline-none" />
                    </label>
                  </div>

                  <label className="flex flex-col gap-2 text-sm font-semibold text-slate-700 md:col-span-2 mt-4">
                    <span>Company Overview</span>
                    <textarea name="companyOverview" value={form.companyOverview} onChange={handleChange} className="border border-[#D6E2FC] rounded-xl px-4 py-3 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all outline-none min-h-[100px]" placeholder="Introduction, Vision, Mission..." />
                  </label>
                  
                  <label className="flex flex-col gap-2 text-sm font-semibold text-slate-700 md:col-span-2">
                    <span>Specialties</span>
                    <textarea name="specialties" value={form.specialties} onChange={handleChange} className="border border-[#D6E2FC] rounded-xl px-4 py-3 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all outline-none min-h-[80px]" placeholder="e.g. Airport Ground Handling, Robotic Cleaning..." />
                  </label>
                </div>
              </div>

              <div className="flex justify-end pt-8 border-t border-[#E2EAFC]">
                <button type="submit" disabled={busy} className="px-12 py-4 rounded-2xl bg-red-600 text-white font-bold  shadow-blue-200 transition-all active:scale-95 disabled:opacity-50">
                  {busy ? "Saving..." : editingId ? "Update Opportunity" : "Create Opportunity"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PREVIEW MODAL */}
      {showPreviewModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-800">Confirm Program Details</h2>
              <button onClick={() => showPreviewModal(false)} className="text-red-600 font-bold hover:underline text-sm">Edit</button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50">
               <p className="text-slate-600 font-medium">Ready to save the following opportunity?</p>
               <h3 className="text-xl font-bold text-blue-900">{form.title} @ {form.company}</h3>
            </div>
            <div className="p-6 border-t border-slate-100 flex items-center justify-end gap-4 bg-white">
              <button type="button" onClick={() => resetForm()} className="px-6 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-all">Cancel</button>
              <button type="button" onClick={handleConfirmSubmit} disabled={busy} className="px-8 py-3 rounded-xl bg-red-600 text-white font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95 disabled:opacity-50 min-w-[160px]">
                {busy ? "Publishing..." : "Confirm & Create"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUCCESS MESSAGE */}
      {showSuccessMessage && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[110] animate-in slide-in-from-top duration-300">
          <div className="bg-green-100 text-green-500 px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-4 border border-emerald-400">
            <div>
              <p className="font-bold">Successfully Published!</p>
              <p className="text-xs text-green-500">Your opportunity is now live on the portal.</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default OpportunityForm;
