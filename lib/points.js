export function teamPoints(setsFor, setsAgainst) {
  let base = 0;
  if (setsFor > setsAgainst) base = 3;
  else if (setsFor === setsAgainst) base = 1;
  const bonus = 0.5 * setsFor;
  return base + bonus;
}

export function playerPointsForTeam(teamPts) {
  return teamPts / 2;
}
