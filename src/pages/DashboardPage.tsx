import { useState, useMemo } from "react";
import {
  Search,
  Plus,
  Tv2,
  LogOut,
  User,
  Loader2,
  ChevronRight,
  Clock,
  Star,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useSeriesList } from "../hooks/useSeriesList";
import AddSeriesModal from "../components/AddSeriesModal";
import ProgressBar from "../components/ProgressBar";
import SeriesDetailPage from "./SeriesDetailPage";
import { AnimeSeries, calcSeriesProgress, progressColor } from "../types";

// DnD removed: using up/down buttons for ordering

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

export default function DashboardPage() {
  const { user, isAdmin, logout } = useAuth();
  const { series, loading, error, addSeries, moveSeries } = useSeriesList();
  const [showAddModal, setShowAddModal] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedSeries, setSelectedSeries] = useState<AnimeSeries | null>(null);

  const userEmail = user?.email ?? "";

  const filtered = useMemo(() => {
    if (!search.trim()) return series;
    const q = search.toLowerCase();
    return series.filter((s) => s.name.toLowerCase().includes(q));
  }, [series, search]);

  const handleAdd = async (name: string, episodeCount: number) => {
    await addSeries(name, episodeCount, userEmail);
  };

  // Eğer bir seri seçildiyse, o serinin detay sayfasını göster
  // Realtime güncelleme için series listesinden güncel veriyi al
  if (selectedSeries) {
    const liveSeries = series.find((s) => s.id === selectedSeries.id);
    return (
      <SeriesDetailPage
        series={liveSeries ?? selectedSeries}
        onBack={() => setSelectedSeries(null)}
      />
    );
  }

  const totalSeries = series.length;
  const completedSeries = series.filter(
    (s) => calcSeriesProgress(s.episodes, s.episodeCount) === 100
  ).length;
  const inProgressSeries = series.filter((s) => {
    const p = calcSeriesProgress(s.episodes, s.episodeCount);
    return p > 0 && p < 100;
  }).length;

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Navbar */}
      <header className="sticky top-0 z-20 bg-slate-900/90 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg">
              <Tv2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-bold text-white text-lg leading-none block">
                AniTrack
              </span>
              <span className="text-xs text-slate-500 leading-none">
                Anime Çeviri Takip
              </span>
            </div>
          </div>

          {/* Arama */}
          <div className="flex-1 max-w-md relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Seri ara…"
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
            />
          </div>

          {/* Sağ */}
          <div className="flex items-center gap-3">
            {/* Yeni seri */}
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white text-sm font-medium px-4 py-2 rounded-xl transition shadow-lg shadow-purple-900/30"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Yeni Seri</span>
            </button>

            {/* Kullanıcı */}
            <div className="flex items-center gap-2">
              {user?.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName ?? ""}
                  className="w-8 h-8 rounded-full border border-white/20"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-slate-700 border border-white/20 flex items-center justify-center">
                  <User className="w-4 h-4 text-slate-400" />
                </div>
              )}
              <div className="hidden md:block">
                <div className="text-xs font-medium text-white leading-none">
                  {user?.displayName ?? userEmail}
                </div>
                {isAdmin && (
                  <div className="text-xs text-purple-400 leading-none mt-0.5">
                    Admin
                  </div>
                )}
              </div>
              <button
                onClick={logout}
                className="ml-1 text-slate-500 hover:text-red-400 transition"
                title="Çıkış Yap"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* İçerik */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Özet istatistikler */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            {
              label: "Toplam Seri",
              value: totalSeries,
              icon: "📺",
              color: "from-purple-500/20 to-indigo-500/20 border-purple-500/20",
            },
            {
              label: "Devam Eden",
              value: inProgressSeries,
              icon: "⏳",
              color: "from-yellow-500/20 to-orange-500/20 border-yellow-500/20",
            },
            {
              label: "Tamamlanan",
              value: completedSeries,
              icon: "✅",
              color: "from-emerald-500/20 to-teal-500/20 border-emerald-500/20",
            },
            {
              label: "Bekleyen",
              value: totalSeries - completedSeries - inProgressSeries,
              icon: "⬜",
              color: "from-slate-500/20 to-slate-600/20 border-slate-500/20",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className={`bg-gradient-to-br ${stat.color} border rounded-2xl p-4`}
            >
              <div className="text-2xl mb-1">{stat.icon}</div>
              <div className="text-2xl font-black text-white">{stat.value}</div>
              <div className="text-xs text-slate-400">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Başlık */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white">
            {search ? (
              <>
                <span className="text-purple-400">"{search}"</span> araması —{" "}
                {filtered.length} sonuç
              </>
            ) : (
              "Tüm Seriler"
            )}
          </h2>
        </div>

        {/* Liste */}
        {error ? (
          <div className="flex items-center justify-center py-20">
            <div className="bg-red-800/30 border border-red-700/40 text-red-200 rounded-2xl p-6 max-w-xl text-center">
              <div className="font-semibold mb-2">Veritabanı hatası</div>
              <div className="text-sm mb-3">{error}</div>
              <div className="text-xs text-slate-300">Check your Firebase rules, and ensure the authenticated user is allowed to read/write.</div>
            </div>
          </div>
        ) : loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🎌</div>
            <p className="text-slate-400 text-lg font-medium">
              {search ? "Arama sonucu bulunamadı." : "Henüz seri eklenmemiş."}
            </p>
            {!search && (
              <button
                onClick={() => setShowAddModal(true)}
                className="mt-4 flex items-center gap-2 mx-auto bg-purple-600 hover:bg-purple-500 text-white px-5 py-2.5 rounded-xl transition"
              >
                <Plus className="w-4 h-4" />
                İlk Seriyi Ekle
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((s) => {
              const pct = calcSeriesProgress(s.episodes, s.episodeCount);
              const isComplete = pct === 100;
              const completedEps = Object.values(s.episodes).filter(
                (ep) => ep && ep.status && Object.values(ep.status).every((v) => v === "tamam")
              ).length;

              return (
                <button
                  key={s.id}
                  onClick={() => setSelectedSeries(s)}
                  className={`group text-left bg-slate-900 hover:bg-slate-800 border rounded-2xl p-5 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-purple-900/20 ${
                    isComplete ? "border-emerald-500/30" : "border-white/10"
                  } cursor-pointer`}
                >
                  {/* Başlık */}
                  <div className="flex items-start justify-between gap-2 mb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{isComplete ? "✅" : "📺"}</span>
                        <h3 className="font-bold text-white group-hover:text-purple-300 transition leading-tight">
                          {s.name}
                        </h3>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-slate-500">
                          {s.episodeCount} bölüm
                        </span>
                        <span className="text-slate-700">·</span>
                        <span className="text-xs text-slate-500">
                          {completedEps}/{s.episodeCount} tamamlandı
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          moveSeries(s.id, -1);
                        }}
                        title="Move up"
                        className="w-7 h-7 rounded-md bg-white/5 hover:bg-white/10 flex items-center justify-center"
                      >
                        <ChevronUp className="w-3 h-3 text-slate-300" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          moveSeries(s.id, 1);
                        }}
                        title="Move down"
                        className="w-7 h-7 rounded-md bg-white/5 hover:bg-white/10 flex items-center justify-center"
                      >
                        <ChevronDown className="w-3 h-3 text-slate-300" />
                      </button>
                      <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-purple-400 flex-shrink-0 mt-0.5 transition" />
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs text-slate-500">İlerleme</span>
                      <span className={`text-sm font-bold ${progressColor(pct)}`}>
                        %{pct}
                      </span>
                    </div>
                    <ProgressBar value={pct} showLabel={false} />
                  </div>

                  {/* Mini istat */}
                  <div className="flex items-center justify-between text-xs text-slate-600">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{formatDate(s.lastModifiedAt)}</span>
                    </div>
                    {s.lastModifiedBy && (
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3" />
                        <span className="truncate max-w-[120px]">
                          {s.lastModifiedBy.split("@")[0]}
                        </span>
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </main>

      {/* Modal */}
      {showAddModal && (
        <AddSeriesModal
          onClose={() => setShowAddModal(false)}
          onAdd={handleAdd}
        />
      )}
    </div>
  );
}
