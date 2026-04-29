import React, { useState, useEffect } from "react";
import { useOpportunities } from "../../context/OpportunitiesContext";
import FormComponents from "../FormBuilder/FormComponents";
import apiClient from "../../services/apiClient";
import { Icons } from "../FormBuilder/ui/ui-icons";

const ApplicationFormModal = ({
  isOpen,
  onClose,
  opportunityTitle = "Opportunity",
  opportunity = null,
}) => {
  const { submitApplication, getApiErrorMessage } = useOpportunities();
  
  // Dynamic Form State
  const [dynamicForm, setDynamicForm] = useState(null);
  const [formValues, setFormValues] = useState({});
  const [isLoadingForm, setIsLoadingForm] = useState(false);
  
  // Legacy Form State (Fallback)
  const [legacyForm, setLegacyForm] = useState({
    name: "",
    email: "",
    phone: "",
    college: "",
    degree: "",
    year: "",
    skills: "",
    experience: "",
    portfolio: "",
    linkedin: "",
    whySelectYou: "",
  });
  const [resumeFile, setResumeFile] = useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Fetch dynamic form if opportunity has formId
  useEffect(() => {
    const fetchDynamicForm = async () => {
      const rawFormId = opportunity?.formId || opportunity?.form;
      if (!isOpen || !rawFormId) {
        setDynamicForm(null);
        return;
      }

      setIsLoadingForm(true);
      try {
        const formId = typeof rawFormId === 'object' ? (rawFormId._id || rawFormId.id) : rawFormId;
        const response = await apiClient.get(`/api/forms/public/${formId}`);
        if (response.data) {
          setDynamicForm(response.data);
          // Initialize values with default values from fields
          const initialValues = {};
          response.data.fields?.forEach(field => {
            if (field.defaultValue !== undefined) {
              initialValues[field.id] = field.defaultValue;
            }
          });
          setFormValues(initialValues);
        }
      } catch (err) {
        console.error("Failed to load dynamic form:", err);
        // Fallback to legacy form is implicit since dynamicForm remains null
      } finally {
        setIsLoadingForm(false);
      }
    };

    fetchDynamicForm();
  }, [isOpen, opportunity?.formId, opportunity?.form]);

  if (!isOpen) return null;

  const handleLegacyInputChange = (event) => {
    const { name, value } = event.target;
    setLegacyForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleDynamicValueChange = (fieldId, value) => {
    setFormValues(prev => ({
      ...prev,
      [fieldId]: value
    }));
  };

  const handleResumeChange = (event) => {
    const file = event.target.files?.[0] || null;
    setError("");
    if (!file) {
      setResumeFile(null);
      return;
    }
    if (!file.name.toLowerCase().endsWith(".pdf")) {
      setResumeFile(null);
      setError("Resume must be a PDF file.");
      return;
    }
    setResumeFile(file);
  };

  const resetForm = () => {
    setLegacyForm({
      name: "",
      email: "",
      phone: "",
      college: "",
      degree: "",
      year: "",
      skills: "",
      experience: "",
      portfolio: "",
      linkedin: "",
      whySelectYou: "",
    });
    setFormValues({});
    setResumeFile(null);
    setError("");
    setSuccess("");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!opportunity?.id) {
      setError("Opportunity details are missing. Please reopen this form.");
      return;
    }

    setSubmitting(true);
    try {
      if (dynamicForm) {
        // Submit Dynamic Form
        const formData = new FormData();
        formData.append("opportunityId", opportunity.id);
        formData.append("opportunityTitle", opportunityTitle);
        formData.append("opportunityType", opportunity?.type || "Internship");
        formData.append("formId", dynamicForm._id);

        // Process dynamic values
        Object.entries(formValues).forEach(([fieldId, value]) => {
          if (value instanceof File || (value && value.file instanceof File)) {
            formData.append(fieldId, value.file || value);
          } else if (typeof value === 'object' && value !== null) {
             formData.append(fieldId, JSON.stringify(value));
          } else {
            formData.append(fieldId, value || "");
          }
        });

        await apiClient.post(`/api/forms/public/${dynamicForm._id}/submit`, formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });

      } else {
        // Submit Legacy Form
        if (!resumeFile) {
          setError("Resume upload is mandatory.");
          setSubmitting(false);
          return;
        }

        await submitApplication({
          ...legacyForm,
          resumeFile,
          opportunityId: opportunity.id,
          opportunityTitle,
          opportunityType: opportunity?.type || "Internship",
          company: opportunity?.company || "",
        });
      }

      setSuccess("Application submitted successfully! redirecting...");
      setTimeout(() => {
        handleClose();
      }, 2000);

    } catch (apiError) {
      setError(getApiErrorMessage(apiError, "Failed to submit application."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl flex flex-col border border-black/10">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 sticky top-0 z-10">
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              {dynamicForm ? dynamicForm.name : "Application Form"}
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              Applying for: <span className="font-medium text-gray-700">{opportunityTitle}</span>
            </p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="p-2 rounded-full hover:bg-gray-200 transition-colors"
          >
            <Icons.X size={20} className="text-gray-500" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          {isLoadingForm ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-gray-500 font-medium">Loading form details...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              {dynamicForm ? (
                /* Dynamic Form Rendering */
                <div className="grid grid-cols-12 gap-6">
                  {dynamicForm.description && (
                    <div className="col-span-12 p-4 bg-blue-50/50 border border-blue-100 rounded-xl text-blue-800 text-sm italic">
                      {dynamicForm.description}
                    </div>
                  )}
                  {dynamicForm.fields?.map((field) => (
                    <div
                      key={field.id}
                      className={field.width === "half" ? "col-span-12 md:col-span-6" : "col-span-12"}
                    >
                      {!field.hideLabel && (
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-1">
                          {field.label}
                          {field.required && <span className="text-red-500">*</span>}
                        </label>
                      )}
                      {field.helperText && (
                        <p className="text-[11px] text-gray-500 mb-2 italic">
                          {field.helperText}
                        </p>
                      )}
                      <FormComponents
                        field={{
                          ...field,
                          value: formValues[field.id]
                        }}
                        isPreview={true}
                        onChange={handleDynamicValueChange}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                /* Legacy Form Rendering (Fallback) */
                <div className="space-y-6">
                  <section>
                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                      <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div>
                      Basic Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-gray-700">Full Name</label>
                        <input
                          name="name"
                          value={legacyForm.name}
                          onChange={handleLegacyInputChange}
                          placeholder="John Doe"
                          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                          required
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-gray-700">Email Address</label>
                        <input
                          type="email"
                          name="email"
                          value={legacyForm.email}
                          onChange={handleLegacyInputChange}
                          placeholder="john@example.com"
                          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                          required
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-gray-700">Phone Number</label>
                        <input
                          name="phone"
                          value={legacyForm.phone}
                          onChange={handleLegacyInputChange}
                          placeholder="+91 0000000000"
                          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                          required
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-gray-700">College Name</label>
                        <input
                          name="college"
                          value={legacyForm.college}
                          onChange={handleLegacyInputChange}
                          placeholder="University Name"
                          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                          required
                        />
                      </div>
                    </div>
                  </section>

                  <section>
                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                      <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div>
                      Academic & Professional
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-gray-700">Degree</label>
                        <input
                          name="degree"
                          value={legacyForm.degree}
                          onChange={handleLegacyInputChange}
                          placeholder="e.g. B.Tech CS"
                          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                          required
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-gray-700">Year of Study</label>
                        <input
                          name="year"
                          value={legacyForm.year}
                          onChange={handleLegacyInputChange}
                          placeholder="e.g. 3rd Year"
                          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                          required
                        />
                      </div>
                      <div className="col-span-2 space-y-1.5">
                        <label className="text-sm font-medium text-gray-700">Key Skills</label>
                        <input
                          name="skills"
                          value={legacyForm.skills}
                          onChange={handleLegacyInputChange}
                          placeholder="e.g. React, Node.js, Python"
                          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                          required
                        />
                      </div>
                    </div>
                  </section>

                  <section className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800 mb-3">Upload Resume</h3>
                    <div className="relative border-2 border-dashed border-gray-300 rounded-xl p-6 bg-white hover:border-blue-400 transition-colors">
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={handleResumeChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        required
                      />
                      <div className="flex flex-col items-center text-center">
                        <Icons.PdfUpload size={32} className="text-gray-400 mb-2" />
                        <p className="text-sm font-medium text-gray-700">
                          {resumeFile ? resumeFile.name : "Click or drag to upload PDF"}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">Maximum size 10MB</p>
                      </div>
                    </div>
                  </section>
                </div>
              )}

              {error && (
                <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-700 text-sm animate-shake">
                  <Icons.AlertCircle size={18} />
                  {error}
                </div>
              )}

              {success && (
                <div className="p-4 bg-green-50 border border-green-100 rounded-xl flex items-center gap-3 text-green-700 text-sm">
                  <Icons.CheckCircle size={18} />
                  {success}
                </div>
              )}

              <div className="flex gap-3 justify-end pt-4">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-6 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-semibold hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className={`px-8 py-2.5 rounded-xl font-bold text-white shadow-lg transition-all ${
                    submitting ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 active:scale-95"
                  }`}
                >
                  {submitting ? "Submitting..." : "Submit Application"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApplicationFormModal;
