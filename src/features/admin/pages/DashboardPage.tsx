import { useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Plus, LayoutGrid, List, Filter, Calendar, Eye, EyeOff, Copy, Trash2, Edit, Users, RotateCcw, Trash, MoreVertical, Share2, ExternalLink, Keyboard, CheckSquare, TrendingUp, Zap, Clock, ArrowUpRight, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";
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
import { InvitationExpiryBadge } from "../components/InvitationExpiryBadge";
import { InvitationPreviewDialog } from "../components/InvitationPreviewDialog";

const statConfigs = [
  { key: "total", label: "Total Invitations", icon: Calendar, gradient: "from-primary/10 to-primary/5", iconColor: "text-primary" },
  { key: "published", label: "Published", icon: Eye, gradient: "from-green-500/10 to-green-500/5", iconColor: "text-green-600 dark:text-green-400" },
  { key: "totalGuests", label: "Total Guests", icon: Users, gradient: "from-blue-500/10 to-blue-500/5", iconColor: "text-blue-600 dark:text-blue-400" },
  { key: "pendingRsvps", label: "Pending RSVPs", icon: Clock, gradient: "from-amber-500/10 to-amber-500/5", iconColor: "text-amber-600 dark:text-amber-400" },
];

function StatCard({ label, value, icon: Icon, gradient, iconColor, index }: { label: string; value: number; icon: React.ElementType; gradient: string; iconColor: string; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.08, type: "spring", stiffness: 300, damping: 25 }}
      className={`relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br ${gradient} p-4 sm:p-5`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.08 + 0.2 }}
            className="text-2xl sm:text-3xl font-display font-black mt-1"
          >
            {value}
          </motion.p>
        </div>
        <div className={`w-10 h-10 rounded-xl bg-background/60 backdrop-blur-sm flex items-center justify-center ${iconColor}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      {/* Decorative dot */}
      <div className={`absolute -bottom-4 -right-4 w-24 h-24 rounded-full opacity-[0.04] bg-foreground`} />
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
    <div className="space-y-6 w-full max-w-7xl mx-auto">
      <SEOHead title="Dashboard" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <motion.h1
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="font-display text-2xl sm:text-3xl font-black"
          >
            Dashboard
          </motion.h1>
          <p className="text-sm text-muted-foreground mt-0.5">Manage your invitations and track guest responses</p>
        </div>
        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={() => setShowShortcuts(true)} className="h-9 w-9 rounded-xl">
                <Keyboard className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Keyboard shortcuts (?)</TooltipContent>
          </Tooltip>
          <Button asChild className="rounded-full shadow-md hover:shadow-lg transition-shadow">
            <Link to="/admin/create"><Plus className="h-4 w-4 mr-2" /> New Invitation</Link>
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {statConfigs.map((config, i) => (
          <StatCard
            key={config.key}
            label={config.label}
            value={(stats as any)?.[config.key] || 0}
            icon={config.icon}
            gradient={config.gradient}
            iconColor={config.iconColor}
            index={i}
          />
        ))}
      </div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex flex-col sm:flex-row gap-3"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            data-search
            placeholder="Search invitations... (press /)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 rounded-xl bg-muted/50 border-transparent focus:border-border focus:bg-background transition-colors"
          />
        </div>
        <Select value={eventType} onValueChange={(v) => setEventType(v as EventType | "all")}>
          <SelectTrigger className="w-full sm:w-40 rounded-xl"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {Object.entries(EVENT_TYPE_LABELS).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={sort} onValueChange={(v) => setSort(v as "newest" | "oldest" | "alpha")}>
          <SelectTrigger className="w-full sm:w-36 rounded-xl"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="oldest">Oldest</SelectItem>
            <SelectItem value="alpha">A-Z</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex gap-1 border border-border rounded-xl p-0.5 self-start">
          <Button variant={view === "grid" ? "secondary" : "ghost"} size="icon" className="h-8 w-8 rounded-lg" onClick={() => setView("grid")}><LayoutGrid className="h-4 w-4" /></Button>
          <Button variant={view === "list" ? "secondary" : "ghost"} size="icon" className="h-8 w-8 rounded-lg" onClick={() => setView("list")}><List className="h-4 w-4" /></Button>
        </div>
      </motion.div>

      {/* Tabs */}
      <Tabs value={status} onValueChange={(v) => { setStatus(v as any); setSelectedIds(new Set()); }}>
        <TabsList className="w-full sm:w-auto">
          <TabsTrigger value="all" className="flex-1 sm:flex-initial">All</TabsTrigger>
          <TabsTrigger value="published" className="flex-1 sm:flex-initial">Published</TabsTrigger>
          <TabsTrigger value="draft" className="flex-1 sm:flex-initial">Drafts</TabsTrigger>
          <TabsTrigger value="trash" className="flex-1 sm:flex-initial">Trash</TabsTrigger>
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
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-20">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-accent to-muted mx-auto mb-5 flex items-center justify-center">
            <Calendar className="h-9 w-9 text-muted-foreground/50" />
          </div>
          <h3 className="font-display text-xl font-bold mb-2">
            {status === "trash" ? "Trash is empty" : "No invitations yet"}
          </h3>
          <p className="text-sm text-muted-foreground mb-6 max-w-xs mx-auto">
            {status === "trash" ? "Deleted invitations will appear here" : "Create your first invitation to start managing events and guests"}
          </p>
          {status !== "trash" && (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button asChild className="rounded-full"><Link to="/admin/create"><Plus className="h-4 w-4 mr-2" /> Create Invitation</Link></Button>
              <Button variant="outline" asChild className="rounded-full"><Link to="/admin/templates"><Zap className="h-4 w-4 mr-2" /> Use Template</Link></Button>
            </div>
          )}
        </motion.div>
      ) : (
        <>
          <p className="text-xs text-muted-foreground">{invitations.length} invitation{invitations.length !== 1 ? "s" : ""} found</p>
          <div className={view === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4" : "space-y-3"}>
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
        </>
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
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setDeleteDialog(null)} className="rounded-xl">Cancel</Button>
            <Button variant="destructive" className="rounded-xl" onClick={() => {
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

      {shareSlug && <ShareDialog slug={shareSlug.slug} title={shareSlug.title} open={!!shareSlug} onOpenChange={() => setShareSlug(null)} />}
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
  const [showPreview, setShowPreview] = useState(false);
  if (view === "list") {
    return (
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.02 }}
        className={`flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl border border-border bg-card hover:bg-accent/30 transition-all ${isSelected ? "ring-2 ring-primary bg-primary/5" : ""}`}
      >
        <Checkbox checked={isSelected} onCheckedChange={onToggleSelect} />
        <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
          <h3 className="font-display font-semibold text-sm truncate flex-1">{inv.title}</h3>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant={inv.is_published ? "default" : "secondary"} className="text-[10px]">
              {inv.is_published ? "Published" : "Draft"}
            </Badge>
            <Badge variant="outline" className="text-[10px]">
              {EVENT_TYPE_LABELS[inv.event_type as EventType]}
            </Badge>
            <span className="text-[10px] text-muted-foreground hidden sm:inline">
              {inv.event_date ? format(new Date(inv.event_date), "MMM d, yyyy") : "No date"}
            </span>
          </div>
        </div>
        <CardActions inv={inv} isTrash={isTrash} onTogglePublish={onTogglePublish} onDuplicate={onDuplicate} onDelete={onDelete} onRestore={onRestore} onShare={onShare} />
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, type: "spring", stiffness: 300, damping: 25 }}
      className={`group relative rounded-2xl border border-border bg-card overflow-hidden hover:shadow-lg hover:border-primary/20 transition-all duration-300 ${isSelected ? "ring-2 ring-primary" : ""}`}
    >
      {/* Checkbox */}
      <div className="absolute top-3 left-3 z-10">
        <Checkbox checked={isSelected} onCheckedChange={onToggleSelect} className="bg-background/80 backdrop-blur-sm shadow-sm" />
      </div>

      {/* Cover */}
      <div className="h-36 bg-gradient-to-br from-accent to-muted relative overflow-hidden">
        {inv.cover_image_url ? (
          <img src={inv.cover_image_url} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-4xl font-display font-black text-muted-foreground/10">{inv.title[0]}</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
        <div className="absolute top-3 right-3 flex gap-1.5">
          <Badge variant={inv.is_published ? "default" : "secondary"} className="text-[10px] shadow-sm backdrop-blur-sm">
            {inv.is_published ? "Published" : "Draft"}
          </Badge>
        </div>
        <Badge variant="outline" className="absolute bottom-3 left-3 text-[10px] bg-background/80 backdrop-blur-sm">
          {EVENT_TYPE_LABELS[inv.event_type as EventType]}
        </Badge>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <h3 className="font-display font-bold text-sm truncate">{inv.title}</h3>
            {inv.celebrant_name && <p className="text-xs text-muted-foreground truncate mt-0.5">{inv.celebrant_name}</p>}
            <p className="text-[10px] text-muted-foreground mt-1.5 flex items-center gap-1.5">
              <Clock className="h-3 w-3" />
              {inv.event_date ? format(new Date(inv.event_date), "MMM d, yyyy") : "No date set"}
              <span className="text-muted-foreground/50">·</span>
              {formatDistanceToNow(new Date(inv.created_at), { addSuffix: true })}
            </p>
          </div>
          <CardActions inv={inv} isTrash={isTrash} onTogglePublish={onTogglePublish} onDuplicate={onDuplicate} onDelete={onDelete} onRestore={onRestore} onShare={onShare} />
        </div>

        {/* Quick action links */}
        {!isTrash && (
          <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-border/50">
            <Button variant="ghost" size="sm" className="h-7 text-[10px] rounded-lg flex-1" asChild>
              <Link to={`/admin/edit/${inv.id}`}><Edit className="h-3 w-3 mr-1" /> Edit</Link>
            </Button>
            <Button variant="ghost" size="sm" className="h-7 text-[10px] rounded-lg flex-1" asChild>
              <Link to={`/admin/guests/${inv.id}`}><Users className="h-3 w-3 mr-1" /> Guests</Link>
            </Button>
            <Button variant="ghost" size="sm" className="h-7 text-[10px] rounded-lg flex-1" asChild>
              <Link to={`/admin/blocks/${inv.id}`}><LayoutGrid className="h-3 w-3 mr-1" /> Blocks</Link>
            </Button>
          </div>
        )}
      </div>
    </motion.div>
  );
}

function CardActions({ inv, isTrash, onTogglePublish, onDuplicate, onDelete, onRestore, onShare }: {
  inv: Invitation; isTrash: boolean;
  onTogglePublish: () => void; onDuplicate: () => void; onDelete: () => void; onRestore: () => void; onShare: () => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0"><MoreVertical className="h-3.5 w-3.5" /></Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        {isTrash ? (
          <>
            <DropdownMenuItem onClick={onRestore}><RotateCcw className="h-4 w-4 mr-2" /> Restore</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onDelete} className="text-destructive"><Trash className="h-4 w-4 mr-2" /> Delete Forever</DropdownMenuItem>
          </>
        ) : (
          <>
            <DropdownMenuItem asChild><Link to={`/admin/edit/${inv.id}`}><Edit className="h-4 w-4 mr-2" /> Edit</Link></DropdownMenuItem>
            <DropdownMenuItem asChild><Link to={`/admin/blocks/${inv.id}`}><LayoutGrid className="h-4 w-4 mr-2" /> Block Editor</Link></DropdownMenuItem>
            <DropdownMenuItem asChild><Link to={`/admin/guests/${inv.id}`}><Users className="h-4 w-4 mr-2" /> Guests</Link></DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onTogglePublish}>
              {inv.is_published ? <><EyeOff className="h-4 w-4 mr-2" /> Unpublish</> : <><Eye className="h-4 w-4 mr-2" /> Publish</>}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onDuplicate}><Copy className="h-4 w-4 mr-2" /> Duplicate</DropdownMenuItem>
            <DropdownMenuItem onClick={onShare}><Share2 className="h-4 w-4 mr-2" /> Share</DropdownMenuItem>
            {inv.is_published && (
              <DropdownMenuItem asChild>
                <a href={`/invite/${inv.slug}`} target="_blank" rel="noopener noreferrer"><ExternalLink className="h-4 w-4 mr-2" /> View Live</a>
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onDelete} className="text-destructive"><Trash2 className="h-4 w-4 mr-2" /> Delete</DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
