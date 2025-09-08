// app/(dash)/dashboard/layout.tsx — SERVER COMPONENT
import { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { supabaseServer } from '@/lib/supabase/server';
import DashNavbarClient from '@/components/dashboard/DashNavbarClient'

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const supabase = supabaseServer();

  // Session guard
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) redirect('/login');

  // Profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, avatar_url')
    .eq('id', session.user.id)
    .maybeSingle();

  const email = session.user.email ?? '';
  const displayName = profile?.full_name?.trim()
    ? profile.full_name
    : email.split('@')[0] || 'User';

  const initials = (displayName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w: string) => w[0]?.toUpperCase())
    .join('') || 'U') as string;

  return (
    <div className="min-h-screen">
      {/* Top Navbar (client for interactivity) */}
      <DashNavbarClient displayName={displayName} avatarUrl={profile?.avatar_url ?? ''} initials={initials} />

      {/* Content */}
      <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
    </div>
  );
}