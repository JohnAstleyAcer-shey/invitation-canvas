
-- Add unique constraint for upsert to work
ALTER TABLE public.rsvps ADD CONSTRAINT rsvps_guest_id_invitation_id_key UNIQUE (guest_id, invitation_id);

-- Allow public insert into guests for public RSVP mode
CREATE POLICY "Public can insert guests on published invitations"
ON public.guests FOR INSERT
TO anon, authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM invitations
    WHERE invitations.id = guests.invitation_id
      AND invitations.is_published = true
      AND invitations.deleted_at IS NULL
  )
);

-- Fix rsvps UPDATE policy to include with_check
DROP POLICY IF EXISTS "Public can update rsvps on published invitations" ON public.rsvps;
CREATE POLICY "Public can update rsvps on published invitations"
ON public.rsvps FOR UPDATE
TO anon, authenticated
USING (
  EXISTS (
    SELECT 1 FROM invitations
    WHERE invitations.id = rsvps.invitation_id
      AND invitations.is_published = true
      AND invitations.deleted_at IS NULL
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM invitations
    WHERE invitations.id = rsvps.invitation_id
      AND invitations.is_published = true
      AND invitations.deleted_at IS NULL
  )
);

-- Also ensure anon can use the existing insert policy
DROP POLICY IF EXISTS "Public can insert rsvps on published invitations" ON public.rsvps;
CREATE POLICY "Public can insert rsvps on published invitations"
ON public.rsvps FOR INSERT
TO anon, authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM invitations
    WHERE invitations.id = rsvps.invitation_id
      AND invitations.is_published = true
      AND invitations.deleted_at IS NULL
  )
);

-- Ensure anon can SELECT guests too
DROP POLICY IF EXISTS "Public can view guests on published invitations" ON public.guests;
CREATE POLICY "Public can view guests on published invitations"
ON public.guests FOR SELECT
TO anon, authenticated
USING (
  EXISTS (
    SELECT 1 FROM invitations
    WHERE invitations.id = guests.invitation_id
      AND invitations.is_published = true
      AND invitations.deleted_at IS NULL
  )
);

-- Ensure anon can SELECT rsvps too
DROP POLICY IF EXISTS "Public can view rsvps on published invitations" ON public.rsvps;
CREATE POLICY "Public can view rsvps on published invitations"
ON public.rsvps FOR SELECT
TO anon, authenticated
USING (
  EXISTS (
    SELECT 1 FROM invitations
    WHERE invitations.id = rsvps.invitation_id
      AND invitations.is_published = true
      AND invitations.deleted_at IS NULL
  )
);
