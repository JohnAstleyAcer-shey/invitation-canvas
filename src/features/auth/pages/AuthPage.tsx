import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, CheckCircle, ArrowLeft, Mail, Lock, User, Shield, Star, Zap, Users } from "lucide-react";
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
const strengthColors = ["bg-destructive", "bg-destructive/60", "bg-muted-foreground", "bg-primary"];

const benefits = [
  { icon: Zap, text: "Create in under 5 minutes" },
  { icon: Users, text: "Manage unlimited guests" },
  { icon: Star, text: "Premium templates included" },
  { icon: Shield, text: "Secure & private" },
];

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
    <div className="min-h-[100dvh] bg-background flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" />
          <span className="text-sm font-medium">Back</span>
        </Link>
        <ThemeToggle />
      </div>

      <div className="flex-1 flex items-center justify-center px-4 pb-16">
        <div className="w-full max-w-md">
          {/* Decorative background */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary/3 blur-3xl" />
            <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-accent/20 blur-3xl" />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            {/* Logo */}
            <div className="text-center mb-8">
              <div className="flex justify-center mb-3">
                <motion.div
                  whileHover={{ scale: 1.05, rotate: 3 }}
                  className="w-14 h-14 rounded-2xl bg-card border border-border flex items-center justify-center shadow-lg"
                >
                  <img src={logoDark} alt="" className="hidden dark:block h-8 w-8" />
                  <img src={logoLight} alt="" className="block dark:hidden h-8 w-8" />
                </motion.div>
              </div>
              <h1 className="font-display text-2xl font-bold">LynxInvitation</h1>
              <p className="text-sm text-muted-foreground mt-1">
                {tab === "login" ? "Welcome back! Sign in to continue." : "Create your account to get started."}
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
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                    className="w-16 h-16 rounded-full bg-primary/10 mx-auto mb-4 flex items-center justify-center"
                  >
                    <CheckCircle className="h-8 w-8 text-foreground" />
                  </motion.div>
                  <h2 className="font-display text-xl font-bold mb-2">Check Your Email</h2>
                  <p className="text-sm text-muted-foreground mb-6">
                    We sent a verification link to <strong className="text-foreground">{email}</strong>. Please verify your email before signing in.
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
                        className={`relative flex-1 text-sm font-medium py-2.5 rounded-full transition-all ${
                          tab === t ? "text-primary-foreground" : "text-muted-foreground"
                        }`}
                      >
                        {tab === t && (
                          <motion.div
                            layoutId="auth-tab"
                            className="absolute inset-0 bg-primary rounded-full"
                            transition={{ type: "spring", stiffness: 400, damping: 30 }}
                          />
                        )}
                        <span className="relative z-10">{t === "login" ? "Sign In" : "Sign Up"}</span>
                      </button>
                    ))}
                  </div>

                  <form onSubmit={tab === "login" ? handleLogin : handleSignup} className="space-y-4">
                    <AnimatePresence mode="wait">
                      {tab === "signup" && (
                        <motion.div
                          key="name-field"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="space-y-2 overflow-hidden"
                        >
                          <Label htmlFor="name" className="text-sm">Full Name</Label>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="name"
                              value={fullName}
                              onChange={(e) => setFullName(e.target.value)}
                              placeholder="John Doe"
                              required
                              className="rounded-xl pl-10"
                            />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="you@example.com"
                          required
                          className="rounded-xl pl-10"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-sm">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••"
                          required
                          minLength={6}
                          className="rounded-xl pl-10 pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>

                      {tab === "signup" && password.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="space-y-1.5"
                        >
                          <div className="flex gap-1">
                            {[0, 1, 2, 3].map((i) => (
                              <motion.div
                                key={i}
                                initial={{ scaleX: 0 }}
                                animate={{ scaleX: 1 }}
                                className={`h-1 flex-1 rounded-full transition-colors origin-left ${
                                  i < strength ? strengthColors[strength - 1] : "bg-border"
                                }`}
                              />
                            ))}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {strength > 0 ? strengthLabels[strength - 1] : "Too short — use 8+ characters"}
                          </p>
                        </motion.div>
                      )}
                    </div>

                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full rounded-full shadow-md hover:shadow-lg transition-shadow"
                      size="lg"
                    >
                      {loading ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full"
                        />
                      ) : (
                        tab === "login" ? "Sign In" : "Create Account"
                      )}
                    </Button>
                  </form>

                  {/* Benefits for signup */}
                  {tab === "signup" && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="mt-6 grid grid-cols-2 gap-2"
                    >
                      {benefits.map((b, i) => (
                        <motion.div
                          key={b.text}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 + i * 0.08 }}
                          className="flex items-center gap-2 text-xs text-muted-foreground p-2 rounded-lg bg-accent/30"
                        >
                          <b.icon className="h-3.5 w-3.5 text-foreground shrink-0" />
                          {b.text}
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
