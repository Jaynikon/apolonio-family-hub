"use client";

import { ChefHat, Plus, Trash2 } from "lucide-react";
import { FormEvent, useMemo, useState } from "react";

import { AppShell } from "@/components/AppShell";

const people = [
  "Jason",
  "Theresa",
  "Brandon",
  "Emma",
  "Jacob",
  "Andrew",
  "Noelle",
  "Autumn",
  "Summer",
];

type MealRequest = {
  id: string;
  day: string;
  person: string;
  meal: string;
  note: string;
};

const weekDays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

function getCurrentWeekLabel() {
  const today = new Date();
  const start = new Date(today);
  start.setDate(today.getDate() - today.getDay());

  const end = new Date(start);
  end.setDate(start.getDate() + 6);

  return `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`;
}

export default function RecipesPage() {
  const [requests, setRequests] = useState<MealRequest[]>([
    {
      id: "1",
      day: "Friday",
      person: "Emma",
      meal: "Pizza",
      note: "Cheese or pepperoni",
    },
  ]);

  const [day, setDay] = useState("Monday");
  const [person, setPerson] = useState("Jason");
  const [meal, setMeal] = useState("");
  const [note, setNote] = useState("");

  const groupedRequests = useMemo(() => {
    return weekDays.map((weekDay) => ({
      day: weekDay,
      requests: requests.filter((request) => request.day === weekDay),
    }));
  }, [requests]);

  function addMealRequest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!meal.trim()) return;

    setRequests((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        day,
        person,
        meal: meal.trim(),
        note,
      },
    ]);

    setMeal("");
    setNote("");
  }

  function deleteRequest(id: string) {
    setRequests((current) => current.filter((request) => request.id !== id));
  }

  return (
    <AppShell
      title="Meals"
      subtitle="This week's dinner ideas from the family."
    >
      <div className="grid gap-6 xl:grid-cols-[380px_1fr]">
        <form
          onSubmit={addMealRequest}
          className="rounded-[2rem] border border-white/10 bg-white/[0.08] p-6 shadow-2xl backdrop-blur-2xl"
        >
          <div className="mb-5 flex items-center gap-3">
            <div className="rounded-2xl bg-orange-500/20 p-3 text-orange-200">
              <ChefHat className="h-6 w-6" />
            </div>

            <div>
              <h2 className="text-2xl font-bold">Dinner Request</h2>
              <p className="text-sm text-slate-400">Current week only</p>
            </div>
          </div>

          <div className="grid gap-4">
            <label className="text-sm font-semibold text-cyan-100">
              Day this week
            </label>

            <select
              value={day}
              onChange={(event) => setDay(event.target.value)}
              className="rounded-2xl border border-white/10 bg-slate-950/70 p-3 text-white outline-none focus:border-cyan-300"
            >
              {weekDays.map((weekDay) => (
                <option key={weekDay}>{weekDay}</option>
              ))}
            </select>

            <label className="text-sm font-semibold text-cyan-100">
              Who wants it?
            </label>

            <select
              value={person}
              onChange={(event) => setPerson(event.target.value)}
              className="rounded-2xl border border-white/10 bg-slate-950/70 p-3 text-white outline-none focus:border-cyan-300"
            >
              {people.map((familyMember) => (
                <option key={familyMember}>{familyMember}</option>
              ))}
            </select>

            <input
              value={meal}
              onChange={(event) => setMeal(event.target.value)}
              placeholder="Tacos, chicken alfredo, pizza..."
              className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-cyan-300"
            />

            <textarea
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder="Any notes? Example: no onions, extra cheese..."
              className="min-h-28 rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-cyan-300"
            />

            <button
              type="submit"
              className="flex items-center justify-center gap-2 rounded-2xl bg-cyan-500 px-5 py-3 font-semibold text-slate-950 hover:bg-cyan-300"
            >
              <Plus className="h-5 w-5" />
              Add Dinner Idea
            </button>
          </div>
        </form>

        <section className="rounded-[2rem] border border-white/10 bg-white/[0.08] p-6 shadow-2xl backdrop-blur-2xl">
          <div className="mb-6">
            <h2 className="text-3xl font-bold">This Week</h2>
            <p className="mt-1 text-sm text-slate-400">
              {getCurrentWeekLabel()}
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {groupedRequests.map((group) => (
              <div
                key={group.day}
                className="rounded-3xl border border-white/10 bg-white/10 p-5"
              >
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-xl font-bold">{group.day}</h3>
                  <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-slate-300">
                    {group.requests.length}
                  </span>
                </div>

                <div className="space-y-3">
                  {group.requests.length === 0 ? (
                    <p className="rounded-2xl bg-white/5 p-4 text-sm text-slate-500">
                      No dinner ideas yet.
                    </p>
                  ) : (
                    group.requests.map((request) => (
                      <div
                        key={request.id}
                        className="rounded-2xl bg-white/10 p-4"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="font-semibold">{request.meal}</p>
                            <p className="mt-1 text-sm text-cyan-100">
                              Requested by {request.person}
                            </p>

                            {request.note && (
                              <p className="mt-3 rounded-xl bg-slate-950/40 p-3 text-sm text-slate-300">
                                {request.note}
                              </p>
                            )}
                          </div>

                          <button
                            onClick={() => deleteRequest(request.id)}
                            className="rounded-xl bg-white/10 p-2 text-slate-300 hover:bg-red-500/20 hover:text-red-200"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}