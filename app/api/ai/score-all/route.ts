// app/api/ai/score-all/route.ts
import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';

const AI_API_URL = process.env.AI_API_URL!;
const AI_API_KEY = process.env.AI_API_KEY || '';

export async function POST() {
  try {
    const supabase = supabaseServer();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // ambil semua kandidat user
    const { data: rows, error } = await supabase
      .from('candidates')
      .select('id, name, interview_score, skill_score, personality_score, education_level, recruitment_strategy, experience_level, status')
      .eq('owner_id', session.user.id);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    if (!rows || rows.length === 0) {
      return NextResponse.json({ ok: true, total: 0, success: 0, failed: 0 });
    }

    let success = 0;
    let failed = 0;

    for (const c of rows) {
      try {
        const res = await fetch(`${AI_API_URL}/score`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(AI_API_KEY ? { 'x-api-key': AI_API_KEY } : {}),
          },
          body: JSON.stringify(c),
        });
        if (!res.ok) throw new Error(await res.text());

        const { ai_score, ai_notes, proba, passed } = await res.json();

        const { error: updErr } = await supabase
          .from('candidates')
          .update({ ai_score, ai_notes, ai_proba: proba ?? null, ai_pass: passed })
          .eq('id', c.id);

        if (updErr) throw new Error(updErr.message);
        success++;
      } catch (err) {
        console.error(`Gagal score kandidat ${c.id}`, err);
        failed++;
      }
    }

    return NextResponse.json({ ok: true, total: rows.length, success, failed });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Unknown error' }, { status: 500 });
  }
}
