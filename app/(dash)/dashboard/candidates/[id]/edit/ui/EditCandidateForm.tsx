'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabaseBrowser } from '@/lib/supabase/client';

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

export default function EditCandidateForm({ candidate }: { candidate: Candidate }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<Candidate>({ ...candidate });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

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
      .eq('id', form.id); // RLS memastikan hanya milik user yang bisa update

    setLoading(false);

    if (error) {
      alert(error.message);
    } else {
      router.push('/dashboard');
      router.refresh();
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-3 rounded-md border p-4 max-w-lg">
      <input
        className="w-full rounded border px-3 py-2"
        placeholder="Nama kandidat"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        required
      />

      <div className="grid grid-cols-3 gap-3">
        <input
          type="number" min={0} max={100}
          className="rounded border px-3 py-2"
          placeholder="Interview"
          value={form.interview_score}
          onChange={(e) => setForm({ ...form, interview_score: +e.target.value })}
          required
        />
        <input
          type="number" min={0} max={100}
          className="rounded border px-3 py-2"
          placeholder="Skill"
          value={form.skill_score}
          onChange={(e) => setForm({ ...form, skill_score: +e.target.value })}
          required
        />
        <input
          type="number" min={0} max={100}
          className="rounded border px-3 py-2"
          placeholder="Personality"
          value={form.personality_score}
          onChange={(e) => setForm({ ...form, personality_score: +e.target.value })}
          required
        />
      </div>

      <div className="grid grid-cols-4 gap-3">
        <select
          className="rounded border px-3 py-2"
          value={form.education_level}
          onChange={(e) => setForm({ ...form, education_level: e.target.value as Candidate['education_level'] })}
        >
          <option>SMA</option><option>S1</option><option>S2</option><option>S3</option>
        </select>

        <select
          className="rounded border px-3 py-2"
          value={form.recruitment_strategy}
          onChange={(e) => setForm({ ...form, recruitment_strategy: e.target.value as Candidate['recruitment_strategy'] })}
        >
          <option>Agresif</option><option>Moderat</option><option>Pasif</option>
        </select>

        <select
          className="rounded border px-3 py-2"
          value={form.experience_level}
          onChange={(e) => setForm({ ...form, experience_level: e.target.value as Candidate['experience_level'] })}
        >
          <option>Junior</option><option>Mid</option><option>Senior</option>
        </select>

        <select
          className="rounded border px-3 py-2"
          value={form.status}
          onChange={(e) => setForm({ ...form, status: e.target.value as Candidate['status'] })}
        >
          <option>Pending</option><option>Hired</option><option>Incomplete</option>
        </select>
      </div>

      <div className="flex gap-3">
        <button disabled={loading} className="rounded border px-3 py-2 hover:bg-black/5">
          {loading ? 'Saving...' : 'Save changes'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded border px-3 py-2 hover:bg-black/5"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
