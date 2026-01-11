// Model 1: Victory 3, Draw 1 each, Loss 0, +0.5 per set won. Team points split 50/50.

export function computeTeamPoints(setsFor, setsAgainst) {
  let base = 0;
  if (setsFor > setsAgainst) base = 3;
  else if (setsFor === setsAgainst) base = 1;
  else base = 0;
  const bonus = 0.5 * setsFor;
  return base + bonus;
}

export function computePlayerPoints(teamPoints) {
  return teamPoints / 2;
}

export function isValidSets(a, b) {
  const ok = Number.isInteger(a) && Number.isInteger(b) && a >= 0 && b >= 0 && a <= 3 && b <= 3;
  if (!ok) return false;
  // disallow 0-0
  if (a === 0 && b === 0) return false;
  // allow ties (1-1), allow non-finished like 2-0, 2-1, 3-0, 3-1
  // also allow 1-0 / 0-1
  return true;
}
