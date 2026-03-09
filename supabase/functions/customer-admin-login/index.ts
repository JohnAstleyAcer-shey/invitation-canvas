import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const { username, password_hash, invitation_slug } = await req.json();
    if (!username || !password_hash || !invitation_slug) {
      return new Response(JSON.stringify({ error: "Missing fields" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceKey);

    // Look up invitation by slug
    const { data: invitation, error: invErr } = await supabase
      .from("invitations")
      .select("id, title, celebrant_name, event_type, event_date, slug")
      .eq("slug", invitation_slug)
      .eq("is_published", true)
      .is("deleted_at", null)
      .maybeSingle();

    if (invErr || !invitation) {
      return new Response(JSON.stringify({ error: "Invitation not found" }), { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Verify credentials
    const { data: admin, error: adminErr } = await supabase
      .from("customer_admins")
      .select("id, username, display_name, invitation_id")
      .eq("invitation_id", invitation.id)
      .eq("username", username)
      .eq("password_hash", password_hash)
      .maybeSingle();

    if (adminErr || !admin) {
      return new Response(JSON.stringify({ error: "Invalid credentials" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Generate a simple session token
    const token = crypto.randomUUID();

    return new Response(JSON.stringify({
      token,
      admin: { id: admin.id, username: admin.username, display_name: admin.display_name },
      invitation,
    }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    return new Response(JSON.stringify({ error: "Internal error" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
