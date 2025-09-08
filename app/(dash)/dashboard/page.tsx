// app/(dash)/dashboard/page.tsx
import { redirect } from 'next/navigation';
import { supabaseServer } from '@/lib/supabase/server';
import DeleteCandidateButton from '@/components/dashboard/DeleteCandidateButton';
import Link from 'next/link';

export default async function DashboardPage() {
  const supabase = supabaseServer();

  const { data: { session } } = await supabase.auth.getSession();
  if (!session) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name')
    .eq('id', session.user.id)
    .maybeSingle();

  const { data: candidates } = await supabase
    .from('candidates')
    .select('id, name, interview_score, skill_score, personality_score, education_level, recruitment_strategy, experience_level, status, created_at')
    .eq('owner_id', session.user.id)
    .order('created_at', { ascending: false });

  return (
    <main className="min-h-[70vh] p-6 space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <div className="rounded-lg border p-4">
        <p className="text-sm opacity-80">
          Welcome{profile?.full_name ? `, ${profile.full_name}` : ''}! ({session.user.email})
        </p>
      </div>

      {(candidates?.length ?? 0) === 0 ? (
        <div className="rounded-md border p-6 text-center">
          <p className="mb-3">Kamu belum punya kandidat.</p>
          <a
            href="/dashboard/forminput"
            className="rounded-md border px-3 py-2 hover:bg-black/5"
          >
            Tambah kandidat
          </a>
          <a href="/dashboard/import" className="rounded-md border px-3 py-2 hover:bg-black/5">Import CSV</a>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Your Candidates</h2>
            <a href="/dashboard/import" className="rounded-md border px-3 py-2 text-sm hover:bg-black/5">Import CSV</a>
            <a
              href="/dashboard/forminput"
              className="rounded-md border px-3 py-2 text-sm hover:bg-black/5"
            >
              Tambah kandidat
            </a>
          </div>

          <ul className="divide-y rounded-md border">
            {(candidates ?? []).map((c) => (
              <li key={c.id} className="grid grid-cols-6 gap-3 p-3">
                <div className="font-medium">{c.name}</div>
                <div className="text-sm">Interview: {c.interview_score}</div>
                <div className="text-sm">Skill: {c.skill_score}</div>
                <div className="text-sm">Personality: {c.personality_score}</div>
                <div className="text-sm">
                  {c.education_level} • {c.experience_level} • {c.status}
                </div>
                <div className="flex justify-end gap-2">
                    <Link href={`/dashboard/candidates/${c.id}/edit`}  className="rounded-md border px-2 py-1 text-sm hover:bg-black/5">Edit</Link>
                     <DeleteCandidateButton id={c.id} name={c.name} />      
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </main>
  );
}
