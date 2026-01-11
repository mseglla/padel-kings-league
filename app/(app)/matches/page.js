import AppShell from '@/components/app-shell';
import { prisma } from '@/lib/db';
import MatchesTable from './table';
import { getActiveSeason } from '@/lib/data';

export const dynamic = 'force-dynamic';

export default async function MatchesPage() {
  const season = await getActiveSeason();
  const matches = season
    ? await prisma.match.findMany({
        where: { seasonId: season.id },
        orderBy: { playedAt: 'desc' },
        include: {
          createdBy: { select: { name: true } },
          players: { include: { player: { select: { id: true, name: true } } } }
        }
      })
    : [];

  return (
    <AppShell title="Històric">
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <span className="badge">Temporada: {season?.name ?? '—'}</span>
        <span className="badge">Total: {matches.length}</span>
      </div>
      <MatchesTable matches={matches} />
    </AppShell>
  );
}
