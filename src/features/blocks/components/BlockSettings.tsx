import { useState, useRef } from "react";
import { X, Plus, Trash2, Upload, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { BLOCK_REGISTRY } from "../registry";
import type { InvitationBlock, BlockContent, BlockStyle } from "../types";
import { uploadFile } from "@/features/admin/hooks/useInvitationData";
import { toast } from "sonner";

interface BlockSettingsProps {
  block: InvitationBlock;
  onUpdate: (content?: BlockContent, style?: BlockStyle) => void;
  onClose: () => void;
}

export function BlockSettings({ block, onUpdate, onClose }: BlockSettingsProps) {
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
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const addListItem = (key: string, item: any) => {
    updateContent(key, [...(content[key] || []), item]);
  };

  const removeListItem = (key: string, index: number) => {
    const arr = [...(content[key] || [])];
    arr.splice(index, 1);
    updateContent(key, arr);
  };

  const updateListItem = (key: string, index: number, field: string, value: any) => {
    const arr = [...(content[key] || [])];
    arr[index] = { ...arr[index], [field]: value };
    updateContent(key, arr);
  };

  return (
    <div className="w-72 border-l border-border bg-card flex flex-col h-full">
      <div className="p-3 border-b border-border flex items-center justify-between">
        <h3 className="font-display font-bold text-sm">{def?.label || "Settings"}</h3>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-3 space-y-4">
          {/* Content settings by block type */}
          {renderContentSettings(block.block_type, content, updateContent, addListItem, removeListItem, updateListItem, handleImageUpload, fileRef)}

          <Separator />

          {/* Style settings (universal) */}
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">Style</p>
            <div className="space-y-3">
              <div className="space-y-1">
                <Label className="text-xs">Text Align</Label>
                <Select value={style.textAlign || "center"} onValueChange={v => updateStyle("textAlign", v)}>
                  <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="left">Left</SelectItem>
                    <SelectItem value="center">Center</SelectItem>
                    <SelectItem value="right">Right</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Background Color</Label>
                <div className="flex gap-2">
                  <input type="color" value={style.backgroundColor || "#ffffff"} onChange={e => updateStyle("backgroundColor", e.target.value)} className="h-8 w-8 rounded cursor-pointer border" />
                  <Input value={style.backgroundColor || ""} onChange={e => updateStyle("backgroundColor", e.target.value)} placeholder="transparent" className="h-8 text-xs flex-1" />
                </div>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Text Color</Label>
                <div className="flex gap-2">
                  <input type="color" value={style.textColor || "#000000"} onChange={e => updateStyle("textColor", e.target.value)} className="h-8 w-8 rounded cursor-pointer border" />
                  <Input value={style.textColor || ""} onChange={e => updateStyle("textColor", e.target.value)} placeholder="inherit" className="h-8 text-xs flex-1" />
                </div>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Padding</Label>
                <Input value={style.padding || ""} onChange={e => updateStyle("padding", e.target.value)} placeholder="1rem" className="h-8 text-xs" />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-xs">Full Height</Label>
                <Switch checked={style.fullHeight || false} onCheckedChange={v => updateStyle("fullHeight", v)} />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-xs">Glassmorphism</Label>
                <Switch checked={style.glassmorphism || false} onCheckedChange={v => updateStyle("glassmorphism", v)} />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Animation</Label>
                <Select value={style.animation || "none"} onValueChange={v => updateStyle("animation", v)}>
                  <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="fade-up">Fade Up</SelectItem>
                    <SelectItem value="fade-in">Fade In</SelectItem>
                    <SelectItem value="slide-left">Slide Left</SelectItem>
                    <SelectItem value="slide-right">Slide Right</SelectItem>
                    <SelectItem value="zoom">Zoom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>
      <input ref={fileRef} type="file" accept="image/*" className="hidden" />
    </div>
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
          <div className="space-y-1">
            <Label className="text-xs">Heading Text</Label>
            <Input value={content.text || ""} onChange={e => updateContent("text", e.target.value)} className="h-8 text-xs" />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Level</Label>
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
      return (
        <div className="space-y-3">
          <div className="space-y-1">
            <Label className="text-xs">Content</Label>
            <Textarea value={content.body || ""} onChange={e => updateContent("body", e.target.value)} className="text-xs min-h-[120px]" />
          </div>
        </div>
      );

    case "image":
      return (
        <div className="space-y-3">
          <div className="space-y-1">
            <Label className="text-xs">Image</Label>
            {content.imageUrl ? (
              <div className="relative">
                <img src={content.imageUrl} alt="" className="w-full h-24 object-cover rounded" />
                <Button variant="destructive" size="icon" className="absolute top-1 right-1 h-6 w-6" onClick={() => updateContent("imageUrl", "")}>
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            ) : (
              <Button variant="outline" size="sm" className="w-full text-xs" onClick={() => { fileRef.current!.onchange = (e) => handleImageUpload(e as any, "imageUrl"); fileRef.current?.click(); }}>
                <Upload className="h-3 w-3 mr-1" /> Upload Image
              </Button>
            )}
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Caption</Label>
            <Input value={content.caption || ""} onChange={e => updateContent("caption", e.target.value)} className="h-8 text-xs" />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Alt Text</Label>
            <Input value={content.alt || ""} onChange={e => updateContent("alt", e.target.value)} className="h-8 text-xs" />
          </div>
        </div>
      );

    case "cover_hero":
      return (
        <div className="space-y-3">
          <div className="space-y-1">
            <Label className="text-xs">Background Image</Label>
            {content.imageUrl ? (
              <div className="relative">
                <img src={content.imageUrl} alt="" className="w-full h-24 object-cover rounded" />
                <Button variant="destructive" size="icon" className="absolute top-1 right-1 h-6 w-6" onClick={() => updateContent("imageUrl", "")}>
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            ) : (
              <Button variant="outline" size="sm" className="w-full text-xs" onClick={() => { fileRef.current!.onchange = (e) => handleImageUpload(e as any, "imageUrl"); fileRef.current?.click(); }}>
                <Upload className="h-3 w-3 mr-1" /> Upload
              </Button>
            )}
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Overlay Text</Label>
            <Input value={content.overlayText || ""} onChange={e => updateContent("overlayText", e.target.value)} className="h-8 text-xs" />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Subtext</Label>
            <Input value={content.overlaySubtext || ""} onChange={e => updateContent("overlaySubtext", e.target.value)} className="h-8 text-xs" />
          </div>
          <div className="flex items-center justify-between">
            <Label className="text-xs">Dark Overlay</Label>
            <Switch checked={content.overlay ?? true} onCheckedChange={v => updateContent("overlay", v)} />
          </div>
        </div>
      );

    case "spacer":
      return (
        <div className="space-y-3">
          <div className="space-y-1">
            <Label className="text-xs">Height: {content.height || 48}px</Label>
            <Slider value={[content.height || 48]} onValueChange={([v]) => updateContent("height", v)} min={8} max={200} step={4} />
          </div>
        </div>
      );

    case "button":
      return (
        <div className="space-y-3">
          <div className="space-y-1">
            <Label className="text-xs">Label</Label>
            <Input value={content.label || ""} onChange={e => updateContent("label", e.target.value)} className="h-8 text-xs" />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">URL</Label>
            <Input value={content.url || ""} onChange={e => updateContent("url", e.target.value)} className="h-8 text-xs" placeholder="https://..." />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Variant</Label>
            <Select value={content.variant || "primary"} onValueChange={v => updateContent("variant", v)}>
              <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="primary">Primary</SelectItem>
                <SelectItem value="outline">Outline</SelectItem>
                <SelectItem value="ghost">Ghost</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      );

    case "countdown":
      return (
        <div className="space-y-3">
          <div className="space-y-1">
            <Label className="text-xs">Target Date</Label>
            <Input type="datetime-local" value={content.targetDate?.slice(0, 16) || ""} onChange={e => updateContent("targetDate", e.target.value ? new Date(e.target.value).toISOString() : "")} className="h-8 text-xs" />
          </div>
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
        </div>
      );

    case "timeline":
      return (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-xs font-semibold">Events ({content.events?.length || 0})</Label>
            <Button variant="outline" size="sm" className="h-6 text-[10px]" onClick={() => addListItem("events", { time: "", title: "New Event", description: "" })}>
              <Plus className="h-3 w-3 mr-1" /> Add
            </Button>
          </div>
          {(content.events || []).map((ev: any, i: number) => (
            <div key={i} className="space-y-1 p-2 bg-accent/30 rounded-lg relative">
              <Button variant="ghost" size="icon" className="absolute top-1 right-1 h-5 w-5" onClick={() => removeListItem("events", i)}><Trash2 className="h-3 w-3" /></Button>
              <Input value={ev.time || ""} onChange={e => updateListItem("events", i, "time", e.target.value)} placeholder="Time" className="h-7 text-[10px]" />
              <Input value={ev.title || ""} onChange={e => updateListItem("events", i, "title", e.target.value)} placeholder="Title" className="h-7 text-[10px]" />
              <Input value={ev.description || ""} onChange={e => updateListItem("events", i, "description", e.target.value)} placeholder="Description" className="h-7 text-[10px]" />
            </div>
          ))}
        </div>
      );

    case "entourage":
      return (
        <div className="space-y-3">
          <div className="space-y-1">
            <Label className="text-xs">Section Title</Label>
            <Input value={content.entourageTitle || ""} onChange={e => updateContent("entourageTitle", e.target.value)} className="h-8 text-xs" />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Type</Label>
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
          <div className="flex items-center justify-between">
            <Label className="text-xs font-semibold">People ({content.people?.length || 0})</Label>
            <Button variant="outline" size="sm" className="h-6 text-[10px]" onClick={() => addListItem("people", { name: "", role: "", message: "" })}>
              <Plus className="h-3 w-3 mr-1" /> Add
            </Button>
          </div>
          {(content.people || []).map((p: any, i: number) => (
            <div key={i} className="space-y-1 p-2 bg-accent/30 rounded-lg relative">
              <Button variant="ghost" size="icon" className="absolute top-1 right-1 h-5 w-5" onClick={() => removeListItem("people", i)}><Trash2 className="h-3 w-3" /></Button>
              <Input value={p.name || ""} onChange={e => updateListItem("people", i, "name", e.target.value)} placeholder="Name" className="h-7 text-[10px]" />
              <Input value={p.role || ""} onChange={e => updateListItem("people", i, "role", e.target.value)} placeholder="Role/Message" className="h-7 text-[10px]" />
            </div>
          ))}
        </div>
      );

    case "dress_code":
      return (
        <div className="space-y-3">
          <div className="space-y-1"><Label className="text-xs">Note</Label><Input value={content.dressCodeNote || ""} onChange={e => updateContent("dressCodeNote", e.target.value)} className="h-8 text-xs" /></div>
          <div className="flex items-center justify-between">
            <Label className="text-xs font-semibold">Colors ({content.colors?.length || 0})</Label>
            <Button variant="outline" size="sm" className="h-6 text-[10px]" onClick={() => addListItem("colors", { hex: "#000000", name: "" })}>
              <Plus className="h-3 w-3 mr-1" /> Add
            </Button>
          </div>
          {(content.colors || []).map((c: any, i: number) => (
            <div key={i} className="flex items-center gap-2 p-1 bg-accent/30 rounded-lg">
              <input type="color" value={c.hex} onChange={e => updateListItem("colors", i, "hex", e.target.value)} className="h-7 w-7 rounded cursor-pointer" />
              <Input value={c.name || ""} onChange={e => updateListItem("colors", i, "name", e.target.value)} placeholder="Color name" className="h-7 text-[10px] flex-1" />
              <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0" onClick={() => removeListItem("colors", i)}><Trash2 className="h-3 w-3" /></Button>
            </div>
          ))}
        </div>
      );

    case "gift_registry":
      return (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-xs font-semibold">Items ({content.items?.length || 0})</Label>
            <Button variant="outline" size="sm" className="h-6 text-[10px]" onClick={() => addListItem("items", { name: "", description: "", url: "" })}>
              <Plus className="h-3 w-3 mr-1" /> Add
            </Button>
          </div>
          {(content.items || []).map((item: any, i: number) => (
            <div key={i} className="space-y-1 p-2 bg-accent/30 rounded-lg relative">
              <Button variant="ghost" size="icon" className="absolute top-1 right-1 h-5 w-5" onClick={() => removeListItem("items", i)}><Trash2 className="h-3 w-3" /></Button>
              <Input value={item.name || ""} onChange={e => updateListItem("items", i, "name", e.target.value)} placeholder="Item name" className="h-7 text-[10px]" />
              <Input value={item.url || ""} onChange={e => updateListItem("items", i, "url", e.target.value)} placeholder="Link URL" className="h-7 text-[10px]" />
            </div>
          ))}
        </div>
      );

    case "faq":
      return (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-xs font-semibold">Questions ({content.faqs?.length || 0})</Label>
            <Button variant="outline" size="sm" className="h-6 text-[10px]" onClick={() => addListItem("faqs", { question: "", answer: "" })}>
              <Plus className="h-3 w-3 mr-1" /> Add
            </Button>
          </div>
          {(content.faqs || []).map((faq: any, i: number) => (
            <div key={i} className="space-y-1 p-2 bg-accent/30 rounded-lg relative">
              <Button variant="ghost" size="icon" className="absolute top-1 right-1 h-5 w-5" onClick={() => removeListItem("faqs", i)}><Trash2 className="h-3 w-3" /></Button>
              <Input value={faq.question || ""} onChange={e => updateListItem("faqs", i, "question", e.target.value)} placeholder="Question" className="h-7 text-[10px]" />
              <Textarea value={faq.answer || ""} onChange={e => updateListItem("faqs", i, "answer", e.target.value)} placeholder="Answer" className="text-[10px] min-h-[60px]" />
            </div>
          ))}
        </div>
      );

    case "rsvp":
      return (
        <div className="space-y-3">
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
          <div className="flex items-center justify-between"><Label className="text-xs">Autoplay</Label><Switch checked={content.autoplay ?? false} onCheckedChange={v => updateContent("autoplay", v)} /></div>
        </div>
      );

    case "embed":
      return (
        <div className="space-y-3">
          <div className="space-y-1"><Label className="text-xs">Embed URL</Label><Input value={content.embedUrl || ""} onChange={e => updateContent("embedUrl", e.target.value)} className="h-8 text-xs" /></div>
          <div className="space-y-1">
            <Label className="text-xs">Type</Label>
            <Select value={content.embedType || "youtube"} onValueChange={v => updateContent("embedType", v)}>
              <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="youtube">YouTube</SelectItem>
                <SelectItem value="spotify">Spotify</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      );

    case "social_links":
      return (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-xs font-semibold">Links ({content.links?.length || 0})</Label>
            <Button variant="outline" size="sm" className="h-6 text-[10px]" onClick={() => addListItem("links", { platform: "instagram", url: "", label: "" })}>
              <Plus className="h-3 w-3 mr-1" /> Add
            </Button>
          </div>
          {(content.links || []).map((link: any, i: number) => (
            <div key={i} className="space-y-1 p-2 bg-accent/30 rounded-lg relative">
              <Button variant="ghost" size="icon" className="absolute top-1 right-1 h-5 w-5" onClick={() => removeListItem("links", i)}><Trash2 className="h-3 w-3" /></Button>
              <Select value={link.platform || "instagram"} onValueChange={v => updateListItem("links", i, "platform", v)}>
                <SelectTrigger className="h-7 text-[10px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="instagram">Instagram</SelectItem>
                  <SelectItem value="facebook">Facebook</SelectItem>
                  <SelectItem value="twitter">Twitter/X</SelectItem>
                  <SelectItem value="tiktok">TikTok</SelectItem>
                  <SelectItem value="website">Website</SelectItem>
                </SelectContent>
              </Select>
              <Input value={link.url || ""} onChange={e => updateListItem("links", i, "url", e.target.value)} placeholder="URL" className="h-7 text-[10px]" />
            </div>
          ))}
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
          <div className="space-y-1">
            <Label className="text-xs">Columns</Label>
            <Select value={String(content.columns || 3)} onValueChange={v => updateContent("columns", parseInt(v))}>
              <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="2">2</SelectItem>
                <SelectItem value="3">3</SelectItem>
                <SelectItem value="4">4</SelectItem>
              </SelectContent>
            </Select>
          </div>
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
        </div>
      );

    case "photo_collage":
      return (
        <div className="space-y-3">
          <div className="space-y-1">
            <Label className="text-xs">Layout</Label>
            <Select value={content.layout || "grid"} onValueChange={v => updateContent("layout", v)}>
              <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="grid">Grid</SelectItem>
                <SelectItem value="masonry">Masonry</SelectItem>
                <SelectItem value="carousel">Carousel</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      );

    default:
      return <p className="text-xs text-muted-foreground">No settings for this block type.</p>;
  }
}
