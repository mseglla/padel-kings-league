'use client';

import { useState, useTransition } from 'react';
import { deleteMatchAction } from './actions';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { useToast } from '@/components/ui/toast';

function formatDate(d) {
  try {
    return new Date(d).toLocaleString('ca-ES', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  } catch {
    return '—';
  }
}

export default function MatchesTable({ matches }) {
  const { toast } = useToast();
  const [openId, setOpenId] = useState(null);
  const [isPending, startTransition] = useTransition();

  const onDelete = (id) => {
    startTransition(async () => {
      await deleteMatchAction(id);
      toast('Sessió esborrada ✅');
      // simplest refresh
      window.location.reload();
    });
  };

  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th>Data</th>
              <th>Equips</th>
              <th>Sets</th>
              <th>⭐</th>
              <th>Registrat per</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {matches.length === 0 ? (
              <tr><td colSpan={6} className="text-slate-600">Encara no hi ha sessions en aquesta temporada.</td></tr>
            ) : null}
            {matches.map((m) => {
              const A = m.players.filter(p => p.team === 'A').map(p => p.player.name).join(' + ');
              const B = m.players.filter(p => p.team === 'B').map(p => p.player.name).join(' + ');
              return (
                <tr key={m.id}>
                  <td className="text-slate-600 whitespace-nowrap">{formatDate(m.playedAt)}</td>
                  <td className="font-medium">{A} <span className="text-slate-400">vs</span> {B}</td>
                  <td className="text-slate-600">{m.setsA}–{m.setsB}</td>
                  <td className="text-slate-600">{m.spectacleRating ?? '—'}</td>
                  <td className="text-slate-600">{m.createdBy?.name ?? '—'}</td>
                  <td className="text-right">
                    <button className="btn btn-ghost" disabled={isPending} onClick={() => setOpenId(m.id)}>
                      Esborrar
                    </button>
                    <ConfirmDialog
                      open={openId === m.id}
                      title="Esborrar sessió"
                      description="Això eliminarà la sessió i recalcularà la classificació."
                      confirmText={isPending ? 'Esborrant…' : 'Esborrar'}
                      onCancel={() => setOpenId(null)}
                      onConfirm={() => { setOpenId(null); onDelete(m.id); }}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
