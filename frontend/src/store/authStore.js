import { useMemo, useState } from "react";
import { useOpportunities } from "../context/OpportunitiesContext";

export const getAuthRedirectPath = (role) => {
  if (role === "super_admin") {
    return "/super-admin-dashboard";
  }

  if (role === "admin") {
    return "/admin-dashboard";
  }

  return "/";
};

const useAuthStore = () => {
  const {
    user,
    signup: createAccount,
    login: signIn,
    logout,
  } = useOpportunities();
  const [isLoading, setIsLoading] = useState(false);

  const signup = async ({ fullName, email, password, whatsappNumber }) => {
    setIsLoading(true);

    try {
      const result = await createAccount({
        fullName,
        email,
        password,
        whatsappNumber,
      });

      return {
        success: true,
        message: "Account created successfully.",
        ...result,
      };
    } catch (error) {
      return {
        success: false,
        message:
          error?.response?.data?.message || "Signup failed. Please try again.",
      };
    } finally {
      setIsLoading(false);
    }
  };

  const login = async ({ email, password }) => {
    setIsLoading(true);

    try {
      const result = await signIn({ email, password });

      return {
        success: true,
        message: "Signed in successfully.",
        ...result,
      };
    } catch (error) {
      return {
        success: false,
        message:
          error?.response?.data?.message || "Login failed. Please try again.",
      };
    } finally {
      setIsLoading(false);
    }
  };

  return useMemo(
    () => ({
      user,
      isLoading,
      isAuthenticated: Boolean(user),
      signup,
      login,
      logout,
    }),
    [isLoading, login, logout, signup, user],
  );
};

export default useAuthStore;
