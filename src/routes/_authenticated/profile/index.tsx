import { createFileRoute } from '@tanstack/react-router'
import { UserPermissions } from './-components/UserPermissions'
import { ProfileHeader } from './-components/ProfileHeader'
import { PersonalInfoForm } from './-components/PersonalInfoForm'
import { SecuritySettings } from './-components/SecuritySettings'

export const Route = createFileRoute('/_authenticated/profile/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="flex flex-col h-full bg-slate-50 overflow-y-auto">
      <div className="p-6 pb-20 max-w-7xl mx-auto w-full space-y-6">
        <ProfileHeader />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-8 space-y-6">
            <PersonalInfoForm />
            <SecuritySettings />
          </div>

          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-semibold text-slate-900">Preferences</h3>
              <div className="space-y-4">
                {/* Note: Checkbox primitive is missing, using Switch as an alternative */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 block">
                    System Language
                  </label>
                  <select className="w-full h-9 rounded-md border border-slate-200 bg-white px-3 text-sm">
                    <option>English (US)</option>
                    <option>Spanish (ES)</option>
                    <option>French (FR)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 block">
                    Timezone
                  </label>
                  <select className="w-full h-9 rounded-md border border-slate-200 bg-white px-3 text-sm">
                    <option>UTC-05:00 Eastern Time (US & Canada)</option>
                    <option>UTC+00:00 Greenwich Mean Time</option>
                  </select>
                </div>

                <div className="pt-2 border-t border-slate-100 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-700">
                      Email Notifications
                    </span>
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
                      defaultChecked
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-700">
                      Desktop Push Alerts
                    </span>
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
                      defaultChecked
                    />
                  </div>
                </div>
              </div>
            </div>

            <UserPermissions />
          </div>
        </div>
      </div>
    </div>
  )
}
