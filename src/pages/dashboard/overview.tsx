import { Link } from 'react-router-dom'
import { Search, FolderGit2, FileText, Wallet, Bot, ClipboardList } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'

export function DashboardOverview() {
  const isLoading = false

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-white">Command center</h1>
        <p className="mt-1 text-muted-foreground">Your daily summary and quick actions</p>
      </div>

      {/* Global search omnibox */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground pointer-events-none" aria-hidden />
        <Input
          type="search"
          placeholder="Search repos, notes, events, transactions..."
          className="h-12 pl-12 pr-4 text-base rounded-xl border-border bg-panel focus:border-primary"
          aria-label="Global search"
        />
      </div>

      {/* Today panel + cards grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Today</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/dashboard/calendar">View calendar</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-3/4" />
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">No events today. Ask the Personal agent: &quot;What should I do today?&quot;</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <FolderGit2 className="h-5 w-5 text-primary" aria-hidden />
              GitHub
            </CardTitle>
            <CardDescription>Repo summary</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-20 w-full" />
            ) : (
              <p className="text-sm text-muted-foreground">Connect GitHub to see your repos and issues.</p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="transition-all duration-200 hover:shadow-card-hover">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <FileText className="h-4 w-4 text-cyan" aria-hidden />
              Content pipeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">Ideas → drafts → schedule</p>
            <Button variant="outline" size="sm" asChild>
              <Link to="/dashboard/content">Open</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="transition-all duration-200 hover:shadow-card-hover">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Wallet className="h-4 w-4 text-amber" aria-hidden />
              Finance snapshot
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">Ledger and runway</p>
            <Button variant="outline" size="sm" asChild>
              <Link to="/dashboard/finance">Open</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="transition-all duration-200 hover:shadow-card-hover sm:col-span-2 lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Bot className="h-4 w-4 text-purple" aria-hidden />
              Agent activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">Recent agent suggestions</p>
            <Button variant="outline" size="sm" asChild>
              <Link to="/dashboard/agents">View agents</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <Button size="sm" variant="outline" asChild>
          <Link to="/dashboard/projects" className="inline-flex items-center gap-2">
            <ClipboardList className="h-4 w-4" /> Audit log
          </Link>
        </Button>
      </div>
    </div>
  )
}
