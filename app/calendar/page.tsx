"use client";

import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";

import { AppShell } from "@/components/AppShell";
import { supabase } from "@/lib/supabase";

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

type CalendarEventRow = {
  id: string;
  event_date: string;
  title: string;
  category: string | null;
  family_member: string | null;
  attendees: string[] | null;
  guests: string[] | null;
  notes: string | null;
};

function formatDateInput(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function rowToEvent(row: CalendarEventRow): CalendarEvent {
  const primaryPerson = row.family_member || "Jason";

  return {
    id: row.id,
    date: row.event_date,
    title: row.title,
    type: row.category || "Family Event",
    primaryPerson,
    attendees:
      Array.isArray(row.attendees) && row.attendees.length > 0
        ? row.attendees
        : [primaryPerson],
    guests: Array.isArray(row.guests) ? row.guests : [],
    notes: row.notes || "",
  };
}

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedPerson, setSelectedPerson] = useState("All");
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [message, setMessage] = useState("");

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

  const loadEvents = useCallback(async () => {
    setMessage("");

    const { data, error } = await supabase
      .from("calendar_events")
      .select(
        "id, event_date, title, category, family_member, attendees, guests, notes"
      )
      .order("event_date", { ascending: true });

    if (error) {
      console.error(error);
      setMessage(`Could not load events: ${error.message}`);
      setIsLoading(false);
      return;
    }

    setEvents((data as CalendarEventRow[]).map(rowToEvent));
    setIsLoading(false);
  }, []);

  useEffect(() => {
    void loadEvents();

    const channel = supabase
      .channel("calendar-events-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "calendar_events",
        },
        () => {
          void loadEvents();
        }
      )
      .subscribe();

    const reloadWhenVisible = () => {
      if (document.visibilityState === "visible") {
        void loadEvents();
      }
    };

    document.addEventListener("visibilitychange", reloadWhenVisible);

    return () => {
      document.removeEventListener("visibilitychange", reloadWhenVisible);
      void supabase.removeChannel(channel);
    };
  }, [loadEvents]);

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
    setGuests((current) =>
      current.filter((_, guestIndex) => guestIndex !== index)
    );
  }

  function resetForm() {
    setTitle("");
    setType("Family Event");
    setDate(formatDateInput(new Date()));
    setPrimaryPerson("Jason");
    setAttendees(["Jason"]);
    setGuests([]);
    setNotes("");
  }

  async function addEvent(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const cleanTitle = title.trim();
    if (!cleanTitle) {
      setMessage("Please enter an event title.");
      return;
    }

    const cleanGuests = guests.map((guest) => guest.trim()).filter(Boolean);
    const cleanAttendees = attendees.includes(primaryPerson)
      ? attendees
      : [...attendees, primaryPerson];

    setIsSaving(true);
    setMessage("");

    const { error } = await supabase.from("calendar_events").insert({
      title: cleanTitle,
      event_date: date,
      category: type,
      family_member: primaryPerson,
      attendees: cleanAttendees,
      guests: cleanGuests,
      notes: notes.trim(),
    });

    setIsSaving(false);

    if (error) {
      console.error(error);
      setMessage(`Could not save event: ${error.message}`);
      return;
    }

    resetForm();
    setIsAdding(false);
    setMessage("Event saved.");
    await loadEvents();
  }

  async function deleteEvent(eventId: string) {
    const confirmed = window.confirm("Delete this event?");
    if (!confirmed) return;

    setDeletingId(eventId);
    setMessage("");

    const { error } = await supabase
      .from("calendar_events")
      .delete()
      .eq("id", eventId);

    setDeletingId(null);

    if (error) {
      console.error(error);
      setMessage(`Could not delete event: ${error.message}`);
      return;
    }

    setEvents((current) => current.filter((event) => event.id !== eventId));
    setMessage("Event deleted.");
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
            <button
              type="button"
              aria-label="Previous month"
              onClick={previousMonth}
              className="rounded-2xl bg-white/10 p-3 hover:bg-white/20"
            >
              <ChevronLeft />
            </button>

            <button
              type="button"
              onClick={() => {
                setMessage("");
                setIsAdding(true);
              }}
              className="flex items-center gap-2 rounded-2xl bg-cyan-500 px-4 py-3 font-semibold text-slate-950 hover:bg-cyan-300"
            >
              <Plus className="h-5 w-5" />
              Add Event
            </button>

            <button
              type="button"
              aria-label="Next month"
              onClick={nextMonth}
              className="rounded-2xl bg-white/10 p-3 hover:bg-white/20"
            >
              <ChevronRight />
            </button>
          </div>
        </div>

        {message && (
          <div className="mb-5 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-slate-100">
            {message}
          </div>
        )}

        {isAdding && (
          <form
            onSubmit={addEvent}
            className="mb-6 rounded-3xl border border-cyan-300/20 bg-cyan-300/10 p-5 backdrop-blur-2xl"
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-bold">Add Event</h3>
              <button
                type="button"
                aria-label="Close add event form"
                onClick={() => setIsAdding(false)}
                className="rounded-xl bg-white/10 p-2 hover:bg-white/20"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <input
                required
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Event title"
                className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-cyan-300"
              />

              <select
                value={type}
                onChange={(event) => setType(event.target.value)}
                className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-cyan-300"
              >
                {eventTypes.map((eventType) => (
                  <option key={eventType}>{eventType}</option>
                ))}
              </select>

              <input
                required
                type="date"
                value={date}
                onChange={(event) => setDate(event.target.value)}
                className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-cyan-300"
              />

              <select
                value={primaryPerson}
                onChange={(event) => {
                  const person = event.target.value;
                  setPrimaryPerson(person);
                  setAttendees((current) =>
                    current.includes(person) ? current : [...current, person]
                  );
                }}
                className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-cyan-300"
              >
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

                <button
                  type="button"
                  onClick={addGuestField}
                  className="rounded-xl bg-white/10 px-3 py-2 text-sm hover:bg-white/20"
                >
                  + Add person
                </button>
              </div>

              <div className="grid gap-3">
                {guests.map((guest, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      value={guest}
                      onChange={(event) =>
                        updateGuest(index, event.target.value)
                      }
                      placeholder="Guest name"
                      className="flex-1 rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-cyan-300"
                    />

                    <button
                      type="button"
                      aria-label="Remove guest"
                      onClick={() => removeGuest(index)}
                      className="rounded-2xl bg-white/10 px-3 hover:bg-white/20"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <textarea
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="Notes"
              className="mt-5 min-h-24 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-cyan-300"
            />

            <button
              disabled={isSaving}
              type="submit"
              className="mt-4 flex items-center gap-2 rounded-2xl bg-white px-5 py-3 font-semibold text-slate-950 hover:bg-cyan-100 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSaving && <Loader2 className="h-5 w-5 animate-spin" />}
              {isSaving ? "Saving..." : "Save Event"}
            </button>
          </form>
        )}

        <div className="mb-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setSelectedPerson("All")}
            className={`rounded-full px-4 py-2 text-sm ${
              selectedPerson === "All"
                ? "bg-white text-slate-950"
                : "bg-white/10 text-slate-200"
            }`}
          >
            All
          </button>

          {people.map((person) => (
            <button
              type="button"
              key={person.name}
              onClick={() => setSelectedPerson(person.name)}
              className={`flex items-center gap-2 rounded-full px-3 py-2 text-sm ${
                selectedPerson === person.name
                  ? "bg-white text-slate-950"
                  : "bg-white/10 text-slate-200"
              }`}
            >
              <span className={`h-3 w-3 rounded-full ${person.color}`} />
              {person.name}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="flex min-h-64 items-center justify-center gap-3 text-slate-300">
            <Loader2 className="h-6 w-6 animate-spin" />
            Loading events...
          </div>
        ) : (
          <>
            <div className="grid grid-cols-7 gap-2 text-center text-sm font-semibold text-slate-300">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                (day) => (
                  <div key={day} className="p-2">
                    {day}
                  </div>
                )
              )}
            </div>

            <div className="mt-2 grid grid-cols-7 gap-2">
              {days.map((day, index) => {
                const dayEvents = events.filter((event) => {
                  if (!day) return false;

                  const eventDate = new Date(`${event.date}T00:00:00`);

                  return (
                    eventDate.getFullYear() === year &&
                    eventDate.getMonth() === month &&
                    eventDate.getDate() === day
                  );
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
                        <div className="mb-2 text-sm font-semibold text-white">
                          {day}
                        </div>

                        <div className="space-y-2">
                          {dayEvents.map((calendarEvent) => {
                            const person = people.find(
                              (item) =>
                                item.name === calendarEvent.primaryPerson
                            );

                            const isMuted =
                              selectedPerson !== "All" &&
                              calendarEvent.primaryPerson !== selectedPerson &&
                              !calendarEvent.attendees.includes(selectedPerson);

                            return (
                              <div
                                key={calendarEvent.id}
                                className={`group rounded-xl p-2 text-left text-xs ${
                                  isMuted
                                    ? "bg-white/5 text-slate-500 opacity-40"
                                    : "bg-white/10 text-white"
                                }`}
                              >
                                <div className="flex items-start justify-between gap-2">
                                  <div className="min-w-0">
                                    <div className="flex items-center gap-2 font-semibold">
                                      <span
                                        className={`h-2 w-2 shrink-0 rounded-full ${
                                          person?.color ?? "bg-slate-400"
                                        }`}
                                      />
                                      <span className="break-words">
                                        {calendarEvent.title}
                                      </span>
                                    </div>

                                    <div className="mt-1 text-slate-300">
                                      {calendarEvent.type}
                                    </div>

                                    <div className="mt-1 break-words text-slate-400">
                                      {calendarEvent.attendees.join(", ")}
                                      {calendarEvent.guests.length > 0 &&
                                        ` + ${calendarEvent.guests.length} guest(s)`}
                                    </div>

                                    {calendarEvent.notes && (
                                      <div className="mt-1 break-words text-slate-400">
                                        {calendarEvent.notes}
                                      </div>
                                    )}
                                  </div>

                                  <button
                                    type="button"
                                    aria-label={`Delete ${calendarEvent.title}`}
                                    disabled={deletingId === calendarEvent.id}
                                    onClick={() =>
                                      void deleteEvent(calendarEvent.id)
                                    }
                                    className="shrink-0 rounded-lg p-1 text-slate-400 opacity-0 transition hover:bg-red-500/20 hover:text-red-300 group-hover:opacity-100 disabled:opacity-50"
                                  >
                                    {deletingId === calendarEvent.id ? (
                                      <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                      <Trash2 className="h-4 w-4" />
                                    )}
                                  </button>
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
          </>
        )}
      </div>
    </AppShell>
  );
}
