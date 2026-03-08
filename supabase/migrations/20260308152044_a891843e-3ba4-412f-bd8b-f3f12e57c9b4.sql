
-- Create invitation_views table for analytics/view tracking
CREATE TABLE public.invitation_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invitation_id uuid NOT NULL REFERENCES public.invitations(id) ON DELETE CASCADE,
  viewed_at timestamp with time zone NOT NULL DEFAULT now(),
  user_agent text,
  referrer text,
  country text,
  device_type text
);

ALTER TABLE public.invitation_views ENABLE ROW LEVEL SECURITY;

-- Public can insert views on published invitations
CREATE POLICY "Public can insert views on published invitations"
ON public.invitation_views FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM invitations
    WHERE invitations.id = invitation_views.invitation_id
    AND invitations.is_published = true
    AND invitations.deleted_at IS NULL
  )
);

-- Admins can view their own invitation views
CREATE POLICY "Admins can view own invitation views"
ON public.invitation_views FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM invitations
    WHERE invitations.id = invitation_views.invitation_id
    AND invitations.admin_user_id = auth.uid()
  )
);
