"use client";

import { Archive, CheckCircle2, ImageIcon, Plus, Trash2, X } from "lucide-react";
import { FormEvent, useMemo, useState } from "react";

import { AppShell } from "@/components/AppShell";

const sections = [
  "General Household",
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

type GroceryItem = {
  id: string;
  section: string;
  name: string;
  completed: boolean;
  archived: boolean;
  createdAt: string;
  photo?: string;
};

const startingItems: GroceryItem[] = [
  { id: "1", section: "General Household", name: "Milk", completed: false, archived: false, createdAt: "2026-07-09" },
  { id: "2", section: "Jason", name: "Coke Zero", completed: false, archived: false, createdAt: "2026-07-09" },
  { id: "3", section: "Emma", name: "Takis", completed: false, archived: false, createdAt: "2026-07-09" },
];

export default function GroceryPage() {
  const [items, setItems] = useState<GroceryItem[]>(startingItems);
  const [section, setSection] = useState("General Household");
  const [itemName, setItemName] = useState("");
  const [photo, setPhoto] = useState<string | undefined>();
  const [selectedPhoto, setSelectedPhoto] = useState<string | undefined>();
  const [tripName, setTripName] = useState("Tomorrow grocery run");

  const activeItems = items.filter((item) => !item.archived);
  const completedCount = activeItems.filter((item) => item.completed).length;

  const groupedItems = useMemo(() => {
    return sections.map((person) => ({
      section: person,
      items: activeItems.filter((item) => item.section === person),
    }));
  }, [activeItems]);

  function handlePhotoUpload(file?: File) {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => setPhoto(String(reader.result));
    reader.readAsDataURL(file);
  }

  function addItem(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!itemName.trim()) return;

    setItems((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        section,
        name: itemName.trim(),
        completed: false,
        archived: false,
        createdAt: new Date().toISOString().split("T")[0],
        photo,
      },
    ]);

    setItemName("");
    setPhoto(undefined);
  }

  function toggleItem(id: string) {
    setItems((current) =>
      current.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  }

  function deleteItem(id: string) {
    setItems((current) => current.filter((item) => item.id !== id));
  }

  function archiveCompletedItems() {
    setItems((current) =>
      current.map((item) => (item.completed ? { ...item, archived: true } : item))
    );
  }

  return (
    <AppShell title="Grocery" subtitle="Personal requests automatically feed the master shopping list.">
      {selectedPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-6">
          <button
            onClick={() => setSelectedPhoto(undefined)}
            className="absolute right-6 top-6 rounded-2xl bg-white/10 p-3 text-white"
          >
            <X />
          </button>
          <img src={selectedPhoto} alt="Grocery item" className="max-h-full max-w-full rounded-3xl" />
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-[360px_1fr_360px]">
        <form onSubmit={addItem} className="rounded-[2rem] border border-white/10 bg-white/[0.08] p-6 shadow-2xl backdrop-blur-2xl">
          <h2 className="text-2xl font-bold">Add Item</h2>

          <div className="mt-5 grid gap-4">
            <input
              value={itemName}
              onChange={(event) => setItemName(event.target.value)}
              placeholder="Coke Zero, muffins, milk..."
              className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-cyan-300"
            />

            <select
              value={section}
              onChange={(event) => setSection(event.target.value)}
              className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-cyan-300"
            >
              {sections.map((person) => (
                <option key={person}>{person}</option>
              ))}
            </select>

            <label className="flex cursor-pointer items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-slate-200 hover:bg-white/20">
              <ImageIcon className="h-5 w-5" />
              Add product photo
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(event) => handlePhotoUpload(event.target.files?.[0])}
              />
            </label>

            {photo && (
              <button type="button" onClick={() => setSelectedPhoto(photo)} className="overflow-hidden rounded-2xl border border-white/10">
                <img src={photo} alt="Preview" className="h-32 w-full object-cover" />
              </button>
            )}

            <button type="submit" className="flex items-center justify-center gap-2 rounded-2xl bg-cyan-500 px-5 py-3 font-semibold text-slate-950 hover:bg-cyan-300">
              <Plus className="h-5 w-5" />
              Add to Master List
            </button>
          </div>
        </form>

        <section className="rounded-[2rem] border border-cyan-300/20 bg-white/[0.1] p-6 shadow-2xl backdrop-blur-2xl">
          <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-3xl font-bold">Master Grocery List</h2>
              <input
                value={tripName}
                onChange={(event) => setTripName(event.target.value)}
                className="mt-2 w-full rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-sm text-cyan-100 outline-none"
              />
            </div>

            <button
              onClick={archiveCompletedItems}
              disabled={completedCount === 0}
              className="flex items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3 font-semibold text-slate-950 hover:bg-cyan-100 disabled:opacity-40"
            >
              <Archive className="h-5 w-5" />
              Complete Trip
            </button>
          </div>

          <div className="mb-4 rounded-2xl bg-white/10 p-4 text-sm text-slate-300">
            {activeItems.length} active items • {completedCount} checked off
          </div>

          <div className="space-y-3">
            {activeItems.map((item) => (
              <div key={item.id} className="flex items-center gap-3 rounded-2xl bg-white/10 p-4">
                {item.photo && (
                  <button onClick={() => setSelectedPhoto(item.photo)} className="overflow-hidden rounded-xl">
                    <img src={item.photo} alt={item.name} className="h-14 w-14 object-cover" />
                  </button>
                )}

                <button
                  onClick={() => toggleItem(item.id)}
                  className={`flex h-6 w-6 items-center justify-center rounded-lg border ${
                    item.completed ? "border-cyan-300 bg-cyan-300 text-slate-950" : "border-white/30"
                  }`}
                >
                  {item.completed && <CheckCircle2 className="h-4 w-4" />}
                </button>

                <div className="min-w-0 flex-1">
                  <p className={item.completed ? "text-slate-500 line-through" : "text-white"}>{item.name}</p>
                  <p className="text-xs text-slate-400">From: {item.section} • Added {item.createdAt}</p>
                </div>

                <button onClick={() => deleteItem(item.id)} className="rounded-xl bg-white/10 p-2 text-slate-300 hover:bg-red-500/20 hover:text-red-200">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          {groupedItems.map((group) => (
            <div key={group.section} className="rounded-[2rem] border border-white/10 bg-white/[0.08] p-5 shadow-2xl backdrop-blur-2xl">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="font-bold">{group.section}</h3>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-slate-300">{group.items.length}</span>
              </div>

              <div className="space-y-2">
                {group.items.length === 0 ? (
                  <p className="text-sm text-slate-500">No requests.</p>
                ) : (
                  group.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2 text-sm">
                      {item.photo && (
                        <button onClick={() => setSelectedPhoto(item.photo)} className="overflow-hidden rounded-lg">
                          <img src={item.photo} alt={item.name} className="h-8 w-8 object-cover" />
                        </button>
                      )}
                      <span className={item.completed ? "text-slate-500 line-through" : ""}>{item.name}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          ))}
        </section>
      </div>
    </AppShell>
  );
}