import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  const { pin } = await request.json();
  const cleanPin = String(pin ?? "");
  if (!/^\d{4,6}$/.test(cleanPin)) {
    return NextResponse.json({ error: "Choose a 4–6 digit PIN." }, { status: 400 });
  }

  const { error: authError } = await supabase.auth.updateUser({ password: cleanPin });
  if (authError) return NextResponse.json({ error: authError.message }, { status: 400 });

  const { error: profileError } = await supabase
    .from("profiles")
    .update({ must_change_pin: false, updated_at: new Date().toISOString() })
    .eq("id", user.id);
  if (profileError) return NextResponse.json({ error: profileError.message }, { status: 400 });

  return NextResponse.json({ ok: true });
}
