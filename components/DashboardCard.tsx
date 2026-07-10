import Link from "next/link";
import type { LucideIcon } from "lucide-react";

type DashboardCardProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  href: string;
  accent: string;
};

export function DashboardCard({
  icon: Icon,
  title,
  description,
  href,
  accent,
}: DashboardCardProps) {
  return (
    <Link
      href={href}
      className="group block rounded-[2rem] border border-white/10 bg-white/[0.08] p-6 shadow-2xl shadow-black/25 backdrop-blur-2xl transition hover:-translate-y-1 hover:bg-white/[0.12]"
    >
      <div
        className={`mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${accent} shadow-lg transition group-hover:scale-110`}
      >
        <Icon className="h-7 w-7 text-white" />
      </div>

      <h2 className="text-2xl font-bold text-white">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-slate-300">{description}</p>
    </Link>
  );
}