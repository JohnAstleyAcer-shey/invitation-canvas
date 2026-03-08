-- Create a secure view for customer_admins that hides password_hash
CREATE VIEW public.customer_admins_public
WITH (security_invoker = on) AS
SELECT id, invitation_id, username, display_name, created_at
FROM public.customer_admins;

-- Drop the existing public SELECT policy that exposes password_hash
DROP POLICY IF EXISTS "Public can read customer admins for login" ON public.customer_admins;

-- Create policy denying anon direct SELECT on base table
CREATE POLICY "Public cannot directly read customer admins"
ON public.customer_admins FOR SELECT
TO anon
USING (false);