import { useState, useCallback, createContext, useContext, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface CustomerAdminSession {
  token: string;
  admin: { id: string; username: string; display_name: string | null };
  invitation: { id: string; title: string; celebrant_name: string | null; event_type: string; event_date: string | null };
}

interface CustomerAdminContextType {
  session: CustomerAdminSession | null;
  login: (slug: string, username: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  error: string | null;
}

const CustomerAdminContext = createContext<CustomerAdminContextType | null>(null);

export function CustomerAdminProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<CustomerAdminSession | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const saved = sessionStorage.getItem("customer_admin_session");
    if (saved) {
      try { setSession(JSON.parse(saved)); } catch {}
    }
  }, []);

  const login = useCallback(async (slug: string, username: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      // Hash password client-side with SHA-256 to match how it was stored
      const encoder = new TextEncoder();
      const data = encoder.encode(password);
      const hashBuffer = await crypto.subtle.digest("SHA-256", data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const password_hash = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");

      const { data: result, error: fnError } = await supabase.functions.invoke("customer-admin-login", {
        body: { username, password_hash, invitation_slug: slug },
      });

      if (fnError || result?.error) throw new Error(result?.error || "Login failed");

      const sess: CustomerAdminSession = result;
      setSession(sess);
      sessionStorage.setItem("customer_admin_session", JSON.stringify(sess));
    } catch (e: any) {
      setError(e.message || "Login failed");
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setSession(null);
    sessionStorage.removeItem("customer_admin_session");
  }, []);

  return (
    <CustomerAdminContext.Provider value={{ session, login, logout, loading, error }}>
      {children}
    </CustomerAdminContext.Provider>
  );
}

export function useCustomerAdmin() {
  const ctx = useContext(CustomerAdminContext);
  if (!ctx) throw new Error("useCustomerAdmin must be used within CustomerAdminProvider");
  return ctx;
}
