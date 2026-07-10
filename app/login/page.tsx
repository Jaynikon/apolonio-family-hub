"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LockKeyhole, Loader2, UserRound } from "lucide-react";
import { createClient } from "@/lib/supabase/browser";

type Profile = { id: string; username: string; display_name: string; avatar_url: string | null };

export default function LoginPage() {
  const router = useRouter();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [selected, setSelected] = useState<Profile | null>(null);
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [needsSetup, setNeedsSetup] = useState(false);
  const [setup, setSetup] = useState({ displayName: "Jason Apolonio", username: "jason", pin: "" });

  useEffect(() => {
    const supabase = createClient();
    supabase.from("profiles").select("id, username, display_name, avatar_url").eq("active", true).order("display_name")
      .then(({ data, error }) => {
        if (error) setMessage(error.message);
        const rows = (data ?? []) as Profile[];
        setProfiles(rows);
        setNeedsSetup(rows.length === 0);
      });
  }, []);

  async function signIn() {
    if (!selected) return;
    setLoading(true); setMessage("");
    const response = await fetch("/api/auth/pin-login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ username: selected.username, pin }) });
    const result = await response.json();
    setLoading(false);
    if (!response.ok) return setMessage(result.error);
    router.push(result.mustChangePin ? "/change-pin" : "/");
    router.refresh();
  }

  async function createFirstAccount() {
    setLoading(true); setMessage("");
    const response = await fetch("/api/setup", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(setup) });
    const result = await response.json();
    setLoading(false);
    if (!response.ok) return setMessage(result.error);
    window.location.reload();
  }

  return (
    <main className="min-h-screen bg-[#050816] p-6 text-white">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(0,245,255,0.22),_transparent_30%),radial-gradient(circle_at_top_right,_rgba(168,85,247,0.24),_transparent_32%)]" />
      <div className="relative mx-auto flex min-h-[calc(100vh-3rem)] max-w-5xl items-center justify-center">
        <section className="w-full rounded-[2.5rem] border border-white/10 bg-white/[0.08] p-8 shadow-2xl backdrop-blur-2xl md:p-12">
          <div className="text-center">
            <Image src="/family-logo.png" alt="Family Hub" width={110} height={110} className="mx-auto rounded-3xl" />
            <h1 className="mt-5 text-4xl font-bold">Apolonio Family Hub</h1>
            <p className="mt-2 text-slate-300">Choose your profile and enter your PIN.</p>
          </div>

          {needsSetup ? (
            <div className="mx-auto mt-8 max-w-md space-y-4 rounded-3xl bg-white/10 p-6">
              <h2 className="text-xl font-bold">Create the first admin account</h2>
              <input value={setup.displayName} onChange={(e) => setSetup({ ...setup, displayName: e.target.value })} placeholder="Display name" className="w-full rounded-2xl bg-slate-950/70 px-4 py-3" />
              <input value={setup.username} onChange={(e) => setSetup({ ...setup, username: e.target.value })} placeholder="Username" className="w-full rounded-2xl bg-slate-950/70 px-4 py-3" />
              <input inputMode="numeric" maxLength={6} value={setup.pin} onChange={(e) => setSetup({ ...setup, pin: e.target.value.replace(/\D/g, "") })} placeholder="Choose a 4–6 digit PIN" className="w-full rounded-2xl bg-slate-950/70 px-4 py-3" />
              <button onClick={createFirstAccount} disabled={loading} className="w-full rounded-2xl bg-cyan-400 py-3 font-bold text-slate-950">Create admin account</button>
            </div>
          ) : !selected ? (
            <div className="mt-8 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
              {profiles.map((profile) => (
                <button key={profile.id} onClick={() => { setSelected(profile); setPin(""); setMessage(""); }} className="rounded-3xl border border-white/10 bg-white/10 p-5 transition hover:-translate-y-1 hover:bg-white/15">
                  <div className="mx-auto flex h-20 w-20 items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-br from-cyan-500 to-purple-600">
                    {profile.avatar_url ? <img src={profile.avatar_url} alt="" className="h-full w-full object-cover" /> : <UserRound className="h-10 w-10" />}
                  </div>
                  <div className="mt-4 text-lg font-semibold">{profile.display_name}</div>
                  <div className="text-sm text-slate-400">@{profile.username}</div>
                </button>
              ))}
            </div>
          ) : (
            <div className="mx-auto mt-8 max-w-sm rounded-3xl bg-white/10 p-6 text-center">
              <LockKeyhole className="mx-auto h-10 w-10 text-cyan-300" />
              <h2 className="mt-3 text-2xl font-bold">Hi, {selected.display_name}</h2>
              <input autoFocus inputMode="numeric" type="password" maxLength={6} value={pin} onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))} onKeyDown={(e) => e.key === "Enter" && signIn()} placeholder="Enter PIN" className="mt-5 w-full rounded-2xl bg-slate-950/70 px-4 py-4 text-center text-2xl tracking-[0.5em]" />
              <button onClick={signIn} disabled={loading || pin.length < 4} className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-cyan-400 py-3 font-bold text-slate-950 disabled:opacity-50">{loading && <Loader2 className="h-5 w-5 animate-spin" />} Sign in</button>
              <button onClick={() => setSelected(null)} className="mt-3 text-sm text-slate-300">Choose a different person</button>
            </div>
          )}

          {message && <p className="mt-5 text-center text-sm text-red-300">{message}</p>}
        </section>
      </div>
    </main>
  );
}
