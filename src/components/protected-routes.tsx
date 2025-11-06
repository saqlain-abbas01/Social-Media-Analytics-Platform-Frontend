// src/components/ProtectedRoute.tsx
import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
import { useEffect, useState } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, initialize } = useAuthStore();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      await initialize();
      setLoaded(true);
    })();
  }, []);

  console.log("isAuthenticated", isAuthenticated);

  if (!loaded)
    return (
      <div className="w-full h-screen flex justify-center items-center">
        Loading...
      </div>
    ); // You can use a spinner

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
