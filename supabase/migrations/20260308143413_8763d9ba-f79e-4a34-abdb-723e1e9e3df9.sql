
-- Enums
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');
CREATE TYPE public.event_type AS ENUM ('debut', 'wedding', 'birthday', 'christening', 'corporate');
CREATE TYPE public.rsvp_status AS ENUM ('pending', 'attending', 'not_attending', 'maybe');
CREATE TYPE public.page_type AS ENUM ('cover', 'message', 'countdown', 'location', 'timeline', 'roses', 'candles', 'treasures', 'blue_bills', 'dress_code', 'gallery', 'gift_guide', 'faq', 'rsvp');
CREATE TYPE public.style_variant AS ENUM ('classic', 'modern', 'elegant', 'bold');

-- Updated at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Profiles
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', ''));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- User roles
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL DEFAULT 'user',
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);

-- Auto-assign admin role on signup
CREATE OR REPLACE FUNCTION public.handle_new_user_role()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created_role
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_role();

-- Invitations
CREATE TABLE public.invitations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  celebrant_name TEXT,
  slug TEXT UNIQUE NOT NULL,
  event_type event_type NOT NULL DEFAULT 'wedding',
  event_date TIMESTAMPTZ,
  event_end_date TIMESTAMPTZ,
  venue_name TEXT,
  venue_address TEXT,
  venue_map_url TEXT,
  venue_lat DOUBLE PRECISION,
  venue_lng DOUBLE PRECISION,
  cover_image_url TEXT,
  invitation_message TEXT,
  entourage_title TEXT,
  is_published BOOLEAN NOT NULL DEFAULT false,
  is_password_protected BOOLEAN NOT NULL DEFAULT false,
  password_hash TEXT,
  expires_at TIMESTAMPTZ,
  deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.invitations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage own invitations" ON public.invitations FOR ALL USING (auth.uid() = admin_user_id);
CREATE POLICY "Public can view published invitations" ON public.invitations FOR SELECT USING (is_published = true AND deleted_at IS NULL);

CREATE TRIGGER update_invitations_updated_at BEFORE UPDATE ON public.invitations
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Invitation themes
CREATE TABLE public.invitation_themes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  invitation_id UUID NOT NULL REFERENCES public.invitations(id) ON DELETE CASCADE UNIQUE,
  color_primary TEXT DEFAULT '#000000',
  color_secondary TEXT DEFAULT '#ffffff',
  color_accent TEXT DEFAULT '#666666',
  color_text_primary TEXT DEFAULT '#000000',
  color_text_secondary TEXT DEFAULT '#666666',
  font_title TEXT DEFAULT 'Playfair Display',
  font_body TEXT DEFAULT 'Lato',
  background_type TEXT DEFAULT 'solid',
  background_value TEXT DEFAULT '#ffffff',
  background_opacity DOUBLE PRECISION DEFAULT 1.0,
  glassmorphism_enabled BOOLEAN DEFAULT false,
  page_transition TEXT DEFAULT 'fade',
  particle_effect TEXT,
  music_url TEXT,
  music_autoplay BOOLEAN DEFAULT false,
  music_loop BOOLEAN DEFAULT true,
  music_volume DOUBLE PRECISION DEFAULT 0.5,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.invitation_themes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage own invitation themes" ON public.invitation_themes FOR ALL
  USING (EXISTS (SELECT 1 FROM public.invitations WHERE id = invitation_id AND admin_user_id = auth.uid()));
CREATE POLICY "Public can view published invitation themes" ON public.invitation_themes FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.invitations WHERE id = invitation_id AND is_published = true AND deleted_at IS NULL));

CREATE TRIGGER update_invitation_themes_updated_at BEFORE UPDATE ON public.invitation_themes
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Invitation pages
CREATE TABLE public.invitation_pages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  invitation_id UUID NOT NULL REFERENCES public.invitations(id) ON DELETE CASCADE,
  page_type page_type NOT NULL,
  is_enabled BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  custom_title TEXT,
  style_variant style_variant NOT NULL DEFAULT 'classic',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.invitation_pages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage own invitation pages" ON public.invitation_pages FOR ALL
  USING (EXISTS (SELECT 1 FROM public.invitations WHERE id = invitation_id AND admin_user_id = auth.uid()));
CREATE POLICY "Public can view published invitation pages" ON public.invitation_pages FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.invitations WHERE id = invitation_id AND is_published = true AND deleted_at IS NULL));

-- Guests
CREATE TABLE public.guests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  invitation_id UUID NOT NULL REFERENCES public.invitations(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  invitation_code TEXT NOT NULL DEFAULT UPPER(SUBSTRING(gen_random_uuid()::text FROM 1 FOR 8)),
  max_companions INTEGER DEFAULT 0,
  personal_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.invitation_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage own guests" ON public.guests FOR ALL
  USING (EXISTS (SELECT 1 FROM public.invitations WHERE id = invitation_id AND admin_user_id = auth.uid()));
CREATE POLICY "Guests can view own record on published invitations" ON public.guests FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.invitations WHERE id = invitation_id AND is_published = true AND deleted_at IS NULL));

-- RSVPs
CREATE TABLE public.rsvps (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  invitation_id UUID NOT NULL REFERENCES public.invitations(id) ON DELETE CASCADE,
  guest_id UUID NOT NULL REFERENCES public.guests(id) ON DELETE CASCADE,
  status rsvp_status NOT NULL DEFAULT 'pending',
  num_companions INTEGER DEFAULT 0,
  message TEXT,
  dietary_notes TEXT,
  is_message_approved BOOLEAN DEFAULT false,
  responded_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.rsvps ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage own rsvps" ON public.rsvps FOR ALL
  USING (EXISTS (SELECT 1 FROM public.invitations WHERE id = invitation_id AND admin_user_id = auth.uid()));
CREATE POLICY "Guests can insert rsvps on published invitations" ON public.rsvps FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM public.invitations WHERE id = invitation_id AND is_published = true AND deleted_at IS NULL));
CREATE POLICY "Guests can update own rsvps" ON public.rsvps FOR UPDATE
  USING (EXISTS (SELECT 1 FROM public.invitations WHERE id = invitation_id AND is_published = true AND deleted_at IS NULL));
CREATE POLICY "Guests can view own rsvps" ON public.rsvps FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.invitations WHERE id = invitation_id AND is_published = true AND deleted_at IS NULL));

-- Enable realtime for rsvps
ALTER PUBLICATION supabase_realtime ADD TABLE public.rsvps;

-- Timeline events
CREATE TABLE public.timeline_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  invitation_id UUID NOT NULL REFERENCES public.invitations(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  event_time TEXT,
  description TEXT,
  icon TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.timeline_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage own timeline events" ON public.timeline_events FOR ALL
  USING (EXISTS (SELECT 1 FROM public.invitations WHERE id = invitation_id AND admin_user_id = auth.uid()));
CREATE POLICY "Public can view published timeline events" ON public.timeline_events FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.invitations WHERE id = invitation_id AND is_published = true AND deleted_at IS NULL));

-- Roses
CREATE TABLE public.roses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  invitation_id UUID NOT NULL REFERENCES public.invitations(id) ON DELETE CASCADE,
  person_name TEXT NOT NULL,
  role_description TEXT,
  image_url TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.roses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage own roses" ON public.roses FOR ALL
  USING (EXISTS (SELECT 1 FROM public.invitations WHERE id = invitation_id AND admin_user_id = auth.uid()));
CREATE POLICY "Public can view published roses" ON public.roses FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.invitations WHERE id = invitation_id AND is_published = true AND deleted_at IS NULL));

-- Candles
CREATE TABLE public.candles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  invitation_id UUID NOT NULL REFERENCES public.invitations(id) ON DELETE CASCADE,
  person_name TEXT NOT NULL,
  message TEXT,
  image_url TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.candles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage own candles" ON public.candles FOR ALL
  USING (EXISTS (SELECT 1 FROM public.invitations WHERE id = invitation_id AND admin_user_id = auth.uid()));
CREATE POLICY "Public can view published candles" ON public.candles FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.invitations WHERE id = invitation_id AND is_published = true AND deleted_at IS NULL));

-- Treasures
CREATE TABLE public.treasures (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  invitation_id UUID NOT NULL REFERENCES public.invitations(id) ON DELETE CASCADE,
  person_name TEXT NOT NULL,
  gift_description TEXT,
  image_url TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.treasures ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage own treasures" ON public.treasures FOR ALL
  USING (EXISTS (SELECT 1 FROM public.invitations WHERE id = invitation_id AND admin_user_id = auth.uid()));
CREATE POLICY "Public can view published treasures" ON public.treasures FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.invitations WHERE id = invitation_id AND is_published = true AND deleted_at IS NULL));

-- Blue bills
CREATE TABLE public.blue_bills (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  invitation_id UUID NOT NULL REFERENCES public.invitations(id) ON DELETE CASCADE,
  person_name TEXT NOT NULL,
  message TEXT,
  image_url TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.blue_bills ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage own blue bills" ON public.blue_bills FOR ALL
  USING (EXISTS (SELECT 1 FROM public.invitations WHERE id = invitation_id AND admin_user_id = auth.uid()));
CREATE POLICY "Public can view published blue bills" ON public.blue_bills FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.invitations WHERE id = invitation_id AND is_published = true AND deleted_at IS NULL));

-- Gallery images
CREATE TABLE public.gallery_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  invitation_id UUID NOT NULL REFERENCES public.invitations(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  caption TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage own gallery images" ON public.gallery_images FOR ALL
  USING (EXISTS (SELECT 1 FROM public.invitations WHERE id = invitation_id AND admin_user_id = auth.uid()));
CREATE POLICY "Public can view published gallery images" ON public.gallery_images FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.invitations WHERE id = invitation_id AND is_published = true AND deleted_at IS NULL));

-- Dress code colors
CREATE TABLE public.dress_code_colors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  invitation_id UUID NOT NULL REFERENCES public.invitations(id) ON DELETE CASCADE,
  color_hex TEXT NOT NULL,
  color_name TEXT,
  description TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.dress_code_colors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage own dress code colors" ON public.dress_code_colors FOR ALL
  USING (EXISTS (SELECT 1 FROM public.invitations WHERE id = invitation_id AND admin_user_id = auth.uid()));
CREATE POLICY "Public can view published dress code colors" ON public.dress_code_colors FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.invitations WHERE id = invitation_id AND is_published = true AND deleted_at IS NULL));

-- Gift items
CREATE TABLE public.gift_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  invitation_id UUID NOT NULL REFERENCES public.invitations(id) ON DELETE CASCADE,
  item_name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  link_url TEXT,
  link_label TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.gift_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage own gift items" ON public.gift_items FOR ALL
  USING (EXISTS (SELECT 1 FROM public.invitations WHERE id = invitation_id AND admin_user_id = auth.uid()));
CREATE POLICY "Public can view published gift items" ON public.gift_items FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.invitations WHERE id = invitation_id AND is_published = true AND deleted_at IS NULL));

-- FAQs
CREATE TABLE public.faqs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  invitation_id UUID NOT NULL REFERENCES public.invitations(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage own faqs" ON public.faqs FOR ALL
  USING (EXISTS (SELECT 1 FROM public.invitations WHERE id = invitation_id AND admin_user_id = auth.uid()));
CREATE POLICY "Public can view published faqs" ON public.faqs FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.invitations WHERE id = invitation_id AND is_published = true AND deleted_at IS NULL));

-- Customer admins
CREATE TABLE public.customer_admins (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  invitation_id UUID NOT NULL REFERENCES public.invitations(id) ON DELETE CASCADE,
  username TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  display_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.customer_admins ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage own customer admins" ON public.customer_admins FOR ALL
  USING (EXISTS (SELECT 1 FROM public.invitations WHERE id = invitation_id AND admin_user_id = auth.uid()));
-- Public can verify login (handled via edge function, no direct SELECT needed)

-- Storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES ('invitation-assets', 'invitation-assets', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('audio-urls', 'audio-urls', true);

-- Storage policies
CREATE POLICY "Public can view invitation assets" ON storage.objects FOR SELECT USING (bucket_id = 'invitation-assets');
CREATE POLICY "Authenticated users can upload invitation assets" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'invitation-assets' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update invitation assets" ON storage.objects FOR UPDATE USING (bucket_id = 'invitation-assets' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete invitation assets" ON storage.objects FOR DELETE USING (bucket_id = 'invitation-assets' AND auth.role() = 'authenticated');

CREATE POLICY "Public can view audio" ON storage.objects FOR SELECT USING (bucket_id = 'audio-urls');
CREATE POLICY "Authenticated users can upload audio" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'audio-urls' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update audio" ON storage.objects FOR UPDATE USING (bucket_id = 'audio-urls' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete audio" ON storage.objects FOR DELETE USING (bucket_id = 'audio-urls' AND auth.role() = 'authenticated');
