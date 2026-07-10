"use client";

import {
  CalendarDays,
  Car,
  ChefHat,
  CheckSquare,
  Home,
  Settings,
  ShoppingCart,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { useTheme } from "@/components/ThemeProvider";

const navItems = [
  { label: "Dashboard", href: "/", icon: Home },
  { label: "Calendar", href: "/calendar", icon: CalendarDays },
  { label: "Grocery", href: "/grocery", icon: ShoppingCart },
  { label: "Meals", href: "/recipes", icon: ChefHat },
  { label: "Tasks", href: "/tasks", icon: CheckSquare },
  { label: "People", href: "/people", icon: Users },
  { label: "Garage", href: "/vehicles", icon: Car },
  { label: "Settings", href: "/settings", icon: Settings },
];

type AppShellProps = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
};

export function AppShell({ title, subtitle, children }: AppShellProps) {
  const pathname = usePathname();
  const { theme, customColor } = useTheme();

  const isLight = theme === "light";

  const background =
    theme === "light"
      ? "bg-slate-100 text-slate-950"
      : theme === "cyan"
      ? "bg-[#03151f] text-white"
      : theme === "custom"
      ? "bg-slate-950 text-white"
      : "bg-[#050816] text-white";

  const glow =
    theme === "light"
      ? "bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.20),_transparent_30%),radial-gradient(circle_at_top_right,_rgba(14,165,233,0.18),_transparent_32%)]"
      : theme === "cyan"
      ? "bg-[radial-gradient(circle_at_top_left,_rgba(0,245,255,0.35),_transparent_32%),radial-gradient(circle_at_bottom,_rgba(34,211,238,0.22),_transparent_36%)]"
      : theme === "custom"
      ? ""
      : "bg-[radial-gradient(circle_at_top_left,_rgba(0,245,255,0.22),_transparent_30%),radial-gradient(circle_at_top_right,_rgba(168,85,247,0.24),_transparent_32%),radial-gradient(circle_at_bottom,_rgba(59,130,246,0.16),_transparent_38%)]";

  const panel = isLight
    ? "border-slate-200 bg-white/70 text-slate-950"
    : "border-white/10 bg-white/[0.08] text-white";

  return (
    <main
      className={`min-h-screen overflow-hidden ${background}`}
      style={
        theme === "custom"
          ? {
              background: `radial-gradient(circle at top left, ${customColor}55, transparent 32%), radial-gradient(circle at bottom, ${customColor}33, transparent 38%), #050816`,
            }
          : undefined
      }
    >
      <div className={`fixed inset-0 ${glow}`} />

      <div className="relative flex min-h-screen gap-6 p-6">
        <aside
          className={`hidden w-72 shrink-0 rounded-[2rem] border p-5 shadow-2xl shadow-black/30 backdrop-blur-2xl md:block ${panel}`}
        >
          <div className={`mb-8 rounded-[1.5rem] border p-4 text-center ${panel}`}>
            <Image
              src="/family-logo.png"
              alt="Family Hub"
              width={128}
              height={128}
              priority
              className="mx-auto rounded-3xl shadow-2xl shadow-cyan-500/20"
            />

            <h1 className="mt-4 bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300 bg-clip-text text-2xl font-bold text-transparent">
              Family Hub
            </h1>

            <p className={isLight ? "mt-1 text-xs text-slate-600" : "mt-1 text-xs text-slate-300"}>
              Your home operating system
            </p>
          </div>

          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-medium transition ${
                    isActive
                      ? "border-cyan-300/40 bg-cyan-300/20 shadow-lg shadow-cyan-500/10"
                      : isLight
                      ? "border-transparent text-slate-700 hover:border-slate-200 hover:bg-slate-100"
                      : "border-transparent text-slate-300 hover:border-white/10 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        <section className="min-w-0 flex-1">
          <header
            className={`mb-6 rounded-[2rem] border p-6 shadow-2xl shadow-black/20 backdrop-blur-2xl ${panel}`}
          >
            <p className={isLight ? "text-sm text-slate-600" : "text-sm text-cyan-200"}>
              Good evening, Jason 👋
            </p>

            <h1 className="mt-2 bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300 bg-clip-text text-5xl font-bold tracking-tight text-transparent">
              {title}
            </h1>

            {subtitle && (
              <p className={isLight ? "mt-2 text-slate-600" : "mt-2 text-slate-300"}>
                {subtitle}
              </p>
            )}
          </header>

          {children}
        </section>
      </div>
    </main>
  );
}