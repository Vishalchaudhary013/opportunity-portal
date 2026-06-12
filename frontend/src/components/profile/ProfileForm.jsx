import React from "react";

const ProfileForm = ({ form, user, isSaving, error, success, onChange, onSubmit }) => {
  return (
    <form
      onSubmit={onSubmit}
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
            onChange={onChange}
            className="border border-[#D6E2FC] rounded-lg px-3 py-2"
            required
          />
        </label>

        <label className="flex flex-col gap-1 text-sm text-slate-700">
          <span>Last Name</span>
          <input
            name="lastName"
            value={form.lastName}
            onChange={onChange}
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
            onChange={onChange}
            className="border border-[#D6E2FC] rounded-lg px-3 py-2"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm text-slate-700">
          <span>Location</span>
          <input
            name="location"
            value={form.location}
            onChange={onChange}
            className="border border-[#D6E2FC] rounded-lg px-3 py-2"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm text-slate-700">
          <span>Latest Qualification</span>
          <input
            name="latestQualification"
            value={form.latestQualification}
            onChange={onChange}
            className="border border-[#D6E2FC] rounded-lg px-3 py-2"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm text-slate-700">
          <span>Year of Passing</span>
          <input
            name="yearOfPassing"
            value={form.yearOfPassing}
            onChange={onChange}
            className="border border-[#D6E2FC] rounded-lg px-3 py-2"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm text-slate-700 md:col-span-2">
          <span>College / Institute Name</span>
          <input
            name="collegeName"
            value={form.collegeName}
            onChange={onChange}
            className="border border-[#D6E2FC] rounded-lg px-3 py-2"
          />
        </label>

        <label className="inline-flex items-center gap-2 text-sm text-slate-700 md:col-span-2">
          <input
            type="checkbox"
            name="agreeToWhatsAppUpdates"
            checked={Boolean(form.agreeToWhatsAppUpdates)}
            onChange={onChange}
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
  );
};

export default ProfileForm;
