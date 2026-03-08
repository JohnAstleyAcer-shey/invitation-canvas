import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useCustomerAdmin } from "../hooks/useCustomerAdmin";
import { Loader2, LogIn, PartyPopper, Eye, EyeOff, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function CustomerLoginPage() {
  const { login, loading, error } = useCustomerAdmin();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [slug, setSlug] = useState(searchParams.get("event") || "");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(slug, username, password);
      navigate("/customer-admin/dashboard");
    } catch {}
  };

  return (
    <div className="min-h-[100dvh] flex items-center justify-center bg-background px-4 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/4 -right-1/4 w-[600px] h-[600px] rounded-full bg-primary/[0.03] blur-3xl" />
        <div className="absolute -bottom-1/4 -left-1/4 w-[500px] h-[500px] rounded-full bg-accent/30 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md relative z-10"
      >
        <div className="glass-card p-8 space-y-6">
          {/* Header */}
          <div className="text-center space-y-3">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.15, type: "spring", stiffness: 200 }}
              className="w-16 h-16 mx-auto rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center"
            >
              <PartyPopper className="w-7 h-7 text-primary" />
            </motion.div>
            <div>
              <h1 className="text-2xl font-bold font-display text-foreground">Customer Portal</h1>
              <p className="text-sm text-muted-foreground mt-1">Sign in to manage your event invitations</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Event Code / Slug</Label>
              <div className="relative">
                <Sparkles className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  value={slug}
                  onChange={e => setSlug(e.target.value)}
                  required
                  placeholder="e.g. julias-debut"
                  className="pl-10 h-11 rounded-xl"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Username</Label>
              <div className="relative">
                <LogIn className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  required
                  className="pl-10 h-11 rounded-xl"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Password</Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  className="h-11 rounded-xl pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded-lg bg-destructive/10 border border-destructive/20"
              >
                <p className="text-sm text-destructive font-medium">{error}</p>
              </motion.div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-xl font-semibold"
              size="lg"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Sign In</>}
            </Button>
          </form>

          <p className="text-center text-xs text-muted-foreground">
            Ask your event organizer for login credentials
          </p>
        </div>
      </motion.div>
    </div>
  );
}
