// app/logout/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

export async function POST(req: Request) { // <-- terima req
  const cookieStore = cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name: string) => cookieStore.get(name)?.value,
        set: (name: string, value: string, options: any) => {
          cookieStore.set({ name, value, ...options });
        },
        remove: (name: string, options: any) => {
          cookieStore.set({ name, value: '', ...options });
        },
      },
    }
  );

  await supabase.auth.signOut();

  // gunakan origin dari request agar aman di dev, preview, dan prod
  const redirectUrl = new URL('/login', req.url);
  return NextResponse.redirect(redirectUrl);
}
