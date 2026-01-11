import { prisma } from '@/lib/db';
import { getActiveSeason } from '@/lib/data';

export async function getStandings() {
  const season = await getActiveSeason();
  if (!season) return { season: null, rows: [] };

  const players = await prisma.player.findMany({ where: { active: true }, orderBy: { name: 'asc' } });

  const points = await prisma.playerPoints.findMany({ where: { match: { seasonId: season.id } } });
  const matchPlayers = await prisma.matchPlayer.findMany({ where: { match: { seasonId: season.id } } });
  const matches = await prisma.match.findMany({ where: { seasonId: season.id }, select: { id: true, setsA: true, setsB: true, spectacleRating: true } });

  const pointsByPlayer = new Map();
  const playedByPlayer = new Map();
  const setsWonByPlayer = new Map();
  const spectacleSumByPlayer = new Map();
  const spectacleCountByPlayer = new Map();
  const greensByPlayer = new Map();
  const redsByPlayer = new Map();

  for (const p of players) {
    pointsByPlayer.set(p.id, 0);
    playedByPlayer.set(p.id, 0);
    setsWonByPlayer.set(p.id, 0);
    spectacleSumByPlayer.set(p.id, 0);
    spectacleCountByPlayer.set(p.id, 0);
    greensByPlayer.set(p.id, 0);
    redsByPlayer.set(p.id, 0);
  }

  const matchMap = new Map(matches.map(m => [m.id, m]));

  // points + matches played
  for (const pe of points) {
    pointsByPlayer.set(pe.playerId, (pointsByPlayer.get(pe.playerId) || 0) + pe.pointsEarned);
    playedByPlayer.set(pe.playerId, (playedByPlayer.get(pe.playerId) || 0) + 1);
    const m = matchMap.get(pe.matchId);
    if (m?.spectacleRating) {
      spectacleSumByPlayer.set(pe.playerId, (spectacleSumByPlayer.get(pe.playerId) || 0) + m.spectacleRating);
      spectacleCountByPlayer.set(pe.playerId, (spectacleCountByPlayer.get(pe.playerId) || 0) + 1);
    }
  }

  // sets won + gomets
  for (const mp of matchPlayers) {
    const m = matchMap.get(mp.matchId);
    if (!m) continue;
    const setsWon = mp.team === 'A' ? m.setsA : m.setsB;
    setsWonByPlayer.set(mp.playerId, (setsWonByPlayer.get(mp.playerId) || 0) + setsWon);
    if (mp.gomet === 'GREEN') greensByPlayer.set(mp.playerId, (greensByPlayer.get(mp.playerId) || 0) + 1);
    if (mp.gomet === 'RED') redsByPlayer.set(mp.playerId, (redsByPlayer.get(mp.playerId) || 0) + 1);
  }

  const rows = players.map(p => {
    const pts = pointsByPlayer.get(p.id) || 0;
    const played = playedByPlayer.get(p.id) || 0;
    const pp = played ? pts / played : 0;
    const sets = setsWonByPlayer.get(p.id) || 0;
    const spN = spectacleCountByPlayer.get(p.id) || 0;
    const sp = spN ? (spectacleSumByPlayer.get(p.id) || 0) / spN : null;
    const green = greensByPlayer.get(p.id) || 0;
    const red = redsByPlayer.get(p.id) || 0;

    return {
      id: p.id,
      name: p.name,
      division: p.division,
      points: Number(pts.toFixed(2)),
      pointsPerMatch: Number(pp.toFixed(2)),
      played,
      setsWon: sets,
      spectacleAvg: sp ? Number(sp.toFixed(2)) : null,
      greens: green,
      reds: red,
      fairplay: green - red
    };
  });

  // sort within division by tie-break rules
  const sortFn = (a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.pointsPerMatch !== a.pointsPerMatch) return b.pointsPerMatch - a.pointsPerMatch;
    if (b.setsWon !== a.setsWon) return b.setsWon - a.setsWon;
    const asp = a.spectacleAvg ?? -1;
    const bsp = b.spectacleAvg ?? -1;
    if (bsp !== asp) return bsp - asp;
    if (b.fairplay !== a.fairplay) return b.fairplay - a.fairplay;
    return a.name.localeCompare(b.name);
  };

  const first = rows.filter(r => r.division === 'FIRST').sort(sortFn);
  const second = rows.filter(r => r.division === 'SECOND').sort(sortFn);

  return { season, first, second };
}
