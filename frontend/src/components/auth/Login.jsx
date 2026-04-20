import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useOpportunities } from "../../context/OpportunitiesContext";
import { getAuthRedirectPath } from "../../store/authStore";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useOpportunities();
  
  const [form, setForm] = useState({ email: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!form.email || !form.password) {
      setError("Email and password are required.");
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await login(form);

      const redirectTo = getAuthRedirectPath(response?.user?.role);
      navigate(redirectTo);
    } catch (apiError) {
      setError(
        apiError?.response?.data?.message || "Unable to sign in right now.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#F8FAFC]">
      <div className="bg-[#e0ebf8]">
        <div className="w-full max-w-350 mx-auto px-4 sm:px-6 py-5">
          <header>
            <Link to="/" className="text-3xl font-medium">
              edeco
            </Link>
          </header>
        </div>
      </div>

      <div className="w-full max-w-350 mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-center min-h-[calc(100dvh-88px)] py-8 sm:py-10">
          <form onSubmit={handleSubmit} className="bg-white rounded-xl p-5 w-full max-w-md">
            <h2 className="text-center text-2xl font-medium mb-6">Sign In</h2>

            <label
              htmlFor=""
              className="mb-1.5 block text-gray-600 font-medium"
            >
              Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="outline-none rounded-lg px-3 border border-black/30 w-full py-2 mb-5"
              required
            />

            <label
              htmlFor=""
              className="mb-1.5 block text-gray-600 font-medium"
            >
              Password
            </label>
            <div className="relative mb-2">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                className="outline-none rounded-lg border border-black/30 w-full py-2 px-3 pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>

            <Link
              to="/forget-password"
              className="flex justify-end mb-5 text-blue-600 text-sm font-medium"
            >
              Forgot Password ?
            </Link>

            {error ? <p className="text-sm text-red-600 mb-3">{error}</p> : null}

            <div className="flex justify-center rounded-lg bg-[#FBBF24] mb-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="py-2 font-medium disabled:opacity-70"
              >
                {isSubmitting ? "Signing in..." : "Sign In"}
              </button>
            </div>

            <p className="text-sm text-center">
              Don’t have an account?{" "}
              <Link to="/signup" className="text-blue-600">
                Sign up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
