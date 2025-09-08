'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabaseBrowser } from '@/lib/supabase/client';

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

// Helpers
const clamp01 = (n: number) => Math.max(0, Math.min(100, n));

export default function ImportPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [rows, setRows] = useState<Row[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const example = `name,interview_score,skill_score,personality_score,education_level,recruitment_strategy,experience_level,status
Budi,85,80,75,S1,Moderat,Junior,Pending
Sari,90,88,92,S2,Agresif,Senior,Hired`;

  async function handleParse() {
    setErrors([]);
    if (!file) return;

    const text = await file.text();
    const lines = text.split(/\r?\n/).filter(l => l.trim().length > 0);
    if (lines.length < 2) {
      setErrors(['CSV kosong / tidak ada data.']); 
      return;
    }

    const header = lines[0]
  .replace(/^"|"$/g, '')  // hapus tanda kutip awal/akhir
  .split(',')
  .map(h => h.trim().toLowerCase());

    const need = ['name','interview_score','skill_score','personality_score','education_level','recruitment_strategy','experience_level','status'];
    const missing = need.filter(k => !header.includes(k));
    if (missing.length) {
      setErrors([`Header wajib: ${need.join(', ')}. Kurang: ${missing.join(', ')}`]);
      return;
    }
    const idx = (k: string) => header.indexOf(k);

    const out: Row[] = [];
    const rowErrors: string[] = [];

    for (let i = 1; i < lines.length; i++) {
      const cols = lines[i].split(',').map(c => c.trim());
      if (!cols.length || !cols[idx('name')]) continue;

      const name = cols[idx('name')];

      const interview = clamp01(Number(cols[idx('interview_score')]));
      const skill = clamp01(Number(cols[idx('skill_score')]));
      const personality = clamp01(Number(cols[idx('personality_score')]));

      const edu = (cols[idx('education_level')] || '').toUpperCase();
      const education_level = (EDUCATIONS as readonly string[]).includes(edu) ? (edu as Row['education_level']) : null;

      const stratRaw = cols[idx('recruitment_strategy')] || '';
      const stratCap = stratRaw.charAt(0).toUpperCase() + stratRaw.slice(1).toLowerCase();
      const recruitment_strategy = (STRATEGIES as readonly string[]).includes(stratCap) ? (stratCap as Row['recruitment_strategy']) : null;

      const lvlRaw = cols[idx('experience_level')] || '';
      const lvlCap = lvlRaw.charAt(0).toUpperCase() + lvlRaw.slice(1).toLowerCase();
      const experience_level = (LEVELS as readonly string[]).includes(lvlCap) ? (lvlCap as Row['experience_level']) : null;

      const statRaw = cols[idx('status')] || 'Pending';
      const statCap = statRaw.charAt(0).toUpperCase() + statRaw.slice(1).toLowerCase();
      const status = (STATUSES as readonly string[]).includes(statCap) ? (statCap as Row['status']) : 'Pending';

      if (!education_level || !recruitment_strategy || !experience_level || [interview,skill,personality].some(n => Number.isNaN(n))) {
        rowErrors.push(`Baris ${i+1}: data tidak valid (cek enum/angka).`);
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
  }

  async function handleImport() {
    if (rows.length === 0) return;
    setLoading(true);

    const supabase = supabaseBrowser();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push('/login'); return; }

    // insert batch (chunking biar aman)
    const chunk = 500;
    for (let i = 0; i < rows.length; i += chunk) {
      const slice = rows.slice(i, i + chunk).map(r => ({ ...r, owner_id: user.id }));
      const { error } = await supabase.from('candidates').insert(slice);
      if (error) { 
        setLoading(false);
        alert(error.message);
        return;
      }
    }

    setLoading(false);
    alert(`Imported ${rows.length} candidates`);
    router.push('/dashboard');
    router.refresh();
  }

  return (
    <main className="min-h-[70vh] p-6 space-y-4">
      <h1 className="text-2xl font-bold">Import Kandidat (CSV)</h1>

      <div className="rounded border p-4 space-y-3 max-w-2xl">
        <p className="text-sm">
          Format header yang didukung:
          <code className="ml-2">
            name, interview_score, skill_score, personality_score, education_level, recruitment_strategy, experience_level, status
          </code>
        </p>
        <details className="text-sm">
          <summary className="cursor-pointer">Contoh CSV</summary>
          <pre className="mt-2 whitespace-pre-wrap rounded bg-black/5 p-2 text-xs">{example}</pre>
        </details>

        <input
          type="file"
          accept=".csv"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        />

        <div className="flex gap-2">
          <button
            onClick={handleParse}
            disabled={!file}
            className="rounded border px-3 py-2 text-sm hover:bg-black/5 disabled:opacity-50"
          >
            Parse
          </button>
          <button
            onClick={handleImport}
            disabled={rows.length === 0 || loading}
            className="rounded border px-3 py-2 text-sm hover:bg-black/5 disabled:opacity-50"
          >
            {loading ? 'Importing…' : `Import ${rows.length} rows`}
          </button>
        </div>

        {errors.length > 0 && (
          <div className="rounded border border-red-300 bg-red-50 p-3 text-sm">
            <div className="font-semibold mb-1">Catatan parsing:</div>
            <ul className="list-disc pl-5">
              {errors.map((e, i) => <li key={i}>{e}</li>)}
            </ul>
          </div>
        )}
      </div>
    </main>
  );
}
