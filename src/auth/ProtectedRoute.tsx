import { Navigate, useLocation } from "react-router-dom";

import { homePathForRole, useAuth, type UserRole } from "@/auth/AuthProvider";

type ProtectedRouteProps = {
  children: React.ReactNode;
  /** If set, user must have one of these roles. */
  roles?: UserRole[];
};

export function ProtectedRoute({ children, roles }: ProtectedRouteProps) {
  const { user, profile, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-muted-foreground">
        Loading…
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (roles && profile && !roles.includes(profile.role)) {
    return <Navigate to={homePathForRole(profile.role)} replace />;
  }

  if (roles && !profile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-muted-foreground">
        Loading profile…
      </div>
    );
  }

  return <>{children}</>;
}
