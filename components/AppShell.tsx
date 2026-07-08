import Image from "next/image";
type AppShellProps = {
  children: React.ReactNode;
};

const navItems = [
  "Dashboard",
  "Calendar",
  "Grocery",
  "Recipes",
  "Tasks",
  "People",
  "Vehicles",
  "Settings",
];

export function AppShell({ children }: AppShellProps) {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="flex min-h-screen">
        <aside className="hidden w-72 border-r border-white/10 bg-slate-900/80 p-6 md:block">
<div className="flex items-center gap-3">
  <Image
    src="/family-logo.png"
    alt="Family Logo"
    width={48}
    height={48}
    className="rounded-xl"
  />

  <div>
    <h1 className="text-xl font-bold">Family</h1>
    <p className="text-xs text-slate-400">
      Home Operating System
    </p>
  </div>
</div>
          <nav className="mt-8 space-y-2">
            {navItems.map((item) => (
              <div key={item} className="rounded-xl px-4 py-3 text-slate-300 hover:bg-white/10">
                {item}
              </div>
            ))}
          </nav>
        </aside>

        <section className="flex-1 p-6 md:p-10">{children}</section>
      </div>
    </main>
  );
}