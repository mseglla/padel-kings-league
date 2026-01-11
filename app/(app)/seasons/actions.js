'use server';

import { prisma } from '@/lib/db';
import { getStandings } from '@/lib/standings';

function nextQuarter(date = new Date()) {
  const year = date.getFullYear();
  const q = Math.floor(date.getMonth() / 3) + 1;
  const nextQ = q === 4 ? 1 : q + 1;
  const nextYear = q === 4 ? year + 1 : year;
  const start = new Date(nextYear, (nextQ - 1) * 3, 1, 0, 0, 0);
  const end = new Date(nextYear, nextQ * 3, 0, 23, 59, 59);
  const name = `${nextYear} Q${nextQ}`;
  return { name, start, end };
}

export async function closeSeasonAction() {
  const { season, first, second } = await getStandings();
  if (!season) throw new Error('No hi ha temporada activa.');

  const MIN_MATCHES = 4;

  const eligibleSecond = second.filter(r => r.played >= MIN_MATCHES);
  const eligibleFirst = first.filter(r => r.played >= MIN_MATCHES);

  const promote = eligibleSecond[0]; // #1 of second
  const relegate = eligibleFirst[eligibleFirst.length - 1]; // #last of first

  await prisma.season.update({ where: { id: season.id }, data: { status: 'CLOSED' } });

  if (promote && relegate) {
    await prisma.$transaction([
      prisma.player.update({ where: { id: promote.id }, data: { division: 'FIRST' } }),
      prisma.player.update({ where: { id: relegate.id }, data: { division: 'SECOND' } })
    ]);
  }

  const nq = nextQuarter(new Date(season.endDate));
  await prisma.season.create({
    data: {
      name: nq.name,
      startDate: nq.start,
      endDate: nq.end,
      status: 'ACTIVE'
    }
  });

  return { ok: true, promote: promote?.name || null, relegate: relegate?.name || null };
}
