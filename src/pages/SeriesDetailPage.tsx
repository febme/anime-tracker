import { useState } from "react";
import {
  ArrowLeft,
  Minus,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  Clock,
  User,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import StatusBadge from "../components/StatusBadge";
import ProgressBar from "../components/ProgressBar";
import BatchEditModal from "../components/BatchEditModal";
import {
  AnimeSeries,
  COLUMNS,
  StatusValue,
  Episode,
  calcEpisodeProgress,
  calcSeriesProgress,
  progressColor,
  progressBarColor,
} from "../types";
import { useSeriesList } from "../hooks/useSeriesList";

interface Props {
  series: AnimeSeries;
  onBack: () => void;
}

function formatDate(ts?: number) {
  if (!ts) return "—";
  return new Date(ts).toLocaleString("tr-TR", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function SeriesDetailPage({ series, onBack }: Props) {
  const { user, isAdmin } = useAuth();
  const { updateEpisodeStatus, changeEpisodeCount, deleteSeries, batchUpdateEpisodes } =
    useSeriesList();
  const [delConfirm, setDelConfirm] = useState(false);
  const [collapsedRows, setCollapsedRows] = useState<Set<number>>(new Set());
  const [showBatchEdit, setShowBatchEdit] = useState(false);

  const userEmail = user?.email ?? "anonim";

  const handleStatusChange = async (
    epNum: number,
    field: string,
    value: StatusValue
  ) => {
    await updateEpisodeStatus(
      series.id,
      epNum,
      field,
      value,
      userEmail,
      series.episodes
    );
  };

  const handleEpisodeCountChange = async (delta: number) => {
    const newCount = series.episodeCount + delta;
    if (newCount < 1) return;
    await changeEpisodeCount(
      series.id,
      newCount,
      series.episodes,
      userEmail
    );
  };

  const handleDelete = async () => {
    await deleteSeries(series.id);
    onBack();
  };

  const toggleRow = (epNum: number) => {
    setCollapsedRows((prev) => {
      const next = new Set(prev);
      if (next.has(epNum)) next.delete(epNum);
      else next.add(epNum);
      return next;
    });
  };

  const seriesProgress = calcSeriesProgress(series.episodes, series.episodeCount);

  const getEpisode = (num: number): Episode => {
    return (
      series.episodes[num] ?? {
        id: num,
        status: {
          ceviri: "sifir",
          sonKontrol: "sifir",
          sonOkuma: "sifir",
          dizgi: "sifir",
          encode: "sifir",
          yayin: "sifir",
        },
      }
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-slate-900/90 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            {/* Sol */}
            <div className="flex items-center gap-3">
              <button
                onClick={onBack}
                className="flex items-center gap-1.5 text-slate-400 hover:text-white transition px-3 py-1.5 rounded-lg hover:bg-white/10"
              >
                <ArrowLeft className="w-4 h-4" />
                Geri
              </button>
              <div className="h-5 w-px bg-white/20" />
              <h1 className="text-xl font-bold text-white truncate max-w-xs md:max-w-none">
                {series.name}
              </h1>
              <span className="bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs px-2 py-1 rounded-lg">
                {series.episodeCount} Bölüm
              </span>
            </div>

            {/* Sağ */}
            <div className="flex items-center gap-3 flex-wrap">
              {/* Bölüm sayısı düzenleme */}
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2">
                <span className="text-xs text-slate-400">Bölüm:</span>
                <button
                  onClick={() => handleEpisodeCountChange(-1)}
                  disabled={series.episodeCount <= 1}
                  className="w-6 h-6 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition disabled:opacity-30"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="text-sm font-bold w-8 text-center">
                  {series.episodeCount}
                </span>
                <button
                  onClick={() => handleEpisodeCountChange(1)}
                  className="w-6 h-6 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>

              <button
                onClick={() => setShowBatchEdit(true)}
                className="ml-2 bg-white/5 hover:bg-white/10 text-slate-300 text-sm px-3 py-2 rounded-xl"
              >
                Toplu Düzenle
              </button>

              {/* Genel ilerleme */}
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2 min-w-[140px]">
                <span className="text-xs text-slate-400">Genel:</span>
                <ProgressBar value={seriesProgress} />
              </div>

              {/* Admin: Sil */}
              {isAdmin && (
                <>
                  {delConfirm ? (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-red-400">Emin misiniz?</span>
                      <button
                        onClick={handleDelete}
                        className="bg-red-600 hover:bg-red-500 text-white text-xs px-3 py-1.5 rounded-lg transition"
                      >
                        Evet, Sil
                      </button>
                      <button
                        onClick={() => setDelConfirm(false)}
                        className="bg-white/10 hover:bg-white/20 text-slate-300 text-xs px-3 py-1.5 rounded-lg transition"
                      >
                        İptal
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setDelConfirm(true)}
                      className="flex items-center gap-1.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 text-sm px-3 py-2 rounded-xl transition"
                    >
                      <Trash2 className="w-4 h-4" />
                      Seriyi Sil
                    </button>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Son düzenleyen */}
          {series.lastModifiedBy && (
            <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <User className="w-3 h-3" />
                Son düzenleyen: {series.lastModifiedBy}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {formatDate(series.lastModifiedAt)}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Tablo */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Desktop tablo */}
        <div className="hidden lg:block overflow-x-auto rounded-2xl border border-white/10 shadow-xl">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-800/80 border-b border-white/10">
                <th className="text-left px-4 py-3 text-slate-400 font-medium w-20">
                  Bölüm
                </th>
                {COLUMNS.map((col) => (
                  <th
                    key={col.key}
                    className="text-center px-3 py-3 text-slate-400 font-medium"
                  >
                    {col.label}
                  </th>
                ))}
                <th className="text-center px-4 py-3 text-slate-400 font-medium w-36">
                  İlerleme
                </th>
                <th className="text-left px-3 py-3 text-slate-400 font-medium text-xs w-40">
                  Son Değiştiren
                </th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: series.episodeCount }, (_, i) => i + 1).map(
                (epNum) => {
                  const ep = getEpisode(epNum);
                  const pct = calcEpisodeProgress(ep.status);
                  const isComplete = pct === 100;
                  return (
                    <tr
                      key={epNum}
                      className={`border-b border-white/5 transition-colors ${
                        isComplete
                          ? "bg-emerald-500/5"
                          : "hover:bg-white/5"
                      }`}
                    >
                      <td className="px-4 py-3">
                        <span className="font-bold text-white">
                          {String(epNum).padStart(2, "0")}
                        </span>
                      </td>
                      {COLUMNS.map((col) => (
                        <td key={col.key} className="px-3 py-3 text-center">
                          <div className="flex justify-center">
                            <StatusBadge
                              value={ep.status[col.key]}
                              onChange={(val) =>
                                handleStatusChange(epNum, col.key, val)
                              }
                            />
                          </div>
                        </td>
                      ))}
                      <td className="px-4 py-3">
                        <ProgressBar value={pct} />
                      </td>
                      <td className="px-3 py-3 text-xs text-slate-500 truncate max-w-[160px]">
                        {ep.lastModifiedBy ? (
                          <div>
                            <div className="text-slate-400 truncate">{ep.lastModifiedBy}</div>
                            <div className="text-slate-600">{formatDate(ep.lastModifiedAt)}</div>
                          </div>
                        ) : "—"}
                      </td>
                    </tr>
                  );
                }
              )}

              {/* Genel özet satırı */}
              <tr className="bg-slate-800 border-t-2 border-white/20">
                <td className="px-4 py-4">
                  <span className="font-bold text-purple-300 text-xs uppercase tracking-wider">
                    Genel
                  </span>
                </td>
                {COLUMNS.map((col) => {
                  const counts = { tamam: 0, yarim: 0, eksik: 0, sifir: 0 };
                  for (let i = 1; i <= series.episodeCount; i++) {
                    const ep = getEpisode(i);
                    counts[ep.status[col.key]]++;
                  }
                  const pct = Math.round(
                    ((counts.tamam * 100 +
                      counts.yarim * 50 +
                      counts.eksik * 25) /
                      series.episodeCount)
                  );
                  return (
                    <td key={col.key} className="px-3 py-4 text-center">
                      <div className="flex flex-col items-center gap-1">
                        <span className={`text-sm font-bold ${progressColor(pct)}`}>
                          %{pct}
                        </span>
                        <div className="w-12 h-1 bg-white/10 rounded-full overflow-hidden">
                          <div
                            className={`h-1 rounded-full ${progressBarColor(pct)}`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    </td>
                  );
                })}
                <td className="px-4 py-4">
                  <ProgressBar value={seriesProgress} />
                </td>
                <td className="px-3 py-4 text-xs text-slate-500">
                  {series.episodeCount} bölüm
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Mobile / Tablet kart görünümü */}
        <div className="lg:hidden space-y-3">
          {/* Genel özet kartı */}
          <div className="bg-slate-800 border border-white/10 rounded-2xl p-4 mb-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-bold text-purple-300 uppercase tracking-wider">
                Genel Durum
              </span>
              <span className={`text-xl font-black ${progressColor(seriesProgress)}`}>
                %{seriesProgress}
              </span>
            </div>
            <ProgressBar value={seriesProgress} />
            <div className="grid grid-cols-3 gap-2 mt-3">
              {COLUMNS.map((col) => {
                const counts = { tamam: 0, yarim: 0, eksik: 0, sifir: 0 };
                for (let i = 1; i <= series.episodeCount; i++) {
                  const ep = getEpisode(i);
                  counts[ep.status[col.key]]++;
                }
                const pct = Math.round(
                  ((counts.tamam * 100 + counts.yarim * 50 + counts.eksik * 25) /
                    series.episodeCount)
                );
                return (
                  <div key={col.key} className="bg-white/5 rounded-xl p-2 text-center">
                    <div className="text-xs text-slate-400">{col.label}</div>
                    <div className={`text-sm font-bold ${progressColor(pct)}`}>
                      %{pct}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bölüm kartları */}
          {Array.from({ length: series.episodeCount }, (_, i) => i + 1).map(
            (epNum) => {
              const ep = getEpisode(epNum);
              const pct = calcEpisodeProgress(ep.status);
              const isCollapsed = collapsedRows.has(epNum);
              return (
                <div
                  key={epNum}
                  className={`border rounded-2xl overflow-hidden ${
                    pct === 100
                      ? "border-emerald-500/30 bg-emerald-500/5"
                      : "border-white/10 bg-slate-800/50"
                  }`}
                >
                  <button
                    onClick={() => toggleRow(epNum)}
                    className="w-full flex items-center justify-between px-4 py-3"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-white">
                        Bölüm {String(epNum).padStart(2, "0")}
                      </span>
                      <ProgressBar value={pct} />
                    </div>
                    {isCollapsed ? (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronUp className="w-4 h-4 text-slate-400" />
                    )}
                  </button>
                  {!isCollapsed && (
                    <div className="px-4 pb-4 grid grid-cols-2 gap-3">
                      {COLUMNS.map((col) => (
                        <div
                          key={col.key}
                          className="flex items-center justify-between bg-white/5 rounded-xl px-3 py-2"
                        >
                          <span className="text-xs text-slate-400">
                            {col.label}
                          </span>
                          <StatusBadge
                            value={ep.status[col.key]}
                            onChange={(val) =>
                              handleStatusChange(epNum, col.key, val)
                            }
                          />
                        </div>
                      ))}
                      {ep.lastModifiedBy && (
                        <div className="col-span-2 text-xs text-slate-500 mt-1 flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {ep.lastModifiedBy} · {formatDate(ep.lastModifiedAt)}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            }
          )}
        </div>
      </div>
      {showBatchEdit && (
        <BatchEditModal
          episodeCount={series.episodeCount}
          onClose={() => setShowBatchEdit(false)}
          onApply={async (start, end, field, value) => {
            await batchUpdateEpisodes(series.id, start, end, field, value, userEmail, series.episodes);
          }}
        />
      )}
    </div>
  );
}
