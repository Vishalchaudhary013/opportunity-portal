import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useOpportunities } from "../context/OpportunitiesContext";
import ProfileForm from "../components/profile/ProfileForm";

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

        <ProfileForm
          form={form}
          user={user}
          isSaving={isSaving}
          error={error}
          success={success}
          onChange={handleChange}
          onSubmit={handleSave}
        />
      </div>
    </div>
  );
};

export default ProfilePage;