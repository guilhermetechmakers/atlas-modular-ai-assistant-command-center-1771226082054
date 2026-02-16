import { Link } from 'react-router-dom'
import { FolderGit2, ArrowRight } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export function ProjectsPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-white">Projects</h1>
        <p className="mt-1 text-muted-foreground">GitHub repos, issues, and roadmaps</p>
      </div>
      <Card className="transition-all duration-200 hover:shadow-card-hover">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FolderGit2 className="h-5 w-5 text-primary" aria-hidden />
            Repo explorer
          </CardTitle>
          <CardDescription>Connect GitHub to see repos, activity feed, and create issues</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button variant="outline" asChild>
            <Link to="/dashboard/projects-github" className="inline-flex items-center gap-2">
              Review project status & issues
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </Button>
          <Button variant="outline">Connect GitHub</Button>
        </CardContent>
      </Card>
    </div>
  )
}
