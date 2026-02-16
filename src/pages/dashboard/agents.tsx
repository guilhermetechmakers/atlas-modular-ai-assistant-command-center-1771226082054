import { Bot } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export function AgentsPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-white">Agent builder & skills</h1>
        <p className="mt-1 text-muted-foreground">Create agents, manage skills, approval policies</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-purple" aria-hidden />
            Skill registry
          </CardTitle>
          <CardDescription>Create custom agents and allowlisted skills; test console</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline">Create agent</Button>
        </CardContent>
      </Card>
    </div>
  )
}
