import { NextResponse } from "next/server";

import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  try {
    const admin = createAdminClient();

    const { count, error: countError } = await admin
      .from("profiles")
      .select("id", { count: "exact", head: true });

    if (countError) {
      console.error("PROFILE COUNT ERROR:", countError);

      return NextResponse.json(
        {
          error: countError.message,
          details: countError,
        },
        { status: 400 }
      );
    }

    if ((count ?? 0) > 0) {
      return NextResponse.json(
        { error: "Family Hub is already set up." },
        { status: 409 }
      );
    }

    const body = await request.json();

    const cleanUsername = String(body.username ?? "")
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9._-]/g, "");

    const cleanName = String(body.displayName ?? "").trim();
    const cleanPin = String(body.pin ?? "").trim();

    if (!cleanName || !cleanUsername || !/^\d{6}$/.test(cleanPin)) {
      return NextResponse.json(
        {
          error: "Enter a name, username, and 6-digit PIN.",
        },
        { status: 400 }
      );
    }

    const syntheticEmail = `${cleanUsername}@familyhub.local`;

    const { data: userData, error: userError } =
      await admin.auth.admin.createUser({
        email: syntheticEmail,
        password: cleanPin,
        email_confirm: true,
        user_metadata: {
          display_name: cleanName,
          username: cleanUsername,
        },
      });

    if (userError || !userData.user) {
      console.error("CREATE USER ERROR:", userError);

      return NextResponse.json(
        {
          error: userError?.message ?? "Could not create account.",
          details: userError,
        },
        { status: 400 }
      );
    }

    const userId = userData.user.id;

    const { error: profileError } = await admin
      .from("profiles")
      .upsert(
        {
          id: userId,
          username: cleanUsername,
          display_name: cleanName,
          role: "admin",
          active: true,
          must_change_pin: false,
        },
        {
          onConflict: "id",
        }
      );

    if (profileError) {
      console.error("CREATE PROFILE ERROR:", profileError);

      await admin.auth.admin.deleteUser(userId);

      return NextResponse.json(
        {
          error: profileError.message,
          details: profileError,
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      ok: true,
      username: cleanUsername,
    });
  } catch (error) {
    console.error("SETUP ERROR:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Setup failed.",
      },
      { status: 500 }
    );
  }
}