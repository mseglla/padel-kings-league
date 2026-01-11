import AppShell from '@/components/app-shell';
import { prisma } from '@/lib/db';
import SeasonsClient from './ui';

export const dynamic = 'force-dynamic';

export default async function SeasonsPage() {
  const seasons = await prisma.season.findMany({ orderBy: { startDate: 'desc' }, take: 8 });
  return (
    <AppShell title="Temporades">
      <SeasonsClient seasons={seasons} />
    </AppShell>
  );
}
