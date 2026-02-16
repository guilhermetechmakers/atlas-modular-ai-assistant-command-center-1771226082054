import { FileText } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export function ContentPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-white">Content pipeline</h1>
        <p className="mt-1 text-muted-foreground">Ideas → drafts → schedule → publish</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-cyan" aria-hidden />
            Ideas & drafts
          </CardTitle>
          <CardDescription>Add ideas, edit drafts, and use the repurpose tool</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline">Add idea</Button>
        </CardContent>
      </Card>
    </div>
  )
}
