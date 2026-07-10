import {
  CalendarDays,
  Car,
  CheckSquare,
  ChefHat,
  Gift,
  Heart,
  ShoppingCart,
  Users,
} from "lucide-react";

import { AppShell } from "@/components/AppShell";
import { DashboardCard } from "@/components/DashboardCard";

const familyDates = [
  { name: "Jason Apolonio", type: "Birthday", date: "10/24/1975" },
  { name: "Jason & Theresa", type: "Anniversary", date: "01/06/2012" },
  { name: "Theresa Apolonio", type: "Birthday", date: "03/07/1980" },
  { name: "Brandon Grinder", type: "Birthday", date: "06/27/2008" },
  { name: "Emma Grinder", type: "Birthday", date: "02/17/2010" },
  { name: "Jacob Apolonio", type: "Birthday", date: "09/21/2011" },
  { name: "Andrew Apolonio", type: "Birthday", date: "03/27/2013" },
  { name: "Noelle Ray", type: "Birthday", date: "06/29/2011" },
  { name: "Autumn Ray", type: "Birthday", date: "12/28/2012" },
  { name: "Summer Ray", type: "Birthday", date: "03/19/2014" },
];

function getThisMonthDates() {
  const today = new Date();
  const currentMonth = today.getMonth();

  return familyDates.filter((item) => {
    const [month] = item.date.split("/").map(Number);
    return month - 1 === currentMonth;
  });
}

export default function Home() {
  const thisMonthDates = getThisMonthDates();

  return (
    <AppShell
      title="Dashboard"
      subtitle="Everything your family needs, all in one place."
    >
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            <DashboardCard
              icon={CalendarDays}
              title="Calendar"
              description="Family schedules, appointments and birthdays."
              href="/calendar"
              accent="from-cyan-500 to-blue-600"
            />

            <DashboardCard
              icon={ShoppingCart}
              title="Grocery"
              description="Household list plus everyone's personal requests."
              href="/grocery"
              accent="from-emerald-500 to-teal-600"
            />

            <DashboardCard
              icon={ChefHat}
              title="Meals"
              description="Recipes, meal planning and dinner ideas."
              href="/recipes"
              accent="from-orange-500 to-red-500"
            />

            <DashboardCard
              icon={Users}
              title="People"
              description="Profiles, favorites, birthdays and notes."
              href="/people"
              accent="from-purple-500 to-pink-600"
            />

            <DashboardCard
              icon={CheckSquare}
              title="Tasks"
              description="Household chores and reminders."
              href="/tasks"
              accent="from-yellow-500 to-orange-500"
            />

            <DashboardCard
              icon={Car}
              title="Garage"
              description="Vehicles, maintenance and registrations."
              href="/vehicles"
              accent="from-indigo-500 to-cyan-500"
            />
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.08] p-6 backdrop-blur-2xl">
            <h2 className="text-xl font-bold">This Month</h2>

            <div className="mt-5 space-y-3">
              {thisMonthDates.length === 0 ? (
                <div className="rounded-2xl bg-white/10 p-4 text-slate-300">
                  No birthdays or anniversaries this month.
                </div>
              ) : (
                thisMonthDates.map((item) => (
                  <div key={`${item.name}-${item.type}`} className="rounded-2xl bg-white/10 p-4">
                    <div className="flex items-center gap-3">
                      {item.type === "Anniversary" ? (
                        <Heart className="h-5 w-5 text-pink-300" />
                      ) : (
                        <Gift className="h-5 w-5 text-cyan-300" />
                      )}

                      <div>
                        <p className="font-semibold">{item.name}</p>
                        <p className="text-sm text-slate-400">
                          {item.type} • {item.date}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="rounded-[2rem] border border-cyan-400/20 bg-gradient-to-br from-cyan-500/15 to-blue-600/15 p-6 backdrop-blur-2xl">
            <h2 className="text-xl font-bold">Quick Actions</h2>

            <div className="mt-5 grid gap-3">
              <button className="rounded-xl bg-white/10 p-3 text-left transition hover:bg-white/20">
                ➕ Add Event
              </button>

              <button className="rounded-xl bg-white/10 p-3 text-left transition hover:bg-white/20">
                🛒 Add Grocery Item
              </button>

              <button className="rounded-xl bg-white/10 p-3 text-left transition hover:bg-white/20">
                ✅ Add Task
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}