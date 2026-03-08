import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Plus, Search, Download, Edit, Trash2, X, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useGuests, useRsvps } from "../hooks/useInvitationData";
import { useInvitation } from "../hooks/useInvitations";
import { RSVP_STATUS_LABELS, type RsvpStatus } from "../types";

const statusColors: Record<RsvpStatus, string> = {
  pending: "bg-muted text-muted-foreground",
  attending: "bg-primary/10 text-foreground",
  not_attending: "bg-destructive/10 text-destructive",
  maybe: "bg-accent text-accent-foreground",
};

export default function GuestManagementPage() {
  const { id } = useParams<{ id: string }>();
  const { data: invitation } = useInvitation(id!);
  const guests = useGuests(id!);
  const rsvps = useRsvps(id!);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<RsvpStatus | "all">("all");
  const [showAddGuest, setShowAddGuest] = useState(false);
  const [showBulk, setShowBulk] = useState(false);
  const [bulkText, setBulkText] = useState("");
  const [editGuest, setEditGuest] = useState<any>(null);

  const [newGuest, setNewGuest] = useState({ full_name: "", email: "", phone: "", max_companions: 0 });

  // Build guest-rsvp map
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
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild><Link to="/admin"><ArrowLeft className="h-4 w-4" /></Link></Button>
        <div>
          <h1 className="font-display text-xl font-bold">Guest Management</h1>
          <p className="text-xs text-muted-foreground">{invitation?.title}</p>
        </div>
      </div>

      {/* Actions bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search guests..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 rounded-xl" />
        </div>
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as any)}>
          <SelectTrigger className="w-36 rounded-xl"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            {Object.entries(RSVP_STATUS_LABELS).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
          </SelectContent>
        </Select>
        <Button onClick={() => setShowAddGuest(true)} className="rounded-full" size="sm"><Plus className="h-4 w-4 mr-1" /> Add Guest</Button>
        <Button variant="outline" onClick={() => setShowBulk(true)} size="sm" className="rounded-full"><UserPlus className="h-4 w-4 mr-1" /> Bulk Import</Button>
        <Button variant="outline" onClick={exportCSV} size="sm" className="rounded-full"><Download className="h-4 w-4 mr-1" /> CSV</Button>
      </div>

      {/* Stats */}
      <div className="flex gap-4 text-sm">
        <span className="text-muted-foreground">Total: <span className="font-semibold text-foreground">{guests.data?.length || 0}</span></span>
        <span className="text-muted-foreground">Filtered: <span className="font-semibold text-foreground">{filtered.length}</span></span>
      </div>

      {/* Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead className="hidden sm:table-cell">Email</TableHead>
                <TableHead className="hidden sm:table-cell">Phone</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>RSVP</TableHead>
                <TableHead className="hidden sm:table-cell">Companions</TableHead>
                <TableHead className="w-16" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground py-8">No guests found</TableCell></TableRow>
              ) : (
                filtered.map(g => {
                  const rsvp = rsvpMap.get(g.id);
                  const status = rsvp?.status || "pending";
                  return (
                    <TableRow key={g.id}>
                      <TableCell className="font-medium">{g.full_name}</TableCell>
                      <TableCell className="hidden sm:table-cell text-muted-foreground">{g.email || "—"}</TableCell>
                      <TableCell className="hidden sm:table-cell text-muted-foreground">{g.phone || "—"}</TableCell>
                      <TableCell><code className="text-xs bg-accent px-1.5 py-0.5 rounded">{g.invitation_code}</code></TableCell>
                      <TableCell>
                        <Badge className={`text-[10px] ${statusColors[status as RsvpStatus]}`}>
                          {RSVP_STATUS_LABELS[status as RsvpStatus]}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">{rsvp?.num_companions || 0}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setEditGuest(g)}><Edit className="h-3 w-3" /></Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => guests.remove.mutate(g.id)}><Trash2 className="h-3 w-3" /></Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Add guest dialog */}
      <Dialog open={showAddGuest} onOpenChange={setShowAddGuest}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add Guest</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1"><Label className="text-sm">Full Name *</Label><Input value={newGuest.full_name} onChange={(e) => setNewGuest(p => ({ ...p, full_name: e.target.value }))} className="rounded-xl" /></div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1"><Label className="text-sm">Email</Label><Input value={newGuest.email} onChange={(e) => setNewGuest(p => ({ ...p, email: e.target.value }))} className="rounded-xl" /></div>
              <div className="space-y-1"><Label className="text-sm">Phone</Label><Input value={newGuest.phone} onChange={(e) => setNewGuest(p => ({ ...p, phone: e.target.value }))} className="rounded-xl" /></div>
            </div>
            <div className="space-y-1"><Label className="text-sm">Max Companions</Label><Input type="number" min={0} value={newGuest.max_companions} onChange={(e) => setNewGuest(p => ({ ...p, max_companions: parseInt(e.target.value) || 0 }))} className="rounded-xl" /></div>
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
            <div className="space-y-3">
              <div className="space-y-1"><Label className="text-sm">Full Name</Label><Input value={editGuest.full_name} onChange={(e) => setEditGuest((p: any) => ({ ...p, full_name: e.target.value }))} className="rounded-xl" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1"><Label className="text-sm">Email</Label><Input value={editGuest.email || ""} onChange={(e) => setEditGuest((p: any) => ({ ...p, email: e.target.value }))} className="rounded-xl" /></div>
                <div className="space-y-1"><Label className="text-sm">Phone</Label><Input value={editGuest.phone || ""} onChange={(e) => setEditGuest((p: any) => ({ ...p, phone: e.target.value }))} className="rounded-xl" /></div>
              </div>
              <div className="space-y-1"><Label className="text-sm">Max Companions</Label><Input type="number" min={0} value={editGuest.max_companions || 0} onChange={(e) => setEditGuest((p: any) => ({ ...p, max_companions: parseInt(e.target.value) || 0 }))} className="rounded-xl" /></div>
              <Button onClick={() => { guests.update.mutate({ id: editGuest.id, full_name: editGuest.full_name, email: editGuest.email, phone: editGuest.phone, max_companions: editGuest.max_companions }); setEditGuest(null); }} className="w-full rounded-full">Save Changes</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
