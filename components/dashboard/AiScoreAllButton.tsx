'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function AiScoreAllButton() {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const router = useRouter();

  const onClick = async () => {
    if (loading) return;
    setMsg(null);
    setLoading(true);
    try {
      const res = await fetch('/api/ai/score-all', { method: 'POST' });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || 'Score all failed');

      setMsg(`Scored: ${data.success}/${data.total} (failed: ${data.failed})`);
      router.refresh(); // reload data server component
    } catch (err: any) {
      setMsg(err?.message || 'Score all failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={onClick}
        disabled={loading}
        className="rounded-md border px-3 py-2 text-sm hover:bg-black/5 disabled:opacity-50"
        title="Jalankan AI scoring untuk semua kandidat Anda"
      >
        {loading ? 'Scoring…' : 'Score All'}
      </button>
      {msg && <span className="text-xs opacity-70">{msg}</span>}
    </div>
  );
}
