import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Plus, Search, Download, Edit, Trash2, UserPlus, Users, CheckCircle, XCircle, HelpCircle, Clock, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useGuests, useRsvps } from "../hooks/useInvitationData";
import { useInvitation } from "../hooks/useInvitations";
import { RSVP_STATUS_LABELS, type RsvpStatus } from "../types";
import { GuestManagementSkeleton } from "@/components/LoadingSkeletons";
import { SEOHead } from "@/components/SEOHead";
import { toast } from "sonner";

const statusConfig: Record<RsvpStatus, { color: string; icon: React.ElementType }> = {
  pending: { color: "bg-muted text-muted-foreground", icon: Clock },
  attending: { color: "bg-green-500/10 text-green-700 dark:text-green-400", icon: CheckCircle },
  not_attending: { color: "bg-destructive/10 text-destructive", icon: XCircle },
  maybe: { color: "bg-amber-500/10 text-amber-700 dark:text-amber-400", icon: HelpCircle },
};

export default function GuestManagementPage() {
  const { id } = useParams<{ id: string }>();
  const { data: invitation, isLoading: invLoading } = useInvitation(id!);
  const guests = useGuests(id!);
  const rsvps = useRsvps(id!);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<RsvpStatus | "all">("all");
  const [hasEmailFilter, setHasEmailFilter] = useState<boolean | null>(null);
  const [hasPhoneFilter, setHasPhoneFilter] = useState<boolean | null>(null);
  const [showAddGuest, setShowAddGuest] = useState(false);
  const [showBulk, setShowBulk] = useState(false);
  const [bulkText, setBulkText] = useState("");
  const [editGuest, setEditGuest] = useState<any>(null);
  const [newGuest, setNewGuest] = useState({ full_name: "", email: "", phone: "", max_companions: 0 });
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const isLoading = invLoading || guests.isLoading;

  const rsvpMap = new Map<string, { status: RsvpStatus; num_companions: number; message: string | null }>();
  rsvps.data?.forEach(r => {
    rsvpMap.set(r.guest_id, { status: r.status as RsvpStatus, num_companions: r.num_companions || 0, message: r.message });
  });

  const filtered = guests.data?.filter(g => {
    const matchSearch = !search || g.full_name.toLowerCase().includes(search.toLowerCase());
    const rsvp = rsvpMap.get(g.id);
    const matchStatus = statusFilter === "all" || (rsvp?.status === statusFilter) || (!rsvp && statusFilter === "pending");
    return matchSearch && matchStatus;
  }) || [];

  const totalGuests = guests.data?.length || 0;
  const attending = guests.data?.filter(g => rsvpMap.get(g.id)?.status === "attending").length || 0;
  const declined = guests.data?.filter(g => rsvpMap.get(g.id)?.status === "not_attending").length || 0;
  const pending = totalGuests - attending - declined - (guests.data?.filter(g => rsvpMap.get(g.id)?.status === "maybe").length || 0);

  const handleAddGuest = () => {
    if (!newGuest.full_name.trim()) return;
    guests.create.mutate(newGuest);
    setNewGuest({ full_name: "", email: "", phone: "", max_companions: 0 });
    setShowAddGuest(false);
  };

  const handleBulkImport = () => {
    const names = bulkText.split("\n").map(n => n.trim()).filter(Boolean);
    if (!names.length) return;
    guests.bulkCreate.mutate(names);
    setBulkText("");
    setShowBulk(false);
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success("Code copied!");
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const exportCSV = () => {
    if (!guests.data?.length) return;
    const headers = ["Name", "Email", "Phone", "Code", "RSVP Status", "Companions"];
    const rows = guests.data.map(g => {
      const rsvp = rsvpMap.get(g.id);
      return [g.full_name, g.email || "", g.phone || "", g.invitation_code, rsvp?.status || "pending", rsvp?.num_companions || 0];
    });
    const csv = [headers, ...rows].map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `guests-${invitation?.slug || id}.csv`;
    a.click();
    toast.success("CSV exported");
  };

  if (isLoading) return <GuestManagementSkeleton />;

  return (
    <div className="space-y-6 w-full max-w-6xl mx-auto">
      <SEOHead title="Guest Management" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <Button variant="ghost" size="icon" asChild className="shrink-0 self-start"><Link to="/admin"><ArrowLeft className="h-4 w-4" /></Link></Button>
        <div className="flex-1 min-w-0">
          <motion.h1 initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="font-display text-xl sm:text-2xl font-black truncate">
            Guest Management
          </motion.h1>
          <p className="text-xs text-muted-foreground truncate">{invitation?.title}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total Guests", value: totalGuests, icon: Users, color: "from-primary/10 to-primary/5" },
          { label: "Attending", value: attending, icon: CheckCircle, color: "from-green-500/10 to-green-500/5" },
          { label: "Declined", value: declined, icon: XCircle, color: "from-red-500/10 to-red-500/5" },
          { label: "Pending", value: pending, icon: Clock, color: "from-amber-500/10 to-amber-500/5" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, type: "spring", stiffness: 300, damping: 25 }}
            whileHover={{ scale: 1.02, y: -2 }}
            className={`rounded-xl border border-border bg-gradient-to-br ${stat.color} p-3 sm:p-4 cursor-default transition-shadow hover:shadow-md`}
          >
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <stat.icon className="h-3.5 w-3.5" />
              <span className="text-[10px] font-medium uppercase tracking-wider">{stat.label}</span>
            </div>
            <p className="font-display text-xl sm:text-2xl font-black">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Actions bar */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="flex flex-col sm:flex-row gap-3"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search guests..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 rounded-xl bg-muted/50 border-transparent focus:border-border focus:bg-background"
          />
        </div>
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as any)}>
          <SelectTrigger className="w-full sm:w-36 rounded-xl"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            {Object.entries(RSVP_STATUS_LABELS).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
          </SelectContent>
        </Select>
        <div className="flex gap-2">
          <Button onClick={() => setShowAddGuest(true)} className="rounded-full flex-1 sm:flex-initial" size="sm"><Plus className="h-4 w-4 mr-1" /> Add</Button>
          <Button variant="outline" onClick={() => setShowBulk(true)} size="sm" className="rounded-full flex-1 sm:flex-initial"><UserPlus className="h-4 w-4 mr-1" /> Bulk</Button>
          <Button variant="outline" onClick={exportCSV} size="sm" className="rounded-full flex-1 sm:flex-initial"><Download className="h-4 w-4 mr-1" /> CSV</Button>
        </div>
      </motion.div>

      {/* Results */}
      <p className="text-xs text-muted-foreground">{filtered.length} of {totalGuests} guests</p>

      {filtered.length === 0 ? (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-16">
          <Users className="h-10 w-10 mx-auto mb-3 text-muted-foreground/30" />
          <p className="text-sm text-muted-foreground">No guests found</p>
        </motion.div>
      ) : (
        <>
          {/* Mobile cards */}
          <div className="sm:hidden space-y-2">
            <AnimatePresence>
              {filtered.map((g, i) => {
                const rsvp = rsvpMap.get(g.id);
                const status = (rsvp?.status || "pending") as RsvpStatus;
                const config = statusConfig[status];
                return (
                  <motion.div
                    key={g.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: i * 0.03 }}
                    whileTap={{ scale: 0.98 }}
                    className="rounded-xl border border-border bg-card p-4 space-y-2"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-bold text-sm">{g.full_name}</p>
                        {g.email && <p className="text-xs text-muted-foreground">{g.email}</p>}
                      </div>
                      <Badge className={`text-[10px] ${config.color}`}>{RSVP_STATUS_LABELS[status]}</Badge>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <button onClick={() => handleCopyCode(g.invitation_code)} className="bg-accent px-1.5 py-0.5 rounded text-[10px] flex items-center gap-1 hover:bg-accent/80 transition-colors">
                        {copiedCode === g.invitation_code ? <Check className="h-2.5 w-2.5" /> : <Copy className="h-2.5 w-2.5" />}
                        {g.invitation_code}
                      </button>
                      <span>{rsvp?.num_companions || 0} companion(s)</span>
                    </div>
                    <div className="flex gap-1 pt-1">
                      <Button variant="ghost" size="sm" className="h-7 text-xs flex-1 rounded-lg" onClick={() => setEditGuest(g)}><Edit className="h-3 w-3 mr-1" /> Edit</Button>
                      <Button variant="ghost" size="sm" className="h-7 text-xs text-destructive flex-1 rounded-lg" onClick={() => guests.remove.mutate(g.id)}><Trash2 className="h-3 w-3 mr-1" /> Delete</Button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Desktop table */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="hidden sm:block rounded-xl border border-border bg-card overflow-hidden"
          >
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Code</TableHead>
                    <TableHead>RSVP</TableHead>
                    <TableHead>Companions</TableHead>
                    <TableHead className="w-20" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <AnimatePresence>
                    {filtered.map((g, i) => {
                      const rsvp = rsvpMap.get(g.id);
                      const status = (rsvp?.status || "pending") as RsvpStatus;
                      const config = statusConfig[status];
                      return (
                        <motion.tr
                          key={g.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0, x: -10 }}
                          transition={{ delay: i * 0.02 }}
                          className="border-b border-border hover:bg-accent/30 transition-colors"
                        >
                          <TableCell className="font-medium">{g.full_name}</TableCell>
                          <TableCell className="text-muted-foreground">{g.email || "—"}</TableCell>
                          <TableCell className="text-muted-foreground">{g.phone || "—"}</TableCell>
                          <TableCell>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button onClick={() => handleCopyCode(g.invitation_code)} className="text-xs bg-accent px-1.5 py-0.5 rounded flex items-center gap-1 hover:bg-accent/80 transition-colors">
                                  {copiedCode === g.invitation_code ? <Check className="h-2.5 w-2.5 text-green-500" /> : <Copy className="h-2.5 w-2.5" />}
                                  {g.invitation_code}
                                </button>
                              </TooltipTrigger>
                              <TooltipContent>Click to copy</TooltipContent>
                            </Tooltip>
                          </TableCell>
                          <TableCell>
                            <Badge className={`text-[10px] ${config.color}`}>{RSVP_STATUS_LABELS[status]}</Badge>
                          </TableCell>
                          <TableCell>{rsvp?.num_companions || 0}</TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setEditGuest(g)}><Edit className="h-3 w-3" /></Button>
                              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => guests.remove.mutate(g.id)}><Trash2 className="h-3 w-3" /></Button>
                            </div>
                          </TableCell>
                        </motion.tr>
                      );
                    })}
                  </AnimatePresence>
                </TableBody>
              </Table>
            </div>
          </motion.div>
        </>
      )}

      {/* Add guest dialog */}
      <Dialog open={showAddGuest} onOpenChange={setShowAddGuest}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add Guest</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2"><Label className="text-xs">Full Name *</Label><Input value={newGuest.full_name} onChange={(e) => setNewGuest(p => ({ ...p, full_name: e.target.value }))} className="rounded-xl" /></div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2"><Label className="text-xs">Email</Label><Input value={newGuest.email} onChange={(e) => setNewGuest(p => ({ ...p, email: e.target.value }))} className="rounded-xl" /></div>
              <div className="space-y-2"><Label className="text-xs">Phone</Label><Input value={newGuest.phone} onChange={(e) => setNewGuest(p => ({ ...p, phone: e.target.value }))} className="rounded-xl" /></div>
            </div>
            <div className="space-y-2"><Label className="text-xs">Max Companions</Label><Input type="number" min={0} value={newGuest.max_companions} onChange={(e) => setNewGuest(p => ({ ...p, max_companions: parseInt(e.target.value) || 0 }))} className="rounded-xl" /></div>
            <Button onClick={handleAddGuest} className="w-full rounded-full">Add Guest</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Bulk import dialog */}
      <Dialog open={showBulk} onOpenChange={setShowBulk}>
        <DialogContent>
          <DialogHeader><DialogTitle>Bulk Import Guests</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">Paste guest names, one per line.</p>
          <Textarea value={bulkText} onChange={(e) => setBulkText(e.target.value)} placeholder={"John Doe\nJane Smith\nBob Wilson"} className="min-h-[200px] rounded-xl" />
          <Button onClick={handleBulkImport} className="rounded-full">Import {bulkText.split("\n").filter(Boolean).length} Guests</Button>
        </DialogContent>
      </Dialog>

      {/* Edit guest dialog */}
      <Dialog open={!!editGuest} onOpenChange={() => setEditGuest(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Edit Guest</DialogTitle></DialogHeader>
          {editGuest && (
            <div className="space-y-4">
              <div className="space-y-2"><Label className="text-xs">Full Name</Label><Input value={editGuest.full_name} onChange={(e) => setEditGuest((p: any) => ({ ...p, full_name: e.target.value }))} className="rounded-xl" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2"><Label className="text-xs">Email</Label><Input value={editGuest.email || ""} onChange={(e) => setEditGuest((p: any) => ({ ...p, email: e.target.value }))} className="rounded-xl" /></div>
                <div className="space-y-2"><Label className="text-xs">Phone</Label><Input value={editGuest.phone || ""} onChange={(e) => setEditGuest((p: any) => ({ ...p, phone: e.target.value }))} className="rounded-xl" /></div>
              </div>
              <div className="space-y-2"><Label className="text-xs">Max Companions</Label><Input type="number" min={0} value={editGuest.max_companions || 0} onChange={(e) => setEditGuest((p: any) => ({ ...p, max_companions: parseInt(e.target.value) || 0 }))} className="rounded-xl" /></div>
              <Button onClick={() => { guests.update.mutate({ id: editGuest.id, full_name: editGuest.full_name, email: editGuest.email, phone: editGuest.phone, max_companions: editGuest.max_companions }); setEditGuest(null); }} className="w-full rounded-full">Save Changes</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
