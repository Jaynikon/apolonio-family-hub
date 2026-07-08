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
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="flex min-h-screen">
        <aside className="hidden w-72 border-r border-white/10 bg-slate-900/80 p-6 md:block">
          <div className="mb-10 flex flex-col items-center text-center">
            <Image
              src="/family-logo.png"
              alt="Family Hub"
              width={150}
              height={150}
              priority
              className="rounded-3xl"
            />

            <h1 className="mt-4 text-2xl font-bold">Family Hub</h1>

            <p className="mt-1 text-sm text-slate-400">
              Your family&apos;s home operating system
            </p>
          </div>

          <nav className="space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-slate-300 transition hover:bg-white/10 hover:text-white"
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </aside>

        <section className="flex-1 p-6 md:p-10">
          <header className="mb-8">
            <p className="text-sm text-slate-400">Good evening, Jason 👋</p>
            <h1 className="mt-2 text-4xl font-bold">{title}</h1>
            {subtitle && <p className="mt-2 text-slate-400">{subtitle}</p>}
          </header>

          {children}
        </section>
      </div>
    </main>
  );
}