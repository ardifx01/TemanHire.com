'use client';

import { useState } from 'react';
import { supabaseBrowser } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function CandidateFormPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    interview_score: 0,
    skill_score: 0,
    personality_score: 0,
    education_level: 'S1',
    recruitment_strategy: 'Moderat',
    experience_level: 'Junior',
    status: 'Pending',
  });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const supabase = supabaseBrowser();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push('/login');
      return;
    }

    const { error } = await supabase.from('candidates').insert({
      owner_id: user.id,
      ...form,
      interview_score: Number(form.interview_score),
      skill_score: Number(form.skill_score),
      personality_score: Number(form.personality_score),
    });

    setLoading(false);

    if (error) {
      alert(error.message);
    } else {
      alert('Kandidat berhasil ditambahkan!');
      router.push('/dashboard'); // balik ke dashboard
    }
  };

  return (
    <main className="min-h-[70vh] p-6">
      <h1 className="mb-4 text-2xl font-bold">Tambah Kandidat</h1>
      <form onSubmit={onSubmit} className="space-y-3 rounded-md border p-4 max-w-lg">
        <input
          className="w-full rounded border px-3 py-2"
          placeholder="Nama kandidat"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />

        <div className="grid grid-cols-3 gap-3">
          <input type="number" min={0} max={100} placeholder="Interview"
            className="rounded border px-3 py-2"
            value={form.interview_score}
            onChange={(e) => setForm({ ...form, interview_score: +e.target.value })}
            required />
          <input type="number" min={0} max={100} placeholder="Skill"
            className="rounded border px-3 py-2"
            value={form.skill_score}
            onChange={(e) => setForm({ ...form, skill_score: +e.target.value })}
            required />
          <input type="number" min={0} max={100} placeholder="Personality"
            className="rounded border px-3 py-2"
            value={form.personality_score}
            onChange={(e) => setForm({ ...form, personality_score: +e.target.value })}
            required />
        </div>

        <div className="grid grid-cols-4 gap-3">
          <select className="rounded border px-3 py-2" value={form.education_level}
            onChange={(e) => setForm({ ...form, education_level: e.target.value })}>
            <option>SMA</option><option>S1</option><option>S2</option><option>S3</option>
          </select>

          <select className="rounded border px-3 py-2" value={form.recruitment_strategy}
            onChange={(e) => setForm({ ...form, recruitment_strategy: e.target.value })}>
            <option>Agresif</option><option>Moderat</option><option>Pasif</option>
          </select>

          <select className="rounded border px-3 py-2" value={form.experience_level}
            onChange={(e) => setForm({ ...form, experience_level: e.target.value })}>
            <option>Junior</option><option>Mid</option><option>Senior</option>
          </select>

          <select className="rounded border px-3 py-2" value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}>
            <option>Pending</option><option>Hired</option><option>Incomplete</option>
          </select>
        </div>

        <div className="flex gap-3">
          <button disabled={loading} className="rounded border px-3 py-2 hover:bg-black/5">
            {loading ? 'Saving...' : 'Save Candidate'}
          </button>
          <button type="button" onClick={() => router.push('/dashboard')}
            className="rounded border px-3 py-2 hover:bg-black/5">
            Cancel
          </button>
        </div>
      </form>
    </main>
  );
}
