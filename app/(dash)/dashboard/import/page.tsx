'use client';

import { useState, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { supabaseBrowser } from '@/lib/supabase/client';

// ————————————————————————————————————————————————————————
// Types
// ————————————————————————————————————————————————————————

type Row = {
  name: string;
  interview_score: number;
  skill_score: number;
  personality_score: number;
  education_level: 'SMA' | 'S1' | 'S2' | 'S3';
  recruitment_strategy: 'Agresif' | 'Moderat' | 'Pasif';
  experience_level: 'Junior' | 'Mid' | 'Senior';
  status: 'Hired' | 'Incomplete' | 'Pending';
};

const EDUCATIONS = ['SMA', 'S1', 'S2', 'S3'] as const;
const STRATEGIES = ['Agresif', 'Moderat', 'Pasif'] as const;
const LEVELS = ['Junior', 'Mid', 'Senior'] as const;
const STATUSES = ['Hired', 'Incomplete', 'Pending'] as const;

const HEADERS = [
  'name',
  'interview_score',
  'skill_score',
  'personality_score',
  'education_level',
  'recruitment_strategy',
  'experience_level',
  'status',
] as const;

type HeaderKey = typeof HEADERS[number];

// ————————————————————————————————————————————————————————
// Utils
// ————————————————————————————————————————————————————————

const clamp01 = (n: number) => Math.max(0, Math.min(100, n));

function bytesToNice(n: number) {
  if (n < 1024) return `${n} B`;
  const kb = n / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  const mb = kb / 1024;
  return `${mb.toFixed(1)} MB`;
}

// Minimal CSV parser: handles commas inside quotes and escaped quotes (")
function parseCSV(text: string): string[][] {
  const rows: string[][] = [];
  let cur: string[] = [];
  let field = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    const next = text[i + 1];

    if (inQuotes) {
      if (ch === '"' && next === '"') {
        field += '"';
        i++; // skip escaped quote
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        field += ch;
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
      } else if (ch === ',') {
        cur.push(field.trim());
        field = '';
      } else if (ch === '\n') {
        cur.push(field.trim());
        rows.push(cur);
        cur = [];
        field = '';
      } else if (ch === '\r') {
        // ignore
      } else {
        field += ch;
      }
    }
  }
  // push remaining
  if (field.length > 0 || cur.length > 0) {
    cur.push(field.trim());
    rows.push(cur);
  }
  // filter out blank lines
  return rows.filter((r) => r.some((c) => c && c.length > 0));
}

function downloadText(filename: string, content: string) {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ————————————————————————————————————————————————————————
// Component
// ————————————————————————————————————————————————————————

export default function ImportPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [rows, setRows] = useState<Row[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [parsing, setParsing] = useState(false);
  const [headerInfo, setHeaderInfo] = useState<{ missing: string[]; extra: string[] } | null>(null);
  const dropRef = useRef<HTMLLabelElement | null>(null);

  const example = `name,interview_score,skill_score,personality_score,education_level,recruitment_strategy,experience_level,status\nBudi,85,80,75,S1,Moderat,Junior,Pending\nSari,90,88,92,S2,Agresif,Senior,Hired`;

  const preview = useMemo(() => rows.slice(0, 8), [rows]);

  function onFileChange(f: File | null) {
    setFile(f);
    setRows([]);
    setErrors([]);
    setHeaderInfo(null);
    setProgress(0);
  }

  function normalizeCase(s: string) {
    return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
  }

  async function handleParse() {
    setErrors([]);
    if (!file) return;
    setParsing(true);

    try {
      const text = await file.text();
      const raw = parseCSV(text);
      if (!raw.length) {
        setErrors(['CSV kosong / tidak ada data.']);
        return;
      }

      // Header
      const header = raw[0].map((h) => h.replace(/^\"|\"$/g, '').trim().toLowerCase());
      const need = HEADERS as readonly string[];
      const missing = need.filter((k) => !header.includes(k));
      const extra = header.filter((h) => !need.includes(h as HeaderKey));
      setHeaderInfo({ missing, extra });

      if (missing.length) {
        setErrors([`Header wajib: ${need.join(', ')}. Kurang: ${missing.join(', ')}`]);
        return;
      }

      const idx = (k: string) => header.indexOf(k);

      const out: Row[] = [];
      const rowErrors: string[] = [];

      for (let i = 1; i < raw.length; i++) {
        const cols = raw[i];
        if (!cols.length || !cols[idx('name')]) continue;

        const name = cols[idx('name')];

        const interview = clamp01(Number(cols[idx('interview_score')]));
        const skill = clamp01(Number(cols[idx('skill_score')]));
        const personality = clamp01(Number(cols[idx('personality_score')]));

        const edu = (cols[idx('education_level')] || '').toUpperCase();
        const education_level = (EDUCATIONS as readonly string[]).includes(edu)
          ? (edu as Row['education_level'])
          : null;

        const stratRaw = cols[idx('recruitment_strategy')] || '';
        const stratCap = normalizeCase(stratRaw);
        const recruitment_strategy = (STRATEGIES as readonly string[]).includes(stratCap as any)
          ? (stratCap as Row['recruitment_strategy'])
          : null;

        const lvlRaw = cols[idx('experience_level')] || '';
        const lvlCap = normalizeCase(lvlRaw);
        const experience_level = (LEVELS as readonly string[]).includes(lvlCap as any)
          ? (lvlCap as Row['experience_level'])
          : null;

        const statRaw = cols[idx('status')] || 'Pending';
        const statCap = normalizeCase(statRaw);
        const status = (STATUSES as readonly string[]).includes(statCap as any)
          ? (statCap as Row['status'])
          : 'Pending';

        if (
          !education_level ||
          !recruitment_strategy ||
          !experience_level ||
          [interview, skill, personality].some((n) => Number.isNaN(n))
        ) {
          rowErrors.push(`Baris ${i + 1}: data tidak valid (cek enum/angka).`);
          continue;
        }

        out.push({
          name,
          interview_score: interview,
          skill_score: skill,
          personality_score: personality,
          education_level,
          recruitment_strategy,
          experience_level,
          status,
        });
      }

      setRows(out);
      setErrors(rowErrors);
    } finally {
      setParsing(false);
    }
  }

  async function handleImport() {
    if (rows.length === 0) return;
    setLoading(true);
    setProgress(0);

    const supabase = supabaseBrowser();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      router.push('/login');
      return;
    }

    const chunk = 500;
    for (let i = 0; i < rows.length; i += chunk) {
      const slice = rows.slice(i, i + chunk).map((r) => ({ ...r, owner_id: user.id }));
      const { error } = await supabase.from('candidates').insert(slice);
      if (error) {
        setLoading(false);
        alert(error.message);
        return;
      }
      setProgress(Math.round(((i + slice.length) / rows.length) * 100));
    }

    setLoading(false);
    alert(`Imported ${rows.length} candidates`);
    router.push('/dashboard');
    router.refresh();
  }

  // Drag & drop behaviors
  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (f && f.name.toLowerCase().endsWith('.csv')) onFileChange(f);
  }

  function onDragOver(e: React.DragEvent) {
    e.preventDefault();
    dropRef.current?.classList.add('ring-blue-500');
  }
  function onDragLeave() {
    dropRef.current?.classList.remove('ring-blue-500');
  }

  return (
    <main className="min-h-[80vh] bg-gradient-to-b from-background to-background/50">
      <div className="mx-auto max-w-5xl px-4 py-8">
        {/* Header */}
        <div className="mb-6 flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 text-blue-500 ring-1 ring-blue-500/30">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden>
              <path d="M12 3a1 1 0 0 1 1 1v9.586l2.293-2.293a1 1 0 1 1 1.414 1.414l-4 4a1 1 0 0 1-1.414 0l-4-4a1 1 0 0 1 1.414-1.414L11 13.586V4a1 1 0 0 1 1-1Z" />
              <path d="M5 19a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-3a1 1 0 1 0-2 0v3H7v-3a1 1 0 1 0-2 0v3Z" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Import Kandidat (CSV)</h1>
            <p className="text-sm text-muted-foreground">Tarik & letakkan file CSV, lalu cek preview dan mulai import.</p>
          </div>
        </div>

        {/* Card */}
        <div className="rounded-2xl border bg-card/60 shadow-sm backdrop-blur">
          <div className="rounded-t-2xl bg-gradient-to-r from-blue-500/10 via-cyan-500/10 to-transparent p-4 ring-1 ring-inset ring-blue-500/10">
            <p className="text-sm text-muted-foreground">Format header wajib: <code className="rounded bg-muted px-1 py-0.5">{HEADERS.join(', ')}</code></p>
          </div>

          <div className="grid gap-6 p-6">
            {/* Dropzone */}
            <label
              ref={dropRef}
              onDrop={onDrop}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              className="group grid cursor-pointer place-items-center rounded-xl border border-dashed p-8 text-center transition hover:bg-muted/40 ring-1 ring-inset ring-border"
            >
              <input
                type="file"
                accept=".csv"
                className="hidden"
                onChange={(e) => onFileChange(e.target.files?.[0] ?? null)}
              />
              <div className="flex flex-col items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-8 w-8 text-blue-500">
                  <path d="M12 3a1 1 0 0 1 1 1v9.586l2.293-2.293a1 1 0 1 1 1.414 1.414l-4 4a1 1 0 0 1-1.414 0l-4-4a1 1 0 1 1 1.414-1.414L11 13.586V4a1 1 0 0 1 1-1Z" />
                  <path d="M5 19a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-3a1 1 0 1 0-2 0v3H7v-3a1 1 0 1 0-2 0v3Z" />
                </svg>
                {file ? (
                  <>
                    <div className="text-sm font-medium">{file.name}</div>
                    <div className="text-xs text-muted-foreground">{bytesToNice(file.size)}</div>
                    <div className="mt-2 inline-flex gap-2">
                      <button type="button" onClick={() => onFileChange(null)} className="rounded-lg border bg-background px-3 py-1.5 text-xs ring-1 ring-inset ring-border hover:bg-muted">Ganti File</button>
                      <button type="button" onClick={() => downloadText('example.csv', example)} className="rounded-lg border bg-background px-3 py-1.5 text-xs ring-1 ring-inset ring-border hover:bg-muted">Unduh Contoh</button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="text-sm font-medium">Tarik & letakkan CSV di sini atau klik untuk memilih</div>
                    <div className="text-xs text-muted-foreground">Maks. beberapa MB, format .csv</div>
                    <button type="button" onClick={() => downloadText('example.csv', example)} className="mt-3 rounded-lg border bg-background px-3 py-1.5 text-xs ring-1 ring-inset ring-border hover:bg-muted">Unduh Contoh</button>
                  </>
                )}
              </div>
            </label>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleParse}
                disabled={!file || parsing}
                className="inline-flex items-center justify-center gap-2 rounded-xl border bg-background px-4 py-2 text-sm font-medium ring-1 ring-inset ring-border transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60"
              >
                {parsing && <Spinner className="h-4 w-4" />} Parse
              </button>
              <button
                onClick={handleImport}
                disabled={rows.length === 0 || loading}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading && <Spinner className="h-4 w-4" />} {loading ? `Mengimpor… ${progress}%` : `Import ${rows.length} rows`}
              </button>
              {loading && (
                <div className="flex-1">
                  <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div className="h-full w-[var(--w)] bg-blue-600 transition-[width]" style={{ width: `${progress}%` as any }} />
                  </div>
                </div>
              )}
            </div>

            {/* Header status */}
            {headerInfo && (
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="font-medium">Header:</span>
                {HEADERS.map((h) => (
                  <span
                    key={h}
                    className={[
                      'rounded-full border px-2 py-1',
                      headerInfo.missing.includes(h as string)
                        ? 'border-destructive/30 bg-destructive/10 text-destructive'
                        : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-600',
                    ].join(' ')}
                  >
                    {h}
                  </span>
                ))}
                {headerInfo.extra.length > 0 && (
                  <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-1 text-amber-700">
                    ekstra: {headerInfo.extra.join(', ')}
                  </span>
                )}
              </div>
            )}

            {/* Errors */}
            {errors.length > 0 && (
              <details open className="rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                <summary className="cursor-pointer font-semibold">Catatan parsing ({errors.length})</summary>
                <ul className="mt-2 list-disc pl-5">
                  {errors.map((e, i) => (
                    <li key={i}>{e}</li>
                  ))}
                </ul>
              </details>
            )}

            {/* Preview */}
            {rows.length > 0 && (
              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-medium">Preview ({preview.length} / {rows.length})</h2>
                  <div className="text-xs text-muted-foreground">Menampilkan 8 baris pertama</div>
                </div>
                <div className="overflow-x-auto rounded-xl border">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-muted/50">
                      <tr>
                        {HEADERS.map((h) => (
                          <th key={h} className="px-3 py-2 font-medium capitalize text-muted-foreground">{h.replaceAll('_', ' ')}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {preview.map((r, idx) => (
                        <tr key={idx} className="odd:bg-background even:bg-muted/30">
                          <td className="px-3 py-2 font-medium">{r.name}</td>
                          <ScoreCell v={r.interview_score} />
                          <ScoreCell v={r.skill_score} />
                          <ScoreCell v={r.personality_score} />
                          <td className="px-3 py-2"><Badge>{r.education_level}</Badge></td>
                          <td className="px-3 py-2"><Badge>{r.recruitment_strategy}</Badge></td>
                          <td className="px-3 py-2"><Badge>{r.experience_level}</Badge></td>
                          <td className="px-3 py-2"><StatusBadge s={r.status} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

// ————————————————————————————————————————————————————————
// Little UI helpers
// ————————————————————————————————————————————————————————

function Spinner({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg className={`${className} animate-spin`} viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
    </svg>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs ring-1 ring-inset ring-border">{children}</span>;
}

function StatusBadge({ s }: { s: Row['status'] }) {
  const map: Record<Row['status'], string> = {
    Pending: 'bg-amber-500/10 text-amber-700 border-amber-500/30',
    Hired: 'bg-emerald-500/10 text-emerald-700 border-emerald-500/30',
    Incomplete: 'bg-slate-500/10 text-slate-700 border-slate-500/30',
  };
  return <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs ${map[s]}`}>{s}</span>;
}

function ScoreCell({ v }: { v: number }) {
  const tone = v < 50 ? 'bg-rose-500/10 text-rose-700 border-rose-500/30' : v < 80 ? 'bg-amber-500/10 text-amber-700 border-amber-500/30' : 'bg-emerald-500/10 text-emerald-700 border-emerald-500/30';
  return (
    <td className="px-3 py-2">
      <span className={`inline-flex min-w-[3rem] items-center justify-center rounded-md border px-2 py-0.5 text-xs tabular-nums ${tone}`}>{v}</span>
    </td>
  );
}
