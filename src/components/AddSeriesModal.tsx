import { useState } from "react";
import { X, PlusCircle, Tv2 } from "lucide-react";

interface Props {
  onClose: () => void;
  onAdd: (name: string, episodeCount: number) => Promise<void>;
}

export default function AddSeriesModal({ onClose, onAdd }: Props) {
  const [name, setName] = useState("");
  const [episodeCount, setEpisodeCount] = useState(12);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Seri adı boş olamaz.");
      return;
    }
    if (episodeCount < 1 || episodeCount > 200) {
      setError("Bölüm sayısı 1-200 arasında olmalı.");
      return;
    }
    setLoading(true);
    try {
      await onAdd(name.trim(), episodeCount);
      onClose();
    } catch {
      setError("Eklenirken hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-slate-900 border border-white/10 rounded-2xl shadow-2xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center">
              <Tv2 className="w-5 h-5 text-purple-400" />
            </div>
            <h2 className="text-lg font-semibold text-white">Yeni Seri Ekle</h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Seri Adı
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="örn. Sword Art Online"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Bölüm Sayısı
            </label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setEpisodeCount((c) => Math.max(1, c - 1))}
                className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 transition text-xl font-bold flex items-center justify-center"
              >
                −
              </button>
              <input
                type="number"
                min={1}
                max={200}
                value={episodeCount}
                onChange={(e) => setEpisodeCount(Number(e.target.value))}
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-center focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
              />
              <button
                type="button"
                onClick={() => setEpisodeCount((c) => Math.min(200, c + 1))}
                className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 transition text-xl font-bold flex items-center justify-center"
              >
                +
              </button>
            </div>
            <p className="text-xs text-slate-500 mt-1 text-center">
              Sonradan artırılıp azaltılabilir
            </p>
          </div>

          {error && (
            <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl p-3">
              {error}
            </p>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 rounded-xl px-4 py-3 transition"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl px-4 py-3 font-medium transition disabled:opacity-50"
            >
              <PlusCircle className="w-4 h-4" />
              {loading ? "Ekleniyor…" : "Seri Ekle"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
