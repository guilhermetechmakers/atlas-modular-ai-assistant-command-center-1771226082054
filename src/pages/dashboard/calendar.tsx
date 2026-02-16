import { Calendar as CalendarIcon } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export function CalendarPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-white">Calendar & travel</h1>
        <p className="mt-1 text-muted-foreground">Day / week / month view, tasks, trip board</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-primary" aria-hidden />
            Calendar
          </CardTitle>
          <CardDescription>Connect Google Calendar for events and focus blocks</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline">Connect Google Calendar</Button>
        </CardContent>
      </Card>
    </div>
  )
}
