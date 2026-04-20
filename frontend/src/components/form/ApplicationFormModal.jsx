import React, { useState } from "react";
import { useOpportunities } from "../../context/OpportunitiesContext";

const initialFormState = {
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
};

const ApplicationFormModal = ({
  isOpen,
  onClose,
  opportunityTitle = "Opportunity",
  opportunity = null,
}) => {
  const { submitApplication, getApiErrorMessage } = useOpportunities();
  const [form, setForm] = useState(initialFormState);
  const [resumeFile, setResumeFile] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) {
    return null;
  }

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleResumeChange = (event) => {
    const file = event.target.files?.[0] || null;
    setError("");

    if (!file) {
      setResumeFile(null);
      return;
    }

    const isPdfType = file.type === "application/pdf";
    const hasPdfExtension = file.name.toLowerCase().endsWith(".pdf");

    if (!isPdfType && !hasPdfExtension) {
      setResumeFile(null);
      setError("Resume must be a PDF file.");
      return;
    }

    setResumeFile(file);
  };

  const resetForm = () => {
    setForm(initialFormState);
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

    if (!opportunity?.type || !opportunityTitle) {
      setError("Opportunity details are missing. Please reopen this form.");
      return;
    }

    if (!resumeFile) {
      setError("Resume upload is mandatory and must be in PDF format.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await submitApplication({
        ...form,
        resumeFile,
        opportunityId: opportunity?.id || "",
        opportunityTitle,
        opportunityType: opportunity?.type || "",
        company: opportunity?.company || "",
      });

      const emailConfirmation = response?.emailConfirmation;
      const applicantWhatsApp = response?.whatsappNotification?.applicant;
      const adminWhatsApp = response?.whatsappNotification?.admin;
      const emailMessage = emailConfirmation?.sent
        ? emailConfirmation?.message || "Email confirmation sent."
        : emailConfirmation?.message ||
          "Email confirmation could not be sent right now.";
      const whatsappMessage = applicantWhatsApp?.sent
        ? applicantWhatsApp?.message || "WhatsApp confirmation sent."
        : applicantWhatsApp?.message ||
          "WhatsApp confirmation could not be sent right now.";
      const adminWhatsAppMessage = adminWhatsApp?.sent
        ? adminWhatsApp?.message || "Admin WhatsApp notification sent."
        : adminWhatsApp?.message ||
          "Admin WhatsApp notification could not be sent right now.";

      setSuccess(
        `Application submitted successfully. ${emailMessage} ${whatsappMessage} ${adminWhatsAppMessage}`,
      );

      setTimeout(() => {
        handleClose();
      }, 1000);
    } catch (apiError) {
      setError(getApiErrorMessage(apiError, "Failed to submit application."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-xl p-4 sm:p-6 border border-black/10">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold">Application Form</h2>
            <p className="text-sm text-black/60 mt-1">
              Applying for: {opportunityTitle}
            </p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="text-sm font-medium px-3 py-1 rounded-md bg-black/5 hover:bg-black/10"
          >
            Close
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <section>
            <h3 className="text-lg font-semibold mb-3">Basic Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                name="name"
                value={form.name}
                onChange={handleInputChange}
                placeholder="Name"
                className="border border-black/15 rounded-lg px-3 py-2"
                required
              />
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleInputChange}
                placeholder="Email"
                className="border border-black/15 rounded-lg px-3 py-2"
                required
              />
              <input
                name="phone"
                value={form.phone}
                onChange={handleInputChange}
                placeholder="Phone"
                className="border border-black/15 rounded-lg px-3 py-2"
                required
              />
              <input
                name="college"
                value={form.college}
                onChange={handleInputChange}
                placeholder="College"
                className="border border-black/15 rounded-lg px-3 py-2"
                required
              />
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-3">Academic Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                name="degree"
                value={form.degree}
                onChange={handleInputChange}
                placeholder="Degree"
                className="border border-black/15 rounded-lg px-3 py-2"
                required
              />
              <input
                name="year"
                value={form.year}
                onChange={handleInputChange}
                placeholder="Year"
                className="border border-black/15 rounded-lg px-3 py-2"
                required
              />
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-3">Professional Details</h3>
            <div className="grid grid-cols-1 gap-3">
              <input
                name="skills"
                value={form.skills}
                onChange={handleInputChange}
                placeholder="Skills"
                className="border border-black/15 rounded-lg px-3 py-2"
                required
              />
              <textarea
                name="experience"
                value={form.experience}
                onChange={handleInputChange}
                placeholder="Experience"
                className="border border-black/15 rounded-lg px-3 py-2 min-h-24"
                required
              />
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-3">Resume</h3>
            <div className="grid grid-cols-1 gap-3">
              <input
                type="file"
                accept="application/pdf,.pdf"
                onChange={handleResumeChange}
                className="border border-black/15 rounded-lg px-3 py-2 bg-white"
                required
              />
              <p className="text-xs text-black/60">
                Resume upload is mandatory. PDF only.
              </p>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-3">Additional Details</h3>
            <div className="grid grid-cols-1 gap-3">
              <input
                type="url"
                name="portfolio"
                value={form.portfolio}
                onChange={handleInputChange}
                placeholder="Portfolio link"
                className="border border-black/15 rounded-lg px-3 py-2"
              />
              <input
                type="url"
                name="linkedin"
                value={form.linkedin}
                onChange={handleInputChange}
                placeholder="LinkedIn"
                className="border border-black/15 rounded-lg px-3 py-2"
              />
              <textarea
                name="whySelectYou"
                value={form.whySelectYou}
                onChange={handleInputChange}
                placeholder="Why should we select you?"
                className="border border-black/15 rounded-lg px-3 py-2 min-h-28"
                required
              />
            </div>
          </section>

          {error && <p className="text-sm text-red-600 font-medium">{error}</p>}
          {success && (
            <p className="text-sm text-green-700 font-medium">{success}</p>
          )}

          <div className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-end">
            <button
              type="button"
              onClick={handleClose}
              className="w-full sm:w-auto px-4 py-2 rounded-lg bg-slate-100 text-slate-900 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="w-full sm:w-auto px-5 py-2 rounded-lg bg-slate-900 text-white font-medium"
            >
              {submitting ? "Submitting..." : "Submit Application"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplicationFormModal;
