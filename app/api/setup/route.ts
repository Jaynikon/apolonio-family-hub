import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  try {
    const admin = createAdminClient();
    const { count } = await admin.from("profiles").select("id", { count: "exact", head: true });
    if ((count ?? 0) > 0) return NextResponse.json({ error: "Family Hub is already set up." }, { status: 409 });

    const { displayName, username, pin } = await request.json();
    const cleanUsername = String(username ?? "").trim().toLowerCase().replace(/[^a-z0-9._-]/g, "");
    const cleanName = String(displayName ?? "").trim();
    const cleanPin = String(pin ?? "");
    if (!cleanName || !cleanUsername || !/^\d{4,6}$/.test(cleanPin)) {
      return NextResponse.json({ error: "Enter a name, username, and 4–6 digit PIN." }, { status: 400 });
    }

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
      role: "admin",
      active: true,
      must_change_pin: false,
    });
    if (profileError) return NextResponse.json({ error: profileError.message }, { status: 400 });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Setup failed." }, { status: 500 });
  }
}
