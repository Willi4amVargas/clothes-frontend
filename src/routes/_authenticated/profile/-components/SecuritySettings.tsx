import {
  ShieldCheckIcon,
  LaptopIcon,
  DeviceMobileCameraIcon,
  MapPinIcon,
} from "@phosphor-icons/react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export function SecuritySettings() {
  return (
    <Card className="w-full shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-bold text-slate-900">
          Security & Access
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h4 className="font-semibold text-slate-900">Password</h4>
            <p className="text-sm text-slate-500">Last updated 3 months ago</p>
          </div>
          <Button variant="outline" className="shrink-0">
            Change Password
          </Button>
        </div>

        <Separator />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="mt-1 p-2 bg-primary/10 rounded-full text-primary">
              <ShieldCheckIcon size={20} weight="fill" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 flex items-center gap-2">
                Two-Factor Authentication (2FA)
                <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-100">
                  Active
                </Badge>
              </h4>
              <p className="text-sm text-slate-500 mt-1 max-w-md">
                Add an extra layer of security to your account by requiring a
                verification code upon login.
              </p>
            </div>
          </div>
          <Button variant="outline" className="shrink-0">
            Manage
          </Button>
        </div>

        <Separator />

        <div className="space-y-4">
          <h4 className="font-semibold text-slate-900">Active Sessions</h4>
          <p className="text-sm text-slate-500">
            Manage the devices that are currently logged into your account.
          </p>

          <div className="space-y-3 mt-4">
            <div className="flex items-center justify-between p-4 rounded-lg border border-slate-200 bg-slate-50/50">
              <div className="flex items-center gap-4">
                <LaptopIcon size={24} className="text-slate-400" />
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    Chrome on Windows{" "}
                    <Badge
                      variant="secondary"
                      className="ml-2 text-[10px] py-0 px-1.5 h-4"
                    >
                      Current Session
                    </Badge>
                  </p>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                    <MapPinIcon size={12} />
                    <span>Bogotá, Colombia</span>
                    <span className="mx-1">•</span>
                    <span>192.168.1.45</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg border border-slate-200">
              <div className="flex items-center gap-4">
                <DeviceMobileCameraIcon size={24} className="text-slate-400" />
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    iPhone 14 Pro
                  </p>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                    <MapPinIcon size={12} />
                    <span>Medellín, Colombia</span>
                    <span className="mx-1">•</span>
                    <span>186.14.22.10</span>
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                className="text-red-600 hover:text-red-700 hover:bg-red-50 text-xs px-3 h-8"
              >
                Revoke
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
