import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, Camera, Save, Shield, Bell, Palette, LogOut, ChevronRight, Lock, Smartphone, Globe } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "../hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { uploadFile } from "../hooks/useInvitationData";
import { toast } from "sonner";
import { SEOHead } from "@/components/SEOHead";
import { useNavigate } from "react-router-dom";

function SettingsSection({ icon: Icon, title, description, children, delay = 0 }: {
  icon: React.ElementType; title: string; description?: string; children: React.ReactNode; delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, type: "spring", stiffness: 300, damping: 25 }}
      className="rounded-2xl border border-border bg-card p-5 sm:p-6 space-y-5"
    >
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-accent flex items-center justify-center shrink-0">
          <Icon className="h-4 w-4 text-muted-foreground" />
        </div>
        <div>
          <h3 className="font-display font-bold text-sm">{title}</h3>
          {description && <p className="text-[10px] text-muted-foreground">{description}</p>}
        </div>
      </div>
      {children}
    </motion.div>
  );
}

function SettingsRow({ label, description, children }: { label: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-3 border-b border-border/50 last:border-b-0">
      <div className="min-w-0">
        <p className="text-sm font-medium">{label}</p>
        {description && <p className="text-xs text-muted-foreground mt-0.5">{description}</p>}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

export default function SettingsPage() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState(profile?.full_name || "");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile?.full_name) setFullName(profile.full_name);
  }, [profile?.full_name]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({ full_name: fullName })
      .eq("user_id", user.id);
    setSaving(false);
    if (error) toast.error(error.message);
    else toast.success("Profile updated");
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    try {
      const url = await uploadFile("invitation-assets", file, `avatars/${user.id}`);
      await supabase.from("profiles").update({ avatar_url: url }).eq("user_id", user.id);
      toast.success("Avatar updated");
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 w-full">
      <SEOHead title="Settings" />
      <div>
        <motion.h1 initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="font-display text-2xl sm:text-3xl font-black">
          Settings
        </motion.h1>
        <p className="text-sm text-muted-foreground mt-0.5">Manage your account and preferences</p>
      </div>

      {/* Profile */}
      <SettingsSection icon={User} title="Profile" description="Your personal information" delay={0.05}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl bg-accent flex items-center justify-center overflow-hidden border-2 border-border">
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
              ) : (
                <User className="h-10 w-10 text-muted-foreground/30" />
              )}
            </div>
            <label className="absolute -bottom-1 -right-1 w-7 h-7 bg-primary text-primary-foreground rounded-full flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity shadow-md">
              <Camera className="h-3.5 w-3.5" />
              <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
            </label>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-display font-bold text-lg">{profile?.full_name || "User"}</p>
            <p className="text-sm text-muted-foreground truncate">{user?.email}</p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 mt-4">
          <div className="space-y-2">
            <Label className="text-xs">Full Name</Label>
            <Input value={fullName} onChange={(e) => setFullName(e.target.value)} className="rounded-xl" />
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Email</Label>
            <Input value={user?.email || ""} disabled className="rounded-xl bg-muted/50" />
          </div>
        </div>

        <Button onClick={handleSave} disabled={saving} className="rounded-full mt-2">
          <Save className="h-4 w-4 mr-2" /> {saving ? "Saving..." : "Save Changes"}
        </Button>
      </SettingsSection>

      {/* Security */}
      <SettingsSection icon={Shield} title="Security" description="Protect your account" delay={0.1}>
        <SettingsRow label="Two-Factor Authentication" description="Add an extra layer of security">
          <Badge variant="outline" className="text-[10px]">Coming Soon</Badge>
        </SettingsRow>
        <SettingsRow label="Active Sessions" description="Manage your logged-in devices">
          <Badge variant="secondary" className="text-[10px]">1 Active</Badge>
        </SettingsRow>
        <SettingsRow label="Password" description="Change your account password">
          <Button variant="outline" size="sm" className="rounded-full text-xs h-7" disabled>
            <Lock className="h-3 w-3 mr-1" /> Change
          </Button>
        </SettingsRow>
      </SettingsSection>

      {/* Notifications */}
      <SettingsSection icon={Bell} title="Notifications" description="Choose what you get notified about" delay={0.15}>
        <SettingsRow label="RSVP Notifications" description="Get notified when guests respond">
          <Switch defaultChecked />
        </SettingsRow>
        <SettingsRow label="Weekly Summary" description="Receive a weekly performance report">
          <Switch />
        </SettingsRow>
        <SettingsRow label="Marketing Emails" description="Product updates and tips">
          <Switch defaultChecked />
        </SettingsRow>
      </SettingsSection>

      {/* Preferences */}
      <SettingsSection icon={Palette} title="Preferences" description="Customize your experience" delay={0.2}>
        <SettingsRow label="Default View" description="Dashboard card layout preference">
          <Badge variant="secondary" className="text-[10px]">Grid</Badge>
        </SettingsRow>
        <SettingsRow label="Language" description="Interface language">
          <Badge variant="secondary" className="text-[10px]">English</Badge>
        </SettingsRow>
        <SettingsRow label="Timezone" description="For event date display">
          <Badge variant="secondary" className="text-[10px]">{Intl.DateTimeFormat().resolvedOptions().timeZone}</Badge>
        </SettingsRow>
      </SettingsSection>

      {/* Danger */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="rounded-2xl border border-destructive/20 bg-destructive/5 p-5 sm:p-6"
      >
        <h3 className="font-display font-bold text-sm text-destructive mb-1">Danger Zone</h3>
        <p className="text-xs text-muted-foreground mb-4">Irreversible and destructive actions</p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button variant="outline" className="rounded-full text-destructive border-destructive/30 hover:bg-destructive/10" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" /> Sign Out
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
