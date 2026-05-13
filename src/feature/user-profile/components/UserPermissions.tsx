import { CheckCircle, Info } from "@phosphor-icons/react";
import { Badge } from "@/components/ui/badge";

export function UserPermissions() {
  return (
    <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-slate-900">Module Permissions</h3>
        <Info size={16} className="text-slate-400" />
      </div>
      
      <p className="text-sm text-slate-500">
        Your current access levels for system modules. Contact your administrator to request changes.
      </p>

      <div className="space-y-4 pt-2">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-700">Purchases</span>
            <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-100">Full Access</Badge>
          </div>
          <div className="bg-slate-50 rounded p-3 space-y-2 border border-slate-100">
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <CheckCircle size={14} className="text-emerald-500" weight="fill" />
              <span>Create Purchase Orders</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <CheckCircle size={14} className="text-emerald-500" weight="fill" />
              <span>Approve Invoices</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <CheckCircle size={14} className="text-emerald-500" weight="fill" />
              <span>Manage Vendors</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <span className="text-sm font-medium text-slate-700">Inventory</span>
          <Badge className="bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-100">Read Only</Badge>
        </div>

        <div className="flex items-center justify-between pt-2">
          <span className="text-sm font-medium text-slate-700">Sales</span>
          <Badge className="bg-red-100 text-red-800 border-red-200 hover:bg-red-100">Restricted</Badge>
        </div>
      </div>
    </div>
  );
}
