import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';

const AI_API_URL = process.env.AI_API_URL!;
const AI_API_KEY = process.env.AI_API_KEY || '';

export async function POST(req: Request) {
  try {
    const supabase = supabaseServer();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { candidateId } = await req.json();
    if (!candidateId) return NextResponse.json({ error: 'candidateId required' }, { status: 400 });

    // ambil kandidat milik user (RLS juga melindungi)
    const { data: c, error } = await supabase
      .from('candidates')
      .select('id, name, interview_score, skill_score, personality_score, education_level, recruitment_strategy, experience_level, status')
      .eq('id', candidateId)
      .eq('owner_id', session.user.id)
      .maybeSingle();

    if (error || !c) return NextResponse.json({ error: 'Candidate not found' }, { status: 404 });

    // panggil AI service
    const res = await fetch(`${AI_API_URL}/score`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(AI_API_KEY ? { 'x-api-key': AI_API_KEY } : {}),
      },
      body: JSON.stringify(c),
    });
    if (!res.ok) {
      const txt = await res.text();
      return NextResponse.json({ error: `AI service error: ${txt}` }, { status: 502 });
    }

    const { ai_score, ai_notes, proba, passed } = await res.json();

    // simpan ke Supabase
    const { error: updErr } = await supabase
        .from('candidates')
        .update({ ai_score, ai_notes, ai_proba: proba ?? null, ai_pass: passed })
        .eq('id', c.id);
    if (updErr) return NextResponse.json({ error: updErr.message }, { status: 500 });

    return NextResponse.json({ ok: true, ai_score, ai_notes });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Unknown error' }, { status: 500 });
  }
}
