import Link from 'next/link';
import { getMe } from '@/lib/data';

export default async function AppShell({ children, title }) {
  const me = await getMe();

  return (
    <div>
      <header className="border-b border-slate-200 bg-white">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="font-semibold tracking-tight">
              Lliga de Pàdel
            </Link>
            <span className="badge hidden sm:inline-flex">
              {me?.division === 'FIRST' ? '1a' : '2a'} divisió
            </span>
          </div>
          <nav className="flex items-center gap-2">
            <Link className="btn btn-ghost" href="/dashboard">Classificació</Link>
            <Link className="btn btn-ghost" href="/matches">Històric</Link>
            <Link className="btn btn-ghost" href="/matches/new">Registrar</Link>
            <Link className="btn btn-ghost" href="/players">Jugadors</Link>
            <Link className="btn btn-ghost" href="/seasons">Temporades</Link>
            <Link className="btn btn-secondary" href="/logout">Sortir</Link>
          </nav>
        </div>
      </header>

      <main className="container py-6">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
            <p className="text-sm text-slate-600">Hola, <span className="font-medium text-slate-900">{me?.name}</span></p>
          </div>
          <div className="hidden sm:block">
            <span className="badge">Temporada activa</span>
          </div>
        </div>
        {children}
      </main>

      <footer className="py-10">
        <div className="container text-xs text-slate-500">
          MVP lliga padel · Punts: victòria 3, empat 1, derrota 0, +0,5 per set guanyat.
        </div>
      </footer>
    </div>
  );
}
