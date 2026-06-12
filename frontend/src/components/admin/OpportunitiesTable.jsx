import React from "react";
import { FiFileText, FiTrash2, FiEdit2, FiCheck, FiX, FiCheckCircle, FiEye, FiEyeOff, FiExternalLink, FiKey, FiGlobe } from "react-icons/fi";
import { useAdminContext } from "./AdminContext";
import { API_BASE_URL } from "../../api/apiClient";

const OpportunitiesTable = () => {
  const {
    isSuperDashboard,
    user, isAdmin, isSuperAdmin, isBootstrapping, isImpersonating,
    filteredOpportunities, sorted, applications,
    scopedApplications, paginatedApplications, totalPages, recentApplications,
    form, editingId, showOpportunityForm, requiredSkillInputs, benefitInputs,
    currentStep, setCurrentStep, showPreviewModal, showSuccessMessage,
    activeSection,
    isInternshipPanel, isGlobalProgramPanel, isJobsPanel, isBootcampsPanel,
    isMasterclassesPanel, isDegreeProgramsPanel, isPGProgramsPanel, isClosedApplicationPanel, isAllApplicationPanel,
    isSuperStatsSection, isSuperPostSection, isSuperUsersSection, isSuperAdminsSection,
    isSuperApprovedRequestsSection, isAnySuperDirectorySection,
    currentPage, setCurrentPage, itemsPerPage, totalClosedPages, paginatedClosedItems,
    closedApplicationView, setClosedApplicationView, closedApplicationItems, closedApplicationTitle,
    selectedIds, setSelectedIds,
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
    handleStatusChange, handleExport, fetchDecryptedPassword, isOpportunityClosed
  } = useAdminContext();

  const closedApplicationContent = isClosedApplicationPanel ? (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => {
              setClosedApplicationView("Internship");
              setSelectedIds([]);
            }}
            className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
              closedApplicationView === "Internship"
                ? "bg-[#0B4AA6] text-white"
                : "bg-white text-slate-700 border border-[#DCE5FA]"
            }`}
          >
            Closed Internship
          </button>
          <button
            type="button"
            onClick={() => {
              setClosedApplicationView("Global Program");
              setSelectedIds([]);
            }}
            className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
              closedApplicationView === "Global Program"
                ? "bg-[#0B4AA6] text-white"
                : "bg-white text-slate-700 border border-[#DCE5FA]"
            }`}
          >
            Closed Global Program
          </button>
        </div>
        {selectedIds.length > 0 && (
          <button
            type="button"
            onClick={handleBulkDelete}
            className="px-3 py-2 rounded-lg bg-red-600 text-white text-sm font-semibold hover:bg-red-700 flex items-center gap-2 shadow-sm"
          >
            <FiTrash2 size={14} />
            Delete Selected ({selectedIds.length})
          </button>
        )}
      </div>

      <div className="rounded-xl border border-[#E2EAFC] bg-white">
        <div className="p-4 border-b border-[#E2EAFC] flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-800">
            {closedApplicationTitle}
          </h3>
          <span className="text-xs font-medium text-slate-500">
            {closedApplicationItems.length} items
          </span>
        </div>

        {closedApplicationItems.length === 0 ? (
          <div className="p-8 text-center text-slate-500">
            No closed {closedApplicationView.toLowerCase()} found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left border-b border-[#E3EAFA] text-slate-500 bg-slate-50/50">
                  <th className="py-3 px-4 w-10 text-center">
                    <input
                      type="checkbox"
                      className="rounded border-slate-300"
                      checked={
                        closedApplicationItems.length > 0 &&
                        selectedIds.length === closedApplicationItems.length
                      }
                      onChange={() => handleSelectAll(closedApplicationItems)}
                    />
                  </th>
                  <th className="py-3 px-4 font-semibold">Name</th>
                  <th className="py-3 px-4 font-semibold">Company</th>
                  <th className="py-3 px-4 font-semibold">Location</th>
                  <th className="py-3 px-4 font-semibold">Date</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EDF2FD]">
                {paginatedClosedItems.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="py-3 px-4 text-center">
                      <input
                        type="checkbox"
                        className="rounded border-slate-300"
                        checked={selectedIds.includes(item.id)}
                        onChange={() => handleSelectItem(item.id)}
                      />
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-800">
                      {item.title}
                    </td>
                    <td className="py-3 px-4 text-slate-600">{item.company}</td>
                    <td className="py-3 px-4 text-slate-600">
                      {item.location}
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {item.deadline
                        ? new Date(item.deadline).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wide uppercase bg-red-100 text-red-700">
                        Closed
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button
                          onClick={() => handleEdit(item)}
                          className="text-blue-500 hover:text-blue-700 transition-colors"
                          title="Edit"
                        >
                          <FiEdit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="text-rose-500 hover:text-rose-700 transition-colors"
                          title="Delete"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Controls for Closed Applications */}
        {totalClosedPages > 1 && (
          <div className="mt-6 flex items-center  justify-center border-t border-[#EDF2FD] p-4 bg-white rounded-b-xl">
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              <div className="flex items-center px-4">
                <span className="text-sm font-medium text-slate-700">
                  Page {currentPage} of {totalClosedPages}
                </span>
              </div>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalClosedPages))
                }
                disabled={currentPage === totalClosedPages}
                className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  ) : null;

  const showOpportunitiesTable = isInternshipPanel || isGlobalProgramPanel || isJobsPanel || isBootcampsPanel || isMasterclassesPanel || isDegreeProgramsPanel || isPGProgramsPanel || isClosedApplicationPanel || isAllApplicationPanel;

  if (!showOpportunitiesTable) return null;

  return (
    <>
                  {!showOpportunityForm && (
                    <div className="bg-white rounded-2xl border border-[#DCE5FA] p-4 sm:p-5">
                      <div className="flex flex-col items-start gap-3 mb-4 sm:flex-row sm:items-center sm:justify-between">
                        <h2 className="text-2xl font-semibold text-slate-800">
                          {activeSection === "Internship"
                            ? "Internship Opportunities"
                            : activeSection === "Global Program"
                              ? "Global Program Opportunities"
                              : activeSection === "Jobs"
                                ? "Job Opportunities"
                                : activeSection === "Bootcamps"
                                  ? "Bootcamp Opportunities"
                                  : activeSection === "Masterclasses"
                                    ? "Masterclass Opportunities"
                                    : activeSection === "Degree Programs"
                                      ? "Degree Program Opportunities"
                                      : activeSection === "PG Programs"
                                        ? "PG Program Opportunities"
                                        : activeSection === "Closed Application"
                                          ? "Closed Application"
                                          : activeSection === "All Application"
                                            ? "All Published Opportunities"
                                            : "Application Forms"}
                        </h2>
                        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center">
                          {!isClosedApplicationPanel && !isAllApplicationPanel && (
                            <>
                              <button
                                type="button"
                                onClick={handleOpenCreateForm}
                                className="w-full sm:w-auto px-3 py-1.5 rounded-md bg-[#0B4AA6] text-white text-sm font-semibold hover:bg-[#083B85]"
                              >
                                {activeSection === "Internship"
                                  ? "Create Internship"
                                  : activeSection === "Global Program"
                                    ? "Create Global Program"
                                    : activeSection === "Jobs"
                                      ? "Create Job"
                                      : activeSection === "Bootcamps"
                                        ? "Create Bootcamp"
                                        : activeSection === "Masterclasses"
                                          ? "Create Masterclass"
                                          : activeSection === "Degree Programs"
                                            ? "Create Degree Program"
                                            : activeSection === "PG Programs"
                                              ? "Create PG Program"
                                              : "Create Opportunity"}
                              </button>
                              {selectedIds.length > 0 && (
                                <button
                                  type="button"
                                  onClick={handleBulkDelete}
                                  className="w-full sm:w-auto px-3 py-1.5 rounded-md bg-red-600 text-white text-sm font-semibold hover:bg-red-700 flex items-center justify-center gap-2"
                                >
                                  <FiTrash2 size={14} />
                                  Delete Selected ({selectedIds.length})
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => handleExport("csv")}
                                className="w-full sm:w-auto px-3 py-1.5 rounded-md bg-slate-100 text-slate-900 text-sm font-semibold"
                              >
                                Download CSV
                              </button>
                              <button
                                type="button"
                                onClick={() => handleExport("xlsx")}
                                className="w-full sm:w-auto px-3 py-1.5 rounded-md bg-slate-900 text-white text-sm font-semibold"
                              >
                                Download Excel
                              </button>
                            </>
                          )}
                        </div>
                      </div>

                      {isClosedApplicationPanel ? (
                        closedApplicationContent
                      ) : filteredOpportunities.length === 0 ? (
                        <p className="text-slate-500">
                          No opportunities added yet.
                        </p>
                      ) : (
                        <div className="overflow-x-auto border border-[#E2EAFC] rounded-xl bg-white">
                          <table className="min-w-full text-sm">
                            <thead>
                              <tr className="text-left border-b border-[#E3EAFA] text-slate-500 bg-slate-50/50">
                                <th className="py-3 px-4 w-10 text-center">
                                  <input
                                    type="checkbox"
                                    className="rounded border-slate-300"
                                    checked={
                                      filteredOpportunities.length > 0 &&
                                      selectedIds.length ===
                                        filteredOpportunities.length
                                    }
                                    onChange={() =>
                                      handleSelectAll(filteredOpportunities)
                                    }
                                  />
                                </th>
                                <th className="py-3 px-4 font-semibold">
                                  Name
                                </th>
                                <th className="py-3 px-4 font-semibold">
                                  Company
                                </th>
                                <th className="py-3 px-4 font-semibold">
                                  Location
                                </th>
                                <th className="py-3 px-4 font-semibold">
                                  Date
                                </th>
                                <th className="py-3 px-4 font-semibold">
                                  Status
                                </th>
                                <th className="py-3 px-4 font-semibold text-center">
                                  Responses
                                </th>
                                <th className="py-3 px-4 font-semibold text-right">
                                  Actions
                                </th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-[#EDF2FD]">
                              {filteredOpportunities.map((item) => {
                                const isClosed = isOpportunityClosed(item);
                                return (
                                  <tr
                                    key={item.id}
                                    className="hover:bg-slate-50/50 transition-colors"
                                  >
                                    <td className="py-3 px-4 text-center">
                                      <input
                                        type="checkbox"
                                        className="rounded border-slate-300"
                                        checked={selectedIds.includes(item.id)}
                                        onChange={() =>
                                          handleSelectItem(item.id)
                                        }
                                      />
                                    </td>
                                    <td className="py-3 px-4 font-medium text-slate-800">
                                      {item.title}
                                    </td>
                                    <td className="py-3 px-4 text-slate-600">
                                      {item.company}
                                    </td>
                                    <td className="py-3 px-4 text-slate-600">
                                      {item.location}
                                    </td>
                                    <td className="py-3 px-4 text-slate-600">
                                      {item.deadline
                                        ? new Date(
                                            item.deadline,
                                          ).toLocaleDateString()
                                        : "N/A"}
                                    </td>
                                    <td className="py-3 px-4">
                                      <span
                                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wide uppercase ${
                                          isClosed
                                            ? "bg-rose-100 text-rose-700"
                                            : "bg-emerald-100 text-emerald-700"
                                        }`}
                                      >
                                        {isClosed ? "Inactive" : "Active"}
                                      </span>
                                    </td>

                                    {/*Responses button*/}
                                    <td className="py-3 px-4 text-center">
                                      {(() => {
                                        const responseCount =
                                          applications.filter((app) => {
                                            const oppId = String(
                                              app.opportunityId ||
                                                app.opportunity?._id ||
                                                app.opportunity ||
                                                "",
                                            );
                                            return (
                                              oppId ===
                                              String(item.id || item._id)
                                            );
                                          }).length;

                                        return responseCount > 0 ? (
                                          <button
                                            onClick={() =>
                                              handleViewResponses(
                                                item.id || item._id,
                                              )
                                            }
                                            className="text-blue-500 hover:text-blue-700 transition-colors flex items-center gap-2 justify-center mx-auto group"
                                            title="View Responses"
                                          >
                                            <span className="font-bold">
                                              {responseCount}
                                            </span>
                                            <FiEye
                                              size={16}
                                              className="group-hover:scale-110 transition-transform"
                                            />
                                          </button>
                                        ) : (
                                          <span className="text-slate-300 flex items-center gap-2 justify-center">
                                            <span>0</span>
                                            <FiEye size={16} />
                                          </span>
                                        );
                                      })()}
                                    </td>

                                    <td className="py-3 px-4 text-right">
                                      <div className="flex items-center justify-end gap-3">
                                        <button
                                          onClick={() => handleEdit(item)}
                                          className="text-blue-500 hover:text-blue-700 transition-colors"
                                          title="Edit"
                                        >
                                          <FiEdit2 size={16} />
                                        </button>
                                        <button
                                          onClick={() => handleDelete(item.id)}
                                          className="text-rose-500 hover:text-rose-700 transition-colors"
                                          title="Delete"
                                        >
                                          <FiTrash2 size={16} />
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  )}

    </>
  );
};

export default OpportunitiesTable;
