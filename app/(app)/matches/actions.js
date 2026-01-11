'use server';

import { prisma } from '@/lib/db';
import { getActiveSeason } from '@/lib/data';
import { teamPoints, playerPointsForTeam } from '@/lib/points';
import { getSession } from '@/lib/auth';

export async function createMatchAction(payload) {
  // payload: { playedAt, aPlayers, bPlayers, setsA, setsB, spectacleRating, gometsByPlayerId }
  const season = await getActiveSeason();
  if (!season) throw new Error('No hi ha temporada activa.');

  const { playedAt, aPlayers, bPlayers, setsA, setsB, spectacleRating } = payload;
  if (!Array.isArray(aPlayers) || aPlayers.length !== 2 || !Array.isArray(bPlayers) || bPlayers.length !== 2) {
    throw new Error('Calen 2 jugadors per equip.');
  }
  const all = [...aPlayers, ...bPlayers];
  const unique = new Set(all);
  if (unique.size !== 4) throw new Error('No pots repetir jugadors.');

  const A = Number(setsA);
  const B = Number(setsB);
  if (!Number.isInteger(A) || !Number.isInteger(B) || A < 0 || B < 0 || A > 3 || B > 3) {
    throw new Error('Sets vàlids: 0–3.');
  }

  const tpA = teamPoints(A, B);
  const tpB = teamPoints(B, A);
  const ppA = playerPointsForTeam(tpA);
  const ppB = playerPointsForTeam(tpB);

  const session = await getSession();
  if (!session?.playerId) throw new Error('Sessió no vàlida.');

  const match = await prisma.match.create({
    data: {
      seasonId: season.id,
      createdById: session.playerId,
      playedAt: playedAt ? new Date(playedAt) : new Date(),
      setsA: A,
      setsB: B,
      spectacleRating: spectacleRating ? Number(spectacleRating) : null,
      players: {
        create: [
          { playerId: aPlayers[0], team: 'A', gomet: payload.gometsByPlayerId?.[aPlayers[0]] || null },
          { playerId: aPlayers[1], team: 'A', gomet: payload.gometsByPlayerId?.[aPlayers[1]] || null },
          { playerId: bPlayers[0], team: 'B', gomet: payload.gometsByPlayerId?.[bPlayers[0]] || null },
          { playerId: bPlayers[1], team: 'B', gomet: payload.gometsByPlayerId?.[bPlayers[1]] || null }
        ]
      },
      points: {
        create: [
          { playerId: aPlayers[0], pointsEarned: ppA },
          { playerId: aPlayers[1], pointsEarned: ppA },
          { playerId: bPlayers[0], pointsEarned: ppB },
          { playerId: bPlayers[1], pointsEarned: ppB }
        ]
      }
    }
  });

  return { ok: true, matchId: match.id };
}

export async function deleteMatchAction(matchId) {
  await prisma.match.delete({ where: { id: matchId } });
  return { ok: true };
}
