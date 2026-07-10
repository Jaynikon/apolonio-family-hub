"use client";

import { Cake, Camera, Gift, Plus, Star, Trash2, UserRound } from "lucide-react";
import { useState } from "react";

import { AppShell } from "@/components/AppShell";

type Person = {
  name: string;
  role: string;
  birthday: string;
  color: string;
  photo?: string;
  favoriteFoods: string[];
  favoriteDrinks: string[];
  favoriteSnacks: string[];
  giftIdeas: string[];
  notes: string[];
};

const startingPeople: Person[] = [
  { name: "Jason Apolonio", role: "Dad", birthday: "10/24/1975", color: "from-cyan-500 to-blue-600", favoriteFoods: [], favoriteDrinks: [], favoriteSnacks: [], giftIdeas: [], notes: [] },
  { name: "Theresa Apolonio", role: "Mom", birthday: "03/07/1980", color: "from-pink-500 to-purple-600", favoriteFoods: [], favoriteDrinks: [], favoriteSnacks: [], giftIdeas: [], notes: [] },
  { name: "Brandon Grinder", role: "Young Adult", birthday: "06/27/2008", color: "from-blue-500 to-indigo-600", favoriteFoods: [], favoriteDrinks: [], favoriteSnacks: [], giftIdeas: [], notes: [] },
  { name: "Emma Grinder", role: "Teen", birthday: "02/17/2010", color: "from-purple-500 to-fuchsia-600", favoriteFoods: [], favoriteDrinks: [], favoriteSnacks: [], giftIdeas: [], notes: [] },
  { name: "Jacob Apolonio", role: "Family", birthday: "09/21/2011", color: "from-emerald-500 to-teal-600", favoriteFoods: [], favoriteDrinks: [], favoriteSnacks: [], giftIdeas: [], notes: [] },
  { name: "Andrew Apolonio", role: "Family", birthday: "03/27/2013", color: "from-orange-500 to-amber-600", favoriteFoods: [], favoriteDrinks: [], favoriteSnacks: [], giftIdeas: [], notes: [] },
  { name: "Noelle Ray", role: "Family", birthday: "06/29/2011", color: "from-rose-500 to-pink-600", favoriteFoods: [], favoriteDrinks: [], favoriteSnacks: [], giftIdeas: [], notes: [] },
  { name: "Autumn Ray", role: "Family", birthday: "12/28/2012", color: "from-amber-500 to-orange-600", favoriteFoods: [], favoriteDrinks: [], favoriteSnacks: [], giftIdeas: [], notes: [] },
  { name: "Summer Ray", role: "Family", birthday: "03/19/2014", color: "from-sky-500 to-cyan-600", favoriteFoods: [], favoriteDrinks: [], favoriteSnacks: [], giftIdeas: [], notes: [] },
];

function getAge(birthday: string) {
  const [month, day, year] = birthday.split("/").map(Number);
  const today = new Date();
  let age = today.getFullYear() - year;

  if (
    today.getMonth() + 1 < month ||
    (today.getMonth() + 1 === month && today.getDate() < day)
  ) {
    age--;
  }

  return age;
}

export default function PeoplePage() {
  const [people, setPeople] = useState<Person[]>(startingPeople);
  const [inputs, setInputs] = useState<Record<string, string>>({});

  function inputKey(personName: string, field: keyof Person) {
    return `${personName}-${String(field)}`;
  }

  function updateInput(personName: string, field: keyof Person, value: string) {
    setInputs((current) => ({
      ...current,
      [inputKey(personName, field)]: value,
    }));
  }

  function addValue(personName: string, field: keyof Person) {
    const key = inputKey(personName, field);
    const value = inputs[key]?.trim();

    if (!value) return;

    setPeople((current) =>
      current.map((person) =>
        person.name === personName
          ? { ...person, [field]: [...(person[field] as string[]), value] }
          : person
      )
    );

    setInputs((current) => ({ ...current, [key]: "" }));
  }

  function removeValue(personName: string, field: keyof Person, value: string) {
    setPeople((current) =>
      current.map((person) =>
        person.name === personName
          ? {
              ...person,
              [field]: (person[field] as string[]).filter((item) => item !== value),
            }
          : person
      )
    );
  }

  function uploadPhoto(personName: string, file?: File) {
    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      setPeople((current) =>
        current.map((person) =>
          person.name === personName
            ? { ...person, photo: String(reader.result) }
            : person
        )
      );
    };

    reader.readAsDataURL(file);
  }

  function EditableList({
    person,
    field,
    label,
  }: {
    person: Person;
    field: "favoriteFoods" | "favoriteDrinks" | "favoriteSnacks" | "giftIdeas" | "notes";
    label: string;
  }) {
    const key = inputKey(person.name, field);
    const values = person[field];

    return (
      <div className="rounded-2xl bg-white/10 p-4">
        <label className="text-sm font-semibold text-cyan-100">{label}</label>

        <div className="mt-3 flex gap-2">
          <input
            value={inputs[key] ?? ""}
            onChange={(event) => updateInput(person.name, field, event.target.value)}
            placeholder={`Add ${label.toLowerCase()}...`}
            className="min-w-0 flex-1 rounded-xl border border-white/10 bg-slate-950/70 px-3 py-2 text-sm text-white outline-none focus:border-cyan-300"
          />

          <button
            type="button"
            onClick={() => addValue(person.name, field)}
            className="rounded-xl bg-cyan-500 px-3 text-slate-950 hover:bg-cyan-300"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {values.length === 0 ? (
            <p className="text-sm text-slate-500">Nothing added yet.</p>
          ) : (
            values.map((value) => (
              <span
                key={value}
                className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm text-slate-200"
              >
                {value}
                <button
                  type="button"
                  onClick={() => removeValue(person.name, field, value)}
                  className="text-slate-400 hover:text-red-300"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </span>
            ))
          )}
        </div>
      </div>
    );
  }

  return (
    <AppShell title="People" subtitle="Profiles, photos, birthdays and favorites.">
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {people.map((person) => (
          <div
            key={person.name}
            className="rounded-[2rem] border border-white/10 bg-white/[0.08] p-6 shadow-2xl backdrop-blur-2xl"
          >
            <div className="mb-5 flex items-center gap-4">
              <div className={`flex h-20 w-20 items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-br ${person.color}`}>
                {person.photo ? (
                  <img src={person.photo} alt={person.name} className="h-full w-full object-cover" />
                ) : (
                  <UserRound className="h-10 w-10 text-white" />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <h2 className="text-2xl font-bold">{person.name}</h2>
                <p className="text-sm text-cyan-100/80">{person.role}</p>
                <p className="mt-1 text-sm text-slate-400">
                  <Cake className="mr-1 inline h-4 w-4 text-cyan-200" />
                  {person.birthday} • Age {getAge(person.birthday)}
                </p>
              </div>
            </div>

            <label className="mb-5 flex cursor-pointer items-center justify-center gap-2 rounded-2xl bg-white/10 px-4 py-3 text-sm text-slate-200 hover:bg-white/20">
              <Camera className="h-5 w-5" />
              Upload Photo
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(event) => uploadPhoto(person.name, event.target.files?.[0])}
              />
            </label>

            <div className="grid gap-3">
              <EditableList person={person} field="favoriteFoods" label="Favorite Foods" />
              <EditableList person={person} field="favoriteDrinks" label="Favorite Drinks" />
              <EditableList person={person} field="favoriteSnacks" label="Favorite Snacks" />
              <EditableList person={person} field="giftIdeas" label="Gift Ideas" />
              <EditableList person={person} field="notes" label="Notes" />
            </div>
          </div>
        ))}
      </div>
    </AppShell>
  );
}