'use server';

import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { createSession } from '@/lib/auth';
import { redirect } from 'next/navigation';

export async function loginAction(formData) {
  const name = String(formData.get('name') || '').trim();
  const pin = String(formData.get('pin') || '').trim();

  if (!name || !pin) {
    return { ok: false, message: 'Falta nom o PIN.' };
  }

  const player = await prisma.player.findUnique({ where: { name } });
  if (!player) return { ok: false, message: 'Jugador no trobat.' };

  const valid = await bcrypt.compare(pin, player.pinHash);
  if (!valid) return { ok: false, message: 'PIN incorrecte.' };

  await createSession({ playerId: player.id });
  redirect('/dashboard');
}
