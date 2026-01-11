'use client';

import { createContext, useCallback, useContext, useMemo, useState } from 'react';

const ConfirmContext = createContext(null);

export function ConfirmProvider({ children }) {
  const [state, setState] = useState(null);

  const confirm = useCallback((options) => {
    return new Promise((resolve) => {
      setState({ ...options, resolve });
    });
  }, []);

  const value = useMemo(() => ({ confirm }), [confirm]);

  return (
    <ConfirmContext.Provider value={value}>
      {children}
      {state ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
          <div className="card w-full max-w-md">
            <div className="card-h">
              <div className="text-base font-semibold">{state.title || 'Confirmació'}</div>
              {state.description ? (
                <div className="mt-1 text-sm text-slate-600">{state.description}</div>
              ) : null}
            </div>
            <div className="card-b flex justify-end gap-2">
              <button
                className="btn btn-secondary"
                onClick={() => {
                  state.resolve(false);
                  setState(null);
                }}
              >
                Cancel·lar
              </button>
              <button
                className={`btn ${state.danger ? 'btn-danger' : 'btn-primary'}`}
                onClick={() => {
                  state.resolve(true);
                  setState(null);
                }}
              >
                {state.confirmText || 'Confirmar'}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </ConfirmContext.Provider>
  );
}

export function useConfirm() {
  const ctx = useContext(ConfirmContext);
  if (!ctx) throw new Error('useConfirm must be used inside ConfirmProvider');
  return ctx;
}
