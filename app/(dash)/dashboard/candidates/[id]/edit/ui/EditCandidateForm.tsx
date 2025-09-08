'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabaseBrowser } from '@/lib/supabase/client';

// ————————————————————————————————————————————————————————
// Types
// ————————————————————————————————————————————————————————

type Candidate = {
  id: string;
  name: string;
  interview_score: number;
  skill_score: number;
  personality_score: number;
  education_level: 'SMA' | 'S1' | 'S2' | 'S3';
  recruitment_strategy: 'Agresif' | 'Moderat' | 'Pasif';
  experience_level: 'Junior' | 'Mid' | 'Senior';
  status: 'Hired' | 'Incomplete' | 'Pending';
};

// ————————————————————————————————————————————————————————
// Component
// ————————————————————————————————————————————————————————

export default function EditCandidateForm({ candidate }: { candidate: Candidate }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<Candidate>({ ...candidate });

  // keep a pristine copy to detect dirty state
  const pristine = useMemo(() => JSON.stringify(candidate), [candidate]);
  const isDirty = JSON.stringify(form) !== pristine;

  useEffect(() => {
    // if candidate changes from parent, sync
    setForm({ ...candidate });
  }, [candidate]);

  const handleScore = (
    key: 'interview_score' | 'skill_score' | 'personality_score',
    v: number,
  ) => {
    if (Number.isNaN(v)) v = 0;
    if (v < 0) v = 0;
    if (v > 100) v = 100;
    setForm((f) => ({ ...f, [key]: v }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const supabase = supabaseBrowser();
      const { error } = await supabase
        .from('candidates')
        .update({
          name: form.name,
          interview_score: Number(form.interview_score),
          skill_score: Number(form.skill_score),
          personality_score: Number(form.personality_score),
          education_level: form.education_level,
          recruitment_strategy: form.recruitment_strategy,
          experience_level: form.experience_level,
          status: form.status,
        })
        .eq('id', form.id);

      if (error) throw error;

      router.push('/dashboard');
      router.refresh();
    } catch (err: any) {
      setError(err?.message ?? 'Gagal menyimpan perubahan. Coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const onReset = () => setForm({ ...candidate });

  return (
    <main className="min-h-[80vh] bg-gradient-to-b from-background to-background/50">
      <div className="mx-auto max-w-3xl px-4 py-8">
        {/* Header */}
        <div className="mb-6 flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-violet-500/20 to-indigo-500/20 text-indigo-600 ring-1 ring-indigo-500/30">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden>
              <path d="M4.5 6.75A2.25 2.25 0 0 1 6.75 4.5h10.5A2.25 2.25 0 0 1 19.5 6.75v10.5A2.25 2.25 0 0 1 17.25 19.5H6.75A2.25 2.25 0 0 1 4.5 17.25V6.75Zm3 1.5a.75.75 0 0 0 0 1.5h9a.75.75 0 0 0 0-1.5h-9Zm0 3.75a.75.75 0 0 0 0 1.5h9a.75.75 0 0 0 0-1.5h-9Zm0 3.75a.75.75 0 0 0 0 1.5h5.25a.75.75 0 0 0 0-1.5H7.5Z" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Edit Kandidat</h1>
            <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <span className="rounded-full border border-border/80 bg-muted px-2 py-0.5 font-mono">ID: {candidate.id}</span>
              <span className="rounded-full border border-border/80 bg-muted px-2 py-0.5">Status: {form.status}</span>
            </div>
          </div>
        </div>

        {/* Card */}
        <form onSubmit={onSubmit} className="rounded-2xl border bg-card/60 shadow-sm backdrop-blur">
          <div className="rounded-t-2xl bg-gradient-to-r from-indigo-500/10 via-violet-500/10 to-transparent p-4 ring-1 ring-inset ring-indigo-500/10">
            <p className="text-sm text-muted-foreground">Perbarui data kandidat lalu simpan perubahan.</p>
          </div>

          <div className="grid gap-6 p-6">
            {/* Section: Info */}
            <section className="grid gap-2">
              <h2 className="text-base font-medium">Informasi Kandidat</h2>
              <label htmlFor="name" className="text-sm font-medium">
                Nama Lengkap <span className="text-destructive">*</span>
              </label>
              <input
                id="name"
                className="w-full rounded-xl border bg-background px-3 py-2 text-sm outline-none ring-1 ring-inset ring-border placeholder:text-muted-foreground focus:ring-2 focus:ring-indigo-500"
                placeholder="cth. I G.N. Agung Hari Vijaya"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </section>

            {/* Section: Scores */}
            <section className="grid gap-4">
              <h2 className="text-base font-medium">Skor Penilaian</h2>
              <div className="grid gap-5 md:grid-cols-3">
                <ScoreField label="Interview" value={form.interview_score} onChange={(v) => handleScore('interview_score', v)} />
                <ScoreField label="Skill" value={form.skill_score} onChange={(v) => handleScore('skill_score', v)} />
                <ScoreField label="Personality" value={form.personality_score} onChange={(v) => handleScore('personality_score', v)} />
              </div>
              <p className="text-xs text-muted-foreground">0–100 dengan slider & input angka, auto-clamp.</p>
            </section>

            {/* Section: Meta */}
            <section className="grid gap-4">
              <h2 className="text-base font-medium">Detail Tambahan</h2>
              <div className="grid gap-4 md:grid-cols-2">
                <Segmented
                  label="Education Level"
                  value={form.education_level}
                  onChange={(v) => setForm({ ...form, education_level: v })}
                  options={[
                    { label: 'SMA', value: 'SMA' },
                    { label: 'S1', value: 'S1' },
                    { label: 'S2', value: 'S2' },
                    { label: 'S3', value: 'S3' },
                  ]}
                />
                <Segmented
                  label="Recruitment Strategy"
                  value={form.recruitment_strategy}
                  onChange={(v) => setForm({ ...form, recruitment_strategy: v })}
                  options={[
                    { label: 'Agresif', value: 'Agresif' },
                    { label: 'Moderat', value: 'Moderat' },
                    { label: 'Pasif', value: 'Pasif' },
                  ]}
                />
                <Segmented
                  label="Experience Level"
                  value={form.experience_level}
                  onChange={(v) => setForm({ ...form, experience_level: v })}
                  options={[
                    { label: 'Junior', value: 'Junior' },
                    { label: 'Mid', value: 'Mid' },
                    { label: 'Senior', value: 'Senior' },
                  ]}
                />
                <Segmented
                  label="Status"
                  value={form.status}
                  onChange={(v) => setForm({ ...form, status: v })}
                  options={[
                    { label: 'Pending', value: 'Pending' },
                    { label: 'Hired', value: 'Hired' },
                    { label: 'Reject', value: 'Incomplete' },
                  ]}
                />
              </div>
            </section>

            {error && (
              <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {error}
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-end gap-2 border-t p-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="inline-flex items-center justify-center rounded-xl border bg-background px-4 py-2 text-sm font-medium ring-1 ring-inset ring-border transition hover:bg-muted"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={onReset}
              disabled={!isDirty || loading}
              className="inline-flex items-center justify-center rounded-xl border bg-background px-4 py-2 text-sm font-medium ring-1 ring-inset ring-border transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60"
            >
              Reset
            </button>
            <button
              disabled={loading || !isDirty}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading && (
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
              )}
              {loading ? 'Menyimpan…' : 'Simpan Perubahan'}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

// ————————————————————————————————————————————————————————
// Reusable UI bits (local)
// ————————————————————————————————————————————————————————

function ScoreField({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <div className="grid gap-2 rounded-xl border p-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">{label}</label>
        <span className="text-xs tabular-nums text-muted-foreground">{value}</span>
      </div>
      <input
        type="range"
        min={0}
        max={100}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-2 w-full cursor-pointer appearance-none rounded-full bg-muted accent-indigo-600"
        aria-label={`${label} slider`}
      />
      <div className="flex items-center gap-2">
        <input
          type="number"
          inputMode="numeric"
          min={0}
          max={100}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="flex-1 rounded-lg border bg-background px-3 py-2 text-sm ring-1 ring-inset ring-border focus:ring-2 focus:ring-indigo-600"
          aria-label={`${label} number`}
        />
        <div className="isolate inline-flex overflow-hidden rounded-lg border ring-1 ring-inset ring-border">
          <button type="button" onClick={() => onChange(value - 5)} className="px-2 py-1 text-sm hover:bg-muted" aria-label={`Kurangi ${label}`}>
            −5
          </button>
          <div className="h-full w-px bg-border" />
          <button type="button" onClick={() => onChange(value + 5)} className="px-2 py-1 text-sm hover:bg-muted" aria-label={`Tambah ${label}`}>
            +5
          </button>
        </div>
      </div>
    </div>
  );
}

function Segmented<T extends string>({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: T;
  onChange: (v: T) => void;
  options: { label: string; value: T }[];
}) {
  return (
    <div className="grid gap-2">
      <label className="text-sm font-medium">{label}</label>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {options.map((opt) => {
          const active = value === opt.value;
          return (
            <button
              type="button"
              key={opt.value}
              onClick={() => onChange(opt.value)}
              className={[
                'rounded-xl border px-3 py-2 text-sm transition',
                active ? 'bg-indigo-600 text-white shadow hover:bg-indigo-700' : 'bg-background ring-1 ring-inset ring-border hover:bg-muted',
              ].join(' ')}
              aria-pressed={active}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
