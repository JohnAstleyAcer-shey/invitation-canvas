import { useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Plus, LayoutGrid, List, Filter, Calendar, Eye, EyeOff, Copy, Trash2, Edit, Users, RotateCcw, Trash, MoreVertical, Share2, ExternalLink, Keyboard, CheckSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  useInvitations, useInvitationStats, useSoftDeleteInvitation, useRestoreInvitation,
  usePermanentDeleteInvitation, useDuplicateInvitation, useTogglePublish,
} from "../hooks/useInvitations";
import { EVENT_TYPE_LABELS, type EventType, type Invitation } from "../types";
import { formatDistanceToNow, format } from "date-fns";
import { ShareDialog } from "../components/ShareDialog";
import { BulkActionsBar } from "../components/BulkActionsBar";
import { useKeyboardShortcuts, KeyboardShortcutsDialog } from "../components/KeyboardShortcuts";
import { DashboardSkeleton } from "@/components/LoadingSkeletons";
import { SEOHead } from "@/components/SEOHead";
import { toast } from "sonner";

function StatCard({ label, value, icon, trend }: { label: string; value: number; icon: React.ReactNode; trend?: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-4 flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center shrink-0">{icon}</div>
      <div className="flex-1">
        <p className="text-2xl font-display font-bold">{value}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
      {trend && <Badge variant="secondary" className="text-[10px]">{trend}</Badge>}
    </motion.div>
  );
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [eventType, setEventType] = useState<EventType | "all">("all");
  const [status, setStatus] = useState<"all" | "published" | "draft" | "trash">("all");
  const [sort, setSort] = useState<"newest" | "oldest" | "alpha">("newest");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [deleteDialog, setDeleteDialog] = useState<{ ids: string[]; permanent: boolean } | null>(null);
  const [shareSlug, setShareSlug] = useState<{ slug: string; title: string } | null>(null);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const { data: invitations, isLoading } = useInvitations({ search, eventType, status, sort });
  const { data: stats } = useInvitationStats();
  const softDelete = useSoftDeleteInvitation();
  const restore = useRestoreInvitation();
  const permDelete = usePermanentDeleteInvitation();
  const duplicate = useDuplicateInvitation();
  const togglePublish = useTogglePublish();

  const toggleSelect = useCallback((id: string) => {
    setSelectedIds(prev => { const next = new Set(prev); next.has(id) ? next.delete(id) : next.add(id); return next; });
  }, []);

  const shortcuts = [
    { keys: ["n"], label: "New Invitation", action: () => navigate("/admin/create") },
    { keys: ["?"], label: "Show Shortcuts", action: () => setShowShortcuts(true) },
    { keys: ["/"], label: "Focus Search", action: () => document.querySelector<HTMLInputElement>('[data-search]')?.focus() },
    { keys: ["g"], label: "Grid View", action: () => setView("grid") },
    { keys: ["l"], label: "List View", action: () => setView("list") },
    { keys: ["Escape"], label: "Clear Selection", action: () => setSelectedIds(new Set()) },
  ];

  useKeyboardShortcuts(shortcuts);

  const handleBulkDelete = () => {
    setDeleteDialog({ ids: Array.from(selectedIds), permanent: status === "trash" });
  };

  const handleBulkPublish = () => {
    selectedIds.forEach(id => togglePublish.mutate({ id, is_published: true }));
    setSelectedIds(new Set());
    toast.success(`${selectedIds.size} invitations published`);
  };

  const handleBulkUnpublish = () => {
    selectedIds.forEach(id => togglePublish.mutate({ id, is_published: false }));
    setSelectedIds(new Set());
    toast.success(`${selectedIds.size} invitations unpublished`);
  };

  return (
    <div className="space-y-6">
      <SEOHead title="Dashboard" />
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Manage your invitations</p>
        </div>
        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={() => setShowShortcuts(true)} className="h-9 w-9">
                <Keyboard className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Keyboard shortcuts (?)</TooltipContent>
          </Tooltip>
          <Button asChild className="rounded-full">
            <Link to="/admin/create"><Plus className="h-4 w-4 mr-2" /> New Invitation</Link>
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Invitations" value={stats?.total || 0} icon={<Calendar className="h-5 w-5" />} />
        <StatCard label="Published" value={stats?.published || 0} icon={<Eye className="h-5 w-5" />} />
        <StatCard label="Total Guests" value={stats?.totalGuests || 0} icon={<Users className="h-5 w-5" />} />
        <StatCard label="Pending RSVPs" value={stats?.pendingRsvps || 0} icon={<Filter className="h-5 w-5" />} />
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input data-search placeholder="Search invitations... (press /)" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 rounded-xl" />
        </div>
        <Select value={eventType} onValueChange={(v) => setEventType(v as EventType | "all")}>
          <SelectTrigger className="w-40 rounded-xl"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {Object.entries(EVENT_TYPE_LABELS).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={sort} onValueChange={(v) => setSort(v as "newest" | "oldest" | "alpha")}>
          <SelectTrigger className="w-36 rounded-xl"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="oldest">Oldest</SelectItem>
            <SelectItem value="alpha">A-Z</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex gap-1 border border-border rounded-xl p-0.5">
          <Button variant={view === "grid" ? "secondary" : "ghost"} size="icon" className="h-8 w-8" onClick={() => setView("grid")}><LayoutGrid className="h-4 w-4" /></Button>
          <Button variant={view === "list" ? "secondary" : "ghost"} size="icon" className="h-8 w-8" onClick={() => setView("list")}><List className="h-4 w-4" /></Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={status} onValueChange={(v) => { setStatus(v as any); setSelectedIds(new Set()); }}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="published">Published</TabsTrigger>
          <TabsTrigger value="draft">Drafts</TabsTrigger>
          <TabsTrigger value="trash">Trash</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Bulk Actions */}
      <BulkActionsBar
        selectedCount={selectedIds.size}
        totalCount={invitations?.length || 0}
        onSelectAll={() => setSelectedIds(new Set(invitations?.map(i => i.id) || []))}
        onClearSelection={() => setSelectedIds(new Set())}
        onBulkDelete={handleBulkDelete}
        onBulkPublish={status !== "trash" ? handleBulkPublish : undefined}
        onBulkUnpublish={status !== "trash" ? handleBulkUnpublish : undefined}
      />

      {/* Invitation list */}
      {isLoading ? (
        <DashboardSkeleton />
      ) : !invitations?.length ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
          <div className="w-16 h-16 rounded-full bg-accent mx-auto mb-4 flex items-center justify-center">
            <Calendar className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="font-display text-lg font-semibold mb-1">
            {status === "trash" ? "Trash is empty" : "No invitations yet"}
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            {status === "trash" ? "Deleted invitations will appear here" : "Create your first invitation to get started"}
          </p>
          {status !== "trash" && (
            <Button asChild className="rounded-full"><Link to="/admin/create"><Plus className="h-4 w-4 mr-2" /> Create Invitation</Link></Button>
          )}
        </motion.div>
      ) : (
        <div className={view === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" : "space-y-3"}>
          {invitations.map((inv, i) => (
            <InvitationCard
              key={inv.id}
              invitation={inv}
              view={view}
              index={i}
              isTrash={status === "trash"}
              isSelected={selectedIds.has(inv.id)}
              onToggleSelect={() => toggleSelect(inv.id)}
              onTogglePublish={() => togglePublish.mutate({ id: inv.id, is_published: !inv.is_published })}
              onDuplicate={() => duplicate.mutate(inv.id)}
              onDelete={() => setDeleteDialog({ ids: [inv.id], permanent: status === "trash" })}
              onRestore={() => restore.mutate(inv.id)}
              onShare={() => setShareSlug({ slug: inv.slug, title: inv.title })}
            />
          ))}
        </div>
      )}

      {/* Delete confirmation */}
      <Dialog open={!!deleteDialog} onOpenChange={() => setDeleteDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{deleteDialog?.permanent ? "Permanently Delete?" : "Move to Trash?"}</DialogTitle>
            <DialogDescription>
              {deleteDialog?.permanent
                ? `This will permanently delete ${deleteDialog.ids.length} invitation(s) and all associated data. This cannot be undone.`
                : `${deleteDialog?.ids.length} invitation(s) will be moved to trash. You can restore them later.`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialog(null)}>Cancel</Button>
            <Button variant="destructive" onClick={() => {
              if (deleteDialog) {
                deleteDialog.ids.forEach(id => {
                  deleteDialog.permanent ? permDelete.mutate(id) : softDelete.mutate(id);
                });
                setDeleteDialog(null);
                setSelectedIds(new Set());
              }
            }}>
              {deleteDialog?.permanent ? "Delete Forever" : "Move to Trash"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Share dialog */}
      {shareSlug && <ShareDialog slug={shareSlug.slug} title={shareSlug.title} open={!!shareSlug} onOpenChange={() => setShareSlug(null)} />}

      {/* Keyboard shortcuts */}
      <KeyboardShortcutsDialog open={showShortcuts} onOpenChange={setShowShortcuts} shortcuts={shortcuts} />
    </div>
  );
}

function InvitationCard({
  invitation: inv, view, index, isTrash, isSelected, onToggleSelect,
  onTogglePublish, onDuplicate, onDelete, onRestore, onShare,
}: {
  invitation: Invitation; view: "grid" | "list"; index: number; isTrash: boolean;
  isSelected: boolean; onToggleSelect: () => void;
  onTogglePublish: () => void; onDuplicate: () => void; onDelete: () => void; onRestore: () => void; onShare: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
      className={`glass-card overflow-hidden transition-all ${view === "list" ? "flex items-center gap-4 p-4" : ""} ${isSelected ? "ring-2 ring-primary" : ""}`}
    >
      {/* Checkbox */}
      <div className={view === "grid" ? "absolute top-2 left-2 z-10" : "shrink-0"}>
        <Checkbox checked={isSelected} onCheckedChange={onToggleSelect} className="bg-background/80 backdrop-blur-sm" />
      </div>

      {/* Cover */}
      {view === "grid" && (
        <div className="h-32 bg-accent relative overflow-hidden">
          {inv.cover_image_url ? (
            <img src={inv.cover_image_url} alt="" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-3xl font-display font-bold text-muted-foreground/20">{inv.title[0]}</span>
            </div>
          )}
          <div className="absolute top-2 right-2 flex gap-1">
            <Badge variant={inv.is_published ? "default" : "secondary"} className="text-[10px]">
              {inv.is_published ? "Published" : "Draft"}
            </Badge>
          </div>
          <Badge variant="outline" className="absolute bottom-2 left-2 text-[10px] bg-background/80 backdrop-blur">
            {EVENT_TYPE_LABELS[inv.event_type as EventType]}
          </Badge>
        </div>
      )}

      <div className={view === "grid" ? "p-4 relative" : "flex-1 min-w-0"}>
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="font-display font-semibold text-sm truncate">{inv.title}</h3>
            {inv.celebrant_name && <p className="text-xs text-muted-foreground truncate">{inv.celebrant_name}</p>}
            <p className="text-xs text-muted-foreground mt-1">
              {inv.event_date ? format(new Date(inv.event_date), "MMM d, yyyy") : "No date"} · {formatDistanceToNow(new Date(inv.created_at), { addSuffix: true })}
            </p>
          </div>

          {view === "list" && (
            <div className="flex items-center gap-2 shrink-0">
              <Badge variant={inv.is_published ? "default" : "secondary"} className="text-[10px]">
                {inv.is_published ? "Published" : "Draft"}
              </Badge>
              <Badge variant="outline" className="text-[10px]">
                {EVENT_TYPE_LABELS[inv.event_type as EventType]}
              </Badge>
            </div>
          )}

          <div className="flex items-center gap-0.5 shrink-0">
            {!isTrash && inv.is_published && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-7 w-7" asChild>
                    <a href={`/invite/${inv.slug}`} target="_blank" rel="noopener noreferrer"><ExternalLink className="h-3 w-3" /></a>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>View live</TooltipContent>
              </Tooltip>
            )}
            {!isTrash && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onShare}><Share2 className="h-3 w-3" /></Button>
                </TooltipTrigger>
                <TooltipContent>Share</TooltipContent>
              </Tooltip>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-7 w-7"><MoreVertical className="h-3 w-3" /></Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {isTrash ? (
                  <>
                    <DropdownMenuItem onClick={onRestore}><RotateCcw className="h-4 w-4 mr-2" /> Restore</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={onDelete} className="text-destructive"><Trash className="h-4 w-4 mr-2" /> Delete Forever</DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem asChild><Link to={`/admin/edit/${inv.id}`}><Edit className="h-4 w-4 mr-2" /> Edit</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link to={`/admin/guests/${inv.id}`}><Users className="h-4 w-4 mr-2" /> Guests</Link></DropdownMenuItem>
                    <DropdownMenuItem onClick={onTogglePublish}>
                      {inv.is_published ? <><EyeOff className="h-4 w-4 mr-2" /> Unpublish</> : <><Eye className="h-4 w-4 mr-2" /> Publish</>}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={onDuplicate}><Copy className="h-4 w-4 mr-2" /> Duplicate</DropdownMenuItem>
                    <DropdownMenuItem onClick={onShare}><Share2 className="h-4 w-4 mr-2" /> Share</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={onDelete} className="text-destructive"><Trash2 className="h-4 w-4 mr-2" /> Delete</DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
