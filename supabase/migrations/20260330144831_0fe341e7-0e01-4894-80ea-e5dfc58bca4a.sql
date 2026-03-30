
-- Update handle_new_user_role to assign 'customer' by default
CREATE OR REPLACE FUNCTION public.handle_new_user_role()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'customer');
  RETURN NEW;
END;
$$;

-- Create edge function for SuperAdmin to create user accounts
-- (We'll handle this via an edge function instead)
