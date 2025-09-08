'use client';

import { useState } from 'react';
import { supabaseBrowser } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setLoading(true);

    const supabase = supabaseBrowser();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);

    if (error) return setErr(error.message);
    router.push('/dashboard');
  };

  return (
    <form onSubmit={onSubmit} className="w-full max-w-sm space-y-4 border rounded-xl p-5">
      <h1 className="text-2xl font-bold">Log in</h1>
      <div className="space-y-2">
        <label className="block text-sm">Email</label>
        <input
          className="w-full rounded-md border px-3 py-2 bg-transparent"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <label className="block text-sm">Password</label>
        <input
          className="w-full rounded-md border px-3 py-2 bg-transparent"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      {err && <p className="text-sm text-red-500">{err}</p>}
      <button
        disabled={loading}
        className="w-full rounded-md border px-3 py-2 font-semibold hover:bg-black/5 disabled:opacity-50"
      >
        {loading ? 'Signing in...' : 'Log in'}
      </button>
      <p className="text-sm">
        New here? <a className="underline" href="/signup">Create account</a>
      </p>
    </form>
  );
}
