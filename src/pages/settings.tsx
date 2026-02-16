import { Settings as SettingsIcon } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export function SettingsPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-white">Settings</h1>
        <p className="mt-1 text-muted-foreground">Profile, integrations, security, billing</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SettingsIcon className="h-5 w-5 text-primary" aria-hidden />
            Account & workspace
          </CardTitle>
          <CardDescription>Profile, integrations manager, 2FA, export & backup</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Settings options will appear here.</p>
        </CardContent>
      </Card>
    </div>
  )
}
