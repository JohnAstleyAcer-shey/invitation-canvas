import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Trash2, Upload, Palette, Wand2, AlignLeft, AlignCenter, AlignRight, RotateCcw, Layers, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { BLOCK_REGISTRY } from "../registry";
import type { InvitationBlock, BlockContent, BlockStyle } from "../types";
import { uploadFile } from "@/features/admin/hooks/useInvitationData";
import { toast } from "sonner";

// Preset color palettes for quick selection
const COLOR_PRESETS = [
  "#FFFFFF", "#F8F9FA", "#E9ECEF", "#DEE2E6", "#ADB5BD", "#6C757D", "#495057", "#343A40", "#212529", "#000000",
  "#FF6B6B", "#E64980", "#BE4BDB", "#7950F2", "#4C6EF5", "#228BE6", "#15AABF", "#12B886", "#40C057", "#82C91E",
  "#FAB005", "#FD7E14", "#F06595", "#CC5DE8", "#845EF7", "#5C7CFA", "#22B8CF", "#20C997", "#51CF66", "#94D82D",
];

// Shadow presets with visual preview
const SHADOW_PRESETS = [
  { value: "none", label: "None", preview: "" },
  { value: "sm", label: "Subtle", preview: "shadow-sm" },
  { value: "md", label: "Medium", preview: "shadow-md" },
  { value: "lg", label: "Large", preview: "shadow-lg" },
  { value: "xl", label: "Extra Large", preview: "shadow-xl" },
  { value: "2xl", label: "Dramatic", preview: "shadow-2xl" },
  { value: "inner", label: "Inner", preview: "shadow-inner" },
];

// Gradient direction presets
const GRADIENT_DIRECTIONS = [
  { value: "0deg", label: "↑" },
  { value: "45deg", label: "↗" },
  { value: "90deg", label: "→" },
  { value: "135deg", label: "↘" },
  { value: "180deg", label: "↓" },
  { value: "225deg", label: "↙" },
  { value: "270deg", label: "←" },
  { value: "315deg", label: "↖" },
];

// Spacing presets
const SPACING_PRESETS = [
  { value: "0", label: "0" },
  { value: "0.5rem", label: "XS" },
  { value: "1rem", label: "S" },
  { value: "1.5rem", label: "M" },
  { value: "2rem", label: "L" },
  { value: "3rem", label: "XL" },
  { value: "4rem", label: "2XL" },
];

// Border radius presets
const RADIUS_PRESETS = [
  { value: "0", label: "None" },
  { value: "0.25rem", label: "SM" },
  { value: "0.5rem", label: "MD" },
  { value: "0.75rem", label: "LG" },
  { value: "1rem", label: "XL" },
  { value: "1.5rem", label: "2XL" },
  { value: "9999px", label: "Full" },
];

// Style presets for one-click application
const STYLE_PRESETS = [
  { name: "Clean White", style: { backgroundColor: "#FFFFFF", textColor: "#1a1a1a", padding: "2rem 1rem", shadow: "none" as const, borderRadius: "0" } },
  { name: "Soft Blush", style: { backgroundColor: "#FFF5F5", textColor: "#4a1a2a", padding: "2rem 1rem", shadow: "sm" as const, borderRadius: "0.75rem" } },
  { name: "Midnight", style: { backgroundColor: "#1a1a2e", textColor: "#e0e0e0", padding: "3rem 1rem", shadow: "xl" as const } },
  { name: "Golden Hour", style: { backgroundColor: "#fef3c7", textColor: "#78350f", padding: "2rem 1rem", gradient: "linear-gradient(135deg, #fef3c7, #fde68a)" } },
  { name: "Ocean Breeze", style: { backgroundColor: "#ecfeff", textColor: "#164e63", padding: "2rem 1rem", gradient: "linear-gradient(135deg, #ecfeff, #cffafe)" } },
  { name: "Rose Garden", style: { backgroundColor: "#fdf2f8", textColor: "#831843", padding: "2rem 1rem", gradient: "linear-gradient(135deg, #fdf2f8, #fce7f3)" } },
  { name: "Frosted Glass", style: { glassmorphism: true, padding: "2rem 1rem", borderRadius: "1rem", shadow: "lg" as const } },
  { name: "Bold Dark", style: { backgroundColor: "#0f172a", textColor: "#f8fafc", padding: "3rem 2rem", shadow: "2xl" as const, borderRadius: "1rem" } },
  { name: "Forest", style: { backgroundColor: "#ecfdf5", textColor: "#064e3b", padding: "2rem 1rem", gradient: "linear-gradient(135deg, #ecfdf5, #d1fae5)" } },
  { name: "Lavender Dreams", style: { backgroundColor: "#f5f3ff", textColor: "#4c1d95", padding: "2rem 1rem", gradient: "linear-gradient(135deg, #f5f3ff, #ede9fe)" } },
];

interface BlockSettingsProps {
  block: InvitationBlock;
  onUpdate: (content?: BlockContent, style?: BlockStyle) => void;
  onClose: () => void;
  onCopyStyle?: () => void;
  onPasteStyle?: () => void;
  hasCopiedStyle?: boolean;
}

export function BlockSettings({ block, onUpdate, onClose, onCopyStyle, onPasteStyle, hasCopiedStyle }: BlockSettingsProps) {
  const [content, setContent] = useState<any>(block.content);
  const [style, setStyle] = useState<any>(block.style);
  const fileRef = useRef<HTMLInputElement>(null);
  const def = BLOCK_REGISTRY[block.block_type as keyof typeof BLOCK_REGISTRY];

  const updateContent = (key: string, value: any) => {
    const next = { ...content, [key]: value };
    setContent(next);
    onUpdate(next, undefined);
  };

  const updateStyle = (key: string, value: any) => {
    const next = { ...style, [key]: value };
    setStyle(next);
    onUpdate(undefined, next);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const url = await uploadFile("invitation-assets", file, `blocks/${block.invitation_id}`);
      updateContent(key, url);
      toast.success("Image uploaded");
    } catch (err: any) { toast.error(err.message); }
  };

  const addListItem = (key: string, item: any) => updateContent(key, [...(content[key] || []), item]);
  const removeListItem = (key: string, index: number) => { const arr = [...(content[key] || [])]; arr.splice(index, 1); updateContent(key, arr); };
  const updateListItem = (key: string, index: number, field: string, value: any) => { const arr = [...(content[key] || [])]; arr[index] = { ...arr[index], [field]: value }; updateContent(key, arr); };

  return (
    <motion.div
      initial={{ x: 20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 20, opacity: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="w-72 sm:w-80 border-l border-border bg-card flex flex-col h-full shrink-0"
    >
      <div className="p-3 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-[9px]">{block.block_type}</Badge>
          <h3 className="font-display font-bold text-sm">{def?.label || "Settings"}</h3>
        </div>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onClose}><X className="h-4 w-4" /></Button>
      </div>

      <Tabs defaultValue="content" className="flex-1 flex flex-col overflow-hidden">
        <TabsList className="mx-3 mt-2 h-7">
          <TabsTrigger value="content" className="text-[10px] h-6">Content</TabsTrigger>
          <TabsTrigger value="style" className="text-[10px] h-6">
            <Palette className="h-2.5 w-2.5 mr-1" /> Style
          </TabsTrigger>
          <TabsTrigger value="advanced" className="text-[10px] h-6">
            <Layers className="h-2.5 w-2.5 mr-1" /> Advanced
          </TabsTrigger>
        </TabsList>

        <ScrollArea className="flex-1">
          <TabsContent value="content" className="p-3 space-y-4 mt-0">
            {renderContentSettings(block.block_type, content, updateContent, addListItem, removeListItem, updateListItem, handleImageUpload, fileRef)}
          </TabsContent>

          <TabsContent value="style" className="p-3 space-y-4 mt-0">
            <StyleSettings style={style} updateStyle={updateStyle} />
          </TabsContent>

          <TabsContent value="advanced" className="p-3 space-y-4 mt-0">
            <AdvancedStyleSettings style={style} updateStyle={updateStyle} />
          </TabsContent>
        </ScrollArea>
      </Tabs>

      <input ref={fileRef} type="file" accept="image/*" className="hidden" />
    </motion.div>
  );
}

function StyleSettings({ style, updateStyle }: { style: any; updateStyle: (k: string, v: any) => void }) {
  return (
    <>
      {/* Text Alignment - Canva-style toggle */}
      <div className="space-y-1.5">
        <Label className="text-xs font-semibold">Text Alignment</Label>
        <div className="flex border border-border rounded-lg overflow-hidden">
          {[
            { value: "left", icon: AlignLeft },
            { value: "center", icon: AlignCenter },
            { value: "right", icon: AlignRight },
          ].map(({ value, icon: Icon }) => (
            <button
              key={value}
              onClick={() => updateStyle("textAlign", value)}
              className={`flex-1 h-8 flex items-center justify-center transition-colors ${
                (style.textAlign || "center") === value ? "bg-primary text-primary-foreground" : "hover:bg-accent"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
            </button>
          ))}
        </div>
      </div>

      {/* Color section - with presets like Canva */}
      <div className="space-y-1.5">
        <Label className="text-xs font-semibold">Background Color</Label>
        <div className="flex gap-2 items-center">
          <input type="color" value={style.backgroundColor || "#ffffff"} onChange={e => updateStyle("backgroundColor", e.target.value)} className="h-8 w-8 rounded-lg cursor-pointer border border-border" />
          <Input value={style.backgroundColor || ""} onChange={e => updateStyle("backgroundColor", e.target.value)} placeholder="transparent" className="h-8 text-xs flex-1" />
        </div>
        <div className="flex flex-wrap gap-1">
          {COLOR_PRESETS.slice(0, 10).map(c => (
            <button
              key={c}
              className={`w-5 h-5 rounded border transition-all hover:scale-110 ${style.backgroundColor === c ? "ring-2 ring-primary ring-offset-1" : "border-border"}`}
              style={{ backgroundColor: c }}
              onClick={() => updateStyle("backgroundColor", c)}
            />
          ))}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs font-semibold">Text Color</Label>
        <div className="flex gap-2 items-center">
          <input type="color" value={style.textColor || "#000000"} onChange={e => updateStyle("textColor", e.target.value)} className="h-8 w-8 rounded-lg cursor-pointer border border-border" />
          <Input value={style.textColor || ""} onChange={e => updateStyle("textColor", e.target.value)} placeholder="inherit" className="h-8 text-xs flex-1" />
        </div>
        <div className="flex flex-wrap gap-1">
          {COLOR_PRESETS.slice(0, 10).map(c => (
            <button
              key={c}
              className={`w-5 h-5 rounded border transition-all hover:scale-110 ${style.textColor === c ? "ring-2 ring-primary ring-offset-1" : "border-border"}`}
              style={{ backgroundColor: c }}
              onClick={() => updateStyle("textColor", c)}
            />
          ))}
        </div>
      </div>

      <Separator />

      {/* Gradient - with direction picker */}
      <div className="space-y-1.5">
        <Label className="text-xs font-semibold">Gradient</Label>
        <div className="flex gap-2 items-center">
          <input type="color" value={style.gradientFrom || "#667eea"} onChange={e => updateStyle("gradientFrom", e.target.value)} className="h-6 w-6 rounded cursor-pointer border border-border" />
          <span className="text-[9px] text-muted-foreground">→</span>
          <input type="color" value={style.gradientTo || "#764ba2"} onChange={e => updateStyle("gradientTo", e.target.value)} className="h-6 w-6 rounded cursor-pointer border border-border" />
        </div>
        <div className="flex gap-0.5">
          {GRADIENT_DIRECTIONS.map(d => (
            <button
              key={d.value}
              onClick={() => updateStyle("gradientDirection", d.value)}
              className={`flex-1 h-6 rounded text-[10px] transition-colors ${
                (style.gradientDirection || "135deg") === d.value ? "bg-primary text-primary-foreground" : "bg-accent hover:bg-accent/80"
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>
        <div className="flex gap-1">
          <Button variant="outline" size="sm" className="h-6 text-[10px] flex-1" onClick={() => {
            if (style.gradientFrom && style.gradientTo) {
              updateStyle("gradient", `linear-gradient(${style.gradientDirection || "135deg"}, ${style.gradientFrom}, ${style.gradientTo})`);
            }
          }}>
            <Palette className="h-3 w-3 mr-1" /> Apply
          </Button>
          {style.gradient && (
            <Button variant="ghost" size="sm" className="h-6 text-[10px]" onClick={() => updateStyle("gradient", "")}>
              <RotateCcw className="h-3 w-3" />
            </Button>
          )}
        </div>
        {style.gradient && (
          <div className="h-6 rounded-lg border border-border" style={{ background: style.gradient }} />
        )}
      </div>

      <Separator />

      {/* Spacing - with preset chips */}
      <div className="space-y-1.5">
        <Label className="text-xs font-semibold">Padding</Label>
        <div className="flex gap-1">
          {SPACING_PRESETS.map(s => (
            <button
              key={s.value}
              onClick={() => updateStyle("padding", s.value)}
              className={`flex-1 h-6 rounded text-[9px] font-medium transition-colors ${
                style.padding === s.value ? "bg-primary text-primary-foreground" : "bg-accent hover:bg-accent/80"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Border Radius - with visual presets */}
      <div className="space-y-1.5">
        <Label className="text-xs font-semibold">Border Radius</Label>
        <div className="flex gap-1">
          {RADIUS_PRESETS.map(r => (
            <button
              key={r.value}
              onClick={() => updateStyle("borderRadius", r.value)}
              className={`flex-1 h-6 rounded text-[9px] font-medium transition-colors ${
                style.borderRadius === r.value ? "bg-primary text-primary-foreground" : "bg-accent hover:bg-accent/80"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Shadow - visual presets */}
      <div className="space-y-1.5">
        <Label className="text-xs font-semibold">Shadow</Label>
        <div className="grid grid-cols-4 gap-1">
          {SHADOW_PRESETS.map(s => (
            <button
              key={s.value}
              onClick={() => updateStyle("shadow", s.value)}
              className={`h-8 rounded-lg text-[9px] font-medium transition-all ${
                (style.shadow || "none") === s.value ? "bg-primary text-primary-foreground" : "bg-accent hover:bg-accent/80"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <Separator />

      {/* Toggle options */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-xs">Full Height</Label>
          <Switch checked={style.fullHeight || false} onCheckedChange={v => updateStyle("fullHeight", v)} />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-xs">Glassmorphism</Label>
            <p className="text-[9px] text-muted-foreground">Frosted glass effect</p>
          </div>
          <Switch checked={style.glassmorphism || false} onCheckedChange={v => updateStyle("glassmorphism", v)} />
        </div>
      </div>

      <Separator />

      {/* Animation */}
      <div className="space-y-1.5">
        <Label className="text-xs font-semibold">Entrance Animation</Label>
        <div className="grid grid-cols-3 gap-1">
          {[
            { value: "none", label: "None" },
            { value: "fade-up", label: "Fade Up" },
            { value: "fade-in", label: "Fade In" },
            { value: "slide-left", label: "Slide L" },
            { value: "slide-right", label: "Slide R" },
            { value: "zoom", label: "Zoom" },
            { value: "bounce", label: "Bounce" },
            { value: "rotate", label: "Rotate" },
            { value: "flip", label: "Flip" },
          ].map(a => (
            <button
              key={a.value}
              onClick={() => updateStyle("animation", a.value)}
              className={`h-7 rounded-lg text-[9px] font-medium transition-colors ${
                (style.animation || "none") === a.value ? "bg-primary text-primary-foreground" : "bg-accent hover:bg-accent/80"
              }`}
            >
              {a.label}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

function AdvancedStyleSettings({ style, updateStyle }: { style: any; updateStyle: (k: string, v: any) => void }) {
  return (
    <>
      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Advanced Styles</p>
      <div className="space-y-1">
        <Label className="text-xs">Opacity: {style.opacity ?? 100}%</Label>
        <Slider value={[style.opacity ?? 100]} onValueChange={([v]) => updateStyle("opacity", v)} min={0} max={100} step={5} />
      </div>
      <div className="space-y-1">
        <Label className="text-xs">Font Family</Label>
        <Select value={style.fontFamily || ""} onValueChange={v => updateStyle("fontFamily", v)}>
          <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Default" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="">Default</SelectItem>
            <SelectItem value="serif">Serif</SelectItem>
            <SelectItem value="sans-serif">Sans Serif</SelectItem>
            <SelectItem value="monospace">Monospace</SelectItem>
            <SelectItem value="'Playfair Display', serif">Playfair Display</SelectItem>
            <SelectItem value="'Dancing Script', cursive">Dancing Script</SelectItem>
            <SelectItem value="'Great Vibes', cursive">Great Vibes</SelectItem>
            <SelectItem value="'Montserrat', sans-serif">Montserrat</SelectItem>
            <SelectItem value="'Cormorant Garamond', serif">Cormorant Garamond</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1">
        <Label className="text-xs">Font Size</Label>
        <Input value={style.fontSize || ""} onChange={e => updateStyle("fontSize", e.target.value)} placeholder="1rem" className="h-8 text-xs" />
      </div>
      <div className="space-y-1">
        <Label className="text-xs">Letter Spacing</Label>
        <Input value={style.letterSpacing || ""} onChange={e => updateStyle("letterSpacing", e.target.value)} placeholder="0.05em" className="h-8 text-xs" />
      </div>
      <div className="space-y-1">
        <Label className="text-xs">Line Height</Label>
        <Input value={style.lineHeight || ""} onChange={e => updateStyle("lineHeight", e.target.value)} placeholder="1.6" className="h-8 text-xs" />
      </div>
      <div className="space-y-1">
        <Label className="text-xs">Max Width</Label>
        <Select value={style.maxWidth || ""} onValueChange={v => updateStyle("maxWidth", v)}>
          <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Full width" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="">Full width</SelectItem>
            <SelectItem value="400px">Narrow (400px)</SelectItem>
            <SelectItem value="600px">Medium (600px)</SelectItem>
            <SelectItem value="800px">Wide (800px)</SelectItem>
            <SelectItem value="1024px">Extra Wide (1024px)</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Separator />
      <div className="space-y-1">
        <Label className="text-xs">Border Style</Label>
        <Select value={style.borderStyle || "none"} onValueChange={v => updateStyle("borderStyle", v)}>
          <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="none">None</SelectItem>
            <SelectItem value="solid">Solid</SelectItem>
            <SelectItem value="dashed">Dashed</SelectItem>
            <SelectItem value="dotted">Dotted</SelectItem>
            <SelectItem value="double">Double</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {style.borderStyle && style.borderStyle !== "none" && (
        <>
          <div className="space-y-1">
            <Label className="text-xs">Border Width</Label>
            <Input value={style.borderWidth || "1px"} onChange={e => updateStyle("borderWidth", e.target.value)} className="h-8 text-xs" />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Border Color</Label>
            <div className="flex gap-2">
              <input type="color" value={style.borderColor || "#e5e7eb"} onChange={e => updateStyle("borderColor", e.target.value)} className="h-8 w-8 rounded cursor-pointer border" />
              <Input value={style.borderColor || ""} onChange={e => updateStyle("borderColor", e.target.value)} className="h-8 text-xs flex-1" />
            </div>
          </div>
        </>
      )}
      <Separator />
      <div className="space-y-1">
        <Label className="text-xs">Background Image URL</Label>
        <Input value={style.backgroundImage || ""} onChange={e => updateStyle("backgroundImage", e.target.value)} placeholder="https://..." className="h-8 text-xs" />
      </div>
      {style.backgroundImage && (
        <div className="space-y-1">
          <Label className="text-xs">Background Overlay</Label>
          <Input value={style.backgroundOverlay || ""} onChange={e => updateStyle("backgroundOverlay", e.target.value)} placeholder="rgba(0,0,0,0.4)" className="h-8 text-xs" />
        </div>
      )}
      <div className="space-y-1">
        <Label className="text-xs">Margin</Label>
        <Input value={style.margin || ""} onChange={e => updateStyle("margin", e.target.value)} placeholder="0 auto" className="h-8 text-xs" />
      </div>
    </>
  );
}

function renderContentSettings(
  blockType: string, content: any, updateContent: (k: string, v: any) => void,
  addListItem: (k: string, item: any) => void,
  removeListItem: (k: string, i: number) => void,
  updateListItem: (k: string, i: number, f: string, v: any) => void,
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>, key: string) => void,
  fileRef: React.RefObject<HTMLInputElement | null>,
) {
  switch (blockType) {
    case "heading":
      return (
        <div className="space-y-3">
          <div className="space-y-1"><Label className="text-xs">Heading Text</Label><Input value={content.text || ""} onChange={e => updateContent("text", e.target.value)} className="h-8 text-xs" /></div>
          <div className="space-y-1"><Label className="text-xs">Level</Label>
            <Select value={String(content.level || 2)} onValueChange={v => updateContent("level", parseInt(v))}>
              <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="1">H1 - Largest</SelectItem>
                <SelectItem value="2">H2 - Large</SelectItem>
                <SelectItem value="3">H3 - Medium</SelectItem>
                <SelectItem value="4">H4 - Small</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      );

    case "text":
    case "message_card":
      return <div className="space-y-3"><div className="space-y-1"><Label className="text-xs">Content</Label><Textarea value={content.body || ""} onChange={e => updateContent("body", e.target.value)} className="text-xs min-h-[120px]" /></div></div>;

    case "image":
      return (
        <div className="space-y-3">
          <ImageUploadField content={content} updateContent={updateContent} fileRef={fileRef} handleImageUpload={handleImageUpload} fieldKey="imageUrl" label="Image" />
          <div className="space-y-1"><Label className="text-xs">Caption</Label><Input value={content.caption || ""} onChange={e => updateContent("caption", e.target.value)} className="h-8 text-xs" /></div>
          <div className="space-y-1"><Label className="text-xs">Alt Text</Label><Input value={content.alt || ""} onChange={e => updateContent("alt", e.target.value)} className="h-8 text-xs" /></div>
        </div>
      );

    case "cover_hero":
      return (
        <div className="space-y-3">
          <ImageUploadField content={content} updateContent={updateContent} fileRef={fileRef} handleImageUpload={handleImageUpload} fieldKey="imageUrl" label="Background Image" />
          <div className="space-y-1"><Label className="text-xs">Overlay Text</Label><Input value={content.overlayText || ""} onChange={e => updateContent("overlayText", e.target.value)} className="h-8 text-xs" /></div>
          <div className="space-y-1"><Label className="text-xs">Subtext</Label><Input value={content.overlaySubtext || ""} onChange={e => updateContent("overlaySubtext", e.target.value)} className="h-8 text-xs" /></div>
          <div className="flex items-center justify-between"><Label className="text-xs">Dark Overlay</Label><Switch checked={content.overlay ?? true} onCheckedChange={v => updateContent("overlay", v)} /></div>
        </div>
      );

    case "hero_video":
      return (
        <div className="space-y-3">
          <div className="space-y-1"><Label className="text-xs">Video URL</Label><Input value={content.heroVideoUrl || ""} onChange={e => updateContent("heroVideoUrl", e.target.value)} className="h-8 text-xs" placeholder="YouTube or direct URL" /></div>
          <div className="space-y-1"><Label className="text-xs">Overlay Text</Label><Input value={content.heroOverlayText || ""} onChange={e => updateContent("heroOverlayText", e.target.value)} className="h-8 text-xs" /></div>
          <div className="space-y-1"><Label className="text-xs">Subtext</Label><Input value={content.heroOverlaySubtext || ""} onChange={e => updateContent("heroOverlaySubtext", e.target.value)} className="h-8 text-xs" /></div>
          <div className="flex items-center justify-between"><Label className="text-xs">Dark Overlay</Label><Switch checked={content.heroOverlay ?? true} onCheckedChange={v => updateContent("heroOverlay", v)} /></div>
        </div>
      );

    case "spacer":
      return <div className="space-y-3"><div className="space-y-1"><Label className="text-xs">Height: {content.height || 48}px</Label><Slider value={[content.height || 48]} onValueChange={([v]) => updateContent("height", v)} min={8} max={200} step={4} /></div></div>;

    case "button":
      return (
        <div className="space-y-3">
          <div className="space-y-1"><Label className="text-xs">Label</Label><Input value={content.label || ""} onChange={e => updateContent("label", e.target.value)} className="h-8 text-xs" /></div>
          <div className="space-y-1"><Label className="text-xs">URL</Label><Input value={content.url || ""} onChange={e => updateContent("url", e.target.value)} className="h-8 text-xs" placeholder="https://..." /></div>
          <div className="space-y-1"><Label className="text-xs">Variant</Label>
            <Select value={content.variant || "primary"} onValueChange={v => updateContent("variant", v)}>
              <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="primary">Primary</SelectItem>
                <SelectItem value="outline">Outline</SelectItem>
                <SelectItem value="ghost">Ghost</SelectItem>
                <SelectItem value="gradient">Gradient</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1"><Label className="text-xs">Size</Label>
            <Select value={content.buttonSize || "md"} onValueChange={v => updateContent("buttonSize", v)}>
              <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="sm">Small</SelectItem>
                <SelectItem value="md">Medium</SelectItem>
                <SelectItem value="lg">Large</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      );

    case "countdown":
    case "countdown_flip":
      return (
        <div className="space-y-3">
          <div className="space-y-1"><Label className="text-xs">Target Date</Label><Input type="datetime-local" value={content.targetDate?.slice(0, 16) || ""} onChange={e => updateContent("targetDate", e.target.value ? new Date(e.target.value).toISOString() : "")} className="h-8 text-xs" /></div>
          {blockType === "countdown" && (
            <div className="space-y-1"><Label className="text-xs">Style</Label>
              <Select value={content.countdownStyle || "simple"} onValueChange={v => updateContent("countdownStyle", v)}>
                <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="simple">Simple</SelectItem>
                  <SelectItem value="flip">Flip</SelectItem>
                  <SelectItem value="circle">Circle</SelectItem>
                  <SelectItem value="minimal">Minimal</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          {blockType === "countdown_flip" && (
            <div className="space-y-1"><Label className="text-xs">Theme</Label>
              <Select value={content.flipStyle || "dark"} onValueChange={v => updateContent("flipStyle", v)}>
                <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="glass">Glass</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          <div className="flex items-center justify-between"><Label className="text-xs">Days</Label><Switch checked={content.showDays ?? true} onCheckedChange={v => updateContent("showDays", v)} /></div>
          <div className="flex items-center justify-between"><Label className="text-xs">Hours</Label><Switch checked={content.showHours ?? true} onCheckedChange={v => updateContent("showHours", v)} /></div>
          <div className="flex items-center justify-between"><Label className="text-xs">Minutes</Label><Switch checked={content.showMinutes ?? true} onCheckedChange={v => updateContent("showMinutes", v)} /></div>
          <div className="flex items-center justify-between"><Label className="text-xs">Seconds</Label><Switch checked={content.showSeconds ?? true} onCheckedChange={v => updateContent("showSeconds", v)} /></div>
        </div>
      );

    case "location":
      return (
        <div className="space-y-3">
          <div className="space-y-1"><Label className="text-xs">Venue Name</Label><Input value={content.venueName || ""} onChange={e => updateContent("venueName", e.target.value)} className="h-8 text-xs" /></div>
          <div className="space-y-1"><Label className="text-xs">Address</Label><Input value={content.venueAddress || ""} onChange={e => updateContent("venueAddress", e.target.value)} className="h-8 text-xs" /></div>
          <div className="space-y-1"><Label className="text-xs">Map URL</Label><Input value={content.mapUrl || ""} onChange={e => updateContent("mapUrl", e.target.value)} className="h-8 text-xs" placeholder="https://maps.google.com/..." /></div>
          <div className="space-y-1"><Label className="text-xs">Phone</Label><Input value={content.venuePhone || ""} onChange={e => updateContent("venuePhone", e.target.value)} className="h-8 text-xs" /></div>
          <div className="flex items-center justify-between"><Label className="text-xs">Show Directions</Label><Switch checked={content.showDirections ?? true} onCheckedChange={v => updateContent("showDirections", v)} /></div>
        </div>
      );

    case "map_embed":
      return (
        <div className="space-y-3">
          <div className="space-y-1"><Label className="text-xs">Google Maps Embed URL</Label><Input value={content.mapEmbedUrl || ""} onChange={e => updateContent("mapEmbedUrl", e.target.value)} className="h-8 text-xs" placeholder="https://www.google.com/maps/embed?..." /></div>
          <div className="space-y-1"><Label className="text-xs">Height: {content.mapHeight || 300}px</Label><Slider value={[content.mapHeight || 300]} onValueChange={([v]) => updateContent("mapHeight", v)} min={150} max={600} step={10} /></div>
        </div>
      );

    case "timeline":
      return (
        <div className="space-y-3">
          <div className="space-y-1"><Label className="text-xs">Layout</Label>
            <Select value={content.timelineLayout || "vertical"} onValueChange={v => updateContent("timelineLayout", v)}>
              <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="vertical">Vertical</SelectItem>
                <SelectItem value="horizontal">Horizontal</SelectItem>
                <SelectItem value="alternating">Alternating</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <ListEditor label="Events" items={content.events} listKey="events"
            addItem={() => addListItem("events", { time: "", title: "New Event", description: "" })}
            removeItem={i => removeListItem("events", i)}
            renderItem={(ev, i) => (
              <>
                <Input value={ev.time || ""} onChange={e => updateListItem("events", i, "time", e.target.value)} placeholder="Time" className="h-7 text-[10px]" />
                <Input value={ev.title || ""} onChange={e => updateListItem("events", i, "title", e.target.value)} placeholder="Title" className="h-7 text-[10px]" />
                <Input value={ev.description || ""} onChange={e => updateListItem("events", i, "description", e.target.value)} placeholder="Description" className="h-7 text-[10px]" />
              </>
            )} />
        </div>
      );

    case "entourage":
      return (
        <div className="space-y-3">
          <div className="space-y-1"><Label className="text-xs">Section Title</Label><Input value={content.entourageTitle || ""} onChange={e => updateContent("entourageTitle", e.target.value)} className="h-8 text-xs" /></div>
          <div className="space-y-1"><Label className="text-xs">Type</Label>
            <Select value={content.entourageType || "custom"} onValueChange={v => updateContent("entourageType", v)}>
              <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="roses">18 Roses</SelectItem>
                <SelectItem value="candles">18 Candles</SelectItem>
                <SelectItem value="treasures">18 Treasures</SelectItem>
                <SelectItem value="blue_bills">18 Blue Bills</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1"><Label className="text-xs">Layout</Label>
            <Select value={content.entourageLayout || "grid"} onValueChange={v => updateContent("entourageLayout", v)}>
              <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="grid">Grid</SelectItem>
                <SelectItem value="list">List</SelectItem>
                <SelectItem value="carousel">Carousel</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <ListEditor label="People" items={content.people} listKey="people"
            addItem={() => addListItem("people", { name: "", role: "", message: "" })}
            removeItem={i => removeListItem("people", i)}
            renderItem={(p, i) => (
              <>
                <Input value={p.name || ""} onChange={e => updateListItem("people", i, "name", e.target.value)} placeholder="Name" className="h-7 text-[10px]" />
                <Input value={p.role || ""} onChange={e => updateListItem("people", i, "role", e.target.value)} placeholder="Role" className="h-7 text-[10px]" />
              </>
            )} />
        </div>
      );

    case "dress_code":
      return (
        <div className="space-y-3">
          <div className="space-y-1"><Label className="text-xs">Note</Label><Input value={content.dressCodeNote || ""} onChange={e => updateContent("dressCodeNote", e.target.value)} className="h-8 text-xs" /></div>
          <ListEditor label="Colors" items={content.colors} listKey="colors"
            addItem={() => addListItem("colors", { hex: "#000000", name: "" })}
            removeItem={i => removeListItem("colors", i)}
            renderItem={(c, i) => (
              <div className="flex items-center gap-2">
                <input type="color" value={c.hex} onChange={e => updateListItem("colors", i, "hex", e.target.value)} className="h-7 w-7 rounded cursor-pointer" />
                <Input value={c.name || ""} onChange={e => updateListItem("colors", i, "name", e.target.value)} placeholder="Name" className="h-7 text-[10px] flex-1" />
              </div>
            )} />
        </div>
      );

    case "gift_registry":
      return (
        <div className="space-y-3">
          <div className="space-y-1"><Label className="text-xs">Title</Label><Input value={content.registryTitle || ""} onChange={e => updateContent("registryTitle", e.target.value)} className="h-8 text-xs" /></div>
          <ListEditor label="Items" items={content.items} listKey="items"
            addItem={() => addListItem("items", { name: "", description: "", url: "" })}
            removeItem={i => removeListItem("items", i)}
            renderItem={(item, i) => (
              <>
                <Input value={item.name || ""} onChange={e => updateListItem("items", i, "name", e.target.value)} placeholder="Item name" className="h-7 text-[10px]" />
                <Input value={item.description || ""} onChange={e => updateListItem("items", i, "description", e.target.value)} placeholder="Description" className="h-7 text-[10px]" />
                <Input value={item.url || ""} onChange={e => updateListItem("items", i, "url", e.target.value)} placeholder="URL" className="h-7 text-[10px]" />
                <Input value={item.price || ""} onChange={e => updateListItem("items", i, "price", e.target.value)} placeholder="Price" className="h-7 text-[10px]" />
              </>
            )} />
        </div>
      );

    case "faq":
      return (
        <div className="space-y-3">
          <div className="space-y-1"><Label className="text-xs">Title</Label><Input value={content.faqTitle || ""} onChange={e => updateContent("faqTitle", e.target.value)} className="h-8 text-xs" /></div>
          <ListEditor label="Questions" items={content.faqs} listKey="faqs"
            addItem={() => addListItem("faqs", { question: "", answer: "" })}
            removeItem={i => removeListItem("faqs", i)}
            renderItem={(faq, i) => (
              <>
                <Input value={faq.question || ""} onChange={e => updateListItem("faqs", i, "question", e.target.value)} placeholder="Question" className="h-7 text-[10px]" />
                <Textarea value={faq.answer || ""} onChange={e => updateListItem("faqs", i, "answer", e.target.value)} placeholder="Answer" className="text-[10px] min-h-[60px]" />
              </>
            )} />
        </div>
      );

    case "accordion":
      return (
        <div className="space-y-3">
          <div className="space-y-1"><Label className="text-xs">Style</Label>
            <Select value={content.accordionStyle || "bordered"} onValueChange={v => updateContent("accordionStyle", v)}>
              <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="simple">Simple</SelectItem>
                <SelectItem value="bordered">Bordered</SelectItem>
                <SelectItem value="filled">Filled</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <ListEditor label="Items" items={content.accordionItems} listKey="accordionItems"
            addItem={() => addListItem("accordionItems", { title: "Section", content: "Content..." })}
            removeItem={i => removeListItem("accordionItems", i)}
            renderItem={(item, i) => (
              <>
                <Input value={item.title || ""} onChange={e => updateListItem("accordionItems", i, "title", e.target.value)} placeholder="Title" className="h-7 text-[10px]" />
                <Textarea value={item.content || ""} onChange={e => updateListItem("accordionItems", i, "content", e.target.value)} placeholder="Content" className="text-[10px] min-h-[50px]" />
              </>
            )} />
        </div>
      );

    case "icon_text":
      return (
        <div className="space-y-3">
          <div className="space-y-1"><Label className="text-xs">Icon</Label>
            <Select value={content.iconName || "Heart"} onValueChange={v => updateContent("iconName", v)}>
              <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                {["Heart", "Star", "Gift", "Music", "Camera", "MapPin", "Clock", "Users", "Mail", "Phone", "Calendar", "Sparkles"].map(icon => (
                  <SelectItem key={icon} value={icon}>{icon}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1"><Label className="text-xs">Size</Label>
            <Select value={content.iconSize || "md"} onValueChange={v => updateContent("iconSize", v)}>
              <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="sm">Small</SelectItem>
                <SelectItem value="md">Medium</SelectItem>
                <SelectItem value="lg">Large</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1"><Label className="text-xs">Title</Label><Input value={content.title || ""} onChange={e => updateContent("title", e.target.value)} className="h-8 text-xs" /></div>
          <div className="space-y-1"><Label className="text-xs">Description</Label><Textarea value={content.description || ""} onChange={e => updateContent("description", e.target.value)} className="text-xs min-h-[60px]" /></div>
        </div>
      );

    case "testimonial":
      return (
        <div className="space-y-3">
          <ListEditor label="Testimonials" items={content.testimonials} listKey="testimonials"
            addItem={() => addListItem("testimonials", { quote: "", author: "", role: "" })}
            removeItem={i => removeListItem("testimonials", i)}
            renderItem={(t, i) => (
              <>
                <Textarea value={t.quote || ""} onChange={e => updateListItem("testimonials", i, "quote", e.target.value)} placeholder="Quote" className="text-[10px] min-h-[50px]" />
                <Input value={t.author || ""} onChange={e => updateListItem("testimonials", i, "author", e.target.value)} placeholder="Author" className="h-7 text-[10px]" />
                <Input value={t.role || ""} onChange={e => updateListItem("testimonials", i, "role", e.target.value)} placeholder="Role" className="h-7 text-[10px]" />
              </>
            )} />
        </div>
      );

    case "marquee_text":
      return (
        <div className="space-y-3">
          <div className="space-y-1"><Label className="text-xs">Text</Label><Input value={content.marqueeText || ""} onChange={e => updateContent("marqueeText", e.target.value)} className="h-8 text-xs" /></div>
          <div className="space-y-1"><Label className="text-xs">Speed: {content.marqueeSpeed || 20}s</Label><Slider value={[content.marqueeSpeed || 20]} onValueChange={([v]) => updateContent("marqueeSpeed", v)} min={5} max={60} step={1} /></div>
          <div className="space-y-1"><Label className="text-xs">Direction</Label>
            <Select value={content.marqueeDirection || "left"} onValueChange={v => updateContent("marqueeDirection", v)}>
              <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="left">Left</SelectItem>
                <SelectItem value="right">Right</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      );

    case "separator_fancy":
      return (
        <div className="space-y-3">
          <div className="space-y-1"><Label className="text-xs">Style</Label>
            <Select value={content.separatorStyle || "floral"} onValueChange={v => updateContent("separatorStyle", v)}>
              <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="dots">Dots</SelectItem>
                <SelectItem value="stars">Stars</SelectItem>
                <SelectItem value="hearts">Hearts</SelectItem>
                <SelectItem value="floral">Floral</SelectItem>
                <SelectItem value="wave">Wave</SelectItem>
                <SelectItem value="diamond">Diamond</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      );

    case "audio_player":
      return (
        <div className="space-y-3">
          <div className="space-y-1"><Label className="text-xs">Audio URL</Label><Input value={content.audioUrl || ""} onChange={e => updateContent("audioUrl", e.target.value)} className="h-8 text-xs" /></div>
          <div className="space-y-1"><Label className="text-xs">Title</Label><Input value={content.audioTitle || ""} onChange={e => updateContent("audioTitle", e.target.value)} className="h-8 text-xs" /></div>
          <div className="space-y-1"><Label className="text-xs">Artist</Label><Input value={content.audioArtist || ""} onChange={e => updateContent("audioArtist", e.target.value)} className="h-8 text-xs" /></div>
          <div className="flex items-center justify-between"><Label className="text-xs">Autoplay</Label><Switch checked={content.audioAutoplay ?? false} onCheckedChange={v => updateContent("audioAutoplay", v)} /></div>
        </div>
      );

    case "music_player":
      return (
        <div className="space-y-3">
          <div className="space-y-1"><Label className="text-xs">Music URL</Label><Input value={content.musicUrl || ""} onChange={e => updateContent("musicUrl", e.target.value)} className="h-8 text-xs" /></div>
          <div className="space-y-1"><Label className="text-xs">Title</Label><Input value={content.musicTitle || ""} onChange={e => updateContent("musicTitle", e.target.value)} className="h-8 text-xs" /></div>
          <div className="space-y-1"><Label className="text-xs">Artist</Label><Input value={content.musicArtist || ""} onChange={e => updateContent("musicArtist", e.target.value)} className="h-8 text-xs" /></div>
          <ImageUploadField content={content} updateContent={updateContent} fileRef={fileRef} handleImageUpload={handleImageUpload} fieldKey="musicCoverUrl" label="Cover Art" />
          <div className="flex items-center justify-between"><Label className="text-xs">Autoplay</Label><Switch checked={content.musicAutoplay ?? false} onCheckedChange={v => updateContent("musicAutoplay", v)} /></div>
        </div>
      );

    case "two_column":
    case "three_column": {
      const count = blockType === "two_column" ? 2 : 3;
      return (
        <div className="space-y-3">
          {blockType === "two_column" && (
            <div className="space-y-1"><Label className="text-xs">Ratio</Label>
              <Select value={content.columnRatio || "1:1"} onValueChange={v => updateContent("columnRatio", v)}>
                <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="1:1">Equal (1:1)</SelectItem>
                  <SelectItem value="2:1">Wide Left (2:1)</SelectItem>
                  <SelectItem value="1:2">Wide Right (1:2)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          {Array.from({ length: count }).map((_, i) => (
            <div key={i} className="space-y-1">
              <Label className="text-xs">Column {i + 1}</Label>
              <Textarea value={(content.columnContent || [])[i] || ""} onChange={e => {
                const cols = [...(content.columnContent || [])];
                cols[i] = e.target.value;
                updateContent("columnContent", cols);
              }} className="text-xs min-h-[60px]" />
            </div>
          ))}
        </div>
      );
    }

    case "rsvp":
      return (
        <div className="space-y-3">
          <div className="space-y-1"><Label className="text-xs">Title</Label><Input value={content.rsvpTitle || ""} onChange={e => updateContent("rsvpTitle", e.target.value)} className="h-8 text-xs" /></div>
          <div className="space-y-1"><Label className="text-xs">Subtitle</Label><Input value={content.rsvpSubtitle || ""} onChange={e => updateContent("rsvpSubtitle", e.target.value)} className="h-8 text-xs" /></div>
          <div className="flex items-center justify-between"><Label className="text-xs">Dietary Notes</Label><Switch checked={content.showDietaryNotes ?? true} onCheckedChange={v => updateContent("showDietaryNotes", v)} /></div>
          <div className="flex items-center justify-between"><Label className="text-xs">Companions</Label><Switch checked={content.showCompanions ?? true} onCheckedChange={v => updateContent("showCompanions", v)} /></div>
          <div className="flex items-center justify-between"><Label className="text-xs">Message</Label><Switch checked={content.showMessage ?? true} onCheckedChange={v => updateContent("showMessage", v)} /></div>
          {content.showCompanions && (
            <div className="space-y-1"><Label className="text-xs">Max Companions</Label><Input type="number" value={content.maxCompanions || 3} onChange={e => updateContent("maxCompanions", parseInt(e.target.value))} className="h-8 text-xs" min={0} max={10} /></div>
          )}
        </div>
      );

    case "video":
      return (
        <div className="space-y-3">
          <div className="space-y-1"><Label className="text-xs">Video URL</Label><Input value={content.videoUrl || ""} onChange={e => updateContent("videoUrl", e.target.value)} placeholder="YouTube or direct URL" className="h-8 text-xs" /></div>
          <div className="space-y-1"><Label className="text-xs">Poster URL</Label><Input value={content.posterUrl || ""} onChange={e => updateContent("posterUrl", e.target.value)} placeholder="Thumbnail image" className="h-8 text-xs" /></div>
          <div className="flex items-center justify-between"><Label className="text-xs">Autoplay</Label><Switch checked={content.autoplay ?? false} onCheckedChange={v => updateContent("autoplay", v)} /></div>
          <div className="flex items-center justify-between"><Label className="text-xs">Muted</Label><Switch checked={content.muted ?? false} onCheckedChange={v => updateContent("muted", v)} /></div>
          <div className="flex items-center justify-between"><Label className="text-xs">Loop</Label><Switch checked={content.loop ?? false} onCheckedChange={v => updateContent("loop", v)} /></div>
        </div>
      );

    case "embed":
      return (
        <div className="space-y-3">
          <div className="space-y-1"><Label className="text-xs">Embed URL</Label><Input value={content.embedUrl || ""} onChange={e => updateContent("embedUrl", e.target.value)} className="h-8 text-xs" /></div>
          <div className="space-y-1"><Label className="text-xs">Type</Label>
            <Select value={content.embedType || "youtube"} onValueChange={v => updateContent("embedType", v)}>
              <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="youtube">YouTube</SelectItem>
                <SelectItem value="spotify">Spotify</SelectItem>
                <SelectItem value="vimeo">Vimeo</SelectItem>
                <SelectItem value="tiktok">TikTok</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1"><Label className="text-xs">Height: {content.embedHeight || 315}px</Label><Slider value={[content.embedHeight || 315]} onValueChange={([v]) => updateContent("embedHeight", v)} min={100} max={600} step={5} /></div>
        </div>
      );

    case "social_links":
      return (
        <div className="space-y-3">
          <div className="space-y-1"><Label className="text-xs">Title</Label><Input value={content.socialTitle || ""} onChange={e => updateContent("socialTitle", e.target.value)} className="h-8 text-xs" /></div>
          <div className="space-y-1"><Label className="text-xs">Style</Label>
            <Select value={content.socialStyle || "icons"} onValueChange={v => updateContent("socialStyle", v)}>
              <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="icons">Icons</SelectItem>
                <SelectItem value="buttons">Buttons</SelectItem>
                <SelectItem value="pills">Pills</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <ListEditor label="Links" items={content.links} listKey="links"
            addItem={() => addListItem("links", { platform: "instagram", url: "", label: "" })}
            removeItem={i => removeListItem("links", i)}
            renderItem={(link, i) => (
              <>
                <Select value={link.platform || "instagram"} onValueChange={v => updateListItem("links", i, "platform", v)}>
                  <SelectTrigger className="h-7 text-[10px]"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["instagram", "facebook", "twitter", "tiktok", "youtube", "spotify", "website", "whatsapp", "telegram", "linkedin"].map(p => (
                      <SelectItem key={p} value={p} className="capitalize">{p}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input value={link.url || ""} onChange={e => updateListItem("links", i, "url", e.target.value)} placeholder="URL" className="h-7 text-[10px]" />
              </>
            )} />
        </div>
      );

    case "seating_chart":
      return (
        <div className="space-y-3">
          <div className="space-y-1"><Label className="text-xs">Title</Label><Input value={content.seatingTitle || ""} onChange={e => updateContent("seatingTitle", e.target.value)} className="h-8 text-xs" /></div>
          <ListEditor label="Tables" items={content.tables} listKey="tables"
            addItem={() => addListItem("tables", { name: "Table 1", seats: [] })}
            removeItem={i => removeListItem("tables", i)}
            renderItem={(table, i) => (
              <>
                <Input value={table.name || ""} onChange={e => updateListItem("tables", i, "name", e.target.value)} placeholder="Table name" className="h-7 text-[10px]" />
                <Input value={(table.seats || []).join(", ")} onChange={e => updateListItem("tables", i, "seats", e.target.value.split(",").map((s: string) => s.trim()))} placeholder="Names (comma-separated)" className="h-7 text-[10px]" />
              </>
            )} />
        </div>
      );

    case "pricing_table":
      return (
        <div className="space-y-3">
          <div className="space-y-1"><Label className="text-xs">Title</Label><Input value={content.pricingTitle || ""} onChange={e => updateContent("pricingTitle", e.target.value)} className="h-8 text-xs" /></div>
          <ListEditor label="Packages" items={content.pricingItems} listKey="pricingItems"
            addItem={() => addListItem("pricingItems", { name: "Package", price: "₱0", description: "" })}
            removeItem={i => removeListItem("pricingItems", i)}
            renderItem={(item, i) => (
              <>
                <Input value={item.name || ""} onChange={e => updateListItem("pricingItems", i, "name", e.target.value)} placeholder="Name" className="h-7 text-[10px]" />
                <Input value={item.price || ""} onChange={e => updateListItem("pricingItems", i, "price", e.target.value)} placeholder="Price" className="h-7 text-[10px]" />
                <Input value={item.description || ""} onChange={e => updateListItem("pricingItems", i, "description", e.target.value)} placeholder="Description" className="h-7 text-[10px]" />
              </>
            )} />
        </div>
      );

    case "contact_card":
      return (
        <div className="space-y-3">
          <div className="space-y-1"><Label className="text-xs">Name</Label><Input value={content.contactName || ""} onChange={e => updateContent("contactName", e.target.value)} className="h-8 text-xs" /></div>
          <div className="space-y-1"><Label className="text-xs">Role</Label><Input value={content.contactRole || ""} onChange={e => updateContent("contactRole", e.target.value)} className="h-8 text-xs" /></div>
          <div className="space-y-1"><Label className="text-xs">Phone</Label><Input value={content.contactPhone || ""} onChange={e => updateContent("contactPhone", e.target.value)} className="h-8 text-xs" /></div>
          <div className="space-y-1"><Label className="text-xs">Email</Label><Input value={content.contactEmail || ""} onChange={e => updateContent("contactEmail", e.target.value)} className="h-8 text-xs" /></div>
          <ImageUploadField content={content} updateContent={updateContent} fileRef={fileRef} handleImageUpload={handleImageUpload} fieldKey="contactImageUrl" label="Photo" />
        </div>
      );

    case "weather_widget":
      return (
        <div className="space-y-3">
          <div className="space-y-1"><Label className="text-xs">Location</Label><Input value={content.weatherLocation || ""} onChange={e => updateContent("weatherLocation", e.target.value)} className="h-8 text-xs" placeholder="City, Country" /></div>
          <div className="space-y-1"><Label className="text-xs">Event Date</Label><Input type="date" value={content.weatherDate || ""} onChange={e => updateContent("weatherDate", e.target.value)} className="h-8 text-xs" /></div>
        </div>
      );

    case "qr_code":
      return (
        <div className="space-y-3">
          <div className="space-y-1"><Label className="text-xs">Data/URL</Label><Input value={content.qrData || ""} onChange={e => updateContent("qrData", e.target.value)} className="h-8 text-xs" placeholder="https://..." /></div>
          <div className="space-y-1"><Label className="text-xs">Label</Label><Input value={content.qrLabel || ""} onChange={e => updateContent("qrLabel", e.target.value)} className="h-8 text-xs" /></div>
          <div className="space-y-1"><Label className="text-xs">Size: {content.qrSize || 200}px</Label><Slider value={[content.qrSize || 200]} onValueChange={([v]) => updateContent("qrSize", v)} min={100} max={400} step={10} /></div>
        </div>
      );

    case "photo_upload_wall":
      return (
        <div className="space-y-3">
          <div className="space-y-1"><Label className="text-xs">Title</Label><Input value={content.wallTitle || ""} onChange={e => updateContent("wallTitle", e.target.value)} className="h-8 text-xs" /></div>
          <div className="space-y-1"><Label className="text-xs">Columns</Label>
            <Select value={String(content.wallColumns || 3)} onValueChange={v => updateContent("wallColumns", parseInt(v))}>
              <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="2">2</SelectItem>
                <SelectItem value="3">3</SelectItem>
                <SelectItem value="4">4</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      );

    case "quote":
      return (
        <div className="space-y-3">
          <div className="space-y-1"><Label className="text-xs">Quote</Label><Textarea value={content.body || ""} onChange={e => updateContent("body", e.target.value)} className="text-xs min-h-[80px]" /></div>
          <div className="space-y-1"><Label className="text-xs">Author</Label><Input value={content.author || ""} onChange={e => updateContent("author", e.target.value)} className="h-8 text-xs" /></div>
        </div>
      );

    case "gallery":
      return (
        <div className="space-y-3">
          <div className="space-y-1"><Label className="text-xs">Layout</Label>
            <Select value={content.galleryLayout || "grid"} onValueChange={v => updateContent("galleryLayout", v)}>
              <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="grid">Grid</SelectItem>
                <SelectItem value="masonry">Masonry</SelectItem>
                <SelectItem value="carousel">Carousel</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1"><Label className="text-xs">Columns</Label>
            <Select value={String(content.columns || 3)} onValueChange={v => updateContent("columns", parseInt(v))}>
              <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="2">2</SelectItem>
                <SelectItem value="3">3</SelectItem>
                <SelectItem value="4">4</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between"><Label className="text-xs">Show Captions</Label><Switch checked={content.showCaptions ?? false} onCheckedChange={v => updateContent("showCaptions", v)} /></div>
          <Button variant="outline" size="sm" className="w-full text-xs" onClick={() => { fileRef.current!.onchange = async (e: any) => {
            const file = e.target.files?.[0];
            if (!file) return;
            try {
              const url = await uploadFile("invitation-assets", file, `blocks/gallery`);
              addListItem("images", { url, caption: "" });
              toast.success("Image added");
            } catch (err: any) { toast.error(err.message); }
          }; fileRef.current?.click(); }}>
            <Upload className="h-3 w-3 mr-1" /> Add Image
          </Button>
          {(content.images || []).map((img: any, i: number) => (
            <div key={i} className="flex items-center gap-2 p-1">
              <img src={img.url} alt="" className="h-10 w-10 object-cover rounded" />
              <Input value={img.caption || ""} onChange={e => updateListItem("images", i, "caption", e.target.value)} placeholder="Caption" className="h-7 text-[10px] flex-1" />
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeListItem("images", i)}><Trash2 className="h-3 w-3" /></Button>
            </div>
          ))}
        </div>
      );

    case "guestbook":
      return (
        <div className="space-y-3">
          <div className="space-y-1"><Label className="text-xs">Title</Label><Input value={content.guestbookTitle || ""} onChange={e => updateContent("guestbookTitle", e.target.value)} className="h-8 text-xs" /></div>
          <div className="flex items-center justify-between"><Label className="text-xs">Show Timestamps</Label><Switch checked={content.showTimestamp ?? true} onCheckedChange={v => updateContent("showTimestamp", v)} /></div>
          <div className="flex items-center justify-between"><Label className="text-xs">Show Avatars</Label><Switch checked={content.showAvatar ?? true} onCheckedChange={v => updateContent("showAvatar", v)} /></div>
        </div>
      );

    case "photo_collage":
      return (
        <div className="space-y-3">
          <div className="space-y-1"><Label className="text-xs">Layout</Label>
            <Select value={content.layout || "grid"} onValueChange={v => updateContent("layout", v)}>
              <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="grid">Grid</SelectItem>
                <SelectItem value="masonry">Masonry</SelectItem>
                <SelectItem value="carousel">Carousel</SelectItem>
                <SelectItem value="mosaic">Mosaic</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      );

    default:
      return <p className="text-xs text-muted-foreground">No settings for this block type.</p>;
  }
}

// Reusable components
function ImageUploadField({ content, updateContent, fileRef, handleImageUpload, fieldKey, label }: {
  content: any; updateContent: (k: string, v: any) => void;
  fileRef: React.RefObject<HTMLInputElement | null>;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>, key: string) => void;
  fieldKey: string; label: string;
}) {
  return (
    <div className="space-y-1">
      <Label className="text-xs">{label}</Label>
      {content[fieldKey] ? (
        <div className="relative">
          <img src={content[fieldKey]} alt="" className="w-full h-24 object-cover rounded" />
          <Button variant="destructive" size="icon" className="absolute top-1 right-1 h-6 w-6" onClick={() => updateContent(fieldKey, "")}><Trash2 className="h-3 w-3" /></Button>
        </div>
      ) : (
        <Button variant="outline" size="sm" className="w-full text-xs" onClick={() => { fileRef.current!.onchange = (e) => handleImageUpload(e as any, fieldKey); fileRef.current?.click(); }}>
          <Upload className="h-3 w-3 mr-1" /> Upload
        </Button>
      )}
    </div>
  );
}

function ListEditor({ label, items, listKey, addItem, removeItem, renderItem }: {
  label: string; items: any[]; listKey: string;
  addItem: () => void; removeItem: (i: number) => void;
  renderItem: (item: any, i: number) => React.ReactNode;
}) {
  return (
    <>
      <div className="flex items-center justify-between">
        <Label className="text-xs font-semibold">{label} ({(items || []).length})</Label>
        <Button variant="outline" size="sm" className="h-6 text-[10px]" onClick={addItem}><Plus className="h-3 w-3 mr-1" /> Add</Button>
      </div>
      {(items || []).map((item: any, i: number) => (
        <div key={i} className="space-y-1 p-2 bg-accent/30 rounded-lg relative">
          <Button variant="ghost" size="icon" className="absolute top-1 right-1 h-5 w-5" onClick={() => removeItem(i)}><Trash2 className="h-3 w-3" /></Button>
          {renderItem(item, i)}
        </div>
      ))}
    </>
  );
}
