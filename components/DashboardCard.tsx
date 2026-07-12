import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
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
      className="group relative block overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.07] p-6 shadow-2xl shadow-black/20 backdrop-blur-2xl transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.11]"
    >
      <div className={`absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br ${accent} opacity-10 blur-2xl transition group-hover:opacity-20`} />

      <div className="relative flex items-start justify-between gap-4">
        <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${accent} shadow-lg transition duration-300 group-hover:scale-105`}>
          <Icon className="h-7 w-7 text-white" />
        </div>
        <ArrowUpRight className="h-5 w-5 text-slate-500 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white" />
      </div>

      <h2 className="relative mt-5 text-2xl font-bold text-white">{title}</h2>
      <p className="relative mt-2 text-sm leading-6 text-slate-300">{description}</p>
    </Link>
  );
}
