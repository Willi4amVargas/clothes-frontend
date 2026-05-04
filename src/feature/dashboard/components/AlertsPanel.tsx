import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type AlertItem = {
  status: string;
  title: string;
  timestamp: string;
  detailA: string;
  detailB: string;
};

const alerts: AlertItem[] = [
  {
    status: "Low Stock",
    title: "SKU-89241 (Industrial Bearings)",
    timestamp: "10m ago",
    detailA: "Current stock: 12 units. Reorder point: 50 units.",
    detailB: "",
  },
  {
    status: "Overdue Receivable",
    title: "Acme Corp - INV-2023-089",
    timestamp: "1h ago",
    detailA: "Amount: $12,450.00. 15 days overdue.",
    detailB: "",
  },
  {
    status: "Overdue Receivable",
    title: "Globex Inc - INV-2023-072",
    timestamp: "3h ago",
    detailA: "Amount: $4,200.00. 30 days overdue.",
    detailB: "",
  },
];

export function AlertsPanel() {
  return (
    <Card className="h-full rounded-md border border-slate-200 bg-white py-0 ring-0">
      <CardHeader className="flex flex-row items-center justify-between border-b border-slate-200 px-4 py-3">
        <p className="text-sm font-semibold text-slate-900">Critical Alerts</p>
        <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-semibold text-red-700">
          4 New
        </span>
      </CardHeader>

      <CardContent className="space-y-3 px-4 py-4">
        {alerts.map((alert) => (
          <article
            key={alert.title}
            className="space-y-1 rounded-md border border-slate-200 bg-slate-50 p-3"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700">
                {alert.status}
              </span>
              <span className="text-[10px] text-slate-500">{alert.timestamp}</span>
            </div>
            <p className="text-xs font-semibold text-slate-900">{alert.title}</p>
            <p className="text-[11px] leading-relaxed text-slate-600">{alert.detailA}</p>
            {alert.detailB ? (
              <p className="text-[11px] leading-relaxed text-slate-600">{alert.detailB}</p>
            ) : null}
          </article>
        ))}

        <Button
          variant="link"
          className="h-auto px-0 text-xs font-semibold text-blue-700 hover:text-blue-600"
        >
          View All Alerts
        </Button>
      </CardContent>
    </Card>
  );
}
