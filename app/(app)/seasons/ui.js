'use client';

import { useState, useTransition } from 'react';
import { closeSeasonAction } from './actions';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { useToast } from '@/components/ui/toast';

function fmt(d) {
  return new Date(d).toLocaleDateString('ca-ES');
}

export default function SeasonsClient({ seasons }) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const active = seasons.find(s => s.status === 'ACTIVE');

  const onClose = () => {
    startTransition(async () => {
      try {
        const res = await closeSeasonAction();
        toast('Temporada tancada ✅');
        if (res?.promote || res?.relegate) {
          toast(`Ascens: ${res.promote ?? '—'} · Descens: ${res.relegate ?? '—'}`);
        }
        window.location.reload();
      } catch (e) {
        toast(e?.message || 'Error tancant temporada', 'error');
      }
    });
  };

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="card">
        <div className="card-h">
          <h2 className="text-base font-semibold">Temporada activa</h2>
          <p className="text-sm text-slate-600">Trimestral · puja #1 de 2a i baixa #3 de 1a (mínim 4 partits)</p>
        </div>
        <div className="card-b space-y-3">
          {active ? (
            <>
              <div className="text-sm">
                <div className="font-medium">{active.name}</div>
                <div className="text-slate-600">{fmt(active.startDate)} → {fmt(active.endDate)}</div>
              </div>
              <button className="btn btn-danger" disabled={isPending} type="button" onClick={() => setOpen(true)}>
                {isPending ? 'Tancant…' : 'Tancar temporada'}
              </button>
              <ConfirmDialog
                open={open}
                title="Tancar temporada"
                description="Això tancarà el trimestre, aplicarà ascens/descens i crearà la següent temporada activa."
                confirmText={isPending ? 'Tancant…' : 'Tancar'}
                onCancel={() => setOpen(false)}
                onConfirm={() => { setOpen(false); onClose(); }}
              />
            </>
          ) : (
            <div className="text-sm text-slate-600">No hi ha temporada activa.</div>
          )}
        </div>
      </div>

      <div className="card">
        <div className="card-h">
          <h2 className="text-base font-semibold">Històric</h2>
          <p className="text-sm text-slate-600">Últimes temporades</p>
        </div>
        <div className="card-b overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Nom</th>
                <th>Dates</th>
                <th>Estat</th>
              </tr>
            </thead>
            <tbody>
              {seasons.map((s) => (
                <tr key={s.id}>
                  <td className="font-medium">{s.name}</td>
                  <td className="text-slate-600">{fmt(s.startDate)} → {fmt(s.endDate)}</td>
                  <td className="text-slate-600">{s.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
