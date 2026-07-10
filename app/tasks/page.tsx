"use client";

import { CheckCircle2, Plus, Trash2 } from "lucide-react";
import { FormEvent, useState } from "react";

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

type Task = {
  id: string;
  title: string;
  assignedTo: string;
  note: string;
  completed: boolean;
};

const startingTasks: Task[] = [
  {
    id: "1",
    title: "Call doctor tomorrow",
    assignedTo: "Jason",
    note: "Ask about scheduling an appointment.",
    completed: false,
  },
];

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>(startingTasks);
  const [title, setTitle] = useState("");
  const [assignedTo, setAssignedTo] = useState("Jason");
  const [note, setNote] = useState("");

  function addTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!title.trim()) return;

    setTasks((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        title: title.trim(),
        assignedTo,
        note,
        completed: false,
      },
    ]);

    setTitle("");
    setNote("");
  }

  function toggleTask(id: string) {
    setTasks((current) =>
      current.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  }

  function deleteTask(id: string) {
    setTasks((current) => current.filter((task) => task.id !== id));
  }

  return (
    <AppShell title="Tasks" subtitle="Family reminders and things to get done.">
      <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
        <form
          onSubmit={addTask}
          className="rounded-[2rem] border border-white/10 bg-white/[0.08] p-6 shadow-2xl backdrop-blur-2xl"
        >
          <h2 className="text-2xl font-bold">Create Task</h2>

          <div className="mt-5 grid gap-4">
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Call the doctor tomorrow..."
              className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-cyan-300"
            />

            <label className="text-sm font-semibold text-cyan-100">
              Task for
            </label>

            <select
              value={assignedTo}
              onChange={(event) => setAssignedTo(event.target.value)}
              className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-cyan-300"
            >
              {people.map((person) => (
                <option key={person}>{person}</option>
              ))}
            </select>

            <textarea
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder="Notes or details..."
              className="min-h-28 rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-cyan-300"
            />

            <button
              type="submit"
              className="flex items-center justify-center gap-2 rounded-2xl bg-cyan-500 px-5 py-3 font-semibold text-slate-950 hover:bg-cyan-300"
            >
              <Plus className="h-5 w-5" />
              Add Task
            </button>
          </div>
        </form>

        <section className="rounded-[2rem] border border-white/10 bg-white/[0.08] p-6 shadow-2xl backdrop-blur-2xl">
          <h2 className="text-3xl font-bold">Task Board</h2>

          <div className="mt-5 grid gap-4">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="rounded-3xl border border-white/10 bg-white/10 p-5"
              >
                <div className="flex items-start gap-4">
                  <button
                    onClick={() => toggleTask(task.id)}
                    className={`mt-1 flex h-6 w-6 items-center justify-center rounded-lg border ${
                      task.completed
                        ? "border-cyan-300 bg-cyan-300 text-slate-950"
                        : "border-white/30"
                    }`}
                  >
                    {task.completed && <CheckCircle2 className="h-4 w-4" />}
                  </button>

                  <div className="min-w-0 flex-1">
                    <h3
                      className={
                        task.completed
                          ? "text-xl font-bold text-slate-500 line-through"
                          : "text-xl font-bold text-white"
                      }
                    >
                      {task.title}
                    </h3>

                    <p className="mt-1 text-sm text-slate-400">
                      Task for{" "}
                      <span className="text-cyan-200">{task.assignedTo}</span>
                    </p>

                    {task.note && (
                      <p className="mt-4 rounded-2xl bg-slate-950/40 p-4 text-sm text-slate-300">
                        {task.note}
                      </p>
                    )}
                  </div>

                  <button
                    onClick={() => deleteTask(task.id)}
                    className="rounded-xl bg-white/10 p-2 text-slate-300 hover:bg-red-500/20 hover:text-red-200"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}