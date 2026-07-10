import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

function normalizeUsername(value: string) {
  return value.trim().toLowerCase().replace(/[^a-z0-9._-]/g, "");
}

export async function POST(request: Request) {
  try {
    const { username, pin } = await request.json();
    const cleanUsername = normalizeUsername(String(username ?? ""));
    const cleanPin = String(pin ?? "");
    if (!cleanUsername || !/^\d{4,6}$/.test(cleanPin)) {
      return NextResponse.json({ error: "Enter a valid username and 4–6 digit PIN." }, { status: 400 });
    }

    const admin = createAdminClient();
    const { data: profile } = await admin
      .from("profiles")
      .select("id, active")
      .eq("username", cleanUsername)
      .maybeSingle();

    if (!profile?.active) {
      return NextResponse.json({ error: "Username or PIN is incorrect." }, { status: 401 });
    }

    const supabase = await createClient();
    const email = `${cleanUsername}@familyhub.local`;
    const { error } = await supabase.auth.signInWithPassword({ email, password: cleanPin });
    if (error) {
      return NextResponse.json({ error: "Username or PIN is incorrect." }, { status: 401 });
    }

    const { data: freshProfile } = await supabase
      .from("profiles")
      .select("must_change_pin")
      .eq("id", profile.id)
      .single();

    return NextResponse.json({ mustChangePin: Boolean(freshProfile?.must_change_pin) });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Unable to sign in right now." }, { status: 500 });
  }
}
