import { Card, CardContent, CardHeader } from "@/components/ui/card";

const dayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const salesHeights = [68, 92, 50, 104, 86, 62, 50];
const purchasesHeights = [46, 52, 68, 56, 36, 44, 32];

export function SalesChartPlaceholder() {
  return (
    <Card className="rounded-md border border-slate-200 bg-white py-0 ring-0">
      <CardHeader className="flex flex-row items-center justify-between border-b border-slate-200 px-4 py-3">
        <p className="text-sm font-semibold text-slate-900">Sales vs Purchases (7 Days)</p>
        <button type="button" className="text-base leading-none text-slate-500">
          ⋮
        </button>
      </CardHeader>

      <CardContent className="space-y-4 px-4 py-4">
        <div className="h-64 rounded-md border border-slate-100 bg-slate-50/30 px-2 pt-3 pb-2">
          <div className="flex h-full items-end justify-between gap-3">
            {dayLabels.map((day, index) => (
              <div key={day} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
                <div className="flex h-31.25 items-end gap-2">
                  <div
                    className="w-4 rounded-t-sm bg-blue-900"
                    style={{ height: `${salesHeights[index]}px` }}
                  />
                  <div
                    className="w-4 rounded-t-sm bg-blue-200"
                    style={{ height: `${purchasesHeights[index]}px` }}
                  />
                </div>
                <p className="text-[11px] text-slate-500">{day}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-center gap-5 text-[11px] text-slate-500">
          <LegendDot className="bg-blue-900" label="Sales" />
          <LegendDot className="bg-blue-200" label="Purchases" />
        </div>
      </CardContent>
    </Card>
  );
}

function LegendDot({ className, label }: { className: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className={`h-2 w-2 rounded-full ${className}`} />
      <span>{label}</span>
    </div>
  );
}
