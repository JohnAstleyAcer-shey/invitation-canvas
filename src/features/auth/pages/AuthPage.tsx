import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, CheckCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ThemeToggle } from "@/components/ThemeToggle";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import logoDark from "@/assets/logo-dark.png";
import logoLight from "@/assets/logo-light.png";

function getPasswordStrength(password: string) {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return score;
}

const strengthLabels = ["Weak", "Fair", "Good", "Strong"];
const strengthColors = ["bg-destructive", "bg-destructive/60", "bg-muted-foreground", "bg-foreground"];

export default function AuthPage() {
  const [tab, setTab] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);
  const navigate = useNavigate();

  const strength = getPasswordStrength(password);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      toast.error(error.message);
    } else {
      navigate("/admin");
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (strength < 2) {
      toast.error("Please use a stronger password");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: window.location.origin,
      },
    });
    setLoading(false);
    if (error) {
      toast.error(error.message);
    } else {
      setSignupSuccess(true);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" />
          <span className="text-sm">Back</span>
        </Link>
        <ThemeToggle />
      </div>

      <div className="flex-1 flex items-center justify-center px-4 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-sm"
        >
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-3">
              <img src={logoDark} alt="" className="hidden dark:block h-10 w-10" />
              <img src={logoLight} alt="" className="block dark:hidden h-10 w-10" />
            </div>
            <h1 className="font-display text-2xl font-bold">LynxInvitation</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {tab === "login" ? "Welcome back" : "Create your account"}
            </p>
          </div>

          <AnimatePresence mode="wait">
            {signupSuccess ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center glass-card p-8"
              >
                <CheckCircle className="h-12 w-12 mx-auto mb-4 text-foreground" />
                <h2 className="font-display text-xl font-bold mb-2">Check Your Email</h2>
                <p className="text-sm text-muted-foreground mb-6">
                  We sent a verification link to <strong>{email}</strong>. Please verify your email before signing in.
                </p>
                <Button
                  variant="outline"
                  className="rounded-full"
                  onClick={() => { setSignupSuccess(false); setTab("login"); }}
                >
                  Back to Login
                </Button>
              </motion.div>
            ) : (
              <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                {/* Tabs */}
                <div className="flex rounded-full bg-secondary p-1 mb-6">
                  {(["login", "signup"] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setTab(t)}
                      className={`flex-1 text-sm font-medium py-2 rounded-full transition-all ${
                        tab === t ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                      }`}
                    >
                      {t === "login" ? "Sign In" : "Sign Up"}
                    </button>
                  ))}
                </div>

                <form onSubmit={tab === "login" ? handleLogin : handleSignup} className="space-y-4">
                  {tab === "signup" && (
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-sm">Full Name</Label>
                      <Input
                        id="name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="John Doe"
                        required
                        className="rounded-xl"
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                      className="rounded-xl"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        minLength={6}
                        className="rounded-xl pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>

                    {tab === "signup" && password.length > 0 && (
                      <div className="space-y-1.5">
                        <div className="flex gap-1">
                          {[0, 1, 2, 3].map((i) => (
                            <div
                              key={i}
                              className={`h-1 flex-1 rounded-full transition-colors ${
                                i < strength ? strengthColors[strength - 1] : "bg-border"
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {strength > 0 ? strengthLabels[strength - 1] : "Too short"}
                        </p>
                      </div>
                    )}
                  </div>

                  <Button type="submit" disabled={loading} className="w-full rounded-full">
                    {loading ? "Please wait..." : tab === "login" ? "Sign In" : "Create Account"}
                  </Button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
