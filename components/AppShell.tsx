import Image from "next/image";
import Link from "next/link";

const navItems = [
  { label: "Dashboard", href: "/", icon: "🏠" },
  { label: "Calendar", href: "/calendar", icon: "📅" },
  { label: "Grocery", href: "/grocery", icon: "🛒" },
  { label: "Meals", href: "/recipes", icon: "🍽️" },
  { label: "Tasks", href: "/tasks", icon: "✅" },
  { label: "People", href: "/people", icon: "👥" },
  { label: "Garage", href: "/vehicles", icon: "🚗" },
  { label: "Settings", href: "/settings", icon: "⚙️" },
];

type AppShellProps = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
};

export function AppShell({ title, subtitle, children }: AppShellProps) {
  return (
    <main className="min-h-screen overflow-hidden bg-slate-950 text-white">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.22),_transparent_34%),radial-gradient(circle_at_top_right,_rgba(168,85,247,0.24),_transparent_32%),radial-gradient(circle_at_bottom,_rgba(34,197,94,0.14),_transparent_35%)]" />

      <div className="relative flex min-h-screen">
        <aside className="hidden w-72 border-r border-white/10 bg-white/10 p-6 shadow-2xl backdrop-blur-2xl md:block">
          <div className="mb-10 flex flex-col items-center text-center">
            <Image
              src="/family-logo.png"
              alt="Family Hub"
              width={150}
              height={150}
              priority
              className="rounded-3xl shadow-2xl shadow-cyan-500/20"
            />

            <h1 className="mt-4 bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300 bg-clip-text text-2xl font-bold text-transparent">
              Family Hub
            </h1>

            <p className="mt-1 text-sm text-slate-300">
              Your family&apos;s home operating system
            </p>
          </div>

          <nav className="space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 rounded-xl border border-transparent px-4 py-3 text-slate-200 transition hover:border-white/10 hover:bg-white/15 hover:text-white"
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </aside>

        <section className="flex-1 p-6 md:p-10">
          <header className="mb-8 rounded-3xl border border-white/10 bg-white/10 p-6 shadow-2xl backdrop-blur-2xl">
            <p className="text-sm text-cyan-200">Good evening, Jason 👋</p>
            <h1 className="mt-2 bg-gradient-to-r from-white via-cyan-100 to-purple-200 bg-clip-text text-5xl font-bold text-transparent">
              {title}
            </h1>
            {subtitle && <p className="mt-2 text-slate-300">{subtitle}</p>}
          </header>

          {children}
        </section>
      </div>
    </main>
  );
}