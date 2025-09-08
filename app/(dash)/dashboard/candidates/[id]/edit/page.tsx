// app/(dash)/dashboard/candidates/[id]/edit/page.tsx
import { redirect } from 'next/navigation';
import { supabaseServer } from '@/lib/supabase/server';
import EditCandidateForm from './ui/EditCandidateForm'

type Props = { params: { id: string } };

export default async function EditCandidatePage({ params }: Props) {
  const supabase = supabaseServer();

  // proteksi
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) redirect('/login');

  // ambil kandidat milik user ini (RLS melindungi, tapi kita filter juga)
  const { data: candidate, error } = await supabase
    .from('candidates')
    .select(
      'id, name, interview_score, skill_score, personality_score, education_level, recruitment_strategy, experience_level, status'
    )
    .eq('id', params.id)
    .eq('owner_id', session.user.id)
    .maybeSingle();

  if (error || !candidate) {
    // tidak ditemukan / bukan milik user → balik
    redirect('/dashboard');
  }

  return (
    <main className="min-h-[70vh] p-6">
      <h1 className="mb-4 text-2xl font-bold">Edit Kandidat</h1>
      {/* Client form pre-filled */}
      <EditCandidateForm candidate={candidate} />
    </main>
  );
}
