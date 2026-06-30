import { Navigate } from "react-router";
import { useEffect, useState } from "react";
import { verifyAdminAccess } from "../../services/authService";

interface Props {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: Props) {

  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {

    const checkAuth = async () => {

      const token = localStorage.getItem("token") || sessionStorage.getItem("token");

      if (!token) {
        setAuthorized(false);
        setLoading(false);
        return;
      }

      try {

        await verifyAdminAccess();

        setAuthorized(true);

      } catch {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setAuthorized(false);
      }

      setLoading(false);
    };

    checkAuth();

  }, []);

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (!authorized) {
    return <Navigate to="/signin" replace />;
  }

  return <>{children}</>;
}
