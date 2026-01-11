import { prisma } from '@/lib/db';
import LoginForm from './ui';

export const dynamic = 'force-dynamic';

export default async function LoginPage() {
  const players = await prisma.player.findMany({ where: { active: true }, orderBy: { name: 'asc' }, select: { name: true } });
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container flex min-h-screen items-center justify-center py-10">
        <div className="w-full max-w-md">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">Lliga de Pàdel</h1>
            <p className="text-sm text-slate-600">Entra amb el teu nom i PIN</p>
          </div>
          <LoginForm players={players.map(p => p.name)} />
          <p className="mt-6 text-xs text-slate-500 text-center">
            Tip: si no surts a la llista, un admin pot crear-te a <span className="kbd">Jugadors</span>.
          </p>
        </div>
      </div>
    </div>
  );
}
