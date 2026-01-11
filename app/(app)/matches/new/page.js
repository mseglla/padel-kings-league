import AppShell from '@/components/app-shell';
import { prisma } from '@/lib/db';
import Wizard from './wizard';

export const dynamic = 'force-dynamic';

export default async function NewMatchPage() {
  const players = await prisma.player.findMany({ where: { active: true }, orderBy: { name: 'asc' }, select: { id: true, name: true } });
  return (
    <AppShell title="Registrar sessió">
      <Wizard players={players} />
    </AppShell>
  );
}
