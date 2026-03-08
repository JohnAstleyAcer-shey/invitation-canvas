
-- ============================================
-- FIX: Change all RESTRICTIVE RLS policies to PERMISSIVE
-- ============================================

-- invitations
DROP POLICY IF EXISTS "Admins manage own invitations" ON public.invitations;
DROP POLICY IF EXISTS "Public can view published invitations" ON public.invitations;
CREATE POLICY "Admins manage own invitations" ON public.invitations FOR ALL TO authenticated USING (auth.uid() = admin_user_id) WITH CHECK (auth.uid() = admin_user_id);
CREATE POLICY "Public can view published invitations" ON public.invitations FOR SELECT TO anon, authenticated USING (is_published = true AND deleted_at IS NULL);

-- profiles
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Service role inserts profile" ON public.profiles FOR INSERT TO service_role WITH CHECK (true);

-- user_roles
DROP POLICY IF EXISTS "Users can view own roles" ON public.user_roles;
CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Service role inserts roles" ON public.user_roles FOR INSERT TO service_role WITH CHECK (true);

-- invitation_themes
DROP POLICY IF EXISTS "Admins manage own invitation themes" ON public.invitation_themes;
DROP POLICY IF EXISTS "Public can view published invitation themes" ON public.invitation_themes;
CREATE POLICY "Admins manage own invitation themes" ON public.invitation_themes FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM invitations WHERE invitations.id = invitation_themes.invitation_id AND invitations.admin_user_id = auth.uid())) WITH CHECK (EXISTS (SELECT 1 FROM invitations WHERE invitations.id = invitation_themes.invitation_id AND invitations.admin_user_id = auth.uid()));
CREATE POLICY "Public can view published invitation themes" ON public.invitation_themes FOR SELECT TO anon, authenticated USING (EXISTS (SELECT 1 FROM invitations WHERE invitations.id = invitation_themes.invitation_id AND invitations.is_published = true AND invitations.deleted_at IS NULL));

-- invitation_pages
DROP POLICY IF EXISTS "Admins manage own invitation pages" ON public.invitation_pages;
DROP POLICY IF EXISTS "Public can view published invitation pages" ON public.invitation_pages;
CREATE POLICY "Admins manage own invitation pages" ON public.invitation_pages FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM invitations WHERE invitations.id = invitation_pages.invitation_id AND invitations.admin_user_id = auth.uid())) WITH CHECK (EXISTS (SELECT 1 FROM invitations WHERE invitations.id = invitation_pages.invitation_id AND invitations.admin_user_id = auth.uid()));
CREATE POLICY "Public can view published invitation pages" ON public.invitation_pages FOR SELECT TO anon, authenticated USING (EXISTS (SELECT 1 FROM invitations WHERE invitations.id = invitation_pages.invitation_id AND invitations.is_published = true AND invitations.deleted_at IS NULL));

-- guests
DROP POLICY IF EXISTS "Admins manage own guests" ON public.guests;
DROP POLICY IF EXISTS "Guests can view own record on published invitations" ON public.guests;
CREATE POLICY "Admins manage own guests" ON public.guests FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM invitations WHERE invitations.id = guests.invitation_id AND invitations.admin_user_id = auth.uid())) WITH CHECK (EXISTS (SELECT 1 FROM invitations WHERE invitations.id = guests.invitation_id AND invitations.admin_user_id = auth.uid()));
CREATE POLICY "Public can view guests on published invitations" ON public.guests FOR SELECT TO anon, authenticated USING (EXISTS (SELECT 1 FROM invitations WHERE invitations.id = guests.invitation_id AND invitations.is_published = true AND invitations.deleted_at IS NULL));

-- rsvps
DROP POLICY IF EXISTS "Admins manage own rsvps" ON public.rsvps;
DROP POLICY IF EXISTS "Guests can insert rsvps on published invitations" ON public.rsvps;
DROP POLICY IF EXISTS "Guests can update own rsvps" ON public.rsvps;
DROP POLICY IF EXISTS "Guests can view own rsvps" ON public.rsvps;
CREATE POLICY "Admins manage own rsvps" ON public.rsvps FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM invitations WHERE invitations.id = rsvps.invitation_id AND invitations.admin_user_id = auth.uid())) WITH CHECK (EXISTS (SELECT 1 FROM invitations WHERE invitations.id = rsvps.invitation_id AND invitations.admin_user_id = auth.uid()));
CREATE POLICY "Public can view rsvps on published invitations" ON public.rsvps FOR SELECT TO anon, authenticated USING (EXISTS (SELECT 1 FROM invitations WHERE invitations.id = rsvps.invitation_id AND invitations.is_published = true AND invitations.deleted_at IS NULL));
CREATE POLICY "Public can insert rsvps on published invitations" ON public.rsvps FOR INSERT TO anon, authenticated WITH CHECK (EXISTS (SELECT 1 FROM invitations WHERE invitations.id = rsvps.invitation_id AND invitations.is_published = true AND invitations.deleted_at IS NULL));
CREATE POLICY "Public can update rsvps on published invitations" ON public.rsvps FOR UPDATE TO anon, authenticated USING (EXISTS (SELECT 1 FROM invitations WHERE invitations.id = rsvps.invitation_id AND invitations.is_published = true AND invitations.deleted_at IS NULL));

-- timeline_events
DROP POLICY IF EXISTS "Admins manage own timeline events" ON public.timeline_events;
DROP POLICY IF EXISTS "Public can view published timeline events" ON public.timeline_events;
CREATE POLICY "Admins manage own timeline events" ON public.timeline_events FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM invitations WHERE invitations.id = timeline_events.invitation_id AND invitations.admin_user_id = auth.uid())) WITH CHECK (EXISTS (SELECT 1 FROM invitations WHERE invitations.id = timeline_events.invitation_id AND invitations.admin_user_id = auth.uid()));
CREATE POLICY "Public can view published timeline events" ON public.timeline_events FOR SELECT TO anon, authenticated USING (EXISTS (SELECT 1 FROM invitations WHERE invitations.id = timeline_events.invitation_id AND invitations.is_published = true AND invitations.deleted_at IS NULL));

-- roses
DROP POLICY IF EXISTS "Admins manage own roses" ON public.roses;
DROP POLICY IF EXISTS "Public can view published roses" ON public.roses;
CREATE POLICY "Admins manage own roses" ON public.roses FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM invitations WHERE invitations.id = roses.invitation_id AND invitations.admin_user_id = auth.uid())) WITH CHECK (EXISTS (SELECT 1 FROM invitations WHERE invitations.id = roses.invitation_id AND invitations.admin_user_id = auth.uid()));
CREATE POLICY "Public can view published roses" ON public.roses FOR SELECT TO anon, authenticated USING (EXISTS (SELECT 1 FROM invitations WHERE invitations.id = roses.invitation_id AND invitations.is_published = true AND invitations.deleted_at IS NULL));

-- candles
DROP POLICY IF EXISTS "Admins manage own candles" ON public.candles;
DROP POLICY IF EXISTS "Public can view published candles" ON public.candles;
CREATE POLICY "Admins manage own candles" ON public.candles FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM invitations WHERE invitations.id = candles.invitation_id AND invitations.admin_user_id = auth.uid())) WITH CHECK (EXISTS (SELECT 1 FROM invitations WHERE invitations.id = candles.invitation_id AND invitations.admin_user_id = auth.uid()));
CREATE POLICY "Public can view published candles" ON public.candles FOR SELECT TO anon, authenticated USING (EXISTS (SELECT 1 FROM invitations WHERE invitations.id = candles.invitation_id AND invitations.is_published = true AND invitations.deleted_at IS NULL));

-- treasures
DROP POLICY IF EXISTS "Admins manage own treasures" ON public.treasures;
DROP POLICY IF EXISTS "Public can view published treasures" ON public.treasures;
CREATE POLICY "Admins manage own treasures" ON public.treasures FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM invitations WHERE invitations.id = treasures.invitation_id AND invitations.admin_user_id = auth.uid())) WITH CHECK (EXISTS (SELECT 1 FROM invitations WHERE invitations.id = treasures.invitation_id AND invitations.admin_user_id = auth.uid()));
CREATE POLICY "Public can view published treasures" ON public.treasures FOR SELECT TO anon, authenticated USING (EXISTS (SELECT 1 FROM invitations WHERE invitations.id = treasures.invitation_id AND invitations.is_published = true AND invitations.deleted_at IS NULL));

-- blue_bills
DROP POLICY IF EXISTS "Admins manage own blue bills" ON public.blue_bills;
DROP POLICY IF EXISTS "Public can view published blue bills" ON public.blue_bills;
CREATE POLICY "Admins manage own blue bills" ON public.blue_bills FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM invitations WHERE invitations.id = blue_bills.invitation_id AND invitations.admin_user_id = auth.uid())) WITH CHECK (EXISTS (SELECT 1 FROM invitations WHERE invitations.id = blue_bills.invitation_id AND invitations.admin_user_id = auth.uid()));
CREATE POLICY "Public can view published blue bills" ON public.blue_bills FOR SELECT TO anon, authenticated USING (EXISTS (SELECT 1 FROM invitations WHERE invitations.id = blue_bills.invitation_id AND invitations.is_published = true AND invitations.deleted_at IS NULL));

-- gallery_images
DROP POLICY IF EXISTS "Admins manage own gallery images" ON public.gallery_images;
DROP POLICY IF EXISTS "Public can view published gallery images" ON public.gallery_images;
CREATE POLICY "Admins manage own gallery images" ON public.gallery_images FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM invitations WHERE invitations.id = gallery_images.invitation_id AND invitations.admin_user_id = auth.uid())) WITH CHECK (EXISTS (SELECT 1 FROM invitations WHERE invitations.id = gallery_images.invitation_id AND invitations.admin_user_id = auth.uid()));
CREATE POLICY "Public can view published gallery images" ON public.gallery_images FOR SELECT TO anon, authenticated USING (EXISTS (SELECT 1 FROM invitations WHERE invitations.id = gallery_images.invitation_id AND invitations.is_published = true AND invitations.deleted_at IS NULL));

-- dress_code_colors
DROP POLICY IF EXISTS "Admins manage own dress code colors" ON public.dress_code_colors;
DROP POLICY IF EXISTS "Public can view published dress code colors" ON public.dress_code_colors;
CREATE POLICY "Admins manage own dress code colors" ON public.dress_code_colors FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM invitations WHERE invitations.id = dress_code_colors.invitation_id AND invitations.admin_user_id = auth.uid())) WITH CHECK (EXISTS (SELECT 1 FROM invitations WHERE invitations.id = dress_code_colors.invitation_id AND invitations.admin_user_id = auth.uid()));
CREATE POLICY "Public can view published dress code colors" ON public.dress_code_colors FOR SELECT TO anon, authenticated USING (EXISTS (SELECT 1 FROM invitations WHERE invitations.id = dress_code_colors.invitation_id AND invitations.is_published = true AND invitations.deleted_at IS NULL));

-- gift_items
DROP POLICY IF EXISTS "Admins manage own gift items" ON public.gift_items;
DROP POLICY IF EXISTS "Public can view published gift items" ON public.gift_items;
CREATE POLICY "Admins manage own gift items" ON public.gift_items FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM invitations WHERE invitations.id = gift_items.invitation_id AND invitations.admin_user_id = auth.uid())) WITH CHECK (EXISTS (SELECT 1 FROM invitations WHERE invitations.id = gift_items.invitation_id AND invitations.admin_user_id = auth.uid()));
CREATE POLICY "Public can view published gift items" ON public.gift_items FOR SELECT TO anon, authenticated USING (EXISTS (SELECT 1 FROM invitations WHERE invitations.id = gift_items.invitation_id AND invitations.is_published = true AND invitations.deleted_at IS NULL));

-- faqs
DROP POLICY IF EXISTS "Admins manage own faqs" ON public.faqs;
DROP POLICY IF EXISTS "Public can view published faqs" ON public.faqs;
CREATE POLICY "Admins manage own faqs" ON public.faqs FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM invitations WHERE invitations.id = faqs.invitation_id AND invitations.admin_user_id = auth.uid())) WITH CHECK (EXISTS (SELECT 1 FROM invitations WHERE invitations.id = faqs.invitation_id AND invitations.admin_user_id = auth.uid()));
CREATE POLICY "Public can view published faqs" ON public.faqs FOR SELECT TO anon, authenticated USING (EXISTS (SELECT 1 FROM invitations WHERE invitations.id = faqs.invitation_id AND invitations.is_published = true AND invitations.deleted_at IS NULL));

-- customer_admins
DROP POLICY IF EXISTS "Admins manage own customer admins" ON public.customer_admins;
CREATE POLICY "Admins manage own customer admins" ON public.customer_admins FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM invitations WHERE invitations.id = customer_admins.invitation_id AND invitations.admin_user_id = auth.uid())) WITH CHECK (EXISTS (SELECT 1 FROM invitations WHERE invitations.id = customer_admins.invitation_id AND invitations.admin_user_id = auth.uid()));
CREATE POLICY "Public can read customer admins for login" ON public.customer_admins FOR SELECT TO anon, authenticated USING (EXISTS (SELECT 1 FROM invitations WHERE invitations.id = customer_admins.invitation_id AND invitations.is_published = true AND invitations.deleted_at IS NULL));

-- ============================================
-- Add triggers for auto profile + role creation
-- ============================================
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

CREATE OR REPLACE TRIGGER on_auth_user_role_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user_role();

-- ============================================
-- Add updated_at triggers
-- ============================================
CREATE OR REPLACE TRIGGER update_invitations_updated_at BEFORE UPDATE ON public.invitations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE OR REPLACE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE OR REPLACE TRIGGER update_guests_updated_at BEFORE UPDATE ON public.guests FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE OR REPLACE TRIGGER update_rsvps_updated_at BEFORE UPDATE ON public.rsvps FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE OR REPLACE TRIGGER update_invitation_themes_updated_at BEFORE UPDATE ON public.invitation_themes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE OR REPLACE TRIGGER update_invitation_pages_updated_at BEFORE UPDATE ON public.invitation_pages FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE OR REPLACE TRIGGER update_customer_admins_updated_at BEFORE UPDATE ON public.customer_admins FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
