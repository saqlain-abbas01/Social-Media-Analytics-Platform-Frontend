import { Outlet } from "react-router-dom";
import { NavigationHeader } from "@/components/shared/navigation-header";

export function ProtectedLayout() {
  return (
    <div className="min-h-screen bg-background">
      <NavigationHeader />
      <main>
        <Outlet />
      </main>
    </div>
  );
}
