import { useEffect } from "react";

export default function OAuthSuccess() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const token = params.get("token");
    const role = params.get("role");
    const userId = params.get("userId");

    if (token) {
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("userId", userId);

      window.location.href = "/dashboard";
    }
  }, []);

  return <p className="p-6">Signing you in with Google...</p>;
}
