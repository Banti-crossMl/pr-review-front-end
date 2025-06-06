// hooks/useAuthRedirect.ts
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export const useAuthRedirect = ({
  redirectIfAuthenticated = false,
  redirectTo = "/dashboard",
}: {
  redirectIfAuthenticated?: boolean;
  redirectTo?: string;
}) => {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const token = localStorage.getItem("token");

    // ✅ Redirect if user is logged in and they shouldn't access this page (like /login)
    if (redirectIfAuthenticated && token) {
      router.replace(redirectTo);
    }

    // ✅ Redirect if user is not logged in and tries to access protected page
    if (!redirectIfAuthenticated && !token) {
      router.replace("/login");
    }

    // ✅ If no redirect needed, show the page
    setIsChecking(false);
  }, [redirectIfAuthenticated, redirectTo, router]);

  return { isChecking };
};
