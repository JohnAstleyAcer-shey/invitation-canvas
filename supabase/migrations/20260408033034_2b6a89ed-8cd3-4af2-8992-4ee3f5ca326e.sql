
CREATE TABLE public.invitation_reactions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  invitation_id uuid NOT NULL REFERENCES public.invitations(id) ON DELETE CASCADE,
  reaction_type text NOT NULL DEFAULT 'heart',
  session_id text,
  reacted_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.invitation_reactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can insert reactions on published invitations"
  ON public.invitation_reactions FOR INSERT
  TO anon, authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.invitations
    WHERE invitations.id = invitation_reactions.invitation_id
      AND invitations.is_published = true
      AND invitations.deleted_at IS NULL
  ));

CREATE POLICY "Admins can view own invitation reactions"
  ON public.invitation_reactions FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.invitations
    WHERE invitations.id = invitation_reactions.invitation_id
      AND invitations.admin_user_id = auth.uid()
  ));

CREATE POLICY "Public can view reactions on published invitations"
  ON public.invitation_reactions FOR SELECT
  TO anon, authenticated
  USING (EXISTS (
    SELECT 1 FROM public.invitations
    WHERE invitations.id = invitation_reactions.invitation_id
      AND invitations.is_published = true
      AND invitations.deleted_at IS NULL
  ));

CREATE INDEX idx_invitation_reactions_invitation_id ON public.invitation_reactions(invitation_id);
