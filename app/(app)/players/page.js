import AppShell from '@/components/app-shell';
import { prisma } from '@/lib/db';
import PlayersClient from './ui';

export const dynamic = 'force-dynamic';

export default async function PlayersPage() {
  const players = await prisma.player.findMany({ orderBy: { name: 'asc' }, select: { id: true, name: true, division: true, active: true } });
  return (
    <AppShell title="Jugadors">
      <PlayersClient players={players} />
    </AppShell>
  );
}
