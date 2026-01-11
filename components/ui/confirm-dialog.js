'use client';

export function ConfirmDialog({ open, title = 'Confirmar', description, confirmText = 'Confirmar', cancelText = 'Cancel·lar', onConfirm, onCancel }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
      <div className="card w-full max-w-md">
        <div className="card-h">
          <h2 className="text-base font-semibold">{title}</h2>
        </div>
        <div className="card-b space-y-4">
          {description ? <p className="text-sm text-slate-700">{description}</p> : null}
          <div className="flex justify-end gap-2">
            <button className="btn btn-secondary" onClick={onCancel}>{cancelText}</button>
            <button className="btn btn-danger" onClick={onConfirm}>{confirmText}</button>
          </div>
        </div>
      </div>
    </div>
  );
}
