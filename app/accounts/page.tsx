"use client";

import { FormEvent, useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { createClient } from "@/lib/supabase/browser";

type Account = { id: string; username: string; display_name: string; role: string; active: boolean; must_change_pin: boolean };

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [form, setForm] = useState({ displayName: "", username: "", temporaryPin: "123456", role: "member" });
  const [message, setMessage] = useState("");

  async function load() {
    const supabase = createClient();
    const { data, error } = await supabase.from("profiles").select("id, username, display_name, role, active, must_change_pin").order("display_name");
    if (error) setMessage(error.message); else setAccounts((data ?? []) as Account[]);
  }
  useEffect(() => { void load(); }, []);

  async function createAccount(event: FormEvent) {
    event.preventDefault(); setMessage("");
    const response = await fetch("/api/admin/accounts", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    const result = await response.json();
    if (!response.ok) return setMessage(result.error);
    setForm({ displayName: "", username: "", temporaryPin: "123456", role: "member" });
    setMessage("Account created. They will choose a new PIN after first login.");
    await load();
  }

  return <AppShell title="Accounts" subtitle="Create family logins and manage temporary PINs."><div className="grid gap-6 lg:grid-cols-[380px_1fr]"><form onSubmit={createAccount} className="rounded-[2rem] border border-white/10 bg-white/[0.08] p-6"><h2 className="text-xl font-bold">Add family account</h2><div className="mt-5 grid gap-3"><input value={form.displayName} onChange={(e)=>setForm({...form,displayName:e.target.value})} placeholder="Name" className="rounded-2xl bg-slate-950/70 px-4 py-3"/><input value={form.username} onChange={(e)=>setForm({...form,username:e.target.value})} placeholder="Username" className="rounded-2xl bg-slate-950/70 px-4 py-3"/><input inputMode="numeric" maxLength={6} value={form.temporaryPin} onChange={(e)=>setForm({...form,temporaryPin:e.target.value.replace(/\D/g,"")})} placeholder="Temporary PIN" className="rounded-2xl bg-slate-950/70 px-4 py-3"/><select value={form.role} onChange={(e)=>setForm({...form,role:e.target.value})} className="rounded-2xl bg-slate-950/70 px-4 py-3"><option value="member">Family member</option><option value="admin">Admin</option></select><button className="rounded-2xl bg-cyan-400 py-3 font-bold text-slate-950">Create account</button></div>{message&&<p className="mt-4 text-sm text-cyan-100">{message}</p>}</form><div className="rounded-[2rem] border border-white/10 bg-white/[0.08] p-6"><h2 className="text-xl font-bold">Family accounts</h2><div className="mt-4 space-y-3">{accounts.map((a)=><div key={a.id} className="flex items-center justify-between rounded-2xl bg-white/10 p-4"><div><div className="font-semibold">{a.display_name}</div><div className="text-sm text-slate-400">@{a.username} • {a.role}{a.must_change_pin?" • PIN change required":""}</div></div><span className={`rounded-full px-3 py-1 text-xs ${a.active?"bg-emerald-400/20 text-emerald-200":"bg-red-400/20 text-red-200"}`}>{a.active?"Active":"Disabled"}</span></div>)}</div></div></div></AppShell>;
}
