'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabaseBrowser } from '@/lib/supabase/client';

export default function DeleteCandidateButton({
  id,
  name,
}: {
  id: string;
  name?: string;
}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onDelete = async () => {
    if (loading) return;
    const ok = confirm(
      `Yakin hapus kandidat${name ? ` “${name}”` : ''}? Tindakan ini tidak bisa dibatalkan.`
    );
    if (!ok) return;

    setLoading(true);
    const supabase = supabaseBrowser();
    const { error } = await supabase.from('candidates').delete().eq('id', id);
    setLoading(false);

    if (error) {
      alert(error.message);
    } else {
      router.refresh(); // reload data server component
    }
  };

  return (
    <button
      onClick={onDelete}
      disabled={loading}
      className="rounded-md border px-2 py-1  bg-[#0097b2] text-white text-sm hover:bg-[#007a8f] transition-colors"
    >
      {loading ? 'Deleting...' : 'Delete'}
    </button>
  );
}
