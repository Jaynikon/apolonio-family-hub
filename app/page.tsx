import {
  ArrowRight,
  CalendarDays,
  Car,
  CheckCircle2,
  CheckSquare,
  ChefHat,
  Clock3,
  Gift,
  Heart,
  Plus,
  ShoppingCart,
  Sparkles,
  Users,
} from "lucide-react";
import Link from "next/link";

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

const quickActions = [
  { label: "Add event", href: "/calendar", icon: CalendarDays },
  { label: "Add grocery", href: "/grocery", icon: ShoppingCart },
  { label: "Add task", href: "/tasks", icon: CheckSquare },
  { label: "Plan a meal", href: "/recipes", icon: ChefHat },
];

function getUpcomingDates() {
  const now = new Date();
  const currentYear = now.getFullYear();

  return familyDates
    .map((item) => {
      const [month, day] = item.date.split("/").map(Number);
      let nextDate = new Date(currentYear, month - 1, day);
      if (nextDate < new Date(now.getFullYear(), now.getMonth(), now.getDate())) {
        nextDate = new Date(currentYear + 1, month - 1, day);
      }

      const daysAway = Math.ceil(
        (nextDate.getTime() - new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()) /
          86_400_000,
      );

      return { ...item, nextDate, daysAway };
    })
    .sort((a, b) => a.daysAway - b.daysAway)
    .slice(0, 4);
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(date);
}

export default function Home() {
  const upcomingDates = getUpcomingDates();

  return (
    <AppShell
      title="Home"
      subtitle="A clear view of everything happening with the Apolonio family."
    >
      <div className="space-y-6">
        <section className="relative overflow-hidden rounded-[2rem] border border-cyan-300/20 bg-gradient-to-br from-cyan-500/20 via-blue-500/10 to-purple-500/20 p-6 shadow-2xl shadow-cyan-950/20 backdrop-blur-2xl sm:p-8">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-cyan-400/15 blur-3xl" />
          <div className="absolute -bottom-24 left-1/3 h-64 w-64 rounded-full bg-purple-500/15 blur-3xl" />

          <div className="relative grid items-center gap-8 lg:grid-cols-[1fr_260px]">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-cyan-100">
                <Sparkles className="h-4 w-4" />
                Your family command center
              </div>

              <h2 className="mt-5 max-w-3xl text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Everything your family needs,
                <span className="block bg-gradient-to-r from-cyan-300 via-blue-300 to-emerald-300 bg-clip-text text-transparent">
                  together in one beautiful place.
                </span>
              </h2>

              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">
                Keep schedules, meals, groceries, chores, birthdays, and vehicles organized without jumping between apps.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/calendar"
                  className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-bold text-slate-950 shadow-xl transition hover:-translate-y-0.5 hover:bg-cyan-50"
                >
                  View family calendar
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/people"
                  className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/15"
                >
                  <Users className="h-4 w-4" />
                  Family profiles
                </Link>
              </div>
            </div>

            <div className="mx-auto flex w-full max-w-[260px] items-center justify-center rounded-[2rem] border border-white/10 bg-slate-950/30 p-5 shadow-2xl shadow-cyan-500/10 backdrop-blur-xl">
              <img
                src="/family-logo.png"
                alt="Apolonio Family Hub logo"
                className="h-auto w-full rounded-[1.5rem] object-cover"
              />
            </div>
          </div>
        </section>

        <div className="grid gap-6 xl:grid-cols-[1.65fr_1fr]">
          <section className="rounded-[2rem] border border-white/10 bg-white/[0.07] p-6 shadow-2xl shadow-black/20 backdrop-blur-2xl">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-300">
                  Today&apos;s briefing
                </p>
                <h2 className="mt-1 text-2xl font-bold text-white">Your home at a glance</h2>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-400/10 px-3 py-1.5 text-xs font-semibold text-emerald-200">
                <CheckCircle2 className="h-4 w-4" />
                All systems ready
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <Link href="/calendar" className="group rounded-3xl border border-white/10 bg-white/[0.06] p-5 transition hover:border-cyan-300/30 hover:bg-white/[0.1]">
                <div className="flex items-start justify-between gap-4">
                  <div className="rounded-2xl bg-cyan-400/15 p-3 text-cyan-200"><CalendarDays className="h-6 w-6" /></div>
                  <ArrowRight className="h-5 w-5 text-slate-500 transition group-hover:translate-x-1 group-hover:text-cyan-200" />
                </div>
                <p className="mt-5 text-sm text-slate-400">Family schedule</p>
                <p className="mt-1 text-xl font-bold text-white">See what&apos;s coming up</p>
              </Link>

              <Link href="/grocery" className="group rounded-3xl border border-white/10 bg-white/[0.06] p-5 transition hover:border-emerald-300/30 hover:bg-white/[0.1]">
                <div className="flex items-start justify-between gap-4">
                  <div className="rounded-2xl bg-emerald-400/15 p-3 text-emerald-200"><ShoppingCart className="h-6 w-6" /></div>
                  <ArrowRight className="h-5 w-5 text-slate-500 transition group-hover:translate-x-1 group-hover:text-emerald-200" />
                </div>
                <p className="mt-5 text-sm text-slate-400">Shared grocery list</p>
                <p className="mt-1 text-xl font-bold text-white">Add what the house needs</p>
              </Link>

              <Link href="/tasks" className="group rounded-3xl border border-white/10 bg-white/[0.06] p-5 transition hover:border-amber-300/30 hover:bg-white/[0.1]">
                <div className="flex items-start justify-between gap-4">
                  <div className="rounded-2xl bg-amber-400/15 p-3 text-amber-200"><CheckSquare className="h-6 w-6" /></div>
                  <ArrowRight className="h-5 w-5 text-slate-500 transition group-hover:translate-x-1 group-hover:text-amber-200" />
                </div>
                <p className="mt-5 text-sm text-slate-400">Household tasks</p>
                <p className="mt-1 text-xl font-bold text-white">Keep everyone on track</p>
              </Link>

              <Link href="/recipes" className="group rounded-3xl border border-white/10 bg-white/[0.06] p-5 transition hover:border-orange-300/30 hover:bg-white/[0.1]">
                <div className="flex items-start justify-between gap-4">
                  <div className="rounded-2xl bg-orange-400/15 p-3 text-orange-200"><ChefHat className="h-6 w-6" /></div>
                  <ArrowRight className="h-5 w-5 text-slate-500 transition group-hover:translate-x-1 group-hover:text-orange-200" />
                </div>
                <p className="mt-5 text-sm text-slate-400">Meals and recipes</p>
                <p className="mt-1 text-xl font-bold text-white">Plan dinner together</p>
              </Link>
            </div>
          </section>

          <section className="rounded-[2rem] border border-white/10 bg-white/[0.07] p-6 shadow-2xl shadow-black/20 backdrop-blur-2xl">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-purple-300">Coming up</p>
                <h2 className="mt-1 text-2xl font-bold text-white">Family dates</h2>
              </div>
              <Gift className="h-6 w-6 text-purple-300" />
            </div>

            <div className="mt-6 space-y-3">
              {upcomingDates.map((item) => (
                <div key={`${item.name}-${item.type}`} className="flex items-center gap-4 rounded-2xl border border-white/8 bg-white/[0.06] p-4">
                  <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${item.type === "Anniversary" ? "bg-pink-400/15 text-pink-200" : "bg-cyan-400/15 text-cyan-200"}`}>
                    {item.type === "Anniversary" ? <Heart className="h-5 w-5" /> : <Gift className="h-5 w-5" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-white">{item.name}</p>
                    <p className="text-sm text-slate-400">{item.type} · {formatDate(item.nextDate)}</p>
                  </div>
                  <span className="rounded-full bg-white/8 px-3 py-1 text-xs font-medium text-slate-300">
                    {item.daysAway === 0 ? "Today" : `${item.daysAway}d`}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>

        <section className="rounded-[2rem] border border-white/10 bg-white/[0.07] p-6 shadow-2xl shadow-black/20 backdrop-blur-2xl">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-300">Quick add</p>
              <h2 className="mt-1 text-2xl font-bold text-white">Get something done</h2>
            </div>
            <Clock3 className="h-6 w-6 text-slate-400" />
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Link key={action.label} href={action.href} className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-4 font-semibold text-white transition hover:-translate-y-0.5 hover:border-cyan-300/30 hover:bg-white/[0.11]">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-cyan-200"><Icon className="h-5 w-5" /></span>
                  <span className="flex-1">{action.label}</span>
                  <Plus className="h-4 w-4 text-slate-500 transition group-hover:rotate-90 group-hover:text-cyan-200" />
                </Link>
              );
            })}
          </div>
        </section>

        <section>
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-300">Explore</p>
              <h2 className="mt-1 text-2xl font-bold text-white">Everything in your hub</h2>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            <DashboardCard icon={CalendarDays} title="Calendar" description="Family schedules, appointments and birthdays." href="/calendar" accent="from-cyan-500 to-blue-600" />
            <DashboardCard icon={ShoppingCart} title="Grocery" description="Household list plus everyone&apos;s personal requests." href="/grocery" accent="from-emerald-500 to-teal-600" />
            <DashboardCard icon={ChefHat} title="Meals" description="Recipes, meal planning and dinner ideas." href="/recipes" accent="from-orange-500 to-red-500" />
            <DashboardCard icon={Users} title="People" description="Profiles, favorites, birthdays and notes." href="/people" accent="from-purple-500 to-pink-600" />
            <DashboardCard icon={CheckSquare} title="Tasks" description="Household chores and reminders." href="/tasks" accent="from-yellow-500 to-orange-500" />
            <DashboardCard icon={Car} title="Garage" description="Vehicles, maintenance and registrations." href="/vehicles" accent="from-indigo-500 to-cyan-500" />
          </div>
        </section>
      </div>
    </AppShell>
  );
}
