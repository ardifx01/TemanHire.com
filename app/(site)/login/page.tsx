import { redirect } from 'next/navigation';
import { supabaseServer } from '@/lib/supabase/server';
import LoginForm from './ui/loginform';

export default async function LoginPage() {
  const supabase = supabaseServer();
  const { data: { session } } = await supabase.auth.getSession();

  // Kalau sudah login → langsung ke dashboard
  if (session) redirect('/dashboard');

  return (
    <main className="min-h-[70vh] grid place-items-center p-6">
      <LoginForm />
    </main>
  );
}
