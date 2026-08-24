import { useState } from "react";

export function useConfirm() {
  const [state, setState] = useState(null);

  function confirm({ title = "Please confirm", message = "Continue with this action?", confirmLabel = "Confirm" } = {}) {
    return new Promise((resolve) => {
      setState({ title, message, confirmLabel, resolve });
    });
  }

  const dialog = state ? (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/40 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <h2 className="text-lg font-black">{state.title}</h2>
        <p className="mt-2 text-sm text-slate-600">{state.message}</p>
        <div className="mt-6 flex justify-end gap-2">
          <button type="button" className="rounded-xl border px-4 py-2 text-sm font-bold" onClick={() => { state.resolve(false); setState(null); }}>Cancel</button>
          <button type="button" className="rounded-xl bg-slate-950 px-4 py-2 text-sm font-bold text-white" onClick={() => { state.resolve(true); setState(null); }}>{state.confirmLabel}</button>
        </div>
      </div>
    </div>
  ) : null;

  return { confirm, dialog };
}
