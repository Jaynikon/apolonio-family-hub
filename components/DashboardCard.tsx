type DashboardCardProps = {
  icon: string;
  title: string;
  description: string;
};

export function DashboardCard({ icon, title, description }: DashboardCardProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg transition hover:-translate-y-1 hover:bg-white/10">
      <div className="mb-4 text-4xl">{icon}</div>
      <h2 className="text-xl font-semibold text-white">{title}</h2>
      <p className="mt-2 text-sm text-slate-400">{description}</p>
    </div>
  );
}