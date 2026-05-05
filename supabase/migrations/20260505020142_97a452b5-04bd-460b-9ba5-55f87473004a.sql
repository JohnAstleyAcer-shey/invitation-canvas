-- Add envelope cover settings to invitations
ALTER TABLE public.invitations
  ADD COLUMN IF NOT EXISTS envelope_enabled boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS envelope_settings jsonb NOT NULL DEFAULT '{
    "background_image_url": null,
    "background_color": "#e5e0d6",
    "envelope_style": "classic-cream",
    "envelope_color": "#f5f1e8",
    "seal_style": "wax-leaf",
    "seal_color": "#8b6f47",
    "seal_image_url": null,
    "title_text": "A Special Message Awaits...",
    "title_font": "Great Vibes",
    "title_color": "#3a2a1a",
    "subtitle_text": "",
    "cta_text": "CLICK TO OPEN",
    "cta_style": "minimal",
    "stamp_text": "",
    "show_stamp": false
  }'::jsonb;
