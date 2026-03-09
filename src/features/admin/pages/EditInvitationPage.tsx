import { useState, useRef, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Save, ArrowLeft, Image as ImageIcon, Trash2, Plus, Upload, X, ExternalLink, Monitor, Smartphone, RefreshCw, Eye, EyeOff, GripVertical, Music, Sparkles, Snowflake, Heart, Flower2, Clock, CheckCircle, Users, Copy } from "lucide-react";
import { useAutosave } from "../hooks/useAutosave";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Slider } from "@/components/ui/slider";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useInvitation, useUpdateInvitation } from "../hooks/useInvitations";
import {
  useInvitationTheme,
  useInvitationPages,
  useTimelineEvents,
  useRoses,
  useCandles,
  useTreasures,
  useBlueBills,
  useGalleryImages,
  useDressCodeColors,
  useGiftItems,
  useFaqs,
  useCustomerAdmins,
  uploadFile,
  deleteFile,
} from "../hooks/useInvitationData";
import { PAGE_TYPE_LABELS, STYLE_VARIANT_LABELS, type EventType, type StyleVariant } from "../types";
import { toast } from "sonner";

// Color palette suggestions
const colorPalettes = {
  debut: [
    { name: "Rose Gold", primary: "#B76E79", secondary: "#FFF0F5", accent: "#E8C1C8", textPrimary: "#2D1F21", textSecondary: "#6B4C52" },
    { name: "Midnight Blush", primary: "#1a1a2e", secondary: "#f5e6e0", accent: "#d4a5a5", textPrimary: "#1a1a2e", textSecondary: "#4a3f3f" },
    { name: "Lavender Dream", primary: "#6B5B95", secondary: "#F7F0F5", accent: "#B8A9C9", textPrimary: "#2D2640", textSecondary: "#6B5B7B" },
    { name: "Champagne", primary: "#C9A96E", secondary: "#FFF8F0", accent: "#E8D5B0", textPrimary: "#2D2510", textSecondary: "#6B5C3E" },
    { name: "Sage Garden", primary: "#7C9A6E", secondary: "#F0F5ED", accent: "#B8C9A9", textPrimary: "#1F2D1A", textSecondary: "#4C6B42" },
    { name: "Ocean Pearl", primary: "#5B8C9A", secondary: "#F0F5F7", accent: "#A9C9D4", textPrimary: "#1A2D33", textSecondary: "#3F6B7B" },
  ],
  wedding: [
    { name: "Classic White", primary: "#1a1a1a", secondary: "#ffffff", accent: "#c9c9c9", textPrimary: "#1a1a1a", textSecondary: "#666666" },
    { name: "Blush Romance", primary: "#8C5B6E", secondary: "#FFF0F5", accent: "#D4A5B8", textPrimary: "#2D1A22", textSecondary: "#6B3F52" },
    { name: "Emerald Night", primary: "#0D4D3A", secondary: "#F0F5F3", accent: "#6BA98C", textPrimary: "#0D2D22", textSecondary: "#3F6B55" },
    { name: "Dusty Rose", primary: "#B76E79", secondary: "#FDF0F0", accent: "#E8B5BC", textPrimary: "#3D1F25", textSecondary: "#7B4C55" },
    { name: "Navy Elegance", primary: "#1B2838", secondary: "#F0F2F5", accent: "#6B7B8C", textPrimary: "#1B2838", textSecondary: "#4B5B6B" },
    { name: "Burgundy Gold", primary: "#722F37", secondary: "#FFF8F0", accent: "#C9946E", textPrimary: "#2D0F14", textSecondary: "#6B3F45" },
  ],
  birthday: [
    { name: "Party Pop", primary: "#FF6B6B", secondary: "#FFF5F5", accent: "#FFB8B8", textPrimary: "#2D1A1A", textSecondary: "#6B4242" },
    { name: "Cool Blue", primary: "#4ECDC4", secondary: "#F0FFFE", accent: "#A8E8E2", textPrimary: "#1A2D2B", textSecondary: "#3F6B65" },
    { name: "Sunset", primary: "#FF8E53", secondary: "#FFF5F0", accent: "#FFB88E", textPrimary: "#2D1F15", textSecondary: "#6B4C35" },
    { name: "Berry", primary: "#9B59B6", secondary: "#F5F0FF", accent: "#C8A5D8", textPrimary: "#2D1A33", textSecondary: "#6B3F7B" },
    { name: "Mint Fresh", primary: "#2ECC71", secondary: "#F0FFF5", accent: "#8DE8B0", textPrimary: "#1A2D20", textSecondary: "#3F6B4C" },
    { name: "Cotton Candy", primary: "#F06292", secondary: "#FFF0F5", accent: "#F8A5C2", textPrimary: "#2D1A22", textSecondary: "#6B3F52" },
  ],
  christening: [
    { name: "Angel White", primary: "#87CEEB", secondary: "#FFFFFF", accent: "#B8E0F0", textPrimary: "#1A2D33", textSecondary: "#4B6B7B" },
    { name: "Soft Blue", primary: "#5DADE2", secondary: "#F0F8FF", accent: "#A8D4E8", textPrimary: "#1A2838", textSecondary: "#3F5B6B" },
    { name: "Gentle Pink", primary: "#F4A0C0", secondary: "#FFF5F8", accent: "#F8C8D8", textPrimary: "#2D1A22", textSecondary: "#6B4252" },
    { name: "Dove Gray", primary: "#6B7B8C", secondary: "#F5F5F5", accent: "#B8C5D0", textPrimary: "#1B2838", textSecondary: "#4B5B6B" },
    { name: "Cream", primary: "#C9A96E", secondary: "#FFFDF5", accent: "#E8D8B0", textPrimary: "#2D2510", textSecondary: "#6B5C3E" },
    { name: "Sage", primary: "#7C9A6E", secondary: "#F5F8F0", accent: "#B8C9A9", textPrimary: "#1F2D1A", textSecondary: "#4C6B42" },
  ],
  corporate: [
    { name: "Corporate Blue", primary: "#2C3E50", secondary: "#ECF0F1", accent: "#3498DB", textPrimary: "#2C3E50", textSecondary: "#7F8C8D" },
    { name: "Monochrome", primary: "#1a1a1a", secondary: "#f5f5f5", accent: "#666666", textPrimary: "#1a1a1a", textSecondary: "#666666" },
    { name: "Deep Green", primary: "#1B4332", secondary: "#F0F5F2", accent: "#52796F", textPrimary: "#1B4332", textSecondary: "#52796F" },
    { name: "Burgundy Pro", primary: "#722F37", secondary: "#F5F0F0", accent: "#A0525B", textPrimary: "#2D0F14", textSecondary: "#6B3F45" },
    { name: "Charcoal", primary: "#333333", secondary: "#FAFAFA", accent: "#888888", textPrimary: "#333333", textSecondary: "#777777" },
    { name: "Midnight", primary: "#0F1C2E", secondary: "#F0F2F5", accent: "#3B5998", textPrimary: "#0F1C2E", textSecondary: "#4B5B6B" },
  ],
};

const fontSuggestions = {
  title: ["Playfair Display", "Cormorant Garamond", "Great Vibes", "Cinzel", "Lora", "Merriweather", "Bodoni Moda"],
  body: ["Lato", "Montserrat", "Open Sans", "Raleway", "Source Sans 3", "Work Sans", "Nunito"],
};

const particleEffects = [
  { value: "", label: "None" },
  { value: "sparkles", label: "Sparkles", icon: Sparkles },
  { value: "snow", label: "Snow", icon: Snowflake },
  { value: "hearts", label: "Hearts", icon: Heart },
  { value: "petals", label: "Petals", icon: Flower2 },
];

// Quick-add form component
function QuickAddForm({ fields, onSubmit, submitLabel = "Add" }: {
  fields: { key: string; label: string; type?: string; required?: boolean }[];
  onSubmit: (data: Record<string, string>) => void;
  submitLabel?: string;
}) {
  const [values, setValues] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(values);
    setValues({});
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 p-3 bg-accent/30 rounded-xl">
      {fields.map(f => (
        <Input
          key={f.key}
          placeholder={f.label}
          value={values[f.key] || ""}
          onChange={(e) => setValues(prev => ({ ...prev, [f.key]: e.target.value }))}
          required={f.required}
          type={f.type || "text"}
          className="rounded-lg text-sm flex-1"
        />
      ))}
      <Button type="submit" size="sm" className="rounded-lg shrink-0"><Plus className="h-3 w-3 mr-1" /> {submitLabel}</Button>
    </form>
  );
}

// Content section with collapsible + count badge
function ContentSection({ title, count, children, defaultOpen = false }: {
  title: string; count: number; children: React.ReactNode; defaultOpen?: boolean;
}) {
  return (
    <Collapsible defaultOpen={defaultOpen}>
      <CollapsibleTrigger className="flex items-center justify-between w-full p-3 rounded-xl hover:bg-accent/50 transition-colors">
        <span className="font-display font-semibold text-sm">{title}</span>
        <Badge variant="secondary" className="text-xs">{count}</Badge>
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-2 space-y-2">{children}</CollapsibleContent>
    </Collapsible>
  );
}

export default function EditInvitationPage() {
  const { id } = useParams<{ id: string }>();
  const { data: invitation, isLoading } = useInvitation(id!);
  const updateInvitation = useUpdateInvitation();
  const { data: theme, updateTheme } = useInvitationTheme(id!);
  const { data: pages, togglePage, updateVariant, reorderPages } = useInvitationPages(id!);
  const timelineEvents = useTimelineEvents(id!);
  const roses = useRoses(id!);
  const candles = useCandles(id!);
  const treasures = useTreasures(id!);
  const blueBills = useBlueBills(id!);
  const galleryImages = useGalleryImages(id!);
  const dressCodeColors = useDressCodeColors(id!);
  const giftItems = useGiftItems(id!);
  const faqs = useFaqs(id!);
  const customerAdmins = useCustomerAdmins(id!);

  const [previewMode, setPreviewMode] = useState<"mobile" | "desktop">("mobile");
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [editForm, setEditForm] = useState<Record<string, any>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [bulkText, setBulkText] = useState("");
  const [bulkDialog, setBulkDialog] = useState<string | null>(null);

  const autoSaveFn = useCallback(async () => {
    if (!Object.keys(editForm).length) return;
    await updateInvitation.mutateAsync({ id: id!, ...editForm });
    setUnsavedChanges(false);
    setEditForm({});
  }, [editForm, id, updateInvitation]);

  const { lastSaved, isSaving } = useAutosave(autoSaveFn, unsavedChanges, 3000);

  if (isLoading) return <div className="flex items-center justify-center h-64"><div className="h-8 w-8 border-2 border-foreground/20 border-t-foreground rounded-full animate-spin" /></div>;
  if (!invitation) return <div className="text-center py-16"><p>Invitation not found</p></div>;

  const isDebut = invitation.event_type === "debut";

  const handleFieldChange = (field: string, value: any) => {
    setEditForm(prev => ({ ...prev, [field]: value }));
    setUnsavedChanges(true);
  };

  const handleSaveDetails = async () => {
    if (!Object.keys(editForm).length) return;
    await updateInvitation.mutateAsync({ id: id!, ...editForm });
    setUnsavedChanges(false);
    setEditForm({});
    toast.success("Details saved");
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const url = await uploadFile("invitation-assets", file, `covers/${id}`);
      await updateInvitation.mutateAsync({ id: id!, cover_image_url: url });
      toast.success("Cover image uploaded");
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleRemoveCover = async () => {
    if (invitation.cover_image_url) {
      await deleteFile("invitation-assets", invitation.cover_image_url);
    }
    await updateInvitation.mutateAsync({ id: id!, cover_image_url: null });
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    for (const file of Array.from(files)) {
      try {
        const url = await uploadFile("invitation-assets", file, `gallery/${id}`);
        await galleryImages.create.mutateAsync({ image_url: url, sort_order: (galleryImages.data?.length || 0) });
      } catch (err: any) {
        toast.error(err.message);
      }
    }
    toast.success(`${files.length} image(s) uploaded`);
  };

  const handleBulkAdd = (type: string) => {
    const lines = bulkText.split("\n").map(l => l.trim()).filter(Boolean);
    if (!lines.length) return;

    if (type === "timeline") {
      lines.forEach((line, i) => timelineEvents.create.mutate({ title: line, sort_order: (timelineEvents.data?.length || 0) + i }));
    } else if (type === "roses") {
      lines.forEach((line, i) => roses.create.mutate({ person_name: line, sort_order: (roses.data?.length || 0) + i }));
    } else if (type === "candles") {
      lines.forEach((line, i) => candles.create.mutate({ person_name: line, sort_order: (candles.data?.length || 0) + i }));
    } else if (type === "treasures") {
      lines.forEach((line, i) => treasures.create.mutate({ person_name: line, sort_order: (treasures.data?.length || 0) + i }));
    } else if (type === "blue_bills") {
      lines.forEach((line, i) => blueBills.create.mutate({ person_name: line, sort_order: (blueBills.data?.length || 0) + i }));
    }

    setBulkText("");
    setBulkDialog(null);
    toast.success(`${lines.length} items added`);
  };

  const val = (field: string) => editForm[field] ?? (invitation as any)[field] ?? "";

  const handleTogglePublish = async () => {
    await updateInvitation.mutateAsync({ id: id!, is_published: !invitation.is_published });
    toast.success(invitation.is_published ? "Invitation unpublished" : "Invitation published!");
  };

  const copyInviteLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/invite/${invitation.slug}`);
    toast.success("Invitation link copied!");
  };

  const copyCustomerAdminLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/customer-admin?event=${invitation.slug}`);
    toast.success("Customer admin link copied!");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <Button variant="ghost" size="icon" asChild className="shrink-0"><Link to="/admin"><ArrowLeft className="h-4 w-4" /></Link></Button>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="font-display text-xl font-bold truncate">{invitation.title}</h1>
              <Badge variant={invitation.is_published ? "default" : "secondary"} className="text-[10px] shrink-0">
                {invitation.is_published ? "Published" : "Draft"}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">/invite/{invitation.slug}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {isSaving && (
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="h-3 w-3 animate-spin" /> Saving...
            </span>
          )}
          {lastSaved && !unsavedChanges && (
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <CheckCircle className="h-3 w-3 text-primary" /> Saved
            </span>
          )}
          {unsavedChanges && (
            <Button onClick={handleSaveDetails} disabled={updateInvitation.isPending} className="rounded-full" size="sm">
              <Save className="h-4 w-4 mr-2" /> Save
            </Button>
          )}
          <Button variant="outline" size="sm" className="rounded-full text-xs" asChild>
            <Link to={`/admin/guests/${id}`}>
              <Users className="h-3 w-3 mr-1" /> Guests
            </Link>
          </Button>
          <Button variant="outline" size="sm" className="rounded-full text-xs" asChild>
            <Link to={`/admin/blocks/${id}`}>
              <Monitor className="h-3 w-3 mr-1" /> Blocks
            </Link>
          </Button>
          <Button 
            onClick={handleTogglePublish} 
            variant={invitation.is_published ? "secondary" : "default"}
            size="sm" 
            className="rounded-full text-xs"
          >
            {invitation.is_published ? <><EyeOff className="h-3 w-3 mr-1" /> Unpublish</> : <><Eye className="h-3 w-3 mr-1" /> Publish</>}
          </Button>
        </div>
      </div>

      {/* Quick action bar when published */}
      {invitation.is_published && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap items-center gap-2 p-3 rounded-xl bg-primary/10 border border-primary/20"
        >
          <CheckCircle className="h-4 w-4 text-primary" />
          <span className="text-sm text-foreground font-medium">Your invitation is live!</span>
          <div className="flex gap-2 ml-auto">
            <Button variant="outline" size="sm" className="h-7 text-xs rounded-full" onClick={copyInviteLink}>
              <Copy className="h-3 w-3 mr-1" /> Copy Link
            </Button>
            <Button variant="outline" size="sm" className="h-7 text-xs rounded-full" asChild>
              <a href={`/invite/${invitation.slug}`} target="_blank" rel="noopener">
                <ExternalLink className="h-3 w-3 mr-1" /> View
              </a>
            </Button>
          </div>
        </motion.div>
      )}

      {/* Tabs */}
      <Tabs defaultValue="details">
        <TabsList className="flex-wrap">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="theme">Theme</TabsTrigger>
          <TabsTrigger value="pages">Pages</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="access">Access</TabsTrigger>
        </TabsList>

        {/* DETAILS TAB */}
        <TabsContent value="details" className="space-y-6 mt-6">
          {/* Cover image */}
          <div className="glass-card p-4 space-y-3">
            <Label className="font-display font-semibold">Cover Image</Label>
            {invitation.cover_image_url ? (
              <div className="relative rounded-xl overflow-hidden h-48">
                <img src={invitation.cover_image_url} alt="" className="w-full h-full object-cover" />
                <div className="absolute top-2 right-2 flex gap-1">
                  <Button size="icon" variant="secondary" className="h-8 w-8" onClick={() => fileInputRef.current?.click()}>
                    <Upload className="h-3 w-3" />
                  </Button>
                  <Button size="icon" variant="destructive" className="h-8 w-8" onClick={handleRemoveCover}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-32 border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center gap-2 hover:bg-accent/30 transition-colors"
              >
                <ImageIcon className="h-8 w-8 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Click to upload cover image</span>
              </button>
            )}
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleCoverUpload} />
          </div>

          {/* Form fields */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Event Title</Label>
              <Input value={val("title")} onChange={(e) => handleFieldChange("title", e.target.value)} className="rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label>Celebrant Name</Label>
              <Input value={val("celebrant_name")} onChange={(e) => handleFieldChange("celebrant_name", e.target.value)} className="rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label>Event Date</Label>
              <Input type="datetime-local" value={val("event_date")?.slice(0, 16) || ""} onChange={(e) => handleFieldChange("event_date", e.target.value ? new Date(e.target.value).toISOString() : null)} className="rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label>URL Slug</Label>
              <Input value={val("slug")} onChange={(e) => handleFieldChange("slug", e.target.value)} className="rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label>Venue Name</Label>
              <Input value={val("venue_name")} onChange={(e) => handleFieldChange("venue_name", e.target.value)} className="rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label>Venue Address</Label>
              <Input value={val("venue_address")} onChange={(e) => handleFieldChange("venue_address", e.target.value)} className="rounded-xl" />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Venue Map URL</Label>
            <Input value={val("venue_map_url")} onChange={(e) => handleFieldChange("venue_map_url", e.target.value)} placeholder="https://maps.google.com/..." className="rounded-xl" />
          </div>
          <div className="space-y-2">
            <Label>Invitation Message</Label>
            <Textarea value={val("invitation_message")} onChange={(e) => handleFieldChange("invitation_message", e.target.value)} className="rounded-xl min-h-[120px]" />
          </div>
        </TabsContent>

        {/* CONTENT TAB */}
        <TabsContent value="content" className="space-y-4 mt-6">
          {/* Timeline */}
          <ContentSection title="Timeline Events" count={timelineEvents.data?.length || 0} defaultOpen>
            <QuickAddForm
              fields={[
                { key: "title", label: "Event title", required: true },
                { key: "event_time", label: "Time (e.g. 6:00 PM)" },
                { key: "description", label: "Description" },
              ]}
              onSubmit={(d) => timelineEvents.create.mutate({ title: d.title, event_time: d.event_time, description: d.description, sort_order: timelineEvents.data?.length || 0 })}
            />
            <Button variant="ghost" size="sm" onClick={() => setBulkDialog("timeline")} className="text-xs"><Plus className="h-3 w-3 mr-1" /> Bulk Add</Button>
            <div className="space-y-1">
              {timelineEvents.data?.map(e => (
                <div key={e.id} className="flex items-center justify-between p-2 rounded-lg bg-accent/20 text-sm">
                  <div><span className="font-medium">{e.title}</span>{e.event_time && <span className="text-muted-foreground ml-2">{e.event_time}</span>}</div>
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => timelineEvents.remove.mutate(e.id)}><Trash2 className="h-3 w-3" /></Button>
                </div>
              ))}
            </div>
          </ContentSection>

          {/* Gallery */}
          <ContentSection title="Gallery Images" count={galleryImages.data?.length || 0}>
            <div>
              <input type="file" accept="image/*" multiple onChange={handleGalleryUpload} className="hidden" id="gallery-upload" />
              <label htmlFor="gallery-upload" className="flex items-center gap-2 p-3 border-2 border-dashed border-border rounded-xl cursor-pointer hover:bg-accent/30 transition-colors">
                <Upload className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Upload images (multiple)</span>
              </label>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {galleryImages.data?.map(img => (
                <div key={img.id} className="relative group aspect-square rounded-lg overflow-hidden">
                  <img src={img.image_url} alt="" className="w-full h-full object-cover" />
                  <button
                    onClick={async () => {
                      await deleteFile("invitation-assets", img.image_url);
                      galleryImages.remove.mutate(img.id);
                    }}
                    className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          </ContentSection>

          {/* Dress Code */}
          <ContentSection title="Dress Code Colors" count={dressCodeColors.data?.length || 0}>
            <QuickAddForm
              fields={[
                { key: "color_hex", label: "Color hex (#ff0000)", required: true },
                { key: "color_name", label: "Color name" },
              ]}
              onSubmit={(d) => dressCodeColors.create.mutate({ color_hex: d.color_hex, color_name: d.color_name, sort_order: dressCodeColors.data?.length || 0 })}
            />
            <div className="flex flex-wrap gap-2">
              {dressCodeColors.data?.map(c => (
                <div key={c.id} className="flex items-center gap-2 p-2 rounded-lg bg-accent/20 text-sm">
                  <div className="w-6 h-6 rounded-full border border-border" style={{ backgroundColor: c.color_hex }} />
                  <span>{c.color_name || c.color_hex}</span>
                  <button onClick={() => dressCodeColors.remove.mutate(c.id)}><X className="h-3 w-3" /></button>
                </div>
              ))}
            </div>
          </ContentSection>

          {/* Gift Guide */}
          <ContentSection title="Gift Guide" count={giftItems.data?.length || 0}>
            <QuickAddForm
              fields={[
                { key: "item_name", label: "Item name", required: true },
                { key: "description", label: "Description" },
                { key: "link_url", label: "Link URL" },
              ]}
              onSubmit={(d) => giftItems.create.mutate({ item_name: d.item_name, description: d.description, link_url: d.link_url, sort_order: giftItems.data?.length || 0 })}
            />
            <div className="space-y-1">
              {giftItems.data?.map(g => (
                <div key={g.id} className="flex items-center justify-between p-2 rounded-lg bg-accent/20 text-sm">
                  <span className="font-medium">{g.item_name}</span>
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => giftItems.remove.mutate(g.id)}><Trash2 className="h-3 w-3" /></Button>
                </div>
              ))}
            </div>
          </ContentSection>

          {/* FAQs */}
          <ContentSection title="FAQs" count={faqs.data?.length || 0}>
            <QuickAddForm
              fields={[
                { key: "question", label: "Question", required: true },
                { key: "answer", label: "Answer", required: true },
              ]}
              onSubmit={(d) => faqs.create.mutate({ question: d.question, answer: d.answer, sort_order: faqs.data?.length || 0 })}
            />
            <div className="space-y-1">
              {faqs.data?.map(f => (
                <div key={f.id} className="flex items-center justify-between p-2 rounded-lg bg-accent/20 text-sm">
                  <div><span className="font-medium">{f.question}</span><p className="text-xs text-muted-foreground truncate">{f.answer}</p></div>
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => faqs.remove.mutate(f.id)}><Trash2 className="h-3 w-3" /></Button>
                </div>
              ))}
            </div>
          </ContentSection>

          {/* Debut-only sections */}
          {isDebut && (
            <>
              <ContentSection title="18 Roses" count={roses.data?.length || 0}>
                <QuickAddForm fields={[{ key: "person_name", label: "Name", required: true }, { key: "role_description", label: "Role" }]}
                  onSubmit={(d) => roses.create.mutate({ person_name: d.person_name, role_description: d.role_description, sort_order: roses.data?.length || 0 })} />
                <Button variant="ghost" size="sm" onClick={() => setBulkDialog("roses")} className="text-xs"><Plus className="h-3 w-3 mr-1" /> Bulk Add</Button>
                <div className="space-y-1">
                  {roses.data?.map(r => (
                    <div key={r.id} className="flex items-center justify-between p-2 rounded-lg bg-accent/20 text-sm">
                      <span>{r.person_name}{r.role_description && <span className="text-muted-foreground ml-2">— {r.role_description}</span>}</span>
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => roses.remove.mutate(r.id)}><Trash2 className="h-3 w-3" /></Button>
                    </div>
                  ))}
                </div>
              </ContentSection>

              <ContentSection title="18 Candles" count={candles.data?.length || 0}>
                <QuickAddForm fields={[{ key: "person_name", label: "Name", required: true }, { key: "message", label: "Message" }]}
                  onSubmit={(d) => candles.create.mutate({ person_name: d.person_name, message: d.message, sort_order: candles.data?.length || 0 })} />
                <Button variant="ghost" size="sm" onClick={() => setBulkDialog("candles")} className="text-xs"><Plus className="h-3 w-3 mr-1" /> Bulk Add</Button>
                <div className="space-y-1">
                  {candles.data?.map(c => (
                    <div key={c.id} className="flex items-center justify-between p-2 rounded-lg bg-accent/20 text-sm">
                      <span>{c.person_name}</span>
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => candles.remove.mutate(c.id)}><Trash2 className="h-3 w-3" /></Button>
                    </div>
                  ))}
                </div>
              </ContentSection>

              <ContentSection title="18 Treasures" count={treasures.data?.length || 0}>
                <QuickAddForm fields={[{ key: "person_name", label: "Name", required: true }, { key: "gift_description", label: "Gift" }]}
                  onSubmit={(d) => treasures.create.mutate({ person_name: d.person_name, gift_description: d.gift_description, sort_order: treasures.data?.length || 0 })} />
                <Button variant="ghost" size="sm" onClick={() => setBulkDialog("treasures")} className="text-xs"><Plus className="h-3 w-3 mr-1" /> Bulk Add</Button>
                <div className="space-y-1">
                  {treasures.data?.map(t => (
                    <div key={t.id} className="flex items-center justify-between p-2 rounded-lg bg-accent/20 text-sm">
                      <span>{t.person_name}</span>
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => treasures.remove.mutate(t.id)}><Trash2 className="h-3 w-3" /></Button>
                    </div>
                  ))}
                </div>
              </ContentSection>

              <ContentSection title="18 Blue Bills" count={blueBills.data?.length || 0}>
                <QuickAddForm fields={[{ key: "person_name", label: "Name", required: true }, { key: "message", label: "Message" }]}
                  onSubmit={(d) => blueBills.create.mutate({ person_name: d.person_name, message: d.message, sort_order: blueBills.data?.length || 0 })} />
                <Button variant="ghost" size="sm" onClick={() => setBulkDialog("blue_bills")} className="text-xs"><Plus className="h-3 w-3 mr-1" /> Bulk Add</Button>
                <div className="space-y-1">
                  {blueBills.data?.map(b => (
                    <div key={b.id} className="flex items-center justify-between p-2 rounded-lg bg-accent/20 text-sm">
                      <span>{b.person_name}</span>
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => blueBills.remove.mutate(b.id)}><Trash2 className="h-3 w-3" /></Button>
                    </div>
                  ))}
                </div>
              </ContentSection>
            </>
          )}
        </TabsContent>

        {/* THEME TAB */}
        <TabsContent value="theme" className="space-y-6 mt-6">
          {theme && (
            <>
              {/* Color palettes */}
              <div className="space-y-3">
                <Label className="font-display font-semibold">Suggested Palettes</Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {(colorPalettes[invitation.event_type as EventType] || colorPalettes.wedding).map(p => (
                    <button
                      key={p.name}
                      onClick={() => updateTheme.mutate({
                        color_primary: p.primary,
                        color_secondary: p.secondary,
                        color_accent: p.accent,
                        color_text_primary: p.textPrimary,
                        color_text_secondary: p.textSecondary,
                      })}
                      className="p-3 rounded-xl border border-border hover:border-foreground/30 transition-colors text-left"
                    >
                      <div className="flex gap-1 mb-2">
                        {[p.primary, p.secondary, p.accent].map((c, i) => (
                          <div key={i} className="w-6 h-6 rounded-full border border-border" style={{ backgroundColor: c }} />
                        ))}
                      </div>
                      <p className="text-xs font-medium">{p.name}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom colors */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                {[
                  { key: "color_primary", label: "Primary" },
                  { key: "color_secondary", label: "Secondary" },
                  { key: "color_accent", label: "Accent" },
                  { key: "color_text_primary", label: "Text Primary" },
                  { key: "color_text_secondary", label: "Text Secondary" },
                ].map(c => (
                  <div key={c.key} className="space-y-2">
                    <Label className="text-xs">{c.label}</Label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={(theme as any)[c.key] || "#000000"}
                        onChange={(e) => updateTheme.mutate({ [c.key]: e.target.value })}
                        className="w-8 h-8 rounded cursor-pointer"
                      />
                      <Input
                        value={(theme as any)[c.key] || ""}
                        onChange={(e) => updateTheme.mutate({ [c.key]: e.target.value })}
                        className="text-xs rounded-lg h-8"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Fonts */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm">Title Font</Label>
                  <Select value={theme.font_title || ""} onValueChange={(v) => updateTheme.mutate({ font_title: v })}>
                    <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {fontSuggestions.title.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <p className="text-sm p-2 rounded-lg bg-accent/30" style={{ fontFamily: theme.font_title || undefined }}>Preview Text — The Quick Brown Fox</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm">Body Font</Label>
                  <Select value={theme.font_body || ""} onValueChange={(v) => updateTheme.mutate({ font_body: v })}>
                    <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {fontSuggestions.body.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <p className="text-sm p-2 rounded-lg bg-accent/30" style={{ fontFamily: theme.font_body || undefined }}>Preview Text — The Quick Brown Fox</p>
                </div>
              </div>

              {/* Effects */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm">Particle Effect</Label>
                  <Select value={theme.particle_effect || ""} onValueChange={(v) => updateTheme.mutate({ particle_effect: v || null })}>
                    <SelectTrigger className="rounded-xl"><SelectValue placeholder="None" /></SelectTrigger>
                    <SelectContent>
                      {particleEffects.map(p => <SelectItem key={p.value} value={p.value || "none"}>{p.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm">Page Transition</Label>
                  <Select value={theme.page_transition || "fade"} onValueChange={(v) => updateTheme.mutate({ page_transition: v })}>
                    <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fade">Fade</SelectItem>
                      <SelectItem value="slide">Slide</SelectItem>
                      <SelectItem value="zoom">Zoom</SelectItem>
                      <SelectItem value="flip">Flip</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Glassmorphism + Background Opacity */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-accent/30">
                <Label className="text-sm">Glassmorphism</Label>
                <Switch checked={theme.glassmorphism_enabled || false} onCheckedChange={(v) => updateTheme.mutate({ glassmorphism_enabled: v })} />
              </div>

              <div className="space-y-2">
                <Label className="text-sm">Background Opacity: {Math.round((theme.background_opacity || 1) * 100)}%</Label>
                <Slider value={[theme.background_opacity || 1]} onValueChange={([v]) => updateTheme.mutate({ background_opacity: v })} min={0} max={1} step={0.05} />
              </div>

              {/* Music */}
              <div className="glass-card p-4 space-y-3">
                <div className="flex items-center gap-2"><Music className="h-4 w-4" /><Label className="font-display font-semibold">Background Music</Label></div>
                <Input value={theme.music_url || ""} onChange={(e) => updateTheme.mutate({ music_url: e.target.value || null })} placeholder="Direct audio file URL (.mp3)" className="rounded-xl" />
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2"><Switch checked={theme.music_autoplay || false} onCheckedChange={(v) => updateTheme.mutate({ music_autoplay: v })} /><span className="text-xs">Autoplay</span></div>
                  <div className="flex items-center gap-2"><Switch checked={theme.music_loop || false} onCheckedChange={(v) => updateTheme.mutate({ music_loop: v })} /><span className="text-xs">Loop</span></div>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Volume: {Math.round((theme.music_volume || 0.5) * 100)}%</Label>
                  <Slider value={[theme.music_volume || 0.5]} onValueChange={([v]) => updateTheme.mutate({ music_volume: v })} min={0} max={1} step={0.05} />
                </div>
              </div>
            </>
          )}
        </TabsContent>

        {/* PAGES TAB */}
        <TabsContent value="pages" className="space-y-4 mt-6">
          <p className="text-sm text-muted-foreground">Toggle sections on/off and choose style variants for each page.</p>
          <div className="space-y-2">
            {pages?.map((page, idx) => (
              <div key={page.id} className="flex items-center gap-3 p-3 rounded-xl bg-accent/20">
                <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab shrink-0" />
                <Switch checked={page.is_enabled} onCheckedChange={(v) => togglePage.mutate({ id: page.id, is_enabled: v })} />
                <span className={`text-sm font-medium flex-1 ${!page.is_enabled ? "text-muted-foreground line-through" : ""}`}>
                  {PAGE_TYPE_LABELS[page.page_type]}
                </span>
                <Select value={page.style_variant} onValueChange={(v) => updateVariant.mutate({ id: page.id, style_variant: v as StyleVariant })}>
                  <SelectTrigger className="w-28 h-8 text-xs rounded-lg"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(STYLE_VARIANT_LABELS).map(([k, v]) => (
                      <SelectItem key={k} value={k}>{v}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* PREVIEW TAB */}
        <TabsContent value="preview" className="mt-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex gap-1 border border-border rounded-lg p-0.5">
              <Button variant={previewMode === "mobile" ? "secondary" : "ghost"} size="sm" onClick={() => setPreviewMode("mobile")} className="h-7 text-xs">
                <Smartphone className="h-3 w-3 mr-1" /> Mobile
              </Button>
              <Button variant={previewMode === "desktop" ? "secondary" : "ghost"} size="sm" onClick={() => setPreviewMode("desktop")} className="h-7 text-xs">
                <Monitor className="h-3 w-3 mr-1" /> Desktop
              </Button>
            </div>
            <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => {
              const el = document.getElementById("preview-frame") as HTMLIFrameElement;
              if (el) el.src = el.src;
            }}>
              <RefreshCw className="h-3 w-3 mr-1" /> Refresh
            </Button>
            <Button variant="ghost" size="sm" className="h-7 text-xs" asChild>
              <a href={`/invite/${invitation.slug}`} target="_blank" rel="noopener">
                <ExternalLink className="h-3 w-3 mr-1" /> Open
              </a>
            </Button>
          </div>
          <div className="flex justify-center">
            <div className={`border border-border rounded-2xl overflow-hidden bg-background shadow-lg transition-all ${
              previewMode === "mobile" ? "w-[375px] h-[667px]" : "w-full h-[600px]"
            }`}>
              <iframe
                id="preview-frame"
                src={`/invite/${invitation.slug}`}
                className="w-full h-full border-0"
                title="Preview"
              />
            </div>
          </div>
        </TabsContent>

        {/* ACCESS TAB */}
        <TabsContent value="access" className="space-y-6 mt-6">
          {/* Customer Admin Portal Link */}
          {customerAdmins.data && customerAdmins.data.length > 0 && (
            <div className="glass-card p-4 space-y-3">
              <h3 className="font-display font-semibold flex items-center gap-2">
                <ExternalLink className="h-4 w-4" />
                Customer Admin Portal
              </h3>
              <p className="text-xs text-muted-foreground">Share this link with your clients so they can log in and view their event stats.</p>
              <div className="flex items-center gap-2">
                <code className="flex-1 px-3 py-2 rounded-lg bg-muted text-xs break-all">
                  {window.location.origin}/customer-admin?event={invitation.slug}
                </code>
                <Button variant="outline" size="sm" className="shrink-0 rounded-full" onClick={copyCustomerAdminLink}>
                  <Copy className="h-3 w-3 mr-1" /> Copy
                </Button>
              </div>
            </div>
          )}

          <div className="glass-card p-4 space-y-4">
            <h3 className="font-display font-semibold">Customer Admin Accounts</h3>
            <p className="text-xs text-muted-foreground">Create accounts for clients to view their invitation stats and RSVP responses.</p>
            <QuickAddForm
              fields={[
                { key: "username", label: "Username", required: true },
                { key: "password", label: "Password", required: true },
                { key: "display_name", label: "Display name" },
              ]}
              onSubmit={async (d) => {
                const encoder = new TextEncoder();
                const data = encoder.encode(d.password);
                const hashBuffer = await crypto.subtle.digest("SHA-256", data);
                const hashArray = Array.from(new Uint8Array(hashBuffer));
                const hashHex = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
                customerAdmins.create.mutate({ username: d.username, password_hash: hashHex, display_name: d.display_name });
                toast.success("Customer admin account created!");
              }}
              submitLabel="Create Account"
            />
            {customerAdmins.data?.length ? (
              <div className="space-y-1">
                {customerAdmins.data.map(ca => (
                  <div key={ca.id} className="flex items-center justify-between p-3 rounded-xl bg-accent/30 text-sm">
                    <div>
                      <span className="font-medium">{ca.username}</span>
                      {ca.display_name && <span className="text-muted-foreground ml-2">({ca.display_name})</span>}
                    </div>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => customerAdmins.remove.mutate(ca.id)}>
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="h-8 w-8 mx-auto mb-2 opacity-30" />
                <p className="text-xs">No customer admin accounts yet</p>
              </div>
            )}
          </div>

          {/* Publish Settings */}
          <div className="glass-card p-4 space-y-4">
            <h3 className="font-display font-semibold">Publish Settings</h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">Public Status</p>
                <p className="text-xs text-muted-foreground">
                  {invitation.is_published 
                    ? "Your invitation is visible to anyone with the link" 
                    : "Your invitation is private (only visible in preview)"}
                </p>
              </div>
              <Button 
                onClick={handleTogglePublish}
                variant={invitation.is_published ? "secondary" : "default"}
                size="sm"
                className="rounded-full"
              >
                {invitation.is_published ? <><EyeOff className="h-3 w-3 mr-1" /> Unpublish</> : <><Eye className="h-3 w-3 mr-1" /> Publish</>}
              </Button>
            </div>
            {invitation.is_published && (
              <div className="flex items-center gap-2 pt-2 border-t border-border">
                <code className="flex-1 px-3 py-2 rounded-lg bg-muted text-xs break-all">
                  {window.location.origin}/invite/{invitation.slug}
                </code>
                <Button variant="outline" size="sm" className="shrink-0 rounded-full" onClick={copyInviteLink}>
                  <Copy className="h-3 w-3 mr-1" /> Copy
                </Button>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Bulk add dialog */}
      <Dialog open={!!bulkDialog} onOpenChange={() => setBulkDialog(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Bulk Add — One name per line</DialogTitle></DialogHeader>
          <Textarea value={bulkText} onChange={(e) => setBulkText(e.target.value)} placeholder={"Name 1\nName 2\nName 3"} className="min-h-[200px] rounded-xl" />
          <Button onClick={() => bulkDialog && handleBulkAdd(bulkDialog)} className="rounded-full">
            Add {bulkText.split("\n").filter(Boolean).length} Items
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
