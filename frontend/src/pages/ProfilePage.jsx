import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useOpportunities } from "../context/OpportunitiesContext";

const splitName = (fullName) => {
  const normalized = String(fullName || "").trim();

  if (!normalized) {
    return { firstName: "", lastName: "" };
  }

  const [firstName, ...rest] = normalized.split(/\s+/);
  return {
    firstName: firstName || "",
    lastName: rest.join(" "),
  };
};

const ProfilePage = () => {
  const navigate = useNavigate();
  const {
    user,
    isBootstrapping,
    updateMyProfile,
    getApiErrorMessage,
  } = useOpportunities();

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    whatsappNumber: "",
    location: "",
    latestQualification: "",
    yearOfPassing: "",
    collegeName: "",
    agreeToWhatsAppUpdates: false,
  });

  useEffect(() => {
    if (!isBootstrapping && !user) {
      navigate("/login");
    }
  }, [isBootstrapping, user, navigate]);

  useEffect(() => {
    if (!user) {
      return;
    }

    const fallbackNames = splitName(user.fullName);
    setForm({
      firstName: user.firstName || fallbackNames.firstName,
      lastName: user.lastName || fallbackNames.lastName,
      whatsappNumber: user.whatsappNumber || "",
      location: user.location || "",
      latestQualification: user.latestQualification || "",
      yearOfPassing: user.yearOfPassing || "",
      collegeName: user.collegeName || "",
      agreeToWhatsAppUpdates: Boolean(user.agreeToWhatsAppUpdates),
    });
  }, [user]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    const firstName = String(form.firstName || "").trim();
    const lastName = String(form.lastName || "").trim();
    const fullName = [firstName, lastName].filter(Boolean).join(" ").trim();

    if (!fullName) {
      setError("First name is required.");
      return;
    }

    try {
      setIsSaving(true);
      await updateMyProfile({
        firstName,
        lastName,
        fullName,
        whatsappNumber: String(form.whatsappNumber || "").trim(),
        location: String(form.location || "").trim(),
        latestQualification: String(form.latestQualification || "").trim(),
        yearOfPassing: String(form.yearOfPassing || "").trim(),
        collegeName: String(form.collegeName || "").trim(),
        agreeToWhatsAppUpdates: Boolean(form.agreeToWhatsAppUpdates),
      });
      setSuccess("Profile updated successfully.");
    } catch (apiError) {
      setError(getApiErrorMessage(apiError, "Failed to update profile."));
    } finally {
      setIsSaving(false);
    }
  };

  if (isBootstrapping) {
    return (
      <div className="min-h-[80vh] bg-[#F4F7FF] flex items-center justify-center">
        <p className="text-slate-600 font-medium">Loading profile...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="bg-[#F4F7FF] min-h-screen py-8 sm:py-10 px-4 sm:px-6">
      <div className="w-full max-w-350 mx-auto">
        <div className="bg-white rounded-2xl border border-[#DCE5FA] p-4 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900">My Account</h1>
              <p className="text-sm text-slate-500 mt-1">
                Manage your profile details.
              </p>
            </div>
            
          </div>
        </div>

        <form
          onSubmit={handleSave}
          className="mt-6 bg-white rounded-2xl border border-[#DCE5FA] p-4 sm:p-6"
        >
          {error ? (
            <p className="text-sm text-red-600 font-medium mb-4">{error}</p>
          ) : null}
          {success ? (
            <p className="text-sm text-green-700 font-medium mb-4">{success}</p>
          ) : null}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="flex flex-col gap-1 text-sm text-slate-700">
              <span>First Name</span>
              <input
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                className="border border-[#D6E2FC] rounded-lg px-3 py-2"
                required
              />
            </label>

            <label className="flex flex-col gap-1 text-sm text-slate-700">
              <span>Last Name</span>
              <input
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                className="border border-[#D6E2FC] rounded-lg px-3 py-2"
              />
            </label>

            <label className="flex flex-col gap-1 text-sm text-slate-700 md:col-span-2">
              <span>Email</span>
              <input
                value={user.email || ""}
                className="border border-[#D6E2FC] rounded-lg px-3 py-2 bg-slate-50 text-slate-500"
                disabled
              />
            </label>

            <label className="flex flex-col gap-1 text-sm text-slate-700">
              <span>WhatsApp Number</span>
              <input
                name="whatsappNumber"
                value={form.whatsappNumber}
                onChange={handleChange}
                className="border border-[#D6E2FC] rounded-lg px-3 py-2"
              />
            </label>

            <label className="flex flex-col gap-1 text-sm text-slate-700">
              <span>Location</span>
              <input
                name="location"
                value={form.location}
                onChange={handleChange}
                className="border border-[#D6E2FC] rounded-lg px-3 py-2"
              />
            </label>

            <label className="flex flex-col gap-1 text-sm text-slate-700">
              <span>Latest Qualification</span>
              <input
                name="latestQualification"
                value={form.latestQualification}
                onChange={handleChange}
                className="border border-[#D6E2FC] rounded-lg px-3 py-2"
              />
            </label>

            <label className="flex flex-col gap-1 text-sm text-slate-700">
              <span>Year of Passing</span>
              <input
                name="yearOfPassing"
                value={form.yearOfPassing}
                onChange={handleChange}
                className="border border-[#D6E2FC] rounded-lg px-3 py-2"
              />
            </label>

            <label className="flex flex-col gap-1 text-sm text-slate-700 md:col-span-2">
              <span>College / Institute Name</span>
              <input
                name="collegeName"
                value={form.collegeName}
                onChange={handleChange}
                className="border border-[#D6E2FC] rounded-lg px-3 py-2"
              />
            </label>

            <label className="inline-flex items-center gap-2 text-sm text-slate-700 md:col-span-2">
              <input
                type="checkbox"
                name="agreeToWhatsAppUpdates"
                checked={Boolean(form.agreeToWhatsAppUpdates)}
                onChange={handleChange}
                className="h-4 w-4"
              />
              Receive important updates via WhatsApp
            </label>
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="mt-5 px-5 py-2 rounded-lg bg-[#0B4AA6] text-white font-semibold disabled:opacity-60"
          >
            {isSaving ? "Saving..." : "Save Profile"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;