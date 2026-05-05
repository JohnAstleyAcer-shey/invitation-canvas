import { useRef } from "react";
import { Upload, Image as ImageIcon, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EnvelopeCover, ENVELOPE_PRESET_OPTIONS, type EnvelopeSettings } from "@/features/invitation/components/EnvelopeCover";
import { uploadFile } from "@/features/admin/hooks/useInvitationData";
import { toast } from "sonner";

interface Props {
  invitationId: string;
  enabled: boolean;
  settings: EnvelopeSettings;
  onChange: (next: { envelope_enabled?: boolean; envelope_settings?: EnvelopeSettings }) => void;
}

const SEAL_STYLES: EnvelopeSettings["seal_style"][] = ["wax-leaf", "wax-monogram", "wax-heart", "ribbon-bow", "stamp-circle", "none"];
const CTA_STYLES: EnvelopeSettings["cta_style"][] = ["minimal", "outline", "filled", "shimmer"];
const FONTS = ["Great Vibes", "Dancing Script", "Playfair Display", "Cormorant Garamond", "Allura", "Pinyon Script", "Tangerine"];

export function EnvelopeTab({ invitationId, enabled, settings, onChange }: Props) {
  const bgRef = useRef<HTMLInputElement>(null);
  const sealRef = useRef<HTMLInputElement>(null);

  const update = (patch: Partial<EnvelopeSettings>) => onChange({ envelope_settings: { ...settings, ...patch } });

  const upload = async (file: File, key: "background_image_url" | "seal_image_url") => {
    try {
      const url = await uploadFile("invitation-assets", file, `envelopes/${invitationId}`);
      update({ [key]: url } as any);
      toast.success("Uploaded");
    } catch (e: any) { toast.error(e.message); }
  };

  return (
    <div className="grid lg:grid-cols-[1fr_420px] gap-6">
      {/* Live preview */}
      <div className="relative rounded-2xl overflow-hidden border border-border min-h-[480px]">
        {enabled ? (
          <div className="relative h-[600px]">
            <EnvelopeCover key={JSON.stringify(settings)} settings={settings} onOpen={() => toast.info("Preview only — guests will see the full opening animation.")} />
          </div>
        ) : (
          <div className="h-full min-h-[480px] flex items-center justify-center text-sm text-muted-foreground p-6 text-center">
            Envelope cover is disabled. Toggle it on to preview.
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="space-y-5">
        <div className="flex items-center justify-between p-3 rounded-xl bg-accent/30">
          <div>
            <Label className="text-sm font-semibold">Enable Envelope Cover</Label>
            <p className="text-[11px] text-muted-foreground">Show an envelope guests must open to view the invitation.</p>
          </div>
          <Switch checked={enabled} onCheckedChange={v => onChange({ envelope_enabled: v })} />
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-semibold">Background Image</Label>
          {settings.background_image_url ? (
            <div className="relative h-32 rounded-xl overflow-hidden">
              <img src={settings.background_image_url} className="w-full h-full object-cover" alt="" />
              <Button size="icon" variant="destructive" className="absolute top-2 right-2 h-7 w-7" onClick={() => update({ background_image_url: null })}>
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          ) : (
            <button onClick={() => bgRef.current?.click()} className="w-full h-24 border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-1 hover:bg-accent/30">
              <Upload className="h-5 w-5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Upload background</span>
            </button>
          )}
          <input ref={bgRef} type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && upload(e.target.files[0], "background_image_url")} />
          <div className="flex items-center gap-2">
            <input type="color" value={settings.background_color || "#e5e0d6"} onChange={e => update({ background_color: e.target.value })} className="h-8 w-8 rounded cursor-pointer" />
            <Input value={settings.background_color || ""} onChange={e => update({ background_color: e.target.value })} className="h-8 text-xs" placeholder="#e5e0d6" />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-semibold">Envelope Style</Label>
          <div className="grid grid-cols-5 gap-1.5">
            {ENVELOPE_PRESET_OPTIONS.map(s => (
              <button key={s} onClick={() => update({ envelope_style: s as any, envelope_color: undefined })}
                className={`h-10 rounded-lg border-2 transition-all ${settings.envelope_style === s ? "border-primary scale-105" : "border-transparent"}`}
                style={{ background: ({ "classic-cream": "#f5f1e8", "navy-formal": "#1f2d44", "blush-romance": "#dfc5cb", "kraft-rustic": "#c9a982", "black-luxe": "#1a1a1a", "sage-botanical": "#a8b896", "blue-watercolor": "#a4b8c8", "ivory-silk": "#f8f4ed", "burgundy-velvet": "#5a1f2a", "gold-foil": "#d4af6f" } as any)[s] }}
                title={s}
              />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <Label className="text-xs">Seal Style</Label>
            <Select value={settings.seal_style || "wax-leaf"} onValueChange={v => update({ seal_style: v as any })}>
              <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>{SEAL_STYLES.map(s => <SelectItem key={s} value={s!}>{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label className="text-xs">CTA Style</Label>
            <Select value={settings.cta_style || "minimal"} onValueChange={v => update({ cta_style: v as any })}>
              <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>{CTA_STYLES.map(s => <SelectItem key={s} value={s!}>{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-semibold">Custom Seal Image (optional)</Label>
          {settings.seal_image_url ? (
            <div className="relative w-20 h-20">
              <img src={settings.seal_image_url} className="w-full h-full object-contain rounded-full border" alt="" />
              <Button size="icon" variant="destructive" className="absolute -top-1 -right-1 h-5 w-5" onClick={() => update({ seal_image_url: null })}><Trash2 className="h-2.5 w-2.5" /></Button>
            </div>
          ) : (
            <button onClick={() => sealRef.current?.click()} className="px-3 h-8 text-xs rounded-lg border border-dashed flex items-center gap-1.5"><ImageIcon className="h-3 w-3" /> Upload seal</button>
          )}
          <input ref={sealRef} type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && upload(e.target.files[0], "seal_image_url")} />
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-semibold">Title</Label>
          <Input value={settings.title_text || ""} onChange={e => update({ title_text: e.target.value })} placeholder="A Special Message Awaits..." className="h-8 text-xs" />
          <Select value={settings.title_font || "Great Vibes"} onValueChange={v => update({ title_font: v })}>
            <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>{FONTS.map(f => <SelectItem key={f} value={f}><span style={{ fontFamily: `'${f}', cursive` }}>{f}</span></SelectItem>)}</SelectContent>
          </Select>
          <div className="flex items-center gap-2">
            <input type="color" value={settings.title_color || "#3a2a1a"} onChange={e => update({ title_color: e.target.value })} className="h-8 w-8 rounded cursor-pointer" />
            <Input value={settings.title_color || ""} onChange={e => update({ title_color: e.target.value })} className="h-8 text-xs" />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-semibold">Subtitle</Label>
          <Input value={settings.subtitle_text || ""} onChange={e => update({ subtitle_text: e.target.value })} placeholder="(optional)" className="h-8 text-xs" />
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-semibold">CTA Button Text</Label>
          <Input value={settings.cta_text || ""} onChange={e => update({ cta_text: e.target.value })} placeholder="CLICK TO OPEN" className="h-8 text-xs" />
        </div>

        <div className="space-y-2 p-3 rounded-xl bg-accent/30">
          <div className="flex items-center justify-between">
            <Label className="text-xs">Show Stamp</Label>
            <Switch checked={!!settings.show_stamp} onCheckedChange={v => update({ show_stamp: v })} />
          </div>
          {settings.show_stamp && (
            <Input value={settings.stamp_text || ""} onChange={e => update({ stamp_text: e.target.value })} placeholder="INVITED" className="h-8 text-xs" />
          )}
        </div>
      </div>
    </div>
  );
}
