import React from "react";
import { FiFileText, FiTrash2, FiEdit2, FiCheck, FiX, FiCheckCircle, FiEye, FiEyeOff, FiExternalLink, FiKey } from "react-icons/fi";
import { useAdminContext } from "../admin/AdminContext";
import { API_BASE_URL } from "../../api/apiClient";

const SuperDirectory = () => {
  const {
    isSuperDashboard,
    user, isAdmin, isSuperAdmin, isBootstrapping, isImpersonating,
    filteredOpportunities, sorted,
    scopedApplications, paginatedApplications, totalPages, recentApplications,
    form, editingId, showOpportunityForm, requiredSkillInputs, benefitInputs,
    currentStep, setCurrentStep, showPreviewModal, showSuccessMessage,
    activeSection,
    isInternshipPanel, isGlobalProgramPanel, isJobsPanel, isBootcampsPanel,
    isMasterclassesPanel, isDegreeProgramsPanel, isPGProgramsPanel, isClosedApplicationPanel,
    isSuperStatsSection, isSuperPostSection, isSuperUsersSection, isSuperAdminsSection,
    isSuperApprovedRequestsSection, isAnySuperDirectorySection,
    currentPage, setCurrentPage, itemsPerPage, totalClosedPages, paginatedClosedItems,
    closedApplicationView, setClosedApplicationView, closedApplicationItems, closedApplicationTitle,
    selectedIds,
    directory,
    userCount, adminCount, superAdminCount, totalAccountCount, userPercent, adminPercent, superAdminPercent,
    isWhatsAppConnected, whatsAppStatusText,
    passwordEditorAdminId, adminPasswordForm, showAdminPassword,
    changingPasswordAdminId, passwordChangeMessage, adminApprovalMessage, approvingAdminId,
    visiblePasswords, openingAdminId, deletingUserId,
    selectedApplication, setSelectedApplication,
    statusChangingId, statusChangeMessage,
    error, busy,
    resolveOwnerName,
    handleChange, handleLogoChange, handleRequiredSkillChange, addRequiredSkillInput, removeRequiredSkillInput,
    handleBenefitChange, addBenefitInput, resetForm,
    handleOpenCreateForm, handleSuperCreateInternship, handleSuperCreateGlobalProgram,
    handleSubmit, handleConfirmSubmit,
    handleEdit, handleViewResponses, handleDelete, handleBulkDelete,
    handleSelectAll, handleSelectItem,
    handleViewResume,
    handleSectionChange, handleLogout, handleReturnToSuperAdmin,
    handleOpenAdminDashboard, handleApproveAdminAccess, handleDeleteAccount,
    handleStartPasswordEditor, handleCancelPasswordEditor, toggleAdminPasswordVisibility,
    handleAdminPasswordInputChange, handleNotifyAdminToggle, handleChangeAdminPassword,
    handleStatusChange, handleExport, fetchDecryptedPassword, refreshDirectory,
  } = useAdminContext();

  return (
    <>
              {!showOpportunityForm && isAnySuperDirectorySection ? (
                <div className="bg-white rounded-2xl border border-[#DCE5FA] p-4 sm:p-5">
                  <div className="flex flex-col items-start gap-3 mb-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h2 className="text-2xl font-semibold text-slate-800">
                        {isSuperStatsSection
                          ? "Overview"
                          : isSuperPostSection
                            ? "Post Opportunity"
                            : isSuperAdminsSection
                              ? "Admins"
                              : isSuperApprovedRequestsSection
                                ? "Approved Requests"
                                : "Users"}
                      </h2>
                      <p className="text-sm text-slate-500">
                        {isSuperStatsSection
                          ? "Overview of all account totals."
                          : isSuperPostSection
                            ? "Open the post panel to create internships or global programs."
                            : isSuperAdminsSection
                              ? "View and manage admin accounts."
                              : isSuperApprovedRequestsSection
                                ? "View already approved admin requests."
                                : "View and manage user accounts."}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={refreshDirectory}
                      className="px-3 py-1.5 rounded-md bg-slate-900 text-white text-sm font-semibold"
                    >
                      Refresh
                    </button>
                  </div>

                  {/* {isSuperStatsSection && (
                    // <div className="space-y-4">
                    //   <p className="text-sm text-slate-500">
                    //     Select Users or Admins from the left menu to open each list separately.
                    //   </p>

                    //   <div className="grid grid-cols-3 gap-3">
                    //     <div className="rounded-lg border border-[#E2EAFC] bg-[#F8FAFF] p-3">
                    //       <p className="text-xs text-slate-500 font-semibold tracking-wide">
                    //         USERS SHARE
                    //       </p>
                    //       <p className="text-2xl font-bold text-slate-800 mt-1">
                    //         {userPercent}%
                    //       </p>
                    //       <p className="text-xs text-slate-500 mt-1">
                    //         {userCount} of {totalAccountCount} accounts
                    //       </p>
                    //     </div>
                    //     <div className="rounded-lg border border-[#E2EAFC] bg-[#F8FAFF] p-3">
                    //       <p className="text-xs text-slate-500 font-semibold tracking-wide">
                    //         ADMINS SHARE
                    //       </p>
                    //       <p className="text-2xl font-bold text-slate-800 mt-1">
                    //         {adminPercent}%
                    //       </p>
                    //       <p className="text-xs text-slate-500 mt-1">
                    //         {adminCount} of {totalAccountCount} accounts
                    //       </p>
                    //     </div>
                    //     <div className="rounded-lg border border-[#E2EAFC] bg-[#F8FAFF] p-3">
                    //       <p className="text-xs text-slate-500 font-semibold tracking-wide">
                    //         SUPER ADMINS SHARE
                    //       </p>
                    //       <p className="text-2xl font-bold text-slate-800 mt-1">
                    //         {superAdminPercent}%
                    //       </p>
                    //       <p className="text-xs text-slate-500 mt-1">
                    //         {superAdminCount} of {totalAccountCount} accounts
                    //       </p>
                    //     </div>
                    //   </div>

                    //   <div className="space-y-2">
                    //     <div>
                    //       <div className="flex items-center justify-between text-xs text-slate-600 mb-1">
                    //         <span>Users</span>
                    //         <span>{userPercent}%</span>
                    //       </div>
                    //       <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                    //         <div
                    //           className="h-full bg-slate-700"
                    //           style={{ width: `${userPercent}%` }}
                    //         />
                    //       </div>
                    //     </div>
                    //     <div>
                    //       <div className="flex items-center justify-between text-xs text-slate-600 mb-1">
                    //         <span>Admins</span>
                    //         <span>{adminPercent}%</span>
                    //       </div>
                    //       <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                    //         <div
                    //           className="h-full bg-red-600"
                    //           style={{ width: `${adminPercent}%` }}
                    //         />
                    //       </div>
                    //     </div>
                    //     <div>
                    //       <div className="flex items-center justify-between text-xs text-slate-600 mb-1">
                    //         <span>Super Admins</span>
                    //         <span>{superAdminPercent}%</span>
                    //       </div>
                    //       <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                    //         <div
                    //           className="h-full bg-emerald-600"
                    //           style={{ width: `${superAdminPercent}%` }}
                    //         />
                    //       </div>
                    //     </div>
                    //   </div>

                    //   <div className="flex items-center gap-2 pt-1">
                    //     <button
                    //       type="button"
                    //       onClick={() => handleSectionChange("Users")}
                    //       className="px-3 py-1.5 rounded-md bg-slate-100 text-slate-800 text-sm font-semibold"
                    //     >
                    //       Open Users
                    //     </button>
                    //     <button
                    //       type="button"
                    //       onClick={() => handleSectionChange("Admins")}
                    //       className="px-3 py-1.5 rounded-md bg-slate-900 text-white text-sm font-semibold"
                    //     >
                    //       Open Admins
                    //     </button>
                    //   </div>
                    // </div>
                  )} */}

                  {(isSuperAdminsSection || isSuperApprovedRequestsSection) && (
                    <div>
                      <div className="mb-2 flex items-center justify-between gap-2">
                        <h3 className="text-lg font-semibold text-slate-800">
                          {isSuperApprovedRequestsSection
                            ? "Approved Admin Requests"
                            : "Admins"}
                        </h3>
                        {/* <button
                          type="button"
                          onClick={() => navigate("/admin-dashboard")}
                          className="px-3 py-1.5 rounded-md bg-slate-900 text-white text-xs font-semibold"
                        >
                          Open Admin Dashboard
                        </button> */}
                      </div>
                      {(isSuperApprovedRequestsSection
                        ? directory.admins?.filter(
                            (item) => item.adminApprovalStatus === "approved",
                          )
                        : directory.admins
                      )?.length === 0 ? (
                        <p className="text-sm text-slate-500">
                          {isSuperApprovedRequestsSection
                            ? "No approved admin requests found."
                            : "No admins found."}
                        </p>
                      ) : (
                        <div className="overflow-x-auto border border-[#E2EAFC] rounded-lg">
                          <table className="min-w-215 w-full text-sm">
                            <thead>
                              <tr className="text-left border-b border-[#E3EAFA] text-slate-500">
                                <th className="py-2 px-3">Name</th>
                                <th className="py-2 px-3">Email</th>
                                <th className="py-2 px-3">Phone</th>
                                <th className="py-2 px-3">Organization</th>
                                <th className="py-2 px-3">Password</th>
                                <th className="py-2 px-3">Status</th>
                                <th className="py-2 px-3 ">Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {(isSuperApprovedRequestsSection
                                ? directory.admins?.filter(
                                    (item) =>
                                      item.adminApprovalStatus === "approved",
                                  )
                                : directory.admins).map((item) => (
                                <tr
                                  key={item.id}
                                  className="border-b border-[#EDF2FD]"
                                >
                                  <td className="py-2 px-3 font-medium text-slate-800 wrap-break-word">
                                    {item.fullName}
                                  </td>
                                  <td className="py-2 px-3 text-slate-600 break-all">
                                    {item.email}
                                  </td>

                                  <td className="py-2 px-3 text-slate-600 break-all">
                                    {item.whatsappNumber || (
                                      <span className="text-slate-400">
                                        N/A
                                      </span>
                                    )}
                                  </td>
                                  <td className="py-2 px-3 text-slate-600">
                                    {item.organizationName || (
                                      <span className="text-slate-400">
                                        N/A
                                      </span>
                                    )}
                                  </td>
                                  <td className="py-2 px-3 text-slate-600">
                                    <div className="flex items-center gap-2">
                                      <span className="font-mono">
                                        {visiblePasswords[item.id] === true
                                          ? "••••••••"
                                          : visiblePasswords[item.id] ===
                                              "loading"
                                            ? "Loading..."
                                            : visiblePasswords[item.id] ===
                                                "error"
                                              ? "Error"
                                              : visiblePasswords[item.id] ===
                                                  "N/A"
                                                ? "N/A"
                                                : visiblePasswords[item.id] ||
                                                  "••••••••"}
                                      </span>
                                      {isSuperAdmin ? (
                                        <button
                                          type="button"
                                          onClick={() => {
                                            if (
                                              !visiblePasswords[item.id] ||
                                              visiblePasswords[item.id] ===
                                                true ||
                                              visiblePasswords[item.id] ===
                                                "error" ||
                                              visiblePasswords[item.id] ===
                                                "N/A"
                                            ) {
                                              fetchDecryptedPassword(item.id);
                                            } else {
                                              setVisiblePasswords((prev) => ({
                                                ...prev,
                                                [item.id]: true,
                                              }));
                                            }
                                          }}
                                          className="text-slate-400 hover:text-slate-600 transition-colors"
                                        >
                                          {visiblePasswords[item.id] &&
                                          visiblePasswords[item.id] !== true &&
                                          visiblePasswords[item.id] !==
                                            "loading" &&
                                          visiblePasswords[item.id] !==
                                            "error" &&
                                          visiblePasswords[item.id] !==
                                            "N/A" ? (
                                            <FiEyeOff size={14} />
                                          ) : (
                                            <FiEye size={14} />
                                          )}
                                        </button>
                                      ) : (
                                        <FiEyeOff
                                          size={14}
                                          className="text-slate-300"
                                        />
                                      )}
                                    </div>
                                  </td>
                                  <td className="py-2 px-3 text-slate-600">
                                    <span
                                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${
                                        item.adminApprovalStatus === "pending"
                                          ? "bg-amber-100 text-amber-800"
                                          : "bg-emerald-100 text-emerald-800"
                                      }`}
                                    >
                                      {item.adminApprovalStatus === "pending"
                                        ? "Pending Approval"
                                        : "Approved"}
                                    </span>
                                  </td>
                                  <td className="py-2 px-3">
                                    <div className="flex items-center gap-3">
                                      {item.adminApprovalStatus ===
                                        "pending" && (
                                        <div className="relative group">
                                          <button
                                            type="button"
                                            onClick={() =>
                                              handleApproveAdminAccess(item.id)
                                            }
                                            disabled={
                                              approvingAdminId === item.id ||
                                              !item.isEmailVerified ||
                                              !item.isPhoneVerified
                                            }
                                            className="p-2 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all disabled:opacity-50"
                                          >
                                            {approvingAdminId === item.id ? (
                                              <div className="w-4 h-4 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                                            ) : (
                                              <FiCheck size={16} />
                                            )}
                                          </button>
                                          <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-[10px] text-white bg-slate-800 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-sm z-10">
                                            {!item.isEmailVerified ||
                                            !item.isPhoneVerified
                                              ? "Verify Email & Phone First"
                                              : "Approve Access"}
                                          </span>
                                        </div>
                                      )}

                                      <div className="relative group">
                                        <button
                                          type="button"
                                          onClick={() =>
                                            handleOpenAdminDashboard(item.id)
                                          }
                                          disabled={
                                            item.adminApprovalStatus ===
                                              "pending" ||
                                            openingAdminId === item.id ||
                                            deletingUserId === item.id
                                          }
                                          className="p-2 rounded-lg bg-slate-50 text-slate-600 hover:bg-slate-900 hover:text-white transition-all disabled:opacity-50"
                                        >
                                          {openingAdminId === item.id ? (
                                            <div className="w-4 h-4 border-2 border-slate-600 border-t-transparent rounded-full animate-spin" />
                                          ) : (
                                            <FiExternalLink size={16} />
                                          )}
                                        </button>
                                        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-[10px] text-white bg-slate-800 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-sm z-10">
                                          {openingAdminId === item.id
                                            ? "Opening..."
                                            : "Open Dashboard"}
                                        </span>
                                      </div>

                                      <div className="relative group">
                                        <button
                                          type="button"
                                          onClick={() =>
                                            handleStartPasswordEditor(item.id)
                                          }
                                          disabled={
                                            openingAdminId === item.id ||
                                            deletingUserId === item.id ||
                                            changingPasswordAdminId === item.id
                                          }
                                          className="p-2 rounded-lg bg-blue-50 text-red-600 hover:bg-red-600 hover:text-white transition-all disabled:opacity-50"
                                        >
                                          <FiKey size={16} />
                                        </button>
                                        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-[10px] text-white bg-slate-800 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-sm z-10">
                                          Change Password
                                        </span>
                                      </div>

                                      <div className="relative group">
                                        <button
                                          type="button"
                                          onClick={() =>
                                            handleDeleteAccount(item)
                                          }
                                          disabled={deletingUserId === item.id}
                                          className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all disabled:opacity-50"
                                        >
                                          {deletingUserId === item.id ? (
                                            <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                                          ) : (
                                            <FiTrash2 size={16} />
                                          )}
                                        </button>
                                        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-[10px] text-white bg-slate-800 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-sm z-10">
                                          Delete Account
                                        </span>
                                      </div>
                                    </div>

                                    {passwordEditorAdminId === item.id && (
                                      <div className="mt-2 rounded-md border border-[#DCE5FA] bg-[#F8FAFF] p-2.5">
                                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                                          <div className="relative">
                                            <input
                                              type={
                                                showAdminPassword.newPassword
                                                  ? "text"
                                                  : "password"
                                              }
                                              name="newPassword"
                                              value={
                                                adminPasswordForm.newPassword
                                              }
                                              onChange={
                                                handleAdminPasswordInputChange
                                              }
                                              placeholder="New password"
                                              className="w-full rounded-md border border-slate-300 bg-white px-2 py-1.5 pr-8 text-xs text-slate-800"
                                            />
                                            <button
                                              type="button"
                                              onClick={() =>
                                                toggleAdminPasswordVisibility(
                                                  "newPassword",
                                                )
                                              }
                                              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500"
                                              aria-label={
                                                showAdminPassword.newPassword
                                                  ? "Hide new password"
                                                  : "Show new password"
                                              }
                                            >
                                              {showAdminPassword.newPassword ? (
                                                <FiEyeOff size={14} />
                                              ) : (
                                                <FiEye size={14} />
                                              )}
                                            </button>
                                          </div>
                                          <div className="relative">
                                            <input
                                              type={
                                                showAdminPassword.confirmPassword
                                                  ? "text"
                                                  : "password"
                                              }
                                              name="confirmPassword"
                                              value={
                                                adminPasswordForm.confirmPassword
                                              }
                                              onChange={
                                                handleAdminPasswordInputChange
                                              }
                                              placeholder="Confirm password"
                                              className="w-full rounded-md border border-slate-300 bg-white px-2 py-1.5 pr-8 text-xs text-slate-800"
                                            />
                                            <button
                                              type="button"
                                              onClick={() =>
                                                toggleAdminPasswordVisibility(
                                                  "confirmPassword",
                                                )
                                              }
                                              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500"
                                              aria-label={
                                                showAdminPassword.confirmPassword
                                                  ? "Hide confirm password"
                                                  : "Show confirm password"
                                              }
                                            >
                                              {showAdminPassword.confirmPassword ? (
                                                <FiEyeOff size={14} />
                                              ) : (
                                                <FiEye size={14} />
                                              )}
                                            </button>
                                          </div>
                                        </div>
                                        <p className="mt-1.5 text-[11px] text-slate-500">
                                          Password must be at least 8 characters
                                          and include letters, numbers, and
                                          special characters.
                                        </p>
                                        <label className="mt-2 flex items-center gap-2 text-xs text-slate-700">
                                          <input
                                            type="checkbox"
                                            checked={Boolean(
                                              adminPasswordForm.notifyAdmin,
                                            )}
                                            onChange={handleNotifyAdminToggle}
                                            className="h-4 w-4 rounded border-slate-300 text-slate-900"
                                          />
                                          Notify admin by email about password
                                          change
                                        </label>
                                        <div className="mt-2 flex items-center gap-2">
                                          <button
                                            type="button"
                                            onClick={() =>
                                              handleChangeAdminPassword(item.id)
                                            }
                                            disabled={
                                              changingPasswordAdminId ===
                                              item.id
                                            }
                                            className="px-2.5 py-1 rounded-md bg-slate-900 text-white text-xs font-semibold disabled:opacity-60"
                                          >
                                            {changingPasswordAdminId === item.id
                                              ? "Saving..."
                                              : "Save Password"}
                                          </button>
                                          <button
                                            type="button"
                                            onClick={handleCancelPasswordEditor}
                                            disabled={
                                              changingPasswordAdminId ===
                                              item.id
                                            }
                                            className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-semibold disabled:opacity-60"
                                          >
                                            Cancel
                                          </button>
                                        </div>
                                      </div>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  )}

                  {isSuperUsersSection && (
                    <div>
                      <h3 className="text-lg font-semibold text-slate-800 mb-2">
                        Users
                      </h3>
                      {directory.users?.length === 0 ? (
                        <p className="text-sm text-slate-500">
                          No users found.
                        </p>
                      ) : (
                        <div className="overflow-x-auto border border-[#E2EAFC] rounded-lg">
                          <table className="min-w-[800px] w-full text-sm">
                            <thead>
                              <tr className="text-left border-b border-[#E3EAFA] text-slate-500">
                                <th className="py-2 px-3">Name</th>
                                <th className="py-2 px-3">Email</th>
                                <th className="py-2 px-3">Phone</th>
                                <th className="py-2 px-3">Qualification</th>
                                <th className="py-2 px-3">Resume</th>
                                <th className="py-2 px-3">Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {directory.users.map((item) => (
                                <tr
                                  key={item.id}
                                  className="border-b border-[#EDF2FD]"
                                >
                                  <td className="py-2 px-3 font-medium text-slate-800 wrap-break-word">
                                    {item.fullName}
                                  </td>
                                  <td className="py-2 px-3 text-slate-600 break-all">
                                    {item.email}
                                  </td>

                                  <td className="py-2 px-3 text-slate-600">
                                    {item.whatsappNumber || (
                                      <span className="text-slate-400">
                                        N/A
                                      </span>
                                    )}
                                  </td>

                                  <td className="py-2 px-3 text-slate-600">
                                    {item.latestQualification || (
                                      <span className="text-slate-400">
                                        N/A
                                      </span>
                                    )}
                                  </td>

                                  <td className="py-2 px-3">
                                    {item.resumeFilePath ? (
                                      <a
                                        href={`${API_BASE_URL}${item.resumeFilePath.startsWith("/") ? "" : "/"}${item.resumeFilePath}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0B4AA6] text-white text-xs font-semibold hover:bg-[#083D8B] transition shadow-sm"
                                      >
                                        <FiFileText size={14} />
                                        View
                                      </a>
                                    ) : (
                                      <span className="text-slate-400">
                                        N/A
                                      </span>
                                    )}
                                  </td>
                                  <td className="py-2 px-3">
                                    <div className="relative group">
                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleDeleteAccount(item)
                                        }
                                        disabled={deletingUserId === item.id}
                                        className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all disabled:opacity-50"
                                      >
                                        {deletingUserId === item.id ? (
                                          <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                                        ) : (
                                          <FiTrash2 size={16} />
                                        )}
                                      </button>
                                      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-[10px] text-white bg-slate-800 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-sm z-10">
                                        Delete Account
                                      </span>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  )}

                  {isSuperPostSection && (
                    <div>
                      {!showOpportunityForm ? (
                        <div className="text-sm text-slate-500">
                          Click Post Internship or Post Global Program above to
                          open the form.
                        </div>
                      ) : null}
                    </div>
                  )}
                </div>
              ) : null}
    </>
  );
};

export default SuperDirectory;
