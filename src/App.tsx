import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ErrorBoundary from "@/components/error-boundary";
import { LoginPage } from "@/pages/login";
import { RegisterPage } from "@/pages/register";
import { useAuthStore } from "./store/useAuthStore";
import { ProtectedRoute } from "@/components/protected-routes";
import { ProtectedLayout } from "./components/shared/protected-layout";

const DashboardPage = lazy(() =>
  import("@/pages/dashboard").then((m) => ({ default: m.DashboardPage }))
);
const PostsManagementPage = lazy(() =>
  import("@/pages/post-management").then((m) => ({
    default: m.PostsManagementPage,
  }))
);
const AnalyticsInsightsPage = lazy(() =>
  import("@/pages/analytics-insights").then((m) => ({
    default: m.AnalyticsInsightsPage,
  }))
);
const PostSchedulingPage = lazy(() =>
  import("@/pages/post-scheduling").then((m) => ({
    default: m.PostSchedulingPage,
  }))
);

function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}

export default function App() {
  const { isAuthenticated } = useAuthStore();

  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          {/* Public Auth Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected Routes */}
          <Route
            element={
              <ProtectedRoute>
                <ProtectedLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardPage />} />
            <Route path="posts" element={<PostsManagementPage />} />
            <Route path="analytics" element={<AnalyticsInsightsPage />} />
            <Route path="schedule" element={<PostSchedulingPage />} />
          </Route>

          {/* Catch All */}
          <Route
            path="*"
            element={<Navigate to={isAuthenticated ? "/" : "/login"} replace />}
          />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}
