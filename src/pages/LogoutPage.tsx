import { useEffect } from "react";
import { Navigate } from "react-router-dom";

import { useAuth } from "@/auth/AuthProvider";

export function LogoutPage() {
  const { signOut, user, loading } = useAuth();

  useEffect(() => {
    void signOut();
  }, [signOut]);

  if (loading || user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-muted-foreground">
        Signing out…
      </div>
    );
  }

  return <Navigate to="/" replace />;
}
