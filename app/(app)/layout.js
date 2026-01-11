import AppShell from '@/components/app-shell';
import AppProviders from '@/components/app-providers';

export const dynamic = 'force-dynamic';

export default function AppLayout({ children }) {
  return (
    <AppProviders>
      {children}
    </AppProviders>
  );
}
