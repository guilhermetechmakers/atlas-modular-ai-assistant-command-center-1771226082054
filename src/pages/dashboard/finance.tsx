import { Wallet } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export function FinancePage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-white">Finance cockpit</h1>
        <p className="mt-1 text-muted-foreground">Transactions, invoices, budget & runway</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5 text-amber" aria-hidden />
            Ledger
          </CardTitle>
          <CardDescription>Import CSV or add transactions; AI finance tools for summaries</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline">Import CSV</Button>
        </CardContent>
      </Card>
    </div>
  )
}
