export type StatusValue = "tamam" | "yarim" | "eksik" | "sifir";

export interface EpisodeStatus {
  ceviri: StatusValue;
  sonKontrol: StatusValue;
  sonOkuma: StatusValue;
  dizgi: StatusValue;
  encode: StatusValue;
  yayin: StatusValue;
}

export interface Episode {
  id: number; // bölüm numarası (1-based)
  status: EpisodeStatus;
  lastModifiedBy?: string;
  lastModifiedAt?: number;
}

export interface AnimeSeries {
  id: string;
  name: string;
  episodeCount: number;
  episodes: Record<number, Episode>; // key = bölüm no
  createdBy: string;
  createdAt: number;
  lastModifiedBy?: string;
  lastModifiedAt?: number;
}

export const COLUMNS: { key: keyof EpisodeStatus; label: string }[] = [
  { key: "ceviri", label: "Çeviri" },
  { key: "sonKontrol", label: "Son Kontrol" },
  { key: "sonOkuma", label: "Son Okuma" },
  { key: "dizgi", label: "Dizgi" },
  { key: "encode", label: "Encode" },
  { key: "yayin", label: "Yayın" },
];

export const STATUS_WEIGHTS: Record<StatusValue, number> = {
  tamam: 100,
  yarim: 50,
  eksik: 25,
  sifir: 0,
};

export const STATUS_LABELS: Record<StatusValue, string> = {
  tamam: "Tamam",
  yarim: "Yarım",
  eksik: "Eksik",
  sifir: "Sıfır",
};

export const STATUS_COLORS: Record<StatusValue, string> = {
  tamam: "bg-emerald-500",
  yarim: "bg-yellow-400",
  eksik: "bg-orange-400",
  sifir: "bg-slate-300",
};

export const STATUS_TEXT_COLORS: Record<StatusValue, string> = {
  tamam: "text-emerald-700",
  yarim: "text-yellow-700",
  eksik: "text-orange-700",
  sifir: "text-slate-500",
};

export const STATUS_BG_LIGHT: Record<StatusValue, string> = {
  tamam: "bg-emerald-50 border-emerald-200",
  yarim: "bg-yellow-50 border-yellow-200",
  eksik: "bg-orange-50 border-orange-200",
  sifir: "bg-slate-50 border-slate-200",
};

export const defaultEpisodeStatus = (): EpisodeStatus => ({
  ceviri: "sifir",
  sonKontrol: "sifir",
  sonOkuma: "sifir",
  dizgi: "sifir",
  encode: "sifir",
  yayin: "sifir",
});

export function calcEpisodeProgress(status: EpisodeStatus): number {
  const total = Object.values(status).reduce(
    (sum, s) => sum + STATUS_WEIGHTS[s as StatusValue],
    0
  );
  return Math.round(total / Object.keys(status).length);
}

export function calcSeriesProgress(
  episodes: Record<number, Episode>,
  episodeCount: number
): number {
  if (episodeCount === 0) return 0;
  let total = 0;
  for (let i = 1; i <= episodeCount; i++) {
    const ep = episodes[i];
    if (ep) total += calcEpisodeProgress(ep.status);
  }
  return Math.round(total / episodeCount);
}

export function progressColor(pct: number): string {
  if (pct === 100) return "text-emerald-600";
  if (pct >= 75) return "text-yellow-600";
  if (pct >= 40) return "text-orange-500";
  return "text-red-500";
}

export function progressBarColor(pct: number): string {
  if (pct === 100) return "bg-emerald-500";
  if (pct >= 75) return "bg-yellow-400";
  if (pct >= 40) return "bg-orange-400";
  return "bg-red-400";
}
