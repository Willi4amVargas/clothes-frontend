import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function PersonalInfoForm() {
  return (
    <Card className="w-full shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-bold text-slate-900">Personal Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input id="fullName" defaultValue="Carlos Rodríguez" />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input id="email" type="email" defaultValue="carlos.rodriguez@enterprise.com" />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input id="phone" type="tel" defaultValue="+1 (555) 123-4567" />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="empId">Employee ID</Label>
            <Input id="empId" defaultValue="EMP-8472-X" disabled className="bg-slate-50 text-slate-500 font-mono" />
          </div>

          <div className="md:col-span-2 space-y-2">
            <Label htmlFor="position">Current Position</Label>
            <Input id="position" defaultValue="Senior Administrator, Finance & Operations" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
