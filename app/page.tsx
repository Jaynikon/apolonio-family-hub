import { AppShell } from "@/components/AppShell";
import { DashboardCard } from "@/components/DashboardCard";

export default function Home() {
  return (
    <AppShell
      title="Dashboard"
      subtitle="Welcome home. Here's what's happening today."
    >
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        <DashboardCard icon="📅" title="Calendar" description="Upcoming family events and appointments." href="/calendar" />
        <DashboardCard icon="🛒" title="Grocery" description="Shared shopping lists and personal requests." href="/grocery" />
        <DashboardCard icon="🍽️" title="Meals" description="Recipes, meal planning, and dinner ideas." href="/recipes" />
        <DashboardCard icon="👥" title="People" description="Profiles, favorites, birthdays, and more." href="/people" />
        <DashboardCard icon="✅" title="Tasks" description="Household chores and reminders." href="/tasks" />
        <DashboardCard icon="🚗" title="Garage" description="Vehicle maintenance and reminders." href="/vehicles" />
      </div>
    </AppShell>
  );
}