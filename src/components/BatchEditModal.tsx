import React, { useState } from "react";
import { X } from "lucide-react";
import { COLUMNS, StatusValue, STATUS_LABELS } from "../types";

interface Props {
  onClose: () => void;
  onApply: (
    start: number,
    end: number,
    field: keyof typeof COLUMNS[number] | string,
    value: StatusValue
  ) => Promise<void>;
  episodeCount: number;
}

export default function BatchEditModal({ onClose, onApply, episodeCount }: Props) {
  const [start, setStart] = useState(1);
  const [end, setEnd] = useState(Math.min(12, episodeCount));
  const [field, setField] = useState<COLUMNS[number]["key"]>(COLUMNS[0].key);
  const [value, setValue] = useState<StatusValue>("tamam");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (start < 1 || end < start || end > episodeCount) {
      setError("Geçersiz aralık");
      return;
    }
    setLoading(true);
    try {
      await onApply(start, end, field, value);
      onClose();
    } catch (err) {
      setError("Güncellenirken hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-slate-900 border border-white/10 rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 className="text-lg font-semibold text-white">Toplu Düzenleme</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm text-slate-300 mb-2">Aralık</label>
            <div className="flex gap-2">
              <input
                type="number"
                min={1}
                max={episodeCount}
                value={start}
                onChange={(e) => setStart(Number(e.target.value))}
                className="w-20 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white"
              />
              <div className="flex items-center text-slate-400">—</div>
              <input
                type="number"
                min={1}
                max={episodeCount}
                value={end}
                onChange={(e) => setEnd(Number(e.target.value))}
                className="w-20 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white"
              />
            </div>
            <p className="text-xs text-slate-500 mt-1">1-{episodeCount} arası</p>
          </div>

          <div>
            <label className="block text-sm text-slate-300 mb-2">Alan</label>
            <select
              value={field}
              onChange={(e) => setField(e.target.value)}
              className="w-full bg-slate-900/90 border border-white/10 rounded-xl px-3 py-2 text-white appearance-none focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/25"
            >
              {COLUMNS.map((c) => (
                <option key={c.key} value={c.key} className="bg-slate-900 text-white">
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-slate-300 mb-2">Durum</label>
            <select
              value={value}
              onChange={(e) => setValue(e.target.value as StatusValue)}
              className="w-full bg-slate-900/90 border border-white/10 rounded-xl px-3 py-2 text-white appearance-none focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/25"
            >
              {Object.entries(STATUS_LABELS).map(([k, label]) => (
                <option key={k} value={k} className="bg-slate-900 text-white">
                  {label}
                </option>
              ))}
            </select>
          </div>

          {error && <div className="text-sm text-red-400">{error}</div>}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 rounded-xl px-4 py-3"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-purple-600 hover:bg-purple-500 text-white rounded-xl px-4 py-3"
            >
              {loading ? "Uygulanıyor…" : "Uygula"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
