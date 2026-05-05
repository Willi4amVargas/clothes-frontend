import {
  FileIcon,
  PercentIcon,
  ShoppingCartSimpleIcon,
  TrendUpIcon,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { AlertsPanel } from "@/feature/dashboard/components/AlertsPanel";
import { SalesChartPlaceholder } from "@/feature/dashboard/components/SalesChartPlaceholder";
import { StatCard } from "@/feature/dashboard/components/StatCard";
import { useNavigate } from "react-router";

export function DashboardPage() {
  const navigate = useNavigate();
  return (
    <main className="flex-1 mx-5">
      <section className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Executive Overview
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Real-time performance metrics and critical alerts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="h-8 rounded-md border-slate-200 bg-white px-3 text-xs text-slate-700 hover:bg-slate-50"
            onClick={() => navigate("/clients/new")}
          >
            Register Client
          </Button>
          <Button
            variant="outline"
            className="h-8 rounded-md border-slate-200 bg-white px-3 text-xs text-slate-700 hover:bg-slate-50"
            onClick={() => navigate("/inventory/new")}
          >
            Add Inventory
          </Button>
          <Button className="h-8 bg-primary/70 px-3 text-xs font-medium text-white hover:bg-primary/60" onClick={() => navigate("/sales")}>
            New Sale
          </Button>
        </div>
      </section>

      <section className="mt-5 grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-4">
            <StatCard
              title="Today's Sales"
              value="$42,850.00"
              trendLabel="+ 12.5% vs yesterday"
              icon={TrendUpIcon}
              trendTone="positive"
            />
            <StatCard
              title="Purchases (Today)"
              value="$18,240.50"
              trendLabel="+ 4.2% vs yesterday"
              icon={ShoppingCartSimpleIcon}
              trendTone="negative"
            />
            <StatCard
              title="Gross Margin"
              value="57.4%"
              trendLabel="+ 1.1% vs last week"
              icon={PercentIcon}
              trendTone="positive"
            />
            <StatCard
              title="Pending Orders"
              value="142"
              trendLabel="No change"
              icon={FileIcon}
              trendTone="neutral"
            />
          </div>

          <SalesChartPlaceholder />
        </div>

        <AlertsPanel />
      </section>
    </main>
  );
}
