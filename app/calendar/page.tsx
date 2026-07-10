"use client";

import { ChevronLeft, ChevronRight, Plus, Trash2, X } from "lucide-react";
import { FormEvent, useMemo, useState } from "react";

import { AppShell } from "@/components/AppShell";

const people = [
  { name: "Jason", color: "bg-cyan-500" },
  { name: "Theresa", color: "bg-pink-500" },
  { name: "Brandon", color: "bg-blue-500" },
  { name: "Emma", color: "bg-purple-500" },
  { name: "Jacob", color: "bg-emerald-500" },
  { name: "Andrew", color: "bg-orange-500" },
  { name: "Noelle", color: "bg-rose-500" },
  { name: "Autumn", color: "bg-amber-500" },
  { name: "Summer", color: "bg-sky-500" },
];

const eventTypes = [
  "Appointment",
  "Birthday",
  "Family Event",
  "School",
  "Sports",
  "Work",
  "Sleepover",
  "Vacation",
  "Reminder",
  "Other",
];

type CalendarEvent = {
  id: string;
  date: string;
  title: string;
  type: string;
  primaryPerson: string;
  attendees: string[];
  guests: string[];
  notes: string;
};

const startingEvents: CalendarEvent[] = [
  {
    id: "1",
    date: "2026-07-15",
    title: "Car maintenance",
    type: "Reminder",
    primaryPerson: "Jason",
    attendees: ["Jason"],
    guests: [],
    notes: "",
  },
  {
    id: "2",
    date: "2026-07-22",
    title: "School activity",
    type: "School",
    primaryPerson: "Emma",
    attendees: ["Emma", "Theresa"],
    guests: [],
    notes: "",
  },
];

function formatDateInput(date: Date) {
  return date.toISOString().split("T")[0];
}

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedPerson, setSelectedPerson] = useState("All");
  const [events, setEvents] = useState<CalendarEvent[]>(startingEvents);
  const [isAdding, setIsAdding] = useState(false);

  const [title, setTitle] = useState("");
  const [type, setType] = useState("Family Event");
  const [date, setDate] = useState(formatDateInput(new Date()));
  const [primaryPerson, setPrimaryPerson] = useState("Jason");
  const [attendees, setAttendees] = useState<string[]>(["Jason"]);
  const [guests, setGuests] = useState<string[]>([]);
  const [notes, setNotes] = useState("");

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthName = currentDate.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const days = useMemo(() => {
    const firstDay = new Date(year, month, 1).getDay();

    return [
      ...Array(firstDay).fill(null),
      ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
    ];
  }, [year, month, daysInMonth]);

  function previousMonth() {
    setCurrentDate(new Date(year, month - 1, 1));
  }

  function nextMonth() {
    setCurrentDate(new Date(year, month + 1, 1));
  }

  function toggleAttendee(name: string) {
    setAttendees((current) =>
      current.includes(name)
        ? current.filter((person) => person !== name)
        : [...current, name]
    );
  }

  function addGuestField() {
    setGuests((current) => [...current, ""]);
  }

  function updateGuest(index: number, value: string) {
    setGuests((current) =>
      current.map((guest, guestIndex) => (guestIndex === index ? value : guest))
    );
  }

  function removeGuest(index: number) {
    setGuests((current) => current.filter((_, guestIndex) => guestIndex !== index));
  }

  function addEvent(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!title.trim()) return;

    const cleanGuests = guests.map((guest) => guest.trim()).filter(Boolean);

    setEvents((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        date,
        title: title.trim(),
        type,
        primaryPerson,
        attendees,
        guests: cleanGuests,
        notes,
      },
    ]);

    setTitle("");
    setType("Family Event");
    setDate(formatDateInput(new Date()));
    setPrimaryPerson("Jason");
    setAttendees(["Jason"]);
    setGuests([]);
    setNotes("");
    setIsAdding(false);
  }

  return (
    <AppShell title="Calendar" subtitle="Family schedule and shared events.">
      <div className="rounded-[2rem] border border-white/10 bg-white/[0.08] p-6 shadow-2xl backdrop-blur-2xl">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-3xl font-bold">{monthName}</h2>
            <p className="mt-1 text-sm text-slate-300">
              Select a person to highlight their events.
            </p>
          </div>

          <div className="flex gap-3">
            <button onClick={previousMonth} className="rounded-2xl bg-white/10 p-3 hover:bg-white/20">
              <ChevronLeft />
            </button>

            <button
              onClick={() => setIsAdding(true)}
              className="flex items-center gap-2 rounded-2xl bg-cyan-500 px-4 py-3 font-semibold text-slate-950 hover:bg-cyan-300"
            >
              <Plus className="h-5 w-5" />
              Add Event
            </button>

            <button onClick={nextMonth} className="rounded-2xl bg-white/10 p-3 hover:bg-white/20">
              <ChevronRight />
            </button>
          </div>
        </div>

        {isAdding && (
          <form
            onSubmit={addEvent}
            className="mb-6 rounded-3xl border border-cyan-300/20 bg-cyan-300/10 p-5 backdrop-blur-2xl"
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-bold">Add Event</h3>
              <button type="button" onClick={() => setIsAdding(false)} className="rounded-xl bg-white/10 p-2 hover:bg-white/20">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Event title"
                className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-cyan-300"
              />

              <select value={type} onChange={(e) => setType(e.target.value)} className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-cyan-300">
                {eventTypes.map((eventType) => (
                  <option key={eventType}>{eventType}</option>
                ))}
              </select>

              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-cyan-300"
              />

              <select value={primaryPerson} onChange={(e) => setPrimaryPerson(e.target.value)} className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-cyan-300">
                {people.map((person) => (
                  <option key={person.name}>{person.name}</option>
                ))}
              </select>
            </div>

            <div className="mt-5">
              <p className="mb-3 text-sm font-semibold text-cyan-100">
                Family members going
              </p>

              <div className="flex flex-wrap gap-2">
                {people.map((person) => (
                  <button
                    key={person.name}
                    type="button"
                    onClick={() => toggleAttendee(person.name)}
                    className={`rounded-full px-3 py-2 text-sm transition ${
                      attendees.includes(person.name)
                        ? "bg-white text-slate-950"
                        : "bg-white/10 text-slate-200 hover:bg-white/20"
                    }`}
                  >
                    {person.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-5">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm font-semibold text-cyan-100">
                  Additional people coming
                </p>

                <button type="button" onClick={addGuestField} className="rounded-xl bg-white/10 px-3 py-2 text-sm hover:bg-white/20">
                  + Add person
                </button>
              </div>

              <div className="grid gap-3">
                {guests.map((guest, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      value={guest}
                      onChange={(e) => updateGuest(index, e.target.value)}
                      placeholder="Guest name"
                      className="flex-1 rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-cyan-300"
                    />

                    <button type="button" onClick={() => removeGuest(index)} className="rounded-2xl bg-white/10 px-3 hover:bg-white/20">
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Notes"
              className="mt-5 min-h-24 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-cyan-300"
            />

            <button type="submit" className="mt-4 rounded-2xl bg-white px-5 py-3 font-semibold text-slate-950 hover:bg-cyan-100">
              Save Event
            </button>
          </form>
        )}

        <div className="mb-6 flex flex-wrap gap-3">
          <button onClick={() => setSelectedPerson("All")} className={`rounded-full px-4 py-2 text-sm ${selectedPerson === "All" ? "bg-white text-slate-950" : "bg-white/10 text-slate-200"}`}>
            All
          </button>

          {people.map((person) => (
            <button key={person.name} onClick={() => setSelectedPerson(person.name)} className={`flex items-center gap-2 rounded-full px-3 py-2 text-sm ${selectedPerson === person.name ? "bg-white text-slate-950" : "bg-white/10 text-slate-200"}`}>
              <span className={`h-3 w-3 rounded-full ${person.color}`} />
              {person.name}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2 text-center text-sm font-semibold text-slate-300">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="p-2">{day}</div>
          ))}
        </div>

        <div className="mt-2 grid grid-cols-7 gap-2">
          {days.map((day, index) => {
            const dayEvents = events.filter((event) => {
              const eventDate = new Date(`${event.date}T00:00:00`);
              return eventDate.getFullYear() === year && eventDate.getMonth() === month && eventDate.getDate() === day;
            });

            const selectedEvents = dayEvents.filter(
              (event) =>
                selectedPerson === "All" ||
                event.primaryPerson === selectedPerson ||
                event.attendees.includes(selectedPerson)
            );

            const hasSelectedEvents = selectedEvents.length > 0;

            return (
              <div
                key={index}
                className={`min-h-32 rounded-2xl border p-3 transition ${
                  hasSelectedEvents && selectedPerson !== "All"
                    ? "border-cyan-300/60 bg-cyan-300/15 ring-2 ring-cyan-300/30"
                    : "border-white/10 bg-white/[0.06] hover:bg-white/[0.1]"
                }`}
              >
                {day && (
                  <>
                    <div className="mb-2 text-sm font-semibold text-white">{day}</div>

                    <div className="space-y-2">
                      {dayEvents.map((event) => {
                        const person = people.find((item) => item.name === event.primaryPerson);
                        const isMuted =
                          selectedPerson !== "All" &&
                          event.primaryPerson !== selectedPerson &&
                          !event.attendees.includes(selectedPerson);

                        return (
                          <div key={event.id} className={`rounded-xl p-2 text-left text-xs ${isMuted ? "bg-white/5 text-slate-500 opacity-40" : "bg-white/10 text-white"}`}>
                            <div className="flex items-center gap-2 font-semibold">
                              <span className={`h-2 w-2 rounded-full ${person?.color ?? "bg-slate-400"}`} />
                              <span>{event.title}</span>
                            </div>
                            <div className="mt-1 text-slate-300">{event.type}</div>
                            <div className="mt-1 text-slate-400">
                              {event.attendees.join(", ")}
                              {event.guests.length > 0 && ` + ${event.guests.length} guest(s)`}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}