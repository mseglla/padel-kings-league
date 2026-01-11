'use client';

import { useMemo, useState, useTransition } from 'react';
import { createMatchAction } from '../actions';
import { useToast } from '@/components/ui/toast';

function StepHeader({ step, total }) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <span className="badge">Pas {step} / {total}</span>
      <span className="text-xs text-slate-500">30 segons i llest</span>
    </div>
  );
}

function PlayerPicker({ players, selected, onToggle, disabledIds }) {
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {players.map((p) => {
        const isSel = selected.includes(p.id);
        const disabled = !isSel && selected.length >= 4;
        const hardDisabled = disabledIds?.includes(p.id);
        return (
          <button
            key={p.id}
            type="button"
            disabled={disabled || hardDisabled}
            onClick={() => onToggle(p.id)}
            className={`btn ${isSel ? 'btn-primary' : 'btn-secondary'} w-full justify-between ${hardDisabled ? 'opacity-50' : ''}`}
          >
            <span>{p.name}</span>
            <span className="text-xs opacity-80">{isSel ? 'Seleccionat' : 'Tocar'}</span>
          </button>
        );
      })}
    </div>
  );
}

function TeamAssign({ playersMap, selected, teamA, setTeamA, teamB, setTeamB }) {
  const remaining = selected.filter((id) => !teamA.includes(id) && !teamB.includes(id));

  const toggleA = (id) => {
    if (teamA.includes(id)) setTeamA(teamA.filter(x => x !== id));
    else if (teamA.length < 2) setTeamA([...teamA, id]);
  };
  const toggleB = (id) => {
    if (teamB.includes(id)) setTeamB(teamB.filter(x => x !== id));
    else if (teamB.length < 2) setTeamB([...teamB, id]);
  };

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="card">
        <div className="card-h flex items-center justify-between">
          <h3 className="text-sm font-semibold">Equip A</h3>
          <span className="badge">{teamA.length}/2</span>
        </div>
        <div className="card-b space-y-2">
          {selected.map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => toggleA(id)}
              disabled={!teamA.includes(id) && teamA.length >= 2 && !teamB.includes(id)}
              className={`btn ${teamA.includes(id) ? 'btn-primary' : 'btn-secondary'} w-full justify-between`}
            >
              <span>{playersMap[id]}</span>
              <span className="text-xs opacity-80">{teamA.includes(id) ? 'A' : ''}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="card-h flex items-center justify-between">
          <h3 className="text-sm font-semibold">Equip B</h3>
          <span className="badge">{teamB.length}/2</span>
        </div>
        <div className="card-b space-y-2">
          {selected.map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => toggleB(id)}
              disabled={!teamB.includes(id) && teamB.length >= 2 && !teamA.includes(id)}
              className={`btn ${teamB.includes(id) ? 'btn-primary' : 'btn-secondary'} w-full justify-between`}
            >
              <span>{playersMap[id]}</span>
              <span className="text-xs opacity-80">{teamB.includes(id) ? 'B' : ''}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="lg:col-span-2 text-sm text-slate-600">
        Tip: primer selecciona 4 jugadors. Després assigna 2 i 2.
      </div>
    </div>
  );
}

export default function Wizard({ players }) {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [selected, setSelected] = useState([]);
  const [teamA, setTeamA] = useState([]);
  const [teamB, setTeamB] = useState([]);
  const [setsA, setSetsA] = useState(0);
  const [setsB, setSetsB] = useState(0);
  const [spectacle, setSpectacle] = useState('');
  const [gomets, setGomets] = useState({});
  const [isPending, startTransition] = useTransition();

  const playersMap = useMemo(() => Object.fromEntries(players.map(p => [p.id, p.name])), [players]);

  const toggleSelected = (id) => {
    setSelected((s) => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
  };

  const canNext1 = selected.length === 4;
  const canNext2 = teamA.length === 2 && teamB.length === 2;

  const onSubmit = () => {
    startTransition(async () => {
      try {
        const res = await createMatchAction({
          aPlayers: teamA,
          bPlayers: teamB,
          setsA,
          setsB,
          spectacleRating: spectacle ? Number(spectacle) : null,
          gometsByPlayerId: gomets
        });
        if (res?.ok) {
          toast('Sessió guardada ✅');
          window.location.href = '/dashboard';
        }
      } catch (e) {
        toast(e?.message || 'Error guardant la sessió', 'error');
      }
    });
  };

  const toggleGomet = (playerId, value) => {
    setGomets((g) => {
      const current = g[playerId] || null;
      const next = current === value ? null : value;
      return { ...g, [playerId]: next };
    });
  };

  return (
    <div className="space-y-4">
      <StepHeader step={step} total={3} />

      {step === 1 ? (
        <div className="card">
          <div className="card-h">
            <h2 className="text-base font-semibold">1) Tria 4 jugadors</h2>
            <p className="text-sm text-slate-600">Toca per seleccionar. Quan n’hi hagi 4, continua.</p>
          </div>
          <div className="card-b space-y-4">
            <PlayerPicker players={players} selected={selected} onToggle={toggleSelected} />
            <div className="flex justify-end gap-2">
              <button className="btn btn-secondary" type="button" onClick={() => { setSelected([]); setTeamA([]); setTeamB([]); }}>Netejar</button>
              <button className={`btn ${canNext1 ? 'btn-primary' : 'btn-secondary'}`} disabled={!canNext1} type="button" onClick={() => setStep(2)}>
                Continua
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {step === 2 ? (
        <div className="space-y-4">
          <TeamAssign playersMap={playersMap} selected={selected} teamA={teamA} setTeamA={setTeamA} teamB={teamB} setTeamB={setTeamB} />
          <div className="flex justify-between gap-2">
            <button className="btn btn-secondary" type="button" onClick={() => setStep(1)}>Enrere</button>
            <button className={`btn ${canNext2 ? 'btn-primary' : 'btn-secondary'}`} disabled={!canNext2} type="button" onClick={() => setStep(3)}>
              Continua
            </button>
          </div>
        </div>
      ) : null}

      {step === 3 ? (
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="card">
            <div className="card-h">
              <h2 className="text-base font-semibold">3) Resultat (sets)</h2>
              <p className="text-sm text-slate-600">0–3 per equip</p>
            </div>
            <div className="card-b space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">Equip A ({playersMap[teamA[0]]} + {playersMap[teamA[1]]})</label>
                  <input className="input" type="number" min={0} max={3} value={setsA} onChange={(e) => setSetsA(Number(e.target.value))} />
                </div>
                <div>
                  <label className="label">Equip B ({playersMap[teamB[0]]} + {playersMap[teamB[1]]})</label>
                  <input className="input" type="number" min={0} max={3} value={setsB} onChange={(e) => setSetsB(Number(e.target.value))} />
                </div>
              </div>
              <div>
                <label className="label">Espectacle ⭐ (opcional)</label>
                <select className="input" value={spectacle} onChange={(e) => setSpectacle(e.target.value)}>
                  <option value="">—</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-h">
              <h2 className="text-base font-semibold">Gomets</h2>
              <p className="text-sm text-slate-600">Màxim 1 per jugador (verd o vermell)</p>
            </div>
            <div className="card-b space-y-3">
              {[...teamA, ...teamB].map((id) => (
                <div key={id} className="flex items-center justify-between gap-2">
                  <div className="text-sm font-medium">{playersMap[id]}</div>
                  <div className="flex gap-2">
                    <button type="button" className={`btn ${gomets[id] === 'GREEN' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => toggleGomet(id, 'GREEN')}>🟢</button>
                    <button type="button" className={`btn ${gomets[id] === 'RED' ? 'btn-danger' : 'btn-secondary'}`} onClick={() => toggleGomet(id, 'RED')}>🔴</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2 flex justify-between gap-2">
            <button className="btn btn-secondary" type="button" onClick={() => setStep(2)}>Enrere</button>
            <button className="btn btn-primary" disabled={isPending} type="button" onClick={onSubmit}>
              {isPending ? 'Guardant…' : 'Guardar sessió'}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
