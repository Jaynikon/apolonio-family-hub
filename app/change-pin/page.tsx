"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ChangePinPage() {
  const router = useRouter();
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function save() {
    if (pin !== confirmPin) return setMessage("The PINs do not match.");
    setLoading(true); setMessage("");
    const response = await fetch("/api/auth/change-pin", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ pin }) });
    const result = await response.json();
    setLoading(false);
    if (!response.ok) return setMessage(result.error);
    router.push("/"); router.refresh();
  }

  return <main className="flex min-h-screen items-center justify-center bg-[#050816] p-6 text-white"><div className="w-full max-w-md rounded-[2rem] border border-white/10 bg-white/10 p-8 text-center backdrop-blur-2xl"><h1 className="text-3xl font-bold">Create your private PIN</h1><p className="mt-2 text-slate-300">Replace the temporary PIN with a 4–6 digit PIN only you know.</p><input inputMode="numeric" type="password" maxLength={6} value={pin} onChange={(e)=>setPin(e.target.value.replace(/\D/g,""))} placeholder="New PIN" className="mt-6 w-full rounded-2xl bg-slate-950/70 px-4 py-4 text-center text-xl"/><input inputMode="numeric" type="password" maxLength={6} value={confirmPin} onChange={(e)=>setConfirmPin(e.target.value.replace(/\D/g,""))} placeholder="Confirm PIN" className="mt-3 w-full rounded-2xl bg-slate-950/70 px-4 py-4 text-center text-xl"/><button onClick={save} disabled={loading || pin.length < 4} className="mt-5 w-full rounded-2xl bg-cyan-400 py-3 font-bold text-slate-950 disabled:opacity-50">{loading ? "Saving..." : "Save PIN"}</button>{message && <p className="mt-4 text-sm text-red-300">{message}</p>}</div></main>;
}
