'use client';

import { useState, useTransition } from 'react';
import { createPlayerAction, toggleActiveAction } from './actions';
import { useToast } from '@/components/ui/toast';

export default function PlayersClient({ players }) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [name, setName] = useState('');
  const [pin, setPin] = useState('');
  const [division, setDivision] = useState('SECOND');

  const onCreate = () => {
    startTransition(async () => {
      const fd = new FormData();
      fd.set('name', name);
      fd.set('pin', pin);
      fd.set('division', division);
      const res = await createPlayerAction(fd);
      if (res?.ok) {
        toast('Jugador creat ✅');
        window.location.reload();
      } else {
        toast(res?.message || 'Error', 'error');
      }
    });
  };

  const onToggle = (id) => {
    startTransition(async () => {
      await toggleActiveAction(id);
      toast('Actualitzat ✅');
      window.location.reload();
    });
  };

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="card">
        <div className="card-h">
          <h2 className="text-base font-semibold">Donar d’alta jugador</h2>
          <p className="text-sm text-slate-600">Nom + PIN de 4 dígits</p>
        </div>
        <div className="card-b space-y-3">
          <div>
            <label className="label">Nom</label>
            <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex: Sergi" />
          </div>
          <div>
            <label className="label">PIN (4 dígits)</label>
            <input className="input" value={pin} onChange={(e) => setPin(e.target.value)} inputMode="numeric" pattern="[0-9]*" placeholder="1234" />
          </div>
          <div>
            <label className="label">Divisió</label>
            <select className="input" value={division} onChange={(e) => setDivision(e.target.value)}>
              <option value="FIRST">1a</option>
              <option value="SECOND">2a</option>
            </select>
          </div>
          <button className="btn btn-primary w-full" disabled={isPending} type="button" onClick={onCreate}>
            {isPending ? 'Creant…' : 'Crear jugador'}
          </button>
        </div>
      </div>

      <div className="card">
        <div className="card-h">
          <h2 className="text-base font-semibold">Llista de jugadors</h2>
          <p className="text-sm text-slate-600">Pots desactivar algú si no juga</p>
        </div>
        <div className="card-b overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Nom</th>
                <th>Divisió</th>
                <th>Estat</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {players.map((p) => (
                <tr key={p.id}>
                  <td className="font-medium">{p.name}</td>
                  <td className="text-slate-600">{p.division === 'FIRST' ? '1a' : '2a'}</td>
                  <td className="text-slate-600">{p.active ? 'Actiu' : 'Inactiu'}</td>
                  <td className="text-right">
                    <button className="btn btn-ghost" disabled={isPending} onClick={() => onToggle(p.id)}>
                      {p.active ? 'Desactivar' : 'Activar'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
