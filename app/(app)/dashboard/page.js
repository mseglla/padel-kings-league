import AppShell from '@/components/app-shell';
import { getStandings } from '@/lib/standings';

function StandingsTable({ title, rows }) {
  return (
    <div className="card">
      <div className="card-h flex items-center justify-between">
        <h2 className="text-base font-semibold">{title}</h2>
        <span className="badge">{rows.length} jugadors</span>
      </div>
      <div className="card-b overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th>#</th>
              <th>Jugador</th>
              <th>Punts</th>
              <th>P/P</th>
              <th>Partits</th>
              <th>Sets</th>
              <th>⭐</th>
              <th>🟢</th>
              <th>🔴</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, idx) => (
              <tr key={r.id}>
                <td className="text-slate-500">{idx + 1}</td>
                <td className="font-medium">{r.name}</td>
                <td>{r.points}</td>
                <td className="text-slate-600">{r.pointsPerMatch}</td>
                <td className="text-slate-600">{r.played}</td>
                <td className="text-slate-600">{r.setsWon}</td>
                <td className="text-slate-600">{r.spectacleAvg ?? '—'}</td>
                <td className="text-slate-600">{r.greens}</td>
                <td className="text-slate-600">{r.reds}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default async function DashboardPage() {
  const { season, first, second } = await getStandings();

  return (
    <AppShell title="Classificació">
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <span className="badge">Temporada: {season?.name ?? '—'}</span>
        <span className="badge">Desempat: punts → P/P → sets → ⭐ → (🟢−🔴)</span>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <StandingsTable title="1a divisió" rows={first} />
        <StandingsTable title="2a divisió" rows={second} />
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="card">
          <div className="card-h"><h3 className="text-sm font-semibold">Premi 🎭 Espectacle</h3></div>
          <div className="card-b text-sm text-slate-700">
            {([...first, ...second].filter(r => r.spectacleAvg != null).sort((a,b)=> (b.spectacleAvg||0)-(a.spectacleAvg||0))[0]?.name) ?? 'Encara no hi ha valoracions'}
          </div>
        </div>
        <div className="card">
          <div className="card-h"><h3 className="text-sm font-semibold">Premi 🤝 Fair play</h3></div>
          <div className="card-b text-sm text-slate-700">
            {([...first, ...second].sort((a,b)=> (b.fairplay)-(a.fairplay))[0]?.name) ?? '—'}
          </div>
        </div>
        <div className="card">
          <div className="card-h"><h3 className="text-sm font-semibold">Ritme</h3></div>
          <div className="card-b text-sm text-slate-700">
            Registra una sessió a <span className="kbd">Registrar</span> (3 passos).
          </div>
        </div>
      </div>
    </AppShell>
  );
}
