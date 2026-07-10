"use client";

import { CalendarClock, Camera, CheckCircle2, Plus } from "lucide-react";
import { FormEvent, useState } from "react";

import { AppShell } from "@/components/AppShell";

const family = [
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

type Vehicle = {
  id: string;
  name: string;
  assignedTo: string;
  photo?: string;
};

type MaintenanceTask = {
  id: string;
  vehicle: string;
  assignedTo: string;
  title: string;
  dueDate: string;
  notes: string;
  completed: boolean;
};

const startingVehicles: Vehicle[] = [
  { id: "1", name: "2022 Tesla Model 3", assignedTo: "Add later" },
  { id: "2", name: "2018 Jeep Grand Cherokee Laredo", assignedTo: "Add later" },
  { id: "3", name: "2020 Chevy Malibu", assignedTo: "Noelle next year" },
  { id: "4", name: "2021 Honda Odyssey", assignedTo: "Add later" },
  { id: "5", name: "2026 Dodge Ram 1500", assignedTo: "Add later" },
  { id: "6", name: "2019 EZGO Express L6 Golf Cart", assignedTo: "Family Golf Cart" },
];

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>(startingVehicles);
  const [tasks, setTasks] = useState<MaintenanceTask[]>([]);

  const [vehicle, setVehicle] = useState(startingVehicles[0].name);
  const [assignedTo, setAssignedTo] = useState("Jason");
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [notes, setNotes] = useState("");

  function uploadVehiclePhoto(vehicleId: string, file?: File) {
    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      setVehicles((current) =>
        current.map((item) =>
          item.id === vehicleId ? { ...item, photo: String(reader.result) } : item
        )
      );
    };

    reader.readAsDataURL(file);
  }

  function addTask(e: FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;

    setTasks((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        vehicle,
        assignedTo,
        title,
        dueDate,
        notes,
        completed: false,
      },
    ]);

    setTitle("");
    setDueDate("");
    setNotes("");
  }

  function toggle(id: string) {
    setTasks((current) =>
      current.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  }

  return (
    <AppShell title="Garage" subtitle="Family vehicles and maintenance reminders.">
      <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
        <section className="space-y-6">
          <form
            onSubmit={addTask}
            className="rounded-[2rem] border border-white/10 bg-white/[0.08] p-6 shadow-2xl backdrop-blur-2xl"
          >
            <h2 className="mb-5 text-2xl font-bold">New Maintenance Item</h2>

            <div className="grid gap-4">
              <label className="text-sm text-cyan-200">Vehicle</label>

              <select
                value={vehicle}
                onChange={(e) => setVehicle(e.target.value)}
                className="rounded-2xl border border-white/10 bg-slate-950/70 p-3 text-white outline-none focus:border-cyan-300"
              >
                {vehicles.map((vehicle) => (
                  <option key={vehicle.id}>{vehicle.name}</option>
                ))}
              </select>

              <label className="text-sm text-cyan-200">Assigned To</label>

              <select
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                className="rounded-2xl border border-white/10 bg-slate-950/70 p-3 text-white outline-none focus:border-cyan-300"
              >
                {family.map((person) => (
                  <option key={person}>{person}</option>
                ))}
              </select>

              <input
                placeholder="Oil change, tire rotation..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="rounded-2xl border border-white/10 bg-slate-950/70 p-3 text-white outline-none focus:border-cyan-300"
              />

              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="rounded-2xl border border-white/10 bg-slate-950/70 p-3 text-white outline-none focus:border-cyan-300"
              />

              <textarea
                rows={4}
                placeholder="Notes..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="rounded-2xl border border-white/10 bg-slate-950/70 p-3 text-white outline-none focus:border-cyan-300"
              />

              <button className="mt-2 flex items-center justify-center gap-2 rounded-2xl bg-cyan-500 py-3 font-semibold text-slate-900 hover:bg-cyan-300">
                <Plus size={18} />
                Add Reminder
              </button>
            </div>
          </form>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.08] p-6 shadow-2xl backdrop-blur-2xl">
            <h2 className="text-2xl font-bold">Maintenance Reminders</h2>

            <div className="mt-5 space-y-4">
              {tasks.length === 0 && (
                <p className="rounded-2xl bg-white/5 p-4 text-sm text-slate-400">
                  No maintenance reminders yet.
                </p>
              )}

              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="rounded-3xl border border-white/10 bg-white/10 p-5"
                >
                  <div className="flex justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-bold">{task.title}</h3>
                      <p className="mt-2 text-slate-300">🚗 {task.vehicle}</p>
                      <p className="text-slate-400">Assigned to: {task.assignedTo}</p>
                      <p className="text-slate-400">
                        <CalendarClock className="mr-1 inline h-4" />
                        {task.dueDate || "No due date"}
                      </p>

                      {task.notes && (
                        <p className="mt-4 rounded-xl bg-slate-900/40 p-3 text-sm text-slate-300">
                          {task.notes}
                        </p>
                      )}
                    </div>

                    <button
                      onClick={() => toggle(task.id)}
                      className={`h-12 w-12 rounded-xl ${
                        task.completed ? "bg-green-500" : "bg-white/10"
                      }`}
                    >
                      <CheckCircle2 className="mx-auto" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-2">
          {vehicles.map((vehicle) => (
            <div
              key={vehicle.id}
              className="rounded-[2rem] border border-white/10 bg-white/[0.08] p-6 shadow-2xl backdrop-blur-2xl"
            >
              <div className="mb-5 overflow-hidden rounded-3xl border border-white/10 bg-slate-950/60">
                {vehicle.photo ? (
                  <img
                    src={vehicle.photo}
                    alt={vehicle.name}
                    className="h-44 w-full object-cover"
                  />
                ) : (
                  <div className="flex h-44 items-center justify-center text-slate-400">
                    <Camera className="mr-2 h-6 w-6" />
                    Add vehicle photo
                  </div>
                )}
              </div>

              <label className="mb-5 flex cursor-pointer items-center justify-center gap-2 rounded-2xl bg-white/10 px-4 py-3 text-sm text-slate-200 hover:bg-white/20">
                <Camera className="h-5 w-5" />
                Upload Photo
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(event) =>
                    uploadVehiclePhoto(vehicle.id, event.target.files?.[0])
                  }
                />
              </label>

              <h2 className="text-2xl font-bold">{vehicle.name}</h2>

              <div className="mt-4 rounded-2xl bg-white/10 p-4">
                <p className="text-xs text-cyan-100">Assigned To</p>
                <p className="mt-1 text-slate-200">{vehicle.assignedTo}</p>
              </div>
            </div>
          ))}
        </section>
      </div>
    </AppShell>
  );
}