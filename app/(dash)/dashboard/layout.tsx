// app/(dash)/dashboard/layout.tsx
import { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { supabaseServer } from '@/lib/supabase/server';

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const supabase = supabaseServer();

  // Cek session (proteksi di level layout, jadi semua child aman)
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) redirect('/login');

  // Ambil profil user
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, avatar_url')
    .eq('id', session.user.id)
    .maybeSingle();

  const email = session.user.email ?? '';
  const displayName =
    profile?.full_name && profile.full_name.trim().length > 0
      ? profile.full_name
      : email.split('@')[0] || 'User';

  // Helper avatar fallback (initials)
  const initials = displayName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w: string) => w[0]?.toUpperCase())
    .join('') || 'U';

  return (
    <div className="min-h-screen">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 border-b bg-white/70 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link href="/dashboard" className="text-base font-semibold">
            TemanHire
          </Link>

          <nav className="flex items-center gap-3">
            <Link href="/dashboard" className="text-sm hover:underline">Home</Link>
            <Link href="/dashboard/profile" className="text-sm hover:underline">Profile</Link>
            <Link href="/dashboard/predict" className="text-sm hover:underline">Predict</Link>
          </nav>

          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-gray-600 sm:block">
              {displayName}
            </span>

            {profile?.avatar_url ? (
              <Image
                src={profile.avatar_url}
                alt={displayName}
                width={32}
                height={32}
                className="h-8 w-8 rounded-full object-cover"
              />
            ) : (
              <div className="grid h-8 w-8 place-items-center rounded-full border text-xs font-semibold">
                {initials}
              </div>
            )}
                       {/* pindahkan sign out ke navbar */}
            <form action="/logout" method="post">
              <button className="rounded-md border px-3 py-1.5 text-sm hover:bg-black/5">
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
    </div>
  );
}
