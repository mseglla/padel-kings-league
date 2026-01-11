import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function getMe() {
  const session = await getSession();
  if (!session?.playerId) return null;
  return prisma.player.findUnique({ where: { id: session.playerId } });
}

export async function getActiveSeason() {
  return prisma.season.findFirst({ where: { status: 'ACTIVE' }, orderBy: { createdAt: 'desc' } });
}
