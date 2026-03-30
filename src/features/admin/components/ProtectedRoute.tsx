import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export function ProtectedRoute({ children, requireSuperAdmin = false }: { children: ReactNode; requireSuperAdmin?: boolean }) {
  const { user, role, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 border-2 border-foreground/20 border-t-foreground rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) return <Navigate to="/auth" replace />;

  if (requireSuperAdmin && role !== "superadmin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="font-display text-2xl font-bold mb-2">Access Denied</h1>
          <p className="text-sm text-muted-foreground">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
