"use client";

import { Check } from "lucide-react";

import { AppShell } from "@/components/AppShell";
import { ThemeName, useTheme } from "@/components/ThemeProvider";

const themes: { id: ThemeName; name: string; description: string }[] = [
  { id: "light", name: "Light", description: "Clean bright theme." },
  { id: "dark", name: "Dark", description: "Default midnight glass." },
  { id: "cyan", name: "Cyan", description: "Bright blue glass glow." },
  { id: "custom", name: "Custom", description: "Pick your own accent color." },
];

export default function SettingsPage() {
  const { theme, setTheme, customColor, setCustomColor } = useTheme();

  return (
    <AppShell title="Settings" subtitle="Customize how Family Hub looks.">
      <div className="grid gap-6 xl:grid-cols-[1fr_420px]">
        <section className="rounded-[2rem] border border-white/10 bg-white/[0.08] p-6 shadow-2xl backdrop-blur-2xl">
          <h2 className="text-3xl font-bold">Themes</h2>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {themes.map((item) => (
              <button
                key={item.id}
                onClick={() => setTheme(item.id)}
                className={`rounded-3xl border p-5 text-left transition hover:-translate-y-1 ${
                  theme === item.id
                    ? "border-cyan-300/50 bg-cyan-300/15"
                    : "border-white/10 bg-white/10"
                }`}
              >
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-xl font-bold">{item.name}</h3>

                  {theme === item.id && (
                    <span className="rounded-full bg-cyan-300 p-1 text-slate-950">
                      <Check className="h-4 w-4" />
                    </span>
                  )}
                </div>

                <p className="text-sm text-slate-300">{item.description}</p>
              </button>
            ))}
          </div>
        </section>

        <section className="rounded-[2rem] border border-white/10 bg-white/[0.08] p-6 shadow-2xl backdrop-blur-2xl">
          <h2 className="text-2xl font-bold">Custom Accent</h2>

          <p className="mt-2 text-sm text-slate-300">
            Used when Custom theme is selected.
          </p>

          <div className="mt-6 flex items-center gap-4">
            <input
              type="color"
              value={customColor}
              onChange={(event) => setCustomColor(event.target.value)}
              className="h-14 w-20 cursor-pointer rounded-xl border border-white/10 bg-transparent"
            />

            <div>
              <p className="font-semibold">{customColor}</p>
              <p className="text-sm text-slate-400">Accent color</p>
            </div>
          </div>

          <div
            className="mt-6 rounded-3xl p-6"
            style={{
              background: `linear-gradient(135deg, ${customColor}55, ${customColor}11)`,
              border: `1px solid ${customColor}66`,
            }}
          >
            <p className="text-lg font-bold">Preview Card</p>
            <p className="mt-2 text-sm text-slate-300">
              This is how custom color accents will feel.
            </p>
          </div>
        </section>
      </div>
    </AppShell>
  );
}