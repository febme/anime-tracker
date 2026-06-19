import { StatusValue, STATUS_LABELS, STATUS_COLORS } from "../types";

const ALL_STATUSES: StatusValue[] = ["tamam", "yarim", "eksik", "sifir"];

interface Props {
  value: StatusValue;
  onChange?: (val: StatusValue) => void;
  readonly?: boolean;
}

const DOT_COLORS: Record<StatusValue, string> = {
  tamam: "bg-emerald-400",
  yarim: "bg-yellow-400",
  eksik: "bg-orange-400",
  sifir: "bg-slate-400",
};

const BADGE_STYLE: Record<StatusValue, string> = {
  tamam: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  yarim: "bg-yellow-500/15 text-yellow-300 border-yellow-500/30",
  eksik: "bg-orange-500/15 text-orange-300 border-orange-500/30",
  sifir: "bg-slate-500/15 text-slate-400 border-slate-500/30",
};

export default function StatusBadge({ value, onChange, readonly }: Props) {
  if (readonly) {
    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg border text-xs font-medium ${BADGE_STYLE[value]}`}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${DOT_COLORS[value]}`} />
        {STATUS_LABELS[value]}
      </span>
    );
  }

  return (
    <div className="relative group">
      <button
        className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg border text-xs font-medium cursor-pointer hover:opacity-80 transition ${BADGE_STYLE[value]}`}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${DOT_COLORS[value]}`} />
        {STATUS_LABELS[value]}
      </button>
      {/* Dropdown */}
      <div className="absolute z-30 top-full mt-1 left-0 bg-slate-800 border border-white/10 rounded-xl shadow-2xl p-1 hidden group-hover:block min-w-[100px]">
        {ALL_STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => onChange?.(s)}
            className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs hover:bg-white/10 transition ${
              s === value ? "opacity-100 font-semibold" : "opacity-70"
            }`}
          >
            <span className={`w-2 h-2 rounded-full flex-shrink-0 ${STATUS_COLORS[s]}`} />
            <span className="text-white">{STATUS_LABELS[s]}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
