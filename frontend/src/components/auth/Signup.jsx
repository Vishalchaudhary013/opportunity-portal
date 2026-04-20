import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff, FiUpload } from "react-icons/fi";
import { useOpportunities } from "../../context/OpportunitiesContext";

const Signup = () => {
  const navigate = useNavigate();
  const {
    signup,
    adminSignup,
    requestEmailVerification,
    verifyEmailCode,
    requestPhoneVerification,
    verifyPhoneCode,
  } = useOpportunities();
  const [accountType, setAccountType] = useState("student");
  const [studentResumeName, setStudentResumeName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [verificationEmail, setVerificationEmail] = useState("");
  const [emailCode, setEmailCode] = useState("");
  const [phoneCode, setPhoneCode] = useState("");
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [studentForm, setStudentForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobileNumber: "",
    password: "",
    confirmPassword: "",
  });
  const [employerForm, setEmployerForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState({
    studentPassword: false,
    studentConfirmPassword: false,
    employerPassword: false,
    employerConfirmPassword: false,
  });

  useEffect(() => {
    const previousBodyBackground = document.body.style.backgroundColor;
    const previousHtmlBackground = document.documentElement.style.backgroundColor;

    document.body.style.backgroundColor = "#0F2A4D";
    document.documentElement.style.backgroundColor = "#0F2A4D";

    return () => {
      document.body.style.backgroundColor = previousBodyBackground;
      document.documentElement.style.backgroundColor = previousHtmlBackground;
    };
  }, []);

  const togglePasswordVisibility = (key) => {
    setShowPassword((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleStudentChange = (event) => {
    const { name, value } = event.target;
    setStudentForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEmployerChange = (event) => {
    const { name, value } = event.target;
    setEmployerForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleStudentSignup = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    const fullName = `${studentForm.firstName} ${studentForm.lastName}`.trim();

    if (
      !fullName ||
      !studentForm.email ||
      !studentForm.mobileNumber ||
      !studentForm.password
    ) {
      setError("Please fill all required fields.");
      return;
    }

    if (studentForm.password !== studentForm.confirmPassword) {
      setError("Password and confirm password do not match.");
      return;
    }

    try {
      setIsSubmitting(true);
      await signup({
        firstName: String(studentForm.firstName || "").trim(),
        lastName: String(studentForm.lastName || "").trim(),
        fullName,
        email: studentForm.email,
        password: studentForm.password,
        whatsappNumber: studentForm.mobileNumber,
      });
      setVerificationEmail(studentForm.email);
      setEmailCode("");
      setPhoneCode("");
      setIsEmailVerified(false);
      setIsPhoneVerified(false);
      setSuccess("Student account created. Check your email and phone for verification codes.");
    } catch (apiError) {
      setError(
        apiError?.response?.data?.message ||
          "Unable to complete student signup right now.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEmployerSignup = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    const fullName = `${employerForm.firstName} ${employerForm.lastName}`.trim();

    if (
      !fullName ||
      !employerForm.email ||
      !employerForm.phoneNumber ||
      !employerForm.password
    ) {
      setError("Please fill all required fields.");
      return;
    }

    if (employerForm.password !== employerForm.confirmPassword) {
      setError("Password and confirm password do not match.");
      return;
    }

    try {
      setIsSubmitting(true);
      await adminSignup({
        firstName: String(employerForm.firstName || "").trim(),
        lastName: String(employerForm.lastName || "").trim(),
        fullName,
        email: employerForm.email,
        password: employerForm.password,
        whatsappNumber: employerForm.phoneNumber,
      });
      setVerificationEmail(employerForm.email);
      setEmailCode("");
      setPhoneCode("");
      setIsEmailVerified(false);
      setIsPhoneVerified(false);
      setSuccess("Employer account created. Check your email and phone for verification codes.");
    } catch (apiError) {
      setError(
        apiError?.response?.data?.message ||
          "Unable to complete employer signup right now.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyEmail = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!verificationEmail || !emailCode) {
      setError("Email and email verification code are required.");
      return;
    }

    try {
      setIsSubmitting(true);
      await verifyEmailCode({ email: verificationEmail, code: emailCode });
      setIsEmailVerified(true);
      setSuccess("Email verified successfully.");
    } catch (apiError) {
      setError(
        apiError?.response?.data?.message || "Unable to verify email code.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyPhone = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!verificationEmail || !phoneCode) {
      setError("Email and phone verification code are required.");
      return;
    }

    try {
      setIsSubmitting(true);
      await verifyPhoneCode({ email: verificationEmail, code: phoneCode });
      setIsPhoneVerified(true);
      setSuccess("Phone number verified successfully.");
    } catch (apiError) {
      setError(
        apiError?.response?.data?.message || "Unable to verify phone code.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendCodes = async () => {
    setError("");
    setSuccess("");

    if (!verificationEmail) {
      setError("Email is required to resend verification codes.");
      return;
    }

    try {
      setIsSubmitting(true);
      await Promise.all([
        requestEmailVerification({ email: verificationEmail }),
        requestPhoneVerification({ email: verificationEmail }),
      ]);
      setSuccess("Verification codes resent to your email and phone.");
    } catch (apiError) {
      setError(
        apiError?.response?.data?.message || "Unable to resend verification codes.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="bg-[#0F2A4D] min-h-dvh flex flex-col">
        <div className="bg-[#e0ebf8]">
          <div className="w-full max-w-350 mx-auto px-4 sm:px-6 py-5">
            <header>
              <Link to="/" className="text-3xl font-medium">
                edeco
              </Link>
            </header>
          </div>
        </div>

        <div className="w-full max-w-350 mx-auto px-4 sm:px-6 py-6 sm:py-10 flex-1">
          <div
            className={`flex ${
              verificationEmail ? "justify-center" : "flex-col lg:flex-row lg:justify-between gap-6 lg:gap-10"
            }`}
          >
            {!verificationEmail ? (
              <div className="w-full lg:w-1/2 flex flex-col lg:pr-20 mt-2 lg:mt-28">
              <h2 className="text-3xl text-white font-medium mb-4">
                Identify your account type
              </h2>

              <button
                type="button"
                onClick={() => setAccountType("student")}
                className={`text-left mb-5 p-4 rounded-lg transition ${
                  accountType === "student"
                    ? "bg-white text-black/90"
                    : "bg-[#163a6b] text-white"
                }`}
              >
                <div className="font-medium">Register as Student</div>
                <div className="text-sm">Apply for internships & programs</div>
              </button>

              <button
                type="button"
                onClick={() => setAccountType("employer")}
                className={`text-left mb-8 p-4 rounded-lg transition ${
                  accountType === "employer"
                    ? "bg-white text-black/90"
                    : "bg-[#163a6b] text-white"
                }`}
              >
                <div className="font-medium">Signup as Employer</div>
                <div className="text-sm">Post jobs & hire talent</div>
              </button>

              <hr className="text-gray-400 mb-5" />

              <p className="text-sm text-white mb-4">
                <b>edeco</b> is a career enablement platform connecting students,
                institutions and employers through internships, programs and
                real-world opportunities.
              </p>

              <p className="text-sm text-white">
                Whether you are starting your career or building your team, edeco
                helps you discover the right opportunities faster.
              </p>
              </div>
            ) : null}

            <div
              className={`${
                verificationEmail
                  ? "w-full flex justify-center items-center min-h-[70dvh]"
                  : "w-full lg:w-1/2"
              } rounded-lg`}
            >
              {verificationEmail ? (
                <div className="w-full max-w-xl mx-auto bg-white p-5 sm:p-8 rounded-lg">
                  <h2 className="text-xl text-center font-medium mb-2">
                    Verify your account
                  </h2>
                  <p className="text-sm text-gray-600 text-center mb-6">
                    We sent one-time codes to {verificationEmail}. Verify both email and
                    phone to complete account setup.
                  </p>

                  {error ? <p className="text-sm text-red-600 mb-3">{error}</p> : null}
                  {success ? (
                    <p className="text-sm text-green-700 mb-3">{success}</p>
                  ) : null}

                  <form onSubmit={handleVerifyEmail} className="mb-5">
                    <label className="font-medium text-gray-700 block mb-1.5 text-[15px]">
                      Email verification code
                    </label>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <input
                        type="text"
                        value={emailCode}
                        onChange={(event) => setEmailCode(event.target.value)}
                        className="outline-none border border-gray-300 rounded-lg py-2 px-3 w-full"
                        placeholder="Enter 6-digit code"
                        required
                      />
                      <button
                        type="submit"
                        disabled={isSubmitting || isEmailVerified}
                        className="px-4 rounded-lg bg-blue-600 text-white text-sm disabled:opacity-60"
                      >
                        {isEmailVerified ? "Verified" : "Verify"}
                      </button>
                    </div>
                  </form>

                  <form onSubmit={handleVerifyPhone} className="mb-6">
                    <label className="font-medium text-gray-700 block mb-1.5 text-[15px]">
                      Phone verification code
                    </label>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <input
                        type="text"
                        value={phoneCode}
                        onChange={(event) => setPhoneCode(event.target.value)}
                        className="outline-none border border-gray-300 rounded-lg py-2 px-3 w-full"
                        placeholder="Enter 6-digit code"
                        required
                      />
                      <button
                        type="submit"
                        disabled={isSubmitting || isPhoneVerified}
                        className="px-4 rounded-lg bg-blue-600 text-white text-sm disabled:opacity-60"
                      >
                        {isPhoneVerified ? "Verified" : "Verify"}
                      </button>
                    </div>
                  </form>

                  <button
                    type="button"
                    onClick={handleResendCodes}
                    disabled={isSubmitting}
                    className="text-sm text-blue-600 mb-6"
                  >
                    Resend codes
                  </button>

                  <div className="flex justify-center py-3 rounded-lg bg-green-700 text-white text-sm font-medium mb-5">
                    <button
                      type="button"
                      onClick={() => navigate("/login")}
                      disabled={!isEmailVerified || !isPhoneVerified}
                      className="disabled:opacity-60"
                    >
                      Continue to Login
                    </button>
                  </div>
                </div>
              ) : accountType === "student" ? (
                <form
                  onSubmit={handleStudentSignup}
                  className="w-full max-w-xl mx-auto bg-white p-5 sm:p-8 rounded-lg"
                >
                  <h2 className="text-xl text-center font-medium mb-6">
                    Student Registration Form
                  </h2>

                  {error ? <p className="text-sm text-red-600 mb-3">{error}</p> : null}
                  {success ? <p className="text-sm text-green-600 mb-3">{success}</p> : null}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 mb-6">
                    <div>
                      <label className="font-medium text-gray-700 block mb-1.5 text-[15px]">
                        First Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={studentForm.firstName}
                        onChange={handleStudentChange}
                        className="outline-none border border-gray-300 rounded-lg py-2 px-3 w-full"
                        required
                      />
                    </div>
                    <div>
                      <label className="font-medium text-gray-700 block mb-1.5 text-[15px]">
                        Last Name 
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={studentForm.lastName}
                        onChange={handleStudentChange}
                        className="outline-none border border-gray-300 rounded-lg py-2 px-3 w-full"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 mb-6">
                    <div>
                      <label className="font-medium text-gray-700 block mb-1.5 text-[15px]">
                        Latest Qualification <span className="text-red-500">*</span>
                      </label>
                      <select className="outline-none border border-gray-300 rounded-lg py-2 px-3 w-full">
                        <option value="">Select Course</option>
                        <option value="">Bachelor's</option>
                        <option value="">Master's</option>
                        <option value="">Diploma</option>
                        <option value="">Phd</option>
                      </select>
                    </div>
                    <div>
                      <label className="font-medium text-gray-700 block mb-1.5 text-[15px]">
                        Year of Passing <span className="text-red-500">*</span>
                      </label>
                      <select className="outline-none border border-gray-300 rounded-lg py-2 px-3 w-full">
                        <option value="">Select Year</option>
                        <option value="">2021</option>
                        <option value="">2022</option>
                        <option value="">2023</option>
                        <option value="">2024</option>
                        <option value="">2025</option>
                        <option value="">2026</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 mb-6">
                    <div>
                      <label className="font-medium text-gray-700 block mb-1.5 text-[15px]">
                        College / Institute Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Enter institute name"
                        className="outline-none border border-gray-300 rounded-lg py-2 px-3 w-full"
                      />
                    </div>
                    <div>
                      <label className="font-medium text-gray-700 block mb-1.5 text-[15px]">
                        Location <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="city,state"
                        className="outline-none border border-gray-300 rounded-lg py-2 px-3 w-full"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 mb-4">
                    <div>
                      <label className="font-medium text-gray-700 block mb-1.5 text-[15px]">
                        Mobile Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        name="mobileNumber"
                        value={studentForm.mobileNumber}
                        onChange={handleStudentChange}
                        placeholder="10-digit number"
                        className="outline-none border border-gray-300 rounded-lg py-2 px-3 w-full"
                        required
                      />
                    </div>
                    <div>
                      <label className="font-medium text-gray-700 block mb-1.5 text-[15px]">
                        Email ID <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={studentForm.email}
                        onChange={handleStudentChange}
                        className="outline-none border border-gray-300 rounded-lg py-2 px-3 w-full"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 mb-4">
                    <div>
                      <label className="font-medium text-gray-700 block mb-1.5 text-[15px]">
                        Password <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type={
                            showPassword.studentPassword ? "text" : "password"
                          }
                          name="password"
                          value={studentForm.password}
                          onChange={handleStudentChange}
                          className="outline-none border border-gray-300 rounded-lg py-2 px-3 pr-10 w-full"
                          required
                        />
                        <button
                          type="button"
                          onClick={() =>
                            togglePasswordVisibility("studentPassword")
                          }
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                          aria-label={
                            showPassword.studentPassword
                              ? "Hide password"
                              : "Show password"
                          }
                        >
                          {showPassword.studentPassword ? (
                            <FiEyeOff size={18} />
                          ) : (
                            <FiEye size={18} />
                          )}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="font-medium text-gray-700 block mb-1.5 text-[15px]">
                        Confirm Password <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type={
                            showPassword.studentConfirmPassword
                              ? "text"
                              : "password"
                          }
                          name="confirmPassword"
                          value={studentForm.confirmPassword}
                          onChange={handleStudentChange}
                          className="outline-none border border-gray-300 rounded-lg py-2 px-3 pr-10 w-full"
                          required
                        />
                        <button
                          type="button"
                          onClick={() =>
                            togglePasswordVisibility("studentConfirmPassword")
                          }
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                          aria-label={
                            showPassword.studentConfirmPassword
                              ? "Hide confirm password"
                              : "Show confirm password"
                          }
                        >
                          {showPassword.studentConfirmPassword ? (
                            <FiEyeOff size={18} />
                          ) : (
                            <FiEye size={18} />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-6">
                    <input type="checkbox" />
                    <span className="text-sm  text-gray-600">
                      I would like to receive important updates and notifications
                      via WhatsApp.
                    </span>
                  </div>

                  <label className="font-medium text-gray-700 block mb-1.5 text-[15px]">
                    Upload Resume <span className="text-red-500">*</span>
                  </label>

                  <input
                    id="student-resume-upload"
                    type="file"
                    accept=".pdf"
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      setStudentResumeName(file ? file.name : "");
                    }}
                    className="sr-only"
                  />

                  <label
                    htmlFor="student-resume-upload"
                    className="w-full border border-dashed border-gray-300 rounded-lg px-4 py-3 mb-2 text-gray-600 flex items-center gap-3 cursor-pointer hover:border-blue-400 hover:text-blue-600 transition"
                  >
                    <FiUpload className="text-lg" />
                    <span className="text-base">Upload resume (PDF Only)</span>
                  </label>

                  {studentResumeName ? (
                    <p className="text-xs text-gray-500 mb-6">Selected: {studentResumeName}</p>
                  ) : (
                    <div className="mb-6" />
                  )}

                  <div className="flex justify-center py-3 rounded-lg bg-blue-600 text-white text-sm font-medium mb-5">
                    <button type="submit" disabled={isSubmitting}>
                      {isSubmitting
                        ? "Submitting..."
                        : "Submit Student Registration"}
                    </button>
                  </div>

                  <p className="text-sm text-center">
                    Already have an account?{" "}
                    <Link to="/login" className="text-blue-600">
                      Log in
                    </Link>
                  </p>
                </form>
              ) : (
                <form
                  onSubmit={handleEmployerSignup}
                  className="w-full max-w-xl mx-auto bg-white p-5 sm:p-8 rounded-lg"
                >
                  <h2 className="text-xl text-center font-medium mb-6">
                    Employer Registration Form
                  </h2>

                  {error ? <p className="text-sm text-red-600 mb-3">{error}</p> : null}
                  {success ? <p className="text-sm text-green-600 mb-3">{success}</p> : null}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 mb-6">
                    <div>
                      <label className="font-medium text-gray-700 block mb-1.5 text-[15px]">
                        First Name<span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={employerForm.firstName}
                        onChange={handleEmployerChange}
                        className="outline-none border border-gray-300 rounded-lg py-2 px-3 w-full"
                        required
                      />
                    </div>
                    <div>
                      <label className="font-medium text-gray-700 block mb-1.5 text-[15px]">
                        Last Name 
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={employerForm.lastName}
                        onChange={handleEmployerChange}
                        className="outline-none border border-gray-300 rounded-lg py-2 px-3 w-full"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 mb-6">
                    <div>
                      <label className="font-medium text-gray-700 block mb-1.5 text-[15px]">
                        Work Email  <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={employerForm.email}
                        onChange={handleEmployerChange}
                        placeholder="name@company.com"
                        className="outline-none border border-gray-300 rounded-lg py-2 px-3 w-full"
                        required
                      />
                    </div>
                    <div>
                      <label className="font-medium text-gray-700 block mb-1.5 text-[15px]">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="phoneNumber"
                        value={employerForm.phoneNumber}
                        onChange={handleEmployerChange}
                        placeholder="10 digit number"
                        className="outline-none border border-gray-300 rounded-lg py-2 px-3 w-full"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 mb-6">
                    <div>
                      <label className="font-medium text-gray-700 block mb-1.5 text-[15px]">
                       Organisation Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        placeholder="Enter organization name"
                        
                        className="outline-none border border-gray-300 rounded-lg py-2 px-3 w-full"
                      />
                    </div>
                    <div>
                      <label className="font-medium text-gray-700 block mb-1.5 text-[15px]">
                        Organisation Type <span className="text-red-500">*</span>
                      </label>
                     <select name="" id="" className="outline-none border border-gray-300 rounded-lg py-2 px-3 w-full">
                      <option value="">Select organization type</option>
                      <option value="">Startup</option>
                      <option value="">Enterprice</option>
                      <option value="">Ed Tech</option>
                      <option value="">NGO</option>
                      <option value="">Other</option>
                     </select>
                    </div>
                  </div>

                  <label className="font-medium text-gray-700 block mb-1.5 text-[15px]">
                        Username <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        
                        className="outline-none border border-gray-300 rounded-lg py-2 px-3 w-full mb-6"
                      />

                 

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 mb-4">
                    <div>
                      <label className="font-medium text-gray-700 block mb-1.5 text-[15px]">
                        Password <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type={
                            showPassword.employerPassword ? "text" : "password"
                          }
                          name="password"
                          value={employerForm.password}
                          onChange={handleEmployerChange}
                          className="outline-none border border-gray-300 rounded-lg py-2 px-3 pr-10 w-full"
                          required
                        />
                        <button
                          type="button"
                          onClick={() =>
                            togglePasswordVisibility("employerPassword")
                          }
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                          aria-label={
                            showPassword.employerPassword
                              ? "Hide password"
                              : "Show password"
                          }
                        >
                          {showPassword.employerPassword ? (
                            <FiEyeOff size={18} />
                          ) : (
                            <FiEye size={18} />
                          )}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="font-medium text-gray-700 block mb-1.5 text-[15px]">
                        Confirm Password <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type={
                            showPassword.employerConfirmPassword
                              ? "text"
                              : "password"
                          }
                          name="confirmPassword"
                          value={employerForm.confirmPassword}
                          onChange={handleEmployerChange}
                          className="outline-none border border-gray-300 rounded-lg py-2 px-3 pr-10 w-full"
                          required
                        />
                        <button
                          type="button"
                          onClick={() =>
                            togglePasswordVisibility("employerConfirmPassword")
                          }
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                          aria-label={
                            showPassword.employerConfirmPassword
                              ? "Hide confirm password"
                              : "Show confirm password"
                          }
                        >
                          {showPassword.employerConfirmPassword ? (
                            <FiEyeOff size={18} />
                          ) : (
                            <FiEye size={18} />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-6">
                    <input type="checkbox" />
                    <span className="text-sm text-gray-600 font-medium
                    ">
                      I agree to edeco <Link to='' className="text-blue-600">Terms & Conditions</Link> and <Link to='' className="text-blue-600">Privacy Policy</Link>
                    </span>
                  </div>

                  <div className="flex justify-center py-3 rounded-lg bg-blue-600 text-white text-sm font-medium mb-5">
                    <button type="submit" disabled={isSubmitting}>
                      {isSubmitting
                        ? "Submitting..."
                        : "Submit Employer Registration"}
                    </button>
                  </div>

                  <p className="text-sm text-center">
                    Already have an account?{" "}
                    <Link to="/login" className="text-blue-600">
                      Log in
                    </Link>
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Signup;
