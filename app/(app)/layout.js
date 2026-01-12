export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

import AppShell from '@/components/app-shell';
import AppProviders from '@/components/app-providers';

export default function AppLayout({ children }) {
  return (
    <AppProviders>
      {children}
    </AppProviders>
  );
}
