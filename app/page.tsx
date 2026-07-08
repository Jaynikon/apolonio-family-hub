import { AppShell } from "@/components/AppShell";
import { DashboardCard } from "@/components/DashboardCard";
import { family } from "@/lib/data/family";

export default function Home() {
  return (
    <AppShell>
      <h1 className="text-4xl font-bold">Good Evening, Jason 👋</h1>

      <p className="mt-2 text-slate-400">
        Welcome to the Apolonio Family Hub.
      </p>

      <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        <DashboardCard
          icon="📅"
          title="Calendar"
          description="Upcoming family events."
        />

        <DashboardCard
          icon="🛒"
          title="Grocery"
          description="Shared shopping list."
        />

        <DashboardCard
          icon="🍽️"
          title="Recipes"
          description="Meals and favorites."
        />

        <DashboardCard
          icon="✅"
          title="Tasks"
          description="Household chores and reminders."
        />

        <DashboardCard
          icon="👨‍👩‍👧‍👦"
          title="People"
          description={`${family.length} family members`}
        />

        <DashboardCard
          icon="🚗"
          title="Vehicles"
          description="Maintenance and reminders."
        />
      </div>
    </AppShell>
  );
}