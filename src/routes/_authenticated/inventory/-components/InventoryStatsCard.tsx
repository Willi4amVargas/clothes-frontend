import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export type TrendTone = "positive" | "negative" | "neutral";

export interface InventoryStatsCardProps {
  title: string;
  value: string;
  trendLabel: string;
  trendTone: TrendTone;
}

export function InventoryStatsCard({
  title,
  value,
  trendLabel,
  trendTone,
}: InventoryStatsCardProps) {
  const toneStyles = {
    positive: "text-emerald-600 border-l-transparent",
    negative: "text-red-600 border-l-red-600",
    neutral: "text-slate-900 border-l-transparent",
  };

  return (
    <Card className={cn(
      "relative overflow-hidden border-l-4 transition-all",
      toneStyles[trendTone]
    )}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className={cn("text-3xl font-bold tracking-tight", toneStyles[trendTone])}>
          {value}
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          <span className="font-medium">{trendLabel}</span>
        </p>
      </CardContent>
    </Card>
  );
}