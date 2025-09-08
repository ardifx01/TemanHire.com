// app/(dash)/dashboard/consult/page.tsx
import { redirect } from 'next/navigation';
import { supabaseServer } from '@/lib/supabase/server';
import { ConsultChat } from '@/components/dashboard/ConsultChat'

export default async function ConsultPage() {
  const supabase = supabaseServer();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) redirect('/login');

  return (
    <main className="min-h-[70vh] p-6 space-y-4">
      <h1 className="text-2xl font-bold">Konsultasi AI</h1>
      <p className="text-sm opacity-70">
        Tanya apa saja! AI ini terintegrasi dengan Dashboard sehingga bisa memberikan pendapat berdasarkan data kandidat yang kamu miliki. 
      </p>
      <ConsultChat />
    </main>
  );
} 

// mantap
