import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function jsonResponse(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });
}

async function verifySuperAdmin(supabase: any, authHeader: string | null) {
  if (!authHeader) return null;
  const token = authHeader.replace("Bearer ", "");
  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) return null;

  const { data: roleData } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id)
    .eq("role", "superadmin")
    .maybeSingle();

  return roleData ? user : null;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceKey);

    const caller = await verifySuperAdmin(supabase, req.headers.get("authorization"));
    if (!caller) return jsonResponse({ error: "Forbidden: SuperAdmin only" }, 403);

    const body = await req.json();
    const { action } = body;

    if (action === "create_user") {
      const { email, password, full_name, role } = body;
      if (!email || !password || !full_name) return jsonResponse({ error: "Missing email, password, or full_name" }, 400);
      if (role && !["superadmin", "customer"].includes(role)) return jsonResponse({ error: "Invalid role" }, 400);

      // Create user via admin API
      const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { full_name },
      });

      if (createError) return jsonResponse({ error: createError.message }, 400);

      // If role specified, update it (trigger already creates 'customer' by default)
      if (role === "superadmin") {
        await supabase.from("user_roles").update({ role: "superadmin" }).eq("user_id", newUser.user.id);
      }

      return jsonResponse({ user: { id: newUser.user.id, email: newUser.user.email, full_name } });
    }

    if (action === "list_users") {
      // Get all users with their roles and profiles
      const { data: roles, error: rolesErr } = await supabase
        .from("user_roles")
        .select("user_id, role");

      if (rolesErr) return jsonResponse({ error: rolesErr.message }, 500);

      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, full_name, avatar_url, created_at");

      // Get auth users for email
      const { data: { users: authUsers } } = await supabase.auth.admin.listUsers({ perPage: 1000 });

      const users = (roles || []).map((r: any) => {
        const profile = profiles?.find((p: any) => p.user_id === r.user_id);
        const authUser = authUsers?.find((u: any) => u.id === r.user_id);
        return {
          id: r.user_id,
          role: r.role,
          email: authUser?.email || "Unknown",
          full_name: profile?.full_name || "",
          avatar_url: profile?.avatar_url || null,
          created_at: profile?.created_at || authUser?.created_at,
          last_sign_in: authUser?.last_sign_in_at,
          is_banned: authUser?.banned_until ? true : false,
        };
      });

      return jsonResponse({ users });
    }

    if (action === "deactivate_user") {
      const { user_id } = body;
      if (!user_id) return jsonResponse({ error: "Missing user_id" }, 400);
      if (user_id === caller.id) return jsonResponse({ error: "Cannot deactivate yourself" }, 400);

      const { error } = await supabase.auth.admin.updateUserById(user_id, { ban_duration: "876000h" }); // ~100 years
      if (error) return jsonResponse({ error: error.message }, 500);
      return jsonResponse({ success: true });
    }

    if (action === "activate_user") {
      const { user_id } = body;
      if (!user_id) return jsonResponse({ error: "Missing user_id" }, 400);

      const { error } = await supabase.auth.admin.updateUserById(user_id, { ban_duration: "none" });
      if (error) return jsonResponse({ error: error.message }, 500);
      return jsonResponse({ success: true });
    }

    if (action === "update_role") {
      const { user_id, role } = body;
      if (!user_id || !role) return jsonResponse({ error: "Missing user_id or role" }, 400);
      if (!["superadmin", "customer"].includes(role)) return jsonResponse({ error: "Invalid role" }, 400);

      const { error } = await supabase.from("user_roles").update({ role }).eq("user_id", user_id);
      if (error) return jsonResponse({ error: error.message }, 500);
      return jsonResponse({ success: true });
    }

    return jsonResponse({ error: "Invalid action" }, 400);
  } catch (e) {
    console.error(e);
    return jsonResponse({ error: "Internal error" }, 500);
  }
});
