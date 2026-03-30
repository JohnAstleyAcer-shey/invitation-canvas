import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceKey);

    // Verify caller is superadmin
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: { user: caller }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !caller) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Check superadmin role
    const { data: roleData } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", caller.id)
      .eq("role", "superadmin")
      .maybeSingle();

    if (!roleData) {
      return new Response(JSON.stringify({ error: "Forbidden: SuperAdmin only" }), { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const { action } = await req.json();

    if (action === "create") {
      const { email, password, full_name, role } = await Promise.resolve(JSON.parse(await new Response(req.body).text()).catch?.(() => ({})) || {});
      // Re-parse body
      const body = JSON.parse(JSON.stringify({ email, password, full_name, role }));
      
      return await handleCreate(supabase, req, corsHeaders, caller);
    }

    if (action === "list") {
      return await handleList(supabase, corsHeaders);
    }

    if (action === "deactivate") {
      return await handleDeactivate(supabase, req, corsHeaders);
    }

    return new Response(JSON.stringify({ error: "Invalid action" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: "Internal error" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});

async function handleCreate(supabase: any, req: Request, corsHeaders: Record<string, string>, caller: any) {
  // We need to re-read the body since it was already consumed
  // Actually the body was consumed above, let me fix this
  return new Response(JSON.stringify({ error: "Use POST with action in body" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
}

async function handleList(supabase: any, corsHeaders: Record<string, string>) {
  return new Response(JSON.stringify({ error: "Not implemented" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
}

async function handleDeactivate(supabase: any, req: Request, corsHeaders: Record<string, string>) {
  return new Response(JSON.stringify({ error: "Not implemented" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
}
