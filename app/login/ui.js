'use client';

import { useFormState } from 'react-dom';
import { loginAction } from './actions';

function SubmitButton() {
  return (
    <button type="submit" className="btn btn-primary w-full">
      Entrar
    </button>
  );
}

export default function LoginForm({ players }) {
  const [state, formAction] = useFormState(async (_prev, formData) => {
    try {
      const res = await loginAction(formData);
      return res || { ok: true };
    } catch (e) {
      return { ok: false, message: e?.message || 'Error inesperat.' };
    }
  }, { ok: true });

  return (
    <div className="card">
      <div className="card-h">
        <h2 className="text-base font-semibold">Accés</h2>
      </div>
      <div className="card-b">
        <form action={formAction} className="space-y-4">
          <div>
            <label className="label">Jugador</label>
            <select name="name" className="input" defaultValue={players[0] || ''}>
              {players.map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">PIN</label>
            <input name="pin" className="input" inputMode="numeric" pattern="[0-9]*" placeholder="4 dígits" />
          </div>
          {state?.ok === false ? (
            <div className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
              {state.message}
            </div>
          ) : null}
          <SubmitButton />
        </form>
      </div>
    </div>
  );
}
