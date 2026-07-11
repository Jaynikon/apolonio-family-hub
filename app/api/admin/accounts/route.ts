import { NextResponse } from "next/server";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

async function requireAdmin() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, active")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile?.active || profile.role !== "admin") {
    return null;
  }

  return user;
}

function cleanUsername(value: unknown) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._-]/g, "");
}

export async function POST(request: Request) {
  let createdUserId: string | null = null;

  try {
    const currentAdmin = await requireAdmin();

    if (!currentAdmin) {
      return NextResponse.json(
        { error: "Admin access required." },
        { status: 403 }
      );
    }

    const body = await request.json();

    const displayName = String(body.displayName ?? "").trim();
    const username = cleanUsername(body.username);
    const temporaryPin = String(body.temporaryPin ?? "").trim();
    const role = body.role === "admin" ? "admin" : "member";

    if (!displayName) {
      return NextResponse.json(
        { error: "Enter the family member's name." },
        { status: 400 }
      );
    }

    if (!username) {
      return NextResponse.json(
        { error: "Enter a valid username." },
        { status: 400 }
      );
    }

    if (!/^\d{6}$/.test(temporaryPin)) {
      return NextResponse.json(
        { error: "The temporary PIN must be exactly 6 digits." },
        { status: 400 }
      );
    }

    const admin = createAdminClient();

    const { data: existingProfile, error: existingProfileError } =
      await admin
        .from("profiles")
        .select("id")
        .eq("username", username)
        .maybeSingle();

    if (existingProfileError) {
      console.error("USERNAME CHECK ERROR:", existingProfileError);

      return NextResponse.json(
        { error: existingProfileError.message },
        { status: 400 }
      );
    }

    if (existingProfile) {
      return NextResponse.json(
        { error: "That username is already being used." },
        { status: 409 }
      );
    }

    const email = `${username}@familyhub.local`;

    const { data: userData, error: createUserError } =
      await admin.auth.admin.createUser({
        email,
        password: temporaryPin,
        email_confirm: true,
        user_metadata: {
          display_name: displayName,
          username,
        },
      });

    if (createUserError || !userData.user) {
      console.error("CREATE FAMILY USER ERROR:", createUserError);

      const message =
        createUserError?.message?.toLowerCase().includes("already")
          ? "That username is already being used."
          : createUserError?.message ?? "Could not create the account.";

      return NextResponse.json(
        { error: message },
        { status: 400 }
      );
    }

    createdUserId = userData.user.id;

    const { error: profileError } = await admin
      .from("profiles")
      .upsert(
        {
          id: createdUserId,
          username,
          display_name: displayName,
          role,
          active: true,
          must_change_pin: true,
        },
        {
          onConflict: "id",
        }
      );

    if (profileError) {
      console.error("CREATE FAMILY PROFILE ERROR:", profileError);

      await admin.auth.admin.deleteUser(createdUserId);

      return NextResponse.json(
        { error: profileError.message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      ok: true,
      account: {
        id: createdUserId,
        username,
        display_name: displayName,
        role,
        active: true,
        must_change_pin: true,
      },
    });
  } catch (error) {
    console.error("CREATE ACCOUNT ERROR:", error);

    if (createdUserId) {
      try {
        const admin = createAdminClient();
        await admin.auth.admin.deleteUser(createdUserId);
      } catch (cleanupError) {
        console.error("ACCOUNT CLEANUP ERROR:", cleanupError);
      }
    }

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Could not create the account.",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const currentAdmin = await requireAdmin();

    if (!currentAdmin) {
      return NextResponse.json(
        { error: "Admin access required." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const id = String(body.id ?? "");
    const action = String(body.action ?? "");
    const admin = createAdminClient();

    if (!id) {
      return NextResponse.json(
        { error: "Account ID is required." },
        { status: 400 }
      );
    }

    if (action === "reset_pin") {
      const temporaryPin = String(body.temporaryPin ?? "").trim();

      if (!/^\d{6}$/.test(temporaryPin)) {
        return NextResponse.json(
          { error: "The temporary PIN must be exactly 6 digits." },
          { status: 400 }
        );
      }

      const { error: authError } =
        await admin.auth.admin.updateUserById(id, {
          password: temporaryPin,
        });

      if (authError) {
        return NextResponse.json(
          { error: authError.message },
          { status: 400 }
        );
      }

      const { error: profileError } = await admin
        .from("profiles")
        .update({ must_change_pin: true })
        .eq("id", id);

      if (profileError) {
        return NextResponse.json(
          { error: profileError.message },
          { status: 400 }
        );
      }

      return NextResponse.json({ ok: true });
    }

    if (action === "toggle_active") {
      const { data: profile, error: profileLookupError } =
        await admin
          .from("profiles")
          .select("active")
          .eq("id", id)
          .maybeSingle();

      if (profileLookupError) {
        return NextResponse.json(
          { error: profileLookupError.message },
          { status: 400 }
        );
      }

      if (!profile) {
        return NextResponse.json(
          { error: "Account not found." },
          { status: 404 }
        );
      }

      const newActiveState = !profile.active;

      const { error: profileUpdateError } = await admin
        .from("profiles")
        .update({ active: newActiveState })
        .eq("id", id);

      if (profileUpdateError) {
        return NextResponse.json(
          { error: profileUpdateError.message },
          { status: 400 }
        );
      }

      const { error: authUpdateError } =
        await admin.auth.admin.updateUserById(id, {
          ban_duration: newActiveState ? "none" : "876000h",
        });

      if (authUpdateError) {
        return NextResponse.json(
          { error: authUpdateError.message },
          { status: 400 }
        );
      }

      return NextResponse.json({
        ok: true,
        active: newActiveState,
      });
    }

    return NextResponse.json(
      { error: "Unknown account action." },
      { status: 400 }
    );
  } catch (error) {
    console.error("UPDATE ACCOUNT ERROR:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Could not update the account.",
      },
      { status: 500 }
    );
  }
}