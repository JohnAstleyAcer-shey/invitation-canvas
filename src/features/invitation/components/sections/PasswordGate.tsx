import { useState } from "react";
import { SectionWrapper } from "./SectionWrapper";
import { Lock, Loader2 } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type Invitation = Tables<"invitations">;

export function PasswordGate({ invitation, onUnlock }: { invitation: Invitation; onUnlock: () => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(false);
    // Hash with SHA-256 and compare
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hash = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");

    if (hash === invitation.password_hash) {
      onUnlock();
    } else {
      setError(true);
    }
    setLoading(false);
  };

  return (
    <div className="h-screen w-full flex items-center justify-center" style={{ background: "var(--inv-bg-value, #ffffff)" }}>
      <div className="w-full max-w-sm mx-auto px-6 text-center space-y-6">
        <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center" style={{ background: "var(--inv-primary)", color: "var(--inv-secondary)" }}>
          <Lock className="w-7 h-7" />
        </div>
        <h1 className="text-2xl font-bold" style={{ fontFamily: "var(--inv-font-title)", color: "var(--inv-text)" }}>
          This invitation is protected
        </h1>
        <p className="text-sm" style={{ color: "var(--inv-text-secondary)" }}>
          Please enter the password to view this invitation.
        </p>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="password"
            value={password}
            onChange={e => { setPassword(e.target.value); setError(false); }}
            placeholder="Enter password"
            className="w-full px-4 py-3 rounded-lg border text-center"
            style={{ borderColor: error ? "#ef4444" : "var(--inv-accent)", color: "var(--inv-text)", background: "transparent" }}
          />
          {error && <p className="text-sm text-red-500">Incorrect password. Please try again.</p>}
          <button
            type="submit"
            disabled={loading || !password}
            className="w-full px-6 py-3 rounded-lg font-medium disabled:opacity-50"
            style={{ background: "var(--inv-primary)", color: "var(--inv-secondary)" }}
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "Unlock Invitation"}
          </button>
        </form>
      </div>
    </div>
  );
}
