'use server';

import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function createPlayerAction(formData) {
  const name = String(formData.get('name') || '').trim();
  const pin = String(formData.get('pin') || '').trim();
  const division = String(formData.get('division') || 'SECOND');
  if (!name || name.length < 2) return { ok: false, message: 'Nom massa curt.' };
  if (!/^[0-9]{4}$/.test(pin)) return { ok: false, message: 'PIN ha de ser 4 dígits.' };
  const pinHash = await bcrypt.hash(pin, 10);
  try {
    await prisma.player.create({ data: { name, pinHash, division, isAdmin: true, active: true } });
  } catch (e) {
    return { ok: false, message: 'Aquest nom ja existeix.' };
  }
  return { ok: true };
}

export async function toggleActiveAction(playerId) {
  const p = await prisma.player.findUnique({ where: { id: playerId } });
  if (!p) return { ok: false };
  await prisma.player.update({ where: { id: playerId }, data: { active: !p.active } });
  return { ok: true };
}
