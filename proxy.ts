import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return response;

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });

  const { data: { user } } = await supabase.auth.getUser();
  const path = request.nextUrl.pathname;
  const publicPath = path.startsWith("/login") || path.startsWith("/api/auth") || path.startsWith("/api/setup") || path.startsWith("/_next") || path === "/favicon.ico";

  if (!user && !publicPath) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    return NextResponse.redirect(loginUrl);
  }

  if (user && path === "/login") {
    const { data: profile } = await supabase
      .from("profiles")
      .select("must_change_pin")
      .eq("id", user.id)
      .maybeSingle();
    const target = request.nextUrl.clone();
    target.pathname = profile?.must_change_pin ? "/change-pin" : "/";
    return NextResponse.redirect(target);
  }

  if (user && path !== "/change-pin" && !path.startsWith("/api/auth/change-pin")) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("must_change_pin")
      .eq("id", user.id)
      .maybeSingle();
    if (profile?.must_change_pin) {
      const changeUrl = request.nextUrl.clone();
      changeUrl.pathname = "/change-pin";
      return NextResponse.redirect(changeUrl);
    }
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
