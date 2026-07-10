import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
  return profile?.role === "admin" ? user : null;
}

export async function POST(request: Request) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  const { displayName, username, temporaryPin, role = "member" } = await request.json();
  const cleanUsername = String(username ?? "").trim().toLowerCase().replace(/[^a-z0-9._-]/g, "");
  const cleanName = String(displayName ?? "").trim();
  const cleanPin = String(temporaryPin ?? "");
  if (!cleanName || !cleanUsername || !/^\d{4,6}$/.test(cleanPin)) {
    return NextResponse.json({ error: "Enter a name, username, and 4–6 digit temporary PIN." }, { status: 400 });
  }

  const admin = createAdminClient();
  const { data, error } = await admin.auth.admin.createUser({
    email: `${cleanUsername}@familyhub.local`,
    password: cleanPin,
    email_confirm: true,
    user_metadata: { display_name: cleanName, username: cleanUsername },
  });
  if (error || !data.user) return NextResponse.json({ error: error?.message ?? "Could not create account." }, { status: 400 });

  const { error: profileError } = await admin.from("profiles").insert({
    id: data.user.id,
    username: cleanUsername,
    display_name: cleanName,
    role: role === "admin" ? "admin" : "member",
    active: true,
    must_change_pin: true,
  });
  if (profileError) return NextResponse.json({ error: profileError.message }, { status: 400 });

  return NextResponse.json({ ok: true });
}

export async function PATCH(request: Request) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  const { id, action, temporaryPin } = await request.json();
  const admin = createAdminClient();

  if (action === "reset_pin") {
    const pin = String(temporaryPin ?? "");
    if (!/^\d{4,6}$/.test(pin)) return NextResponse.json({ error: "Enter a 4–6 digit PIN." }, { status: 400 });
    const { error } = await admin.auth.admin.updateUserById(id, { password: pin });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    await admin.from("profiles").update({ must_change_pin: true }).eq("id", id);
  } else if (action === "toggle_active") {
    const { data: profile } = await admin.from("profiles").select("active").eq("id", id).maybeSingle();
    if (!profile) return NextResponse.json({ error: "Account not found." }, { status: 404 });
    await admin.from("profiles").update({ active: !profile.active }).eq("id", id);
    await admin.auth.admin.updateUserById(id, { ban_duration: profile.active ? "876000h" : "none" });
  }

  return NextResponse.json({ ok: true });
}
