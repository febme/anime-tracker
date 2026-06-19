import { progressBarColor, progressColor } from "../types";

interface Props {
  value: number; // 0-100
  showLabel?: boolean;
  size?: "sm" | "md";
}

export default function ProgressBar({ value, showLabel = true, size = "md" }: Props) {
  const barH = size === "sm" ? "h-1.5" : "h-2";
  return (
    <div className="flex items-center gap-2 min-w-[80px]">
      <div className={`flex-1 bg-white/10 rounded-full overflow-hidden ${barH}`}>
        <div
          className={`${barH} rounded-full transition-all duration-500 ${progressBarColor(value)}`}
          style={{ width: `${value}%` }}
        />
      </div>
      {showLabel && (
        <span className={`text-xs font-bold tabular-nums w-9 text-right ${progressColor(value)}`}>
          %{value}
        </span>
      )}
    </div>
  );
}
