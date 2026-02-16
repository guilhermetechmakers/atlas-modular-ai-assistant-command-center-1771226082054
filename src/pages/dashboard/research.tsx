import { Link } from 'react-router-dom'
import { BookOpen } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export function ResearchPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-white">Research & knowledge base</h1>
        <p className="mt-1 text-muted-foreground">Notes, clips, summaries with citations</p>
      </div>
      <Card className="transition-all duration-200 hover:shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-purple" aria-hidden />
            Notes
          </CardTitle>
          <CardDescription>Save clips, summarize, and compare views. Open the full Knowledge Base for filters, tags, and AI summarization.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" asChild>
            <Link to="/dashboard/research-knowledge-base">Open Research & Knowledge Base</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
