import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { ElementType } from "react";

type TrendTone = "positive" | "negative" | "neutral";

type StatCardProps = {
  title: string;
  value: string;
  trendLabel: string;
  icon: ElementType;
  trendTone: TrendTone;
};

export function StatCard({
  title,
  value,
  trendLabel,
  icon: Icon,
  trendTone,
}: StatCardProps) {
  const trendClass =
    trendTone === "positive"
      ? "text-emerald-600"
      : trendTone === "negative"
        ? "text-red-600"
        : "text-slate-500";

  return (
    <Card className="gap-0 rounded-md border border-slate-200 bg-white py-0 ring-0">
      <CardHeader className="flex flex-row items-center justify-between px-4 pt-4 pb-2">
        <p className="text-[11px] font-semibold tracking-wide text-slate-500 uppercase">
          {title}
        </p>
        <Icon size={16} className="text-slate-400" />
      </CardHeader>

      <CardContent className="px-4 pb-4">
        <p className="text-[34px] leading-none font-semibold text-slate-900">{value}</p>
        <p className={`mt-2 text-xs font-medium ${trendClass}`}>{trendLabel}</p>
      </CardContent>
    </Card>
  );
}
