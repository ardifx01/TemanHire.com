'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function AiScoreButton({ id }: { id: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onClick = async () => {
    if (loading) return;
    setLoading(true);
    const res = await fetch('/api/ai/score', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ candidateId: id }),
    });
    setLoading(false);
    if (!res.ok) {
      const { error } = await res.json().catch(() => ({}));
      alert(error || 'AI score failed');
      return;
    }
    router.refresh();
  };

  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="rounded-md border px-2 py-1 text-sm hover:bg-black/5 disabled:opacity-50"
    >
      {loading ? 'Scoring…' : 'AI Score'}
    </button>
  );
}
