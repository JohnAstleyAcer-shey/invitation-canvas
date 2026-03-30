import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, Users, Shield, ShieldCheck, Ban, CheckCircle, MoreVertical, Mail, Eye, EyeOff, UserPlus, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { SEOHead } from "@/components/SEOHead";

interface ManagedUser {
  id: string;
  email: string;
  full_name: string;
  role: "superadmin" | "customer";
  avatar_url: string | null;
  created_at: string;
  last_sign_in: string | null;
  is_banned: boolean;
}

async function invokeAdminAction(action: string, body: Record<string, unknown> = {}) {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error("Not authenticated");

  const { data, error } = await supabase.functions.invoke("admin-manage-users", {
    body: { action, ...body },
  });

  if (error) throw new Error(error.message || "Request failed");
  if (data?.error) throw new Error(data.error);
  return data;
}

export default function CustomersPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | "superadmin" | "customer">("all");
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const { data: usersData, isLoading, refetch } = useQuery({
    queryKey: ["admin-users"],
    queryFn: () => invokeAdminAction("list_users"),
  });

  const users: ManagedUser[] = usersData?.users || [];

  const filtered = users.filter(u => {
    const matchesSearch = !search || u.full_name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === "all" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6 w-full max-w-5xl mx-auto">
      <SEOHead title="Customer Management" />

      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <motion.h1 initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="font-display text-2xl sm:text-3xl font-black">
            Customers
          </motion.h1>
          <p className="text-sm text-muted-foreground mt-0.5">Create and manage user accounts</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" className="rounded-xl" onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button className="rounded-full shadow-md" onClick={() => setShowCreateDialog(true)}>
            <UserPlus className="h-4 w-4 mr-2" /> Create Account
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 rounded-xl bg-muted/50 border-transparent focus:border-border"
          />
        </div>
        <Select value={roleFilter} onValueChange={(v) => setRoleFilter(v as any)}>
          <SelectTrigger className="w-full sm:w-40 rounded-xl"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="superadmin">SuperAdmin</SelectItem>
            <SelectItem value="customer">Customer</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-2xl border border-border bg-card p-4 text-center">
          <p className="text-2xl font-display font-black">{users.length}</p>
          <p className="text-xs text-muted-foreground">Total Users</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-4 text-center">
          <p className="text-2xl font-display font-black">{users.filter(u => u.role === "superadmin").length}</p>
          <p className="text-xs text-muted-foreground">SuperAdmins</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-4 text-center">
          <p className="text-2xl font-display font-black">{users.filter(u => u.role === "customer").length}</p>
          <p className="text-xs text-muted-foreground">Customers</p>
        </div>
      </div>

      {/* User list */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-20 rounded-2xl bg-muted animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <Users className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
          <p className="font-display font-bold">No users found</p>
          <p className="text-sm text-muted-foreground mt-1">
            {search ? "Try a different search term" : "Create your first customer account"}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((u, i) => (
            <UserRow key={u.id} user={u} index={i} onRefresh={() => refetch()} />
          ))}
        </div>
      )}

      <CreateUserDialog open={showCreateDialog} onOpenChange={setShowCreateDialog} onSuccess={() => { refetch(); setShowCreateDialog(false); }} />
    </div>
  );
}

function UserRow({ user, index, onRefresh }: { user: ManagedUser; index: number; onRefresh: () => void }) {
  const initials = (user.full_name || user.email || "U").split(" ").map(s => s[0]).join("").toUpperCase().slice(0, 2);

  const handleToggleBan = async () => {
    try {
      await invokeAdminAction(user.is_banned ? "activate_user" : "deactivate_user", { user_id: user.id });
      toast.success(user.is_banned ? "User activated" : "User deactivated");
      onRefresh();
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const handleChangeRole = async (role: string) => {
    try {
      await invokeAdminAction("update_role", { user_id: user.id, role });
      toast.success(`Role updated to ${role}`);
      onRefresh();
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
      className="flex items-center gap-3 p-4 rounded-2xl border border-border bg-card hover:bg-accent/20 transition-colors"
    >
      <Avatar className="h-10 w-10 shrink-0">
        <AvatarFallback className="text-xs bg-primary/10">{initials}</AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="font-display font-semibold text-sm truncate">{user.full_name || "Unnamed"}</p>
          {user.is_banned && <Badge variant="destructive" className="text-[9px]">Deactivated</Badge>}
        </div>
        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
      </div>

      <Badge variant={user.role === "superadmin" ? "default" : "secondary"} className="text-[10px] shrink-0">
        {user.role === "superadmin" ? <><ShieldCheck className="h-3 w-3 mr-1" /> SuperAdmin</> : <><Users className="h-3 w-3 mr-1" /> Customer</>}
      </Badge>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0"><MoreVertical className="h-4 w-4" /></Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={() => handleChangeRole(user.role === "superadmin" ? "customer" : "superadmin")}>
            <Shield className="h-4 w-4 mr-2" />
            {user.role === "superadmin" ? "Change to Customer" : "Promote to SuperAdmin"}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleToggleBan} className={user.is_banned ? "text-green-600" : "text-destructive"}>
            {user.is_banned ? <><CheckCircle className="h-4 w-4 mr-2" /> Activate</> : <><Ban className="h-4 w-4 mr-2" /> Deactivate</>}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </motion.div>
  );
}

function CreateUserDialog({ open, onOpenChange, onSuccess }: { open: boolean; onOpenChange: (o: boolean) => void; onSuccess: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState<"customer" | "superadmin">("customer");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await invokeAdminAction("create_user", { email, password, full_name: fullName, role });
      toast.success(`Account created for ${email}`);
      setEmail(""); setPassword(""); setFullName(""); setRole("customer");
      onSuccess();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display">Create New Account</DialogTitle>
          <DialogDescription>Create a user account. They will be able to sign in immediately.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleCreate} className="space-y-4">
          <div className="space-y-2">
            <Label>Full Name</Label>
            <Input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Juan Dela Cruz" required className="rounded-xl" />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="customer@example.com" required className="rounded-xl" />
          </div>
          <div className="space-y-2">
            <Label>Password</Label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                className="rounded-xl pr-10"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Role</Label>
            <Select value={role} onValueChange={(v) => setRole(v as "customer" | "superadmin")}>
              <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="customer">Customer</SelectItem>
                <SelectItem value="superadmin">SuperAdmin</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="rounded-xl">Cancel</Button>
            <Button type="submit" disabled={loading} className="rounded-xl">
              {loading ? "Creating..." : "Create Account"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
