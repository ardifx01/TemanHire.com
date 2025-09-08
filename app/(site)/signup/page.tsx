'use client';

import { useState } from 'react';
import { supabaseBrowser } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const [email, setEmail] = useState(''); 
  const [password, setPassword] = useState('');
  const [err, setErr] = useState<string|null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null); setLoading(true);
    const supabase = supabaseBrowser();
    const { error } = await supabase.auth.signUp({ email, password });
    setLoading(false);
    if (error) return setErr(error.message);
    router.push('/login');
  };

  return (
    <main className="min-h-[70vh] grid place-items-center p-6">
      <form onSubmit={onSubmit} className="w-full max-w-sm space-y-4 border rounded-xl p-5">
        <h1 className="text-2xl font-bold">Create account</h1>
        <div className="space-y-2">
          <label className="block text-sm">Email</label>
          <input className="w-full rounded-md border px-3 py-2 bg-transparent" type="email" required
            value={email} onChange={(e)=>setEmail(e.target.value)} />
        </div>
        <div className="space-y-2">
          <label className="block text-sm">Password</label>
          <input className="w-full rounded-md border px-3 py-2 bg-transparent" type="password" minLength={6} required
            value={password} onChange={(e)=>setPassword(e.target.value)} />
        </div>
        {err && <p className="text-sm text-red-500">{err}</p>}
        <button disabled={loading} className="w-full rounded-md border px-3 py-2 font-semibold hover:bg-black/5 disabled:opacity-50">
          {loading ? 'Creating...' : 'Sign up'}
        </button>
        <p className="text-sm">Already have an account? <a className="underline" href="/login">Log in</a></p>
      </form>
    </main>
  );
}
