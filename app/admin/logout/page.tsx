"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    const logout = async () => {
      try {
        localStorage.removeItem("admin_token");

        // Optional: Call logout API to clear server-side session
        await fetch("/api/admin/logout", {
          method: "POST",
        });
      } catch (error) {
        console.error("Logout error:", error);
      } finally {
        router.push("/admin/login");
      }
    };

    logout();
  }, [router]);

  return (
    <div className="admin-loading">
      <div className="admin-spinner"></div>
      <p className="admin-spinner-text">Logging out...</p>
    </div>
  );
}
