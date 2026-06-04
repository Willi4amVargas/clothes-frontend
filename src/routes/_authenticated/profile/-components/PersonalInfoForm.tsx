import { useAuth } from "#/hook/useAuth";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function PersonalInfoForm() {
  const { user } = useAuth()
  return (
    <Card className="w-full shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-bold text-slate-900">Personal Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input id="fullName" defaultValue={user?.description} />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input id="email" type="email" defaultValue={user?.email} />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input id="phone" type="tel" defaultValue={user?.email} />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="empId">Employee ID</Label>
            <Input id="empId" defaultValue={user?.code} disabled className="bg-slate-50 text-slate-500 font-mono" />
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
