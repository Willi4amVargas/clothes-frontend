import { Briefcase, Camera, PencilSimple } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export function ProfileHeader() {
  return (
    <Card className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 gap-6">
      <div className="flex items-center gap-6">
        <div className="relative group cursor-pointer">
          <div className="w-20 h-20 rounded-full bg-slate-200 border-2 border-white shadow-sm flex items-center justify-center text-slate-500 overflow-hidden">
            <Camera size={32} weight="fill" className="text-slate-400 group-hover:opacity-0 transition-opacity" />
            <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <PencilSimple size={24} weight="bold" className="text-white" />
            </div>
          </div>
        </div>
        
        <div className="space-y-1.5">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-slate-900">Carlos Rodríguez</h2>
            <Badge variant="secondary" className="bg-primary/10 text-primary border-transparent hover:bg-primary/20">
              Senior Administrator
            </Badge>
          </div>
          <div className="flex items-center gap-1.5 text-sm text-slate-500 font-medium">
            <Briefcase size={16} weight="fill" />
            <span>Finance & Operations</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 w-full sm:w-auto">
        <Button variant="outline" className="w-full sm:w-auto">
          Discard Changes
        </Button>
        <Button className="w-full sm:w-auto">
          Save Profile
        </Button>
      </div>
    </Card>
  );
}
