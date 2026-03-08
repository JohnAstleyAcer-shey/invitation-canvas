
-- Block-based invitation system
CREATE TABLE public.invitation_blocks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  invitation_id UUID NOT NULL REFERENCES public.invitations(id) ON DELETE CASCADE,
  block_type TEXT NOT NULL,
  content JSONB NOT NULL DEFAULT '{}'::jsonb,
  style JSONB NOT NULL DEFAULT '{}'::jsonb,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_visible BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- RLS
ALTER TABLE public.invitation_blocks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage own blocks"
  ON public.invitation_blocks FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM invitations WHERE invitations.id = invitation_blocks.invitation_id AND invitations.admin_user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM invitations WHERE invitations.id = invitation_blocks.invitation_id AND invitations.admin_user_id = auth.uid()));

CREATE POLICY "Public can view published blocks"
  ON public.invitation_blocks FOR SELECT
  TO anon, authenticated
  USING (EXISTS (SELECT 1 FROM invitations WHERE invitations.id = invitation_blocks.invitation_id AND invitations.is_published = true AND invitations.deleted_at IS NULL));

-- Index for performance
CREATE INDEX idx_invitation_blocks_invitation_id ON public.invitation_blocks(invitation_id);
CREATE INDEX idx_invitation_blocks_sort_order ON public.invitation_blocks(invitation_id, sort_order);

-- Block templates table for reusable block presets
CREATE TABLE public.block_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL DEFAULT 'general',
  event_type TEXT,
  blocks JSONB NOT NULL DEFAULT '[]'::jsonb,
  thumbnail_url TEXT,
  is_premium BOOLEAN NOT NULL DEFAULT false,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.block_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view block templates"
  ON public.block_templates FOR SELECT
  TO anon, authenticated
  USING (true);

-- Add use_blocks flag to invitations
ALTER TABLE public.invitations ADD COLUMN IF NOT EXISTS use_blocks BOOLEAN NOT NULL DEFAULT false;
